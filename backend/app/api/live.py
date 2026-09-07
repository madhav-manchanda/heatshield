from datetime import datetime
from zoneinfo import ZoneInfo

import httpx
from fastapi import APIRouter, HTTPException, Query

from app.services.thermal.engine import heat_index_celsius, thermal_score, composite_risk, risk_level

router = APIRouter(prefix="/api/live", tags=["Live Data"])

IST = ZoneInfo("Asia/Kolkata")
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

LOCATIONS = [
    {"id": 1, "name": "Central Delhi", "district": "Central Delhi", "latitude": 28.6448, "longitude": 77.2167, "exposure": 82, "vulnerability": 76, "infrastructure": 32},
    {"id": 2, "name": "South Delhi", "district": "South Delhi", "latitude": 28.5244, "longitude": 77.1855, "exposure": 70, "vulnerability": 68, "infrastructure": 54},
    {"id": 3, "name": "East Delhi", "district": "East Delhi", "latitude": 28.6280, "longitude": 77.2950, "exposure": 78, "vulnerability": 81, "infrastructure": 38},
    {"id": 4, "name": "West Delhi", "district": "West Delhi", "latitude": 28.6517, "longitude": 77.1095, "exposure": 65, "vulnerability": 59, "infrastructure": 61},
    {"id": 5, "name": "North Delhi", "district": "North Delhi", "latitude": 28.7041, "longitude": 77.1025, "exposure": 75, "vulnerability": 72, "infrastructure": 44},
]

FACILITIES = [
    {"id": 1, "name": "Civic Cooling Centre — Central", "type": "cooling_center", "latitude": 28.6448, "longitude": 77.2167, "capacity": 250},
    {"id": 2, "name": "Community Relief Centre — South", "type": "community_center", "latitude": 28.5244, "longitude": 77.1855, "capacity": 180},
    {"id": 3, "name": "Cooling Centre — East", "type": "cooling_center", "latitude": 28.6280, "longitude": 77.2950, "capacity": 220},
    {"id": 4, "name": "Community Centre — West", "type": "community_center", "latitude": 28.6517, "longitude": 77.1095, "capacity": 140},
]


async def fetch_weather(location: dict) -> dict:
    params = {
        "latitude": location["latitude"],
        "longitude": location["longitude"],
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m",
        "hourly": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m",
        "timezone": "Asia/Kolkata",
        "forecast_days": 5,
        "temperature_unit": "celsius",
        "wind_speed_unit": "kmh",
    }
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.get(OPEN_METEO_URL, params=params)
            response.raise_for_status()
            return response.json()
    except (httpx.HTTPError, httpx.TimeoutException) as exc:
        raise HTTPException(503, f"Live weather provider unavailable: {exc.__class__.__name__}") from exc


def build_risk(location: dict, temperature: float, humidity: float) -> dict:
    heat_index = heat_index_celsius(temperature, humidity)
    thermal = thermal_score(heat_index)
    final = composite_risk(thermal, location["exposure"], location["vulnerability"], location["infrastructure"])
    return {
        "heat_index": heat_index,
        "thermal_score": thermal,
        "exposure_score": location["exposure"],
        "vulnerability_score": location["vulnerability"],
        "infrastructure_score": location["infrastructure"],
        "final_score": final,
        "risk_level": risk_level(final),
    }


def location_public(location: dict) -> dict:
    return {k: location[k] for k in ("id", "name", "district", "latitude", "longitude")}


def make_forecast(data: dict, location: dict) -> list[dict]:
    hourly = data.get("hourly", {})
    times = hourly.get("time", [])
    temperatures = hourly.get("temperature_2m", [])
    humidity = hourly.get("relative_humidity_2m", [])
    apparent = hourly.get("apparent_temperature", [])
    wind = hourly.get("wind_speed_10m", [])
    result = []
    for index, timestamp in enumerate(times):
        if index >= len(temperatures):
            break
        t = temperatures[index]
        h = humidity[index] if index < len(humidity) else 50
        a = apparent[index] if index < len(apparent) else t
        w = wind[index] if index < len(wind) else 0
        result.append({"timestamp": timestamp, "temperature": t, "humidity": h, "apparent_temperature": a, "wind_speed": w, **build_risk(location, t, h)})
    return result


@router.get("/overview")
async def live_overview(location_id: int = Query(1, ge=1)):
    location = next((item for item in LOCATIONS if item["id"] == location_id), None)
    if not location:
        raise HTTPException(404, "Live location not found")
    data = await fetch_weather(location)
    current = data["current"]
    risk = build_risk(location, current["temperature_2m"], current["relative_humidity_2m"])
    forecast = make_forecast(data, location)
    now = datetime.now(IST).strftime("%Y-%m-%dT%H:%M")
    upcoming = [item for item in forecast if item["timestamp"] >= now]
    peak = max(upcoming[:24] or forecast[:24], key=lambda item: item["final_score"])
    return {
        "source": "Open-Meteo",
        "updated_at": current.get("time"),
        "timezone": data.get("timezone", "Asia/Kolkata"),
        "location": location_public(location),
        "current": {"temperature": current["temperature_2m"], "humidity": current["relative_humidity_2m"], "apparent_temperature": current["apparent_temperature"], "wind_speed": current["wind_speed_10m"], **risk},
        "peak": peak,
        "forecast": forecast[:120],
    }


@router.get("/risk-map")
async def live_risk_map():
    results = []
    for location in LOCATIONS:
        data = await fetch_weather(location)
        current = data["current"]
        results.append({
            "location": location_public(location),
            "weather": {"temperature": current["temperature_2m"], "humidity": current["relative_humidity_2m"], "apparent_temperature": current["apparent_temperature"], "wind_speed": current["wind_speed_10m"]},
            "risk": build_risk(location, current["temperature_2m"], current["relative_humidity_2m"]),
        })
    return {"source": "Open-Meteo", "updated_at": datetime.now(IST).isoformat(), "locations": results}


@router.get("/facilities")
async def live_facilities():
    risk_map = await live_risk_map()
    risk_by_id = {item["location"]["id"]: item["risk"]["final_score"] for item in risk_map["locations"]}
    result = []
    for facility in FACILITIES:
        linked = min(LOCATIONS, key=lambda x: (x["latitude"] - facility["latitude"]) ** 2 + (x["longitude"] - facility["longitude"]) ** 2)
        risk = risk_by_id[linked["id"]]
        utilization = min(100, max(35, round(42 + risk * 0.45)))
        occupancy = round(facility["capacity"] * utilization / 100)
        result.append({**facility, "occupancy": occupancy, "available": facility["capacity"] - occupancy, "status": "full" if occupancy >= facility["capacity"] else "available", "linked_risk": risk})
    return {"source": "HeatShield live risk model", "updated_at": datetime.now(IST).isoformat(), "facilities": result}


@router.get("/alerts")
async def live_alerts():
    overview = await live_overview(1)
    current = overview["current"]
    alerts = []
    if current["final_score"] >= 80:
        severity = "extreme"
    elif current["final_score"] >= 60:
        severity = "high"
    elif current["final_score"] >= 35:
        severity = "moderate"
    else:
        severity = "low"
    alerts.append({"id": "live-1", "severity": severity, "active": True, "created_at": overview["updated_at"], "location": overview["location"]["name"], "message": f"Live heat risk is {severity} in {overview['location']['name']} with a composite score of {current['final_score']}/100."})
    peak = overview["peak"]
    alerts.append({"id": "peak-1", "severity": risk_level(peak["final_score"]), "active": True, "created_at": peak["timestamp"], "location": overview["location"]["name"], "message": f"Forecast peak risk reaches {peak['final_score']}/100 at {peak['timestamp']} IST."})
    return {"source": "Open-Meteo + HeatShield model", "alerts": alerts}


@router.get("/responders")
async def live_responders():
    risk_map = await live_risk_map()
    ranked = sorted(risk_map["locations"], key=lambda item: item["risk"]["final_score"], reverse=True)
    priorities = []
    for rank, item in enumerate(ranked, 1):
        score = item["risk"]["final_score"]
        priorities.append({"priority": rank, "location": item["location"], "score": score, "risk_level": item["risk"]["risk_level"], "action": "Immediate field dispatch" if score >= 70 else "Stage response team" if score >= 50 else "Routine monitoring"})
    return {"source": "Open-Meteo + HeatShield model", "updated_at": datetime.now(IST).isoformat(), "priorities": priorities}


@router.get("/interventions")
async def live_interventions(location_id: int = Query(1, ge=1), shade: bool = False, water: bool = False, cooling: bool = False):
    location = next((item for item in LOCATIONS if item["id"] == location_id), None)
    if not location:
        raise HTTPException(404, "Live location not found")
    data = await fetch_weather(location)
    current = data["current"]
    base = build_risk(location, current["temperature_2m"], current["relative_humidity_2m"])
    reduction = (8 if shade else 0) + (6 if water else 0) + (12 if cooling else 0)
    projected = round(max(0, base["final_score"] - reduction), 1)
    return {"location": location_public(location), "baseline": base, "interventions": {"shade": shade, "water": water, "cooling": cooling}, "projected_score": projected, "projected_level": risk_level(projected), "estimated_reduction": round(base["final_score"] - projected, 1)}


@router.get("/locations")
def live_locations():
    return [location_public(item) for item in LOCATIONS]

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


async def fetch_weather(location: dict) -> dict:
    params = {
        "latitude": location["latitude"],
        "longitude": location["longitude"],
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m",
        "hourly": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m",
        "timezone": "Asia/Kolkata",
        "forecast_days": 3,
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
    final = composite_risk(
        thermal,
        location["exposure"],
        location["vulnerability"],
        location["infrastructure"],
    )
    return {
        "heat_index": heat_index,
        "thermal_score": thermal,
        "exposure_score": location["exposure"],
        "vulnerability_score": location["vulnerability"],
        "infrastructure_score": location["infrastructure"],
        "final_score": final,
        "risk_level": risk_level(final),
    }


@router.get("/overview")
async def live_overview(location_id: int = Query(1, ge=1)):
    location = next((item for item in LOCATIONS if item["id"] == location_id), None)
    if not location:
        raise HTTPException(404, "Live location not found")

    data = await fetch_weather(location)
    current = data["current"]
    risk = build_risk(location, current["temperature_2m"], current["relative_humidity_2m"])

    hourly = data.get("hourly", {})
    times = hourly.get("time", [])
    temperatures = hourly.get("temperature_2m", [])
    humidity = hourly.get("relative_humidity_2m", [])
    apparent = hourly.get("apparent_temperature", [])
    wind = hourly.get("wind_speed_10m", [])

    forecast = []
    for index, timestamp in enumerate(times):
        if index >= len(temperatures):
            break
        h = humidity[index] if index < len(humidity) else current["relative_humidity_2m"]
        a = apparent[index] if index < len(apparent) else temperatures[index]
        w = wind[index] if index < len(wind) else current["wind_speed_10m"]
        item_risk = build_risk(location, temperatures[index], h)
        forecast.append({
            "timestamp": timestamp,
            "temperature": temperatures[index],
            "humidity": h,
            "apparent_temperature": a,
            "wind_speed": w,
            **item_risk,
        })

    now = datetime.now(IST)
    upcoming = [item for item in forecast if item["timestamp"] >= now.strftime("%Y-%m-%dT%H:%M")]
    peak = max(upcoming[:24] or forecast[:24], key=lambda item: item["final_score"])

    return {
        "source": "Open-Meteo",
        "updated_at": current.get("time"),
        "timezone": data.get("timezone", "Asia/Kolkata"),
        "location": {k: location[k] for k in ("id", "name", "district", "latitude", "longitude")},
        "current": {
            "temperature": current["temperature_2m"],
            "humidity": current["relative_humidity_2m"],
            "apparent_temperature": current["apparent_temperature"],
            "wind_speed": current["wind_speed_10m"],
            **risk,
        },
        "peak": peak,
        "forecast": forecast[:72],
    }


@router.get("/risk-map")
async def live_risk_map():
    results = []
    for location in LOCATIONS:
        data = await fetch_weather(location)
        current = data["current"]
        results.append({
            "location": {k: location[k] for k in ("id", "name", "district", "latitude", "longitude")},
            "weather": {
                "temperature": current["temperature_2m"],
                "humidity": current["relative_humidity_2m"],
                "apparent_temperature": current["apparent_temperature"],
                "wind_speed": current["wind_speed_10m"],
            },
            "risk": build_risk(location, current["temperature_2m"], current["relative_humidity_2m"]),
        })
    return {"source": "Open-Meteo", "updated_at": datetime.now(IST).isoformat(), "locations": results}


@router.get("/locations")
def live_locations():
    return [{k: item[k] for k in ("id", "name", "district", "latitude", "longitude")} for item in LOCATIONS]

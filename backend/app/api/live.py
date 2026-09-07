from datetime import datetime
from math import asin, cos, radians, sin, sqrt
from zoneinfo import ZoneInfo

import httpx
from fastapi import APIRouter, HTTPException, Query

from app.services.thermal.engine import heat_index_celsius, risk_level, thermal_score

router = APIRouter(prefix="/api/live", tags=["Live Data"])

IST = ZoneInfo("Asia/Kolkata")
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

# Real Delhi geographic reference points. No invented social/infrastructure
# scores are attached; until authoritative spatial datasets are connected,
# HeatShield reports thermal risk only.
LOCATIONS = [
    {"id": 1, "name": "Central Delhi", "district": "Central Delhi", "latitude": 28.6448, "longitude": 77.2167, "location_type": "weather_reference_point"},
    {"id": 2, "name": "South Delhi", "district": "South Delhi", "latitude": 28.5244, "longitude": 77.1855, "location_type": "weather_reference_point"},
    {"id": 3, "name": "East Delhi", "district": "East Delhi", "latitude": 28.6280, "longitude": 77.2950, "location_type": "weather_reference_point"},
    {"id": 4, "name": "West Delhi", "district": "West Delhi", "latitude": 28.6517, "longitude": 77.1095, "location_type": "weather_reference_point"},
    {"id": 5, "name": "North Delhi", "district": "North Delhi", "latitude": 28.7041, "longitude": 77.1025, "location_type": "weather_reference_point"},
]

# Real fixed cooling zones publicly reported during Delhi's 2026 heat-relief
# operation. Delhi Government reporting states cooling zones provide seating
# for 100 people. Occupancy/open-closed status is not published as a live feed,
# so HeatShield does not fabricate it.
FACILITIES = [
    {"id": 1, "name": "Cooling Zone — GTB Hospital Gate 3", "type": "cooling_zone", "latitude": 28.6883, "longitude": 77.3090, "capacity": 100, "occupancy": None, "status": "publicly_reported_live_status_unavailable", "verification_date": "2026-06-09", "source": "Delhi Government 2026 heat-relief reporting", "source_url": "https://rekhagupta.in/governance"},
    {"id": 2, "name": "Cooling Zone — Jama Masjid Metro Gate 3", "type": "cooling_zone", "latitude": 28.6508, "longitude": 77.2335, "capacity": 100, "occupancy": None, "status": "publicly_reported_live_status_unavailable", "verification_date": "2026-06-09", "source": "Delhi Government 2026 heat-relief reporting", "source_url": "https://rekhagupta.in/governance"},
    {"id": 3, "name": "Cooling Zone — Shalimar Chowk", "type": "cooling_zone", "latitude": 28.7034, "longitude": 77.1570, "capacity": 100, "occupancy": None, "status": "publicly_reported_live_status_unavailable", "verification_date": "2026-06-09", "source": "Delhi Government 2026 heat-relief reporting", "source_url": "https://rekhagupta.in/governance"},
    {"id": 4, "name": "Cooling Zone — Kalkaji / Lotus Temple", "type": "cooling_zone", "latitude": 28.5535, "longitude": 77.2588, "capacity": 100, "occupancy": None, "status": "publicly_reported_live_status_unavailable", "verification_date": "2026-06-09", "source": "Delhi Government 2026 heat-relief reporting", "source_url": "https://rekhagupta.in/governance"},
]


def location_public(location: dict) -> dict:
    keys = ("id", "name", "district", "latitude", "longitude", "location_type")
    return {key: location[key] for key in keys if key in location}


async def fetch_weather(location: dict, *, auto_timezone: bool = False) -> dict:
    params = {"latitude": location["latitude"], "longitude": location["longitude"], "current": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m", "hourly": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m", "timezone": "auto" if auto_timezone else "Asia/Kolkata", "forecast_days": 5, "temperature_unit": "celsius", "wind_speed_unit": "kmh"}
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.get(OPEN_METEO_URL, params=params)
            response.raise_for_status()
            return response.json()
    except (httpx.HTTPError, httpx.TimeoutException) as exc:
        raise HTTPException(503, f"Live weather provider unavailable: {exc.__class__.__name__}") from exc


async def fetch_weather_points(points: list[dict]) -> list[dict]:
    if not points:
        return []
    params = {"latitude": ",".join(str(point["latitude"]) for point in points), "longitude": ",".join(str(point["longitude"]) for point in points), "current": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m", "timezone": "Asia/Kolkata", "temperature_unit": "celsius", "wind_speed_unit": "kmh"}
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(OPEN_METEO_URL, params=params)
            response.raise_for_status()
            payload = response.json()
            return payload if isinstance(payload, list) else [payload]
    except (httpx.HTTPError, httpx.TimeoutException) as exc:
        raise HTTPException(503, f"Live spatial weather provider unavailable: {exc.__class__.__name__}") from exc


def build_environmental_risk(temperature: float, humidity: float) -> dict:
    heat_index = heat_index_celsius(temperature, humidity)
    thermal = thermal_score(heat_index)
    return {"heat_index": heat_index, "thermal_score": thermal, "exposure_score": None, "vulnerability_score": None, "infrastructure_score": None, "final_score": thermal, "risk_level": risk_level(thermal), "risk_basis": "thermal_only", "data_completeness": "weather_only"}


def build_risk(location: dict, temperature: float, humidity: float) -> dict:
    return build_environmental_risk(temperature, humidity)


def make_forecast(data: dict) -> list[dict]:
    hourly = data.get("hourly", {})
    times = hourly.get("time", [])
    temperatures = hourly.get("temperature_2m", [])
    humidity = hourly.get("relative_humidity_2m", [])
    apparent = hourly.get("apparent_temperature", [])
    wind = hourly.get("wind_speed_10m", [])
    result = []
    for index, timestamp in enumerate(times):
        if index >= len(temperatures) or index >= len(humidity):
            break
        result.append({"timestamp": timestamp, "temperature": temperatures[index], "humidity": humidity[index], "apparent_temperature": apparent[index] if index < len(apparent) else None, "wind_speed": wind[index] if index < len(wind) else None, **build_environmental_risk(temperatures[index], humidity[index])})
    return result


def nearest_facility(latitude: float, longitude: float) -> tuple[dict, float]:
    def haversine_km(a_lat: float, a_lon: float, b_lat: float, b_lon: float) -> float:
        earth_radius = 6371.0
        d_lat = radians(b_lat - a_lat)
        d_lon = radians(b_lon - a_lon)
        value = sin(d_lat / 2) ** 2 + cos(radians(a_lat)) * cos(radians(b_lat)) * sin(d_lon / 2) ** 2
        return earth_radius * 2 * asin(sqrt(value))
    ranked = [(facility, haversine_km(latitude, longitude, facility["latitude"], facility["longitude"])) for facility in FACILITIES]
    return min(ranked, key=lambda item: item[1])


@router.get("/overview")
async def live_overview(location_id: int = Query(1, ge=1)):
    location = next((item for item in LOCATIONS if item["id"] == location_id), None)
    if not location:
        raise HTTPException(404, "Live location not found")
    data = await fetch_weather(location)
    current = data["current"]
    risk = build_environmental_risk(current["temperature_2m"], current["relative_humidity_2m"])
    forecast = make_forecast(data)
    now = datetime.now(IST).strftime("%Y-%m-%dT%H:%M")
    upcoming = [item for item in forecast if item["timestamp"] >= now]
    peak = max(upcoming[:24] or forecast[:24], key=lambda item: item["final_score"])
    return {"source": "Open-Meteo", "updated_at": current.get("time"), "timezone": data.get("timezone", "Asia/Kolkata"), "location": location_public(location), "current": {"temperature": current["temperature_2m"], "humidity": current["relative_humidity_2m"], "apparent_temperature": current["apparent_temperature"], "wind_speed": current["wind_speed_10m"], **risk}, "peak": peak, "forecast": forecast[:120], "risk_note": "Overall risk is thermal-only because authoritative exposure, vulnerability and infrastructure datasets are not connected yet."}


@router.get("/current")
async def current_location_weather(latitude: float = Query(..., ge=-90, le=90), longitude: float = Query(..., ge=-180, le=180)):
    location = {"name": "Current location", "district": "Current location", "latitude": latitude, "longitude": longitude}
    data = await fetch_weather(location, auto_timezone=True)
    current = data["current"]
    risk = build_environmental_risk(current["temperature_2m"], current["relative_humidity_2m"])
    forecast = make_forecast(data)
    peak = max(forecast[:24] or forecast, key=lambda item: item["final_score"], default=risk)
    nearest, distance = nearest_facility(latitude, longitude)
    return {"source": "Open-Meteo", "updated_at": current.get("time"), "timezone": data.get("timezone", "auto"), "location": location_public(location), "current": {"temperature": current["temperature_2m"], "humidity": current["relative_humidity_2m"], "apparent_temperature": current["apparent_temperature"], "wind_speed": current["wind_speed_10m"], **risk}, "peak": peak, "forecast": forecast[:120], "nearest_verified_facility": {"name": nearest["name"], "distance_km": round(distance, 2)}, "risk_note": "This location uses live thermal stress only. No invented municipal exposure, vulnerability or infrastructure score is applied to arbitrary GPS coordinates."}


@router.get("/search")
async def search_locations(query: str = Query(..., min_length=2, max_length=80)):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(OPEN_METEO_GEOCODING_URL, params={"name": query, "count": 8, "language": "en", "format": "json"})
            response.raise_for_status()
            data = response.json()
    except (httpx.HTTPError, httpx.TimeoutException) as exc:
        raise HTTPException(503, f"Location search unavailable: {exc.__class__.__name__}") from exc
    results = []
    for item in data.get("results", []):
        results.append({"name": item.get("name"), "country": item.get("country"), "country_code": item.get("country_code"), "admin1": item.get("admin1"), "admin2": item.get("admin2"), "latitude": item.get("latitude"), "longitude": item.get("longitude"), "timezone": item.get("timezone"), "population": item.get("population")})
    return {"query": query, "results": results, "source": "Open-Meteo Geocoding"}


@router.get("/risk-map")
async def live_risk_map():
    weather_payloads = await fetch_weather_points(LOCATIONS)
    results = []
    for location, data in zip(LOCATIONS, weather_payloads):
        current = data["current"]
        results.append({"location": location_public(location), "weather": {"temperature": current["temperature_2m"], "humidity": current["relative_humidity_2m"], "apparent_temperature": current["apparent_temperature"], "wind_speed": current["wind_speed_10m"]}, "risk": build_environmental_risk(current["temperature_2m"], current["relative_humidity_2m"])})
    return {"source": "Open-Meteo", "updated_at": datetime.now(IST).isoformat(), "risk_basis": "thermal_only", "locations": results}


@router.get("/facilities")
async def live_facilities():
    return {"source": "Delhi Government 2026 heat-relief reporting", "updated_at": datetime.now(IST).isoformat(), "status_note": "These are publicly reported cooling-zone locations. Delhi's public reporting does not provide a live occupancy/open-closed feed, so HeatShield does not invent one.", "facilities": FACILITIES}


@router.get("/alerts")
async def live_alerts():
    overview = await live_overview(1)
    current = overview["current"]
    severity = risk_level(current["final_score"])
    alerts = [{"id": "live-thermal-1", "severity": severity, "active": True, "created_at": overview["updated_at"], "location": overview["location"]["name"], "message": f"Live thermal risk is {severity} in {overview['location']['name']} with a thermal score of {current['final_score']}/100.", "source": "Open-Meteo + HeatShield thermal model"}]
    peak = overview["peak"]
    alerts.append({"id": "peak-thermal-1", "severity": risk_level(peak["final_score"]), "active": True, "created_at": peak["timestamp"], "location": overview["location"]["name"], "message": f"Forecast thermal peak reaches {peak['final_score']}/100 at {peak['timestamp']} IST.", "source": "Open-Meteo + HeatShield thermal model"})
    return {"source": "Open-Meteo + HeatShield thermal model", "alerts": alerts}


@router.get("/responders")
async def live_responders():
    risk_map = await live_risk_map()
    ranked = sorted(risk_map["locations"], key=lambda item: item["risk"]["final_score"], reverse=True)
    priorities = []
    for rank, item in enumerate(ranked, 1):
        score = item["risk"]["final_score"]
        action = "Immediate thermal-risk review" if score >= 70 else "Stage response team" if score >= 50 else "Routine monitoring"
        priorities.append({"priority": rank, "location": item["location"], "score": score, "risk_level": item["risk"]["risk_level"], "action": action, "basis": "live thermal stress only", "operational_note": "HeatShield recommendation only; not a live dispatch order."})
    return {"source": "Open-Meteo + HeatShield thermal model", "updated_at": datetime.now(IST).isoformat(), "priorities": priorities}


@router.get("/interventions")
async def live_interventions(location_id: int = Query(1, ge=1), shade: bool = False, water: bool = False, cooling: bool = False):
    location = next((item for item in LOCATIONS if item["id"] == location_id), None)
    if not location:
        raise HTTPException(404, "Live location not found")
    data = await fetch_weather(location)
    current = data["current"]
    baseline = build_environmental_risk(current["temperature_2m"], current["relative_humidity_2m"])
    selected = [name for name, enabled in (("shade", shade), ("water", water), ("cooling", cooling)) if enabled]
    return {"location": location_public(location), "baseline": baseline, "interventions": {"shade": shade, "water": water, "cooling": cooling}, "selected_interventions": selected, "projected_score": None, "projected_level": None, "estimated_reduction": None, "simulation_status": "not_calibrated", "simulation_note": "HeatShield will not invent temperature/risk reductions for interventions. A calibrated intervention dataset is required before projected impacts can be reported."}


@router.get("/locations")
def live_locations():
    return [location_public(item) for item in LOCATIONS]

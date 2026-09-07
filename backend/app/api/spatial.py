from math import asin, cos, radians, sin, sqrt

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import text

from app.api.live import FACILITIES, build_environmental_risk, fetch_weather, fetch_weather_points
from app.db.database import SessionLocal

router = APIRouter(prefix="/api/spatial", tags=["Spatial Analysis"])

MIN_LAT, MAX_LAT = 28.50, 28.75
MIN_LON, MAX_LON = 77.05, 77.35
GRID_ROWS, GRID_COLS = 10, 12


def grid_definition():
    lat_step = (MAX_LAT - MIN_LAT) / GRID_ROWS
    lon_step = (MAX_LON - MIN_LON) / GRID_COLS
    cells = []
    for row in range(GRID_ROWS):
        for col in range(GRID_COLS):
            min_lat = MIN_LAT + row * lat_step
            max_lat = MIN_LAT + (row + 1) * lat_step
            min_lon = MIN_LON + col * lon_step
            max_lon = MIN_LON + (col + 1) * lon_step
            cells.append({
                "cell_code": f"DEL-{row + 1:02d}-{col + 1:02d}",
                "center_latitude": (min_lat + max_lat) / 2,
                "center_longitude": (min_lon + max_lon) / 2,
                "bounds": {"min_lat": min_lat, "max_lat": max_lat, "min_lon": min_lon, "max_lon": max_lon},
            })
    return cells


def parse_cell(cell_code: str):
    try:
        prefix, row_text, col_text = cell_code.split("-")
        if prefix != "DEL":
            raise ValueError
        row = int(row_text)
        col = int(col_text)
        if not (1 <= row <= GRID_ROWS and 1 <= col <= GRID_COLS):
            raise ValueError
    except ValueError as exc:
        raise HTTPException(404, "Grid cell not found") from exc
    return grid_definition()[(row - 1) * GRID_COLS + (col - 1)]


def haversine_km(a_lat: float, a_lon: float, b_lat: float, b_lon: float) -> float:
    earth_radius = 6371.0
    d_lat = radians(b_lat - a_lat)
    d_lon = radians(b_lon - a_lon)
    value = sin(d_lat / 2) ** 2 + cos(radians(a_lat)) * cos(radians(b_lat)) * sin(d_lon / 2) ** 2
    return earth_radius * 2 * asin(sqrt(value))


def explanation(risk: dict) -> dict:
    return {
        "components": {"thermal_stress": risk["thermal_score"]},
        "main_driver": "thermal stress",
        "reasons": ["thermal stress"],
        "summary": "This cell is ranked using live temperature and humidity only. Population, vulnerability and infrastructure data are not applied until authoritative datasets are connected.",
    }


@router.get("/grid")
async def risk_grid():
    cells = grid_definition()
    payload = await fetch_weather_points([{"latitude": cell["center_latitude"], "longitude": cell["center_longitude"]} for cell in cells])
    result = []
    for cell, data in zip(cells, payload):
        current = data["current"]
        risk = build_environmental_risk(current["temperature_2m"], current["relative_humidity_2m"])
        result.append({
            "cell_code": cell["cell_code"],
            "center": {"latitude": cell["center_latitude"], "longitude": cell["center_longitude"]},
            "bounds": cell["bounds"],
            "weather": {"temperature": current["temperature_2m"], "humidity": current["relative_humidity_2m"], "apparent_temperature": current["apparent_temperature"], "wind_speed": current["wind_speed_10m"]},
            "risk": risk,
            "explanation": explanation(risk),
            "exposure_status": "not_available",
        })
    return {"source": "Open-Meteo", "updated_at": payload[0]["current"].get("time") if payload else None, "risk_basis": "thermal_only", "grid": result, "grid_size": {"rows": GRID_ROWS, "columns": GRID_COLS, "cells": len(result)}}


@router.get("/why-risky")
async def why_risky(cell_code: str = Query(...)):
    cell = parse_cell(cell_code)
    location = {"latitude": cell["center_latitude"], "longitude": cell["center_longitude"], "name": cell_code}
    current = (await fetch_weather(location))["current"]
    risk = build_environmental_risk(current["temperature_2m"], current["relative_humidity_2m"])
    return {"cell": cell_code, "center": {"latitude": cell["center_latitude"], "longitude": cell["center_longitude"]}, "weather": current, "risk": risk, "explanation": explanation(risk)}


@router.get("/nearby")
def nearby(latitude: float = Query(..., ge=-90, le=90), longitude: float = Query(..., ge=-180, le=180), radius_km: float = Query(5, gt=0, le=50)):
    facilities = []
    for facility in FACILITIES:
        distance = haversine_km(latitude, longitude, facility["latitude"], facility["longitude"])
        if distance <= radius_km:
            facilities.append({**facility, "distance_km": round(distance, 2)})
    facilities.sort(key=lambda item: item["distance_km"])
    return {"latitude": latitude, "longitude": longitude, "radius_km": radius_km, "facilities": facilities, "source": "Delhi 2026 heat-relief operation records"}


@router.get("/history")
def history(cell_code: str = Query(...), days: int = Query(7, ge=1, le=30)):
    cell = parse_cell(cell_code)
    with SessionLocal() as db:
        rows = db.execute(text("SELECT timestamp, temperature, humidity, wind_speed, apparent_temperature, data_source FROM weather WHERE data_source = 'Open-Meteo' AND timestamp >= NOW() - (:days || ' days')::interval ORDER BY timestamp DESC"), {"days": days}).mappings().all()
    return {"cell": cell_code, "center": {"latitude": cell["center_latitude"], "longitude": cell["center_longitude"]}, "days": days, "history": [dict(row) for row in rows], "source": "Open-Meteo synchronized observations"}

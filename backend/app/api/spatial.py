from datetime import datetime
from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query
from geoalchemy2 import WKTElement
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.live import FACILITIES, LOCATIONS, build_risk, fetch_weather, location_public, make_forecast
from app.db.database import get_db
from app.models.models import Facility, GridCell, Location, RiskScore, Weather

router = APIRouter(prefix="/api/spatial", tags=["Spatial Analysis"])

# Delhi MVP analysis extent. Cells are spatially real PostGIS polygons; weather is
# sampled from the nearest live reference point until a denser weather grid is added.
MIN_LAT, MAX_LAT = 28.50, 28.75
MIN_LON, MAX_LON = 77.05, 77.35
GRID_ROWS, GRID_COLS = 10, 12


def ensure_spatial_seed(db: Session) -> None:
    db.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
    for item in LOCATIONS:
        existing = db.get(Location, item["id"])
        if not existing:
            db.add(Location(id=item["id"], name=item["name"], district=item["district"], latitude=item["latitude"], longitude=item["longitude"], geom=WKTElement(f"POINT({item['longitude']} {item['latitude']})", srid=4326)))
        elif existing.geom is None:
            existing.geom = WKTElement(f"POINT({existing.longitude} {existing.latitude})", srid=4326)
    db.flush()
    if db.query(Facility).count() == 0:
        for item in FACILITIES:
            db.add(Facility(id=item["id"], name=item["name"], type=item["type"], latitude=item["latitude"], longitude=item["longitude"], geom=WKTElement(f"POINT({item['longitude']} {item['latitude']})", srid=4326), capacity=item["capacity"], occupancy=0, status="available"))
    if db.query(GridCell).count() == 0:
        lat_step = (MAX_LAT - MIN_LAT) / GRID_ROWS
        lon_step = (MAX_LON - MIN_LON) / GRID_COLS
        cell_id = 1
        for r in range(GRID_ROWS):
            for c in range(GRID_COLS):
                min_lat = MIN_LAT + r * lat_step
                max_lat = min_lat + lat_step
                min_lon = MIN_LON + c * lon_step
                max_lon = min_lon + lon_step
                center_lat = (min_lat + max_lat) / 2
                center_lon = (min_lon + max_lon) / 2
                nearest = min(LOCATIONS, key=lambda x: (x["latitude"] - center_lat) ** 2 + (x["longitude"] - center_lon) ** 2)
                ring = f"{min_lon} {min_lat},{max_lon} {min_lat},{max_lon} {max_lat},{min_lon} {max_lat},{min_lon} {min_lat}"
                db.add(GridCell(id=cell_id, cell_code=f"DEL-{r+1:02d}-{c+1:02d}", geom=WKTElement(f"POLYGON(({ring}))", srid=4326), center_latitude=center_lat, center_longitude=center_lon, exposure_score=nearest["exposure"], vulnerability_score=nearest["vulnerability"], infrastructure_score=nearest["infrastructure"]))
                cell_id += 1
    db.commit()


def explain_risk(risk: dict) -> dict:
    components = {
        "thermal_stress": round(risk["thermal_score"] * 0.40, 1),
        "population_exposure": round(risk["exposure_score"] * 0.25, 1),
        "vulnerability": round(risk["vulnerability_score"] * 0.20, 1),
        "infrastructure_gap": round(risk["infrastructure_score"] * 0.15, 1),
    }
    main_driver = max(components, key=components.get)
    labels = {
        "thermal_stress": "extreme thermal stress",
        "population_exposure": "high population exposure",
        "vulnerability": "high vulnerability",
        "infrastructure_gap": "limited heat-protection infrastructure",
    }
    reasons = [
        labels[name] for name, value in components.items() if value >= 12
    ]
    return {"components": components, "main_driver": labels[main_driver], "reasons": reasons or [labels[main_driver]], "summary": "This area is risky mainly because of " + labels[main_driver] + "."}


@router.get("/grid")
async def risk_grid(db: Session = Depends(get_db)):
    ensure_spatial_seed(db)
    cells = db.query(GridCell).all()
    reference_weather = {}
    for location in LOCATIONS:
        reference_weather[location["id"]] = await fetch_weather(location)
    result = []
    for cell in cells:
        nearest = min(LOCATIONS, key=lambda x: (x["latitude"] - cell.center_latitude) ** 2 + (x["longitude"] - cell.center_longitude) ** 2)
        current = reference_weather[nearest["id"]]["current"]
        risk = build_risk({**nearest, "exposure": cell.exposure_score, "vulnerability": cell.vulnerability_score, "infrastructure": cell.infrastructure_score}, current["temperature_2m"], current["relative_humidity_2m"])
        result.append({"id": cell.id, "cell_code": cell.cell_code, "center": {"latitude": cell.center_latitude, "longitude": cell.center_longitude}, "risk": risk, "explanation": explain_risk(risk), "exposure_status": "highly exposed" if cell.exposure_score >= 75 else "moderately exposed" if cell.exposure_score >= 55 else "lower exposure"})
    return {"source": "Open-Meteo + PostGIS grid", "updated_at": datetime.utcnow().isoformat(), "grid": result, "grid_size": {"rows": GRID_ROWS, "columns": GRID_COLS, "cells": len(result)}}


@router.get("/why-risky")
async def why_risky(cell_code: str = Query(...), db: Session = Depends(get_db)):
    ensure_spatial_seed(db)
    cell = db.query(GridCell).filter(GridCell.cell_code == cell_code).first()
    if not cell:
        raise HTTPException(404, "Grid cell not found")
    nearest = min(LOCATIONS, key=lambda x: (x["latitude"] - cell.center_latitude) ** 2 + (x["longitude"] - cell.center_longitude) ** 2)
    data = await fetch_weather(nearest)
    current = data["current"]
    risk = build_risk({**nearest, "exposure": cell.exposure_score, "vulnerability": cell.vulnerability_score, "infrastructure": cell.infrastructure_score}, current["temperature_2m"], current["relative_humidity_2m"])
    return {"cell": cell.cell_code, "risk": risk, "explanation": explain_risk(risk)}


@router.get("/nearby")
def nearby(latitude: float = Query(..., ge=-90, le=90), longitude: float = Query(..., ge=-180, le=180), radius_km: float = Query(5, gt=0, le=50), db: Session = Depends(get_db)):
    ensure_spatial_seed(db)
    query = text("""
        SELECT id, name, type, latitude, longitude, capacity, occupancy, status,
               ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography) / 1000.0 AS distance_km
        FROM facilities
        WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radius_m)
        ORDER BY distance_km
    """)
    rows = db.execute(query, {"lat": latitude, "lon": longitude, "radius_m": radius_km * 1000}).mappings().all()
    return {"latitude": latitude, "longitude": longitude, "radius_km": radius_km, "facilities": [dict(row) for row in rows]}


@router.get("/history")
def history(cell_code: str = Query(...), days: int = Query(7, ge=1, le=30), db: Session = Depends(get_db)):
    ensure_spatial_seed(db)
    cell = db.query(GridCell).filter(GridCell.cell_code == cell_code).first()
    if not cell:
        raise HTTPException(404, "Grid cell not found")
    nearest = min(LOCATIONS, key=lambda x: (x["latitude"] - cell.center_latitude) ** 2 + (x["longitude"] - cell.center_longitude) ** 2)
    rows = db.execute(text("""
        SELECT timestamp, temperature, humidity, apparent_temperature
        FROM weather
        WHERE location_id = :location_id AND timestamp >= NOW() - (:days || ' days')::interval
        ORDER BY timestamp DESC
    """), {"location_id": nearest["id"], "days": days}).mappings().all()
    return {"cell": cell_code, "reference_location": nearest["name"], "days": days, "history": [dict(row) for row in rows], "note": "History contains synchronized observations collected by HeatShield."}

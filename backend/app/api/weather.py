from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import Location, Weather
from app.schemas.schemas import WeatherOut
from app.services.thermal.engine import heat_index_celsius, thermal_score

router = APIRouter(prefix="/api/weather", tags=["Weather"])
LIVE_SOURCE = "Open-Meteo"


@router.get("/current", response_model=WeatherOut)
def current_weather(location_id: int = Query(..., ge=1), db: Session = Depends(get_db)):
    row = db.scalar(select(Weather).where(Weather.location_id == location_id, Weather.data_source == LIVE_SOURCE).order_by(Weather.timestamp.desc()))
    if not row:
        raise HTTPException(404, "Live weather data not found")
    return row


@router.get("/forecast")
def forecast(location_id: int = Query(..., ge=1), db: Session = Depends(get_db)):
    rows = db.scalars(select(Weather).where(Weather.location_id == location_id, Weather.data_source == LIVE_SOURCE).order_by(Weather.timestamp.asc())).all()
    if not rows:
        raise HTTPException(404, "Live weather history not found")
    return [{
        "timestamp": row.timestamp,
        "temperature": row.temperature,
        "humidity": row.humidity,
        "wind_speed": row.wind_speed,
        "apparent_temperature": row.apparent_temperature,
        "data_source": row.data_source,
        "heat_index": heat_index_celsius(row.temperature, row.humidity),
        "thermal_score": thermal_score(heat_index_celsius(row.temperature, row.humidity)),
    } for row in rows]


@router.get("/locations")
def locations(db: Session = Depends(get_db)):
    return db.scalars(select(Location).order_by(Location.name)).all()

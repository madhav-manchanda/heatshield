import asyncio
from datetime import datetime

from app.api.live import LOCATIONS, build_environmental_risk, fetch_weather
from app.db.database import SessionLocal
from app.models.models import RiskScore, Weather

SYNC_INTERVAL_SECONDS = 300
DATA_SOURCE = "Open-Meteo"


def persist_snapshot(location: dict, data: dict) -> None:
    current = data["current"]
    timestamp = datetime.fromisoformat(current["time"])
    risk = build_environmental_risk(current["temperature_2m"], current["relative_humidity_2m"])
    db = SessionLocal()
    try:
        db.add(Weather(
            location_id=location["id"],
            timestamp=timestamp,
            temperature=current["temperature_2m"],
            humidity=current["relative_humidity_2m"],
            wind_speed=current.get("wind_speed_10m", 0),
            apparent_temperature=current.get("apparent_temperature"),
            data_source=DATA_SOURCE,
        ))
        db.add(RiskScore(
            location_id=location["id"],
            timestamp=timestamp,
            thermal_score=risk["thermal_score"],
            exposure_score=None,
            vulnerability_score=None,
            infrastructure_score=None,
            final_score=risk["final_score"],
            risk_level=risk["risk_level"],
            risk_basis="thermal_only",
            data_source=DATA_SOURCE,
        ))
        db.commit()
    finally:
        db.close()


async def sync_once() -> None:
    for location in LOCATIONS:
        try:
            data = await fetch_weather(location)
            await asyncio.to_thread(persist_snapshot, location, data)
        except Exception:
            continue


async def live_sync_loop() -> None:
    while True:
        try:
            await sync_once()
        except Exception:
            pass
        await asyncio.sleep(SYNC_INTERVAL_SECONDS)

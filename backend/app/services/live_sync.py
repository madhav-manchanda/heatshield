import asyncio
from datetime import datetime

from sqlalchemy import text

from app.api.live import LOCATIONS, build_risk, fetch_weather
from app.db.database import SessionLocal
from app.models.models import RiskScore, Weather

SYNC_INTERVAL_SECONDS = 300


def persist_snapshot(location: dict, data: dict) -> None:
    current = data["current"]
    timestamp = datetime.fromisoformat(current["time"])
    risk = build_risk(location, current["temperature_2m"], current["relative_humidity_2m"])
    db = SessionLocal()
    try:
        db.add(Weather(location_id=location["id"], timestamp=timestamp, temperature=current["temperature_2m"], humidity=current["relative_humidity_2m"], wind_speed=current.get("wind_speed_10m", 0), apparent_temperature=current.get("apparent_temperature")))
        db.add(RiskScore(location_id=location["id"], timestamp=timestamp, thermal_score=risk["thermal_score"], exposure_score=risk["exposure_score"], vulnerability_score=risk["vulnerability_score"], infrastructure_score=risk["infrastructure_score"], final_score=risk["final_score"], risk_level=risk["risk_level"]))
        db.commit()
    finally:
        db.close()


async def sync_once() -> None:
    for location in LOCATIONS:
        try:
            data = await fetch_weather(location)
            await asyncio.to_thread(persist_snapshot, location, data)
        except Exception:
            # A single provider/location failure must not stop the other locations.
            continue


async def live_sync_loop() -> None:
    while True:
        try:
            await sync_once()
        except Exception:
            pass
        await asyncio.sleep(SYNC_INTERVAL_SECONDS)

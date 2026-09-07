import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.db.database import Base, engine, SessionLocal
from app.models import models  # noqa: F401
from app.models.models import Location
from app.api.weather import router as weather_router
from app.api.risk import router as risk_router
from app.api.facilities import router as facilities_router
from app.api.alerts import router as alerts_router
from app.api.responders import router as responders_router
from app.api.live import LOCATIONS, router as live_router
from app.api.spatial import router as spatial_router
from app.services.live_sync import live_sync_loop

app = FastAPI(title=settings.app_name, version="0.4.0", description="HeatShield hyperlocal heat-risk decision-support API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather_router)
app.include_router(risk_router)
app.include_router(facilities_router)
app.include_router(alerts_router)
app.include_router(responders_router)
app.include_router(live_router)
app.include_router(spatial_router)


def prepare_database():
    with engine.begin() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))

    Base.metadata.create_all(bind=engine)

    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE locations ADD COLUMN IF NOT EXISTS geom geometry(POINT,4326)"))
        connection.execute(text("ALTER TABLE weather ADD COLUMN IF NOT EXISTS apparent_temperature double precision"))
        connection.execute(text("ALTER TABLE weather ADD COLUMN IF NOT EXISTS data_source varchar(120) NOT NULL DEFAULT 'legacy_unverified'"))
        connection.execute(text("ALTER TABLE risk_scores ADD COLUMN IF NOT EXISTS risk_basis varchar(80) NOT NULL DEFAULT 'legacy_unverified'"))
        connection.execute(text("ALTER TABLE risk_scores ADD COLUMN IF NOT EXISTS data_source varchar(120) NOT NULL DEFAULT 'legacy_unverified'"))
        connection.execute(text("ALTER TABLE risk_scores ALTER COLUMN exposure_score DROP NOT NULL"))
        connection.execute(text("ALTER TABLE risk_scores ALTER COLUMN vulnerability_score DROP NOT NULL"))
        connection.execute(text("ALTER TABLE risk_scores ALTER COLUMN infrastructure_score DROP NOT NULL"))
        connection.execute(text("ALTER TABLE grid_cells ALTER COLUMN exposure_score DROP NOT NULL"))
        connection.execute(text("ALTER TABLE grid_cells ALTER COLUMN vulnerability_score DROP NOT NULL"))
        connection.execute(text("ALTER TABLE grid_cells ALTER COLUMN infrastructure_score DROP NOT NULL"))
        connection.execute(text("ALTER TABLE facilities ADD COLUMN IF NOT EXISTS geom geometry(POINT,4326)"))
        connection.execute(text("ALTER TABLE facilities ADD COLUMN IF NOT EXISTS data_source varchar(160) NOT NULL DEFAULT 'legacy_unverified'"))
        connection.execute(text("ALTER TABLE facilities ALTER COLUMN capacity DROP NOT NULL"))
        connection.execute(text("ALTER TABLE facilities ALTER COLUMN occupancy DROP NOT NULL"))

        # Remove records created by the former synthetic MVP seed. New records
        # are explicitly tagged with their real source and are never deleted.
        connection.execute(text("DELETE FROM weather WHERE data_source = 'legacy_unverified'"))
        connection.execute(text("DELETE FROM risk_scores WHERE data_source = 'legacy_unverified'"))
        connection.execute(text("DELETE FROM facilities WHERE data_source = 'legacy_unverified'"))
        connection.execute(text("DELETE FROM alerts WHERE message LIKE 'High heat risk is expected during the afternoon peak period.%'"))


def ensure_reference_locations():
    with SessionLocal() as db:
        for item in LOCATIONS:
            existing = db.get(Location, item["id"])
            if existing is None:
                db.add(Location(id=item["id"], name=item["name"], district=item["district"], latitude=item["latitude"], longitude=item["longitude"]))
            else:
                existing.name = item["name"]
                existing.district = item["district"]
                existing.latitude = item["latitude"]
                existing.longitude = item["longitude"]
        db.commit()


@app.on_event("startup")
def startup():
    prepare_database()
    ensure_reference_locations()
    app.state.live_sync_task = asyncio.create_task(live_sync_loop())


@app.on_event("shutdown")
async def shutdown():
    task = getattr(app.state, "live_sync_task", None)
    if task:
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass


@app.get("/")
def root():
    return {"name": "HeatShield API", "status": "online", "docs": "/docs", "spatial": "PostGIS", "sync_interval_minutes": 5, "data_policy": "real-source-only"}


@app.get("/health")
def health():
    return {"status": "healthy", "live_weather": "Open-Meteo", "spatial_database": "PostGIS", "automatic_sync": "5 minutes", "data_policy": "real-source-only"}

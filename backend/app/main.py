import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.db.database import Base, engine, SessionLocal
from app.models import models  # noqa: F401
from app.api.weather import router as weather_router
from app.api.risk import router as risk_router
from app.api.facilities import router as facilities_router
from app.api.alerts import router as alerts_router
from app.api.responders import router as responders_router
from app.api.live import router as live_router
from app.api.spatial import router as spatial_router
from app.services.live_sync import live_sync_loop

app = FastAPI(title=settings.app_name, version="0.3.0", description="HeatShield hyperlocal heat-risk decision-support API")

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
        connection.execute(text("ALTER TABLE locations ADD COLUMN IF NOT EXISTS geom geometry(POINT,4326)"))
        connection.execute(text("ALTER TABLE weather ADD COLUMN IF NOT EXISTS apparent_temperature double precision"))
        connection.execute(text("ALTER TABLE facilities ADD COLUMN IF NOT EXISTS geom geometry(POINT,4326)"))
    Base.metadata.create_all(bind=engine)


@app.on_event("startup")
def startup():
    prepare_database()
    from app.api.spatial import ensure_spatial_seed
    with SessionLocal() as db:
        ensure_spatial_seed(db)
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
    return {"name": "HeatShield API", "status": "online", "docs": "/docs", "spatial": "PostGIS", "sync_interval_minutes": 5}


@app.get("/health")
def health():
    return {"status": "healthy", "live_weather": "Open-Meteo", "spatial_database": "PostGIS", "automatic_sync": "5 minutes"}

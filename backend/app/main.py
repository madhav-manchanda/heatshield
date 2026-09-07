from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import Base, engine
from app.models import models  # noqa: F401
from app.api.weather import router as weather_router
from app.api.risk import router as risk_router
from app.api.facilities import router as facilities_router
from app.api.alerts import router as alerts_router
from app.api.responders import router as responders_router

app = FastAPI(title=settings.app_name, version="0.1.0", description="HeatShield heat-risk decision-support API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather_router)
app.include_router(risk_router)
app.include_router(facilities_router)
app.include_router(alerts_router)
app.include_router(responders_router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"name": "HeatShield API", "status": "online", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "healthy"}

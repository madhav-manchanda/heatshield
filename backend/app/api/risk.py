from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import Location, RiskScore
from app.schemas.schemas import RiskOut

router = APIRouter(prefix="/api/risk", tags=["Risk"])
LIVE_SOURCE = "Open-Meteo"


def _feature(row: RiskScore):
    return {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [row.location.longitude, row.location.latitude]},
        "properties": {
            "location_id": row.location_id,
            "name": row.location.name,
            "district": row.location.district,
            "final_score": row.final_score,
            "risk_level": row.risk_level,
            "thermal_score": row.thermal_score,
            "exposure_score": row.exposure_score,
            "vulnerability_score": row.vulnerability_score,
            "infrastructure_score": row.infrastructure_score,
            "risk_basis": row.risk_basis,
            "data_source": row.data_source,
        },
    }


@router.get("/current", response_model=RiskOut)
def current_risk(location_id: int = Query(..., ge=1), db: Session = Depends(get_db)):
    row = db.scalar(select(RiskScore).where(RiskScore.location_id == location_id, RiskScore.data_source == LIVE_SOURCE).order_by(RiskScore.timestamp.desc()))
    if not row:
        raise HTTPException(404, "Live risk data not found")
    return row


@router.get("/forecast")
def risk_forecast(location_id: int = Query(..., ge=1), db: Session = Depends(get_db)):
    rows = db.scalars(select(RiskScore).where(RiskScore.location_id == location_id, RiskScore.data_source == LIVE_SOURCE).order_by(RiskScore.timestamp.asc())).all()
    if not rows:
        raise HTTPException(404, "Live risk history not found")
    return rows


@router.get("/map")
def risk_map(db: Session = Depends(get_db)):
    latest = {}
    rows = db.scalars(select(RiskScore).where(RiskScore.data_source == LIVE_SOURCE).order_by(RiskScore.timestamp.desc())).all()
    for row in rows:
        latest.setdefault(row.location_id, row)
    return {"type": "FeatureCollection", "features": [_feature(row) for row in latest.values()], "source": LIVE_SOURCE, "risk_basis": "thermal_only"}


@router.get("/areas")
def areas(db: Session = Depends(get_db)):
    locations = db.scalars(select(Location).order_by(Location.name)).all()
    return [{"id": x.id, "name": x.name, "district": x.district, "latitude": x.latitude, "longitude": x.longitude} for x in locations]

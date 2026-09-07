from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Location, RiskScore, Facility

router = APIRouter(prefix="/api/responders", tags=["Responders"])


@router.get("/priorities")
def priorities(db: Session = Depends(get_db)):
    rows = db.scalars(select(RiskScore).order_by(RiskScore.final_score.desc())).all()
    latest = {}
    for row in rows:
        latest.setdefault(row.location_id, row)
    facilities = db.scalars(select(Facility)).all()
    available_capacity = sum(max(0, f.capacity - f.occupancy) for f in facilities if f.status == "available")
    result = []
    for rank, row in enumerate(latest.values(), start=1):
        result.append({
            "priority": rank,
            "location_id": row.location_id,
            "area": row.location.name,
            "risk_level": row.risk_level,
            "final_score": row.final_score,
            "thermal_score": row.thermal_score,
            "exposure_score": row.exposure_score,
            "vulnerability_score": row.vulnerability_score,
            "infrastructure_score": row.infrastructure_score,
            "available_shelter_capacity": available_capacity,
        })
    return result

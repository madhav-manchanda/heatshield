from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Facility
from app.schemas.schemas import FacilityOut

router = APIRouter(prefix="/api/facilities", tags=["Facilities"])


@router.get("", response_model=list[FacilityOut])
def facilities(status: str | None = Query(default=None), db: Session = Depends(get_db)):
    query = select(Facility).order_by(Facility.name)
    if status:
        query = query.where(Facility.status == status.lower())
    return db.scalars(query).all()


@router.get("/{facility_id}", response_model=FacilityOut)
def facility(facility_id: int, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    item = db.get(Facility, facility_id)
    if not item:
        raise HTTPException(404, "Facility not found")
    return item

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Alert
from app.schemas.schemas import AlertOut

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


@router.get("", response_model=list[AlertOut])
def alerts(active: bool = Query(True), db: Session = Depends(get_db)):
    return db.scalars(select(Alert).where(Alert.active == active).order_by(Alert.created_at.desc())).all()

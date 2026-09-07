from fastapi import APIRouter, HTTPException, Query

from app.api.live import FACILITIES

router = APIRouter(prefix="/api/facilities", tags=["Facilities"])


@router.get("")
def facilities(status: str | None = Query(default=None)):
    result = FACILITIES
    if status:
        result = [item for item in result if item["status"].lower() == status.lower()]
    return result


@router.get("/{facility_id}")
def facility(facility_id: int):
    item = next((facility for facility in FACILITIES if facility["id"] == facility_id), None)
    if item is None:
        raise HTTPException(404, "Verified facility not found")
    return item

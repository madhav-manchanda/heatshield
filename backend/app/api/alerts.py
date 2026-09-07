from fastapi import APIRouter

from app.api.live import live_alerts

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


@router.get("")
async def alerts(active: bool = True):
    data = await live_alerts()
    if not active:
        return []
    return data["alerts"]

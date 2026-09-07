from fastapi import APIRouter

from app.api.live import live_responders

router = APIRouter(prefix="/api/responders", tags=["Responders"])


@router.get("/priorities")
async def priorities():
    data = await live_responders()
    return data["priorities"]

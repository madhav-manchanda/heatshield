from app.api.live import LOCATIONS
from app.db.database import Base, SessionLocal, engine
from app.models.models import Location


def seed():
    """Initialize reference geography only; never create synthetic observations."""
    Base.metadata.create_all(bind=engine)
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
    print("Reference geography initialized. No synthetic weather, risk, alert, occupancy, or facility records were created.")


if __name__ == "__main__":
    seed()

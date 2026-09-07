from datetime import datetime, timedelta
from sqlalchemy import select
from app.db.database import Base, engine, SessionLocal
from app.models.models import Location, Weather, RiskScore, Facility, Alert
from app.services.thermal.engine import heat_index_celsius, thermal_score, composite_risk, risk_level


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(Location).limit(1)):
            print("Database already contains data; skipping seed.")
            return

        locations = [
            Location(id=1, name="Central Delhi", district="Central Delhi", latitude=28.6448, longitude=77.2167),
            Location(id=2, name="South Delhi", district="South Delhi", latitude=28.5244, longitude=77.1855),
            Location(id=3, name="East Delhi", district="East Delhi", latitude=28.6280, longitude=77.2950),
            Location(id=4, name="West Delhi", district="West Delhi", latitude=28.6517, longitude=77.1095),
            Location(id=5, name="North Delhi", district="North Delhi", latitude=28.7041, longitude=77.1025),
        ]
        db.add_all(locations)
        now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
        profiles = [(1, 41, 62, 11, 82, 76, 32), (2, 38, 57, 13, 70, 68, 54), (3, 40, 64, 10, 78, 81, 38), (4, 37, 55, 15, 65, 59, 61), (5, 39, 60, 9, 75, 72, 44)]
        for loc_id, temp, humidity, wind, exposure, vulnerability, infrastructure in profiles:
            for hour in range(-24, 73, 3):
                ts = now + timedelta(hours=hour)
                # Controlled demo forecast variation around each area's baseline.
                t = temp + (1 if 12 <= ts.hour <= 16 else -2 if ts.hour < 7 else 0)
                hi = heat_index_celsius(t, humidity)
                thermal = thermal_score(hi)
                final = composite_risk(thermal, exposure, vulnerability, infrastructure)
                db.add(Weather(location_id=loc_id, timestamp=ts, temperature=t, humidity=humidity, wind_speed=wind))
                db.add(RiskScore(location_id=loc_id, timestamp=ts, thermal_score=thermal, exposure_score=exposure, vulnerability_score=vulnerability, infrastructure_score=infrastructure, final_score=final, risk_level=risk_level(final)))

        db.add_all([
            Facility(name="Civic Cooling Centre — Central", type="cooling_center", latitude=28.6448, longitude=77.2167, capacity=250, occupancy=145, status="available"),
            Facility(name="Community Relief Centre — South", type="community_center", latitude=28.5244, longitude=77.1855, capacity=180, occupancy=180, status="full"),
            Facility(name="Cooling Centre — East", type="cooling_center", latitude=28.6280, longitude=77.2950, capacity=220, occupancy=96, status="available"),
            Facility(name="Community Centre — West", type="community_center", latitude=28.6517, longitude=77.1095, capacity=140, occupancy=52, status="available"),
        ])
        db.add(Alert(location_id=1, severity="high", message="High heat risk is expected during the afternoon peak period.", created_at=now, active=True))
        db.commit()
        print("HeatShield demo data seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

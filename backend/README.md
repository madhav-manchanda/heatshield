# HeatShield Backend

FastAPI + PostgreSQL backend for the HeatShield heat-risk decision-support platform.

## Local setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Start PostgreSQL with Docker:

```bash
docker compose -f docker-compose.yml up -d
```

Seed the controlled demo dataset:

```bash
python -m app.seed
```

Start the API:

```bash
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

Health check: http://localhost:8000/health

## MVP architecture

- FastAPI: REST API
- SQLAlchemy: database access
- PostgreSQL: persistent data
- Pandas/NumPy: planned data-processing layer
- Thermal engine: NOAA/NWS Rothfusz heat-index calculation
- Risk engine: transparent composite score
- Demo dataset: deterministic offline development/judging fallback

The risk model is an MVP baseline and its weights must be validated/documented before being presented as a scientific or operational model.

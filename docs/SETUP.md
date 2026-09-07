# HeatShield — Complete Local Setup

This is the canonical guide for turning the entire HeatShield project on locally.

## 1. Requirements

Install:

- Python 3.11+ recommended
- Docker + Docker Compose
- Node.js + npm
- Git

Check:

```bash
python --version
node --version
npm --version
docker --version
docker compose version
```

## 2. Get the repository

```bash
git clone https://github.com/madhav-manchanda/heatshield.git
cd heatshield
```

If the repository is already cloned:

```bash
git pull origin main
```

## 3. Start PostgreSQL + PostGIS

HeatShield uses the PostGIS image defined in `backend/docker-compose.yml`.

```bash
cd backend
docker compose up -d
```

Check it:

```bash
docker compose ps
```

The database is exposed on `localhost:5432` with:

```text
Database: heatshield
User:     heatshield
Password: heatshield
Host:     localhost
Port:     5432
```

These values match the current Docker Compose configuration. If you change them, update `backend/.env` accordingly.

## 4. Create the Python environment

From `backend/`:

```bash
python -m venv .venv
source .venv/bin/activate
```

On Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## 5. Configure environment variables

Create the environment file:

```bash
cp .env.example .env
```

Review `backend/.env` before starting the API.

No Open-Meteo API key is required for the public non-commercial forecast API currently used by HeatShield.

## 6. Start the backend

Stay inside `backend/`:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

You should see Uvicorn start on port 8000.

### Verify the API

Open:

```text
http://127.0.0.1:8000/health
```

Or run:

```bash
curl http://127.0.0.1:8000/health
```

Expected response includes:

```json
{
  "status": "healthy",
  "live_weather": "Open-Meteo",
  "spatial_database": "PostGIS",
  "automatic_sync": "5 minutes",
  "data_policy": "real-source-only"
}
```

Also verify the live endpoint:

```bash
curl "http://127.0.0.1:8000/api/live/overview?location_id=1"
```

If this returns live weather JSON, the backend-to-Open-Meteo path is working.

Swagger is available at:

```text
http://127.0.0.1:8000/docs
```

## 7. Start the frontend

Open a second terminal.

From the repository root:

```bash
cd heatshield-frontend
npm install
npx vite --host 0.0.0.0
```

Vite normally prints a URL similar to:

```text
http://localhost:5173/
```

Open that URL in the browser.

## 8. Frontend → backend connection

The frontend defaults to:

```text
http://127.0.0.1:8000
```

This is configured in `heatshield-frontend/api.js`.

If the backend is hosted elsewhere, set `window.HEATSHIELD_API_URL` before the module loads, or change the frontend configuration appropriately.

## 9. First page load

On first load:

1. The frontend loads the reference locations from `/api/live/locations`.
2. The dashboard requests `/api/live/overview`.
3. The backend requests current/hourly weather from Open-Meteo.
4. HeatShield calculates heat index, thermal score, and risk level.
5. The backend returns the result to the browser.
6. The frontend renders the live dashboard.

The backend also starts a five-minute background synchronization loop for persistent live observations.

## 10. Location search

Use the header location control.

Text search calls:

```text
GET /api/live/search?query=<place>
```

The backend forwards the search to Open-Meteo Geocoding and returns place coordinates.

GPS uses the browser's Geolocation API and then calls:

```text
GET /api/live/current?latitude=<lat>&longitude=<lon>
```

Arbitrary GPS locations use **thermal-only** risk. HeatShield does not invent municipal exposure, vulnerability, or infrastructure values for a coordinate it has no authoritative dataset for.

## 11. Useful API endpoints

### Live

```text
GET /api/live/locations
GET /api/live/overview?location_id=1
GET /api/live/current?latitude=<lat>&longitude=<lon>
GET /api/live/search?query=Delhi
GET /api/live/risk-map
GET /api/live/facilities
GET /api/live/alerts
GET /api/live/responders
GET /api/live/interventions?location_id=1
```

### Spatial

```text
GET /api/spatial/grid
GET /api/spatial/why-risky?cell_code=DEL-01-01
GET /api/spatial/nearby?latitude=28.64&longitude=77.21&radius_km=5
GET /api/spatial/history?cell_code=DEL-01-01&days=7
```

## 12. Stopping HeatShield

Stop the frontend with `Ctrl+C`.

Stop the backend with `Ctrl+C`.

Stop PostgreSQL/PostGIS:

```bash
cd backend
docker compose down
```

To stop containers **without deleting the database volume**, use the command above.

To intentionally remove the database volume as well:

```bash
docker compose down -v
```

This deletes the local PostgreSQL data volume and should only be used when you intentionally want a clean database.

## 13. Common problems

### `Connection refused` on port 8000

The FastAPI backend is not running.

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend says `CONNECTING`

Check:

```bash
curl http://127.0.0.1:8000/health
```

Then hard-refresh the browser.

### Database connection error

Check:

```bash
docker compose ps
```

and make sure PostgreSQL is listening on port 5432.

### Open-Meteo data unavailable

Check internet access and test:

```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=28.6448&longitude=77.2167&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m"
```

### Old fake/demo values still appear

The current backend startup migration removes records tagged `legacy_unverified` and the old synthetic alert. Restart the backend after pulling the latest code.

Then hard-refresh the browser to clear stale frontend state. The frontend may retain a local cache for offline display, so an old browser cache can otherwise remain visible.

## 14. Development workflow

After changing backend Python code, Uvicorn's `--reload` normally reloads automatically.

After changing frontend JavaScript/CSS/HTML, Vite normally updates automatically.

Before committing:

```bash
git status
git diff
git add .
git commit -m "describe the change"
git push origin main
```

## 15. Data integrity rule

Do not add a hard-coded number to the frontend merely to fill a blank card.

For every displayed value, document whether it is:

- an external observation;
- a derived calculation;
- a verified public record; or
- unavailable.

This rule is especially important for exposure, vulnerability, infrastructure, facility occupancy, emergency dispatch, and intervention-effect estimates.

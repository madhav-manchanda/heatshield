# HeatShield

Hyperlocal heat-risk and emergency-response decision-support platform.

HeatShield combines live weather, a transparent thermal-stress model, spatial analysis, cooling-zone information, alerts, responder prioritization, and intervention what-if analysis. The project follows a **real-source-only** data policy: values are either fetched from a documented source, calculated from source data, or shown as unavailable when a reliable source is not connected.

## Quick start

See **[docs/README.md](docs/README.md)** for the feature documentation and **[docs/SETUP.md](docs/SETUP.md)** for the complete local startup procedure.

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

docker compose up -d
uvicorn app.main:app --reload
```

Backend:
- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`

### Frontend

In another terminal:

```bash
cd heatshield-frontend
npm install
npx vite --host 0.0.0.0
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Documentation

### Feature READMEs

| Feature | Documentation |
|---|---|
| Live dashboard & current risk | [README.md](docs/features/README-live-dashboard.md) |
| Thermal-risk engine | [README.md](docs/features/README-thermal-risk.md) |
| Forecast & thermal stress | [README.md](docs/features/README-forecast.md) |
| Spatial risk map & history | [README.md](docs/features/README-spatial.md) |
| Location search & GPS | [README.md](docs/features/README-location.md) |
| Cooling facilities | [README.md](docs/features/README-facilities.md) |
| Alerts | [README.md](docs/features/README-alerts.md) |
| First-responder dashboard | [README.md](docs/features/README-responders.md) |
| Interventions & what-if | [README.md](docs/features/README-interventions.md) |
| Data, caching & offline behavior | [README.md](docs/features/README-data-flow.md) |

### System documentation

- [Feature index](docs/README.md)
- [Complete setup / how to turn HeatShield on](docs/SETUP.md)

## Data policy

HeatShield does not treat demo values as live evidence. Live weather and forecasts come from Open-Meteo. Thermal risk is calculated locally from temperature and humidity. Population exposure, vulnerability, and infrastructure scores are currently **not available** because authoritative datasets have not yet been connected. Cooling-zone identities are based on documented Delhi 2026 heat-relief reporting, while live occupancy/open-closed status is not claimed without a live source.

Open-Meteo's forecast API accepts latitude/longitude and requested weather variables and provides hourly forecast data; it does not require an API key for the public non-commercial API. See the [Open-Meteo documentation](https://open-meteo.com/en/docs).

## Architecture

```text
Browser
  |
  | HTTP
  v
FastAPI backend
  |
  +--> Open-Meteo Forecast API
  |      +--> current weather
  |      +--> hourly forecast
  |      +--> geocoding
  |
  +--> Open-Meteo Historical Weather API
  |
  +--> Thermal engine
  |      +--> heat index
  |      +--> thermal score
  |      +--> risk level
  |
  +--> PostgreSQL + PostGIS
  |      +--> reference geography
  |      +--> synchronized observations
  |
  +--> spatial / facilities / responder / alert services
  |
  v
HeatShield frontend
```

## Important limitation

The current operational risk score is **thermal-only**. The previous synthetic exposure, vulnerability, infrastructure, weather-history, facility-occupancy, and alert values are not presented as real data. Full composite risk will be enabled only after authoritative datasets are integrated and validated.

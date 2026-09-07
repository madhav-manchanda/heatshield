# HeatShield Documentation

This directory explains **what every feature does, how it works, where its data comes from, and which files implement it**.

## Feature documentation

1. [Live Dashboard & Current Risk](features/README-live-dashboard.md)
2. [Thermal-Risk Engine](features/README-thermal-risk.md)
3. [Forecast & Thermal Stress](features/README-forecast.md)
4. [Spatial Risk Map & History](features/README-spatial.md)
5. [Location Search & GPS](features/README-location.md)
6. [Cooling Facilities](features/README-facilities.md)
7. [Alerts](features/README-alerts.md)
8. [First-Responder Dashboard](features/README-responders.md)
9. [Interventions & What-If](features/README-interventions.md)
10. [Data Flow, Caching & Offline Mode](features/README-data-flow.md)

## Running the project

Use [SETUP.md](SETUP.md) for the complete startup, shutdown, troubleshooting, and verification procedure.

## Data-source policy

HeatShield uses three categories of information:

- **Fetched:** returned directly by an external source such as Open-Meteo.
- **Derived:** calculated by HeatShield from fetched data, such as heat index and thermal score.
- **Unavailable:** deliberately shown when a reliable authoritative source is not connected.

A number must never be presented as a real observation merely because it makes the UI look complete.

## Current external sources

### Open-Meteo Forecast API

Used for current weather, hourly forecast weather, multi-coordinate weather requests, and weather for arbitrary GPS locations. HeatShield requests temperature, relative humidity, apparent temperature, and wind speed.

Official documentation: https://open-meteo.com/en/docs

### Open-Meteo Geocoding API

Used by location search to turn a text query into geographic coordinates and place metadata.

Endpoint used by HeatShield: `https://geocoding-api.open-meteo.com/v1/search`

### Open-Meteo Historical Weather API

Used by the spatial history feature for historical hourly temperature, humidity, apparent temperature, and wind speed for a selected grid cell.

Endpoint used by HeatShield: `https://archive-api.open-meteo.com/v1/archive`

### Delhi 2026 heat-relief reporting

Used only for the identity/location of publicly reported cooling zones. HeatShield does not claim live occupancy or open/closed status without a live source.

## Core backend modules

- `backend/app/api/live.py` — live weather, location search, facilities, alerts, responders, interventions.
- `backend/app/api/spatial.py` — spatial grid, explanations, nearby facilities, historical weather.
- `backend/app/services/thermal/engine.py` — heat-index and thermal-risk calculations.
- `backend/app/services/live_sync.py` — periodic persistence of live weather/risk observations.
- `backend/app/main.py` — API startup, database preparation, PostGIS, cleanup of legacy synthetic records, and live sync startup.

## Core frontend modules

- `heatshield-frontend/main.js` — routing, navigation, header controls, location controls, page lifecycle.
- `heatshield-frontend/live.js` — backend-driven live dashboard/map/facility/alert/responder/intervention rendering.
- `heatshield-frontend/location.js` — search, GPS, arbitrary-location selection and location UI.
- `heatshield-frontend/api.js` — HTTP requests, cache, formatting, and connection state.
- `heatshield-frontend/pages/` — page shells for dashboard, risk map, interventions, and first responder views.

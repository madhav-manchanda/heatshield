# Spatial Risk Map & Historical Weather

## Purpose

The spatial feature divides the Delhi MVP area into a regular grid, calculates live thermal risk at each cell center, explains why a cell is risky, finds nearby verified cooling zones, and retrieves historical weather for a selected cell.

## Grid definition

Implementation:

```text
backend/app/api/spatial.py
```

Current Delhi MVP bounds:

```text
Latitude:  28.50 – 28.75
Longitude: 77.05 – 77.35
```

The area is divided into:

```text
10 rows × 12 columns = 120 cells
```

Each cell has:

- a cell code such as `DEL-01-01`
- center latitude/longitude
- geographic bounds

## Live grid data

Endpoint:

```text
GET /api/spatial/grid
```

For all 120 cell centers, the backend sends coordinates to Open-Meteo's multi-location forecast endpoint.

For each cell it receives:

- temperature
- humidity
- apparent temperature
- wind speed

HeatShield then calculates thermal risk locally.

Therefore the map is not using one copied district value for every cell: the current implementation requests weather for each grid-cell center.

## Why is this cell risky?

Endpoint:

```text
GET /api/spatial/why-risky?cell_code=DEL-01-01
```

The backend resolves the cell center, requests current weather for that coordinate, calculates thermal risk, and returns an explanation.

Current explanation is intentionally simple:

```text
Main driver: thermal stress
```

Population, vulnerability, and infrastructure are explicitly unavailable until authoritative spatial datasets are connected.

## Historical weather

Endpoint:

```text
GET /api/spatial/history?cell_code=DEL-01-01&days=7
```

Source:

```text
https://archive-api.open-meteo.com/v1/archive
```

The selected cell center is used as the historical-weather coordinate. HeatShield requests hourly:

- temperature
- relative humidity
- apparent temperature
- wind speed

The returned history is provider data; it is not reconstructed from the current database or synthetic seed records.

## Nearby facilities

Endpoint:

```text
GET /api/spatial/nearby?latitude=<lat>&longitude=<lon>&radius_km=5
```

The backend uses the Haversine distance formula to compare the requested point against the verified cooling-zone coordinates and returns facilities inside the requested radius.

## Frontend

Primary implementation:

```text
heatshield-frontend/live.js
heatshield-frontend/pages/risk-map.js
```

## Current limitation

The map is a **thermal-risk map**, not yet a complete socioeconomic vulnerability map. A future version can combine the live thermal surface with authoritative census, land-use, infrastructure, and population datasets after those datasets are integrated and validated.

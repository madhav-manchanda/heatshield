# Data Flow, Persistence, Cache & Offline Mode

## Purpose

This document explains how data moves through HeatShield and what happens when the backend or provider is unavailable.

## Live request flow

```text
Frontend
   |
   | GET /api/live/...
   v
FastAPI
   |
   +--> Open-Meteo
   |      |
   |      +--> weather JSON
   |
   +--> HeatShield calculation
   |      |
   |      +--> heat index
   |      +--> thermal score
   |      +--> risk level
   |
   v
JSON response
   |
   v
Frontend renderer
```

## Persistent synchronization

At backend startup, `backend/app/main.py` creates a background task running:

```text
backend/app/services/live_sync.py
```

The sync loop periodically fetches current weather for the five Delhi reference locations and persists real-source observations/risk calculations to PostgreSQL.

The current synchronization interval is five minutes.

## PostgreSQL + PostGIS

The project uses:

```text
postgis/postgis:17-3.5
```

from `backend/docker-compose.yml`.

PostGIS is enabled during backend startup.

The database stores persistent application data where appropriate, while live dashboard requests still obtain current weather from Open-Meteo.

## Legacy synthetic-data cleanup

Backend startup runs migration-style SQL that:

- adds source/provenance fields;
- makes unavailable socioeconomic values nullable;
- removes records tagged `legacy_unverified`;
- removes the former synthetic high-heat alert;
- removes the former synthetic facility records.

This prevents old demo values from silently surviving after the real-source-only conversion.

## Frontend cache

`heatshield-frontend/api.js` stores successful live responses in browser `localStorage` under:

```text
heatshield-live-cache-v2
```

The cache is a resilience mechanism, not a replacement for live data.

It stores the last successful response and its save timestamp.

## Offline behavior

When a live request fails:

1. the frontend checks its local cache;
2. if cached data exists, it displays it as **OFFLINE CACHED DATA**;
3. if no cache exists, it displays a live-data-unavailable state.

The connection badge distinguishes:

```text
CONNECTING
LIVE
OFFLINE
LIVE DATA UNAVAILABLE
```

## Why stale data is labeled

A cached weather response can become outdated. HeatShield therefore exposes the cache age rather than silently presenting it as current.

## Data provenance

The architecture distinguishes:

### Provider data

Examples:

- Open-Meteo temperature
- Open-Meteo humidity
- Open-Meteo apparent temperature
- Open-Meteo wind speed
- Open-Meteo forecast timestamps

### HeatShield-derived data

Examples:

- heat index
- thermal score
- risk level
- forecast peak
- responder priority
- HeatShield alert severity

### Public-record data

Examples:

- documented cooling-zone identity/location

### Unavailable data

Examples:

- live cooling-zone occupancy
- live facility open/closed status
- authoritative population exposure score
- authoritative vulnerability score
- authoritative infrastructure score

## Frontend files

- `api.js` — HTTP + cache utilities
- `live.js` — live data loading/rendering/status
- `main.js` — routing and page lifecycle

## Backend files

- `main.py` — startup/shutdown/database preparation
- `live_sync.py` — periodic persistence
- `live.py` — live external-data access
- `spatial.py` — spatial external-data access

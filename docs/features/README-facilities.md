# Cooling Facilities

## Purpose

The facilities feature shows publicly reported cooling-zone locations relevant to heat relief and helps users identify nearby locations.

## Current source

Facility identity/location comes from publicly reported **Delhi 2026 heat-relief operation records**.

The source is represented in the backend facility objects with provenance fields such as:

```text
source
source_url
verification_date
```

The current backend source reference is Delhi Government heat-relief reporting.

## Important data limitation

HeatShield does **not** currently have a live government feed for:

- current occupancy
- available seats
- open/closed state
- operating hours in real time

Therefore these fields are not fabricated.

A facility can have a known location and a documented nominal seating capacity while its current occupancy remains unavailable.

## API

```text
GET /api/live/facilities
```

The spatial nearby endpoint can filter these facilities by geographic distance:

```text
GET /api/spatial/nearby?latitude=<lat>&longitude=<lon>&radius_km=5
```

## Nearby calculation

HeatShield uses the Haversine formula to calculate geographic distance between the user's point and every known cooling-zone coordinate.

The results are sorted from nearest to farthest.

## Frontend

Facility rendering is primarily handled in:

```text
heatshield-frontend/live.js
```

## What would be needed for live status

A production-grade live facility status layer should consume an authoritative feed from the responsible authority or facility operator containing at least:

```text
facility_id
open_status
last_updated
capacity
current_occupancy
```

Until that exists, the UI must continue to label current status as unavailable rather than infer it from weather or stale records.

# Location Search & GPS

## Purpose

The location feature lets the user choose a known HeatShield reference location, search for another place, or use the browser's current GPS location.

## Known locations

The backend exposes reference locations through:

```text
GET /api/live/locations
```

These currently represent five Delhi weather reference points.

They are not hard-coded risk values. They provide coordinates used to request live weather.

## Text search

The frontend sends a search query to:

```text
GET /api/live/search?query=<text>
```

The backend calls the Open-Meteo Geocoding API:

```text
https://geocoding-api.open-meteo.com/v1/search
```

Returned information can include:

- place name
- country
- administrative areas
- latitude
- longitude
- timezone
- population when the geocoder provides it

The population field returned by geocoding must not be confused with HeatShield's exposure model. It is place metadata, not a vulnerability score.

## GPS

The browser's Geolocation API obtains latitude/longitude after the user grants permission.

The coordinates are sent to:

```text
GET /api/live/current?latitude=<lat>&longitude=<lon>
```

The backend requests live weather for that exact coordinate using Open-Meteo.

## GPS risk policy

Arbitrary GPS locations use:

```text
thermal-only risk
```

HeatShield does not attach Delhi-specific exposure, vulnerability, or infrastructure values to a location outside the known reference dataset. This prevents a misleading impression of hyperlocal socioeconomic precision where the necessary datasets do not exist.

## Nearest cooling zone

For an arbitrary GPS location, the backend calculates the nearest known cooling-zone location using Haversine distance and returns the distance in kilometres.

This is a geographic nearest-point calculation, not a claim that the facility is currently open or has free capacity.

## Frontend implementation

Primary files:

- `heatshield-frontend/location.js`
- `heatshield-frontend/main.js`
- `heatshield-frontend/live.js`

The header location selector is populated from the backend rather than maintaining a second independent list in the browser.

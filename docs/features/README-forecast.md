# Forecast & Thermal Stress

## Purpose

This feature shows how heat stress is expected to evolve over the next several days and identifies the highest near-term thermal-risk period.

## Data source

The backend calls:

```text
https://api.open-meteo.com/v1/forecast
```

through:

```text
backend/app/api/live.py -> fetch_weather()
```

The request asks Open-Meteo for five forecast days and hourly:

- temperature
- relative humidity
- apparent temperature
- wind speed

Open-Meteo documents its forecast endpoint as an hourly weather forecast API based on geographic coordinates and selected variables.

## Processing

For every returned hourly point:

```text
hourly temperature
       +
hourly humidity
       |
       v
heat index
       |
       v
thermal score
       |
       v
risk level
```

The same thermal engine is used for current conditions and forecast conditions. This keeps the risk calculation consistent between the dashboard and forecast views.

## Peak detection

The backend builds the hourly forecast and searches the upcoming forecast window for the highest `final_score`.

Because the live risk basis is thermal-only:

```text
peak final_score = peak thermal_score
```

## Frontend

The dashboard/live rendering is handled primarily by:

```text
heatshield-frontend/live.js
```

The navigation route `forecast-stress` currently uses the dashboard live data renderer, so forecast information is backed by the same live API rather than a separate hard-coded dataset.

## Important distinction

Forecast values are **model forecast values**, not future measurements. HeatShield should therefore describe them as forecast/expected conditions, not observations.

## Source status

The source and update time returned by the backend are displayed so users can distinguish live provider data from HeatShield-derived scores.

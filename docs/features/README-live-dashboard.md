# Live Dashboard & Current Risk

## What this feature does

The main dashboard shows the current environmental conditions and the current HeatShield thermal-risk classification for the selected location. It also exposes the near-term forecast, data source, update time, alerts, and cooling-zone information used by the UI.

## Data source

Primary source: **Open-Meteo Forecast API**.

Backend endpoint:

```text
GET /api/live/overview?location_id=<id>
```

The backend uses a fixed set of Delhi weather reference points:

- Central Delhi
- South Delhi
- East Delhi
- West Delhi
- North Delhi

These are geographic reference coordinates, not claims that the weather is measured by a physical HeatShield sensor at that exact point.

## What Open-Meteo provides

The backend requests:

- temperature at 2 m
- relative humidity at 2 m
- apparent temperature
- wind speed at 10 m
- hourly versions of the same variables

Open-Meteo's forecast API accepts geographic coordinates and requested variables and returns hourly forecast data.

## How the calculation works

```text
Open-Meteo current weather
        |
        +--> temperature + humidity
                    |
                    v
            Heat-index calculation
                    |
                    v
             Thermal score 0–100
                    |
                    v
              Risk classification
                    |
                    v
             Dashboard response
```

The current model is deliberately **thermal-only**. Exposure, vulnerability, and infrastructure are returned as unavailable instead of being filled with synthetic values.

## Peak risk

The backend examines the upcoming forecast window and selects the highest thermal score as the forecast peak. The dashboard displays this as the expected near-term thermal peak.

## Frontend implementation

Primary files:

- `heatshield-frontend/live.js`
- `heatshield-frontend/main.js`
- `heatshield-frontend/api.js`
- `heatshield-frontend/pages/dashboard.js`

`live.js` calls the backend, handles live/offline/error states, and renders the returned data. `api.js` provides the shared HTTP client and local cache.

## Refresh behavior

The frontend periodically refreshes the active live route. The backend also runs its persistence synchronization loop every five minutes.

## What is not claimed

The dashboard does **not** currently claim:

- real-time municipal population exposure
- real-time demographic vulnerability
- real-time infrastructure capacity
- sensor-level measurements
- emergency dispatch status

Those require additional authoritative sources.

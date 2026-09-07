# HeatShield Data Policy

HeatShield follows a **real-source-only** rule for operational data.

## Sources

| Data | Source | Status |
|---|---|---|
| Current weather | Open-Meteo Forecast API | Live |
| 5-day hourly weather | Open-Meteo Forecast API | Live forecast |
| Historical weather | Open-Meteo Historical Weather API | Live query |
| Location search | Open-Meteo Geocoding API | Live query |
| Delhi heat-response locations | Delhi 2026 heat-relief / Heat Action Plan public records | Verified public records; live occupancy is not published |
| Heat index / thermal score | HeatShield calculation from live temperature + humidity | Derived from live data |
| Risk-map weather cells | Open-Meteo multi-coordinate forecast | Live |

## What HeatShield no longer fabricates

The backend does not invent:

- population exposure scores
- vulnerability scores
- infrastructure scores
- cooling-centre occupancy
- cooling-centre availability
- shelter capacity when it is not publicly published
- intervention temperature/risk reductions
- responder dispatch status
- historical observations

When a required source is unavailable, the API returns `null`, `not_available`, or an explicit unavailable status instead of substituting a made-up number.

## Risk model status

The current operational risk score is **thermal-only**:

`final_score = thermal_score`

The composite exposure/vulnerability/infrastructure model is intentionally disabled until authoritative spatial datasets are integrated and validated.

## Cooling facilities

Cooling-zone identity is based on public Delhi 2026 heat-response reporting. HeatShield does not infer whether a centre is currently open or occupied from weather conditions. If the public source does not publish live status or occupancy, the UI displays that limitation.

## Important distinction

A HeatShield-derived value is not the same as an observed government value. Derived values are labelled as model output; source observations retain their provider/source attribution.

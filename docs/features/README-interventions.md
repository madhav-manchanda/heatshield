# Interventions & What-If

## Purpose

The interventions feature lets a user select hypothetical heat-mitigation actions and inspect the resulting HeatShield scenario calculation.

Current actions exposed by the backend are:

- shade
- water
- cooling

## API

```text
GET /api/live/interventions?location_id=1&shade=true&water=true&cooling=false
```

The backend first obtains live weather for the selected location and uses the same thermal-risk engine as the dashboard.

## Current modeling policy

The project previously contained synthetic-looking intervention reductions. Those should not be treated as measured effects.

The current feature therefore distinguishes between:

```text
current observed/provider weather
```

and

```text
hypothetical intervention scenario
```

No intervention should be described as an empirically validated reduction unless an evidence-backed intervention model is connected.

## Why this matters

For example, a cooling intervention could plausibly affect thermal exposure, but the amount of improvement depends on:

- duration
- affected population
- indoor/outdoor conditions
- shade geometry
- water availability
- ventilation
- baseline temperature/humidity
- implementation coverage

A fixed universal reduction would be misleading without calibration.

## Frontend

The page shell is:

```text
heatshield-frontend/pages/interventions.js
```

Live scenario rendering and API interaction are in:

```text
heatshield-frontend/live.js
```

## Future evidence-based model

A stronger implementation should store intervention assumptions with:

```text
intervention type
coverage
start time
end time
population affected
expected effect size
source/evidence
uncertainty
```

Then the what-if output can show a range or uncertainty interval rather than a false-precision single number.

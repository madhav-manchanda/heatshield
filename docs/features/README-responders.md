# First-Responder Dashboard

## Purpose

The responder feature ranks the known HeatShield reference locations by current thermal risk and suggests a broad response priority.

## API

```text
GET /api/live/responders
```

The endpoint calls the live risk-map service, sorts locations by descending thermal score, and assigns a priority rank.

## Decision logic

Current recommendation bands are:

```text
score >= 70  -> Immediate thermal-risk review
score >= 50  -> Stage response team
otherwise    -> Routine monitoring
```

These are **HeatShield recommendation rules**, not an official emergency-response protocol.

## Data source

The underlying weather comes from Open-Meteo. The risk score is calculated by HeatShield. No fabricated population, vulnerability, or infrastructure scores are used.

## Output

Each priority contains:

- rank
- location
- thermal score
- risk level
- suggested action
- risk basis
- operational note

The operational note explicitly states that the recommendation is not a live dispatch order.

## Frontend

The responder page is implemented primarily in:

```text
heatshield-frontend/live.js
heatshield-frontend/pages/first-responder.js
```

## Future production version

A real responder command system would require authoritative operational data such as:

- responder/team availability
- incident locations
- road closures
- ambulance/fire/police availability
- live facility capacity
- official incident priority rules

Those should be integrated as separate sourced datasets instead of being invented by the thermal model.

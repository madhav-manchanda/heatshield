# Alerts

## Purpose

The alerts feature converts current and near-term thermal conditions into concise notifications for the dashboard.

## Source

Alerts are **derived by HeatShield** from live Open-Meteo weather and the HeatShield thermal model.

They are not copied from a government emergency-alert feed.

## API

```text
GET /api/live/alerts
```

The endpoint first obtains the live Central Delhi overview, then creates:

1. a current thermal-risk alert;
2. a forecast-peak thermal-risk alert.

## Current alert logic

The current risk score is classified using the thermal thresholds documented in the thermal-risk README.

The alert message reports the derived thermal score and location.

## Forecast peak alert

The second alert uses the highest thermal score in the upcoming forecast window.

It communicates that a thermal peak is expected at the corresponding forecast timestamp.

## Source labeling

Alerts identify their source as:

```text
Open-Meteo + HeatShield thermal model
```

This distinction matters: the weather is externally sourced, while the alert severity and message are HeatShield-derived.

## Frontend

Alert rendering is handled by:

```text
heatshield-frontend/live.js
```

## Current limitations

These alerts are not official government emergency warnings and should not be interpreted as a dispatch order or medical warning system.

A future production integration can add authoritative IMD/DDMA/municipal alert feeds and preserve their source, issue time, expiry time, and severity separately from HeatShield's derived thermal alerts.

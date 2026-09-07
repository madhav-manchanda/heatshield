# Thermal-Risk Engine

## Purpose

The thermal engine converts live temperature and relative humidity into a transparent heat-stress measure.

Implementation:

```text
backend/app/services/thermal/engine.py
```

## Step 1 — Heat index

HeatShield uses the **NOAA/NWS Rothfusz heat-index equation** for typical hot/humid conditions.

Input:

```text
temperature_c
humidity
```

The temperature is converted to Fahrenheit for the Rothfusz equation and the result is converted back to Celsius.

When the input temperature is below the equation's hot-condition threshold, the current implementation returns the supplied temperature rather than applying the Rothfusz polynomial.

## Step 2 — Thermal score

The heat index is normalized to a 0–100 scale using the current MVP reference range:

```text
27°C -> 0
54°C -> 100
```

The result is clamped to 0–100.

```text
thermal_score = (heat_index - 27) / (54 - 27) * 100
```

## Step 3 — Risk level

Current thresholds:

| Score | Level |
|---:|---|
| 0–34.9 | Low |
| 35–59.9 | Moderate |
| 60–79.9 | High |
| 80–100 | Extreme |

## Current risk basis

The live system sets:

```text
final_score = thermal_score
risk_basis = thermal_only
data_completeness = weather_only
```

This is intentional. The older composite formula remains in the thermal engine for future validated integration, but live endpoints do not apply invented exposure/vulnerability/infrastructure values.

## Future composite model

The existing MVP function defines a transparent future baseline:

```text
45% thermal
25% exposure
20% vulnerability
10% infrastructure gap
```

Infrastructure is interpreted as access quality, so the model uses `100 - infrastructure` for the risk contribution.

This formula must not be treated as scientifically validated until its inputs, weights, and calibration are supported by authoritative data and validation work.

## Inputs and provenance

Temperature and humidity originate from Open-Meteo. Heat index, thermal score, and risk level are **derived values calculated by HeatShield**.

## Frontend

The frontend does not independently calculate the risk. It displays the backend's returned risk values so there is one source of calculation logic.

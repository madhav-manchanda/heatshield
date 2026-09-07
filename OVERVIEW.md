# HeatShield — Project Overview

## 1. What is HeatShield?

**HeatShield is a hyperlocal heat-risk decision-support system.**

Its purpose is to combine live weather data with spatial exposure, vulnerability, and infrastructure information to estimate heat risk, explain why an area is risky, forecast upcoming risk, and support practical response decisions.

The system is designed around the following flow:

```text
Live Weather + Forecast
          ↓
     FastAPI Backend
          ↓
 PostgreSQL + PostGIS
          ↓
    Heat Risk Engine
          ↓
 Grid-level Risk + Explanation
          ↓
 Forecasts + Alerts + Actions
          ↓
 Dashboard / Risk Map / GPS / Responders
```

---

## 2. Overall Architecture

```text
                    ┌──────────────────┐
                    │   Open-Meteo API │
                    │  Live Weather +  │
                    │    Forecast      │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │  FastAPI Backend │
                    │                  │
                    │ Data ingestion   │
                    │ Risk engine      │
                    │ Spatial analysis │
                    │ Alerts           │
                    │ Recommendations  │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 ↓                       ↓
       ┌──────────────────┐     ┌──────────────────┐
       │   PostgreSQL     │     │     PostGIS      │
       │                  │     │                  │
       │ Weather history  │     │ Grid polygons    │
       │ Risk scores      │     │ Location points  │
       │ Facilities       │     │ Distance queries │
       │ Alerts           │     │ Spatial analysis │
       └────────┬─────────┘     └────────┬─────────┘
                └──────────────┬─────────┘
                               ↓
                     ┌──────────────────┐
                     │    Frontend      │
                     │                  │
                     │ Dashboard        │
                     │ Risk Map         │
                     │ Forecast         │
                     │ Facilities       │
                     │ Alerts           │
                     │ Responders       │
                     │ Interventions    │
                     └──────────────────┘
```

---

## 3. Live Weather Data

HeatShield currently uses **Open-Meteo** as its live weather provider.

The backend requests:

- Temperature
- Relative humidity
- Apparent / feels-like temperature
- Wind speed
- Hourly forecast data
- Up to a 5-day forecast

The current weather is fetched by the backend rather than being hardcoded in the frontend.

```text
HeatShield
    ↓
Open-Meteo
    ↓
Current weather + hourly forecast
```

---

## 4. Heat Risk Engine

The heat-risk engine is the core calculation layer of HeatShield.

### Step 1 — Heat Index

Temperature and humidity are used to calculate heat index using the project's current NOAA/NWS Rothfusz heat-index implementation.

```text
Temperature + Humidity
          ↓
      Heat Index
```

### Step 2 — Thermal Stress

The heat index is normalized into a **0–100 thermal-stress score**.

### Step 3 — Composite Heat Risk

HeatShield combines several factors:

```text
45%  Thermal Stress
25%  Population Exposure
20%  Vulnerability
10%  Infrastructure Gap
```

Infrastructure is treated as a protective factor, so better heat-protection infrastructure reduces the overall risk.

The resulting score is normalized to **0–100** and classified as:

| Score | Risk level |
|---:|---|
| 0–34.9 | Low |
| 35–59.9 | Moderate |
| 60–79.9 | High |
| 80–100 | Extreme |

---

## 5. Explainable Heat Risk

HeatShield does not only produce a final number. It also explains the factors contributing to risk.

The explanation layer identifies contributions from:

- Thermal stress
- Population exposure
- Vulnerability
- Infrastructure gap

It also identifies the **main driver** of the current risk.

Example:

```text
Risk Score: 87 / 100

Main Driver:
Extreme thermal stress

Contributing factors:
• Extreme thermal stress
• High population exposure
• High vulnerability
• Limited heat-protection infrastructure
```

This makes the risk model more transparent and useful for decision-making.

---

## 6. Grid-Level Risk Map

Instead of representing Delhi only through a few fixed locations, HeatShield creates a spatial grid over the current MVP analysis area.

The current grid contains:

```text
10 rows × 12 columns = 120 grid cells
```

Each grid cell is stored as a **PostGIS polygon**.

Conceptually:

```text
┌────┬────┬────┬────┬────┐
│ 72 │ 81 │ 88 │ 91 │ 76 │
├────┼────┼────┼────┼────┤
│ 65 │ 79 │ 94 │ 87 │ 71 │
├────┼────┼────┼────┼────┤
│ 54 │ 68 │ 83 │ 89 │ 63 │
├────┼────┼────┼────┼────┤
│ 48 │ 61 │ 77 │ 80 │ 58 │
└────┴────┴────┴────┴────┘
```

Every cell has spatial coordinates and modeled exposure, vulnerability, and infrastructure values.

### Current MVP limitation

The grid is spatially real, but the current weather value for each grid is obtained from the nearest live reference weather location. It is **not** 120 independent weather measurements.

This allows the project to demonstrate the PostGIS/grid architecture without claiming unavailable sensor coverage.

---

## 7. Why Is This Area Risky?

For a selected grid cell, HeatShield can explain why its risk is high or low.

For example:

> **This area is risky mainly because of extreme thermal stress.**
>
> Other contributing factors include high population exposure and limited heat-protection infrastructure.

This feature connects the numerical risk score to understandable causes.

---

## 8. PostGIS Spatial Analysis

PostGIS is used to give PostgreSQL spatial capabilities.

HeatShield stores spatial objects such as:

```text
Location  → POINT
Facility  → POINT
GridCell  → POLYGON
```

PostGIS enables operations such as:

- Finding the grid containing a location
- Finding nearby facilities
- Calculating geographic distance
- Performing radius-based searches
- Supporting future spatial intersection and exposure analysis

For example:

```text
User GPS
   ↓
PostGIS
   ↓
Find nearby facilities
   ↓
Find relevant grid
   ↓
Read current risk
   ↓
Return recommendations
```

---

## 9. 3–5 Day Forecast and Peak Risk

HeatShield runs forecast weather through the same heat-risk engine.

```text
Forecast Weather
      ↓
Heat Index
      ↓
Thermal Stress
      ↓
Exposure + Vulnerability + Infrastructure
      ↓
Future Risk Score
```

The system can identify the expected **peak upcoming risk** so users and responders can prepare before conditions become most dangerous.

---

## 10. Automatic Synchronization

The backend runs an automatic live synchronization loop.

The current synchronization interval is **5 minutes**.

```text
Every 5 minutes
      ↓
Fetch latest weather
      ↓
Calculate risk
      ↓
Store observations
      ↓
Update HeatShield
```

This allows the system to continuously update instead of relying on manually entered weather values.

---

## 11. Automatic Alerts

HeatShield evaluates current and forecast risk and generates alerts.

Alerts can communicate:

- Current heat-risk severity
- Forecast peak risk
- Affected location
- Risk score
- Recommended response context

Example:

```text
⚠️ HIGH HEAT RISK

Central Delhi
Risk: 82 / 100

Recommended:
• Reduce outdoor exposure
• Prioritize vulnerable populations
• Activate cooling resources
```

---

## 12. Recommended Actions

HeatShield is intended to be a decision-support system rather than only a visualization dashboard.

For high-risk conditions, the system can guide actions such as:

### Public-facing actions

- Reduce prolonged outdoor exposure
- Stay hydrated
- Use available cooling facilities
- Check on vulnerable people

### Responder actions

- Prioritize high-risk grids
- Stage response teams
- Monitor vulnerable areas
- Direct resources toward high-exposure locations

---

## 13. Cooling Centres and Shelters

HeatShield maintains facility information including:

- Name
- Facility type
- Latitude and longitude
- Capacity
- Occupancy
- Availability/status

Example:

```text
Cooling Centre — Central

180 / 250 occupied
70 available

AVAILABLE
```

### Current MVP limitation

The current facility records are registered/sample MVP facilities. They should not be interpreted as a complete or officially verified list of every Delhi cooling centre or shelter.

---

## 14. GPS and Nearby Facilities

The frontend can use the user's browser location.

```text
User selects "Use My Location"
          ↓
Browser obtains GPS coordinates
          ↓
FastAPI
          ↓
PostGIS spatial query
          ↓
Nearby facilities
          ↓
Sorted by distance
```

This supports location-aware recommendations such as nearby cooling centres and shelters.

---

## 15. Exposed Population

Each grid has an exposure score that helps identify areas where heat conditions may affect a larger or more exposed population.

Grid cells can be categorized as:

```text
Highly exposed
Moderately exposed
Lower exposure
```

Combining exposure with heat risk allows HeatShield to answer a more useful question than temperature alone:

> **Where is the heat dangerous and where is population exposure high?**

### Current MVP limitation

The current exposure, vulnerability, and infrastructure values are reference/MVP values. They are not being represented as live government population measurements.

---

## 16. First-Responder Priorities

The responder view ranks locations by their current modeled risk.

Conceptually:

```text
1. Highest-risk location   → Immediate field dispatch
2. High-risk location      → Stage response team
3. Moderate-risk location  → Routine monitoring
```

This converts the risk model into a resource-prioritization workflow.

---

## 17. What-If Intervention Simulator

HeatShield includes a basic intervention simulator where users can test modeled interventions such as:

- Shade
- Water
- Cooling resources

The system calculates a projected risk score after the selected intervention assumptions.

```text
Current Risk
     ↓
Select intervention
     ↓
Projected Risk
     ↓
Estimated reduction
```

The intervention reductions are currently deterministic MVP assumptions, not measured causal effects.

---

## 18. Historical Heat Data

Synchronized weather observations are stored in PostgreSQL.

This provides a foundation for historical analysis such as:

- Previous temperature
- Humidity
- Apparent temperature
- Historical observations for a selected area
- Heat-exposure trends over time

As the system collects more observations, this historical layer becomes more useful for identifying recurring heat patterns.

---

## 19. Offline Mode

HeatShield stores the last successful live response in the browser.

If the network becomes unavailable:

```text
Internet
   ↓
   ❌

HeatShield
   ↓
Last cached data
   ↓
Display previous information
```

The interface can indicate that the information is cached rather than live.

When the connection returns:

```text
Connection restored
       ↓
Fetch latest data
       ↓
Update cache
       ↓
Return to live mode
```

Offline mode is therefore intended as a **last-known-data fallback**, not as a replacement for live data.

---

## 20. Frontend ↔ Backend Communication

The frontend communicates with the FastAPI backend through REST endpoints.

A simplified request flow is:

```text
Frontend
   │
   │ GET /api/live/overview
   ↓
FastAPI
   │
   ├── Open-Meteo
   ├── Heat Risk Engine
   └── PostgreSQL/PostGIS
   │
   ↓
JSON response
   │
   ↓
Frontend UI
```

Important API areas include:

```text
/api/live/overview
/api/live/risk-map
/api/live/facilities
/api/live/alerts
/api/live/responders
/api/live/interventions

/api/spatial/grid
/api/spatial/why-risky
/api/spatial/nearby
/api/spatial/history
```

---

## 21. Database Structure

The backend uses SQLAlchemy models with PostgreSQL.

The main data concepts are:

```text
locations
    │
    ├── weather
    │
    └── risk_scores

facilities

alerts

grid_cells
```

Spatial fields are represented with PostGIS geometry:

```text
Location  → POINT
Facility  → POINT
GridCell  → POLYGON
```

---

## 22. Technology Stack

### Frontend

- HTML
- JavaScript
- Tailwind CSS
- Map/GIS components

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Pandas
- NumPy
- HTTPX

### Database

- PostgreSQL
- PostGIS

### External data

- Open-Meteo

### Infrastructure

- Docker
- Docker Compose

---

## 23. Main User Experience

When a user opens HeatShield, the high-level process is:

```text
USER OPENS HEATSHIELD
          ↓
Request live data
          ↓
FastAPI
          ↓
Live weather + forecast
          ↓
Heat Risk Engine
          ↓
Thermal Stress
          ↓
Exposure / Vulnerability / Infrastructure
          ↓
Final Risk Score
          ↓
PostgreSQL + PostGIS
          ↓
Frontend
          ↓
┌────────────┬────────────┬─────────────┐
│ Dashboard  │ Risk Map   │ Forecast    │
├────────────┼────────────┼─────────────┤
│ Alerts     │ Facilities │ Responders  │
├────────────┼────────────┼─────────────┤
│ GPS        │ History    │ Interventions│
└────────────┴────────────┴─────────────┘
```

---

## 24. What HeatShield Can Answer

HeatShield is designed to answer five important questions:

### 🌡️ What is happening?

> What is the current heat risk?

### 📍 Where?

> Which grid areas currently have the highest risk?

### ❓ Why?

> What factors are causing the area's risk?

### 🔮 What's next?

> When is the upcoming peak risk expected?

### 🚑 What should be done?

> Which areas and facilities should users or responders prioritize?

---

## 25. Features Included

### Core

- ✅ Live weather data
- ✅ Heat-index calculation
- ✅ Thermal-stress scoring
- ✅ Composite heat-risk scoring
- ✅ Explainable risk scoring
- ✅ Grid-level risk analysis
- ✅ PostGIS spatial database
- ✅ 3–5 day forecast
- ✅ Peak-risk detection
- ✅ Automatic synchronization
- ✅ Automatic alerts
- ✅ Recommended response actions
- ✅ Cooling centre / shelter information
- ✅ GPS-based nearby facility search
- ✅ Population exposure layer
- ✅ First-responder prioritization
- ✅ What-if intervention simulation
- ✅ Historical weather observations
- ✅ Offline last-known-data mode

### Intentionally not included yet

- ❌ ML-based prediction
- ❌ Google Maps heat-aware routing

These are not required for the core HeatShield system. ML can be added after enough historical data has been collected, allowing a meaningful comparison between a machine-learning model and the current deterministic model.

---

## 26. Current MVP Limitations

HeatShield currently has several deliberate MVP limitations:

1. The 120-cell grid uses the nearest live reference weather location rather than 120 independent weather measurements.
2. Exposure, vulnerability, and infrastructure values are reference/MVP values and should later be replaced or calibrated with authoritative datasets.
3. Current cooling-centre/facility records are MVP registered/sample data rather than a complete verified municipal directory.
4. Historical analysis becomes more meaningful as more synchronized observations accumulate.
5. The intervention simulator uses deterministic assumptions and should not be interpreted as measured real-world intervention effectiveness.

These limitations are intentionally documented so the system does not claim data or precision that it does not currently have.

---

## 27. Project Vision

The long-term goal of HeatShield is to become a hyperlocal heat-response platform where spatially detailed environmental and population data can continuously inform:

```text
DETECTION
   ↓
RISK ASSESSMENT
   ↓
EXPLANATION
   ↓
FORECAST
   ↓
ALERT
   ↓
RECOMMENDATION
   ↓
RESOURCE PRIORITIZATION
```

The current architecture provides the foundation for adding denser weather/satellite datasets, authoritative population and infrastructure data, more advanced spatial modeling, and eventually machine-learning forecasting without replacing the transparent baseline risk engine.

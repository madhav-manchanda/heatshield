from math import inf


def _f(celsius: float) -> float:
    return celsius * 9 / 5 + 32


def _c(fahrenheit: float) -> float:
    return (fahrenheit - 32) * 5 / 9


def heat_index_celsius(temperature_c: float, humidity: float) -> float:
    """NOAA/NWS Rothfusz heat-index equation for typical hot/humid conditions."""
    t = _f(temperature_c)
    r = humidity
    if t < 80:
        return temperature_c
    hi = (-42.379 + 2.04901523*t + 10.14333127*r - 0.22475541*t*r
          - 0.00683783*t*t - 0.05481717*r*r + 0.00122874*t*t*r
          + 0.00085282*t*r*r - 0.00000199*t*t*r*r)
    return round(_c(hi), 2)


def thermal_score(heat_index_c: float) -> float:
    """Normalize heat index into a 0-100 thermal-stress score."""
    # Reference range used by this MVP: 27C (low) to 54C (very extreme).
    score = (heat_index_c - 27) / (54 - 27) * 100
    return round(max(0, min(100, score)), 1)


def risk_level(score: float) -> str:
    if score >= 80:
        return "extreme"
    if score >= 60:
        return "high"
    if score >= 35:
        return "moderate"
    return "low"


def composite_risk(thermal: float, exposure: float, vulnerability: float, infrastructure: float) -> float:
    """Transparent MVP model. Infrastructure is access quality, so it reduces risk."""
    score = 0.45 * thermal + 0.25 * exposure + 0.20 * vulnerability + 0.10 * (100 - infrastructure)
    return round(max(0, min(100, score)), 1)

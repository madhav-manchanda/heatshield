from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class WeatherOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    location_id: int
    timestamp: datetime
    temperature: float
    humidity: float
    wind_speed: float
    apparent_temperature: float | None = None
    data_source: str


class RiskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    location_id: int
    timestamp: datetime
    thermal_score: float
    exposure_score: float | None = None
    vulnerability_score: float | None = None
    infrastructure_score: float | None = None
    final_score: float
    risk_level: str
    risk_basis: str
    data_source: str


class FacilityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    type: str
    latitude: float
    longitude: float
    capacity: int | None = None
    occupancy: int | None = None
    status: str
    data_source: str


class AreaOut(BaseModel):
    id: int
    name: str
    district: str
    latitude: float
    longitude: float
    risk: RiskOut | None = None


class AlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    location_id: int | None
    severity: str
    message: str
    created_at: datetime
    active: bool


class WeatherInput(BaseModel):
    location_id: int
    temperature: float = Field(ge=-50, le=70)
    humidity: float = Field(ge=0, le=100)
    wind_speed: float = Field(ge=0, le=200)

from __future__ import annotations
from datetime import datetime
from geoalchemy2 import Geometry
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


class Location(Base):
    __tablename__ = "locations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    district: Mapped[str] = mapped_column(String(120), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    geom: Mapped[object] = mapped_column(Geometry("POINT", srid=4326, spatial_index=True), nullable=True)
    weather: Mapped[list[Weather]] = relationship(back_populates="location", cascade="all, delete-orphan")
    risks: Mapped[list[RiskScore]] = relationship(back_populates="location", cascade="all, delete-orphan")


class GridCell(Base):
    __tablename__ = "grid_cells"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    cell_code: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    geom: Mapped[object] = mapped_column(Geometry("POLYGON", srid=4326, spatial_index=True), nullable=False)
    center_latitude: Mapped[float] = mapped_column(Float, nullable=False)
    center_longitude: Mapped[float] = mapped_column(Float, nullable=False)
    exposure_score: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    vulnerability_score: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    infrastructure_score: Mapped[float] = mapped_column(Float, nullable=False, default=0)


class Weather(Base):
    __tablename__ = "weather"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    temperature: Mapped[float] = mapped_column(Float, nullable=False)
    humidity: Mapped[float] = mapped_column(Float, nullable=False)
    wind_speed: Mapped[float] = mapped_column(Float, default=0)
    apparent_temperature: Mapped[float | None] = mapped_column(Float, nullable=True)
    location: Mapped[Location] = relationship(back_populates="weather")


class RiskScore(Base):
    __tablename__ = "risk_scores"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    thermal_score: Mapped[float] = mapped_column(Float, nullable=False)
    exposure_score: Mapped[float] = mapped_column(Float, nullable=False)
    vulnerability_score: Mapped[float] = mapped_column(Float, nullable=False)
    infrastructure_score: Mapped[float] = mapped_column(Float, nullable=False)
    final_score: Mapped[float] = mapped_column(Float, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False)
    location: Mapped[Location] = relationship(back_populates="risks")


class Facility(Base):
    __tablename__ = "facilities"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    type: Mapped[str] = mapped_column(String(80), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    geom: Mapped[object] = mapped_column(Geometry("POINT", srid=4326, spatial_index=True), nullable=True)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    occupancy: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="available")


class Alert(Base):
    __tablename__ = "alerts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    location_id: Mapped[int | None] = mapped_column(ForeignKey("locations.id"), nullable=True)
    severity: Mapped[str] = mapped_column(String(20), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    active: Mapped[bool] = mapped_column(default=True)

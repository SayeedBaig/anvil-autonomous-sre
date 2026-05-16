from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default="user") # "user" or "admin"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    services = relationship("ConnectedService", back_populates="owner")

class ConnectedService(Base):
    __tablename__ = "connected_services"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    url = Column(String)
    environment = Column(String)  # staging, production, dev
    status = Column(String, default="active")  # active, inactive, error
    is_monitored = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="services")
    incidents = relationship("Incident", back_populates="service")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("connected_services.id"))
    type = Column(String)  # latency_spike, deployment_failure, etc.
    status = Column(String)  # detecting, analyzing, remediating, resolved
    rca = Column(String, nullable=True)
    remediation_plan = Column(String, nullable=True)
    confidence_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    service = relationship("ConnectedService", back_populates="incidents")

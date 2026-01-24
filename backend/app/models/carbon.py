"""
SQLAlchemy models for carbon emissions tracking
Stores CO₂ emissions calculated from energy consumption
"""
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class CarbonEmission(Base):
    """
    Tracks CO₂ emissions for AI workloads
    
    This model stores cumulative carbon emissions calculated from energy
    consumption using region-specific carbon intensity factors.
    
    Formula: CO₂ (kg) = Energy (kWh) × Carbon Intensity (kg CO₂ / kWh)
    
    Carbon intensity varies by region:
    - EU: 0.25 kg CO₂/kWh (cleaner energy mix)
    - US: 0.40 kg CO₂/kWh (mixed sources)
    - India: 0.70 kg CO₂/kWh (higher fossil fuel use)
    
    This data supports ESG reporting and sustainability strategy.
    """
    __tablename__ = "carbon_emissions"
    
    id = Column(Integer, primary_key=True, index=True)
    workload_id = Column(Integer, ForeignKey("ai_workloads.id"), nullable=False, unique=True)
    
    # Cloud region (determines carbon intensity)
    region = Column(String, nullable=False)
    
    # Energy consumption (from energy_usage table)
    energy_kwh = Column(Float, default=0.0, nullable=False)
    
    # Cumulative CO₂ emissions in kilograms
    carbon_kg = Column(Float, default=0.0, nullable=False)
    
    # Timestamp tracking
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationship to workload
    workload = relationship("AIWorkload", backref="carbon_emission")
    
    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            "id": self.id,
            "workload_id": self.workload_id,
            "region": self.region,
            "energy_kwh": round(self.energy_kwh, 4),
            "carbon_kg": round(self.carbon_kg, 4),
            "created_at": self.created_at.isoformat(),
            "last_updated": self.last_updated.isoformat()
        }

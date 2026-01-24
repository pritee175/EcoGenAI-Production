"""
SQLAlchemy models for energy consumption tracking
Stores estimated energy usage for ESG reporting
"""
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class EnergyUsage(Base):
    """
    Tracks energy consumption for AI workloads
    
    This model stores cumulative energy estimates for ESG compliance.
    Energy values are calculated using industry-standard power coefficients
    and updated in real-time as workloads run.
    
    Note: These are estimates based on GPU count and runtime, not direct
    hardware telemetry. This approach is standard for cloud-based AI systems
    where direct power measurement is not accessible.
    """
    __tablename__ = "energy_usage"
    
    id = Column(Integer, primary_key=True, index=True)
    workload_id = Column(Integer, ForeignKey("ai_workloads.id"), nullable=False, unique=True)
    
    # Cumulative energy consumption in kilowatt-hours (kWh)
    energy_kwh = Column(Float, default=0.0, nullable=False)
    
    # Timestamp tracking
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationship to workload
    workload = relationship("AIWorkload", backref="energy_usage")
    
    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            "id": self.id,
            "workload_id": self.workload_id,
            "energy_kwh": round(self.energy_kwh, 4),
            "created_at": self.created_at.isoformat(),
            "last_updated": self.last_updated.isoformat()
        }

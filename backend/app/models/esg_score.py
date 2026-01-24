"""
ESG Score Model
Stores historical ESG sustainability scores for tracking and reporting
"""
from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.sql import func
from ..database import Base

class ESGScore(Base):
    """
    ESG Score tracking model
    
    Stores composite sustainability scores calculated from:
    - Carbon emissions efficiency
    - Energy consumption efficiency
    - Optimization adoption rate
    - Regional sustainability (low-carbon region usage)
    
    Enables historical tracking and trend analysis for ESG reporting.
    """
    __tablename__ = "esg_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float, nullable=False)  # Overall ESG score (0-100)
    score_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    # Breakdown of score components (stored as JSON for flexibility)
    breakdown_json = Column(JSON, nullable=False)
    # Example structure:
    # {
    #   "carbon_efficiency_score": 75.5,
    #   "energy_efficiency_score": 82.3,
    #   "optimization_adoption_score": 60.0,
    #   "regional_sustainability_score": 90.0,
    #   "carbon_weight": 0.40,
    #   "energy_weight": 0.30,
    #   "optimization_weight": 0.20,
    #   "regional_weight": 0.10,
    #   "total_carbon_kg": 5.234,
    #   "total_energy_kwh": 12.456,
    #   "total_workloads": 10,
    #   "low_carbon_region_percentage": 70.0,
    #   "optimization_opportunities": 8,
    #   "recommendations_adopted": 0
    # }
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        """Convert ESG score to dictionary"""
        return {
            "id": self.id,
            "score": round(self.score, 2),
            "score_date": self.score_date.isoformat() if self.score_date else None,
            "breakdown": self.breakdown_json,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

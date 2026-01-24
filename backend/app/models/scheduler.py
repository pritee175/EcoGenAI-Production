"""
Green-Time Scheduler Models
Schedule workloads during low-carbon electricity periods
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from ..database import Base

class GreenTimeWindow(Base):
    """Low-carbon time windows for workload scheduling"""
    __tablename__ = "green_time_windows"
    
    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, index=True)
    day_of_week = Column(Integer)  # 0=Monday, 6=Sunday
    start_hour = Column(Integer)  # 0-23
    end_hour = Column(Integer)  # 0-23
    carbon_intensity = Column(Float)  # kg CO2/kWh
    renewable_percentage = Column(Float)  # 0-100
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "region": self.region,
            "day_of_week": self.day_of_week,
            "start_hour": self.start_hour,
            "end_hour": self.end_hour,
            "carbon_intensity": self.carbon_intensity,
            "renewable_percentage": self.renewable_percentage,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class ScheduledWorkload(Base):
    """Workloads scheduled for green-time execution"""
    __tablename__ = "scheduled_workloads"
    
    id = Column(Integer, primary_key=True, index=True)
    workload_id = Column(Integer, index=True, nullable=True)
    model_name = Column(String)
    job_type = Column(String)
    gpu_count = Column(Integer)
    preferred_region = Column(String)
    scheduled_time = Column(DateTime(timezone=True))
    actual_start_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="SCHEDULED")  # SCHEDULED, RUNNING, COMPLETED, CANCELLED
    carbon_saved_kg = Column(Float, default=0.0)
    scheduling_reason = Column(String)
    created_by = Column(String, default="System")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "workload_id": self.workload_id,
            "model_name": self.model_name,
            "job_type": self.job_type,
            "gpu_count": self.gpu_count,
            "preferred_region": self.preferred_region,
            "scheduled_time": self.scheduled_time.isoformat() if self.scheduled_time else None,
            "actual_start_time": self.actual_start_time.isoformat() if self.actual_start_time else None,
            "status": self.status,
            "carbon_saved_kg": self.carbon_saved_kg,
            "scheduling_reason": self.scheduling_reason,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class AutopilotAction(Base):
    """Carbon Autopilot automated actions"""
    __tablename__ = "autopilot_actions"
    
    id = Column(Integer, primary_key=True, index=True)
    workload_id = Column(Integer, index=True)
    action_type = Column(String)  # PAUSE_IDLE, SCALE_DOWN, TERMINATE
    reason = Column(String)
    idle_duration_minutes = Column(Integer)
    carbon_saved_kg = Column(Float, default=0.0)
    energy_saved_kwh = Column(Float, default=0.0)
    cost_saved_usd = Column(Float, default=0.0)
    executed_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="EXECUTED")  # EXECUTED, REVERTED
    
    def to_dict(self):
        return {
            "id": self.id,
            "workload_id": self.workload_id,
            "action_type": self.action_type,
            "reason": self.reason,
            "idle_duration_minutes": self.idle_duration_minutes,
            "carbon_saved_kg": self.carbon_saved_kg,
            "energy_saved_kwh": self.energy_saved_kwh,
            "cost_saved_usd": self.cost_saved_usd,
            "executed_at": self.executed_at.isoformat() if self.executed_at else None,
            "status": self.status
        }

class TeamEcoScore(Base):
    """Gamification: Team-based eco-scores"""
    __tablename__ = "team_eco_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    team_name = Column(String, index=True)
    score = Column(Integer, default=0)
    carbon_saved_kg = Column(Float, default=0.0)
    energy_saved_kwh = Column(Float, default=0.0)
    optimizations_adopted = Column(Integer, default=0)
    badges = Column(JSON, default=list)  # List of earned badges
    rank = Column(Integer, nullable=True)
    month = Column(String, index=True)  # YYYY-MM format
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "team_name": self.team_name,
            "score": self.score,
            "carbon_saved_kg": self.carbon_saved_kg,
            "energy_saved_kwh": self.energy_saved_kwh,
            "optimizations_adopted": self.optimizations_adopted,
            "badges": self.badges or [],
            "rank": self.rank,
            "month": self.month,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class ClimateRiskScore(Base):
    """Climate Risk Simulator: Predictive climate impact scores"""
    __tablename__ = "climate_risk_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    score_date = Column(DateTime(timezone=True), server_default=func.now())
    risk_score = Column(Float)  # 0-100, higher = more risk
    total_emissions_kg = Column(Float)
    emissions_trend = Column(String)  # INCREASING, STABLE, DECREASING
    projected_annual_emissions_kg = Column(Float)
    climate_impact_category = Column(String)  # LOW, MODERATE, HIGH, CRITICAL
    risk_factors = Column(JSON)
    mitigation_recommendations = Column(JSON)
    
    def to_dict(self):
        return {
            "id": self.id,
            "score_date": self.score_date.isoformat() if self.score_date else None,
            "risk_score": self.risk_score,
            "total_emissions_kg": self.total_emissions_kg,
            "emissions_trend": self.emissions_trend,
            "projected_annual_emissions_kg": self.projected_annual_emissions_kg,
            "climate_impact_category": self.climate_impact_category,
            "risk_factors": self.risk_factors or {},
            "mitigation_recommendations": self.mitigation_recommendations or []
        }

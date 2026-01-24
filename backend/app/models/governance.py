"""
Governance & Approval Workflow Models
Enterprise-grade approval system for sustainability actions
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Enum as SQLEnum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum
from ..database import Base

class ActionType(str, Enum):
    """Types of sustainability actions"""
    REGION_MIGRATION = "REGION_MIGRATION"
    MODEL_OPTIMIZATION = "MODEL_OPTIMIZATION"
    TIME_SCHEDULING = "TIME_SCHEDULING"
    RESOURCE_SCALING = "RESOURCE_SCALING"
    WORKLOAD_PAUSE = "WORKLOAD_PAUSE"

class ApprovalStatus(str, Enum):
    """Approval workflow statuses"""
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    EXECUTED = "EXECUTED"
    FAILED = "FAILED"

class ActionRequest(Base):
    """
    Action Request Model
    
    Stores sustainability action requests that require approval.
    Implements enterprise-grade governance workflow with full audit trail.
    """
    __tablename__ = "action_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Action details
    action_type = Column(SQLEnum(ActionType), nullable=False)
    workload_id = Column(Integer, ForeignKey("ai_workloads.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    
    # Impact estimates
    estimated_carbon_saving_kg = Column(Float, default=0.0)
    estimated_energy_saving_kwh = Column(Float, default=0.0)
    estimated_cost_impact_usd = Column(Float, default=0.0)  # Negative = savings, Positive = cost
    
    # Technical details (stored as JSON for flexibility)
    technical_details = Column(JSON, nullable=False)
    # Example: {
    #   "current_region": "India",
    #   "target_region": "EU",
    #   "model_name": "PolicyGPT",
    #   "current_model_size": "large",
    #   "recommended_model_size": "medium"
    # }
    
    # Approval workflow
    status = Column(SQLEnum(ApprovalStatus), default=ApprovalStatus.PENDING, nullable=False, index=True)
    requested_by = Column(String, default="System", nullable=False)
    requested_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    reviewed_by = Column(String, nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    review_notes = Column(String, nullable=True)
    
    executed_at = Column(DateTime(timezone=True), nullable=True)
    execution_result = Column(JSON, nullable=True)
    
    # Audit trail
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    workload = relationship("AIWorkload", foreign_keys=[workload_id])
    
    def to_dict(self):
        """Convert action request to dictionary"""
        return {
            "id": self.id,
            "action_type": self.action_type.value if self.action_type else None,
            "workload_id": self.workload_id,
            "title": self.title,
            "description": self.description,
            "estimated_carbon_saving_kg": round(self.estimated_carbon_saving_kg, 4),
            "estimated_energy_saving_kwh": round(self.estimated_energy_saving_kwh, 4),
            "estimated_cost_impact_usd": round(self.estimated_cost_impact_usd, 2),
            "technical_details": self.technical_details,
            "status": self.status.value if self.status else None,
            "requested_by": self.requested_by,
            "requested_at": self.requested_at.isoformat() if self.requested_at else None,
            "reviewed_by": self.reviewed_by,
            "reviewed_at": self.reviewed_at.isoformat() if self.reviewed_at else None,
            "review_notes": self.review_notes,
            "executed_at": self.executed_at.isoformat() if self.executed_at else None,
            "execution_result": self.execution_result,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class CostImpactAnalysis(Base):
    """
    Cost Impact Analysis Model
    
    Stores cost vs carbon trade-off analysis for decision support.
    Enables leadership to evaluate business impact of sustainability actions.
    """
    __tablename__ = "cost_impact_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Analysis period
    analysis_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    
    # Carbon metrics
    total_carbon_kg = Column(Float, default=0.0)
    potential_carbon_savings_kg = Column(Float, default=0.0)
    
    # Cost metrics (USD)
    current_cloud_cost_usd = Column(Float, default=0.0)
    potential_cost_savings_usd = Column(Float, default=0.0)
    optimization_implementation_cost_usd = Column(Float, default=0.0)
    
    # ROI calculation
    net_cost_impact_usd = Column(Float, default=0.0)  # savings - implementation cost
    carbon_reduction_percentage = Column(Float, default=0.0)
    cost_per_kg_carbon_saved = Column(Float, default=0.0)
    roi_months = Column(Float, default=0.0)  # Payback period
    
    # Breakdown by action type (JSON)
    action_breakdown = Column(JSON, nullable=True)
    # Example: {
    #   "region_migration": {"carbon_saving": 1.2, "cost_impact": -50},
    #   "model_optimization": {"carbon_saving": 0.8, "cost_impact": -30}
    # }
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        """Convert cost analysis to dictionary"""
        return {
            "id": self.id,
            "analysis_date": self.analysis_date.isoformat() if self.analysis_date else None,
            "period_start": self.period_start.isoformat() if self.period_start else None,
            "period_end": self.period_end.isoformat() if self.period_end else None,
            "total_carbon_kg": round(self.total_carbon_kg, 4),
            "potential_carbon_savings_kg": round(self.potential_carbon_savings_kg, 4),
            "current_cloud_cost_usd": round(self.current_cloud_cost_usd, 2),
            "potential_cost_savings_usd": round(self.potential_cost_savings_usd, 2),
            "optimization_implementation_cost_usd": round(self.optimization_implementation_cost_usd, 2),
            "net_cost_impact_usd": round(self.net_cost_impact_usd, 2),
            "carbon_reduction_percentage": round(self.carbon_reduction_percentage, 2),
            "cost_per_kg_carbon_saved": round(self.cost_per_kg_carbon_saved, 2),
            "roi_months": round(self.roi_months, 1),
            "action_breakdown": self.action_breakdown,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

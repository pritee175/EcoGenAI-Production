"""
REST API endpoints for optimization recommendations
Provides actionable sustainability insights for ESG decision-making
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from ..database import get_db
from ..services.optimization_engine import OptimizationEngine

router = APIRouter(prefix="/api/optimization", tags=["optimization"])

class RecommendationResponse(BaseModel):
    """Response model for optimization recommendation"""
    workload_id: int
    model_name: str
    recommendation_type: str
    title: str
    message: str
    estimated_carbon_saving_kg: float
    severity: str
    impact_description: str

class OptimizationSummaryResponse(BaseModel):
    """Response model for optimization summary"""
    total_recommendations: int
    total_carbon_saving_kg: float
    total_energy_saving_kwh: float
    high_severity_count: int
    medium_severity_count: int
    low_severity_count: int

@router.get("/recommendations", response_model=List[dict])
def get_all_recommendations(db: Session = Depends(get_db)):
    """
    Get all optimization recommendations
    
    Analyzes current AI workload data and generates actionable
    sustainability recommendations based on rule-based logic.
    
    Recommendations are advisory only - no automated enforcement.
    
    Returns recommendations for:
    - Region optimization (deploy in cleaner energy regions)
    - Time-based scheduling (run during low-carbon hours)
    - Model efficiency (use smaller/efficient models)
    - Idle detection (identify underutilized resources)
    """
    recommendations = OptimizationEngine.generate_recommendations(db)
    return recommendations

@router.get("/workload/{workload_id}", response_model=List[dict])
def get_workload_recommendations(workload_id: int, db: Session = Depends(get_db)):
    """
    Get optimization recommendations for a specific workload
    
    Args:
        workload_id: ID of the workload
        
    Returns:
        List of recommendations specific to this workload
    """
    all_recommendations = OptimizationEngine.generate_recommendations(db)
    workload_recs = [
        rec for rec in all_recommendations 
        if rec.get("workload_id") == workload_id
    ]
    return workload_recs

@router.get("/summary", response_model=OptimizationSummaryResponse)
def get_optimization_summary(db: Session = Depends(get_db)):
    """
    Get optimization summary with potential savings
    
    Provides executive-level overview of:
    - Total number of optimization opportunities
    - Total potential carbon savings
    - Total potential energy savings
    - Breakdown by severity level
    
    Used for ESG dashboard and sustainability reporting.
    """
    summary = OptimizationEngine.calculate_total_potential_savings(db)
    return summary

@router.get("/transparency")
def get_optimization_methodology():
    """
    Get optimization methodology for ESG transparency
    
    Returns detailed explanation of how recommendations are generated.
    Required for ESG compliance and stakeholder trust.
    
    This endpoint provides full transparency about:
    - Recommendation rules and logic
    - Calculation methods
    - Assumptions and limitations
    - Advisory nature of recommendations
    """
    return {
        "methodology": {
            "approach": "Rule-based optimization engine",
            "description": "Analyzes AI workload data to generate actionable sustainability recommendations",
            "enforcement": "Advisory only - no automated changes"
        },
        "recommendation_types": {
            "REGION_OPTIMIZATION": {
                "description": "Suggests deploying workloads in regions with cleaner energy",
                "trigger": "Workload in high-carbon region with cleaner alternative available",
                "calculation": "Compares current vs potential carbon using regional intensity factors"
            },
            "TIME_SCHEDULING": {
                "description": "Recommends scheduling during low-carbon time windows",
                "trigger": "Long-running training or batch inference jobs",
                "calculation": "Estimates 15-30% carbon reduction during off-peak hours"
            },
            "MODEL_EFFICIENCY": {
                "description": "Suggests using smaller or more efficient models",
                "trigger": "High-compute models with significant carbon footprint",
                "calculation": "Estimates 40-60% reduction with efficient alternatives"
            },
            "IDLE_DETECTION": {
                "description": "Identifies underutilized or idle AI instances",
                "trigger": "Long runtime with low energy consumption rate",
                "calculation": "Compares actual vs expected energy usage"
            }
        },
        "severity_levels": {
            "HIGH": "Significant carbon savings potential (>0.5 kg CO₂)",
            "MEDIUM": "Moderate carbon savings potential (0.2-0.5 kg CO₂)",
            "LOW": "Minor carbon savings potential (<0.2 kg CO₂)"
        },
        "limitations": [
            "Recommendations are estimates based on current data",
            "Actual savings may vary based on implementation",
            "Does not account for business constraints or requirements",
            "Advisory only - requires human review and approval"
        ],
        "compliance": "Supports ESG reporting and responsible AI governance",
        "disclaimer": "Optimization suggestions are advisory in nature and based on estimated sustainability metrics. Final deployment decisions remain with Allianz."
    }

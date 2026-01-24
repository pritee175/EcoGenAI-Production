"""
REST API endpoints for ESG sustainability scores
Provides executive-level ESG performance indicators
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from ..database import get_db
from ..services.esg_score_calculator import ESGScoreCalculator

router = APIRouter(prefix="/api/esg-score", tags=["esg-score"])

class ESGScoreResponse(BaseModel):
    """Response model for ESG score"""
    score: float
    breakdown: dict

class ESGScoreHistoryResponse(BaseModel):
    """Response model for ESG score history"""
    id: int
    score: float
    score_date: str
    breakdown: dict

class ESGInterpretationResponse(BaseModel):
    """Response model for ESG score interpretation"""
    rating: str
    color: str
    message: str
    icon: str

@router.get("/current", response_model=dict)
def get_current_esg_score(db: Session = Depends(get_db)):
    """
    Get current ESG sustainability score
    
    Calculates real-time ESG score based on:
    - Carbon emissions efficiency (40%)
    - Energy consumption efficiency (30%)
    - Optimization adoption rate (20%)
    - Regional sustainability (10%)
    
    Score ranges from 0-100:
    - 80-100: Excellent
    - 60-79: Good
    - 40-59: Fair
    - 0-39: Needs Improvement
    
    Used for executive dashboard and ESG reporting.
    """
    score_data = ESGScoreCalculator.calculate_current_score(db)
    interpretation = ESGScoreCalculator.get_score_interpretation(score_data["score"])
    
    return {
        **score_data,
        "interpretation": interpretation
    }

@router.post("/save")
def save_esg_score(db: Session = Depends(get_db)):
    """
    Calculate and save current ESG score to database
    
    Creates a historical record for trend tracking.
    Should be called periodically (e.g., daily) to build history.
    
    Returns:
        Saved ESG score record
    """
    score = ESGScoreCalculator.save_score(db)
    return score.to_dict()

@router.get("/history", response_model=List[dict])
def get_esg_score_history(days: int = 7, db: Session = Depends(get_db)):
    """
    Get ESG score history for trend analysis
    
    Args:
        days: Number of days to retrieve (default: 7)
        
    Returns:
        List of historical ESG scores with dates and breakdowns
        
    Used for trend charts showing ESG performance over time.
    """
    history = ESGScoreCalculator.get_score_history(db, days)
    return history

@router.get("/latest", response_model=dict)
def get_latest_esg_score(db: Session = Depends(get_db)):
    """
    Get most recent saved ESG score from database
    
    If no score exists, calculates and saves a new one.
    Faster than /current endpoint as it uses cached data.
    
    Returns:
        Latest ESG score record
    """
    latest = ESGScoreCalculator.get_latest_score(db)
    interpretation = ESGScoreCalculator.get_score_interpretation(latest["score"])
    
    return {
        **latest,
        "interpretation": interpretation
    }

@router.get("/interpretation")
def get_score_interpretation(score: float):
    """
    Get human-readable interpretation of ESG score
    
    Args:
        score: ESG score (0-100)
        
    Returns:
        Rating, color code, message, and icon for UI display
        
    Used for displaying score meaning to non-technical users.
    """
    return ESGScoreCalculator.get_score_interpretation(score)

@router.get("/transparency")
def get_esg_methodology():
    """
    Get ESG score methodology for transparency
    
    Returns detailed explanation of how ESG scores are calculated.
    Required for ESG compliance and stakeholder trust.
    
    This endpoint provides full transparency about:
    - Scoring methodology
    - Weighting factors
    - Normalization approach
    - Benchmark thresholds
    - Limitations and assumptions
    """
    return {
        "methodology": {
            "approach": "Weighted composite scoring model",
            "description": "ESG score aggregates multiple sustainability metrics into a single 0-100 indicator",
            "purpose": "Enable executive-level ESG performance tracking and decision-making"
        },
        "components": {
            "carbon_efficiency": {
                "weight": ESGScoreCalculator.CARBON_WEIGHT,
                "description": "Lower total carbon emissions = higher score",
                "benchmark": f"{ESGScoreCalculator.CARBON_BENCHMARK_KG} kg CO₂",
                "calculation": "Normalized based on total carbon footprint vs benchmark"
            },
            "energy_efficiency": {
                "weight": ESGScoreCalculator.ENERGY_WEIGHT,
                "description": "Lower energy consumption per workload = higher score",
                "benchmark": f"{ESGScoreCalculator.ENERGY_BENCHMARK_KWH_PER_WORKLOAD} kWh per workload",
                "calculation": "Normalized based on average energy per workload vs benchmark"
            },
            "optimization_adoption": {
                "weight": ESGScoreCalculator.OPTIMIZATION_WEIGHT,
                "description": "Higher adoption of optimization recommendations = higher score",
                "benchmark": "80% adoption rate",
                "calculation": "Percentage of recommendations implemented"
            },
            "regional_sustainability": {
                "weight": ESGScoreCalculator.REGIONAL_WEIGHT,
                "description": "More workloads in low-carbon regions = higher score",
                "benchmark": f"{ESGScoreCalculator.LOW_CARBON_REGION_TARGET * 100}% in low-carbon regions",
                "low_carbon_regions": ESGScoreCalculator.LOW_CARBON_REGIONS,
                "calculation": "Percentage of workloads deployed in low-carbon regions"
            }
        },
        "score_ranges": {
            "excellent": "80-100: Outstanding sustainability performance",
            "good": "60-79: Good sustainability performance with room for improvement",
            "fair": "40-59: Fair sustainability performance, focus on key improvements",
            "needs_improvement": "0-39: Sustainability performance needs significant improvement"
        },
        "normalization": {
            "approach": "Each component normalized to 0-100 scale before weighting",
            "method": "Piecewise linear normalization with benchmark thresholds",
            "rationale": "Ensures all components contribute proportionally to final score"
        },
        "limitations": [
            "ESG scores are composite indicators based on estimated metrics",
            "Scores are intended for internal governance and continuous improvement",
            "Actual sustainability impact may vary based on external factors",
            "Optimization adoption tracking requires manual input (future enhancement)",
            "Benchmarks are configurable and should be adjusted to organizational goals"
        ],
        "compliance": "Supports ESG reporting frameworks and responsible AI governance",
        "disclaimer": "ESG scores are composite indicators for internal use and continuous improvement. They are based on estimated sustainability metrics and should be used alongside detailed analysis for decision-making."
    }

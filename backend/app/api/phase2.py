"""
Phase 2 API Endpoints: Advanced Automation Features
Green-Time Scheduler, Carbon Autopilot, Gamification, Climate Risk
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from ..database import get_db
from ..services.green_time_scheduler import GreenTimeScheduler
from ..services.carbon_autopilot import CarbonAutopilot
from ..services.eco_gamification import EcoGamification
from ..services.climate_risk_simulator import ClimateRiskSimulator

router = APIRouter(prefix="/api/phase2", tags=["phase2"])

# ============================================================================
# GREEN-TIME SCHEDULER
# ============================================================================

class ScheduleWorkloadRequest(BaseModel):
    """Request model for scheduling workload"""
    model_name: str
    job_type: str
    gpu_count: int
    preferred_region: str
    created_by: str = "User"

@router.post("/scheduler/initialize")
def initialize_green_windows(db: Session = Depends(get_db)):
    """
    Initialize default green time windows
    
    Sets up low-carbon time windows for all regions based on
    typical renewable energy availability patterns.
    """
    return GreenTimeScheduler.initialize_green_windows(db)

@router.get("/scheduler/windows/{region}")
def get_green_windows(region: str, db: Session = Depends(get_db)):
    """
    Get green time windows for a region
    
    Returns all low-carbon time windows when renewable energy
    is most available in the specified region.
    """
    windows = GreenTimeScheduler.get_green_windows_by_region(db, region)
    return {
        "region": region,
        "windows": windows,
        "total_windows": len(windows)
    }

@router.get("/scheduler/next-window/{region}")
def get_next_green_window(region: str, db: Session = Depends(get_db)):
    """
    Find next available green time window
    
    Returns the next low-carbon time window for scheduling
    workloads in the specified region.
    """
    next_window = GreenTimeScheduler.get_next_green_window(db, region)
    if not next_window:
        raise HTTPException(
            status_code=404,
            detail=f"No green time windows available for region {region}"
        )
    return next_window

@router.post("/scheduler/schedule")
def schedule_workload(request: ScheduleWorkloadRequest, db: Session = Depends(get_db)):
    """
    Schedule workload for green-time execution
    
    Schedules an AI workload to run during the next available
    low-carbon time window, reducing emissions.
    """
    result = GreenTimeScheduler.schedule_workload(
        db=db,
        model_name=request.model_name,
        job_type=request.job_type,
        gpu_count=request.gpu_count,
        preferred_region=request.preferred_region,
        created_by=request.created_by
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result

@router.get("/scheduler/scheduled")
def get_scheduled_workloads(status: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get all scheduled workloads
    
    Returns workloads scheduled for green-time execution.
    Optional filter by status (SCHEDULED, RUNNING, COMPLETED, CANCELLED).
    """
    workloads = GreenTimeScheduler.get_scheduled_workloads(db, status)
    return {
        "scheduled_workloads": workloads,
        "count": len(workloads),
        "filter": status or "all"
    }

@router.get("/scheduler/statistics")
def get_scheduling_statistics(db: Session = Depends(get_db)):
    """
    Get scheduling statistics
    
    Returns metrics about green-time scheduling:
    - Total scheduled workloads
    - Completion rate
    - Carbon savings achieved
    """
    return GreenTimeScheduler.get_scheduling_statistics(db)

# ============================================================================
# CARBON AUTOPILOT
# ============================================================================

class AutopilotActionRequest(BaseModel):
    """Request model for autopilot action"""
    workload_id: int
    action_type: str  # PAUSE_IDLE, SCALE_DOWN, TERMINATE
    reason: str

@router.get("/autopilot/detect-idle")
def detect_idle_workloads(db: Session = Depends(get_db)):
    """
    Detect idle workloads
    
    Identifies running workloads that appear to be idle,
    wasting energy and generating unnecessary emissions.
    """
    idle_workloads = CarbonAutopilot.detect_idle_workloads(db)
    return {
        "idle_workloads": idle_workloads,
        "count": len(idle_workloads),
        "total_wasted_carbon_kg": sum(w["wasted_carbon_kg"] for w in idle_workloads),
        "total_wasted_cost_usd": sum(w["wasted_cost_usd"] for w in idle_workloads)
    }

@router.get("/autopilot/detect-long-running")
def detect_long_running_workloads(db: Session = Depends(get_db)):
    """
    Detect long-running workloads
    
    Identifies workloads running longer than expected,
    which may indicate issues or inefficiencies.
    """
    long_running = CarbonAutopilot.detect_long_running_workloads(db)
    return {
        "long_running_workloads": long_running,
        "count": len(long_running)
    }

@router.get("/autopilot/recommendations")
def get_autopilot_recommendations(db: Session = Depends(get_db)):
    """
    Get autopilot recommendations
    
    Returns current recommendations for idle resource management
    with potential savings estimates.
    """
    return CarbonAutopilot.get_autopilot_recommendations(db)

@router.post("/autopilot/execute")
def execute_autopilot_action(request: AutopilotActionRequest, db: Session = Depends(get_db)):
    """
    Execute autopilot action
    
    Executes an automated action to manage idle resources.
    Actions: PAUSE_IDLE, SCALE_DOWN, TERMINATE
    """
    result = CarbonAutopilot.execute_autopilot_action(
        db=db,
        workload_id=request.workload_id,
        action_type=request.action_type,
        reason=request.reason
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result

@router.get("/autopilot/statistics")
def get_autopilot_statistics(db: Session = Depends(get_db)):
    """
    Get autopilot statistics
    
    Returns metrics about automated carbon waste prevention:
    - Total actions taken
    - Carbon/energy/cost savings
    - Actions by type
    """
    return CarbonAutopilot.get_autopilot_statistics(db)

@router.get("/autopilot/recent-actions")
def get_recent_autopilot_actions(limit: int = 10, db: Session = Depends(get_db)):
    """
    Get recent autopilot actions
    
    Returns history of recent automated actions taken
    to prevent carbon waste.
    """
    actions = CarbonAutopilot.get_recent_actions(db, limit)
    return {
        "recent_actions": actions,
        "count": len(actions)
    }

# ============================================================================
# ECO-SCORE GAMIFICATION
# ============================================================================

class UpdateTeamScoreRequest(BaseModel):
    """Request model for updating team score"""
    team_name: str
    carbon_saved_kg: float = 0
    energy_saved_kwh: float = 0
    optimizations_adopted: int = 0

@router.post("/gamification/update-score")
def update_team_score(request: UpdateTeamScoreRequest, db: Session = Depends(get_db)):
    """
    Update team eco-score
    
    Updates a team's sustainability score based on their actions.
    Awards points for carbon savings, energy savings, and optimizations.
    """
    result = EcoGamification.update_team_score(
        db=db,
        team_name=request.team_name,
        carbon_saved_kg=request.carbon_saved_kg,
        energy_saved_kwh=request.energy_saved_kwh,
        optimizations_adopted=request.optimizations_adopted
    )
    return result

@router.get("/gamification/leaderboard")
def get_leaderboard(month: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get team leaderboard
    
    Returns ranked list of teams by eco-score for the specified month.
    Defaults to current month if not specified.
    """
    leaderboard = EcoGamification.get_leaderboard(db, month)
    return {
        "leaderboard": leaderboard,
        "month": month or "current",
        "total_teams": len(leaderboard)
    }

@router.get("/gamification/team/{team_name}")
def get_team_stats(team_name: str, db: Session = Depends(get_db)):
    """
    Get team statistics
    
    Returns comprehensive statistics for a specific team:
    - Current month performance
    - All-time totals
    - Badges earned
    - Monthly history
    """
    return EcoGamification.get_team_stats(db, team_name)

@router.get("/gamification/badges")
def get_badge_info():
    """
    Get badge information
    
    Returns information about all available badges,
    including requirements and descriptions.
    """
    return {
        "badges": EcoGamification.get_badge_info(),
        "total_badges": len(EcoGamification.BADGES)
    }

@router.get("/gamification/summary")
def get_gamification_summary(db: Session = Depends(get_db)):
    """
    Get gamification summary
    
    Returns overall gamification statistics:
    - Total teams participating
    - Total carbon saved
    - Top team
    - Average scores
    """
    return EcoGamification.get_gamification_summary(db)

# ============================================================================
# CLIMATE RISK SIMULATOR
# ============================================================================

@router.get("/climate-risk/assessment")
def get_climate_risk_assessment(db: Session = Depends(get_db)):
    """
    Generate climate risk assessment
    
    Performs comprehensive climate risk analysis:
    - Projects annual emissions
    - Identifies risk factors
    - Calculates risk score (0-100)
    - Provides mitigation recommendations
    """
    return ClimateRiskSimulator.generate_climate_risk_assessment(db)

@router.get("/climate-risk/latest")
def get_latest_assessment(db: Session = Depends(get_db)):
    """
    Get latest climate risk assessment
    
    Returns the most recent climate risk assessment,
    or generates a new one if none exists.
    """
    return ClimateRiskSimulator.get_latest_assessment(db)

@router.get("/climate-risk/history")
def get_risk_history(days: int = 30, db: Session = Depends(get_db)):
    """
    Get climate risk history
    
    Returns historical climate risk scores for trend analysis.
    """
    history = ClimateRiskSimulator.get_risk_history(db, days)
    return {
        "history": history,
        "days": days,
        "count": len(history)
    }

@router.get("/climate-risk/transparency")
def get_climate_risk_transparency():
    """
    Get climate risk methodology
    
    Returns detailed explanation of climate risk calculation
    methodology for transparency and stakeholder trust.
    """
    return {
        "methodology": {
            "approach": "Predictive climate impact modeling",
            "description": "Projects long-term climate impact based on current AI operations",
            "data_sources": [
                "Historical workload emissions data",
                "Regional carbon intensity factors",
                "Emissions trend analysis"
            ]
        },
        "risk_score_calculation": {
            "range": "0-100 (higher = more risk)",
            "factors": [
                "Projected annual emissions level",
                "Emissions trend (increasing/stable/decreasing)",
                "Regional carbon intensity",
                "Optimization adoption rate"
            ],
            "thresholds": ClimateRiskSimulator.RISK_THRESHOLDS
        },
        "impact_categories": {
            "LOW": "< 30 risk score - Minimal climate impact",
            "MODERATE": "30-50 risk score - Manageable impact with monitoring",
            "HIGH": "50-70 risk score - Significant impact requiring action",
            "CRITICAL": "> 70 risk score - Urgent mitigation required"
        },
        "projections": {
            "method": "30-day rolling average extrapolated to annual",
            "accuracy": "Estimates based on current patterns; actual may vary",
            "update_frequency": "Can be generated on-demand or scheduled"
        },
        "limitations": [
            "Projections assume current usage patterns continue",
            "Does not account for planned infrastructure changes",
            "Regional carbon intensity factors are estimates",
            "Strategic planning tool, not precise prediction"
        ],
        "use_cases": [
            "Long-term ESG strategy planning",
            "Climate risk disclosure for stakeholders",
            "Insurance risk assessment",
            "Sustainability goal setting"
        ]
    }

# ============================================================================
# PHASE 2 OVERVIEW
# ============================================================================

@router.get("/overview")
def get_phase2_overview(db: Session = Depends(get_db)):
    """
    Get Phase 2 features overview
    
    Returns summary of all Phase 2 advanced automation features
    and their current status.
    """
    return {
        "phase": "Phase 2: Advanced Automation",
        "features": {
            "green_time_scheduler": {
                "name": "Green-Time Scheduler",
                "description": "Schedule workloads during low-carbon electricity periods",
                "status": "active",
                "endpoints": 6
            },
            "carbon_autopilot": {
                "name": "Carbon Autopilot",
                "description": "Automatically detect and manage idle resources",
                "status": "active",
                "endpoints": 6
            },
            "eco_gamification": {
                "name": "Eco-Score Gamification",
                "description": "Team-based sustainability engagement and competition",
                "status": "active",
                "endpoints": 5
            },
            "climate_risk_simulator": {
                "name": "Climate Risk Simulator",
                "description": "Predictive climate impact modeling for strategic planning",
                "status": "active",
                "endpoints": 4
            }
        },
        "total_endpoints": 21,
        "documentation": "/docs"
    }

"""
REST API endpoints for Responsible AI Governance
Enterprise-grade governance, cost analysis, and ESG reporting
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..services.governance_engine import GovernanceEngine
from ..services.model_efficiency_optimizer import ModelEfficiencyOptimizer
from ..services.cost_analyzer import CostAnalyzer
from ..services.esg_report_generator import ESGReportGenerator
from ..models.governance import ActionType, ApprovalStatus

router = APIRouter(prefix="/api/governance", tags=["governance"])

# ============================================================================
# GOVERNANCE & APPROVAL WORKFLOW
# ============================================================================

class ActionRequestCreate(BaseModel):
    """Request model for creating action request"""
    action_type: str
    workload_id: Optional[int] = None
    title: str
    description: str
    estimated_carbon_saving_kg: float
    estimated_energy_saving_kwh: float
    estimated_cost_impact_usd: float
    technical_details: dict
    requested_by: str = "System"

class ActionReview(BaseModel):
    """Request model for reviewing action"""
    reviewed_by: str
    review_notes: Optional[str] = None

@router.post("/actions/create")
def create_action_request(request: ActionRequestCreate, db: Session = Depends(get_db)):
    """
    Create new action request for approval
    
    Initiates governance workflow for sustainability action.
    Request must be approved before execution.
    """
    try:
        action_type = ActionType(request.action_type)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid action type: {request.action_type}")
    
    action = GovernanceEngine.create_action_request(
        db=db,
        action_type=action_type,
        title=request.title,
        description=request.description,
        workload_id=request.workload_id,
        estimated_carbon_saving_kg=request.estimated_carbon_saving_kg,
        estimated_energy_saving_kwh=request.estimated_energy_saving_kwh,
        estimated_cost_impact_usd=request.estimated_cost_impact_usd,
        technical_details=request.technical_details,
        requested_by=request.requested_by
    )
    
    return action.to_dict()

@router.get("/actions/pending")
def get_pending_actions(db: Session = Depends(get_db)):
    """
    Get all pending action requests
    
    Returns actions awaiting manager approval.
    Used for approval dashboard.
    """
    actions = GovernanceEngine.get_pending_requests(db)
    return [action.to_dict() for action in actions]

@router.get("/actions/all")
def get_all_actions(limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all action requests with limit
    
    Returns complete action history for audit trail.
    """
    actions = GovernanceEngine.get_all_requests(db, limit)
    return [action.to_dict() for action in actions]

@router.get("/actions/{action_id}")
def get_action_by_id(action_id: int, db: Session = Depends(get_db)):
    """Get specific action request by ID"""
    action = GovernanceEngine.get_request_by_id(db, action_id)
    if not action:
        raise HTTPException(status_code=404, detail=f"Action {action_id} not found")
    return action.to_dict()

@router.post("/actions/{action_id}/approve")
def approve_action(action_id: int, review: ActionReview, db: Session = Depends(get_db)):
    """
    Approve action request
    
    Manager approval required before execution.
    Creates audit trail entry.
    """
    try:
        action = GovernanceEngine.approve_request(
            db=db,
            request_id=action_id,
            reviewed_by=review.reviewed_by,
            review_notes=review.review_notes
        )
        return action.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/actions/{action_id}/reject")
def reject_action(action_id: int, review: ActionReview, db: Session = Depends(get_db)):
    """
    Reject action request
    
    Manager rejection with required notes.
    Creates audit trail entry.
    """
    if not review.review_notes:
        raise HTTPException(status_code=400, detail="Review notes required for rejection")
    
    try:
        action = GovernanceEngine.reject_request(
            db=db,
            request_id=action_id,
            reviewed_by=review.reviewed_by,
            review_notes=review.review_notes
        )
        return action.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/statistics")
def get_approval_statistics(db: Session = Depends(get_db)):
    """
    Get approval workflow statistics
    
    Returns metrics for governance dashboard:
    - Total requests
    - Approval rate
    - Execution rate
    - Realized savings
    """
    return GovernanceEngine.get_approval_statistics(db)

@router.get("/audit-trail")
def get_audit_trail(workload_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Get complete audit trail
    
    Returns all governance actions for compliance.
    Optional filter by workload.
    """
    return GovernanceEngine.get_audit_trail(db, workload_id)

# ============================================================================
# MODEL EFFICIENCY OPTIMIZER
# ============================================================================

@router.get("/model-optimization/recommendations")
def get_model_optimization_recommendations(db: Session = Depends(get_db)):
    """
    Get model efficiency optimization recommendations
    
    Returns advanced optimization suggestions:
    - Model quantization
    - Knowledge distillation
    - Model right-sizing
    - Architecture optimization
    
    All recommendations are advisory only.
    """
    return ModelEfficiencyOptimizer.generate_model_optimization_recommendations(db)

@router.get("/model-optimization/summary")
def get_model_optimization_summary(db: Session = Depends(get_db)):
    """
    Get model optimization summary
    
    Returns aggregated optimization opportunities and potential savings.
    """
    return ModelEfficiencyOptimizer.get_optimization_summary(db)

# ============================================================================
# COST VS CARBON ANALYSIS
# ============================================================================

@router.get("/cost-analysis/current")
def get_current_costs(db: Session = Depends(get_db)):
    """
    Get current cloud cost analysis
    
    Calculates current costs based on:
    - Energy consumption
    - GPU hours
    
    Returns estimated cloud infrastructure costs.
    """
    return CostAnalyzer.calculate_current_costs(db)

@router.get("/cost-analysis/savings")
def get_optimization_savings(db: Session = Depends(get_db)):
    """
    Get potential savings from optimization
    
    Calculates:
    - Carbon savings
    - Energy savings
    - Cost savings
    - Implementation cost
    - Net savings
    - ROI
    """
    return CostAnalyzer.calculate_optimization_savings(db)

@router.get("/cost-analysis/impact")
def get_cost_impact_analysis(db: Session = Depends(get_db)):
    """
    Get comprehensive cost vs carbon analysis
    
    Provides complete decision support:
    - Current state
    - Optimization potential
    - Impact metrics
    - Action breakdown
    - Business recommendation
    
    Used for leadership decision-making.
    """
    return CostAnalyzer.generate_cost_impact_analysis(db)

@router.post("/cost-analysis/save")
def save_cost_analysis(db: Session = Depends(get_db)):
    """
    Save cost analysis to database
    
    Creates historical record for trend tracking.
    """
    analysis = CostAnalyzer.save_cost_analysis(db)
    return analysis.to_dict()

# ============================================================================
# ESG REPORT GENERATOR
# ============================================================================

@router.get("/reports/comprehensive")
def get_comprehensive_report(period_days: int = 30, db: Session = Depends(get_db)):
    """
    Generate comprehensive ESG report
    
    Args:
        period_days: Reporting period (default: 30 days)
        
    Returns:
        Complete ESG report with:
        - Executive summary
        - Workload analysis
        - Energy consumption
        - Carbon emissions
        - ESG score trend
        - Optimization actions
        - Methodology
        - Compliance statements
        
    Suitable for regulatory and audit requirements.
    """
    return ESGReportGenerator.generate_comprehensive_report(db, period_days)

@router.get("/reports/export/csv")
def export_report_csv(period_days: int = 30, db: Session = Depends(get_db)):
    """
    Export ESG report as CSV
    
    Returns CSV formatted report for spreadsheet analysis.
    """
    report = ESGReportGenerator.generate_comprehensive_report(db, period_days)
    csv_content = ESGReportGenerator.export_to_csv_format(report)
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=esg_report_{period_days}days.csv"
        }
    )

@router.get("/reports/export/json")
def export_report_json(period_days: int = 30, db: Session = Depends(get_db)):
    """
    Export ESG report as JSON
    
    Returns JSON formatted report for system integration.
    """
    report = ESGReportGenerator.generate_comprehensive_report(db, period_days)
    json_content = ESGReportGenerator.export_to_json_format(report)
    
    return Response(
        content=json_content,
        media_type="application/json",
        headers={
            "Content-Disposition": f"attachment; filename=esg_report_{period_days}days.json"
        }
    )

@router.get("/transparency")
def get_governance_transparency():
    """
    Get governance methodology for transparency
    
    Returns detailed explanation of:
    - Approval workflow
    - Cost calculation methods
    - Optimization techniques
    - Report generation process
    
    Required for ESG compliance and stakeholder trust.
    """
    return {
        "governance_framework": {
            "approach": "Enterprise-grade approval workflow",
            "description": "All sustainability actions require manager approval before execution",
            "principles": [
                "No automated execution without approval",
                "Full audit trail maintained",
                "Transparent impact estimates",
                "Business-aligned decision support"
            ]
        },
        "approval_workflow": {
            "steps": [
                "1. System generates recommendation",
                "2. Manager reviews request",
                "3. Approval or rejection with notes",
                "4. Approved actions executed",
                "5. Results recorded in audit trail"
            ],
            "roles": {
                "system": "Generates recommendations based on data analysis",
                "manager": "Reviews and approves/rejects actions",
                "audit": "Complete trail maintained for compliance"
            }
        },
        "cost_analysis": {
            "cloud_cost_per_kwh": CostAnalyzer.CLOUD_COST_PER_KWH,
            "cloud_cost_per_gpu_hour": CostAnalyzer.CLOUD_COST_PER_GPU_HOUR,
            "implementation_cost_per_action": CostAnalyzer.IMPLEMENTATION_COST_PER_ACTION,
            "calculation_method": "Conservative estimates based on industry averages",
            "roi_calculation": "Implementation cost / Annual savings × 12 months"
        },
        "model_optimization": {
            "techniques": ModelEfficiencyOptimizer.OPTIMIZATION_TECHNIQUES,
            "approach": "Advisory recommendations only",
            "validation": "All optimizations require testing before deployment"
        },
        "esg_reporting": {
            "standards": [
                "GHG Protocol Scope 2",
                "ISO 14064",
                "CDP Framework"
            ],
            "report_components": [
                "Executive summary",
                "Detailed metrics",
                "Methodology disclosure",
                "Compliance statements"
            ],
            "export_formats": ["JSON", "CSV", "PDF (future)"]
        },
        "compliance": "All governance processes designed for enterprise compliance and audit requirements",
        "disclaimer": "Cost and savings estimates are based on industry averages and may vary based on specific infrastructure and operational factors."
    }

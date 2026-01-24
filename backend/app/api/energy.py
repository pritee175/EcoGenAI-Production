"""
REST API endpoints for energy consumption data
Provides ESG-compliant energy metrics for dashboard
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from ..database import get_db
from ..services.energy_calculator import EnergyCalculator

router = APIRouter(prefix="/api/energy", tags=["energy"])

class EnergyResponse(BaseModel):
    """Response model for energy data"""
    workload_id: int
    energy_kwh: float
    last_updated: str

class EnergySummaryResponse(BaseModel):
    """Response model for energy summary"""
    total_energy_today_kwh: float
    average_energy_per_model_kwh: float
    total_workloads: int

class ModelEnergyResponse(BaseModel):
    """Response model for energy by model"""
    model_name: str
    total_energy_kwh: float

class TopConsumerResponse(BaseModel):
    """Response model for top energy consumers"""
    workload_id: int
    model_name: str
    job_type: str
    gpu_count: int
    runtime_seconds: float
    energy_kwh: float
    status: str

@router.get("/workload/{workload_id}", response_model=EnergyResponse)
def get_workload_energy(workload_id: int, db: Session = Depends(get_db)):
    """
    Get energy consumption for a specific workload
    
    Returns estimated energy usage based on:
    - Runtime duration
    - GPU count
    - Model-specific power coefficients
    
    Note: Values are estimates using industry-standard coefficients,
    not direct hardware telemetry.
    """
    energy_data = EnergyCalculator.get_workload_energy(db, workload_id)
    if not energy_data:
        return {"workload_id": workload_id, "energy_kwh": 0.0, "last_updated": ""}
    return energy_data

@router.get("/summary", response_model=EnergySummaryResponse)
def get_energy_summary(db: Session = Depends(get_db)):
    """
    Get overall energy consumption summary
    
    Provides key metrics for ESG dashboard:
    - Total energy consumed today
    - Average energy per AI model
    - Total number of workloads tracked
    
    Used for executive-level ESG reporting.
    """
    total_today = EnergyCalculator.get_total_energy_today(db)
    avg_per_model = EnergyCalculator.get_average_energy_per_model(db)
    
    from ..models.energy import EnergyUsage
    total_workloads = db.query(EnergyUsage).count()
    
    return {
        "total_energy_today_kwh": total_today,
        "average_energy_per_model_kwh": avg_per_model,
        "total_workloads": total_workloads
    }

@router.get("/by-model", response_model=List[ModelEnergyResponse])
def get_energy_by_model(db: Session = Depends(get_db)):
    """
    Get energy consumption grouped by AI model
    
    Returns total energy consumed by each model type.
    Useful for identifying which AI applications consume most energy.
    
    Sorted by energy consumption (highest first).
    """
    return EnergyCalculator.get_energy_by_model(db)

@router.get("/top-consumers", response_model=List[TopConsumerResponse])
def get_top_energy_consumers(limit: int = 5, db: Session = Depends(get_db)):
    """
    Get top energy-consuming workloads
    
    Identifies the most energy-intensive AI jobs.
    Helps ESG teams prioritize optimization efforts.
    
    Args:
        limit: Number of top consumers to return (default: 5)
    """
    return EnergyCalculator.get_top_energy_consumers(db, limit)

@router.get("/transparency")
def get_energy_methodology():
    """
    Get energy estimation methodology for ESG transparency
    
    Returns detailed explanation of how energy is calculated.
    Required for ESG compliance and stakeholder trust.
    
    This endpoint provides full transparency about:
    - Calculation formula
    - Power coefficients used
    - Data sources and assumptions
    - Limitations of estimates
    """
    from ..config import energy_config
    
    return {
        "methodology": {
            "formula": "Energy (kWh) = Runtime (hours) × GPU Count × Power Coefficient (kW)",
            "description": "Industry-standard estimation based on GPU specifications",
            "data_source": "NVIDIA A100/H100 specifications and industry benchmarks"
        },
        "power_coefficients": energy_config.POWER_COEFFICIENTS,
        "model_mapping": energy_config.MODEL_POWER_MAPPING,
        "limitations": [
            "Estimates based on average GPU power consumption, not direct telemetry",
            "Actual power usage may vary based on workload characteristics",
            "Does not include cooling, networking, or storage energy costs",
            "Conservative estimates (tends to overestimate for safety)"
        ],
        "accuracy": "Suitable for comparative analysis and ESG reporting",
        "compliance": "Aligned with GHG Protocol Scope 2 guidance for indirect emissions"
    }

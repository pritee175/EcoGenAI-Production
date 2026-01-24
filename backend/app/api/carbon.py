"""
REST API endpoints for carbon footprint data
Provides ESG-compliant CO₂ emissions metrics for dashboard
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from ..database import get_db
from ..services.carbon_calculator import CarbonCalculator

router = APIRouter(prefix="/api/carbon", tags=["carbon"])

class CarbonResponse(BaseModel):
    """Response model for carbon data"""
    workload_id: int
    region: str
    energy_kwh: float
    carbon_kg: float
    last_updated: str

class CarbonSummaryResponse(BaseModel):
    """Response model for carbon summary"""
    total_carbon_kg: float
    total_workloads: int

class RegionCarbonResponse(BaseModel):
    """Response model for carbon by region"""
    region: str
    carbon_kg: float
    carbon_intensity: float

class ModelCarbonResponse(BaseModel):
    """Response model for carbon by model"""
    model_name: str
    carbon_kg: float

class TopEmitterResponse(BaseModel):
    """Response model for top carbon emitters"""
    workload_id: int
    model_name: str
    region: str
    energy_kwh: float
    carbon_kg: float
    status: str

@router.get("/workload/{workload_id}", response_model=CarbonResponse)
def get_workload_carbon(workload_id: int, db: Session = Depends(get_db)):
    """
    Get carbon emissions for a specific workload
    
    Returns CO₂ emissions calculated from energy consumption
    using region-specific carbon intensity factors.
    
    Formula: CO₂ (kg) = Energy (kWh) × Carbon Intensity (kg CO₂ / kWh)
    """
    carbon_data = CarbonCalculator.get_workload_carbon(db, workload_id)
    if not carbon_data:
        return {
            "workload_id": workload_id,
            "region": "Unknown",
            "energy_kwh": 0.0,
            "carbon_kg": 0.0,
            "last_updated": ""
        }
    return carbon_data

@router.get("/summary", response_model=CarbonSummaryResponse)
def get_carbon_summary(db: Session = Depends(get_db)):
    """
    Get overall carbon footprint summary
    
    Provides total AI carbon emissions for ESG dashboard.
    Used for executive-level sustainability reporting.
    """
    total_carbon = CarbonCalculator.get_total_carbon_footprint(db)
    
    from ..models.carbon import CarbonEmission
    total_workloads = db.query(CarbonEmission).count()
    
    return {
        "total_carbon_kg": total_carbon,
        "total_workloads": total_workloads
    }

@router.get("/by-region", response_model=List[RegionCarbonResponse])
def get_carbon_by_region(db: Session = Depends(get_db)):
    """
    Get carbon emissions grouped by cloud region
    
    Returns CO₂ emissions by region with carbon intensity factors.
    Helps identify which regions have highest climate impact.
    
    Sorted by carbon emissions (highest first).
    """
    return CarbonCalculator.get_carbon_by_region(db)

@router.get("/by-model", response_model=List[ModelCarbonResponse])
def get_carbon_by_model(db: Session = Depends(get_db)):
    """
    Get carbon emissions grouped by AI model
    
    Returns total CO₂ emissions by model type.
    Useful for identifying which AI applications have highest carbon footprint.
    
    Sorted by carbon emissions (highest first).
    """
    return CarbonCalculator.get_carbon_by_model(db)

@router.get("/top-emitters", response_model=List[TopEmitterResponse])
def get_top_carbon_emitters(limit: int = 5, db: Session = Depends(get_db)):
    """
    Get top carbon-emitting workloads
    
    Identifies the most carbon-intensive AI jobs.
    Helps ESG teams prioritize climate impact reduction efforts.
    
    Args:
        limit: Number of top emitters to return (default: 5)
    """
    return CarbonCalculator.get_top_carbon_emitters(db, limit)

@router.get("/transparency")
def get_carbon_methodology():
    """
    Get carbon calculation methodology for ESG transparency
    
    Returns detailed explanation of how CO₂ emissions are calculated.
    Required for ESG compliance and stakeholder trust.
    
    This endpoint provides full transparency about:
    - Calculation formula
    - Carbon intensity factors used
    - Regional differences
    - Data sources and assumptions
    - Limitations of estimates
    """
    from ..config import carbon_config
    
    return {
        "methodology": {
            "formula": "CO₂ (kg) = Energy (kWh) × Carbon Intensity (kg CO₂ / kWh)",
            "description": "Region-based carbon footprint estimation using electricity grid data",
            "data_source": "Regional electricity grid carbon intensity factors"
        },
        "carbon_intensities": carbon_config.get_all_intensities(),
        "unit": "kg CO₂ per kWh",
        "regional_context": {
            "EU": "Cleaner energy mix with renewables and nuclear",
            "US": "Mixed energy sources",
            "India": "Higher fossil fuel dependency (coal-based)"
        },
        "limitations": [
            "Estimates based on regional average carbon intensity, not real-time grid data",
            "Does not include embodied carbon from hardware manufacturing",
            "Does not include cooling and infrastructure emissions",
            "Conservative estimates suitable for comparative analysis"
        ],
        "accuracy": "Suitable for ESG reporting and climate impact assessment",
        "compliance": "Aligned with GHG Protocol Scope 2 guidance for indirect emissions"
    }

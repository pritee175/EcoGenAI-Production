"""
REST API endpoints for AI workload management
Provides CRUD operations for GenAI monitoring
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from ..database import get_db
from ..services.simulator import WorkloadSimulator

router = APIRouter(prefix="/api/workloads", tags=["workloads"])

class WorkloadCreate(BaseModel):
    """Request model for creating new workload"""
    model_name: str = None
    job_type: str = "inference"
    gpu_count: int = None
    cloud_region: str = None

class WorkloadResponse(BaseModel):
    """Response model for workload data"""
    id: int
    model_name: str
    job_type: str
    gpu_count: int
    cloud_region: str
    start_time: str
    runtime_seconds: float
    status: str
    created_at: str
    updated_at: str

@router.get("/active", response_model=List[WorkloadResponse])
def get_active_workloads(db: Session = Depends(get_db)):
    """
    Get all currently running AI workloads
    Used by dashboard for real-time monitoring
    """
    workloads = WorkloadSimulator.get_active_workloads(db)
    return [workload.to_dict() for workload in workloads]

@router.get("/history", response_model=List[WorkloadResponse])
def get_workload_history(limit: int = 100, db: Session = Depends(get_db)):
    """
    Get historical workload logs
    Used for ESG reporting and analysis
    """
    workloads = WorkloadSimulator.get_all_workloads(db, limit)
    return [workload.to_dict() for workload in workloads]

@router.post("/start", response_model=WorkloadResponse)
def start_workload(workload: WorkloadCreate, db: Session = Depends(get_db)):
    """
    Start a new simulated AI workload
    In production, this would trigger actual GPU job scheduling
    """
    new_workload = WorkloadSimulator.create_workload(
        db,
        model_name=workload.model_name,
        job_type=workload.job_type,
        gpu_count=workload.gpu_count,
        cloud_region=workload.cloud_region
    )
    return new_workload.to_dict()

@router.post("/stop/{workload_id}")
def stop_workload(workload_id: int, db: Session = Depends(get_db)):
    """
    Stop a running workload
    Marks job as completed for ESG tracking
    """
    success = WorkloadSimulator.stop_workload(db, workload_id)
    if not success:
        raise HTTPException(status_code=404, detail="Workload not found or already stopped")
    return {"message": "Workload stopped successfully", "workload_id": workload_id}

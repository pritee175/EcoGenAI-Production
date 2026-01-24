"""
AI Workload Simulator Service
Simulates Generative AI jobs running in Allianz infrastructure
Updates runtime metrics every 5 seconds for real-time monitoring
"""
import random
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.workload import AIWorkload, JobStatus, JobType
from ..database import SessionLocal

class WorkloadSimulator:
    """
    Manages simulated GenAI workloads for ESG monitoring
    In production, this would connect to actual GPU telemetry
    """
    
    # Allianz GenAI models in production
    MODEL_NAMES = [
        "ClaimsBot",
        "PolicyGPT", 
        "FraudAnalyzer",
        "DocumentQA",
        "RiskAssessor"
    ]
    
    CLOUD_REGIONS = ["India", "EU", "US"]
    
    @staticmethod
    def create_workload(db: Session, model_name: str = None, 
                       job_type: str = "inference", gpu_count: int = None,
                       cloud_region: str = None) -> AIWorkload:
        """
        Create a new simulated AI workload
        Args:
            model_name: Name of GenAI model (random if None)
            job_type: training or inference
            gpu_count: Number of GPUs (random 1-8 if None)
            cloud_region: Deployment region (random if None)
        """
        workload = AIWorkload(
            model_name=model_name or random.choice(WorkloadSimulator.MODEL_NAMES),
            job_type=JobType(job_type),
            gpu_count=gpu_count or random.randint(1, 8),
            cloud_region=cloud_region or random.choice(WorkloadSimulator.CLOUD_REGIONS),
            start_time=datetime.utcnow(),
            runtime_seconds=0.0,
            status=JobStatus.RUNNING
        )
        db.add(workload)
        db.commit()
        db.refresh(workload)
        return workload
    
    @staticmethod
    def update_running_workloads():
        """
        Update runtime for all running workloads
        Called by APScheduler every 5 seconds
        """
        db = SessionLocal()
        try:
            running_workloads = db.query(AIWorkload).filter(
                AIWorkload.status == JobStatus.RUNNING
            ).all()
            
            for workload in running_workloads:
                # Increment runtime by 5 seconds
                workload.runtime_seconds += 5.0
                
                # Don't auto-complete - let user manually stop workloads
                # This is better for demo purposes
                
                workload.updated_at = datetime.utcnow()
            
            db.commit()
        finally:
            db.close()
    
    @staticmethod
    def get_active_workloads(db: Session):
        """Fetch all currently running workloads"""
        return db.query(AIWorkload).filter(
            AIWorkload.status == JobStatus.RUNNING
        ).all()
    
    @staticmethod
    def get_all_workloads(db: Session, limit: int = 100):
        """Fetch workload history for reporting"""
        return db.query(AIWorkload).order_by(
            AIWorkload.created_at.desc()
        ).limit(limit).all()
    
    @staticmethod
    def stop_workload(db: Session, workload_id: int) -> bool:
        """Stop a running workload"""
        workload = db.query(AIWorkload).filter(AIWorkload.id == workload_id).first()
        if workload and workload.status == JobStatus.RUNNING:
            workload.status = JobStatus.COMPLETED
            workload.updated_at = datetime.utcnow()
            db.commit()
            return True
        return False

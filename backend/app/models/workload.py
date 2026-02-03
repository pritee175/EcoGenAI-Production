"""
SQLAlchemy models for AI workload tracking
Stores GenAI job execution data for ESG monitoring
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from datetime import datetime
import enum
from ..database import Base

class JobStatus(str, enum.Enum):
    """Status of AI workload execution"""
    RUNNING = "running"
    COMPLETED = "completed"

class JobType(str, enum.Enum):
    """Type of AI workload"""
    TRAINING = "training"
    INFERENCE = "inference"

class AIWorkload(Base):
    """
    Represents a Generative AI workload running in Allianz systems
    Used to track compute resource usage for ESG carbon calculations
    """
    __tablename__ = "ai_workloads"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)  # e.g., ClaimsBot, PolicyGPT
    job_type = Column(Enum(JobType), nullable=False)
    gpu_count = Column(Integer, nullable=False)
    cloud_region = Column(String, nullable=False)  # India, EU, US
    cloud_instance_id = Column(String, nullable=True, index=True)  # Cloud provider instance ID (for cloud-detected workloads)
    start_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    runtime_seconds = Column(Float, default=0.0, nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.RUNNING, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            "id": self.id,
            "model_name": self.model_name,
            "job_type": self.job_type.value,
            "gpu_count": self.gpu_count,
            "cloud_region": self.cloud_region,
            "cloud_instance_id": self.cloud_instance_id,
            "start_time": self.start_time.isoformat(),
            "runtime_seconds": round(self.runtime_seconds, 2),
            "status": self.status.value,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

"""
SQLAlchemy models for cloud integration and onboarding
Stores user cloud credentials and onboarding progress
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text
from datetime import datetime
import enum
from ..database import Base

class CloudProvider(str, enum.Enum):
    """Supported cloud providers"""
    AWS = "aws"
    AZURE = "azure"
    GCP = "gcp"
    INTERNAL = "internal"

class ConnectionStatus(str, enum.Enum):
    """Cloud connection status"""
    PENDING = "pending"
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    FAILED = "failed"

class CloudIntegration(Base):
    """
    Stores cloud provider credentials and connection status
    This enables persistent background monitoring of AI workloads
    """
    __tablename__ = "cloud_integrations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=False, index=True)
    organization_name = Column(String, nullable=True)
    
    # Cloud provider details
    provider = Column(Enum(CloudProvider), nullable=False)
    provider_account_id = Column(String, nullable=True)  # AWS account ID, Azure subscription ID, GCP project ID
    
    # Credentials (in production, encrypt these!)
    access_key = Column(Text, nullable=False)  # AWS access key, Azure client ID, GCP service account JSON
    secret_key = Column(Text, nullable=True)   # AWS secret key, Azure client secret
    
    # Configuration
    regions_to_monitor = Column(String, nullable=True)  # Comma-separated list of regions
    
    # Connection status
    status = Column(Enum(ConnectionStatus), default=ConnectionStatus.PENDING, nullable=False)
    error_message = Column(Text, nullable=True)
    last_sync_time = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            "id": self.id,
            "user_email": self.user_email,
            "organization_name": self.organization_name,
            "provider": self.provider.value,
            "provider_account_id": self.provider_account_id,
            "regions_to_monitor": self.regions_to_monitor,
            "status": self.status.value,
            "error_message": self.error_message,
            "last_sync_time": self.last_sync_time.isoformat() if self.last_sync_time else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

class OnboardingStatus(Base):
    """
    Tracks user onboarding progress
    Ensures users complete setup before accessing dashboard
    """
    __tablename__ = "onboarding_status"
    
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, unique=True, nullable=False, index=True)
    
    # Onboarding steps
    step_welcome_completed = Column(Boolean, default=False, nullable=False)
    step_cloud_selection_completed = Column(Boolean, default=False, nullable=False)
    step_credentials_completed = Column(Boolean, default=False, nullable=False)
    step_verification_completed = Column(Boolean, default=False, nullable=False)
    
    # Overall status
    onboarding_completed = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    
    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            "id": self.id,
            "user_email": self.user_email,
            "step_welcome_completed": self.step_welcome_completed,
            "step_cloud_selection_completed": self.step_cloud_selection_completed,
            "step_credentials_completed": self.step_credentials_completed,
            "step_verification_completed": self.step_verification_completed,
            "onboarding_completed": self.onboarding_completed,
            "created_at": self.created_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }

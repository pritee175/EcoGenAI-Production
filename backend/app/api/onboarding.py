"""
Onboarding API Endpoints
Handles user onboarding flow and cloud integration setup
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from ..database import get_db
from ..models.cloud_integration import (
    CloudIntegration, OnboardingStatus, 
    CloudProvider, ConnectionStatus
)
from ..services.cloud_connector import CloudConnector

router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])

# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class OnboardingStatusResponse(BaseModel):
    user_email: str
    step_welcome_completed: bool
    step_cloud_selection_completed: bool
    step_credentials_completed: bool
    step_verification_completed: bool
    onboarding_completed: bool
    has_cloud_integration: bool

class CloudSelectionRequest(BaseModel):
    user_email: str
    provider: str
    organization_name: Optional[str] = None

class CredentialsRequest(BaseModel):
    user_email: str
    access_key: str
    secret_key: Optional[str] = None
    regions_to_monitor: Optional[str] = None

class VerificationResponse(BaseModel):
    success: bool
    message: str
    account_details: Optional[dict] = None

# ============================================================================
# ONBOARDING ENDPOINTS
# ============================================================================

@router.get("/status/{user_email}", response_model=OnboardingStatusResponse)
def get_onboarding_status(user_email: str, db: Session = Depends(get_db)):
    """
    Get user's onboarding progress
    Called when user logs in to determine if they need onboarding
    """
    # Get or create onboarding status
    status = db.query(OnboardingStatus).filter(
        OnboardingStatus.user_email == user_email
    ).first()
    
    if not status:
        # Create new onboarding status for first-time user
        status = OnboardingStatus(user_email=user_email)
        db.add(status)
        db.commit()
        db.refresh(status)
    
    # Check if user has cloud integration
    has_integration = db.query(CloudIntegration).filter(
        CloudIntegration.user_email == user_email
    ).first() is not None
    
    return {
        "user_email": status.user_email,
        "step_welcome_completed": status.step_welcome_completed,
        "step_cloud_selection_completed": status.step_cloud_selection_completed,
        "step_credentials_completed": status.step_credentials_completed,
        "step_verification_completed": status.step_verification_completed,
        "onboarding_completed": status.onboarding_completed,
        "has_cloud_integration": has_integration
    }

@router.post("/step/welcome")
def complete_welcome_step(user_email: str, db: Session = Depends(get_db)):
    """Mark welcome step as completed"""
    status = db.query(OnboardingStatus).filter(
        OnboardingStatus.user_email == user_email
    ).first()
    
    if not status:
        status = OnboardingStatus(user_email=user_email)
        db.add(status)
    
    status.step_welcome_completed = True
    db.commit()
    
    return {"message": "Welcome step completed", "success": True}

@router.post("/step/cloud-selection")
def complete_cloud_selection(request: CloudSelectionRequest, db: Session = Depends(get_db)):
    """
    User selects cloud provider (AWS, Azure, GCP, Internal)
    Creates CloudIntegration record in PENDING status
    """
    # Validate provider
    try:
        provider_enum = CloudProvider(request.provider.lower())
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid cloud provider")
    
    # Check if integration already exists
    existing = db.query(CloudIntegration).filter(
        CloudIntegration.user_email == request.user_email
    ).first()
    
    if existing:
        # Update existing integration
        existing.provider = provider_enum
        existing.organization_name = request.organization_name
        existing.status = ConnectionStatus.PENDING
    else:
        # Create new integration
        integration = CloudIntegration(
            user_email=request.user_email,
            organization_name=request.organization_name,
            provider=provider_enum,
            access_key="",  # Will be set in next step
            status=ConnectionStatus.PENDING
        )
        db.add(integration)
    
    # Get or create onboarding status
    status = db.query(OnboardingStatus).filter(
        OnboardingStatus.user_email == request.user_email
    ).first()
    
    if not status:
        status = OnboardingStatus(user_email=request.user_email)
        db.add(status)
    
    status.step_cloud_selection_completed = True
    
    db.commit()
    
    return {
        "message": f"{request.provider.upper()} selected successfully",
        "success": True,
        "provider": request.provider
    }

@router.post("/step/credentials", response_model=VerificationResponse)
def submit_credentials(request: CredentialsRequest, db: Session = Depends(get_db)):
    """
    User submits cloud credentials
    Verifies credentials and updates CloudIntegration record
    """
    # Get existing integration
    integration = db.query(CloudIntegration).filter(
        CloudIntegration.user_email == request.user_email
    ).first()
    
    if not integration:
        raise HTTPException(status_code=404, detail="Cloud integration not found. Please select a provider first.")
    
    # Verify credentials
    verification = CloudConnector.verify_credentials(
        integration.provider.value,
        request.access_key,
        request.secret_key
    )
    
    if not verification["success"]:
        integration.status = ConnectionStatus.FAILED
        integration.error_message = verification.get("error", "Verification failed")
        db.commit()
        
        return {
            "success": False,
            "message": verification.get("error", "Verification failed"),
            "account_details": None
        }
    
    # Store credentials (in production, encrypt these!)
    integration.access_key = request.access_key
    integration.secret_key = request.secret_key
    integration.regions_to_monitor = request.regions_to_monitor
    integration.status = ConnectionStatus.CONNECTED
    integration.error_message = None
    
    # Extract account details from verification
    if integration.provider == CloudProvider.AWS:
        integration.provider_account_id = verification.get("account_id")
    elif integration.provider == CloudProvider.AZURE:
        integration.provider_account_id = verification.get("subscription_id")
    elif integration.provider == CloudProvider.GCP:
        integration.provider_account_id = verification.get("project_id")
    
    # Update onboarding status
    status = db.query(OnboardingStatus).filter(
        OnboardingStatus.user_email == request.user_email
    ).first()
    
    if status:
        status.step_credentials_completed = True
        status.step_verification_completed = True
    
    db.commit()
    
    return {
        "success": True,
        "message": "Credentials verified successfully. EcoGenAI is now monitoring your AI workloads.",
        "account_details": {
            "provider": integration.provider.value,
            "account_id": integration.provider_account_id,
            "regions": verification.get("regions", [])
        }
    }

@router.post("/complete")
def complete_onboarding(user_email: str, db: Session = Depends(get_db)):
    """
    Mark onboarding as fully completed
    User can now access the dashboard
    """
    status = db.query(OnboardingStatus).filter(
        OnboardingStatus.user_email == user_email
    ).first()
    
    if not status:
        raise HTTPException(status_code=404, detail="Onboarding status not found")
    
    status.onboarding_completed = True
    status.completed_at = datetime.utcnow()
    db.commit()
    
    return {
        "message": "Onboarding completed! Welcome to EcoGenAI.",
        "success": True,
        "redirect_to": "/dashboard"
    }

# ============================================================================
# CLOUD INTEGRATION MANAGEMENT
# ============================================================================

@router.get("/integrations/{user_email}")
def get_user_integrations(user_email: str, db: Session = Depends(get_db)):
    """Get all cloud integrations for a user"""
    integrations = db.query(CloudIntegration).filter(
        CloudIntegration.user_email == user_email
    ).all()
    
    return [integration.to_dict() for integration in integrations]

@router.delete("/integrations/{integration_id}")
def delete_integration(integration_id: int, db: Session = Depends(get_db)):
    """
    Disconnect cloud integration
    Stops monitoring but keeps historical data
    """
    integration = db.query(CloudIntegration).filter(
        CloudIntegration.id == integration_id
    ).first()
    
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    integration.status = ConnectionStatus.DISCONNECTED
    db.commit()
    
    return {
        "message": "Cloud integration disconnected",
        "success": True
    }

@router.post("/integrations/{integration_id}/reconnect")
def reconnect_integration(integration_id: int, db: Session = Depends(get_db)):
    """Reconnect a disconnected integration"""
    integration = db.query(CloudIntegration).filter(
        CloudIntegration.id == integration_id
    ).first()
    
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    # Re-verify credentials
    verification = CloudConnector.verify_credentials(
        integration.provider.value,
        integration.access_key,
        integration.secret_key
    )
    
    if verification["success"]:
        integration.status = ConnectionStatus.CONNECTED
        integration.error_message = None
        db.commit()
        return {"message": "Integration reconnected", "success": True}
    else:
        integration.status = ConnectionStatus.FAILED
        integration.error_message = verification.get("error")
        db.commit()
        return {"message": verification.get("error"), "success": False}

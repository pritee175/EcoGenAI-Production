"""
FastAPI endpoints for user profile management
Handles profile creation, retrieval, and updates
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

from ..database import get_db
from ..models.user_profile import UserProfile

router = APIRouter(prefix="/api/profile", tags=["profile"])

# Pydantic models for request/response
class ProfileCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    organization_name: Optional[str] = None

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    phone_number: Optional[str] = None
    organization_name: Optional[str] = None
    organization_size: Optional[str] = None
    industry: Optional[str] = None
    avatar_url: Optional[str] = None
    language_preference: Optional[str] = None
    timezone: Optional[str] = None
    notification_email: Optional[bool] = None
    notification_dashboard: Optional[bool] = None
    bio: Optional[str] = None

@router.post("/create")
async def create_profile(profile_data: ProfileCreate, db: Session = Depends(get_db)):
    """
    Create a new user profile
    Called automatically after login/registration
    """
    # Check if profile already exists
    existing_profile = db.query(UserProfile).filter(
        UserProfile.email == profile_data.email
    ).first()
    
    if existing_profile:
        # Update last login
        existing_profile.last_login = datetime.utcnow()
        db.commit()
        return {
            "message": "Profile already exists",
            "profile": existing_profile.to_dict()
        }
    
    # Create new profile
    new_profile = UserProfile(
        email=profile_data.email,
        full_name=profile_data.full_name,
        organization_name=profile_data.organization_name,
        last_login=datetime.utcnow()
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    return {
        "message": "Profile created successfully",
        "profile": new_profile.to_dict()
    }

@router.get("/{email}")
async def get_profile(email: str, db: Session = Depends(get_db)):
    """
    Get user profile by email
    """
    profile = db.query(UserProfile).filter(UserProfile.email == email).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return profile.to_dict()

@router.put("/{email}")
async def update_profile(
    email: str,
    profile_update: ProfileUpdate,
    db: Session = Depends(get_db)
):
    """
    Update user profile
    """
    profile = db.query(UserProfile).filter(UserProfile.email == email).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Update fields
    update_data = profile_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    profile.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(profile)
    
    return {
        "message": "Profile updated successfully",
        "profile": profile.to_dict()
    }

@router.delete("/{email}")
async def delete_profile(email: str, db: Session = Depends(get_db)):
    """
    Delete user profile (soft delete by setting is_active to False)
    """
    profile = db.query(UserProfile).filter(UserProfile.email == email).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile.is_active = False
    profile.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Profile deactivated successfully"}

@router.post("/{email}/update-login")
async def update_last_login(email: str, db: Session = Depends(get_db)):
    """
    Update last login timestamp
    Called automatically on each login
    """
    profile = db.query(UserProfile).filter(UserProfile.email == email).first()
    
    if not profile:
        # Create profile if it doesn't exist
        profile = UserProfile(
            email=email,
            last_login=datetime.utcnow()
        )
        db.add(profile)
    else:
        profile.last_login = datetime.utcnow()
    
    db.commit()
    db.refresh(profile)
    
    return {
        "message": "Last login updated",
        "last_login": profile.last_login.isoformat()
    }

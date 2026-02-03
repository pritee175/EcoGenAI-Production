"""
SQLAlchemy models for user profiles
Stores user information, preferences, and settings
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime
from ..database import Base

class UserProfile(Base):
    """
    Stores user profile information and preferences
    Created automatically after login/registration
    """
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    
    # Basic Information
    full_name = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    department = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    
    # Organization Information
    organization_name = Column(String, nullable=True)
    organization_size = Column(String, nullable=True)  # Small, Medium, Large, Enterprise
    industry = Column(String, nullable=True)
    
    # Profile Picture
    avatar_url = Column(String, nullable=True)
    
    # Preferences
    language_preference = Column(String, default="en", nullable=False)
    timezone = Column(String, default="UTC", nullable=False)
    notification_email = Column(Boolean, default=True, nullable=False)
    notification_dashboard = Column(Boolean, default=True, nullable=False)
    
    # Bio/Notes
    bio = Column(Text, nullable=True)
    
    # Account Status
    is_active = Column(Boolean, default=True, nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "job_title": self.job_title,
            "department": self.department,
            "phone_number": self.phone_number,
            "organization_name": self.organization_name,
            "organization_size": self.organization_size,
            "industry": self.industry,
            "avatar_url": self.avatar_url,
            "language_preference": self.language_preference,
            "timezone": self.timezone,
            "notification_email": self.notification_email,
            "notification_dashboard": self.notification_dashboard,
            "bio": self.bio,
            "is_active": self.is_active,
            "email_verified": self.email_verified,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "last_login": self.last_login.isoformat() if self.last_login else None
        }

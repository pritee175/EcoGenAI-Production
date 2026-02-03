# User Profile Feature - Implementation Guide

## Overview
Complete user profile management system with automatic profile creation on login and comprehensive profile editing capabilities.

## Backend Implementation

### 1. Database Model (`backend/app/models/user_profile.py`)
- **UserProfile** table with fields:
  - Basic info: email, full_name, job_title, department, phone_number
  - Organization: organization_name, organization_size, industry
  - Preferences: language_preference, timezone, notification settings
  - Bio and avatar support
  - Timestamps: created_at, updated_at, last_login

### 2. API Endpoints (`backend/app/api/profile.py`)
- `POST /api/profile/create` - Create new profile (auto-called on login)
- `GET /api/profile/{email}` - Get user profile
- `PUT /api/profile/{email}` - Update profile
- `DELETE /api/profile/{email}` - Soft delete (deactivate)
- `POST /api/profile/{email}/update-login` - Update last login timestamp

### 3. Integration
- Profile router added to `main.py`
- UserProfile model imported to ensure table creation
- Automatic profile creation/update on login

## Frontend Implementation

### 1. Profile Page (`frontend-new/app/dashboard/profile/page.tsx`)
Features:
- **Profile Picture Section** - Avatar display with upload button
- **Personal Information** - Name, email, job title, department, phone
- **Organization Information** - Company name, size, industry, bio
- **Notification Preferences** - Toggle switches for email and dashboard notifications
- **Account Information** - Display creation date, last update, last login
- **Save/Cancel Actions** - Update profile with loading states and success feedback

### 2. Login Integration (`frontend-new/app/login/page.tsx`)
- Saves user email to localStorage on login
- Creates profile automatically for new users
- Updates last_login timestamp for existing users
- Seamless integration with onboarding flow

### 3. Navigation (`frontend-new/components/dashboard/sidebar.tsx`)
- Added "Profile" link to sidebar navigation
- User icon for easy identification
- Accessible from all dashboard pages

## User Flow

### New User Registration
1. User signs up with email/password or Google
2. Email saved to localStorage
3. Profile created automatically with email and full name
4. User redirected to onboarding
5. After onboarding, can access profile page to complete details

### Existing User Login
1. User logs in
2. Email saved to localStorage
3. Last login timestamp updated
4. User redirected to dashboard
5. Can access profile page anytime from sidebar

### Profile Management
1. Navigate to Profile from sidebar
2. View current profile information
3. Edit any field (except email - read-only)
4. Toggle notification preferences
5. Click "Save Changes" to update
6. Success message displayed
7. Changes reflected immediately

## Data Persistence

### Profile Creation
- Automatically created on first login
- Email is unique identifier
- If profile exists, last_login is updated
- No duplicate profiles possible

### Profile Updates
- All fields optional except email
- Updated_at timestamp auto-updated
- Changes saved to database immediately
- Frontend state synchronized with backend

## Security Considerations

### Current Implementation
- Email stored in localStorage for session management
- Profile accessible only with valid email
- No authentication tokens (demo mode)

### Production Recommendations
1. Implement JWT authentication
2. Encrypt sensitive data (phone numbers)
3. Add profile picture upload to cloud storage
4. Implement rate limiting on API endpoints
5. Add CSRF protection
6. Validate all input fields server-side

## API Examples

### Create Profile
```bash
POST http://localhost:8000/api/profile/create
Content-Type: application/json

{
  "email": "user@example.com",
  "full_name": "John Doe",
  "organization_name": "Allianz SE"
}
```

### Get Profile
```bash
GET http://localhost:8000/api/profile/user@example.com
```

### Update Profile
```bash
PUT http://localhost:8000/api/profile/user@example.com
Content-Type: application/json

{
  "full_name": "John Smith",
  "job_title": "ESG Manager",
  "department": "Sustainability",
  "phone_number": "+1 555-123-4567",
  "organization_name": "Allianz SE",
  "organization_size": "Enterprise",
  "industry": "Financial Services",
  "bio": "Passionate about sustainability and ESG compliance",
  "notification_email": true,
  "notification_dashboard": true
}
```

### Update Last Login
```bash
POST http://localhost:8000/api/profile/user@example.com/update-login
```

## Database Schema

```sql
CREATE TABLE user_profiles (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR,
    job_title VARCHAR,
    department VARCHAR,
    phone_number VARCHAR,
    organization_name VARCHAR,
    organization_size VARCHAR,
    industry VARCHAR,
    avatar_url VARCHAR,
    language_preference VARCHAR DEFAULT 'en',
    timezone VARCHAR DEFAULT 'UTC',
    notification_email BOOLEAN DEFAULT TRUE,
    notification_dashboard BOOLEAN DEFAULT TRUE,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

## Testing Checklist

- [ ] New user registration creates profile
- [ ] Existing user login updates last_login
- [ ] Profile page loads correctly
- [ ] All form fields editable
- [ ] Save button updates profile
- [ ] Success message displays
- [ ] Cancel button resets form
- [ ] Notification toggles work
- [ ] Email field is read-only
- [ ] Account info displays correctly
- [ ] Profile link in sidebar works
- [ ] Backend API endpoints respond correctly
- [ ] Database table created automatically

## Future Enhancements

1. **Profile Picture Upload**
   - Integration with cloud storage (AWS S3, Azure Blob)
   - Image cropping and resizing
   - Avatar generation from initials

2. **Email Verification**
   - Send verification email on registration
   - Verify email before full access
   - Resend verification option

3. **Password Management**
   - Change password functionality
   - Password strength indicator
   - Forgot password flow

4. **Two-Factor Authentication**
   - SMS or authenticator app
   - Backup codes
   - Recovery options

5. **Activity Log**
   - Track profile changes
   - Login history
   - Security events

6. **Privacy Settings**
   - Data export
   - Account deletion
   - Privacy preferences

7. **Team Management**
   - Invite team members
   - Role-based access
   - Organization hierarchy

## Files Modified/Created

### Backend
- ✅ `backend/app/models/user_profile.py` (NEW)
- ✅ `backend/app/api/profile.py` (NEW)
- ✅ `backend/app/main.py` (MODIFIED - added profile router and import)

### Frontend
- ✅ `frontend-new/app/dashboard/profile/page.tsx` (NEW)
- ✅ `frontend-new/app/login/page.tsx` (MODIFIED - added profile creation)
- ✅ `frontend-new/components/dashboard/sidebar.tsx` (MODIFIED - added profile link)

### Documentation
- ✅ `PROFILE-FEATURE.md` (NEW - this file)

## Deployment Notes

1. Backend will automatically create `user_profiles` table on startup
2. No database migration required (SQLAlchemy handles it)
3. Existing users will have profiles created on next login
4. No breaking changes to existing functionality

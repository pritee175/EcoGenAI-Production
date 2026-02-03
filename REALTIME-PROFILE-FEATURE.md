# Real-Time Profile Display Feature

## Overview
The header now displays the logged-in user's profile information in real-time, automatically updating when the user changes their profile settings.

## Implementation Details

### 1. Auth Context (`lib/auth-context.tsx`)
Created a centralized authentication context that:
- Listens to Firebase authentication state changes
- Automatically fetches user profile from backend when user logs in
- Provides `user`, `profile`, and `loading` states throughout the app
- Includes `refreshProfile()` method to manually refresh profile data
- Handles timeouts gracefully (3-second timeout for profile fetch)

**Key Features:**
```typescript
interface AuthContextType {
  user: User | null              // Firebase user object
  profile: UserProfile | null    // Backend profile data
  loading: boolean               // Loading state
  refreshProfile: () => Promise<void>  // Refresh profile manually
}
```

### 2. Updated Header Component (`components/dashboard/header.tsx`)
The header now:
- Uses `useAuth()` hook to access current user and profile
- Displays real user name from profile or Firebase
- Shows job title from profile or defaults to "Team Member"
- Displays user avatar from profile or Firebase photoURL
- Shows loading skeleton while fetching profile
- Includes "Profile Settings" link in dropdown
- Includes "Sign Out" functionality

**Display Logic:**
- **Name**: `profile.full_name` → `user.displayName` → `email username` → "User"
- **Role**: `profile.job_title` → "Team Member"
- **Avatar**: `profile.avatar_url` → `user.photoURL` → default icon

### 3. Dashboard Layout (`app/dashboard/layout.tsx`)
Wrapped the entire dashboard with `AuthProvider` to make auth context available to all dashboard pages.

### 4. Profile Page Integration (`app/dashboard/profile/page.tsx`)
Updated to:
- Use `useAuth()` hook to get current user
- Call `refreshProfile()` after saving changes to update header immediately
- Prefer auth context email over localStorage

## User Experience Flow

### Login/Signup
1. User logs in via Firebase (email/password or Google)
2. Auth context detects authentication state change
3. Profile is fetched from backend automatically
4. Header displays user information immediately

### Profile Update
1. User navigates to Profile Settings
2. User updates name, job title, or other information
3. User clicks "Save Changes"
4. Profile is saved to backend
5. `refreshProfile()` is called automatically
6. Header updates with new information instantly (no page refresh needed)

### Sign Out
1. User clicks "Sign Out" in header dropdown
2. Firebase signs out the user
3. Auth context clears user and profile state
4. User is redirected to login page

## Technical Benefits

### Real-Time Updates
- Profile changes reflect immediately in header
- No manual page refresh required
- Smooth user experience

### Performance
- Profile fetched once on login
- Cached in React context
- Only refetched when explicitly updated
- 3-second timeout prevents hanging

### Reliability
- Graceful fallback to Firebase user data if backend fails
- Loading states prevent UI flicker
- Error handling for network issues

### Maintainability
- Centralized auth logic in one context
- Easy to add new profile fields
- Consistent user data access across all components

## API Integration

### Profile Fetch
```
GET /api/profile/{email}
Response: UserProfile object
```

### Profile Update
```
PUT /api/profile/{email}
Body: Updated profile fields
Response: Updated UserProfile object
```

## Future Enhancements

1. **Avatar Upload**: Implement actual image upload functionality
2. **Real-Time Sync**: Use WebSocket to sync profile changes across multiple tabs
3. **Offline Support**: Cache profile data for offline access
4. **Profile Completion**: Show progress indicator for incomplete profiles
5. **Role-Based UI**: Customize dashboard based on user role/job title

## Testing

### Test Scenarios
1. ✅ Login with email/password → Profile displays correctly
2. ✅ Login with Google → Profile displays correctly
3. ✅ Update profile name → Header updates immediately
4. ✅ Update job title → Header updates immediately
5. ✅ Sign out → User redirected to login
6. ✅ Backend timeout → Graceful fallback to Firebase data
7. ✅ No profile in backend → Shows email username

### Manual Testing Steps
1. Start backend: `cd EcoGenAI/backend && python -m uvicorn app.main:app --reload`
2. Start frontend: `cd EcoGenAI/frontend-new && npm run dev`
3. Login with test account
4. Verify header shows correct name and role
5. Navigate to Profile Settings
6. Update name and job title
7. Click Save Changes
8. Verify header updates without page refresh
9. Click Sign Out
10. Verify redirect to login page

## Files Modified

1. **Created**: `EcoGenAI/frontend-new/lib/auth-context.tsx`
   - New auth context provider

2. **Updated**: `EcoGenAI/frontend-new/components/dashboard/header.tsx`
   - Integrated auth context
   - Added real-time profile display
   - Added sign out functionality

3. **Updated**: `EcoGenAI/frontend-new/app/dashboard/layout.tsx`
   - Wrapped with AuthProvider

4. **Updated**: `EcoGenAI/frontend-new/app/dashboard/profile/page.tsx`
   - Integrated auth context
   - Added profile refresh on save

## Dependencies

- Firebase Auth (already installed)
- React Context API (built-in)
- Next.js App Router (already configured)

No additional packages required!

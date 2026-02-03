# Test Real-Time Profile Feature

## Quick Test Guide

### Prerequisites
1. Backend running on `http://localhost:8000`
2. Frontend running on `http://localhost:3000`
3. Firebase configured with valid credentials

### Test Steps

#### 1. Test Login & Profile Display
```
1. Navigate to http://localhost:3000/login
2. Login with email/password or Google
3. ✅ Verify header shows your name (or email username if no profile)
4. ✅ Verify header shows role (or "Team Member" if no job title)
5. ✅ Verify avatar displays (Firebase photo or default icon)
```

#### 2. Test Profile Update
```
1. Click on your profile in the header
2. Click "Profile Settings"
3. Update your Full Name to "John Smith"
4. Update Job Title to "Sustainability Manager"
5. Click "Save Changes"
6. ✅ Verify success message appears
7. ✅ Verify header updates to show "John Smith"
8. ✅ Verify header updates to show "Sustainability Manager"
9. ✅ NO PAGE REFRESH REQUIRED - updates instantly!
```

#### 3. Test Sign Out
```
1. Click on your profile in the header
2. Click "Sign Out"
3. ✅ Verify you're redirected to login page
4. ✅ Verify header no longer shows your profile
```

#### 4. Test Loading States
```
1. Login again
2. ✅ Verify loading skeleton appears briefly in header
3. ✅ Verify profile loads smoothly without flicker
```

#### 5. Test Fallback Behavior
```
1. Stop the backend server
2. Login with Google (Firebase still works)
3. ✅ Verify header shows your Google display name
4. ✅ Verify header shows "Team Member" as default role
5. ✅ No errors in console (graceful fallback)
```

### Expected Results

#### Header Display Priority
- **Name**: Profile Full Name → Firebase Display Name → Email Username → "User"
- **Role**: Profile Job Title → "Team Member"
- **Avatar**: Profile Avatar URL → Firebase Photo URL → Default Icon

#### Real-Time Updates
- Profile changes reflect immediately in header
- No page refresh needed
- Smooth transition without flicker

#### Error Handling
- Backend timeout (3 seconds) → Falls back to Firebase data
- No profile in backend → Shows Firebase data
- Network error → Shows Firebase data
- All errors logged to console, not shown to user

### Common Issues & Solutions

#### Issue: Header shows "User" instead of name
**Solution**: 
- Check if profile exists in backend: `GET http://localhost:8000/api/profile/{email}`
- If 404, profile needs to be created during signup
- Check Firebase user has displayName set

#### Issue: Header doesn't update after profile save
**Solution**:
- Check browser console for errors
- Verify `refreshProfile()` is called after save
- Check network tab for profile fetch request

#### Issue: Loading state never ends
**Solution**:
- Check backend is running
- Check Firebase is configured correctly
- Check browser console for auth errors
- Verify 3-second timeout is working

#### Issue: Sign out doesn't work
**Solution**:
- Check Firebase auth is initialized
- Check `logOut()` function in firebase.ts
- Verify router.push('/login') is called

### Browser Console Checks

#### Expected Console Messages (Normal Flow)
```
✅ No errors
✅ Profile fetch successful (or timeout warning)
✅ Auth state change detected
```

#### Warning Messages (Expected)
```
⚠️ "Failed to fetch profile" - Normal if backend is slow/down
⚠️ "Profile creation error" - Normal if profile already exists
```

#### Error Messages (Investigate)
```
❌ "useAuth must be used within an AuthProvider" - AuthProvider not wrapping component
❌ "Firebase auth error" - Firebase configuration issue
❌ Network errors - Backend not running or CORS issue
```

### Performance Checks

#### Profile Load Time
- Initial load: < 1 second
- Profile refresh: < 500ms
- Timeout: 3 seconds max

#### Memory Usage
- Auth context: Minimal overhead
- Profile data: ~1KB per user
- No memory leaks on profile updates

### Accessibility Checks

#### Keyboard Navigation
- ✅ Tab to profile dropdown
- ✅ Enter to open dropdown
- ✅ Arrow keys to navigate menu
- ✅ Enter to select menu item

#### Screen Reader
- ✅ Profile name announced
- ✅ Role announced
- ✅ Menu items announced
- ✅ Loading state announced

### Mobile Testing

#### Responsive Design
- ✅ Profile displays on mobile (icon only on small screens)
- ✅ Dropdown works on touch devices
- ✅ Sign out accessible on mobile

## Automated Testing (Future)

### Unit Tests
```typescript
// Test auth context
describe('AuthContext', () => {
  it('should fetch profile on login')
  it('should refresh profile on demand')
  it('should clear profile on logout')
  it('should handle timeout gracefully')
})

// Test header component
describe('Header', () => {
  it('should display user name from profile')
  it('should display job title from profile')
  it('should show loading state')
  it('should handle sign out')
})
```

### Integration Tests
```typescript
// Test full flow
describe('Profile Feature', () => {
  it('should login and display profile')
  it('should update profile and refresh header')
  it('should sign out and redirect')
})
```

## Success Criteria

✅ **Functionality**
- Login displays profile correctly
- Profile updates reflect in header immediately
- Sign out works correctly
- Loading states display properly

✅ **Performance**
- Profile loads in < 1 second
- Updates happen instantly
- No unnecessary re-renders

✅ **Reliability**
- Graceful fallback when backend is down
- No errors in console (only warnings)
- Works across all browsers

✅ **User Experience**
- Smooth transitions
- No flicker or jumps
- Clear loading indicators
- Intuitive dropdown menu

## Test Report Template

```
Date: ___________
Tester: ___________
Browser: ___________

[ ] Login & Profile Display
[ ] Profile Update
[ ] Sign Out
[ ] Loading States
[ ] Fallback Behavior
[ ] Performance
[ ] Accessibility
[ ] Mobile

Issues Found:
1. ___________
2. ___________

Overall Status: PASS / FAIL
```

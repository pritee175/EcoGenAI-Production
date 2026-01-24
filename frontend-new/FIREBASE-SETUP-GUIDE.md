# Firebase Authentication Setup Guide

## Current Status
✅ Firebase SDK installed (`firebase@12.8.0`)
✅ Authentication functions implemented
✅ Login page with Google SSO and Email/Password
✅ Logout functionality in sidebar
⚠️ **INCOMPLETE**: Firebase credentials need to be added

---

## Step 1: Get Firebase Credentials

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/project/ecogenai-f90f4/settings/general
   - Or navigate to: Project Settings → General

2. **Find Your Web App Configuration**
   - Scroll down to "Your apps" section
   - If you don't see a web app, click "Add app" → Web (</>) icon
   - Copy the configuration values

3. **Copy These Values**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",              // Copy this
     authDomain: "ecogenai-f90f4.firebaseapp.com",
     projectId: "ecogenai-f90f4",
     storageBucket: "ecogenai-f90f4.appspot.com",
     messagingSenderId: "123456789",  // Copy this
     appId: "1:123456789:web:abc123"  // Copy this
   };
   ```

---

## Step 2: Update Environment Variables

1. **Open the file**: `final_frontened/.env.local`

2. **Replace the placeholder values** with your actual Firebase credentials:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecogenai-f90f4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecogenai-f90f4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecogenai-f90f4.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

3. **Save the file**

---

## Step 3: Enable Authentication Methods in Firebase

### Enable Google Sign-In (SSO)

1. Go to: https://console.firebase.google.com/project/ecogenai-f90f4/authentication/providers
2. Click on "Google" provider
3. Click "Enable"
4. Add your project support email
5. **Optional**: Add authorized domains if needed
6. Click "Save"

### Enable Email/Password Authentication

1. In the same Authentication → Sign-in method page
2. Click on "Email/Password" provider
3. Click "Enable"
4. Toggle "Email/Password" to ON
5. Click "Save"

---

## Step 4: Configure Authorized Domains

1. Go to: Authentication → Settings → Authorized domains
2. Make sure these domains are added:
   - `localhost` (for development)
   - Your production domain (when deploying)

---

## Step 5: Restart the Development Server

After updating `.env.local`, you MUST restart the Next.js server:

```powershell
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 6: Test Authentication

### Test Email/Password Login
1. Open: http://localhost:3001
2. Use the pre-filled credentials:
   - Email: `sarah.mueller@allianz.com`
   - Password: `password123`
3. Click "Sign in with Email"

**Note**: You'll need to create this user first in Firebase Console:
- Go to: Authentication → Users → Add user
- Email: `sarah.mueller@allianz.com`
- Password: `password123`

### Test Google SSO
1. Click "Sign in with Google (SSO)"
2. Select your Google account
3. **Important**: Only `@allianz.com` emails are allowed

---

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is correct
- Make sure there are no extra spaces or quotes
- Restart the dev server after changing `.env.local`

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Enable the authentication method in Firebase Console
- Go to Authentication → Sign-in method
- Enable Email/Password or Google

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Add `localhost` to authorized domains
- Go to Authentication → Settings → Authorized domains

### Vanta.js Background Not Showing
- Open browser DevTools (F12)
- Check Console tab for errors
- Look for messages like "Three.js loaded" and "Vanta effect initialized"
- If you see errors, the scripts might be blocked by browser extensions

### Google Sign-In Opens But Doesn't Work
- Make sure Google provider is enabled in Firebase Console
- Check that the email domain is `@allianz.com`
- Clear browser cache and try again

---

## Security Notes

### Domain Restriction
- Google Sign-In is configured to only allow `@allianz.com` emails
- This is set in `lib/firebase.ts` with `hd: 'allianz.com'`

### Environment Variables
- Never commit `.env.local` to Git (it's in `.gitignore`)
- Use different Firebase projects for development and production
- Rotate API keys if they're accidentally exposed

---

## File Structure

```
final_frontened/
├── .env.local                    # Firebase credentials (UPDATE THIS)
├── lib/
│   └── firebase.ts              # Firebase configuration & auth functions
├── app/
│   ├── page.tsx                 # Login page with Vanta.js background
│   └── dashboard/
│       └── layout.tsx           # Dashboard layout
└── components/
    └── dashboard/
        └── sidebar.tsx          # Sidebar with logout button
```

---

## What's Implemented

✅ **Login Page** (`app/page.tsx`)
- Vanta.js animated clouds background
- Email/Password login form
- Google SSO button
- Error handling with alerts
- Allianz branding and colors

✅ **Firebase Integration** (`lib/firebase.ts`)
- `signInWithGoogle()` - Google SSO with domain restriction
- `signInWithEmail()` - Email/Password authentication
- `signUpWithEmail()` - User registration
- `logOut()` - Sign out functionality

✅ **Protected Dashboard**
- Logout button in sidebar
- Redirects to login after logout
- All dashboard pages accessible after login

---

## Next Steps After Setup

1. **Add Protected Routes**
   - Create middleware to check authentication
   - Redirect unauthenticated users to login

2. **Add User Profile**
   - Display user name and email in header
   - Add user avatar from Google profile

3. **Add Role-Based Access**
   - Define user roles (admin, viewer, etc.)
   - Restrict certain pages based on roles

4. **Production Deployment**
   - Create production Firebase project
   - Update environment variables
   - Add production domain to authorized domains

---

## Quick Start Commands

```powershell
# Install dependencies (if not done)
cd final_frontened
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3001
```

---

## Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify Firebase credentials in `.env.local`
3. Ensure authentication methods are enabled in Firebase Console
4. Restart the dev server after any `.env.local` changes

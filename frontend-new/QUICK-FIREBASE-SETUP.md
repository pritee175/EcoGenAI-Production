# 🚀 Quick Firebase Setup (5 Minutes)

## Step 1: Get Your Firebase Credentials (2 minutes)

1. **Open this link**: https://console.firebase.google.com/project/ecogenai-f90f4/settings/general

2. **Scroll down** to "Your apps" section

3. **Find the Web app** (or click "Add app" if none exists)

4. **Copy these 3 values**:
   ```
   apiKey: "AIza..."
   messagingSenderId: "123456789"
   appId: "1:123456789:web:abc123"
   ```

---

## Step 2: Update .env.local (1 minute)

1. **Open**: `final_frontened/.env.local`

2. **Replace** these 3 lines:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```

3. **With your actual values** from Step 1

4. **Save the file**

---

## Step 3: Enable Authentication (2 minutes)

1. **Open**: https://console.firebase.google.com/project/ecogenai-f90f4/authentication/providers

2. **Enable Google**:
   - Click "Google"
   - Toggle "Enable"
   - Add support email
   - Click "Save"

3. **Enable Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"

4. **Create test user**:
   - Go to "Users" tab
   - Click "Add user"
   - Email: `sarah.mueller@allianz.com`
   - Password: `password123`
   - Click "Add user"

---

## Step 4: Start the App (30 seconds)

```powershell
# If server is running, stop it (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 5: Test It! (30 seconds)

1. **Open**: http://localhost:3001

2. **You should see**:
   - Animated clouds background
   - White login card
   - Allianz branding

3. **Try logging in**:
   - Email: `sarah.mueller@allianz.com`
   - Password: `password123`
   - Click "Sign in with Email"

4. **Success!** You should be redirected to the dashboard

---

## 🐛 Troubleshooting

### "Can't see the background animation"
- Open browser DevTools (F12)
- Check Console for errors
- Try opening `test-vanta.html` in your browser
- Disable ad blockers temporarily

### "Firebase: Error (auth/invalid-api-key)"
- Double-check the API key in `.env.local`
- Make sure there are no extra spaces
- Restart the server after changing `.env.local`

### "Firebase: Error (auth/operation-not-allowed)"
- Make sure you enabled Email/Password in Firebase Console
- Go back to Step 3 and enable it

### "Firebase: Error (auth/user-not-found)"
- Create the test user in Firebase Console
- Go to Authentication → Users → Add user

---

## ✅ Done!

Once you complete these steps, you have:
- ✅ Working Firebase authentication
- ✅ Beautiful animated login page
- ✅ Google SSO with domain restriction
- ✅ Secure logout functionality
- ✅ Production-ready authentication system

**Total time**: ~5 minutes

For more details, see `FIREBASE-SETUP-GUIDE.md`

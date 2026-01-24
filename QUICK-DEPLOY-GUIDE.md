# Quick Deploy Guide - Vercel

## Step 1: Go to Vercel
Open: https://vercel.com/new

## Step 2: Import Repository
- Click "Import Git Repository"
- Select: **EcoGenAI-Production**
- Click "Import"

## Step 3: Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: Click "Edit" → Type `frontend-new`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## Step 4: Import Environment Variables

### Option A: Copy-Paste (Easiest)
1. Click "Environment Variables"
2. Open the file: `VERCEL-ENV-VARIABLES.txt` from this repo
3. Copy ALL the content
4. Paste into Vercel's environment variables section
5. Vercel will automatically parse them

### Option B: Manual Entry
Add these one by one:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyDAYRoi-esn7YTRBW-oGRCAgQ0WjUVjEk8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = ecogenai-f90f4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = ecogenai-f90f4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = ecogenai-f90f4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 842899053497
NEXT_PUBLIC_FIREBASE_APP_ID = 1:842899053497:web:cd3e59a2b142a1b4d23468
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = G-NYSE2C477V
NEXT_PUBLIC_API_URL = http://localhost:8000
```

## Step 5: Deploy
1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

## Step 6: Configure Firebase
1. Go to: https://console.firebase.google.com
2. Select project: **ecogenai-f90f4**
3. Go to: Authentication → Settings → Authorized domains
4. Click "Add domain"
5. Add your Vercel domain (e.g., `your-project-name.vercel.app`)
6. Save

## Done! 🎉

Your app is now live and ready to use!

## Troubleshooting

### Build fails?
- Check that Root Directory is set to `frontend-new`
- Verify all environment variables are added
- Check build logs in Vercel dashboard

### Firebase auth not working?
- Verify Vercel domain is added to Firebase authorized domains
- Check that all Firebase environment variables are correct
- Ensure Google Sign-In is enabled in Firebase Console

### Need to update backend URL?
- Go to Vercel Project Settings → Environment Variables
- Update `NEXT_PUBLIC_API_URL` to your deployed backend URL
- Redeploy the project

---

**Repository**: https://github.com/pritee175/EcoGenAI-Production
**Status**: Ready to Deploy ✅

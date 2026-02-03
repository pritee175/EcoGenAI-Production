# Deploy Backend to Render (Free Tier)

## Quick Deploy Steps

### 1. Push Backend to GitHub (if not already)

Your backend code is already in the repo at `EcoGenAI/backend/`

### 2. Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### 3. Configure Web Service

**Basic Settings:**
- Name: `ecogenai-backend`
- Region: Choose closest to you
- Branch: `main` (or your default branch)
- Root Directory: `backend`
- Runtime: `Python 3`

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Instance Type:**
- Select "Free" (0.1 CPU, 512 MB RAM)

### 4. Environment Variables

Add these in Render dashboard:

```
DATABASE_URL=sqlite:///./ecogenai.db
CORS_ORIGINS=https://eco-gen-ai-jl2y.vercel.app,http://localhost:3000
```

### 5. Deploy

Click "Create Web Service" - Render will:
1. Clone your repo
2. Install dependencies
3. Start the server
4. Give you a URL like: `https://ecogenai-backend.onrender.com`

### 6. Update Vercel Environment Variables

Once backend is deployed, update Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to your Render URL:
   ```
   NEXT_PUBLIC_API_URL=https://ecogenai-backend.onrender.com
   ```
3. Redeploy frontend (Vercel will auto-redeploy)

### 7. Test

Visit: `https://eco-gen-ai-jl2y.vercel.app/onboarding`

Should now connect to your deployed backend!

## Alternative: Railway

If Render doesn't work, try Railway:

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Select your repo
4. Railway auto-detects Python and deploys
5. Add environment variables
6. Get your Railway URL
7. Update Vercel env vars

## Alternative: Use Local Backend for Testing

**Easiest for now:**

1. Keep backend running locally: `py -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
2. Test at: `http://localhost:3000/onboarding` (not Vercel URL)
3. Everything works locally!

## Current Status

✅ Backend works locally on port 8000
✅ Frontend works locally on port 3000
❌ Vercel deployment needs backend URL
⏳ Need to deploy backend to cloud service

## Quick Fix for Testing NOW

Just use your local version:
```
http://localhost:3000/onboarding
```

Backend is already running on your machine!

---

**Recommendation:** For demo/testing, use local version. For production, deploy backend to Render (takes 5-10 minutes).

# Permanent Solution: Deploy Backend to Cloud

## The Problem

**Current Setup:**
- ✅ Frontend: Deployed on Vercel (`https://eco-gen-ai-jl2y.vercel.app`)
- ❌ Backend: Only running locally (`http://localhost:8000`)
- ❌ Vercel frontend can't connect to localhost backend

**Result:** Vercel deployment doesn't work

---

## The Solution

Deploy backend to a cloud service so Vercel can connect to it.

### Option 1: Render (Recommended - Free Tier)
### Option 2: Railway (Alternative)
### Option 3: Google Cloud Run (Advanced)

---

## 🚀 Option 1: Deploy to Render (Easiest)

### Step 1: Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repos

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo: `EcoGenAI`
3. Configure:

**Basic Settings:**
```
Name: ecogenai-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Runtime: Python 3
```

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Instance Type:**
```
Free (0.1 CPU, 512 MB RAM)
```

### Step 3: Add Environment Variables

In Render dashboard, add:

```
DATABASE_URL=sqlite:///./ecogenai.db
CORS_ORIGINS=https://eco-gen-ai-jl2y.vercel.app,http://localhost:3000
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://ecogenai-backend.onrender.com`

### Step 5: Update Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select your project: `eco-gen-ai-jl2y`
3. Go to: **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://ecogenai-backend.onrender.com
   ```
5. Click **"Save"**
6. Go to **Deployments** → Click **"Redeploy"**

### Step 6: Test

1. Go to: `https://eco-gen-ai-jl2y.vercel.app/onboarding`
2. Complete onboarding
3. Should work now!

---

## 🚀 Option 2: Deploy to Railway

### Step 1: Create Railway Account

1. Go to: https://railway.app
2. Sign up with GitHub

### Step 2: Deploy

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `EcoGenAI` repo
4. Railway auto-detects Python
5. Set root directory: `backend`

### Step 3: Add Environment Variables

```
DATABASE_URL=sqlite:///./ecogenai.db
CORS_ORIGINS=https://eco-gen-ai-jl2y.vercel.app,http://localhost:3000
PORT=8000
```

### Step 4: Get URL

Railway gives you a URL like: `https://ecogenai-backend.up.railway.app`

### Step 5: Update Vercel

Same as Render - update `NEXT_PUBLIC_API_URL` in Vercel settings.

---

## 🚀 Option 3: Google Cloud Run (Advanced)

Since you already have GCP setup:

### Step 1: Create Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Step 2: Deploy to Cloud Run

```bash
# Install gcloud CLI
# Then:
cd backend
gcloud run deploy ecogenai-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Step 3: Get URL

Cloud Run gives you: `https://ecogenai-backend-xxx.run.app`

### Step 4: Update Vercel

Update `NEXT_PUBLIC_API_URL` in Vercel.

---

## 📋 Quick Comparison

| Service | Cost | Setup Time | Pros | Cons |
|---------|------|------------|------|------|
| **Render** | Free | 10 min | Easy, auto-deploy | Sleeps after 15min inactivity |
| **Railway** | Free trial | 5 min | Very easy | Limited free tier |
| **Cloud Run** | Pay-per-use | 15 min | Scales well, GCP native | More complex |

**Recommendation:** Start with **Render** (easiest)

---

## 🔧 After Deployment

### Your Setup Will Be:

```
Frontend (Vercel)
    ↓
    https://eco-gen-ai-jl2y.vercel.app
    ↓
    Connects to
    ↓
Backend (Render/Railway/Cloud Run)
    ↓
    https://ecogenai-backend.onrender.com
    ↓
    Connects to
    ↓
Your GCP Project
    ↓
    Monitors GPU instances
```

### Benefits:

✅ Works from anywhere (not just localhost)
✅ Always online (24/7 monitoring)
✅ Real GCP monitoring works
✅ No need to keep laptop running
✅ Can share URL with others

---

## 🎯 Recommended Steps (Right Now)

### For Testing (Today):
**Use local version:**
```
http://localhost:3000/onboarding
```
This works immediately with your local backend.

### For Production (Later):
1. Deploy backend to Render (10 minutes)
2. Update Vercel environment variable
3. Redeploy Vercel
4. Vercel deployment works permanently!

---

## 📝 Quick Deploy Script (Render)

I can create a `render.yaml` file that makes deployment even easier:

```yaml
services:
  - type: web
    name: ecogenai-backend
    env: python
    region: oregon
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        value: sqlite:///./ecogenai.db
      - key: CORS_ORIGINS
        value: https://eco-gen-ai-jl2y.vercel.app,http://localhost:3000
```

Just push this file and Render auto-deploys!

---

## 🐛 Troubleshooting Deployed Backend

### Backend not starting?
- Check Render logs for errors
- Verify `requirements.txt` has all dependencies
- Check Python version (should be 3.12)

### Frontend can't connect?
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Check CORS settings in backend
- Test backend URL directly in browser

### GCP monitoring not working?
- Verify GCP credentials in database
- Check backend logs for GCP API errors
- Ensure service account has permissions

---

## 💡 Summary

**Problem:** Vercel frontend can't connect to localhost backend

**Permanent Solution:** Deploy backend to cloud

**Easiest Option:** Render (free, 10 minutes)

**Steps:**
1. Create Render account
2. Deploy backend
3. Get backend URL
4. Update Vercel env variable
5. Redeploy Vercel
6. ✅ Works permanently!

**For now:** Use `http://localhost:3000` for testing

---

**Want me to help you deploy to Render right now?** I can guide you through it step-by-step!

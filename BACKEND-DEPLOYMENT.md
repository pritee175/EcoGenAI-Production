# Backend Deployment Guide - Render

## Quick Deploy to Render (Free Tier)

### Step 1: Sign Up for Render
1. Go to: https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository: **EcoGenAI-Production**
4. Click **"Connect"**

### Step 3: Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `ecogenai-backend` (or any name you prefer)
- **Region**: Oregon (US West) - or closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Python 3

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Instance Type:**
- Select **"Free"** (0.1 CPU, 512 MB RAM)

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
PYTHON_VERSION = 3.11.0
DATABASE_URL = sqlite:///./ecogenai.db
CORS_ORIGINS = *
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend will be live at: `https://ecogenai-backend.onrender.com`

### Step 6: Update Frontend Environment Variable
1. Go to Vercel: https://vercel.com
2. Open your project: **EcoGenAI-Production**
3. Go to: **Settings → Environment Variables**
4. Find: `NEXT_PUBLIC_API_URL`
5. Update value to: `https://your-backend-url.onrender.com`
6. Click **"Save"**
7. Go to **Deployments** → Click **"Redeploy"** on latest deployment

### Step 7: Test Backend
Visit: `https://your-backend-url.onrender.com/docs`

You should see the FastAPI Swagger documentation.

## Alternative: Deploy to Railway

### Step 1: Sign Up
1. Go to: https://railway.app
2. Sign up with GitHub

### Step 2: New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **EcoGenAI-Production**

### Step 3: Configure
- **Root Directory**: `backend`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 4: Add Environment Variables
```
PYTHON_VERSION=3.11.0
DATABASE_URL=sqlite:///./ecogenai.db
CORS_ORIGINS=*
```

### Step 5: Deploy
Railway will automatically deploy. Your backend will be at: `https://your-app.railway.app`

## Troubleshooting

### Build Fails?
- Check that `requirements.txt` is in the `backend` folder
- Verify Python version is 3.11.0
- Check build logs for specific errors

### Database Issues?
- SQLite works for development but consider PostgreSQL for production
- Render provides free PostgreSQL database
- Update `DATABASE_URL` to use PostgreSQL

### CORS Errors?
- Verify `CORS_ORIGINS` includes your Vercel domain
- Update in backend `.env` or environment variables
- Redeploy after changes

### Port Issues?
- Ensure start command uses `$PORT` variable
- Render/Railway automatically assign ports

## Production Recommendations

### 1. Use PostgreSQL Instead of SQLite
SQLite doesn't persist on Render's free tier. Use PostgreSQL:

1. In Render, create a new PostgreSQL database
2. Copy the **Internal Database URL**
3. Update `DATABASE_URL` environment variable
4. Update `requirements.txt`: Change `psycopg2-binary` version if needed

### 2. Set Proper CORS Origins
Instead of `*`, use your actual domain:
```
CORS_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
```

### 3. Add Health Check Endpoint
Already included in your FastAPI app at `/health`

### 4. Monitor Logs
- Render: Dashboard → Logs
- Railway: Project → Logs

## Cost
- **Render Free Tier**: 
  - 750 hours/month
  - Sleeps after 15 min inactivity
  - Wakes up on request (cold start ~30s)

- **Railway Free Tier**:
  - $5 credit/month
  - No sleep
  - Better for production

## Next Steps After Deployment

1. ✅ Backend deployed and running
2. ✅ Update frontend `NEXT_PUBLIC_API_URL`
3. ✅ Test API endpoints at `/docs`
4. ✅ Verify CORS is working
5. ✅ Test full application flow

---

**Repository**: https://github.com/pritee175/EcoGenAI-Production
**Backend Status**: Ready to Deploy ✅

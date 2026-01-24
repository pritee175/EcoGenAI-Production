# Deploy Backend NOW - Quick Steps

## Option 1: Render (Recommended - Free Forever)

### 1. Go to Render
🔗 https://render.com/

### 2. Sign Up
- Click "Get Started"
- Sign up with GitHub

### 3. New Web Service
- Click **"New +"** button (top right)
- Select **"Web Service"**

### 4. Connect Repository
- Click **"Connect account"** if needed
- Find: **EcoGenAI-Production**
- Click **"Connect"**

### 5. Configure (Copy these exactly)
```
Name: ecogenai-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

### 6. Environment Variables
Click **"Advanced"** → Add these:
```
PYTHON_VERSION = 3.11.0
DATABASE_URL = sqlite:///./ecogenai.db
CORS_ORIGINS = *
```

### 7. Deploy!
- Click **"Create Web Service"**
- Wait 5-10 minutes
- Copy your backend URL (looks like: `https://ecogenai-backend.onrender.com`)

### 8. Update Frontend
1. Go to Vercel: https://vercel.com
2. Open your project
3. Settings → Environment Variables
4. Find `NEXT_PUBLIC_API_URL`
5. Change to your Render URL
6. Save & Redeploy

---

## Option 2: Railway (Faster, $5/month credit)

### 1. Go to Railway
🔗 https://railway.app/

### 2. Sign Up
- Click "Start a New Project"
- Login with GitHub

### 3. Deploy from GitHub
- Click **"Deploy from GitHub repo"**
- Select: **EcoGenAI-Production**
- Click **"Deploy Now"**

### 4. Configure
- Click on the service
- Settings → Root Directory: `backend`
- Variables → Add:
```
PYTHON_VERSION=3.11.0
DATABASE_URL=sqlite:///./ecogenai.db
CORS_ORIGINS=*
```

### 5. Get URL
- Go to Settings → Domains
- Copy the Railway URL
- Update in Vercel (same as Render step 8)

---

## Test Your Backend

After deployment, visit:
```
https://your-backend-url.onrender.com/docs
```

You should see the FastAPI Swagger documentation with all your API endpoints!

---

## Quick Troubleshooting

**Build fails?**
- Check logs in Render/Railway dashboard
- Verify `requirements.txt` exists in backend folder

**Can't access API?**
- Check if service is running (Render free tier sleeps after 15 min)
- First request will take ~30s to wake up
- Verify CORS settings

**Frontend can't connect?**
- Make sure you updated `NEXT_PUBLIC_API_URL` in Vercel
- Redeploy frontend after changing environment variable
- Check browser console for CORS errors

---

**Choose Render for free forever, or Railway for better performance!** 🚀

# How to Run EcoGenAI - Complete Guide

## Quick Start (Recommended)

### Option 1: Using PowerShell Scripts (Easiest)

**Open TWO separate terminals:**

**Terminal 1 - Backend:**
```powershell
cd EcoGenAI/backend
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
cd EcoGenAI/frontend-new
.\start-frontend.ps1
```

### Option 2: Manual Commands

**Terminal 1 - Backend:**
```powershell
cd EcoGenAI/backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd EcoGenAI/frontend-new
npm run dev
```

## What You'll See

### Backend (Terminal 1)
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Frontend (Terminal 2)
```
  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

## Access the Application

Once both are running:

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:8000
3. **API Docs**: http://localhost:8000/docs

## First Time Setup

### 1. Install Backend Dependencies
```powershell
cd EcoGenAI/backend
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
```powershell
cd EcoGenAI/frontend-new
npm install
```

### 3. Configure Environment Variables

**Backend** - Create `EcoGenAI/backend/.env`:
```env
DATABASE_URL=sqlite:///./ecogenai.db
ENVIRONMENT=development
```

**Frontend** - Create `EcoGenAI/frontend-new/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Testing the Setup

### 1. Check Backend Health
Open browser: http://localhost:8000/

You should see:
```json
{
  "message": "EcoGenAI API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

### 2. Check API Documentation
Open browser: http://localhost:8000/docs

You should see the interactive Swagger UI with all API endpoints.

### 3. Check Frontend
Open browser: http://localhost:3000

You should see the EcoGenAI landing page.

## User Flow

1. **Landing Page** → http://localhost:3000/landing
2. **Login/Register** → http://localhost:3000/login
3. **Onboarding** → http://localhost:3000/onboarding (first-time users)
4. **Dashboard** → http://localhost:3000/dashboard
5. **Profile** → http://localhost:3000/dashboard/profile

## Common Issues & Solutions

### Issue 1: Backend Port Already in Use
```
ERROR: [Errno 10048] error while attempting to bind on address ('0.0.0.0', 8000)
```

**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
py -m uvicorn app.main:app --reload --port 8001
```

### Issue 2: Frontend Port Already in Use
```
Port 3000 is already in use
```

**Solution:**
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or Next.js will automatically suggest port 3001
```

### Issue 3: Module Not Found (Backend)
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```powershell
cd EcoGenAI/backend
pip install -r requirements.txt
```

### Issue 4: Module Not Found (Frontend)
```
Error: Cannot find module 'next'
```

**Solution:**
```powershell
cd EcoGenAI/frontend-new
npm install
```

### Issue 5: Database Error
```
sqlalchemy.exc.OperationalError: no such table
```

**Solution:**
The database is created automatically on first run. If you see this error:
```powershell
cd EcoGenAI/backend
# Delete old database
del ecogenai.db
# Restart backend - it will recreate the database
py -m uvicorn app.main:app --reload
```

### Issue 6: CORS Error in Browser
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
This should not happen as CORS is configured. If it does:
1. Make sure backend is running
2. Check backend console for errors
3. Restart both backend and frontend

### Issue 7: Firebase Authentication Error
```
Firebase: Error (auth/configuration-not-found)
```

**Solution:**
Create `EcoGenAI/frontend-new/.env.local` with Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

See `FIREBASE-SETUP-GUIDE.md` for detailed Firebase setup.

## Development Tips

### Hot Reload
Both backend and frontend support hot reload:
- **Backend**: Changes to Python files automatically restart the server
- **Frontend**: Changes to React/TypeScript files automatically refresh the browser

### Viewing Logs
- **Backend logs**: Check Terminal 1 for API requests and errors
- **Frontend logs**: Check Terminal 2 for build errors and warnings
- **Browser console**: Press F12 to see client-side errors

### Database Inspection
```powershell
cd EcoGenAI/backend
sqlite3 ecogenai.db
.tables
.schema user_profiles
SELECT * FROM user_profiles;
.quit
```

### API Testing
Use the interactive API docs at http://localhost:8000/docs to test endpoints without writing code.

## Stopping the Application

### Graceful Shutdown
In each terminal, press: **Ctrl + C**

### Force Stop (if needed)
```powershell
# Kill all Python processes
taskkill /F /IM python.exe

# Kill all Node processes
taskkill /F /IM node.exe
```

## Production Deployment

For production deployment, see:
- `BACKEND-DEPLOYMENT.md` - Deploy backend to Render/Railway
- `VERCEL-DEPLOYMENT.md` - Deploy frontend to Vercel

## Project Structure

```
EcoGenAI/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── main.py         # Application entry point
│   ├── requirements.txt    # Python dependencies
│   └── start-backend.ps1   # Backend startup script
│
├── frontend-new/           # Next.js frontend
│   ├── app/               # Pages and routes
│   ├── components/        # React components
│   ├── lib/              # Utilities and API client
│   ├── package.json      # Node dependencies
│   └── start-frontend.ps1 # Frontend startup script
│
└── START-PROJECT.md       # This file
```

## Need Help?

1. Check the error message in the terminal
2. Look for the issue in "Common Issues" section above
3. Check browser console (F12) for frontend errors
4. Check backend terminal for API errors
5. Verify both servers are running on correct ports

## Quick Reference

| Component | URL | Port |
|-----------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:8000 | 8000 |
| API Docs | http://localhost:8000/docs | 8000 |
| WebSocket | ws://localhost:8000/ws/workloads | 8000 |

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=sqlite:///./ecogenai.db
ENVIRONMENT=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
```

## Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:8000 (shows API status)
- [ ] Can access http://localhost:8000/docs (shows Swagger UI)
- [ ] Can access http://localhost:3000 (shows landing page)
- [ ] No errors in backend terminal
- [ ] No errors in frontend terminal
- [ ] Can login/register
- [ ] Can access dashboard

If all checkboxes are checked, you're ready to go! 🚀

# EcoGenAI - Quick Start Guide

## 🚀 Fastest Way to Run

### Option 1: One-Click Start (Recommended)
Double-click one of these files in the `EcoGenAI` folder:
- **`start-all.bat`** (Windows Command Prompt)
- **`start-all.ps1`** (PowerShell - right-click → Run with PowerShell)

This opens two windows automatically:
- Backend on port 8000
- Frontend on port 3000

### Option 2: Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```powershell
cd EcoGenAI
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
cd EcoGenAI
.\start-frontend.ps1
```

## 🌐 Access the Application

After 10-15 seconds, open your browser:
- **Application**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **API Status**: http://localhost:8000

## 📋 First Time Setup

Only needed once:

### 1. Install Python Dependencies
```powershell
cd EcoGenAI/backend
pip install -r requirements.txt
```

### 2. Install Node Dependencies
```powershell
cd EcoGenAI/frontend-new
npm install
```

### 3. Create Environment Files (Optional)

**Backend** - `EcoGenAI/backend/.env`:
```env
DATABASE_URL=sqlite:///./ecogenai.db
ENVIRONMENT=development
```

**Frontend** - `EcoGenAI/frontend-new/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## ✅ Verify Everything Works

1. Backend running: http://localhost:8000 shows `{"message": "EcoGenAI API is running"}`
2. Frontend running: http://localhost:3000 shows landing page
3. No errors in terminal windows

## 🛑 Stop the Application

Press **Ctrl + C** in each terminal window

## ❓ Common Issues

### Port Already in Use
```powershell
# Kill process on port 8000 (backend)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found
```powershell
# Backend
cd EcoGenAI/backend
pip install -r requirements.txt

# Frontend
cd EcoGenAI/frontend-new
npm install
```

## 📚 Full Documentation

See `START-PROJECT.md` for detailed documentation.

## 🎯 Quick Reference

| What | URL | Port |
|------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:8000 | 8000 |
| API Docs | http://localhost:8000/docs | 8000 |

## 🔐 Test Login

Use any email and password (6+ characters) to create an account.

Example:
- Email: `test@example.com`
- Password: `password123`

## 📱 User Flow

1. Landing Page → http://localhost:3000/landing
2. Login/Register → http://localhost:3000/login
3. Onboarding → Complete cloud setup
4. Dashboard → http://localhost:3000/dashboard
5. Profile → http://localhost:3000/dashboard/profile

## 🎉 You're Ready!

Once both servers are running and you can access the landing page, you're all set!

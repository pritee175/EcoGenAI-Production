# 🚀 EcoGenAI - Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- Python 3.8+ installed
- Node.js 18+ installed
- Terminal/PowerShell access

---

## 📦 Step 1: Start Backend (2 minutes)

```powershell
# Navigate to backend
cd EcoGenAI/backend

# Start FastAPI server
py -m uvicorn app.main:app --reload
```

**Expected Output:**
```
✓ APScheduler started - updating workloads every 5 seconds
✓ Created initial demo workloads
INFO: Application startup complete.
INFO: Uvicorn running on http://127.0.0.1:8000
```

**Verify:** Open http://localhost:8000 in browser - should see:
```json
{
  "service": "EcoGenAI Platform",
  "status": "operational",
  "version": "1.0.0"
}
```

---

## 🎨 Step 2: Start Frontend (2 minutes)

```powershell
# Navigate to frontend
cd final_frontened

# Start Next.js development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.10 (Turbopack)
- Local:        http://localhost:3001
✓ Ready in 2.3s
```

**Verify:** Open http://localhost:3001/dashboard in browser

---

## ✅ Step 3: Verify Everything Works (1 minute)

### Option A: Automated Test
```powershell
cd final_frontened
.\test-all-pages.ps1
```

**Expected:** All 13 tests passing ✅

### Option B: Manual Test
Open http://localhost:3001/test-connection.html

Click "Test API Connection" - should see:
```
✓ API Connection Successful!
Found 27 active workloads
```

---

## 🎯 What You Should See

### Dashboard (http://localhost:3001/dashboard)
- **KPI Cards**: Active workloads, energy, carbon, ESG score
- **Charts**: Energy by model, carbon by region
- **Live Updates**: Green indicator showing "Live Updates Active"
- **Workload Table**: Real-time list of active AI workloads

### Real-Time Updates
- Data refreshes every 10 seconds
- WebSocket connection for instant updates
- Live status indicator (green = connected)

---

## 🐛 Troubleshooting

### Backend Won't Start
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill process if needed
taskkill /PID <process_id> /F

# Try again
py -m uvicorn app.main:app --reload
```

### Frontend Won't Start
```powershell
# Install dependencies if needed
npm install

# Clear cache
Remove-Item -Recurse -Force .next

# Try again
npm run dev
```

### CORS Errors in Browser
1. Ensure backend is running on port 8000
2. Check `.env` file in backend:
   ```
   CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
   ```
3. Restart backend

### No Data Showing
1. Check backend logs for errors
2. Open browser console (F12)
3. Look for API errors
4. Verify backend URL in frontend `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

---

## 📊 Available Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | http://localhost:3001 | Welcome page |
| Dashboard | http://localhost:3001/dashboard | Main overview |
| AI Monitoring | http://localhost:3001/dashboard/ai-monitoring | Workload tracking |
| Energy | http://localhost:3001/dashboard/energy | Energy consumption |
| Carbon | http://localhost:3001/dashboard/carbon | Carbon footprint |
| Optimization | http://localhost:3001/dashboard/optimization | Recommendations |
| ESG Score | http://localhost:3001/dashboard/esg-score | Sustainability rating |
| Governance | http://localhost:3001/dashboard/governance | Approval workflow |
| Reports | http://localhost:3001/dashboard/reports | ESG reporting |
| Auditor Bot | http://localhost:3001/dashboard/auditor-bot | AI Q&A |
| Climate Risk | http://localhost:3001/dashboard/climate-risk | Risk assessment |

---

## 🔧 Useful Commands

### Backend
```powershell
# Start backend
cd EcoGenAI/backend
py -m uvicorn app.main:app --reload

# View API docs
# Open http://localhost:8000/docs

# Test API endpoint
Invoke-RestMethod -Uri "http://localhost:8000/api/workloads/active"
```

### Frontend
```powershell
# Start frontend
cd final_frontened
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
.\test-all-pages.ps1
```

---

## 📈 Next Steps

### 1. Explore Features
- Navigate through all dashboard pages
- Watch real-time updates
- Test WebSocket connection
- Try the Auditor Bot

### 2. Test API
- Open http://localhost:8000/docs
- Try different endpoints
- View response data
- Test POST requests

### 3. Customize
- Modify dashboard layout
- Add new charts
- Customize colors
- Add new features

### 4. Deploy
- Build production version
- Configure production URLs
- Set up SSL certificates
- Deploy to cloud

---

## 🎓 Learning Resources

### Documentation
- `README.md` - Complete guide
- `PRODUCTION-READY.md` - Production deployment
- `ISSUES-RESOLVED.md` - Troubleshooting
- `MIGRATION-COMPLETE.md` - Migration details

### API Documentation
- Interactive docs: http://localhost:8000/docs
- OpenAPI spec: http://localhost:8000/openapi.json

### Code Examples
- `lib/api.ts` - API service with retry logic
- `app/dashboard/page.tsx` - Dashboard implementation
- `test-connection.html` - Connection testing

---

## 💡 Tips

### Performance
- Keep backend running for best performance
- WebSocket provides instant updates
- API calls are cached for 10 seconds
- Charts update automatically

### Development
- Use browser DevTools (F12) for debugging
- Check console for errors
- Monitor network tab for API calls
- Use React DevTools for component inspection

### Production
- Build frontend: `npm run build`
- Use environment variables for URLs
- Enable SSL/HTTPS
- Set up monitoring and logging

---

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3001
- [ ] Dashboard loads with data
- [ ] Charts rendering correctly
- [ ] WebSocket connected (green indicator)
- [ ] Real-time updates working
- [ ] No console errors
- [ ] All tests passing

---

## 🎉 You're Ready!

If all checks pass, you're ready to:
- ✅ Demo to stakeholders
- ✅ Present in Shark Tank
- ✅ Deploy to production
- ✅ Onboard users

**Congratulations! EcoGenAI is fully operational!** 🚀

---

**Need Help?**
- Check `ISSUES-RESOLVED.md` for common problems
- Review `PRODUCTION-READY.md` for deployment
- Test connection: http://localhost:3001/test-connection.html

**Version**: 3.0 Enterprise  
**Status**: Production Ready ✅  
**Last Updated**: January 24, 2026

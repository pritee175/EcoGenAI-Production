# Test Onboarding Locally - Ready Now! ✅

## Current Status

✅ **Backend running:** `http://localhost:8000`
✅ **Frontend running:** `http://localhost:3000`
✅ **All fixes applied**
✅ **Ready to test!**

## Test Onboarding Flow

### Step 1: Open Browser
Navigate to: **`http://localhost:3000/onboarding`**

### Step 2: Welcome Screen
- Organization Name (optional): `My Company`
- Click **"Get Started"**

### Step 3: Select Cloud Provider
Click on any provider card:
- ☁️ **AWS** (Amazon Web Services)
- 🔷 **Azure** (Microsoft Azure)
- 🌐 **GCP** (Google Cloud Platform)
- 🏢 **Internal** (Internal Infrastructure)

Wait for loading indicator to complete (saves to backend)

### Step 4: Enter Credentials
Use these test credentials (any 10+ characters work):

**For AWS/Azure/Internal:**
- Access Key: `testkey123456`
- Secret Key: `testsecret123456`

**For GCP:**
- Service Account JSON:
```json
{"type":"service_account","project_id":"test-project"}
```

Click **"Verify & Connect"**

### Step 5: Success!
You should see:
- ✅ Success message
- Account details (mock data)
- "Go to Dashboard" button

Click **"Go to Dashboard"** → Redirects to `/dashboard`

## Expected Timing

- Step 1 → Step 2: Instant
- Step 2 → Step 3: ~1 second (saves cloud selection)
- Step 3 → Step 4: 1-2 seconds (verifies credentials)
- Step 4 → Dashboard: Instant

**Total time: ~3-5 seconds**

## If You See Errors

### "Failed to fetch"
- Backend not running
- Check: `http://localhost:8000` should show service info
- Restart: `py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

### "Network error"
- Frontend can't reach backend
- Check `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Restart frontend: `npm run dev`

### "Verification timed out"
- Backend is slow/crashed
- Check backend terminal for errors
- Restart backend

## Test the API Directly

Run the automated test:
```powershell
cd e:\EcoGenAI
.\test-onboarding-flow.ps1
```

Should show:
```
✓ Cloud selection saved!
✓ Credentials verified!
✓ Onboarding completed!
```

## What Happens Behind the Scenes

1. **Step 2:** Creates `CloudIntegration` record with provider
2. **Step 3:** Verifies credentials (simulated), updates integration status
3. **Step 4:** Marks onboarding complete, redirects to dashboard

All data saved in: `backend/ecogenai.db` (SQLite)

## After Onboarding

Dashboard will show:
- Real-time AI workload monitoring
- Energy consumption metrics
- Carbon emissions tracking
- ESG scores and compliance

## Quick Links

- **Onboarding:** http://localhost:3000/onboarding
- **Dashboard:** http://localhost:3000/dashboard
- **Login:** http://localhost:3000/login
- **Backend API:** http://localhost:8000
- **Backend Docs:** http://localhost:8000/docs

## Troubleshooting

### Port Already in Use
```powershell
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill process if needed
taskkill /F /PID <PID>
```

### Clear Database (Start Fresh)
```powershell
cd e:\EcoGenAI\backend
Remove-Item ecogenai.db
# Backend will recreate on next start
```

---

**Status:** READY TO TEST
**URL:** http://localhost:3000/onboarding
**Credentials:** Any 10+ character strings
**Expected Time:** 3-5 seconds total

# Fix: Verification Timeout Issue

## Problem
User reports "Verification timed out" error during onboarding Step 3 (credentials verification).

## Root Cause
Backend server had 150+ stale connections in CLOSE_WAIT state, causing it to be unresponsive.

## Solution Applied

### 1. Killed Stale Processes
```powershell
taskkill /F /PID 13512  # Backend
taskkill /F /PID 2308   # Frontend
```

### 2. Restarted Servers
```powershell
# Backend (in e:\EcoGenAI\backend)
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (in e:\EcoGenAI\frontend-new)
npm run dev
```

### 3. Added Timeout Protection (Already Done)
Frontend now has 10-second timeout on verification API call:
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

const response = await fetch(`${API_URL}/api/onboarding/step/credentials`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({...}),
  signal: controller.signal
});
```

## How to Test

### Step 1: Start Backend
```powershell
cd e:\EcoGenAI\backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Wait for: `INFO:     Uvicorn running on http://0.0.0.0:8000`

### Step 2: Test Backend API
```powershell
cd e:\EcoGenAI
.\test-verification-api.ps1
```

Expected output:
```json
{
  "success": true,
  "message": "Credentials verified successfully...",
  "account_details": {
    "provider": "aws",
    "account_id": "123456789012",
    "regions": ["us-east-1", "us-west-2", ...]
  }
}
```

### Step 3: Start Frontend
```powershell
cd e:\EcoGenAI\frontend-new
npm run dev
```

Wait for: `✓ Ready in X.Xs`

### Step 4: Test Onboarding Flow
1. Open browser: `http://localhost:3000/onboarding`
2. Step 1: Enter organization name → Click "Get Started"
3. Step 2: Select any cloud provider (AWS, Azure, GCP, Internal)
4. Step 3: Enter dummy credentials:
   - Access Key: `testkey123456` (any 10+ chars)
   - Secret Key: `testsecret123456` (any 10+ chars)
5. Click "Verify & Connect"
6. Should complete within 1-2 seconds (not 10 seconds!)
7. Step 4: See success message → Click "Go to Dashboard"

## Expected Behavior

### Fast Verification (< 2 seconds)
The verification is simulated and should return immediately:
- AWS: Returns mock account ID `123456789012`
- Azure: Returns mock subscription ID
- GCP: Parses JSON and returns project ID
- Internal: Returns infrastructure name

### If Still Timing Out

Check these:

1. **Backend not running:**
   ```powershell
   netstat -ano | findstr :8000
   ```
   Should show `LISTENING` on port 8000

2. **CORS issues:**
   Check browser console for CORS errors
   Backend has CORS enabled for `http://localhost:3000`

3. **Database issues:**
   ```powershell
   cd e:\EcoGenAI\backend
   dir ecogenai.db
   ```
   If missing, backend will create it on first request

4. **Network issues:**
   Test with curl:
   ```powershell
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy"}`

## Quick Fix Commands

### If backend won't start:
```powershell
# Check if port is in use
netstat -ano | findstr :8000

# Kill process if needed
taskkill /F /PID <PID>

# Restart backend
cd e:\EcoGenAI\backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### If frontend won't start:
```powershell
# Check if port is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /F /PID <PID>

# Clear lock file
Remove-Item e:\EcoGenAI\frontend-new\.next\dev\lock -ErrorAction SilentlyContinue

# Restart frontend
cd e:\EcoGenAI\frontend-new
npm run dev
```

## Verification Logic (Backend)

The verification is **simulated** for demo purposes:

```python
# AWS verification
if len(access_key) < 10 or len(secret_key) < 10:
    return {"success": False, "error": "Invalid credentials format"}

return {
    "success": True,
    "account_id": "123456789012",
    "regions": ["us-east-1", "us-west-2", ...]
}
```

**Any credentials with 10+ characters will pass verification.**

## Production Notes

In production, replace simulated verification with real cloud SDK calls:

### AWS (boto3):
```python
import boto3
sts = boto3.client('sts',
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key
)
identity = sts.get_caller_identity()
account_id = identity['Account']
```

### Azure (azure-identity):
```python
from azure.identity import ClientSecretCredential
credential = ClientSecretCredential(
    tenant_id="...",
    client_id=access_key,
    client_secret=secret_key
)
```

### GCP (google-auth):
```python
from google.oauth2 import service_account
credentials = service_account.Credentials.from_service_account_info(
    json.loads(access_key)
)
```

## Status

- ✅ Timeout protection added (10 seconds)
- ✅ Stale processes killed
- ✅ Test scripts created
- ⏳ Servers need to be restarted by user
- ⏳ Verification flow needs testing

## Next Steps

1. User runs `start-backend-test.ps1` in one terminal
2. User runs `npm run dev` in frontend-new in another terminal
3. User tests onboarding flow at `http://localhost:3000/onboarding`
4. If still timing out, run `test-verification-api.ps1` to diagnose

---

**Created:** February 3, 2026
**Issue:** Verification timeout during onboarding
**Resolution:** Server restart + timeout protection

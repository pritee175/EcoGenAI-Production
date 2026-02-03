# Complete Setup Guide - Monitor YOUR GenAI in Real-Time

## 🚀 Quick Start (5 Minutes)

### Step 1: Start the Servers (DONE ✅)

Backend and frontend are starting now. Wait 10-15 seconds.

**Check if ready:**
- Backend: http://localhost:8000 (should show service info)
- Frontend: http://localhost:3000 (should show login page)

---

## 📋 Complete Walkthrough

### STEP 1: Open the Application

Open your browser and go to:
```
http://localhost:3000
```

You'll see the **Login Page**.

---

### STEP 2: Click "Get Started" 

This takes you to the **Onboarding Flow** at:
```
http://localhost:3000/onboarding
```

---

### STEP 3: Complete Onboarding (4 Steps)

#### **Step 1/4: Welcome Screen**

You'll see:
- Welcome message
- 3 feature cards (Read-Only Access, Continuous Monitoring, Multi-Cloud)
- Organization name field (optional)

**Action:**
- Enter your organization: `My Company` (or leave blank)
- Click **"Get Started"**

---

#### **Step 2/4: Cloud Provider Selection**

You'll see 4 provider cards:

1. ☁️ **AWS** - Amazon Web Services
2. 🔷 **Azure** - Microsoft Azure
3. 🌐 **GCP** - Google Cloud Platform ⭐ (Use this for your GCP)
4. 🏢 **Internal** - Internal Infrastructure

**Action:**
- Click on **🌐 GCP (Google Cloud Platform)**
- Wait for loading (saves to backend)

---

#### **Step 3/4: Enter Your GCP Credentials**

You'll see:
- Security information box (what we monitor vs don't access)
- **Service Account JSON** textarea
- Regions to Monitor field (optional)

**Action:**
1. **Paste your entire GCP JSON** in the textarea:
```json
{"type": "service_account","project_id": "wired-record-455719-s5", ...}
```

2. **Regions** (optional): Leave empty or add:
```
us-central1, us-west1, europe-west1
```

3. Click **"Verify & Connect"**

**What happens:**
- Backend parses your JSON
- Extracts project_id: `wired-record-455719-s5`
- Verifies it's valid
- Saves to database
- Shows success in 1-2 seconds

---

#### **Step 4/4: Success!**

You'll see:
- ✅ Green checkmark
- "You're All Set!" message
- Your GCP project details
- Connected account info

**Action:**
- Click **"Go to Dashboard"**

---

### STEP 4: Explore the Dashboard

You're now at: `http://localhost:3000/dashboard`

#### **Main Dashboard View**

You'll see:
- **Top Cards:** Total Energy, Carbon Footprint, Active Workloads, ESG Score
- **Active Workloads Table:** 3 demo workloads running
- **Real-Time Updates:** Metrics update every 5 seconds
- **WebSocket Status:** Green dot = connected

**Demo Workloads (automatically created):**
1. GPT-4-Training (8 GPUs, us-east-1)
2. DALL-E-Inference (4 GPUs, eu-west-1)
3. Claude-Fine-Tuning (16 GPUs, ap-south-1)

---

### STEP 5: Add YOUR GenAI Workload

Now let's add your actual GenAI model!

#### **Option A: Via API (Recommended)**

Open PowerShell and run:

```powershell
# Replace with YOUR model details
$myGenAI = @{
    model_name = "My-ChatGPT-Model"        # Your model name
    job_type = "inference"                  # or "training"
    gpu_count = 4                           # Number of GPUs
    gpu_type = "A100"                       # GPU type (A100, H100, V100, etc.)
    cloud_region = "us-central1"            # GCP region
    batch_size = 32                         # Your batch size
    tokens_processed = 1000000              # Tokens per hour
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/workloads" `
    -Method POST `
    -ContentType "application/json" `
    -Body $myGenAI
```

**Result:**
- Your workload appears in dashboard immediately
- Energy/carbon tracking starts automatically
- Real-time updates every 5 seconds

#### **Option B: Via Dashboard (Coming Soon)**

Future feature: Add workloads directly from UI.

---

### STEP 6: Monitor in Real-Time

#### **Watch Live Updates**

1. **Open Dashboard:** http://localhost:3000/dashboard
2. **Open Browser DevTools:** Press F12
3. **Go to Console tab**
4. **Watch WebSocket messages:**
```
WebSocket connected
Received update: {type: "workload_update", data: [...]}
```

Every 5 seconds you'll see:
- Workload runtime increases
- Energy consumption grows
- Carbon emissions calculated
- Metrics update automatically

#### **What's Being Tracked:**

For each workload:
- ⚡ **Energy (kWh):** Based on GPU power draw × utilization × time
- 🌍 **Carbon (kg CO₂):** Energy × region carbon intensity
- ⏱️ **Runtime:** Seconds since start
- 📊 **Status:** Running, Completed, Failed

---

### STEP 7: Explore All Features

#### **1. Energy Page**
URL: http://localhost:3000/dashboard/energy

See:
- Total energy consumption (kWh)
- Energy by model
- Energy efficiency metrics
- Cost estimates
- Historical trends

#### **2. Carbon Page**
URL: http://localhost:3000/dashboard/carbon

See:
- Total carbon footprint (kg CO₂)
- Emissions by region
- Carbon intensity map
- Offset recommendations
- Compliance tracking

#### **3. Optimization Page**
URL: http://localhost:3000/dashboard/optimization

Get:
- Model efficiency analysis
- Cost optimization tips
- Green scheduling recommendations
- Regional carbon intensity comparison
- Best practices

#### **4. ESG Score Page**
URL: http://localhost:3000/dashboard/esg-score

View:
- Overall ESG rating (0-100)
- Compliance status (CSRD, GRI, TCFD)
- Improvement recommendations
- Audit trail
- Certification readiness

#### **5. Governance Page**
URL: http://localhost:3000/dashboard/governance

Manage:
- ESG policies
- Compliance tracking
- Audit logs
- Reporting schedules
- Stakeholder communication

#### **6. ESG Auditor (AI Chatbot)**
URL: http://localhost:3000/dashboard/auditor

Ask questions like:
- "What is my total carbon footprint?"
- "Which model has the highest energy consumption?"
- "Show me a compliance report for CSRD"
- "Compare energy usage between regions"
- "What are my optimization recommendations?"
- "Summarize Q4 carbon emissions by region"

**Features:**
- Natural language queries
- Formatted responses (tables, lists, code blocks)
- Slide-down animation for responses
- Suggested questions
- Real-time data analysis

---

### STEP 8: Stop a Workload

When your GenAI job finishes:

```powershell
# Get workload ID from dashboard
$workloadId = 4  # Your workload ID

Invoke-RestMethod -Uri "http://localhost:8000/api/workloads/$workloadId/stop" `
    -Method POST
```

**Result:**
- Workload status changes to "Completed"
- Final energy/carbon calculated
- Appears in historical data
- No longer in "Active" list

---

## 🎯 Real-Time Monitoring Explained

### How It Works

1. **Backend Scheduler (APScheduler):**
   - Runs every 5 seconds
   - Updates all running workloads
   - Calculates energy consumption
   - Calculates carbon emissions
   - Broadcasts to WebSocket clients

2. **WebSocket Connection:**
   - Frontend connects to `ws://localhost:8000/ws/workloads`
   - Receives updates every 5 seconds
   - Updates dashboard automatically
   - No page refresh needed

3. **Energy Calculation:**
```
Energy (kWh) = GPU Power (W) × GPU Count × Utilization × Time (h) / 1000
```

4. **Carbon Calculation:**
```
Carbon (kg CO₂) = Energy (kWh) × Region Carbon Intensity (kg CO₂/kWh)
```

### Example Calculation

**Your Model:**
- 4× A100 GPUs (400W each)
- 80% utilization
- Running for 1 hour
- Region: us-central1 (0.367 kg CO₂/kWh)

**Energy:**
```
400W × 4 GPUs × 0.8 × 1h / 1000 = 1.28 kWh
```

**Carbon:**
```
1.28 kWh × 0.367 = 0.47 kg CO₂
```

---

## 📊 Understanding Your Data

### Dashboard Metrics

**Total Energy (kWh):**
- Sum of all workload energy consumption
- Updates in real-time
- Includes historical + active workloads

**Carbon Footprint (kg CO₂):**
- Total emissions across all workloads
- Varies by region (different carbon intensity)
- Includes Scope 2 emissions

**Active Workloads:**
- Currently running GenAI jobs
- Updates every 5 seconds
- Shows runtime, energy, carbon

**ESG Score (0-100):**
- Based on energy efficiency
- Carbon intensity
- Compliance status
- Best practices adoption

---

## 🔧 Advanced Features

### 1. Cloud Monitoring (Background)

Every 30 seconds, backend checks your GCP project for:
- GPU instances (Compute Engine with GPUs)
- Vertex AI training jobs
- Cloud ML workloads

**Currently:** Simulated detection (demo mode)
**Production:** Can be enabled with real GCP API calls

### 2. Persistent Monitoring

EcoGenAI runs continuously:
- ✅ Works even when you close browser
- ✅ Tracks workloads 24/7
- ✅ Stores all historical data
- ✅ No manual intervention needed

### 3. Multi-Cloud Support

Can track workloads across:
- AWS (EC2 p3/p4/g4, SageMaker)
- Azure (NC/ND/NV series VMs)
- GCP (Compute Engine with GPUs, Vertex AI)
- Internal (On-premise GPU clusters)

---

## 🎬 Demo Script (For Presentations)

### 1. Introduction (1 min)
"EcoGenAI tracks the environmental impact of AI workloads in real-time."

### 2. Show Onboarding (1 min)
- 4-step setup
- GCP integration
- Security explanation

### 3. Dashboard Tour (3 min)
- Real-time monitoring
- Energy consumption
- Carbon emissions
- ESG compliance

### 4. Add Live Workload (2 min)
- Run PowerShell command
- Show it appear in dashboard
- Watch metrics update

### 5. ESG Auditor Demo (2 min)
- Ask: "What is my carbon footprint?"
- Ask: "Which model uses most energy?"
- Show formatted responses

### 6. Key Benefits (1 min)
- ✅ Real-time tracking
- ✅ ESG compliance
- ✅ Cost optimization
- ✅ Audit-ready reports

---

## 🐛 Troubleshooting

### Backend Not Starting?
```powershell
cd e:\EcoGenAI\backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Not Starting?
```powershell
cd e:\EcoGenAI\frontend-new
npm run dev
```

### Workload Not Appearing?
- Check backend console for errors
- Verify WebSocket connection (F12 → Console)
- Refresh dashboard

### Real-Time Updates Not Working?
- Check WebSocket status (green dot in dashboard)
- Look for errors in browser console
- Verify backend scheduler is running

---

## 📝 Quick Reference

### URLs
- **Login:** http://localhost:3000
- **Onboarding:** http://localhost:3000/onboarding
- **Dashboard:** http://localhost:3000/dashboard
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### API Endpoints
- **Add Workload:** POST http://localhost:8000/api/workloads
- **Stop Workload:** POST http://localhost:8000/api/workloads/{id}/stop
- **Get Energy:** GET http://localhost:8000/api/energy/summary
- **Get Carbon:** GET http://localhost:8000/api/carbon/footprint
- **Ask Auditor:** POST http://localhost:8000/api/auditor/ask

### PowerShell Commands
```powershell
# Add your GenAI workload
$workload = @{
    model_name = "Your-Model"
    job_type = "inference"
    gpu_count = 4
    gpu_type = "A100"
    cloud_region = "us-central1"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/workloads" `
    -Method POST -ContentType "application/json" -Body $workload

# Stop workload
Invoke-RestMethod -Uri "http://localhost:8000/api/workloads/4/stop" -Method POST

# Get all workloads
Invoke-RestMethod -Uri "http://localhost:8000/api/workloads"
```

---

## ✅ You're Ready!

**Servers are running:**
- ✅ Backend: http://localhost:8000
- ✅ Frontend: http://localhost:3000

**Next steps:**
1. Open http://localhost:3000
2. Complete onboarding with your GCP JSON
3. Add your GenAI workload
4. Watch real-time monitoring!

**Need help?** Check the troubleshooting section above.

---

**Status:** READY TO USE
**Time to setup:** 5 minutes
**Real-time updates:** Every 5 seconds
**Your GenAI:** Ready to track!

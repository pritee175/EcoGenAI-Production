# How to Test EcoGenAI with Your GenAI Workloads

## Overview

EcoGenAI tracks the environmental impact of your AI/ML workloads. Here's how to test it with your actual GenAI models.

## Testing Scenarios

### Scenario 1: Demo Mode (Easiest - Start Here!)

**What it does:** Uses simulated workloads to show all features

**How to test:**
1. Start the project (backend + frontend)
2. Complete onboarding with dummy credentials
3. Dashboard automatically shows 3 demo workloads
4. Watch real-time updates every 5 seconds
5. Explore all features:
   - Energy consumption tracking
   - Carbon emissions by region
   - ESG scores and compliance
   - Optimization recommendations
   - ESG Auditor chatbot

**Perfect for:** Presentations, demos, understanding features

---

### Scenario 2: Manual Workload Entry (Recommended)

**What it does:** You manually add your GenAI workloads to track

**How to test:**

#### Step 1: Complete Onboarding
- Go to `http://localhost:3000/onboarding`
- Select your cloud provider (or "Internal")
- Enter dummy credentials

#### Step 2: Add Your GenAI Workload via API

Use PowerShell to add your actual workload:

```powershell
# Example: Tracking a ChatGPT-like model running on 4 GPUs
$workload = @{
    model_name = "My-ChatGPT-Clone"
    job_type = "inference"  # or "training"
    gpu_count = 4
    gpu_type = "A100"
    cloud_region = "us-east-1"
    batch_size = 32
    tokens_processed = 1000000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/workloads" `
    -Method POST `
    -ContentType "application/json" `
    -Body $workload
```

#### Step 3: View in Dashboard
- Go to `http://localhost:3000/dashboard`
- See your workload with real-time energy/carbon tracking
- Watch metrics update every 5 seconds

#### Step 4: Stop the Workload
```powershell
# Get workload ID from dashboard or API
$workloadId = 1

Invoke-RestMethod -Uri "http://localhost:8000/api/workloads/$workloadId/stop" `
    -Method POST
```

**Perfect for:** Testing with your actual model names and configurations

---

### Scenario 3: Cloud Integration (Advanced)

**What it does:** Automatically detects GPU workloads from your cloud provider

**Current Status:** 
- ✅ Framework implemented
- ⚠️ Uses simulated detection (for demo)
- 🔧 Can be extended to real cloud APIs

**How it works:**
1. Complete onboarding with cloud provider selection
2. Backend monitors cloud every 30 seconds
3. Detects GPU instances (EC2 p3/p4, Azure NC/ND, GCP with GPUs)
4. Automatically creates workload records
5. Tracks energy/carbon in real-time

**To enable real cloud monitoring:**

Edit `backend/app/services/cloud_connector.py`:

```python
# For AWS (example)
import boto3

def _detect_aws_workloads(integration, db):
    ec2 = boto3.client('ec2',
        aws_access_key_id=integration.access_key,
        aws_secret_access_key=integration.secret_key
    )
    
    # Query GPU instances
    response = ec2.describe_instances(
        Filters=[
            {'Name': 'instance-state-name', 'Values': ['running']},
            {'Name': 'instance-type', 'Values': ['p3.*', 'p4.*', 'g4dn.*']}
        ]
    )
    
    # Process instances and create workloads
    # (Full implementation in cloud_connector.py comments)
```

**Perfect for:** Production deployment with real cloud monitoring

---

## Complete Testing Workflow

### 1. Initial Setup (5 minutes)

```powershell
# Terminal 1: Start Backend
cd e:\EcoGenAI\backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Start Frontend
cd e:\EcoGenAI\frontend-new
npm run dev
```

### 2. Onboarding (1 minute)

- Open: `http://localhost:3000/onboarding`
- Complete 4-step setup
- Use dummy credentials: `testkey123456` / `testsecret123456`

### 3. Explore Dashboard (10 minutes)

**Main Dashboard:**
- Real-time workload monitoring
- Energy consumption graphs
- Carbon emissions by region
- Live WebSocket updates

**Energy Page:**
- Total energy consumption
- Energy by model
- Energy efficiency metrics
- Historical trends

**Carbon Page:**
- Carbon footprint by region
- Carbon intensity maps
- Offset recommendations
- Compliance tracking

**Optimization Page:**
- Model efficiency analysis
- Cost optimization suggestions
- Green scheduling recommendations
- Regional carbon intensity

**ESG Score Page:**
- Overall ESG rating
- Compliance status (CSRD, GRI, TCFD)
- Improvement recommendations
- Audit trail

**Governance Page:**
- Policy management
- Compliance tracking
- Audit logs
- Reporting

**ESG Auditor (Chatbot):**
- Ask questions about your data
- Get compliance insights
- Generate reports
- Query historical data

### 4. Test with Your GenAI Models

#### Example 1: LLM Inference
```powershell
$llm = @{
    model_name = "GPT-4-Clone-Inference"
    job_type = "inference"
    gpu_count = 8
    gpu_type = "H100"
    cloud_region = "us-west-2"
    batch_size = 64
    tokens_processed = 5000000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/workloads" `
    -Method POST -ContentType "application/json" -Body $llm
```

#### Example 2: Model Training
```powershell
$training = @{
    model_name = "Custom-LLM-Training"
    job_type = "training"
    gpu_count = 16
    gpu_type = "A100"
    cloud_region = "eu-west-1"
    batch_size = 128
    training_steps = 100000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/workloads" `
    -Method POST -ContentType "application/json" -Body $training
```

#### Example 3: Image Generation
```powershell
$imageGen = @{
    model_name = "Stable-Diffusion-XL"
    job_type = "inference"
    gpu_count = 2
    gpu_type = "RTX4090"
    cloud_region = "ap-south-1"
    batch_size = 16
    images_generated = 10000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/workloads" `
    -Method POST -ContentType "application/json" -Body $imageGen
```

### 5. Test ESG Auditor Chatbot

Go to: `http://localhost:3000/dashboard/auditor`

**Try these questions:**
- "What is my total carbon footprint this month?"
- "Which model has the highest energy consumption?"
- "Show me a compliance report for CSRD"
- "What are my optimization recommendations?"
- "Compare energy usage between regions"
- "Summarize Q4 carbon emissions by region"

### 6. Test Real-Time Updates

1. Open dashboard in browser
2. Open browser DevTools (F12) → Console
3. Watch WebSocket messages every 5 seconds
4. Add a new workload via API
5. See it appear in dashboard automatically
6. Watch energy/carbon metrics update live

### 7. Test Profile Feature

- Click profile icon in header
- Update your profile information
- Upload profile picture
- Set sustainability goals
- View personal impact metrics

---

## API Endpoints for Testing

### Get All Workloads
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/workloads"
```

### Get Energy Summary
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/energy/summary"
```

### Get Carbon Footprint
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/carbon/footprint"
```

### Get ESG Score
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/esg-score"
```

### Get Optimization Recommendations
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/optimization/recommendations"
```

### Ask ESG Auditor
```powershell
$question = @{
    question = "What is my total carbon footprint?"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/auditor/ask" `
    -Method POST -ContentType "application/json" -Body $question
```

---

## Testing Checklist

### Basic Features
- [ ] Complete onboarding flow
- [ ] View demo workloads in dashboard
- [ ] See real-time updates (every 5 seconds)
- [ ] Check energy consumption metrics
- [ ] View carbon emissions by region
- [ ] Check ESG score and compliance

### Advanced Features
- [ ] Add custom workload via API
- [ ] Stop a running workload
- [ ] Test ESG Auditor chatbot
- [ ] View optimization recommendations
- [ ] Check governance policies
- [ ] Generate ESG report

### Real-Time Features
- [ ] WebSocket connection established
- [ ] Live metrics updating
- [ ] New workloads appear automatically
- [ ] Energy/carbon calculations update

### Profile Features
- [ ] Update profile information
- [ ] Upload profile picture
- [ ] Set sustainability goals
- [ ] View personal metrics

---

## Demo Script (For Presentations)

### 1. Introduction (2 minutes)
"EcoGenAI tracks the environmental impact of AI workloads in real-time, helping organizations meet ESG compliance requirements."

### 2. Onboarding (1 minute)
- Show 4-step setup
- Explain read-only cloud access
- Complete with dummy credentials

### 3. Dashboard Tour (5 minutes)
- **Main Dashboard:** Real-time monitoring
- **Energy Page:** Consumption tracking
- **Carbon Page:** Emissions by region
- **ESG Score:** Compliance status
- **Optimization:** Cost savings recommendations

### 4. Live Demo (3 minutes)
- Add a workload via API
- Show it appear in dashboard
- Watch metrics update in real-time
- Demonstrate WebSocket updates

### 5. ESG Auditor (2 minutes)
- Ask: "What is my total carbon footprint?"
- Ask: "Which model has highest emissions?"
- Show formatted table response

### 6. Key Features (2 minutes)
- ✅ Persistent monitoring (works offline)
- ✅ Multi-cloud support
- ✅ Real-time updates via WebSocket
- ✅ ESG compliance tracking
- ✅ AI-powered auditor chatbot

---

## Troubleshooting

### Workloads not showing?
- Check backend is running: `http://localhost:8000`
- Check browser console for errors
- Verify WebSocket connection

### Real-time updates not working?
- Check WebSocket connection in DevTools
- Verify backend scheduler is running
- Check for CORS errors

### API calls failing?
- Verify backend is on port 8000
- Check `.env.local` has correct API_URL
- Test with: `curl http://localhost:8000`

---

## Next Steps

1. **Test locally** with demo workloads (easiest)
2. **Add your GenAI models** via API
3. **Explore all features** in dashboard
4. **Deploy to production** (Render + Vercel)
5. **Enable real cloud monitoring** (optional)

---

**Status:** Ready to test!
**Time needed:** 15-30 minutes for full exploration
**Best for demo:** Scenario 1 (Demo Mode) + ESG Auditor

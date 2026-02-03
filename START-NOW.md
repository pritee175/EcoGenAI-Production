# 🚀 START NOW - Monitor Your GenAI

## ✅ Servers Status

- ✅ **Frontend:** http://localhost:3000 (READY)
- ⏳ **Backend:** http://localhost:8000 (Starting... wait 30 seconds)

---

## 📋 3-Step Quick Start

### STEP 1: Open Browser
```
http://localhost:3000
```

### STEP 2: Complete Onboarding
1. Click "Get Started"
2. Select **🌐 GCP**
3. Paste your GCP JSON
4. Click "Verify & Connect"

### STEP 3: Add Your GenAI Workload

Open PowerShell:
```powershell
$myGenAI = @{
    model_name = "My-ChatGPT-Model"
    job_type = "inference"
    gpu_count = 4
    gpu_type = "A100"
    cloud_region = "us-central1"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/workloads" `
    -Method POST -ContentType "application/json" -Body $myGenAI
```

**Done!** Watch your GenAI being monitored in real-time! 🎉

---

## 🎯 What You'll See

### Dashboard (http://localhost:3000/dashboard)
- ⚡ Real-time energy consumption
- 🌍 Carbon emissions by region
- 📊 Active workloads table
- 🔄 Updates every 5 seconds

### Your Workload
- Model name: "My-ChatGPT-Model"
- GPUs: 4× A100
- Region: us-central1
- Status: Running ✅
- Energy: Calculating...
- Carbon: Calculating...

---

## 💬 Try the AI Auditor

Go to: http://localhost:3000/dashboard/auditor

Ask:
- "What is my total carbon footprint?"
- "Which model uses most energy?"
- "Show me optimization recommendations"

---

## 📖 Full Guide

See: `COMPLETE-SETUP-GUIDE.md` for detailed walkthrough

---

**Status:** READY TO START
**Time:** 5 minutes
**Your GenAI:** Will be tracked in real-time!

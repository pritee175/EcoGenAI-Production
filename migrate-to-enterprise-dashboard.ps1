# Migration Script: Switch to Enterprise Dashboard
# This script removes the old frontend and sets up the final enterprise dashboard

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EcoGenAI Enterprise Dashboard Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Backup old frontend (optional)
Write-Host "[1/4] Backing up old frontend..." -ForegroundColor Yellow
if (Test-Path "frontend-backup") {
    Write-Host "  Backup already exists, skipping..." -ForegroundColor Gray
} else {
    Copy-Item -Path "frontend" -Destination "frontend-backup" -Recurse -Force
    Write-Host "  ✓ Old frontend backed up to 'frontend-backup'" -ForegroundColor Green
}
Write-Host ""

# Step 2: Remove old frontend
Write-Host "[2/4] Removing old frontend..." -ForegroundColor Yellow
if (Test-Path "frontend") {
    Remove-Item -Path "frontend" -Recurse -Force
    Write-Host "  ✓ Old frontend removed" -ForegroundColor Green
} else {
    Write-Host "  Old frontend already removed" -ForegroundColor Gray
}
Write-Host ""

# Step 3: Check if final_frontend exists
Write-Host "[3/4] Checking enterprise dashboard..." -ForegroundColor Yellow
if (Test-Path "..\final_frontened") {
    Write-Host "  ✓ Enterprise dashboard found at ../final_frontened" -ForegroundColor Green
} else {
    Write-Host "  ✗ Enterprise dashboard not found!" -ForegroundColor Red
    Write-Host "  Please ensure final_frontened folder exists" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Update documentation
Write-Host "[4/4] Updating documentation..." -ForegroundColor Yellow
$readmeContent = @"
# EcoGenAI - Enterprise ESG Platform

## 🚀 Quick Start

### Backend
``````powershell
cd backend
py -m uvicorn app.main:app --reload
``````
**Backend URL**: http://localhost:8000

### Frontend (Enterprise Dashboard)
``````powershell
cd ..\final_frontened
npm run dev
``````
**Frontend URL**: http://localhost:3001

## 📊 Features

All 14 features are fully implemented and connected:
1. AI Workload Monitoring
2. Energy Consumption Estimation
3. Carbon Footprint Calculation
4. Optimization Recommendations
5. ESG Sustainability Score
6. Governance & Approval Workflow
7. Model Efficiency Optimizer
8. Cost vs Carbon Analysis
9. ESG Report Generator
10. Green-Time Scheduler
11. Carbon Autopilot
12. Eco-Score Gamification
13. Climate Risk Simulator
14. AI Sustainability Auditor Bot

## 🎨 Enterprise Dashboard

The new enterprise dashboard features:
- Professional Tailwind CSS v4 styling
- shadcn/ui components
- Real-time WebSocket updates
- Interactive charts and visualizations
- Responsive design
- Dark mode support

## 📚 Documentation

- FEATURES-COMPLETE.md - Complete feature list
- DEPLOYMENT-READY.md - Production readiness status
- AUDITOR-BOT-GUIDE.md - Auditor Bot user guide
- WHATS-NEW.md - Latest updates

## ✅ Status

**Production Ready** - All features tested and working
"@

Set-Content -Path "README.md" -Value $readmeContent
Write-Host "  ✓ README.md updated" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Migration Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start backend: cd backend && py -m uvicorn app.main:app --reload" -ForegroundColor White
Write-Host "2. Start frontend: cd ..\final_frontened && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "URLs:" -ForegroundColor Yellow
Write-Host "- Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "- Frontend: http://localhost:3001" -ForegroundColor White
Write-Host "- API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""

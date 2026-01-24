# Test script to verify all EcoGenAI features are working
# Tests all API endpoints and reports status

$API_URL = "http://localhost:8000"
$FRONTEND_URL = "http://localhost:3001"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EcoGenAI Feature Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test counter
$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET"
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method $Method -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "[✓] $Name" -ForegroundColor Green
            $script:passed++
            return $true
        } else {
            Write-Host "[✗] $Name - Status: $($response.StatusCode)" -ForegroundColor Red
            $script:failed++
            return $false
        }
    } catch {
        Write-Host "[✗] $Name - Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
        return $false
    }
}

Write-Host "Testing Backend API Endpoints..." -ForegroundColor Yellow
Write-Host ""

# Core Features
Write-Host "Core Features (1-5):" -ForegroundColor Cyan
Test-Endpoint "AI Workload Monitoring" "$API_URL/api/workloads/active"
Test-Endpoint "Energy Consumption" "$API_URL/api/energy/summary"
Test-Endpoint "Carbon Footprint" "$API_URL/api/carbon/summary"
Test-Endpoint "Optimization Engine" "$API_URL/api/optimization/recommendations"
Test-Endpoint "ESG Score" "$API_URL/api/esg-score/current"
Write-Host ""

# Governance Features
Write-Host "Governance Features (Phase 1):" -ForegroundColor Cyan
Test-Endpoint "Governance Statistics" "$API_URL/api/governance/statistics"
Test-Endpoint "Pending Actions" "$API_URL/api/governance/actions/pending"
Test-Endpoint "Model Optimization" "$API_URL/api/governance/model-optimization/summary"
Test-Endpoint "Cost Analysis" "$API_URL/api/governance/cost-analysis/current"
Test-Endpoint "ESG Reports" "$API_URL/api/governance/reports/comprehensive"
Write-Host ""

# Phase 2 Automation Features
Write-Host "Automation Features (Phase 2):" -ForegroundColor Cyan
Test-Endpoint "Green-Time Scheduler" "$API_URL/api/phase2/scheduler/statistics"
Test-Endpoint "Carbon Autopilot" "$API_URL/api/phase2/autopilot/statistics"
Test-Endpoint "Eco Gamification" "$API_URL/api/phase2/gamification/summary"
Test-Endpoint "Climate Risk Simulator" "$API_URL/api/phase2/climate-risk/latest"
Write-Host ""

# Auditor Bot
Write-Host "AI Sustainability Auditor:" -ForegroundColor Cyan
Test-Endpoint "Auditor Trends" "$API_URL/api/auditor/trends"
Test-Endpoint "Recommended Questions" "$API_URL/api/auditor/recommended-questions"
Write-Host ""

# Frontend Pages
Write-Host "Testing Frontend Pages..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Frontend Pages:" -ForegroundColor Cyan
Test-Endpoint "Landing Page" "$FRONTEND_URL/"
Test-Endpoint "Carbon Footprint Page" "$FRONTEND_URL/carbon-footprint"
Test-Endpoint "Optimization Page" "$FRONTEND_URL/optimization"
Test-Endpoint "Governance Page" "$FRONTEND_URL/governance"
Test-Endpoint "ESG Score Page" "$FRONTEND_URL/esg-score"
Test-Endpoint "Automation Hub" "$FRONTEND_URL/automation"
Test-Endpoint "Scheduler Page" "$FRONTEND_URL/automation/scheduler"
Test-Endpoint "Leaderboard Page" "$FRONTEND_URL/automation/leaderboard"
Test-Endpoint "Auditor Bot Page" "$FRONTEND_URL/auditor"
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✓ All tests passed! EcoGenAI is fully operational." -ForegroundColor Green
} else {
    Write-Host "⚠ Some tests failed. Please check the errors above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Frontend URL: $FRONTEND_URL" -ForegroundColor Cyan
Write-Host "Backend API URL: $API_URL" -ForegroundColor Cyan
Write-Host ""

# Test script to verify all final_frontend pages are working
# Tests all pages and reports status

$FRONTEND_URL = "http://localhost:3001"
$API_URL = "http://localhost:8000"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EcoGenAI Enterprise Dashboard Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test counter
$passed = 0
$failed = 0

function Test-Page {
    param(
        [string]$Name,
        [string]$Url
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10
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

Write-Host "Testing Backend API..." -ForegroundColor Yellow
Test-Page "Backend Health" "$API_URL/"
Test-Page "API Docs" "$API_URL/docs"
Write-Host ""

Write-Host "Testing Frontend Pages..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Main Pages:" -ForegroundColor Cyan
Test-Page "Landing Page" "$FRONTEND_URL/"
Test-Page "Dashboard Overview" "$FRONTEND_URL/dashboard"
Write-Host ""

Write-Host "Feature Pages:" -ForegroundColor Cyan
Test-Page "AI Monitoring" "$FRONTEND_URL/dashboard/ai-monitoring"
Test-Page "Energy Consumption" "$FRONTEND_URL/dashboard/energy"
Test-Page "Carbon Footprint" "$FRONTEND_URL/dashboard/carbon"
Test-Page "Optimization" "$FRONTEND_URL/dashboard/optimization"
Test-Page "ESG Score" "$FRONTEND_URL/dashboard/esg-score"
Test-Page "Governance" "$FRONTEND_URL/dashboard/governance"
Test-Page "Reports" "$FRONTEND_URL/dashboard/reports"
Test-Page "Auditor Bot" "$FRONTEND_URL/dashboard/auditor-bot"
Test-Page "Climate Risk" "$FRONTEND_URL/dashboard/climate-risk"
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✓ All tests passed! Enterprise Dashboard is fully operational." -ForegroundColor Green
} else {
    Write-Host "⚠ Some tests failed. Please check the errors above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Frontend URL: $FRONTEND_URL" -ForegroundColor Cyan
Write-Host "Backend API URL: $API_URL" -ForegroundColor Cyan
Write-Host ""

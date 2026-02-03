# EcoGenAI - Start Both Backend and Frontend
# This script opens two separate PowerShell windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EcoGenAI - Starting Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend-new")) {
    Write-Host "ERROR: Please run this script from the EcoGenAI root directory" -ForegroundColor Red
    Write-Host "Current directory: $PWD" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  cd EcoGenAI" -ForegroundColor White
    Write-Host "  .\start-all.ps1" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

Write-Host "✓ Directory check passed" -ForegroundColor Green
Write-Host ""

# Start Backend in new window
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\start-backend.ps1"
Write-Host "✓ Backend terminal opened" -ForegroundColor Green
Start-Sleep -Seconds 2

# Start Frontend in new window
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\start-frontend.ps1"
Write-Host "✓ Frontend terminal opened" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Application Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two new PowerShell windows have been opened:" -ForegroundColor White
Write-Host "  1. Backend  - http://localhost:8000" -ForegroundColor Green
Write-Host "  2. Frontend - http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Wait 10-15 seconds for both servers to start, then:" -ForegroundColor Yellow
Write-Host "  → Open browser: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the servers:" -ForegroundColor Yellow
Write-Host "  → Press Ctrl+C in each terminal window" -ForegroundColor White
Write-Host ""
Write-Host "API Documentation:" -ForegroundColor Yellow
Write-Host "  → http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
pause

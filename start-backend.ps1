Write-Host "Starting EcoGenAI Backend..." -ForegroundColor Cyan
Write-Host "Backend API will be available at: http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Green
Set-Location backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

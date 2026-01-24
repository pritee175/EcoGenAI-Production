Write-Host "Starting EcoGenAI Backend..." -ForegroundColor Cyan
Set-Location backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

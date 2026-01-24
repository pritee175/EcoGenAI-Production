# Start Final Frontend (Enterprise Dashboard)
Write-Host "Starting EcoGenAI Enterprise Dashboard..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Green
npm run dev

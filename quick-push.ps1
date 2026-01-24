# Quick Push to GitHub
# Run this from the PARENT directory (that contains EcoGenAI, final_frontened, etc.)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EcoGenAI - Quick Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "EcoGenAI") -or -not (Test-Path "final_frontened")) {
    Write-Host "ERROR: Please run this script from the parent directory!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You should be in the directory that contains:" -ForegroundColor Yellow
    Write-Host "  - EcoGenAI/" -ForegroundColor White
    Write-Host "  - final_frontened/" -ForegroundColor White
    Write-Host "  - eco-gen-ai-enterprise-dashboard/" -ForegroundColor White
    Write-Host ""
    Write-Host "Navigate to the parent directory and run:" -ForegroundColor Yellow
    Write-Host "  .\EcoGenAI\quick-push.ps1" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✓ Correct directory detected" -ForegroundColor Green
Write-Host ""

# Initialize git if needed
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git already initialized" -ForegroundColor Green
}

Write-Host ""

# Check/add remote
$remoteUrl = git remote get-url origin 2>$null
if ($remoteUrl) {
    Write-Host "Remote already exists: $remoteUrl" -ForegroundColor Yellow
    if ($remoteUrl -ne "https://github.com/pritee175/EcoGenAI.git") {
        Write-Host "Updating remote URL..." -ForegroundColor Yellow
        git remote set-url origin https://github.com/pritee175/EcoGenAI.git
        Write-Host "✓ Remote updated" -ForegroundColor Green
    }
} else {
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/pritee175/EcoGenAI.git
    Write-Host "✓ Remote added" -ForegroundColor Green
}

Write-Host ""
Write-Host "Adding files..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files staged" -ForegroundColor Green

Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "feat: Complete EcoGenAI platform with Firebase authentication

- Firebase authentication (Google SSO + Email/Password)
- Professional Sign In/Sign Up UI with toggle
- Vanta.js animated clouds background
- EcoGenAI branding (removed Allianz references)
- 10 dashboard pages with real-time updates
- ESG monitoring and reporting
- Climate risk analysis
- Comprehensive documentation
- Already have account / New user links"

Write-Host "✓ Commit created" -ForegroundColor Green

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Repository: https://github.com/pritee175/EcoGenAI" -ForegroundColor Cyan
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "View your repository:" -ForegroundColor Cyan
    Write-Host "https://github.com/pritee175/EcoGenAI" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Push failed. Trying master branch..." -ForegroundColor Yellow
    git push -u origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Successfully pushed to master branch!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  Push Failed" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "This might be because:" -ForegroundColor Yellow
        Write-Host "1. Repository doesn't exist on GitHub yet" -ForegroundColor White
        Write-Host "   Create it at: https://github.com/new" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. Authentication failed" -ForegroundColor White
        Write-Host "   Use Personal Access Token from:" -ForegroundColor Gray
        Write-Host "   https://github.com/settings/tokens" -ForegroundColor Gray
        Write-Host ""
        Write-Host "3. Network issues" -ForegroundColor White
        Write-Host "   Check your internet connection" -ForegroundColor Gray
        Write-Host ""
        Write-Host "See PUSH-TO-GITHUB-INSTRUCTIONS.md for detailed help" -ForegroundColor Cyan
    }
}

Write-Host ""

# Secure Push to GitHub
# This script will prompt for your Personal Access Token

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Secure Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right place
$currentPath = Get-Location
Write-Host "Current directory: $currentPath" -ForegroundColor Yellow
Write-Host ""

# Initialize git
Write-Host "Step 1: Initializing Git..." -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git already initialized" -ForegroundColor Green
}
Write-Host ""

# Configure git
Write-Host "Step 2: Configuring Git..." -ForegroundColor Cyan
git config user.name "pritee175"
git config user.email "pritee175@users.noreply.github.com"
Write-Host "✓ Git configured" -ForegroundColor Green
Write-Host ""

# Add remote
Write-Host "Step 3: Adding remote repository..." -ForegroundColor Cyan
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    git remote set-url origin https://pritee175@github.com/pritee175/EcoGenAI.git
    Write-Host "✓ Remote updated" -ForegroundColor Green
} else {
    git remote add origin https://pritee175@github.com/pritee175/EcoGenAI.git
    Write-Host "✓ Remote added" -ForegroundColor Green
}
Write-Host ""

# Add files
Write-Host "Step 4: Adding files..." -ForegroundColor Cyan
git add .
Write-Host "✓ Files staged" -ForegroundColor Green
Write-Host ""

# Commit
Write-Host "Step 5: Creating commit..." -ForegroundColor Cyan
git commit -m "feat: Complete EcoGenAI platform with Firebase authentication

- Firebase authentication (Google SSO + Email/Password)
- Professional Sign In/Sign Up UI with toggle
- Vanta.js animated clouds background
- EcoGenAI branding (removed Allianz references)
- 10 dashboard pages with real-time updates
- ESG monitoring and reporting
- Climate risk analysis
- Comprehensive documentation"

Write-Host "✓ Commit created" -ForegroundColor Green
Write-Host ""

# Push
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: When prompted for password, use your Personal Access Token" -ForegroundColor Yellow
Write-Host "NOT your GitHub password!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Get your token from: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your code is now on GitHub:" -ForegroundColor Cyan
    Write-Host "https://github.com/pritee175/EcoGenAI" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Push failed. Trying master branch..." -ForegroundColor Yellow
    git push -u origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Successfully pushed to master branch!" -ForegroundColor Green
        Write-Host "https://github.com/pritee175/EcoGenAI" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "Push failed. Common reasons:" -ForegroundColor Red
        Write-Host "1. Repository doesn't exist - create it at https://github.com/new" -ForegroundColor Yellow
        Write-Host "2. Wrong token - get new one at https://github.com/settings/tokens" -ForegroundColor Yellow
        Write-Host "3. Token needs 'repo' scope" -ForegroundColor Yellow
    }
}

Write-Host ""

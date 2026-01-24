# Push EcoGenAI to GitHub Repository
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push to GitHub Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
$isGitRepo = Test-Path ".git"

if (-not $isGitRepo) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
    Write-Host ""
}

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null

if ($remoteExists) {
    Write-Host "Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to change it to https://github.com/pritee175/EcoGenAI.git? (y/n)"
    if ($response -eq 'y') {
        git remote set-url origin https://github.com/pritee175/EcoGenAI.git
        Write-Host "✓ Remote URL updated" -ForegroundColor Green
    }
} else {
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/pritee175/EcoGenAI.git
    Write-Host "✓ Remote added: https://github.com/pritee175/EcoGenAI.git" -ForegroundColor Green
}

Write-Host ""
Write-Host "Checking current status..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Yellow
$commitMessage = "feat: Complete EcoGenAI platform with Firebase auth and professional UI

- Added Firebase authentication (Google SSO + Email/Password)
- Implemented Sign In/Sign Up toggle with professional UI
- Added Vanta.js animated clouds background
- Removed Allianz branding, replaced with EcoGenAI
- Complete dashboard with 10 feature pages
- Real-time WebSocket updates
- ESG monitoring and reporting
- Climate risk analysis
- Comprehensive documentation"

git commit -m $commitMessage

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Branch: main" -ForegroundColor Cyan
Write-Host ""

# Try to push
try {
    git push -u origin main
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository: https://github.com/pritee175/EcoGenAI" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "Push failed. This might be because:" -ForegroundColor Red
    Write-Host "1. The repository doesn't exist yet" -ForegroundColor Yellow
    Write-Host "2. You need to authenticate with GitHub" -ForegroundColor Yellow
    Write-Host "3. The branch name is different" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Trying alternative: push to master branch..." -ForegroundColor Yellow
    try {
        git push -u origin master
        Write-Host ""
        Write-Host "✓ Successfully pushed to master branch!" -ForegroundColor Green
    } catch {
        Write-Host ""
        Write-Host "Alternative push also failed." -ForegroundColor Red
        Write-Host ""
        Write-Host "Please try manually:" -ForegroundColor Yellow
        Write-Host "1. Create the repository on GitHub if it doesn't exist" -ForegroundColor White
        Write-Host "2. Run: git push -u origin main" -ForegroundColor White
        Write-Host "   or: git push -u origin master" -ForegroundColor White
        Write-Host ""
        Write-Host "If you need to authenticate:" -ForegroundColor Yellow
        Write-Host "git config --global user.name 'Your Name'" -ForegroundColor White
        Write-Host "git config --global user.email 'your.email@example.com'" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Cyan

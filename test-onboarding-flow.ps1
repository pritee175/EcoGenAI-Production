# Test complete onboarding flow
Write-Host "Testing Onboarding Flow..." -ForegroundColor Cyan

# Step 1: Cloud Selection
Write-Host "`n=== Step 1: Cloud Selection ===" -ForegroundColor Yellow
$body1 = @{
    user_email = "test@company.com"
    provider = "aws"
    organization_name = "Test Organization"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:8000/api/onboarding/step/cloud-selection" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body1
    
    Write-Host "✓ Cloud selection saved!" -ForegroundColor Green
    Write-Host ($response1 | ConvertTo-Json)
} catch {
    Write-Host "✗ Cloud selection failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Credentials
Write-Host "`n=== Step 2: Credentials Verification ===" -ForegroundColor Yellow
$body2 = @{
    user_email = "test@company.com"
    access_key = "testkey123456"
    secret_key = "testsecret123456"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:8000/api/onboarding/step/credentials" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body2
    
    Write-Host "✓ Credentials verified!" -ForegroundColor Green
    Write-Host ($response2 | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "✗ Credentials verification failed: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Complete onboarding
Write-Host "`n=== Step 3: Complete Onboarding ===" -ForegroundColor Yellow
try {
    $response3 = Invoke-RestMethod -Uri "http://localhost:8000/api/onboarding/complete?user_email=test@company.com" `
        -Method POST
    
    Write-Host "✓ Onboarding completed!" -ForegroundColor Green
    Write-Host ($response3 | ConvertTo-Json)
} catch {
    Write-Host "✗ Onboarding completion failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ ALL TESTS PASSED!" -ForegroundColor Green

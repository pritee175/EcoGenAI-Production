# Test the verification API endpoint
Write-Host "Testing verification API..." -ForegroundColor Cyan

$body = @{
    user_email = "test@company.com"
    access_key = "testkey123456"
    secret_key = "testsecret123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/onboarding/step/credentials" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -TimeoutSec 5
    
    Write-Host "✓ API Response received!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "✗ API call failed: $_" -ForegroundColor Red
}

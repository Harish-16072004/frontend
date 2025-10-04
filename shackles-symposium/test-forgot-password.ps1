# Test Forgot Password Flow

Write-Host ""
Write-Host "🔐 Testing Forgot Password Functionality" -ForegroundColor Cyan
Write-Host ""

# Check backend
Write-Host "Checking backend connection..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 2
    Write-Host "✅ Backend is running" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Backend not running! Start backend first:" -ForegroundColor Red
    Write-Host "   cd backend" -ForegroundColor Gray
    Write-Host "   node src/server.js" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Test 1: Request password reset
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "TEST 1: Request Password Reset" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Requesting password reset for harish@test.com..." -ForegroundColor Yellow

$body = @{
    email = "harish@test.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/forgot-password" -Method Post -ContentType "application/json" -Body $body
    
    Write-Host "✅ Password reset email sent!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host "  Success: $($response.success)" -ForegroundColor Gray
    Write-Host "  Message: $($response.message)" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    $errorMessage = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "❌ Request failed!" -ForegroundColor Red
    Write-Host "  Error: $($errorMessage.message)" -ForegroundColor Gray
    Write-Host ""
}

# Test 2: Test with non-existent user
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "TEST 2: Non-Existent User (Should Fail)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing with nonexistent@test.com..." -ForegroundColor Yellow

$body = @{
    email = "nonexistent@test.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/forgot-password" -Method Post -ContentType "application/json" -Body $body
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
    Write-Host ""
} catch {
    $errorMessage = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($errorMessage.message -like "*no user with that email*") {
        Write-Host "✅ Correctly rejected non-existent user" -ForegroundColor Green
        Write-Host "  Error: $($errorMessage.message)" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "❌ Unexpected error" -ForegroundColor Red
        Write-Host "  Error: $($errorMessage.message)" -ForegroundColor Gray
        Write-Host ""
    }
}

# Test 3: Test with invalid email format
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "TEST 3: Invalid Email Format (Should Fail)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing with invalid-email-format..." -ForegroundColor Yellow

$body = @{
    email = "invalid-email-format"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/forgot-password" -Method Post -ContentType "application/json" -Body $body
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
    Write-Host ""
} catch {
    $errorMessage = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "✅ Correctly rejected invalid email format" -ForegroundColor Green
    Write-Host "  Error: $($errorMessage.message)" -ForegroundColor Gray
    Write-Host ""
}

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📧 NEXT STEPS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Check your email for the reset link" -ForegroundColor Yellow
Write-Host "   (If email not configured, check MongoDB for reset token)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. The reset link will look like:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000/reset-password/abc123token456..." -ForegroundColor Gray
Write-Host ""
Write-Host "3. To test reset password manually:" -ForegroundColor Yellow
Write-Host "   $resetToken = `"paste-token-here`"" -ForegroundColor Gray
Write-Host "   $body = @{password = `"NewPassword123!`"} | ConvertTo-Json" -ForegroundColor Gray
Write-Host "   Invoke-RestMethod -Uri `"http://localhost:5000/api/v1/auth/reset-password/$resetToken`" -Method Put -ContentType `"application/json`" -Body $body" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Token expires in 10 minutes!" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Test complete!" -ForegroundColor Green
Write-Host ""

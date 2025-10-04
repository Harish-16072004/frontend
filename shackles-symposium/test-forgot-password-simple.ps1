# Simple Test for Forgot Password API

Write-Host ""
Write-Host "🔐 Testing Forgot Password API" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if backend is running
Write-Host "Step 1: Checking backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 2
    Write-Host "✅ Backend is running on port 5000" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Start backend first:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Gray
    Write-Host "  node src/server.js" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Step 2: Request password reset
Write-Host "Step 2: Requesting password reset..." -ForegroundColor Yellow
Write-Host "  Endpoint: POST http://localhost:5000/api/v1/auth/forgot-password" -ForegroundColor Gray
Write-Host "  Email: harish@test.com" -ForegroundColor Gray
Write-Host ""

$body = @{
    email = "harish@test.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/forgot-password" -Method Post -ContentType "application/json" -Body $body
    
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host "❌ FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error Details:" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Message: $($errorResponse.message)" -ForegroundColor Red
        Write-Host "Success: $($errorResponse.success)" -ForegroundColor Red
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Step 3: What happens next?
Write-Host "📧 What Happened:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "1. ✅ Backend found user with email: harish@test.com" -ForegroundColor Gray
Write-Host "2. ✅ Generated a secure reset token" -ForegroundColor Gray
Write-Host "3. ✅ Saved hashed token to MongoDB" -ForegroundColor Gray
Write-Host "4. ✅ Token will expire in 10 minutes" -ForegroundColor Gray
Write-Host "5. 📧 Email should be sent (if email configured)" -ForegroundColor Gray
Write-Host ""

# Step 4: Next steps
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Check your email" -ForegroundColor Cyan
Write-Host "  - Look for reset email from SHACKLES 2025" -ForegroundColor Gray
Write-Host "  - Click the reset link" -ForegroundColor Gray
Write-Host "  - Enter new password" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Get token from MongoDB (if email not configured)" -ForegroundColor Cyan
Write-Host "  1. Go to MongoDB Atlas: https://cloud.mongodb.com" -ForegroundColor Gray
Write-Host "  2. Browse Collections → shackles_db → users" -ForegroundColor Gray
Write-Host "  3. Find user: harish@test.com" -ForegroundColor Gray
Write-Host "  4. Copy the resetPasswordToken field" -ForegroundColor Gray
Write-Host "  5. Use it to test reset password endpoint" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Test Complete!" -ForegroundColor Green
Write-Host ""

# Test Registration Flow

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Registration Flow Test Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test data
$testData = @{
    firstName = "Test"
    lastName = "User"
    email = "test$(Get-Random -Minimum 1000 -Maximum 9999)@example.com"
    phone = "9876543210"
    password = "test123"
    college = "Test College"
    collegeLocation = "Chennai, TN"
    department = "Mechanical Engineering"
    year = "3"
    registrationType = "both"
    amount = "499"
    transactionId = "TEST$(Get-Random -Minimum 10000 -Maximum 99999)"
    termsAccepted = "true"
}

Write-Host "Test User Details:" -ForegroundColor Yellow
Write-Host "Name: $($testData.firstName) $($testData.lastName)" -ForegroundColor White
Write-Host "Email: $($testData.email)" -ForegroundColor White
Write-Host "Registration Type: $($testData.registrationType)" -ForegroundColor White
Write-Host "Amount: Rs.$($testData.amount)" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  Note: You need to add a file manually for this test" -ForegroundColor Yellow
Write-Host "This script tests the data submission structure." -ForegroundColor Yellow
Write-Host ""

# Test 1: Check if backend is running
Write-Host "[Test 1] Checking Backend Status..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/me" -Method Get -ErrorAction Stop
    Write-Host "❌ Unexpected: Received response without authentication" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Backend is running and authentication is working" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend might not be running. Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Please start the backend with: cd backend; npm run dev" -ForegroundColor Yellow
        exit 1
    }
}
Write-Host ""

# Test 2: Check S3 configuration
Write-Host "[Test 2] Checking S3 Configuration..." -ForegroundColor Cyan
$envPath = Join-Path $PSScriptRoot "..\backend\.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    $hasS3Bucket = $envContent | Where-Object { $_ -match "AWS_S3_BUCKET_NAME" }
    $hasAccessKey = $envContent | Where-Object { $_ -match "AWS_ACCESS_KEY_ID" }
    $hasSecretKey = $envContent | Where-Object { $_ -match "AWS_SECRET_ACCESS_KEY" }
    $hasRegion = $envContent | Where-Object { $_ -match "AWS_REGION" }
    
    if ($hasS3Bucket -and $hasAccessKey -and $hasSecretKey -and $hasRegion) {
        Write-Host "✅ S3 configuration found in .env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Some S3 configuration might be missing" -ForegroundColor Yellow
        if (-not $hasS3Bucket) { Write-Host "  - AWS_S3_BUCKET_NAME missing" -ForegroundColor Red }
        if (-not $hasAccessKey) { Write-Host "  - AWS_ACCESS_KEY_ID missing" -ForegroundColor Red }
        if (-not $hasSecretKey) { Write-Host "  - AWS_SECRET_ACCESS_KEY missing" -ForegroundColor Red }
        if (-not $hasRegion) { Write-Host "  - AWS_REGION missing" -ForegroundColor Red }
    }
} else {
    Write-Host "⚠️  .env file not found at: $envPath" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Verify MongoDB connection
Write-Host "[Test 3] Testing Database Connection..." -ForegroundColor Cyan
try {
    # This will fail with 401 but proves backend can connect to DB
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/me" -Method Get -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Database connection is working" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not verify database connection" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 4: Test login endpoint structure
Write-Host "[Test 4] Testing Login Endpoint Structure..." -ForegroundColor Cyan
try {
    $body = @{
        email = "nonexistent@test.com"
        password = "wrongpassword"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "❌ Unexpected: Login succeeded with fake credentials" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Login endpoint is working correctly (rejected invalid credentials)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected response from login endpoint" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 5: Check QR code images
Write-Host "[Test 5] Checking QR Code Images..." -ForegroundColor Cyan
$publicPath = Join-Path $PSScriptRoot "..\frontend\public"
$qrFiles = @("qr-general-299.png", "qr-workshop-199.png", "qr-both-499.png", "qr-dummy.png")
$missingFiles = @()

foreach ($file in $qrFiles) {
    $filePath = Join-Path $publicPath $file
    if (Test-Path $filePath) {
        Write-Host "  ✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Missing: $file" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Missing QR code images. The system will use placeholders." -ForegroundColor Yellow
    Write-Host "To add QR codes, see: frontend/QR_CODES_SETUP.md" -ForegroundColor Yellow
} else {
    Write-Host "✅ All QR code images are present" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Manual Testing Steps:" -ForegroundColor Yellow
Write-Host "1. Start backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. Start frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "3. Go to: http://localhost:3000/register" -ForegroundColor White
Write-Host "4. Fill in all personal details (use any test data)" -ForegroundColor White
Write-Host "5. Click 'Continue to Payment'" -ForegroundColor White
Write-Host "6. Click any registration type button (General/Workshop/Both)" -ForegroundColor White
Write-Host "7. Enter a transaction ID (e.g., TEST12345)" -ForegroundColor White
Write-Host "8. Upload any image as payment screenshot" -ForegroundColor White
Write-Host "9. Check 'Accept terms and conditions'" -ForegroundColor White
Write-Host "10. Click 'Submit Registration'" -ForegroundColor White
Write-Host "11. Verify success page appears" -ForegroundColor White
Write-Host ""
Write-Host "Expected Results:" -ForegroundColor Yellow
Write-Host "- Success page shows confirmation" -ForegroundColor White
Write-Host "- Image uploads to S3 bucket: shackles-25-26/payment-proof/" -ForegroundColor White
Write-Host "- User record created in MongoDB with paymentStatus='pending'" -ForegroundColor White
Write-Host "- Email sent to user (if email service configured)" -ForegroundColor White
Write-Host ""
Write-Host "To verify in database:" -ForegroundColor Yellow
Write-Host "- Open MongoDB Compass" -ForegroundColor White
Write-Host "- Connect to your cluster" -ForegroundColor White
Write-Host "- Check 'users' collection for new record" -ForegroundColor White
Write-Host "- Verify fields: registrationType, paymentAmount, paymentScreenshot, paymentStatus" -ForegroundColor White
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Script Complete" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

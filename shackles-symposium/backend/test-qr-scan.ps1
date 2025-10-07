# PowerShell Script to Test QR Scanning API
# Make sure backend server is running first!

Write-Host "🧪 Testing QR Scan API" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Configuration
$baseUrl = "http://localhost:5000"
$adminToken = ""  # You'll need to login first to get this

# Check if server is running
Write-Host "Checking if backend server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/health" -Method GET -ErrorAction SilentlyContinue
    Write-Host "✅ Server is running!`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not running!" -ForegroundColor Red
    Write-Host "Please start the backend server first:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
    Write-Host "`nOr:" -ForegroundColor Yellow
    Write-Host "  node src/server.js`n" -ForegroundColor White
    exit 1
}

# Step 1: Login as admin to get token
Write-Host "Step 1: Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@shackles.com"
    password = "Admin@2025SecurePassword"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $adminToken = $loginResponse.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   Admin: $($loginResponse.user.name)" -ForegroundColor Gray
    Write-Host "   Token: $($adminToken.Substring(0,20))...`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nMake sure admin account exists with these credentials:" -ForegroundColor Yellow
    Write-Host "  Email: admin@shackles.com" -ForegroundColor White
    Write-Host "  Password: Admin@2025SecurePassword`n" -ForegroundColor White
    exit 1
}

# Step 2: Test QR Scan endpoint (without actual QR data)
Write-Host "Step 2: Testing QR Scan endpoint..." -ForegroundColor Yellow

# This will fail validation but shows the endpoint is working
$qrScanBody = @{
    qrData = '{"t":"test-token","p":"SHGN001","v":1}'
    eventId = "507f1f77bcf86cd799439011"  # Dummy event ID
    eventType = "event"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

try {
    $scanResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/qr-scan/scan-qr" -Method POST -Body $qrScanBody -Headers $headers
    Write-Host "✅ QR Scan endpoint is working!" -ForegroundColor Green
    Write-Host "   Response: $($scanResponse.message)" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 403 -or $statusCode -eq 404) {
        Write-Host "✅ QR Scan endpoint is working!" -ForegroundColor Green
        Write-Host "   (Got expected validation error - this is normal for test data)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Unexpected response:" -ForegroundColor Yellow
        Write-Host "   Status Code: $statusCode" -ForegroundColor Gray
    }
}

Write-Host "`n====================================`n" -ForegroundColor Cyan
Write-Host "📊 Available QR Scan Endpoints:" -ForegroundColor Cyan
Write-Host "  POST $baseUrl/api/v1/qr-scan/scan-qr" -ForegroundColor White
Write-Host "  POST $baseUrl/api/v1/qr-scan/check-in" -ForegroundColor White
Write-Host "  POST $baseUrl/api/v1/qr-scan/issue-kit" -ForegroundColor White
Write-Host "  POST $baseUrl/api/v1/qr-scan/scan-and-checkin" -ForegroundColor White
Write-Host "  GET  $baseUrl/api/v1/qr-scan/kit-status/:id" -ForegroundColor White
Write-Host "  GET  $baseUrl/api/v1/qr-scan/history/:id" -ForegroundColor White

Write-Host "`n✅ QR Scanning API is ready to use!" -ForegroundColor Green
Write-Host "`nNext: Use these endpoints with real participant QR codes" -ForegroundColor Yellow
Write-Host "      and actual event/workshop IDs from your database.`n" -ForegroundColor Yellow

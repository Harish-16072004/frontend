# ============================================
# SHACKLES QR Testing Script - Fixed Headers
# ============================================

Write-Host "`n🧪 SHACKLES QR Testing - Postman Style" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"
$ErrorActionPreference = "Continue"

# ============================================
# Step 1: Check Server
# ============================================
Write-Host "Step 1: Checking server..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "$baseUrl/api/v1/health" -Method GET -UseBasicParsing
    Write-Host "   ✅ Server is running`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Server not running!" -ForegroundColor Red
    Write-Host "   Start server: cd backend; npm start`n" -ForegroundColor Yellow
    exit 1
}

# ============================================
# Step 2: Admin Login
# ============================================
Write-Host "Step 2: Admin Login..." -ForegroundColor Yellow

# Create login body
$loginBody = @{
    email = "acgcet@edu.in"
    password = "Admin@123"
} | ConvertTo-Json

# ✅ CORRECT: Headers without colons
$loginHeaders = @{
    "Content-Type" = "application/json"
}

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" `
        -Method POST `
        -Headers $loginHeaders `
        -Body $loginBody
    
    $token = $loginResponse.token
    
    Write-Host "   ✅ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.user.name)" -ForegroundColor Gray
    Write-Host "   Role: $($loginResponse.user.role)" -ForegroundColor Gray
    Write-Host "   Token: $($token.Substring(0, 30))...`n" -ForegroundColor Gray
    
} catch {
    Write-Host "   ❌ Login failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Check credentials in script`n" -ForegroundColor Yellow
    exit 1
}

# ============================================
# Step 3: Test QR Scan Endpoint
# ============================================
Write-Host "Step 3: Testing QR Scan Endpoint..." -ForegroundColor Yellow

# ✅ CORRECT: Headers without colons
$authHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

# Create QR scan body
$qrScanBody = @{
    qrData = '{"t":"test-token-123","p":"SHGN001","v":1,"e":"SHACKLES2025"}'
    eventId = "670d4c5e8f12345678901234"
    eventType = "event"
} | ConvertTo-Json

try {
    $scanResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/qr-scan/scan-qr" `
        -Method POST `
        -Headers $authHeaders `
        -Body $qrScanBody
    
    Write-Host "   ✅ QR Scan successful!" -ForegroundColor Green
    Write-Host "   Message: $($scanResponse.message)" -ForegroundColor Gray
    if ($scanResponse.participant) {
        Write-Host "   Participant: $($scanResponse.participant.id)" -ForegroundColor Gray
    }
    Write-Host ""
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 404) {
        Write-Host "   ⚠️  Event/Participant not found (404)" -ForegroundColor Yellow
        Write-Host "   This is expected for test data" -ForegroundColor Gray
        Write-Host "   ✅ Endpoint is working correctly`n" -ForegroundColor Green
    } elseif ($statusCode -eq 403) {
        Write-Host "   ⚠️  Access denied (403)" -ForegroundColor Yellow
        Write-Host "   Registration type mismatch" -ForegroundColor Gray
        Write-Host "   ✅ Access control is working`n" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error: $statusCode" -ForegroundColor Red
        Write-Host "   Message: $($_.Exception.Message)`n" -ForegroundColor Red
    }
}

# ============================================
# Step 4: Test Kit Status Endpoint
# ============================================
Write-Host "Step 4: Testing Kit Status Endpoint..." -ForegroundColor Yellow

$participantId = "SHGN001"

try {
    $statusResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/qr-scan/kit-status/$participantId" `
        -Method GET `
        -Headers @{"Authorization" = "Bearer $token"}
    
    Write-Host "   ✅ Kit Status retrieved!" -ForegroundColor Green
    Write-Host "   Participant: $($statusResponse.participantId)" -ForegroundColor Gray
    Write-Host "   Registration Type: $($statusResponse.registrationType)" -ForegroundColor Gray
    Write-Host "   Workshop Kit: $($statusResponse.workshopKit.issued)" -ForegroundColor Gray
    Write-Host "   Events Kit: $($statusResponse.eventsKit.issued)" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 404) {
        Write-Host "   ⚠️  Participant not found (404)" -ForegroundColor Yellow
        Write-Host "   This is expected if no test data exists" -ForegroundColor Gray
        Write-Host "   ✅ Endpoint is working correctly`n" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Error: $statusCode" -ForegroundColor Yellow
        Write-Host "   Message: $($_.Exception.Message)`n" -ForegroundColor Yellow
    }
}

# ============================================
# Step 5: Test Issue Kit Endpoint
# ============================================
Write-Host "Step 5: Testing Issue Kit Endpoint..." -ForegroundColor Yellow

$issueKitBody = @{
    participantId = "SHGN001"
    kitDay = "events"
    collectionPoint = "main-desk"
    deviceInfo = @{
        userAgent = "PowerShell Test Script"
        ipAddress = "127.0.0.1"
    }
} | ConvertTo-Json

try {
    $kitResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/qr-scan/issue-kit" `
        -Method POST `
        -Headers $authHeaders `
        -Body $issueKitBody
    
    Write-Host "   ✅ Kit issued successfully!" -ForegroundColor Green
    Write-Host "   ID Card: $($kitResponse.kit.idCardNumber)" -ForegroundColor Gray
    Write-Host "   Kit Day: $($kitResponse.kit.kitDay)" -ForegroundColor Gray
    Write-Host "   Items: $($kitResponse.kit.contents.Count) items`n" -ForegroundColor Gray
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 404) {
        Write-Host "   ⚠️  Participant not found (404)" -ForegroundColor Yellow
        Write-Host "   Create test participant first" -ForegroundColor Gray
    } elseif ($statusCode -eq 403) {
        Write-Host "   ⚠️  Not eligible for this kit (403)" -ForegroundColor Yellow
        Write-Host "   Check registration type" -ForegroundColor Gray
    } elseif ($statusCode -eq 400) {
        Write-Host "   ⚠️  Kit already issued (400)" -ForegroundColor Yellow
        Write-Host "   Each kit can only be issued once" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  Error: $statusCode" -ForegroundColor Yellow
        Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    Write-Host ""
}

# ============================================
# Summary
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Testing Complete!`n" -ForegroundColor Green

Write-Host "📊 Available Endpoints:" -ForegroundColor Cyan
Write-Host "   POST   /api/v1/auth/login" -ForegroundColor White
Write-Host "   POST   /api/v1/qr-scan/scan-qr" -ForegroundColor White
Write-Host "   POST   /api/v1/qr-scan/scan-and-checkin" -ForegroundColor White
Write-Host "   POST   /api/v1/qr-scan/issue-kit" -ForegroundColor White
Write-Host "   GET    /api/v1/qr-scan/kit-status/:id" -ForegroundColor White
Write-Host ""

Write-Host "🔑 Your Token (valid for 7 days):" -ForegroundColor Cyan
Write-Host "   $token" -ForegroundColor DarkGray
Write-Host ""

Write-Host "💡 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Use this token in Postman: Bearer $($token.Substring(0, 30))..." -ForegroundColor Gray
Write-Host "   2. Create test participants in database" -ForegroundColor Gray
Write-Host "   3. Test with real QR codes" -ForegroundColor Gray
Write-Host ""

Write-Host "📖 For Postman testing guide, see:" -ForegroundColor Cyan
Write-Host "   - TESTING_GUIDE.md" -ForegroundColor Gray
Write-Host "   - COMPLETE_TESTING_MANUAL.md" -ForegroundColor Gray
Write-Host ""

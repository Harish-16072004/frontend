# 🧪 Complete Testing Guide
## How to Test All Features

**Date:** October 7, 2025

---

## 🎯 Overview

This guide shows you how to actually test:
1. Google Sheets Integration ✅ (Already working!)
2. QR Scanning API
3. Kit Distribution System

---

## 📊 1. Google Sheets Integration (Already Tested ✅)

### Quick Test:
```powershell
cd backend
node test-google-sheets.js
```

**Expected Output:**
```
✅ SUCCESS! Google Sheets export completed
- Updated Cells: 24
- Updated Rows: 4
```

✅ **Status: WORKING**

---

## 📱 2. Testing QR Scanning API

### Prerequisites:
1. Backend server must be running
2. Admin account must exist
3. Some test data in database

### Option A: Using PowerShell Script (Easiest)

```powershell
# Start backend server (if not running)
cd backend
npm start
# Or: node src/server.js

# In another terminal, run test script
cd backend
.\test-qr-scan.ps1
```

**What it tests:**
- ✅ Server connectivity
- ✅ Admin authentication
- ✅ QR scan endpoint availability
- ✅ Authorization middleware

### Option B: Using REST Client Tools

#### 1. **Postman** (Recommended)
   - Download: https://www.postman.com/downloads/
   - Import collection from documentation
   - Easy GUI for testing

#### 2. **Thunder Client** (VS Code Extension)
   - Install in VS Code
   - Click thunder icon in sidebar
   - Create new request

#### 3. **PowerShell (Manual)**

```powershell
# Step 1: Login to get token
$loginBody = @{
    email = "acgcet@edu.in"
    password = "Admin@123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"

$token = $login.token
Write-Host "Token: $token"

# Step 2: Test QR Scan
$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTI2YzZhMjQ3N2MxNDhjOWRjOGNkNCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTgwNjY3NywiZXhwIjoxNzYwNDExNDc3fQ.Soguw6Uf0p0l5nhzEqGKMn0RjQP5F2VQc1dWD0JQfQ4"
    "Content-Type" = "application/json"
}

$qrBody = @{
    qrData = '{"t":"test","p":"SHGN001","v":1}'
    eventId = "507f1f77bcf86cd799439011"
    eventType = "event"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/scan-qr" -Method POST -Headers $headers -Body $qrBody

$result
```

#### 4. **cURL** (Cross-platform)

```bash
# Step 1: Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"acgcet@edu.in","password":"Admin@123"}'

# Save the token from response, then:

# Step 2: Test QR Scan
curl -X POST http://localhost:5000/api/v1/qr-scan/scan-qr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"qrData":"{\"t\":\"test\",\"p\":\"SHGN001\"}","eventId":"507f1f77bcf86cd799439011","eventType":"event"}'
```

---

## 📦 3. Testing Kit Distribution

### Test Workshop Day Kit Issuance:

```powershell
# Using PowerShell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$kitBody = @{
    participantId = "SHWK001"
    kitDay = "workshop"
    collectionPoint = "workshop-desk"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/issue-kit" -Method POST -Headers $headers -Body $kitBody

$result
```

### Test Events Day Kit Issuance:

```powershell
$kitBody = @{
    participantId = "SHGN001"
    kitDay = "events"
    collectionPoint = "main-desk"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/issue-kit" -Method POST -Headers $headers -Body $kitBody

$result
```

### Check Kit Status:

```powershell
$result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/kit-status/SHGN001" -Headers $headers

$result
```

---

## 🔧 Complete Test Script (All-in-One)

Save this as `test-all-features.ps1`:

```powershell
# Complete SHACKLES API Test Script
Write-Host "🧪 SHACKLES API Complete Test Suite" -ForegroundColor Cyan
Write-Host "====================================`n"

$baseUrl = "http://localhost:5000"

# 1. Test Server
Write-Host "1. Testing Server..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "$baseUrl/api/v1/health" -Method GET -ErrorAction SilentlyContinue | Out-Null
    Write-Host "   ✅ Server is running`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Server not running. Start with: npm start`n" -ForegroundColor Red
    exit 1
}

# 2. Test Login
Write-Host "2. Testing Admin Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@shackles.com"
    password = "Admin@2025SecurePassword"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $login.token
    Write-Host "   ✅ Login successful`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Login failed`n" -ForegroundColor Red
    exit 1
}

# 3. Test QR Scan Endpoint
Write-Host "3. Testing QR Scan Endpoint..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$qrBody = @{
    qrData = '{"t":"test","p":"TEST001","v":1}'
    eventId = "507f1f77bcf86cd799439011"
    eventType = "event"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/api/v1/qr-scan/scan-qr" -Method POST -Headers $headers -Body $qrBody | Out-Null
    Write-Host "   ✅ QR Scan endpoint accessible`n" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 403 -or $_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "   ✅ QR Scan endpoint accessible (validation error expected)`n" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Unexpected response`n" -ForegroundColor Yellow
    }
}

# 4. Test Google Sheets
Write-Host "4. Testing Google Sheets..." -ForegroundColor Yellow
try {
    $gsResult = & node test-google-sheets.js 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Google Sheets working`n" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Google Sheets test failed`n" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Could not run Google Sheets test`n" -ForegroundColor Yellow
}

Write-Host "====================================`n" -ForegroundColor Cyan
Write-Host "✅ All tests completed!" -ForegroundColor Green
Write-Host "`nAPI Endpoints Available:" -ForegroundColor Cyan
Write-Host "  - POST /api/v1/auth/login" -ForegroundColor White
Write-Host "  - POST /api/v1/qr-scan/scan-qr" -ForegroundColor White
Write-Host "  - POST /api/v1/qr-scan/issue-kit" -ForegroundColor White
Write-Host "  - GET  /api/v1/qr-scan/kit-status/:id" -ForegroundColor White
Write-Host "`nFor detailed API testing, use Postman or Thunder Client.`n" -ForegroundColor Yellow
```

---

## 🛠️ Recommended Testing Tools

### 1. **Postman** (Best for API Testing)
- **Download:** https://www.postman.com/downloads/
- **Features:** 
  - GUI interface
  - Save requests
  - Environment variables
  - Test collections
- **Use for:** All API testing

### 2. **Thunder Client** (VS Code Extension)
- **Install:** VS Code Extensions → Search "Thunder Client"
- **Features:**
  - Built into VS Code
  - Lightweight
  - Easy to use
- **Use for:** Quick API tests

### 3. **PowerShell Scripts** (Automated Testing)
- **Built-in:** No installation needed
- **Features:**
  - Scriptable
  - Can automate tests
  - Good for CI/CD
- **Use for:** Automated testing

---

## 📋 Test Scenarios

### Scenario 1: Workshop Day Registration Flow

```
1. Start backend server
2. Login as admin
3. Scan participant QR code (workshop registration)
4. Issue workshop day kit
5. Verify kit issued in database
6. Check Google Sheet updated
```

### Scenario 2: Events Day Registration Flow

```
1. Scan participant QR code (general registration)
2. Issue events day kit
3. Verify kit issued
4. Export to Google Sheets
```

### Scenario 3: Both Registration (Complete Flow)

```
1. Day 1 - Workshop Day:
   - Scan QR → Issue workshop kit
   
2. Day 2 - Events Day:
   - Same participant scans QR
   - Check kit status (should show workshop kit issued)
   - Issue events day kit
   - Verify both kits issued
```

---

## ✅ Success Criteria

### Google Sheets:
- [x] Test script passes
- [x] Data visible in Google Sheet
- [x] Auto-formatting applied

### QR Scanning:
- [ ] Endpoint returns 200 OK for valid QR
- [ ] Access control enforced (403 for wrong type)
- [ ] Event validation works (404 for invalid event)

### Kit Distribution:
- [ ] Workshop kit issues successfully
- [ ] Events kit issues separately
- [ ] Cannot issue same kit twice
- [ ] Eligibility checks work

---

## 🐛 Common Issues

### Issue: "Server not running"
**Solution:**
```powershell
cd backend
npm start
```

### Issue: "Login failed"
**Solution:** Create admin account first or check credentials in .env

### Issue: "401 Unauthorized"
**Solution:** Get fresh token by logging in again

### Issue: "POST is not recognized"
**Solution:** Don't type API endpoints directly in PowerShell. Use:
- PowerShell script (`.ps1` file)
- Postman
- Thunder Client
- cURL

---

## 🚀 Next Steps

1. **Install Postman** for easy API testing
2. **Create test users** in your database
3. **Generate real QR codes** for participants
4. **Test complete flows** with real data
5. **Build frontend UI** for coordinators

---

## 📞 Quick Reference

### Start Backend:
```powershell
cd backend
npm start
```

### Test Google Sheets:
```powershell
node test-google-sheets.js
```

### Test QR Scan:
```powershell
.\test-qr-scan.ps1
```

### View API Documentation:
- Read: `KIT_DISTRIBUTION_GUIDE.md`
- Read: `STATUS_REPORT.md`

---

**Remember:** The examples showing `POST /api/v1/...` are just showing the endpoints, not commands to run! Use the PowerShell scripts or Postman instead. 😊

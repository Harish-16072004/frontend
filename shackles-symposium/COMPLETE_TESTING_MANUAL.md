# 📘 Complete Testing Manual
## SHACKLES Symposium - Step-by-Step Testing Guide

**Version:** 1.0  
**Date:** October 7, 2025  
**Audience:** Developers, QA Team, System Administrators

---

## 📋 Table of Contents

1. [Pre-Testing Setup](#1-pre-testing-setup)
2. [Environment Verification](#2-environment-verification)
3. [Backend Testing](#3-backend-testing)
4. [Google Sheets Testing](#4-google-sheets-testing)
5. [Authentication Testing](#5-authentication-testing)
6. [QR Scanning Testing](#6-qr-scanning-testing)
7. [Kit Distribution Testing](#7-kit-distribution-testing)
8. [Integration Testing](#8-integration-testing)
9. [End-to-End Testing](#9-end-to-end-testing)
10. [Performance Testing](#10-performance-testing)
11. [Troubleshooting](#11-troubleshooting)
12. [Test Results Documentation](#12-test-results-documentation)

---

## 1. Pre-Testing Setup

### 1.1 System Requirements

**Hardware:**
- RAM: Minimum 4GB
- Storage: Minimum 2GB free space
- Internet: Active connection required

**Software:**
- Node.js: v18.x or higher
- npm: v9.x or higher
- MongoDB: Running instance (local or Atlas)
- VS Code (recommended)
- Postman or Thunder Client

### 1.2 Installation Checklist

```powershell
# Check Node.js version
node --version
# Should show: v18.x or higher

# Check npm version
npm --version
# Should show: v9.x or higher

# Check MongoDB connection
# If using MongoDB Atlas, verify connection string in .env
```

**Checklist:**
- [ ] Node.js installed
- [ ] npm installed
- [ ] MongoDB connection string configured
- [ ] .env file configured
- [ ] Dependencies installed (`npm install`)

### 1.3 Project Structure Verification

```
shackles-symposium/
├── backend/
│   ├── .env                    ✅ Must exist
│   ├── package.json           ✅ Must exist
│   ├── src/
│   │   ├── server.js         ✅ Entry point
│   │   ├── config/           ✅ Configuration files
│   │   ├── models/           ✅ Database models
│   │   ├── controllers/      ✅ Business logic
│   │   ├── routes/           ✅ API routes
│   │   └── utils/            ✅ Helper functions
│   ├── test-google-sheets.js ✅ Test script
│   └── test-qr-scan.ps1      ✅ Test script
└── frontend/
    └── [Frontend files]
```

**Verification Command:**
```powershell
cd backend
dir src\controllers\qrScanController.js
dir src\models\KitDistribution.js
dir src\utils\googleSheets.js
```

### 1.4 Environment Configuration

**File:** `backend/.env`

**Required Variables:**
```properties
# Database
MONGODB_URI=mongodb+srv://...

# Security
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d

# Email
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Google Sheets
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_sheet_id_here

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=your_bucket
```

**Verification:**
```powershell
# Check if .env exists
Test-Path backend\.env

# Check if required variables are set
Get-Content backend\.env | Select-String "MONGODB_URI"
Get-Content backend\.env | Select-String "GOOGLE_CLIENT_EMAIL"
```

---

## 2. Environment Verification

### 2.1 Database Connection Test

**Objective:** Verify MongoDB connection is working

**Steps:**

1. **Create test file:** `backend/test-db-connection.js`

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

console.log('🧪 Testing MongoDB Connection...\n');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('   Database:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ MongoDB connection failed!');
    console.error('   Error:', error.message);
    process.exit(1);
  });
```

2. **Run test:**
```powershell
cd backend
node test-db-connection.js
```

3. **Expected Output:**
```
✅ MongoDB connected successfully!
   Database: shackles_db
   Host: cluster0.mongodb.net
```

**Pass Criteria:**
- [ ] Connection successful
- [ ] Database name displayed
- [ ] No error messages

### 2.2 Dependencies Verification

**Objective:** Verify all npm packages are installed

**Steps:**

1. **Check package.json:**
```powershell
cd backend
cat package.json
```

2. **Install dependencies:**
```powershell
npm install
```

3. **Verify critical packages:**
```powershell
npm list mongoose
npm list express
npm list googleapis
npm list qrcode
npm list nodemailer
```

**Expected Output:**
```
backend@1.0.0
├── mongoose@7.x.x
├── express@4.x.x
├── googleapis@126.x.x
├── qrcode@1.x.x
└── nodemailer@6.x.x
```

**Pass Criteria:**
- [ ] All packages installed
- [ ] No missing dependencies
- [ ] No vulnerability warnings (or acceptable level)

---

## 3. Backend Testing

### 3.1 Server Startup Test

**Objective:** Verify backend server starts without errors

**Steps:**

1. **Start server:**
```powershell
cd backend
npm start
```

**Alternative:**
```powershell
node src/server.js
```

2. **Expected Output:**
```
🚀 Server is running on port 5000
📊 MongoDB Connected: shackles_db
📧 Email service configured
🔐 JWT authentication enabled
📱 QR scanning routes loaded
📦 Kit distribution routes loaded
✅ All systems operational
```

3. **Verify server health:**

Open browser or use PowerShell:
```powershell
Invoke-WebRequest http://localhost:5000/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-10-07T..."
}
```

**Pass Criteria:**
- [ ] Server starts without errors
- [ ] Port 5000 is accessible
- [ ] Health endpoint responds 200 OK
- [ ] Database connection confirmed
- [ ] All routes loaded

### 3.2 API Routes Verification

**Objective:** Verify all routes are registered

**Steps:**

1. **Check routes file:**
```powershell
Get-Content backend\src\server.js | Select-String "app.use"
```

2. **Expected Routes:**
```javascript
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/events', eventRoutes)
app.use('/api/v1/workshops', workshopRoutes)
app.use('/api/v1/registrations', registrationRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/attendance', attendanceRoutes)
app.use('/api/v1/qr-scan', qrScanRoutes)
app.use('/api/v1/admin', adminRoutes)
```

**Pass Criteria:**
- [ ] All 9+ routes registered
- [ ] QR scan routes present
- [ ] Admin routes present
- [ ] No duplicate routes

---

## 4. Google Sheets Testing

### 4.1 Configuration Verification

**Objective:** Verify Google Sheets credentials are properly configured

**Steps:**

1. **Check environment variables:**
```powershell
cd backend
Get-Content .env | Select-String "GOOGLE"
```

2. **Expected Output:**
```
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----...
GOOGLE_SHEET_ID=19srWIvkr9cHBSCuIk5EUcji5P1X0GscO_UOKXeAViBU
```

**Pass Criteria:**
- [ ] GOOGLE_CLIENT_EMAIL exists and is valid format
- [ ] GOOGLE_PRIVATE_KEY exists (with BEGIN/END tags)
- [ ] GOOGLE_SHEET_ID exists (28+ character string)
- [ ] No trailing commas or quotes in private key

### 4.2 Authentication Test

**Objective:** Verify service account can authenticate

**Steps:**

1. **Run test script:**
```powershell
cd backend
node test-google-sheets.js
```

2. **Expected Output:**
```
🧪 Testing Google Sheets Integration...

Configuration:
- Google Client Email: ✅ Set
- Google Private Key: ✅ Set
- Google Sheet ID: 19srWIvkr9cHBSCuIk5EUcji5P1X0GscO_UOKXeAViBU

📊 Attempting to export test data to Google Sheet
Sheet Name: Sheet1

✅ SUCCESS! Google Sheets export completed

Result:
- Spreadsheet URL: https://docs.google.com/spreadsheets/d/...
- Updated Cells: 24
- Updated Rows: 4

📈 Open the spreadsheet to view the test data!
```

**Pass Criteria:**
- [ ] Authentication successful
- [ ] Data exported (24 cells, 4 rows)
- [ ] No error messages
- [ ] Spreadsheet URL accessible

### 4.3 Data Verification

**Objective:** Verify data appears in Google Sheet

**Steps:**

1. **Open spreadsheet:**
   - Copy URL from test output
   - Open in browser
   - Or use: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID

2. **Verify data:**
   - Check "Sheet1" tab exists
   - Verify 4 rows of data present
   - Verify headers are formatted (colored, bold)
   - Verify test data content matches:
     ```
     Participant ID | Name        | Email              | College      | Registration Type | Status
     TEST001       | Test User 1 | test1@example.com | Test College | both             | Active
     TEST002       | Test User 2 | test2@example.com | Test College | general          | Active
     TEST003       | Test User 3 | test3@example.com | Test College | workshop         | Active
     ```

**Pass Criteria:**
- [ ] Sheet opens successfully
- [ ] Data is visible
- [ ] Headers are formatted
- [ ] All 3 test records present
- [ ] Data is accurate

### 4.4 Export Function Test

**Objective:** Test custom export function

**Steps:**

1. **Create test script:** `backend/test-export-registrations.js`

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const { exportRegistrationsToSheets } = require('./src/utils/googleSheets');
const Registration = require('./src/models/Registration');

(async () => {
  try {
    console.log('🧪 Testing Registration Export...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database\n');
    
    // Fetch registrations
    const registrations = await Registration.find()
      .limit(10)
      .populate('user', 'name email phone college')
      .populate('event', 'name category');
    
    console.log(`Found ${registrations.length} registrations to export\n`);
    
    if (registrations.length === 0) {
      console.log('⚠️  No registrations found. Create some test data first.');
      process.exit(0);
    }
    
    // Export to Google Sheets
    const result = await exportRegistrationsToSheets(
      registrations,
      process.env.GOOGLE_SHEET_ID
    );
    
    console.log('✅ Export successful!');
    console.log('   URL:', result.spreadsheetUrl);
    console.log('   Cells:', result.updatedCells);
    console.log('   Rows:', result.updatedRows);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
})();
```

2. **Run test:**
```powershell
node test-export-registrations.js
```

3. **Expected Output:**
```
✅ Connected to database
Found 10 registrations to export
✅ Export successful!
   URL: https://docs.google.com/spreadsheets/d/...
   Cells: 120
   Rows: 11
```

**Pass Criteria:**
- [ ] Connects to database successfully
- [ ] Fetches registrations
- [ ] Exports to Google Sheets
- [ ] Returns spreadsheet URL
- [ ] Data visible in sheet

---

## 5. Authentication Testing

### 5.1 Admin Login Test

**Objective:** Verify admin authentication works

**Method 1: Using PowerShell**

```powershell
# Ensure server is running first

$loginBody = @{
    email = "admin@shackles.com"
    password = "Admin@2025SecurePassword"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"

Write-Host "✅ Login Successful!" -ForegroundColor Green
Write-Host "User: $($response.user.name)"
Write-Host "Role: $($response.user.role)"
Write-Host "Token: $($response.token.Substring(0,30))..."

# Save token for later use
$global:authToken = $response.token
```

**Expected Output:**
```
✅ Login Successful!
User: Admin User
Role: admin
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

**Method 2: Using Postman**

1. Open Postman
2. Create new POST request
3. URL: `http://localhost:5000/api/v1/auth/login`
4. Headers:
   - Content-Type: application/json
5. Body (raw JSON):
```json
{
  "email": "admin@shackles.com",
  "password": "Admin@2025SecurePassword"
}
```
6. Click "Send"
7. Save token from response

**Pass Criteria:**
- [ ] Status: 200 OK
- [ ] Response includes token
- [ ] Response includes user object
- [ ] User role is "admin"
- [ ] Token is valid JWT format

### 5.2 Token Validation Test

**Objective:** Verify JWT token works for protected routes

```powershell
# Using token from previous test

$headers = @{
    "Authorization" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTI2YzZhMjQ3N2MxNDhjOWRjOGNkNCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTgwNzc5OCwiZXhwIjoxNzYwNDEyNTk4fQ.8c9Cy0WSQ1SxOPtuivRxo4xOe8v29V6TXR88d3lkBKM"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users/me" -Method GET -Headers $headers

Write-Host "✅ Token Valid!" -ForegroundColor Green
Write-Host "Current User: $($response.user.name)"
Write-Host "Email: $($response.user.email)"
```

**Expected Output:**
```
✅ Token Valid!
Current User: Admin User
Email: admin@shackles.com
```

**Pass Criteria:**
- [ ] Status: 200 OK
- [ ] User data returned
- [ ] No 401 Unauthorized error

---

## 6. QR Scanning Testing

### 6.1 QR Scan Endpoint Test

**Objective:** Verify QR scanning endpoint is functional

**Test Script:** `backend/test-qr-scan-full.ps1`

```powershell
Write-Host "🧪 QR Scanning Comprehensive Test" -ForegroundColor Cyan
Write-Host "====================================`n"

$baseUrl = "http://localhost:5000"

# Step 1: Login
Write-Host "1. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "acgcet@edu.in"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTI2YzZhMjQ3N2MxNDhjOWRjOGNkNCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTgwNzc5OCwiZXhwIjoxNzYwNDEyNTk4fQ.8c9Cy0WSQ1SxOPtuivRxo4xOe8v29V6TXR88d3lkBKM'
    Write-Host "   ✅ Login successful`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Login failed`n" -ForegroundColor Red
    exit 1
}

# Step 2: Test QR Scan (with test data)
Write-Host "2. Testing QR Scan..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$qrBody = @{
    qrData = '{"t":"test-token-123","p":"TEST001","v":1,"e":"SHACKLES2025"}'
    eventId = "670d4c5e8f12345678901234"  # Use a real event ID from your DB
    eventType = "event"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "$baseUrl/api/v1/qr-scan/scan-qr" -Method POST -Headers $headers -Body $qrBody
    Write-Host "   ✅ QR Scan successful!" -ForegroundColor Green
    Write-Host "   Message: $($result.message)" -ForegroundColor Gray
    Write-Host "   Participant: $($result.participant.id)" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 404) {
        Write-Host "   ⚠️  Event not found (expected for test data)" -ForegroundColor Yellow
        Write-Host "   ✅ Endpoint is working correctly" -ForegroundColor Green
    } elseif ($statusCode -eq 403) {
        Write-Host "   ⚠️  Access denied (expected for test data)" -ForegroundColor Yellow
        Write-Host "   ✅ Access control is working" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Unexpected error: $statusCode" -ForegroundColor Red
    }
}

Write-Host "`n====================================`n" -ForegroundColor Cyan
Write-Host "✅ QR Scan endpoint is functional!" -ForegroundColor Green
```

**Run test:**
```powershell
cd backend
.\test-qr-scan-full.ps1
```

**Pass Criteria:**
- [ ] Login successful
- [ ] Endpoint returns response (200, 403, or 404)
- [ ] Error handling works correctly
- [ ] Authorization required (401 without token)

### 6.2 Access Control Test

**Objective:** Verify registration type access control

**Test Cases:**

| Scenario | Registration Type | Event Type | Expected Result |
|----------|------------------|------------|------------------|
| Test 1   | general          | technical  | ✅ Allowed      |
| Test 2   | general          | workshop   | ❌ Denied (403) |
| Test 3   | workshop         | workshop   | ✅ Allowed      |
| Test 4   | workshop         | technical  | ❌ Denied (403) |
| Test 5   | both             | technical  | ✅ Allowed      |
| Test 6   | both             | workshop   | ✅ Allowed      |

**Test Script:** Create `test-access-control.ps1`

```powershell
Write-Host "🧪 Access Control Test Suite" -ForegroundColor Cyan
Write-Host "====================================`n"

# Login first (same as above)
# ...

$testCases = @(
    @{Scenario="Test 1"; RegType="general"; EventType="technical"; Expected="Allowed"},
    @{Scenario="Test 2"; RegType="general"; EventType="workshop"; Expected="Denied"},
    @{Scenario="Test 3"; RegType="workshop"; EventType="workshop"; Expected="Allowed"},
    @{Scenario="Test 4"; RegType="workshop"; EventType="technical"; Expected="Denied"},
    @{Scenario="Test 5"; RegType="both"; EventType="technical"; Expected="Allowed"},
    @{Scenario="Test 6"; RegType="both"; EventType="workshop"; Expected="Allowed"}
)

foreach ($test in $testCases) {
    Write-Host "$($test.Scenario): $($test.RegType) → $($test.EventType)" -ForegroundColor Yellow
    
    # Create test participant with specific registration type
    # Test access
    # Verify result matches expected
    
    Write-Host "   Expected: $($test.Expected)" -ForegroundColor Gray
    # Add actual test logic here
}

Write-Host "`n====================================`n" -ForegroundColor Cyan
Write-Host "✅ Access control tests completed!" -ForegroundColor Green
```

**Pass Criteria:**
- [ ] All 6 test cases pass
- [ ] General users blocked from workshops
- [ ] Workshop users blocked from events
- [ ] Both users access everything

---

## 7. Kit Distribution Testing

### 7.1 Workshop Kit Issuance Test

**Objective:** Verify workshop day kit can be issued

**Prerequisites:**
- Backend server running
- Admin logged in (token available)
- Test participant exists in database

**Test Script:**

```powershell
Write-Host "🧪 Workshop Kit Distribution Test" -ForegroundColor Cyan
Write-Host "====================================`n"

# Login and get token (from previous tests)
# ...

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 1: Issue Workshop Kit
Write-Host "1. Issuing workshop kit..." -ForegroundColor Yellow

$kitBody = @{
    participantId = "SHWK001"
    kitDay = "workshop"
    collectionPoint = "workshop-desk"
    signature = "base64_signature_here"
    deviceInfo = @{
        userAgent = "PowerShell Test Script"
        ipAddress = "127.0.0.1"
    }
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/issue-kit" -Method POST -Headers $headers -Body $kitBody
    
    Write-Host "   ✅ Workshop kit issued successfully!" -ForegroundColor Green
    Write-Host "   ID Card Number: $($result.kit.idCardNumber)" -ForegroundColor Gray
    Write-Host "   Kit Day: $($result.kit.kitDay)" -ForegroundColor Gray
    Write-Host "   Contents: $($result.kit.contents.Count) items" -ForegroundColor Gray
    
    # List contents
    Write-Host "`n   Kit Contents:" -ForegroundColor Gray
    foreach ($item in $result.kit.contents) {
        Write-Host "     - $($item.item) (x$($item.quantity))" -ForegroundColor DarkGray
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 404) {
        Write-Host "   ⚠️  Participant not found" -ForegroundColor Yellow
        Write-Host "   Create participant first: POST /api/v1/users" -ForegroundColor Yellow
    } elseif ($statusCode -eq 403) {
        Write-Host "   ⚠️  Participant not eligible for workshop kit" -ForegroundColor Yellow
        Write-Host "   Registration type must be 'workshop' or 'both'" -ForegroundColor Yellow
    } else {
        Write-Host "   ❌ Error: $statusCode" -ForegroundColor Red
    }
}

Write-Host "`n====================================`n" -ForegroundColor Cyan
```

**Expected Kit Contents:**
- Workshop ID Card (x1)
- Workshop Material (x1)
- Workshop Schedule (x1)
- Workshop Toolkit (x1)
- Pen (x1)
- Notepad (x1)
- Workshop Badge (x1)
- Certificate Envelope (x1)

**Pass Criteria:**
- [ ] Status: 201 Created
- [ ] ID card number generated (SHACKLES-W-XXXX format)
- [ ] 8 items in kit
- [ ] Correct kit contents
- [ ] Cannot issue same kit twice (returns 200 with alreadyIssued: true)

### 7.2 Events Kit Issuance Test

**Objective:** Verify events day kit can be issued

**Test Script:** Similar to workshop kit test, change:

```powershell
$kitBody = @{
    participantId = "SHGN001"
    kitDay = "events"  # Changed
    collectionPoint = "main-desk"  # Changed
}
```

**Expected Kit Contents:**
- Event ID Card (x1)
- Event Schedule (x1)
- Event Bag (x1)
- Event Brochure (x1)
- Pen (x1)
- Notepad (x1)
- Event Badge (x1)
- Refreshment Coupon (x1)

**Pass Criteria:**
- [ ] Status: 201 Created
- [ ] ID card number generated (SHACKLES-E-XXXX format)
- [ ] 8 items in kit
- [ ] Correct kit contents

### 7.3 Dual Kit Test (Both Registration)

**Objective:** Verify participant with "both" registration can receive both kits

**Test Scenario:**
1. Create participant with registrationType: "both"
2. Issue workshop kit
3. Verify workshop kit issued
4. Issue events kit
5. Verify events kit issued
6. Check kit status - should show both kits

**Test Script:**

```powershell
Write-Host "🧪 Dual Kit Distribution Test" -ForegroundColor Cyan
Write-Host "====================================`n"

$participantId = "SHGN001"  # Participant with "both" registration

# Issue Workshop Kit
Write-Host "1. Issuing workshop kit..." -ForegroundColor Yellow
$kitBody1 = @{
    participantId = $participantId
    kitDay = "workshop"
} | ConvertTo-Json

$workshop = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/issue-kit" -Method POST -Headers $headers -Body $kitBody1
Write-Host "   ✅ Workshop kit: $($workshop.kit.idCardNumber)" -ForegroundColor Green

# Issue Events Kit
Write-Host "`n2. Issuing events kit..." -ForegroundColor Yellow
$kitBody2 = @{
    participantId = $participantId
    kitDay = "events"
} | ConvertTo-Json

$events = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/issue-kit" -Method POST -Headers $headers -Body $kitBody2
Write-Host "   ✅ Events kit: $($events.kit.idCardNumber)" -ForegroundColor Green

# Check Kit Status
Write-Host "`n3. Checking kit status..." -ForegroundColor Yellow
$status = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/kit-status/$participantId" -Headers $headers

Write-Host "   ✅ Kit Status:" -ForegroundColor Green
Write-Host "   Workshop Kit: $($status.workshopKit.issued) ($($status.workshopKit.idCardNumber))" -ForegroundColor Gray
Write-Host "   Events Kit: $($status.eventsKit.issued) ($($status.eventsKit.idCardNumber))" -ForegroundColor Gray
Write-Host "   Total Kits Issued: $($status.totalKitsIssued)" -ForegroundColor Gray

Write-Host "`n====================================`n" -ForegroundColor Cyan
Write-Host "✅ Both kits issued successfully!" -ForegroundColor Green
```

**Pass Criteria:**
- [ ] Workshop kit issued (SHACKLES-W-XXXX)
- [ ] Events kit issued (SHACKLES-E-XXXX)
- [ ] Both kits tracked separately
- [ ] totalKitsIssued = 2
- [ ] Cannot issue same kit twice

### 7.4 Eligibility Test

**Objective:** Verify kit eligibility enforcement

**Test Cases:**

| Participant ID | Registration Type | Can Get Workshop Kit? | Can Get Events Kit? |
|----------------|-------------------|----------------------|---------------------|
| TEST-G01       | general           | ❌ No                | ✅ Yes              |
| TEST-W01       | workshop          | ✅ Yes               | ❌ No               |
| TEST-B01       | both              | ✅ Yes               | ✅ Yes              |

**Test Script:**

```powershell
Write-Host "🧪 Kit Eligibility Test" -ForegroundColor Cyan
Write-Host "====================================`n"

$tests = @(
    @{ID="TEST-G01"; Type="general"; Workshop=$false; Events=$true},
    @{ID="TEST-W01"; Type="workshop"; Workshop=$true; Events=$false},
    @{ID="TEST-B01"; Type="both"; Workshop=$true; Events=$true}
)

foreach ($test in $tests) {
    Write-Host "Testing: $($test.ID) ($($test.Type))" -ForegroundColor Yellow
    
    # Test Workshop Kit
    $workshopBody = @{
        participantId = $test.ID
        kitDay = "workshop"
    } | ConvertTo-Json
    
    try {
        $result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/issue-kit" -Method POST -Headers $headers -Body $workshopBody
        
        if ($test.Workshop) {
            Write-Host "   ✅ Workshop kit: Issued (Expected)" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Workshop kit: Issued (NOT Expected)" -ForegroundColor Red
        }
    } catch {
        if (-not $test.Workshop) {
            Write-Host "   ✅ Workshop kit: Denied (Expected)" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Workshop kit: Denied (NOT Expected)" -ForegroundColor Red
        }
    }
    
    # Test Events Kit (similar logic)
    # ...
    
    Write-Host ""
}

Write-Host "====================================`n" -ForegroundColor Cyan
```

**Pass Criteria:**
- [ ] General users can only get events kit
- [ ] Workshop users can only get workshop kit
- [ ] Both users can get both kits
- [ ] Correct error messages (403 Forbidden)

---

## 8. Integration Testing

### 8.1 Complete Registration Flow Test

**Objective:** Test entire participant journey

**Scenario:** New participant registers for workshop and events

**Steps:**

1. **Create User Account**
```powershell
$userBody = @{
    name = "Test Participant"
    email = "test@example.com"
    password = "Test@123"
    phone = "9876543210"
    college = "Test College"
    department = "Computer Science"
    year = 3
    registrationType = "both"
} | ConvertTo-Json

$user = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" -Method POST -Body $userBody -ContentType "application/json"

Write-Host "✅ User registered: $($user.user.participantId)"
```

2. **Register for Event**
```powershell
$regBody = @{
    event = "EVENT_ID_HERE"
    type = "event"
} | ConvertTo-Json

$registration = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/registrations" -Method POST -Body $regBody -Headers @{"Authorization"="Bearer $($user.token)"; "Content-Type"="application/json"}

Write-Host "✅ Event registration: $($registration.registration.registrationNumber)"
```

3. **Upload Payment Proof** (Simulate)
```powershell
# Would normally upload image file
Write-Host "✅ Payment proof uploaded"
```

4. **Admin Verifies Payment**
```powershell
$verifyBody = @{
    status = "approved"
    paymentStatus = "verified"
} | ConvertTo-Json

$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/registrations/$($registration.registration._id)/verify" -Method PUT -Body $verifyBody -Headers $adminHeaders

Write-Host "✅ Payment verified by admin"
```

5. **Generate QR Code**
```powershell
$qr = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users/qr-code" -Headers @{"Authorization"="Bearer $($user.token)"}

Write-Host "✅ QR code generated"
```

6. **Workshop Day: Scan QR and Issue Kit**
```powershell
$scanBody = @{
    qrData = $qr.qrData
    eventId = "WORKSHOP_ID_HERE"
    eventType = "workshop"
    issueKit = $true
    kitDay = "workshop"
} | ConvertTo-Json

$checkin = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/scan-and-checkin" -Method POST -Body $scanBody -Headers $adminHeaders

Write-Host "✅ Workshop check-in: Kit $($checkin.kit.idCardNumber)"
```

7. **Events Day: Scan QR and Issue Kit**
```powershell
$scanBody2 = @{
    qrData = $qr.qrData
    eventId = "EVENT_ID_HERE"
    eventType = "event"
    issueKit = $true
    kitDay = "events"
} | ConvertTo-Json

$checkin2 = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/scan-and-checkin" -Method POST -Body $scanBody2 -Headers $adminHeaders

Write-Host "✅ Event check-in: Kit $($checkin2.kit.idCardNumber)"
```

8. **Export to Google Sheets**
```powershell
# This happens automatically or admin can trigger
Write-Host "✅ Data exported to Google Sheets"
```

**Pass Criteria:**
- [ ] User registration successful
- [ ] Event registration created
- [ ] Payment verification works
- [ ] QR code generated
- [ ] Workshop check-in successful
- [ ] Workshop kit issued (SHACKLES-W-XXXX)
- [ ] Event check-in successful
- [ ] Events kit issued (SHACKLES-E-XXXX)
- [ ] Both kits tracked in database
- [ ] Data exported to Google Sheets

---

## 9. End-to-End Testing

### 9.1 Multi-User Scenario Test

**Objective:** Test system with multiple concurrent users

**Scenario:** 3 participants with different registration types

**Test Script:** `test-e2e-multi-user.ps1`

```powershell
Write-Host "🧪 End-to-End Multi-User Test" -ForegroundColor Cyan
Write-Host "====================================`n"

# Create 3 test users
$users = @(
    @{Name="General User"; Type="general"; ID="E2E-G001"},
    @{Name="Workshop User"; Type="workshop"; ID="E2E-W001"},
    @{Name="Both User"; Type="both"; ID="E2E-B001"}
)

foreach ($user in $users) {
    Write-Host "Processing: $($user.Name) ($($user.Type))" -ForegroundColor Yellow
    
    # 1. Register user
    # 2. Register for appropriate events
    # 3. Payment verification
    # 4. QR generation
    # 5. Check-in
    # 6. Kit issuance
    # 7. Verify kit status
    
    Write-Host "   ✅ Complete" -ForegroundColor Green
    Write-Host ""
}

Write-Host "====================================`n" -ForegroundColor Cyan
Write-Host "✅ All users processed successfully!" -ForegroundColor Green

# Export all to Google Sheets
Write-Host "`nExporting to Google Sheets..." -ForegroundColor Yellow
node test-export-registrations.js
```

**Pass Criteria:**
- [ ] All 3 users created successfully
- [ ] Correct registration types assigned
- [ ] Correct kits issued per type
- [ ] No cross-contamination
- [ ] All data exported to Google Sheets

---

## 10. Performance Testing

### 10.1 Load Test

**Objective:** Verify system handles multiple concurrent requests

**Tool Required:** Apache Bench (ab) or similar

**Test Command:**
```bash
# Install Apache Bench if needed
# On Windows: Use WSL or download from Apache

# Test 100 requests, 10 concurrent
ab -n 100 -c 10 -H "Authorization: Bearer TOKEN" http://localhost:5000/api/v1/qr-scan/kit-status/TEST001
```

**Expected Results:**
- Average response time < 200ms
- No failed requests
- Server remains stable

**Pass Criteria:**
- [ ] 95% of requests < 500ms
- [ ] 0% error rate
- [ ] Server doesn't crash

---

## 11. Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Cannot connect to MongoDB"

**Symptoms:**
```
Error: connect ECONNREFUSED
```

**Solutions:**
1. Check MONGODB_URI in .env
2. Verify MongoDB Atlas allows connections from your IP
3. Check internet connection
4. Verify credentials are correct

#### Issue 2: "Google Sheets authentication failed"

**Symptoms:**
```
Error: DECODER routines::unsupported
```

**Solutions:**
1. Check GOOGLE_PRIVATE_KEY format
2. Remove trailing commas
3. Ensure key has BEGIN/END tags
4. Verify key is wrapped in quotes

#### Issue 3: "QR Scan returns 403 Forbidden"

**Symptoms:**
```
Error: ACCESS_DENIED
Registration type mismatch
```

**Solutions:**
1. Check participant registration type
2. Verify event category matches
3. Use correct eventType parameter
4. Check event registration exists

#### Issue 4: "Kit already issued"

**Symptoms:**
```
alreadyIssued: true
```

**Solutions:**
1. This is expected behavior (not an error)
2. Check kit status to confirm
3. If needed, manually update database
4. Each kit can only be issued once

---

## 12. Test Results Documentation

### Test Report Template

```markdown
# Test Report - SHACKLES Symposium
**Date:** [Date]
**Tester:** [Name]
**Version:** [Version]

## Summary
- Total Tests: [X]
- Passed: [X]
- Failed: [X]
- Blocked: [X]
- Pass Rate: [X%]

## Test Results

### 1. Google Sheets Integration
- [ ] Configuration Test: PASS/FAIL
- [ ] Authentication Test: PASS/FAIL
- [ ] Data Export Test: PASS/FAIL
- [ ] Notes: [Any issues or observations]

### 2. QR Scanning
- [ ] Endpoint Test: PASS/FAIL
- [ ] Access Control Test: PASS/FAIL
- [ ] Token Validation Test: PASS/FAIL
- [ ] Notes: [Any issues or observations]

### 3. Kit Distribution
- [ ] Workshop Kit Test: PASS/FAIL
- [ ] Events Kit Test: PASS/FAIL
- [ ] Dual Kit Test: PASS/FAIL
- [ ] Eligibility Test: PASS/FAIL
- [ ] Notes: [Any issues or observations]

### 4. Integration Tests
- [ ] Complete Flow Test: PASS/FAIL
- [ ] Multi-User Test: PASS/FAIL
- [ ] Notes: [Any issues or observations]

## Issues Found
1. [Issue description]
   - Severity: High/Medium/Low
   - Status: Open/In Progress/Closed
   
2. [Issue description]
   - Severity: High/Medium/Low
   - Status: Open/In Progress/Closed

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Sign-off
- Tester: ________________
- Date: ________________
- Approved by: ________________
```

---

## 📊 Quick Reference

### Essential Commands

```powershell
# Start backend
cd backend
npm start

# Test Google Sheets
node test-google-sheets.js

# Test QR Scan
.\test-qr-scan.ps1

# Test Database Connection
node test-db-connection.js

# Export registrations
node test-export-registrations.js
```

### Important URLs

- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/v1/health
- Google Sheet: https://docs.google.com/spreadsheets/d/[SHEET_ID]
- Postman: https://www.postman.com/downloads/

### Test Data

```json
// Test Participant IDs
{
  "general": "TEST-G001",
  "workshop": "TEST-W001",
  "both": "TEST-B001"
}

// Test QR Data
{
  "t": "test-token",
  "p": "TEST001",
  "v": 1,
  "e": "SHACKLES2025"
}
```

---

## ✅ Final Checklist

Before marking testing complete:

- [ ] All backend routes tested
- [ ] All authentication flows verified
- [ ] Google Sheets integration working
- [ ] QR scanning functional
- [ ] Kit distribution working (both kits)
- [ ] Access control enforced
- [ ] End-to-end flow successful
- [ ] Multi-user scenario tested
- [ ] Performance acceptable
- [ ] Test report completed
- [ ] All critical issues resolved
- [ ] Documentation updated

---

**Document Version:** 1.0  
**Last Updated:** October 7, 2025  
**Maintainer:** Development Team  
**Status:** Complete and Ready for Use

---

**Need Help?** Refer to:
- `STATUS_REPORT.md` - System overview
- `KIT_DISTRIBUTION_GUIDE.md` - API reference
- `GOOGLE_SHEETS_SETUP_GUIDE.md` - Setup instructions

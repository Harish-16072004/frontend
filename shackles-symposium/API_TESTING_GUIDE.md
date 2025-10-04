# 🧪 API Testing Guide - SHACKLES 2025

## ✅ Your Servers Are Running!

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

---

## 📋 Required Fields for Registration

The User model requires these fields:
- `name` (string, max 100 chars)
- `email` (valid email format)
- `phone` (10 digits)
- `password` (min 6 characters)
- `college` (string)
- `department` (string)
- `year` (string: '1', '2', '3', or '4') ⚠️ **REQUIRED**
- `rollNumber` (optional)

---

## 🧪 Test Commands

### ✅ Test 1: Health Check
```powershell
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "SHACKLES Backend API is running!",
  "environment": "development"
}
```

---

### ✅ Test 2: Register User (PowerShell)

**Create a test file** `test-register.json`:
```json
{
  "name": "Harish J",
  "email": "harish@test.com",
  "password": "test123",
  "phone": "9876543210",
  "college": "ACGCET",
  "department": "Mechanical Engineering",
  "year": "3"
}
```

**Then run:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" -Method Post -ContentType "application/json" -InFile "test-register.json"
```

**Or use this one-liner (copy the entire command):**
```powershell
$body = @{
    name = "Harish J"
    email = "harish@test.com"
    password = "test123"
    phone = "9876543210"
    college = "ACGCET"
    department = "Mechanical Engineering"
    year = "3"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" -Method Post -ContentType "application/json" -Body $body
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Harish J",
    "email": "harish@test.com",
    "role": "user"
  }
}
```

---

### ✅ Test 3: Login

```powershell
$body = @{
    email = "harish@test.com"
    password = "test123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body $body
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Harish J",
    "email": "harish@test.com",
    "role": "user"
  }
}
```

---

### ✅ Test 4: Get Current User (Protected Route)

**First, save the token from login:**
```powershell
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{email="harish@test.com";password="test123"} | ConvertTo-Json)
$token = $loginResponse.token

# Now get current user
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/me" -Method Get -Headers $headers
```

---

## 🌐 Browser Testing

### Open Frontend:
```
http://localhost:3000
```

### Test Registration in Browser:
1. Navigate to registration page
2. Fill in the form:
   - Name: Harish J
   - Email: harish@test.com
   - Password: test123
   - Phone: 9876543210
   - College: ACGCET
   - Department: Mechanical Engineering
   - Year: 3 (or select from dropdown)
3. Submit and check browser console for API response

---

## 📊 Sample Test Data

### User 1 (Admin):
```json
{
  "name": "Admin User",
  "email": "admin@shackles.com",
  "password": "admin123",
  "phone": "9999999999",
  "college": "ACGCET",
  "department": "Administration",
  "year": "4",
  "role": "admin"
}
```

### User 2 (Regular User):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "john123",
  "phone": "9876543210",
  "college": "Sample College",
  "department": "Computer Science",
  "year": "2"
}
```

### User 3 (Different Year):
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "jane123",
  "phone": "8765432109",
  "college": "Tech Institute",
  "department": "Electronics",
  "year": "1"
}
```

---

## 🐛 Common Errors & Solutions

### Error: "Please provide year"
**Solution:** Add `"year": "3"` to your request body (must be '1', '2', '3', or '4')

### Error: "User already exists"
**Solution:** Use a different email address or delete the existing user from database

### Error: "Please provide a valid 10-digit phone number"
**Solution:** Phone must be exactly 10 digits (no spaces, dashes, or country code)

### Error: "Please provide a valid email"
**Solution:** Email must be in format: user@domain.com

### Error: "Password must be at least 6 characters"
**Solution:** Use a password with 6 or more characters

### Error: "CORS error" in browser
**Solution:** Make sure backend is running and FRONTEND_URL is set to http://localhost:3000

---

## 🔧 Testing with Postman

If you prefer Postman:

1. **Method**: POST
2. **URL**: http://localhost:5000/api/v1/auth/register
3. **Headers**: 
   - Content-Type: application/json
4. **Body** (raw JSON):
```json
{
  "name": "Harish J",
  "email": "harish@test.com",
  "password": "test123",
  "phone": "9876543210",
  "college": "ACGCET",
  "department": "Mechanical Engineering",
  "year": "3"
}
```

---

## 📝 Quick Test Script

**Save this as `test-api.ps1`:**

```powershell
# Test API Endpoints

Write-Host "Testing SHACKLES 2025 Backend API" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health"
    Write-Host "✅ Health Check: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed" -ForegroundColor Red
    exit
}

# Test 2: Register User
Write-Host "`n2. Testing User Registration..." -ForegroundColor Yellow
$registerBody = @{
    name = "Test User $(Get-Random)"
    email = "test$(Get-Random)@example.com"
    password = "test123"
    phone = "$(Get-Random -Minimum 6000000000 -Maximum 9999999999)"
    college = "Test College"
    department = "Test Department"
    year = "2"
} | ConvertTo-Json

try {
    $register = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" -Method Post -ContentType "application/json" -Body $registerBody
    Write-Host "✅ User Registered: $($register.user.name)" -ForegroundColor Green
    $token = $register.token
} catch {
    Write-Host "❌ Registration Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Current User
if ($token) {
    Write-Host "`n3. Testing Get Current User (Protected)..." -ForegroundColor Yellow
    $headers = @{ "Authorization" = "Bearer $token" }
    try {
        $me = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/me" -Method Get -Headers $headers
        Write-Host "✅ Current User: $($me.data.email)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Get User Failed" -ForegroundColor Red
    }
}

Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "API Testing Complete!" -ForegroundColor Cyan
```

**Run it:**
```powershell
.\test-api.ps1
```

---

## ✅ You're All Set!

Your backend is working perfectly! The error you saw was just missing the `year` field.

**Use the commands above to test your API.**

**Frontend is ready at:** http://localhost:3000

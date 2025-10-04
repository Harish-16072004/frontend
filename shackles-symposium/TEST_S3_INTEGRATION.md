# 🧪 Test S3 Integration

## Quick Test Script

Run this after setting up S3 credentials in your `.env` file.

### Prerequisites:
1. ✅ S3 bucket created
2. ✅ IAM user with access keys
3. ✅ `.env` file updated with credentials

---

## PowerShell Test Script

Save this as `test-s3.ps1`:

```powershell
# Test S3 Integration for SHACKLES Backend

Write-Host "`n🧪 Testing S3 Integration..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Test 1: Check if backend is running
Write-Host "`n1. Checking backend server..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health"
    Write-Host "   ✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend is not running!" -ForegroundColor Red
    Write-Host "   Please start backend: cd backend; npm run dev" -ForegroundColor Yellow
    exit
}

# Test 2: Login and get token
Write-Host "`n2. Logging in..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "harish@test.com"
        password = "test123"
    } | ConvertTo-Json
    
    $login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    $token = $login.token
    Write-Host "   ✅ Login successful" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Login failed!" -ForegroundColor Red
    exit
}

# Test 3: Create a test image file
Write-Host "`n3. Creating test image..." -ForegroundColor Yellow
$testImagePath = "test-upload.txt"
"This is a test file for S3 upload - SHACKLES 2025" | Out-File -FilePath $testImagePath -Encoding ASCII
Write-Host "   ✅ Test file created: $testImagePath" -ForegroundColor Green

# Test 4: Upload file to S3 (using your API endpoint)
Write-Host "`n4. Uploading file to S3..." -ForegroundColor Yellow
Write-Host "   (This will test if your S3 credentials are correct)" -ForegroundColor Gray

# Note: You'll need to implement the upload endpoint first
# The test will be ready once you have the endpoint

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Complete S3 setup in AWS Console" -ForegroundColor White
Write-Host "   2. Add credentials to backend/.env" -ForegroundColor White
Write-Host "   3. Restart backend server" -ForegroundColor White
Write-Host "   4. Run upload test" -ForegroundColor White
Write-Host "`n================================" -ForegroundColor Cyan
```

---

## Check Your .env Configuration

### Required S3 Environment Variables:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIA...              # Your access key from IAM
AWS_SECRET_ACCESS_KEY=wJalrXUt...     # Your secret key from IAM
AWS_REGION=ap-south-1                  # Your bucket region
AWS_S3_BUCKET_NAME=shackles-symposium-2025  # Your bucket name
```

---

## Manual Test: Upload File via Backend

### Step 1: Check if S3 util is working

Open: `backend/src/utils/s3Upload.js`

This file should have the upload functions.

### Step 2: Test with curl

```powershell
# First, login to get token
$login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{email="harish@test.com";password="test123"} | ConvertTo-Json)
$token = $login.token

# Then upload a file (once endpoint is ready)
# This is an example - actual endpoint may differ
Write-Host "Token: $token"
```

---

## Verify S3 Setup Checklist

Run through this checklist:

```powershell
Write-Host "`n🔍 S3 Configuration Checklist" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check .env file
Write-Host "`n1. Checking .env file..." -ForegroundColor Yellow
$envPath = ".\backend\.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    if ($envContent -match "AWS_ACCESS_KEY_ID=AKIA") {
        Write-Host "   ✅ AWS_ACCESS_KEY_ID found" -ForegroundColor Green
    } else {
        Write-Host "   ❌ AWS_ACCESS_KEY_ID not configured" -ForegroundColor Red
    }
    
    if ($envContent -match "AWS_SECRET_ACCESS_KEY=") {
        Write-Host "   ✅ AWS_SECRET_ACCESS_KEY found" -ForegroundColor Green
    } else {
        Write-Host "   ❌ AWS_SECRET_ACCESS_KEY not configured" -ForegroundColor Red
    }
    
    if ($envContent -match "AWS_S3_BUCKET_NAME=") {
        Write-Host "   ✅ AWS_S3_BUCKET_NAME found" -ForegroundColor Green
    } else {
        Write-Host "   ❌ AWS_S3_BUCKET_NAME not configured" -ForegroundColor Red
    }
    
    if ($envContent -match "AWS_REGION=") {
        Write-Host "   ✅ AWS_REGION found" -ForegroundColor Green
    } else {
        Write-Host "   ❌ AWS_REGION not configured" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ .env file not found!" -ForegroundColor Red
}

Write-Host "`n================================" -ForegroundColor Cyan
```

---

## Test S3 Configuration (Node.js Script)

Create `backend/test-s3-connection.js`:

```javascript
require('dotenv').config();
const AWS = require('aws-sdk');

console.log('\n🧪 Testing AWS S3 Connection...\n');

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Test 1: List buckets
console.log('1. Testing AWS credentials...');
s3.listBuckets((err, data) => {
  if (err) {
    console.error('   ❌ Error:', err.message);
    console.log('\n   Check your credentials in .env file!');
  } else {
    console.log('   ✅ AWS credentials are valid!');
    console.log('   Available buckets:', data.Buckets.map(b => b.Name).join(', '));
  }
});

// Test 2: Check specific bucket
const bucketName = process.env.AWS_S3_BUCKET_NAME;
console.log(`\n2. Checking bucket: ${bucketName}...`);

s3.headBucket({ Bucket: bucketName }, (err, data) => {
  if (err) {
    console.error('   ❌ Error:', err.message);
    console.log('\n   Make sure bucket exists and name is correct!');
  } else {
    console.log('   ✅ Bucket exists and is accessible!');
  }
});

// Test 3: List objects in bucket
setTimeout(() => {
  console.log(`\n3. Listing objects in bucket...`);
  s3.listObjectsV2({ Bucket: bucketName, MaxKeys: 10 }, (err, data) => {
    if (err) {
      console.error('   ❌ Error:', err.message);
    } else {
      console.log(`   ✅ Found ${data.KeyCount} objects`);
      if (data.Contents.length > 0) {
        console.log('   Files:', data.Contents.map(obj => obj.Key).join(', '));
      }
    }
    
    console.log('\n================================');
    console.log('✅ S3 Connection Test Complete!');
    console.log('================================\n');
  });
}, 2000);
```

### Run the test:

```powershell
cd backend
node test-s3-connection.js
```

---

## Expected Output (Success):

```
🧪 Testing AWS S3 Connection...

1. Testing AWS credentials...
   ✅ AWS credentials are valid!
   Available buckets: shackles-symposium-2025

2. Checking bucket: shackles-symposium-2025...
   ✅ Bucket exists and is accessible!

3. Listing objects in bucket...
   ✅ Found 0 objects

================================
✅ S3 Connection Test Complete!
================================
```

---

## Common Errors & Solutions

### Error: "InvalidAccessKeyId"
```
Solution: Check AWS_ACCESS_KEY_ID in .env file
- Make sure it starts with "AKIA"
- No extra spaces or quotes
```

### Error: "SignatureDoesNotMatch"
```
Solution: Check AWS_SECRET_ACCESS_KEY in .env file
- Make sure it's the correct secret key
- No extra spaces or quotes
```

### Error: "NoSuchBucket"
```
Solution: Check AWS_S3_BUCKET_NAME in .env file
- Make sure bucket name is correct
- Bucket name is case-sensitive
```

### Error: "AccessDenied"
```
Solution: Check IAM user permissions
- Go to IAM console
- Make sure user has AmazonS3FullAccess policy
```

---

## 🎯 Quick Setup Summary

1. **Create AWS Account** (10 min)
2. **Create S3 Bucket** (5 min)
3. **Configure Bucket Policy** (2 min)
4. **Configure CORS** (2 min)
5. **Create IAM User** (5 min)
6. **Generate Access Keys** (2 min)
7. **Update .env file** (1 min)
8. **Test Connection** (1 min)

**Total Time: ~30 minutes** ⏱️

---

**Ready to test your S3 setup? Follow the steps above!** 🚀

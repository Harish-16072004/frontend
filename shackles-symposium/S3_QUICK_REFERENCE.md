# 🪣 S3 Setup - Quick Reference

## 📚 I've Created 3 Guides for You:

1. **AWS_S3_SETUP_GUIDE.md** - Complete step-by-step setup (30 min)
2. **TEST_S3_INTEGRATION.md** - Testing scripts and verification
3. **test-s3-connection.js** - Automated test script

---

## ⚡ Quick Setup Steps

### 1️⃣ Create AWS Account (10 min)
- Go to: https://aws.amazon.com/
- Sign up (free tier - no charges for first 12 months)
- Add payment method (required but won't be charged if within free tier)

### 2️⃣ Create S3 Bucket (5 min)
- Go to AWS Console → S3
- Click "Create bucket"
- Name: `shackles-symposium-2025` (or similar, must be unique)
- Region: `ap-south-1` (Asia Pacific - Mumbai)
- **Uncheck** "Block all public access"
- Create bucket

### 3️⃣ Configure Bucket Policy (2 min)
- Go to bucket → Permissions → Bucket policy
- Paste this policy (replace bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

### 4️⃣ Configure CORS (2 min)
- Go to bucket → Permissions → CORS
- Paste this:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 5️⃣ Create IAM User (5 min)
- Go to IAM → Users → Create user
- Name: `shackles-s3-user`
- Attach policy: `AmazonS3FullAccess`
- Create user

### 6️⃣ Generate Access Keys (2 min)
- Click on user → Security credentials
- Create access key
- Use case: "Application outside AWS"
- **Download the .csv file!** (You can't see secret key again)

### 7️⃣ Update .env File (1 min)

Open: `backend/.env`

Add these lines:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIA...              # From CSV file
AWS_SECRET_ACCESS_KEY=wJalrXUt...     # From CSV file
AWS_REGION=ap-south-1                  # Your bucket region
AWS_S3_BUCKET_NAME=shackles-symposium-2025  # Your bucket name
```

### 8️⃣ Test Connection (1 min)

```powershell
cd backend
node test-s3-connection.js
```

---

## ✅ Expected Output (Success):

```
🧪 Testing AWS S3 Connection...
================================

Configuration:
  Access Key: AKIA1234...
  Secret Key: ***xyz
  Region: ap-south-1
  Bucket: shackles-symposium-2025

Test 1: Verifying AWS credentials...
   ✅ AWS credentials are valid!
   📦 Available buckets:
      👉 shackles-symposium-2025

Test 2: Checking bucket "shackles-symposium-2025"...
   ✅ Bucket exists and is accessible!

Test 3: Listing objects in bucket...
   ✅ Successfully connected to bucket!
   📊 Objects found: 0
   📭 Bucket is empty (this is normal for new buckets)

================================
✅ S3 Connection Test Complete!
================================

✨ Your S3 is ready to use!
```

---

## 🎯 What Each File Does in Your Project

### 📁 Folder Structure in S3:
```
shackles-symposium-2025/
├── profiles/        → User profile pictures
├── events/          → Event images/posters
├── workshops/       → Workshop materials
├── documents/       → Registration documents
├── qrcodes/         → Generated QR codes
└── pdfs/            → Generated PDF tickets
```

### 🔧 Backend Files:
```
backend/
├── src/
│   ├── config/
│   │   └── aws.js              → AWS SDK configuration
│   └── utils/
│       └── s3Upload.js         → S3 upload/delete functions
└── test-s3-connection.js       → Test script (NEW!)
```

---

## 💰 AWS Free Tier Limits

### What You Get FREE (12 months):
- ✅ **5 GB** storage
- ✅ **20,000** GET requests
- ✅ **2,000** PUT requests
- ✅ **100 GB** data transfer out

### Your Project Usage (Estimated):
- 1000 users × 100 KB = **100 MB**
- 50 events × 500 KB = **25 MB**
- 1000 QR codes × 10 KB = **10 MB**
- 1000 PDFs × 50 KB = **50 MB**

**Total: ~185 MB** ← Well within 5 GB! 🎉

---

## 🆘 Common Errors

### ❌ "InvalidAccessKeyId"
**Solution:** Check `AWS_ACCESS_KEY_ID` in .env
- Should start with "AKIA"
- No extra spaces

### ❌ "SignatureDoesNotMatch"
**Solution:** Check `AWS_SECRET_ACCESS_KEY` in .env
- Copy exactly from CSV file
- No extra spaces or quotes

### ❌ "NoSuchBucket"
**Solution:** Check `AWS_S3_BUCKET_NAME` in .env
- Must match exactly (case-sensitive)
- Bucket must exist in AWS

### ❌ "AccessDenied"
**Solution:** Check IAM permissions
- User needs `AmazonS3FullAccess` policy
- Bucket policy must allow public read

---

## 🧪 Test Upload (After Setup)

### Test 1: Manual Upload
1. Go to S3 Console
2. Open your bucket
3. Click "Upload"
4. Upload a test image
5. Copy Object URL
6. Open in browser → Should see image!

### Test 2: Via Backend API
```powershell
# Will test once upload endpoint is ready
$login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{email="harish@test.com";password="test123"} | ConvertTo-Json)
$token = $login.token
Write-Host "Ready to test uploads with token: $token"
```

---

## 🚀 Next Steps After S3 Setup

1. ✅ Complete AWS account setup
2. ✅ Create S3 bucket
3. ✅ Configure bucket policy & CORS
4. ✅ Create IAM user & access keys
5. ✅ Update backend/.env
6. ✅ Run `node test-s3-connection.js`
7. ✅ Test manual file upload
8. ✅ Restart backend server
9. ✅ Test file upload through API
10. ✅ Test profile picture upload in frontend

---

## 💡 Alternative: Cloudinary (Easier)

If AWS seems complex, use **Cloudinary** instead:

### Pros:
- ✅ Setup in 5 minutes
- ✅ No credit card required
- ✅ 25 GB free storage
- ✅ Built-in image transformations

### Setup:
1. Sign up: https://cloudinary.com/users/register/free
2. Get credentials from dashboard
3. Update .env:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 📊 Monitoring Your Usage

### Set Up Billing Alerts:
1. Go to AWS Console → Billing
2. Click "Billing preferences"
3. Enable "Receive Free Tier Usage Alerts"
4. Add email
5. Set alert: "Alert when charges > $1"

---

## 🎓 Learning Resources

- **AWS S3 Docs:** https://docs.aws.amazon.com/s3/
- **Free Tier Details:** https://aws.amazon.com/free/
- **IAM Best Practices:** https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html

---

## 🔒 Security Checklist

- [ ] ✅ Access keys stored in .env (not in code)
- [ ] ✅ .env added to .gitignore
- [ ] ✅ Using IAM user (not root account)
- [ ] ✅ IAM user has only S3 permissions
- [ ] ✅ Bucket policy allows only GetObject (read-only for public)
- [ ] ✅ CORS configured for your frontend domain
- [ ] ✅ Encryption enabled on bucket
- [ ] ✅ Billing alerts set up

---

## 📞 Need Help?

If you get stuck at any step:

1. **Check AWS_S3_SETUP_GUIDE.md** for detailed instructions
2. **Run test-s3-connection.js** to diagnose issues
3. **Check TEST_S3_INTEGRATION.md** for troubleshooting

---

**Ready to set up S3? Start with Step 1 above!** 🚀

**Total Setup Time: ~30 minutes** ⏱️

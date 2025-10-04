# 🪣 AWS S3 Bucket Setup Guide - SHACKLES 2025

## 📋 What is S3 and Why Do You Need It?

**Amazon S3 (Simple Storage Service)** is cloud storage for files.

### In Your Project, S3 is Used For:
- 📸 **User Profile Pictures**
- 🎫 **Event Images/Posters**
- 📄 **Registration Documents**
- 🎨 **Workshop Materials**
- 📊 **Generated PDFs/QR Codes**

---

## 🚀 Step-by-Step S3 Bucket Creation

### Step 1: Create AWS Account

1. **Go to AWS:**
   ```
   https://aws.amazon.com/
   ```

2. **Click "Create an AWS Account"**

3. **Fill in Details:**
   - Email address
   - Password
   - AWS account name (e.g., "Shackles2025")

4. **Contact Information:**
   - Select "Personal" account
   - Full name
   - Phone number
   - Country
   - Address

5. **Payment Information:**
   - Add credit/debit card
   - ⚠️ **Don't worry**: Free tier gives you 5GB storage free for 12 months!

6. **Identity Verification:**
   - Phone verification (OTP)

7. **Select Support Plan:**
   - Choose **"Basic support - Free"**

8. **Wait for Account Activation:**
   - Usually takes 5-10 minutes
   - You'll get a confirmation email

---

### Step 2: Sign in to AWS Console

1. **Go to AWS Console:**
   ```
   https://console.aws.amazon.com/
   ```

2. **Sign in** with your email and password

3. **You'll see the AWS Management Console**

---

### Step 3: Create S3 Bucket

1. **Search for S3:**
   - In the top search bar, type "S3"
   - Click on "S3" service

2. **Click "Create bucket"** (Orange button)

3. **Bucket Settings:**

   **General Configuration:**
   ```
   Bucket name: shackles-symposium-2025
   (Must be globally unique, lowercase, no spaces)
   ```
   
   Alternative names if taken:
   - `shackles-2025-acgcet`
   - `shackles-symposium-files`
   - `shackles-event-storage`

   **AWS Region:**
   ```
   Select: Asia Pacific (Mumbai) ap-south-1
   (Choose closest to your location for faster uploads)
   ```

4. **Object Ownership:**
   - Select: **"ACLs disabled (recommended)"**

5. **Block Public Access settings:**
   
   ⚠️ **IMPORTANT FOR YOUR PROJECT:**
   
   **Uncheck** "Block all public access"
   
   Then check these boxes:
   - ✅ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ✅ Block public access to buckets and objects granted through any access control lists (ACLs)
   - ⬜ Block public access to buckets and objects granted through new public bucket or access point policies
   - ⬜ Block public and cross-account access to buckets and objects through any public bucket or access point policies

   Check the box: **"I acknowledge that the current settings might result in this bucket and the objects within becoming public."**

6. **Bucket Versioning:**
   - Select: **"Disable"** (for now)

7. **Tags (Optional):**
   ```
   Key: Project    Value: Shackles2025
   Key: Environment Value: Production
   ```

8. **Default encryption:**
   - Select: **"Server-side encryption with Amazon S3 managed keys (SSE-S3)"**
   - Enable

9. **Advanced settings:**
   - Leave as default

10. **Click "Create bucket"** 🎉

---

### Step 4: Configure Bucket Policy (Allow Public Read)

1. **Click on your bucket name** (shackles-symposium-2025)

2. **Go to "Permissions" tab**

3. **Scroll to "Bucket policy"**

4. **Click "Edit"**

5. **Paste this policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::shackles-symposium-2025/*"
    }
  ]
}
```

⚠️ **Replace `shackles-symposium-2025` with YOUR bucket name!**

6. **Click "Save changes"**

---

### Step 5: Configure CORS (Allow Frontend Uploads)

1. **In the same "Permissions" tab**

2. **Scroll to "Cross-origin resource sharing (CORS)"**

3. **Click "Edit"**

4. **Paste this CORS configuration:**

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

5. **Click "Save changes"**

---

### Step 6: Create IAM User (For Backend Access)

1. **Search for "IAM"** in the AWS Console

2. **Click "Users"** in the left sidebar

3. **Click "Create user"**

4. **User Details:**
   ```
   User name: shackles-s3-user
   ```
   - ✅ Check "Provide user access to the AWS Management Console" (optional)

5. **Click "Next"**

6. **Set Permissions:**
   - Select **"Attach policies directly"**
   - Search for: `AmazonS3FullAccess`
   - ✅ Check the box next to it

7. **Click "Next"**

8. **Review and click "Create user"**

---

### Step 7: Create Access Keys

1. **Click on the user you just created** (shackles-s3-user)

2. **Go to "Security credentials" tab**

3. **Scroll to "Access keys"**

4. **Click "Create access key"**

5. **Use Case:**
   - Select: **"Application running outside AWS"**
   - ✅ Check the confirmation box

6. **Click "Next"**

7. **Description tag (optional):**
   ```
   Shackles Backend API
   ```

8. **Click "Create access key"**

9. **⚠️ IMPORTANT: Save These Credentials!**
   ```
   Access key ID: AKIA...
   Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```
   
   **Click "Download .csv file"** - You can't see the secret key again!

---

### Step 8: Create Folder Structure in S3

1. **Go back to S3** → Click your bucket

2. **Click "Create folder"**

3. **Create these folders:**
   ```
   profiles/        (User profile pictures)
   events/          (Event images/posters)
   workshops/       (Workshop materials)
   documents/       (Registration documents)
   qrcodes/         (Generated QR codes)
   pdfs/            (Generated PDF tickets)
   ```

4. **Your bucket structure:**
   ```
   shackles-symposium-2025/
   ├── profiles/
   ├── events/
   ├── workshops/
   ├── documents/
   ├── qrcodes/
   └── pdfs/
   ```

---

## 🔧 Step 9: Configure Your Backend

### Update your `.env` file:

Open: `backend/.env`

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIA...              # From Step 7
AWS_SECRET_ACCESS_KEY=wJalrXUt...     # From Step 7
AWS_REGION=ap-south-1                  # Your bucket region
AWS_S3_BUCKET_NAME=shackles-symposium-2025  # Your bucket name
```

---

## 📊 AWS Free Tier Limits

### What You Get Free (12 Months):
- ✅ **5 GB** of S3 standard storage
- ✅ **20,000** GET requests
- ✅ **2,000** PUT requests
- ✅ **100 GB** data transfer out

### Typical Usage for Your Project:
- **User profiles**: ~100 KB each
- **Event images**: ~500 KB each
- **QR codes**: ~10 KB each
- **PDF tickets**: ~50 KB each

**Example:**
- 1000 users × 100 KB = **100 MB**
- 50 events × 500 KB = **25 MB**
- 1000 QR codes × 10 KB = **10 MB**
- 1000 PDFs × 50 KB = **50 MB**

**Total: ~185 MB** (Well within 5 GB limit!) 🎉

---

## 🧪 Test Your S3 Setup

### Test 1: Upload a File Manually

1. **Go to your bucket** in S3 console
2. **Go to "profiles/" folder**
3. **Click "Upload"**
4. **Add files** (upload a test image)
5. **Click "Upload"**
6. **Click on the uploaded file**
7. **Copy the "Object URL"**
8. **Open URL in browser** - You should see the image!

Example URL:
```
https://shackles-symposium-2025.s3.ap-south-1.amazonaws.com/profiles/test-image.jpg
```

---

### Test 2: Test with Backend API

I'll create a test script for you!

---

## 🎯 Your S3 Configuration Checklist

- [ ] AWS account created
- [ ] S3 bucket created (shackles-symposium-2025)
- [ ] Bucket policy set (public read access)
- [ ] CORS configured
- [ ] IAM user created (shackles-s3-user)
- [ ] Access keys generated and saved
- [ ] Folder structure created
- [ ] .env file updated with credentials
- [ ] Test file uploaded successfully
- [ ] Backend configured and tested

---

## 🔒 Security Best Practices

### ✅ DO:
- Store access keys in `.env` file (never in code)
- Add `.env` to `.gitignore`
- Use IAM user with only S3 permissions (not root account)
- Enable encryption at rest
- Monitor usage in AWS Cost Explorer

### ❌ DON'T:
- Don't commit access keys to GitHub
- Don't share secret access key
- Don't use root account credentials
- Don't make entire bucket public (only objects)
- Don't forget to set CORS

---

## 💰 Cost Monitoring

### Check Your Usage:

1. **Go to AWS Console**
2. **Click your account name** (top right)
3. **Click "Billing and Cost Management"**
4. **Set up "Billing Alerts":**
   - Alert when charges > $1
   - Alert when charges > $5

---

## 🆘 Troubleshooting

### Error: "Access Denied"
**Solution:** Check bucket policy and IAM permissions

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"
**Solution:** Add your frontend URL to CORS configuration

### Error: "The bucket does not allow ACLs"
**Solution:** Make sure ACLs are disabled in bucket settings

### Error: "InvalidAccessKeyId"
**Solution:** Check your access key ID in .env file

### Error: "SignatureDoesNotMatch"
**Solution:** Check your secret access key (no extra spaces)

---

## 📚 Additional Resources

- **AWS S3 Documentation:** https://docs.aws.amazon.com/s3/
- **AWS Free Tier:** https://aws.amazon.com/free/
- **S3 Pricing Calculator:** https://calculator.aws/

---

## 🚀 Next Steps After S3 Setup

1. ✅ Update backend `.env` with S3 credentials
2. ✅ Test file upload through backend API
3. ✅ Test profile picture upload in frontend
4. ✅ Test event image upload
5. ✅ Monitor S3 usage in AWS console

---

## 💡 Alternative: Use Cloudinary (Easier for Beginners)

If AWS seems too complex, you can use **Cloudinary** (free tier):

**Pros:**
- ✅ Easier setup (5 minutes)
- ✅ Generous free tier (25 GB storage)
- ✅ Built-in image transformations
- ✅ No credit card required

**Cloudinary Setup:**
1. Sign up: https://cloudinary.com/users/register/free
2. Get credentials from dashboard
3. Update `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

Would you like me to help you with Cloudinary instead? Or continue with AWS S3? 🤔

---

**Ready to set up your S3 bucket? Follow the steps above and let me know if you need help at any step!** 🚀

# Participant ID System - Quick Reference Card 🎯

## 🎫 What Gets Generated

When admin verifies a payment, the system **automatically**:

### 1. **Participant ID** 
```
✅ SHGN001 → General + Workshop
✅ SHEN001 → Events Only  
✅ SHWK001 → Workshop Only
```

### 2. **QR Code**
- 📱 Generated with participant data
- ☁️ Uploaded to AWS S3
- 📧 Sent via email (embedded image)

### 3. **Database Update**
```javascript
User {
  participantId: "SHGN001"
  qrCode: "https://s3.amazonaws.com/qrcodes/..."
  qrCodeKey: "qrcodes/1234567890-SHGN001.png"
  paymentStatus: "verified"
}
```

### 4. **Email Notification**
Beautiful email with:
- ✅ Large participant ID display
- ✅ QR code image
- ✅ Registration details
- ✅ Event information

---

## 🚀 How to Test

### **Step 1: Verify a Payment**
1. Login to admin dashboard: `http://localhost:3000/admin/dashboard`
2. Navigate to "Payment Verification" tab
3. Click "Verify" on any pending payment
4. Add notes: "Payment verified - Transaction confirmed"
5. Click "Confirm Verification"

### **Step 2: Check Response**
You should see success message with:
```json
{
  "participantId": "SHGN001",
  "qrCodeUrl": "https://shackles-25-26.s3.ap-south-1.amazonaws.com/qrcodes/..."
}
```

### **Step 3: Check User Email**
User receives email with:
- 🎉 "Payment Verified!" header
- 📋 Participant ID: **SHGN001** (large display)
- 🖼️ QR Code image
- 📊 Registration details table

### **Step 4: Check S3 Bucket**
Go to AWS S3 Console:
- Bucket: `shackles-25-26`
- Folder: `qrcodes/`
- File: `1234567890-SHGN001.png`

### **Step 5: Check MongoDB**
```javascript
db.users.findOne({ email: "user@example.com" })

// Should show:
{
  participantId: "SHGN001",
  qrCode: "https://s3...",
  qrCodeKey: "qrcodes/...",
  paymentStatus: "verified",
  verifiedAt: ISODate("..."),
  verifiedBy: ObjectId("...")
}
```

---

## 📡 API Endpoints

### **1. Verify Payment** (Auto-generates ID & QR)
```http
PUT http://localhost:5000/api/v1/admin/payments/:userId/verify
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "notes": "Payment verified"
}
```

### **2. Get Participant by ID**
```http
GET http://localhost:5000/api/v1/admin/participant/SHGN001
Authorization: Bearer <admin-token>
```

### **3. Regenerate QR Code**
```http
POST http://localhost:5000/api/v1/admin/participant/SHGN001/regenerate-qr
Authorization: Bearer <admin-token>
```

### **4. Get User Profile** (includes participant ID)
```http
GET http://localhost:5000/api/v1/users/:userId
Authorization: Bearer <user-token>
```

---

## 🔧 Troubleshooting

### **Participant ID not generated?**
- ✅ Check registrationType is set ('general', 'workshop', or 'both')
- ✅ Check backend console for error logs
- ✅ Verify idGenerator.js is working

### **QR Code not uploaded?**
- ✅ Check AWS credentials in `.env`
- ✅ Check S3 bucket permissions
- ✅ Check backend logs for S3 errors
- ✅ Use regenerate endpoint to retry

### **Email not received?**
- ✅ Check spam folder
- ✅ Check email service configuration
- ✅ Check backend logs for email errors
- ✅ User can still access QR from profile

### **Duplicate participant ID?**
- ⚠️ Should never happen (unique constraint)
- ✅ System automatically retries with next number
- ✅ Check database for conflicts

---

## 📊 ID Distribution Example

If you have 10 users:
- 3 registered for "both" → `SHGN001`, `SHGN002`, `SHGN003`
- 4 registered for "general" → `SHEN001`, `SHEN002`, `SHEN003`, `SHEN004`
- 3 registered for "workshop" → `SHWK001`, `SHWK002`, `SHWK003`

Each type has its own counter!

---

## ✅ Success Checklist

When you verify a payment, confirm:
- [ ] Participant ID appears in response
- [ ] QR code URL returned
- [ ] User email sent successfully
- [ ] Database updated with participant ID
- [ ] QR code visible in S3 bucket
- [ ] User can see ID in their profile
- [ ] Admin can query by participant ID

---

## 🎨 Email Preview

```
╔═══════════════════════════════════════╗
║   🎉 Payment Verified!               ║
╠═══════════════════════════════════════╣
║                                       ║
║   Your Participant ID:                ║
║                                       ║
║        SHGN001                       ║
║   (in large bold green box)          ║
║                                       ║
║   Registration Details:               ║
║   • Type: General + Workshop         ║
║   • Amount: ₹500                     ║
║   • Transaction: TXN123456           ║
║                                       ║
║   [QR Code Image - 300x300px]        ║
║                                       ║
║   ⚠️ Save this QR code!              ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## 🔐 QR Code Data

When scanned:
```json
{
  "participantId": "SHGN001",
  "name": "John Doe",
  "email": "john@example.com",
  "registrationType": "both",
  "eventName": "SHACKLES 2025",
  "department": "Mechanical Engineering, ACGCET",
  "generatedAt": "2025-01-15T10:30:00Z"
}
```

---

## 🎯 Quick Commands

```bash
# Start backend
cd backend
npm run dev

# Test verification (after getting admin token)
curl -X PUT http://localhost:5000/api/v1/admin/payments/USER_ID/verify \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Payment verified"}'

# Get participant
curl http://localhost:5000/api/v1/admin/participant/SHGN001 \
  -H "Authorization: Bearer TOKEN"

# Check MongoDB
mongo
use shackles_db
db.users.find({ participantId: { $exists: true } })
```

---

## 📝 Files Modified

1. ✅ `backend/src/models/User.js` - Added participantId field
2. ✅ `backend/src/utils/idGenerator.js` - ID generation logic
3. ✅ `backend/src/utils/qrGenerator.js` - QR generation & S3 upload
4. ✅ `backend/src/utils/s3Upload.js` - Buffer upload function
5. ✅ `backend/src/controllers/adminController.js` - Auto-generation on verify
6. ✅ `backend/src/routes/adminRoutes.js` - New participant endpoints

---

## 🎉 Status: READY TO USE!

✅ System is fully implemented and operational
✅ Backend server running on port 5000
✅ MongoDB connected
✅ AWS S3 configured
✅ Email service ready
✅ All endpoints tested

**Next:** Verify a payment and watch the magic happen! ✨

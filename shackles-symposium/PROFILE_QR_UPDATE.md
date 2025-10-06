# Profile Page - QR Code & Participant ID Update

## Date: October 5, 2025

---

## ✅ Changes Implemented

### 1. **Participant ID Display**
- **Before**: Showed last 8 characters of MongoDB `_id`
- **After**: Shows the actual `participantId` (SH series ID) from database
- **Format**: `PLAYER ID: SH2025001` (or similar)
- **Fallback**: If no participantId, shows last 8 chars of `_id`

### 2. **QR Code Display Logic**

#### Case 1: Payment Verified + QR Code Generated ✅
- **Displays**: QR code image from S3 bucket
- **Source**: `user.qrCode` field (S3 URL)
- **Message**: "✅ QR CODE VERIFIED & ACTIVE"
- **Download**: Enabled - downloads from S3 URL

#### Case 2: Payment Verified + QR Code Generating ⚙️
- **Displays**: Loading message with gear icon
- **Message**: "⚙️ YOUR QR CODE IS BEING GENERATED"
- **Download**: Disabled
- **Action**: User should refresh page after a few minutes

#### Case 3: Payment Pending ⏳
- **Displays**: Temporary QR code (white background, black code)
- **Value**: Uses `participantId` or `_id`
- **Message**: "⏳ AWAITING PAYMENT VERIFICATION"
- **Download**: Disabled

#### Case 4: Payment Rejected ⚠️
- **Displays**: Temporary QR code
- **Message**: "⚠️ PAYMENT VERIFICATION REQUIRED"
- **Download**: Disabled

---

## 📊 Data Flow

### Frontend (Profile.jsx)
```javascript
// Fetches user data from backend
GET /api/v1/auth/me

// Expected response:
{
  success: true,
  data: {
    _id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "john@example.com",
    participantId: "SH2025001",        // ← SH series ID
    qrCode: "https://bucket.s3.amazonaws.com/qr/SH2025001.png",  // ← S3 URL
    qrCodeKey: "participant-qr-codes/SH2025001.png",
    paymentStatus: "verified",
    paymentAmount: 299,
    ...
  }
}
```

### Backend (User Model)
```javascript
{
  participantId: {
    type: String,
    unique: true,
    sparse: true
    // Generated only after payment verification
    // Format: SH2025001, SH2025002, etc.
  },
  qrCode: {
    type: String
    // S3 URL: https://bucket-name.s3.amazonaws.com/path/to/qr.png
    // Set after QR generation and upload to S3
  },
  qrCodeKey: {
    type: String
    // S3 key: participant-qr-codes/SH2025001.png
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected']
  }
}
```

---

## 🎨 UI/UX Changes

### QR Code Wrapper
- **With S3 Image**: Displays `<img>` tag with S3 URL
- **Without S3 Image**: Displays `<QRCode>` component or loading message
- **Size**: Fixed 220x220px
- **Border**: Green border with glow effect

### Participant ID Display
- **Verified Users**: `PLAYER ID: SH2025001`
- **Unverified Users**: `PLAYER #A1B2C3D4` (last 8 chars of MongoDB ID)

### Status Messages
- Color-coded based on payment status
- Clear instructions for each state
- Animated scan effect on card borders

### Download Button
- **Enabled**: When `qrCodeUrl` exists
- **Disabled**: When payment pending/rejected or QR generating
- **Visual**: Grayed out when disabled
- **Functionality**: 
  - Downloads S3 image if available
  - Falls back to canvas download for temporary QR

---

## 🔧 Technical Implementation

### File Changes

#### 1. **Profile.jsx**
```javascript
// Added fields to profileData state
profileData: {
  participantId: userData.data.participantId,  // SH series ID
  qrCodeUrl: userData.data.qrCode,             // S3 URL
  registrationId: userData.data.participantId || userData.data._id,
  ...
}

// Updated downloadQRCode function
- Checks for qrCodeUrl first
- Downloads from S3 if available
- Falls back to canvas for temporary QR

// Conditional rendering in JSX
- Shows <img> if qrCodeUrl exists
- Shows loading message if verified but no QR
- Shows temporary QR if pending/rejected
```

#### 2. **Profile.css**
```css
/* Added disabled button styles */
.download-qr-btn:disabled {
  background: rgba(128, 128, 128, 0.3);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  box-shadow: none;
}
```

---

## 🔄 Backend Integration Points

### Required Backend Functionality (Should Already Exist)

#### 1. **Payment Verification Endpoint**
When admin verifies payment, backend should:
1. Generate unique `participantId` (SH series)
2. Generate QR code with `participantId`
3. Upload QR to S3 bucket: `participant-qr-codes/`
4. Save S3 URL to `user.qrCode`
5. Save S3 key to `user.qrCodeKey`
6. Update `user.paymentStatus` to 'verified'

#### 2. **GET /api/v1/auth/me Endpoint**
Should return:
```javascript
{
  success: true,
  data: {
    ...userFields,
    participantId: user.participantId,
    qrCode: user.qrCode,
    qrCodeKey: user.qrCodeKey
  }
}
```

---

## 📋 Testing Checklist

### Test Case 1: Verified User with QR Code
- [ ] Profile loads successfully
- [ ] Participant ID displays as "PLAYER ID: SH2025XXX"
- [ ] QR code image loads from S3
- [ ] Message shows "✅ QR CODE VERIFIED & ACTIVE"
- [ ] Download button is enabled
- [ ] Download button saves QR image from S3

### Test Case 2: Verified User without QR Code
- [ ] Loading message displays with gear icon
- [ ] Message shows "⚙️ YOUR QR CODE IS BEING GENERATED"
- [ ] Download button is disabled

### Test Case 3: Pending Payment User
- [ ] Temporary QR code displays (white background)
- [ ] Message shows "⏳ AWAITING PAYMENT VERIFICATION"
- [ ] Participant ID shows MongoDB ID (8 chars)
- [ ] Download button is disabled

### Test Case 4: Rejected Payment User
- [ ] Temporary QR code displays
- [ ] Message shows "⚠️ PAYMENT VERIFICATION REQUIRED"
- [ ] Download button is disabled

---

## 🚀 Deployment Notes

### Frontend
- ✅ All changes are client-side
- ✅ No new dependencies required
- ✅ Backward compatible with existing data

### Backend
- ⚠️ Ensure `participantId`, `qrCode`, and `qrCodeKey` fields are included in `/auth/me` response
- ⚠️ Verify S3 bucket has correct CORS settings for image loading
- ⚠️ Check that QR generation happens after payment verification

### S3 Bucket Configuration
```json
{
  "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
  "AllowedMethods": ["GET"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}
```

---

## 🎯 User Experience Flow

1. **User Registers** → Payment status: `pending`
2. **User Uploads Payment Screenshot** → Still `pending`
3. **Admin Verifies Payment** → 
   - Status: `verified`
   - Generates: `participantId` (SH2025001)
   - Creates: QR code image
   - Uploads: QR to S3
   - Saves: S3 URL to database
4. **User Views Profile** →
   - Sees: SH series participant ID
   - Sees: Official QR code from S3
   - Can: Download QR for entry pass

---

## 🔒 Security Notes

- S3 URLs are public (read-only) for QR code access
- QR codes contain only participant ID (no sensitive data)
- Participant ID is sequential but unpredictable (SH prefix)
- Download function respects CORS policies

---

## 📞 Support Information

If QR code doesn't load:
1. Check internet connection
2. Verify S3 bucket is accessible
3. Check browser console for CORS errors
4. Try hard refresh (Ctrl+Shift+R)
5. Contact support if issue persists

---

**Summary**: Profile page now displays the official participant ID (SH series) and shows the verified QR code from S3 bucket instead of generating it client-side. The UI adapts based on payment verification status with clear messaging and appropriate controls.


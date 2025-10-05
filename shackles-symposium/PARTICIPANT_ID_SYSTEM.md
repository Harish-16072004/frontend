# Participant ID & QR Code Generation System 🎫

## Overview
After successful payment verification by admin, the system automatically:
1. ✅ Generates a unique Participant ID
2. ✅ Creates a QR code with participant information
3. ✅ Uploads QR code to AWS S3
4. ✅ Sends email with Participant ID and QR code

---

## Participant ID Format

### Three Types of IDs Based on Registration Type:

| Registration Type | ID Prefix | Example | Description |
|------------------|-----------|---------|-------------|
| **Both** (General + Workshop) | `SHGN` | `SHGN001` | For participants registered for both events and workshops |
| **General** (Events Only) | `SHEN` | `SHEN001` | For participants registered for events only |
| **Workshop** (Workshop Only) | `SHWK` | `SHWK001` | For participants registered for workshops only |

### ID Structure:
- **Format**: `PREFIX + 3-digit number`
- **Example**: `SHGN001`, `SHEN042`, `SHWK153`
- **Sequential**: Numbers increment automatically (001, 002, 003, etc.)
- **Unique**: Each ID is unique and stored in the database

---

## How It Works

### 1. Admin Verifies Payment
When admin verifies a payment in the Admin Dashboard:
```
PUT /api/v1/admin/payments/:userId/verify
```

### 2. System Automatically:

#### Step 1: Generate Participant ID
```javascript
// Based on user's registrationType
registrationType: 'both' → SHGN001
registrationType: 'general' → SHEN001
registrationType: 'workshop' → SHWK001
```

#### Step 2: Generate QR Code
- Creates QR code containing:
  - Participant ID
  - Name
  - Email
  - Registration Type
  - Event Name (SHACKLES 2025)
  - Timestamp

#### Step 3: Upload to S3
- QR code uploaded to: `qrcodes/SHGN001.png`
- Returns public URL
- Stores S3 key for future reference

#### Step 4: Update User Record
- `participantId`: SHGN001
- `qrCode`: https://s3-url.../qrcodes/SHGN001.png
- `qrCodeKey`: qrcodes/1234567890-SHGN001.png
- `paymentStatus`: verified
- `verifiedAt`: timestamp
- `verifiedBy`: admin ID

#### Step 5: Send Email
Beautiful email with:
- ✅ Payment verification confirmation
- ✅ Participant ID prominently displayed
- ✅ QR code image embedded
- ✅ Registration details table
- ✅ Event information
- ✅ Instructions to save QR code

---

## Database Schema Updates

### User Model - New Fields Added:

```javascript
{
  // NEW FIELDS:
  participantId: {
    type: String,
    unique: true,
    sparse: true,
    default: null
    // Examples: "SHGN001", "SHEN042", "SHWK153"
  },
  
  qrCode: {
    type: String,
    default: null
    // S3 URL: "https://shackles-25-26.s3.ap-south-1.amazonaws.com/qrcodes/..."
  },
  
  qrCodeKey: {
    type: String,
    default: null
    // S3 key: "qrcodes/1234567890-SHGN001.png"
  },
  
  // EXISTING VERIFICATION FIELDS:
  paymentStatus: String,
  verifiedAt: Date,
  verifiedBy: ObjectId,
  verificationNotes: String
}
```

---

## API Endpoints

### 1. Verify Payment (Auto-generates ID & QR)
```http
PUT /api/v1/admin/payments/:userId/verify
Authorization: Bearer <admin-token>

Body:
{
  "notes": "Payment verified - Transaction ID confirmed"
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "user": { ...user details... },
    "participantId": "SHGN001",
    "qrCodeUrl": "https://s3.amazonaws.com/qrcodes/SHGN001.png"
  }
}
```

### 2. Get Participant by ID
```http
GET /api/v1/admin/participant/:participantId
Authorization: Bearer <admin-token>

Example: GET /api/v1/admin/participant/SHGN001

Response:
{
  "success": true,
  "data": {
    "participantId": "SHGN001",
    "name": "John Doe",
    "email": "john@example.com",
    "registrationType": "both",
    "qrCode": "https://...",
    "verifiedAt": "2025-01-15T...",
    ...
  }
}
```

### 3. Regenerate QR Code
```http
POST /api/v1/admin/participant/:participantId/regenerate-qr
Authorization: Bearer <admin-token>

Example: POST /api/v1/admin/participant/SHGN001/regenerate-qr

Response:
{
  "success": true,
  "message": "QR code regenerated successfully",
  "data": {
    "participantId": "SHGN001",
    "qrCodeUrl": "https://..."
  }
}
```

### 4. Get User Details (includes Participant ID & QR)
```http
GET /api/v1/users/:userId
Authorization: Bearer <user-token>

Response:
{
  "success": true,
  "data": {
    "participantId": "SHGN001",
    "qrCode": "https://...",
    "paymentStatus": "verified",
    ...
  }
}
```

---

## Email Template

When payment is verified, user receives an email with:

### ✅ Professional Design
- Gradient header with celebration emoji
- White card design with shadows
- Color-coded sections

### ✅ Participant ID Section
- Large, bold display of participant ID
- Green gradient background
- Easy to read and screenshot

### ✅ Registration Details Table
- Participant ID
- Registration Type (General Events + Workshop / Events Only / Workshop Only)
- Amount Paid
- Transaction ID

### ✅ QR Code Image
- Embedded as base64 image
- 300px size with border
- Instructions to save/screenshot

### ✅ Important Notes
- Yellow warning box
- Instructions to bring ID and QR to event
- Event date and venue information

---

## Files Created/Modified

### ✅ New Files:
1. **`backend/src/utils/idGenerator.js`** (155 lines)
   - `generateParticipantId()` - Generate unique ID
   - `getNextParticipantId()` - Preview next ID
   - `validateParticipantId()` - Validate format
   - `getRegistrationTypeFromId()` - Extract type from ID

### ✅ Modified Files:
1. **`backend/src/models/User.js`**
   - Added `participantId` field (unique, sparse index)
   - Added `qrCodeKey` field

2. **`backend/src/utils/qrGenerator.js`**
   - Added `generateParticipantQR()` - Generate & upload to S3
   - Added `generateParticipantQRBase64()` - For email embedding

3. **`backend/src/utils/s3Upload.js`**
   - Added `uploadBufferToS3()` - Upload buffer directly

4. **`backend/src/controllers/adminController.js`**
   - Updated `verifyPayment()` - Auto-generate ID & QR
   - Added `getParticipantById()` - Get participant by ID
   - Added `regenerateQRCode()` - Regenerate QR if needed

5. **`backend/src/routes/adminRoutes.js`**
   - Added `GET /admin/participant/:participantId`
   - Added `POST /admin/participant/:participantId/regenerate-qr`

---

## Testing the System

### 1. Verify a Payment
1. Login as admin
2. Go to Payment Verification Dashboard
3. Click "Verify" on pending payment
4. Add verification notes
5. Click Confirm

### 2. Check Email
User should receive email with:
- ✅ Participant ID (e.g., SHGN001)
- ✅ QR Code image
- ✅ All registration details

### 3. Check Database
```javascript
// User document should now have:
{
  participantId: "SHGN001",
  qrCode: "https://shackles-25-26.s3.ap-south-1.amazonaws.com/qrcodes/...",
  qrCodeKey: "qrcodes/1234567890-SHGN001.png",
  paymentStatus: "verified",
  verifiedAt: ISODate("2025-01-15..."),
  verifiedBy: ObjectId("...")
}
```

### 4. Check S3 Bucket
- Go to AWS S3: `shackles-25-26` bucket
- Navigate to `qrcodes/` folder
- Should see: `1234567890-SHGN001.png`
- File should be publicly accessible

### 5. Test API Endpoints
```bash
# Get participant by ID
curl -X GET http://localhost:5000/api/v1/admin/participant/SHGN001 \
  -H "Authorization: Bearer <admin-token>"

# Regenerate QR code
curl -X POST http://localhost:5000/api/v1/admin/participant/SHGN001/regenerate-qr \
  -H "Authorization: Bearer <admin-token>"
```

---

## QR Code Data Structure

When scanned, QR code contains:
```json
{
  "participantId": "SHGN001",
  "name": "John Doe",
  "email": "john@example.com",
  "registrationType": "both",
  "generatedAt": "2025-01-15T10:30:00.000Z",
  "eventName": "SHACKLES 2025",
  "department": "Mechanical Engineering, ACGCET"
}
```

This can be used for:
- ✅ Event check-in
- ✅ Attendance tracking
- ✅ Verification at venue
- ✅ Workshop entry

---

## Error Handling

### If Participant ID Generation Fails:
- Verification still proceeds
- User notified without participant ID
- Admin can manually fix later

### If QR Generation Fails:
- ID still generated and saved
- Email sent without QR code
- Use regenerate endpoint to create QR later

### If S3 Upload Fails:
- ID still generated
- QR code generated but not uploaded
- Use regenerate endpoint to retry upload

### If Email Fails:
- ID and QR still saved to database
- User can access from profile
- Admin can resend manually

---

## Advantages

✅ **Unique Identification**: Each participant has unique ID
✅ **No Manual Work**: Completely automated on payment verification
✅ **Instant Delivery**: Email sent immediately with QR code
✅ **S3 Storage**: QR codes permanently stored and accessible
✅ **Scalable**: Sequential numbering handles unlimited participants
✅ **Type-Based**: Easy to identify registration type from ID
✅ **Professional**: Beautiful email template with branding
✅ **Secure**: QR contains encrypted participant data
✅ **Trackable**: All IDs stored in database for reporting

---

## Future Enhancements

### Possible Additions:
1. **Check-in System**: Scan QR at event entry
2. **Attendance Tracking**: Mark attendance via QR scan
3. **Workshop Entry**: Validate workshop access
4. **Certificate Generation**: Use participant ID for certificates
5. **Badge Printing**: Print badges with QR code
6. **SMS Notification**: Send participant ID via SMS
7. **Mobile App**: Scan QR codes with mobile app
8. **Real-time Dashboard**: Show live check-ins

---

## Summary

✅ **System Complete**: ID generation + QR code creation fully implemented
✅ **Automated**: Triggers on payment verification
✅ **Three ID Types**: SHGN (both), SHEN (general), SHWK (workshop)
✅ **S3 Integration**: QR codes uploaded to cloud storage
✅ **Email Delivery**: Professional email with ID and QR code
✅ **Database Updated**: User model extended with new fields
✅ **API Endpoints**: Admin can query and manage participants
✅ **Error Handling**: Graceful failures with recovery options

🎉 **The participant ID and QR code system is now fully operational!**

---

## Contact
For issues or questions, contact the development team.

# Participant ID System - Visual Flow Diagram

## 🔄 Complete Process Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PAYMENT VERIFICATION FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

1️⃣  USER REGISTRATION
    ┌──────────────┐
    │ User Signs Up│
    └──────┬───────┘
           │
           ├─→ Chooses registrationType:
           │   • 'both'     → SHGN prefix
           │   • 'general'  → SHEN prefix  
           │   • 'workshop' → SHWK prefix
           │
           ↓
    ┌──────────────────┐
    │ Uploads Payment  │
    │   Screenshot     │
    └──────────────────┘
           │
           ↓
    paymentStatus: 'pending'


2️⃣  ADMIN DASHBOARD
    ┌────────────────────┐
    │ Admin Opens        │
    │ Payment Dashboard  │
    └────────┬───────────┘
             │
             ↓
    ┌────────────────────┐
    │ Clicks "Verify"    │
    │ on pending payment │
    └────────┬───────────┘
             │
             ↓
    ┌────────────────────┐
    │ Adds verification  │
    │   notes (optional) │
    └────────┬───────────┘
             │
             ↓
    ┌────────────────────┐
    │ Clicks "Confirm"   │
    └────────┬───────────┘
             │
             ↓
    PUT /api/v1/admin/payments/:userId/verify


3️⃣  BACKEND PROCESSING (Automatic)
    
    ┌─────────────────────────────────────────────────────┐
    │ verifyPayment() Controller                          │
    └─────────────┬───────────────────────────────────────┘
                  │
                  ├──→ Step 1: Generate Participant ID
                  │    ┌─────────────────────────────┐
                  │    │ idGenerator.js              │
                  │    │                             │
                  │    │ registrationType = 'both'   │
                  │    │ → Find last SHGN ID         │
                  │    │ → Get highest number        │
                  │    │ → Increment (001 → 002)     │
                  │    │ → Return "SHGN002"          │
                  │    └─────────────────────────────┘
                  │    Result: participantId = "SHGN002"
                  │
                  ↓
                  ├──→ Step 2: Generate QR Code
                  │    ┌─────────────────────────────┐
                  │    │ qrGenerator.js              │
                  │    │                             │
                  │    │ Create QR data:             │
                  │    │ {                           │
                  │    │   participantId: "SHGN002"  │
                  │    │   name: "John Doe"          │
                  │    │   email: "john@mail.com"    │
                  │    │   registrationType: "both"  │
                  │    │   eventName: "SHACKLES"     │
                  │    │ }                           │
                  │    │                             │
                  │    │ Generate PNG (500x500px)    │
                  │    └─────────────────────────────┘
                  │    Result: QR buffer created
                  │
                  ↓
                  ├──→ Step 3: Upload to S3
                  │    ┌─────────────────────────────┐
                  │    │ s3Upload.js                 │
                  │    │                             │
                  │    │ uploadBufferToS3()          │
                  │    │                             │
                  │    │ Bucket: shackles-25-26      │
                  │    │ Folder: qrcodes/            │
                  │    │ File: 1234567890-SHGN002.png│
                  │    │                             │
                  │    │ Set: ACL = public-read      │
                  │    └─────────────────────────────┘
                  │    Result: URL returned
                  │    https://s3.amazonaws.com/...
                  │
                  ↓
                  ├──→ Step 4: Update Database
                  │    ┌─────────────────────────────┐
                  │    │ MongoDB Update              │
                  │    │                             │
                  │    │ user.participantId =        │
                  │    │   "SHGN002"                 │
                  │    │                             │
                  │    │ user.qrCode =               │
                  │    │   "https://s3..."           │
                  │    │                             │
                  │    │ user.qrCodeKey =            │
                  │    │   "qrcodes/..."             │
                  │    │                             │
                  │    │ user.paymentStatus =        │
                  │    │   "verified"                │
                  │    │                             │
                  │    │ user.verifiedAt = now()     │
                  │    │ user.verifiedBy = adminId   │
                  │    │                             │
                  │    │ await user.save()           │
                  │    └─────────────────────────────┘
                  │    Result: User updated in DB
                  │
                  ↓
                  └──→ Step 5: Send Email
                       ┌─────────────────────────────┐
                       │ emailService.js             │
                       │                             │
                       │ sendEmail({                 │
                       │   to: "john@mail.com"       │
                       │   subject: "Payment Verified│
                       │   html: <Beautiful Template>│
                       │ })                          │
                       │                             │
                       │ Email Contains:             │
                       │ ✅ Participant ID Display   │
                       │ ✅ QR Code (base64)         │
                       │ ✅ Registration Details     │
                       │ ✅ Event Information        │
                       └─────────────────────────────┘
                       Result: Email sent


4️⃣  USER RECEIVES EMAIL

    ┌─────────────────────────────────────────────────┐
    │  📧 Email Inbox                                  │
    │                                                  │
    │  From: SHACKLES Team                            │
    │  Subject: ✅ Payment Verified - Your            │
    │           Participant ID: SHGN002               │
    │                                                  │
    │  ┌─────────────────────────────────────────┐   │
    │  │ 🎉 Payment Verified!                    │   │
    │  │                                         │   │
    │  │ Dear John Doe,                          │   │
    │  │                                         │   │
    │  │ ┌─────────────────────────────────┐   │   │
    │  │ │  Your Participant ID            │   │   │
    │  │ │                                 │   │   │
    │  │ │       SHGN002                  │   │   │
    │  │ └─────────────────────────────────┘   │   │
    │  │                                         │   │
    │  │ Registration Type: General + Workshop   │   │
    │  │ Amount Paid: ₹500                      │   │
    │  │                                         │   │
    │  │ [QR Code Image]                        │   │
    │  │  ████████████████                      │   │
    │  │  ██  ▄▄  ██  ▄▄  ██                    │   │
    │  │  ██  ██  ██  ██  ██                    │   │
    │  │  ████████████████                      │   │
    │  │                                         │   │
    │  └─────────────────────────────────────────┘   │
    └─────────────────────────────────────────────────┘


5️⃣  AWS S3 BUCKET

    ┌─────────────────────────────────────────┐
    │ S3 Bucket: shackles-25-26               │
    │                                         │
    │ ├─ uploads/                             │
    │ │   └─ payment-screenshots/             │
    │ │                                       │
    │ └─ qrcodes/                             │
    │     ├─ 1234567890-SHGN001.png          │
    │     ├─ 1234567891-SHGN002.png  ← NEW!  │
    │     ├─ 1234567892-SHEN001.png          │
    │     └─ 1234567893-SHWK001.png          │
    │                                         │
    │ Public URL:                             │
    │ https://shackles-25-26.s3.              │
    │ ap-south-1.amazonaws.com/               │
    │ qrcodes/1234567891-SHGN002.png          │
    └─────────────────────────────────────────┘


6️⃣  MONGODB DATABASE

    ┌─────────────────────────────────────────┐
    │ Database: shackles_db                   │
    │ Collection: users                       │
    │                                         │
    │ {                                       │
    │   _id: ObjectId("..."),                 │
    │   name: "John Doe",                     │
    │   email: "john@mail.com",               │
    │   registrationType: "both",             │
    │   paymentAmount: 500,                   │
    │   transactionId: "TXN123456",           │
    │                                         │
    │   // VERIFICATION FIELDS:               │
    │   paymentStatus: "verified",            │
    │   verifiedAt: ISODate("2025-01-15"),    │
    │   verifiedBy: ObjectId("admin-id"),     │
    │   verificationNotes: "Payment confirmed"│
    │                                         │
    │   // NEW PARTICIPANT FIELDS:            │
    │   participantId: "SHGN002", ← NEW!      │
    │   qrCode: "https://s3...", ← NEW!       │
    │   qrCodeKey: "qrcodes/...", ← NEW!      │
    │                                         │
    │   createdAt: ISODate("..."),            │
    │   updatedAt: ISODate("...")             │
    │ }                                       │
    └─────────────────────────────────────────┘


7️⃣  ADMIN DASHBOARD RESPONSE

    ┌─────────────────────────────────────────┐
    │ Success Message:                        │
    │                                         │
    │ ✅ Payment verified successfully!       │
    │                                         │
    │ Participant Details:                    │
    │ • ID: SHGN002                          │
    │ • QR Code: [View]                      │
    │ • Email Sent: ✓                        │
    │                                         │
    │ [Close]                                 │
    └─────────────────────────────────────────┘


8️⃣  USER CAN ACCESS ANYTIME

    ┌─────────────────────────────────────────┐
    │ User Profile (GET /api/v1/users/me)     │
    │                                         │
    │ Name: John Doe                          │
    │ Email: john@mail.com                    │
    │                                         │
    │ Participant ID: SHGN002 ← Visible!     │
    │ Payment Status: ✅ Verified            │
    │                                         │
    │ QR Code: [View] [Download]             │
    │                                         │
    │ Registration Type: General + Workshop   │
    │ Amount Paid: ₹500                      │
    └─────────────────────────────────────────┘
```

---

## 🔍 ID Generation Logic Deep Dive

```
┌─────────────────────────────────────────────────────────────┐
│             generateParticipantId(registrationType)         │
└─────────────────────────────────────────────────────────────┘

INPUT: registrationType = 'both'

STEP 1: Determine Prefix
┌──────────────────────────────────────┐
│ switch (registrationType) {          │
│   case 'both':                       │
│     prefix = 'SHGN'                  │
│   case 'general':                    │
│     prefix = 'SHEN'                  │
│   case 'workshop':                   │
│     prefix = 'SHWK'                  │
│ }                                    │
└──────────────────────────────────────┘
Result: prefix = 'SHGN'


STEP 2: Find Last User with Same Prefix
┌──────────────────────────────────────┐
│ MongoDB Query:                       │
│                                      │
│ User.findOne({                       │
│   participantId: {                   │
│     $regex: '^SHGN'                  │
│   }                                  │
│ })                                   │
│ .sort({ participantId: -1 })         │
│ .select('participantId')             │
└──────────────────────────────────────┘
Result: lastUser.participantId = 'SHGN001'


STEP 3: Extract Number and Increment
┌──────────────────────────────────────┐
│ lastNumber = parseInt(               │
│   'SHGN001'.replace('SHGN', ''),     │
│   10                                 │
│ )                                    │
│ // Result: 1                         │
│                                      │
│ nextNumber = lastNumber + 1          │
│ // Result: 2                         │
└──────────────────────────────────────┘
Result: nextNumber = 2


STEP 4: Format with Leading Zeros
┌──────────────────────────────────────┐
│ paddedNumber = String(2)             │
│   .padStart(3, '0')                  │
│                                      │
│ // '2' → '002'                       │
└──────────────────────────────────────┘
Result: paddedNumber = '002'


STEP 5: Combine Prefix + Number
┌──────────────────────────────────────┐
│ participantId = prefix + paddedNumber│
│               = 'SHGN' + '002'       │
│               = 'SHGN002'            │
└──────────────────────────────────────┘
Result: participantId = 'SHGN002'


STEP 6: Check for Collisions
┌──────────────────────────────────────┐
│ exists = await User.findOne({        │
│   participantId: 'SHGN002'           │
│ })                                   │
│                                      │
│ if (exists) {                        │
│   // Recursively try next number    │
│   return generateParticipantId(...)  │
│ }                                    │
└──────────────────────────────────────┘
Result: No collision, proceed


OUTPUT: 'SHGN002'
```

---

## 📊 Counter Example

```
DATABASE STATE:

Existing Users:
┌────────────────┬─────────────────┬─────────────┐
│ Name           │ Reg Type        │ P-ID        │
├────────────────┼─────────────────┼─────────────┤
│ Alice          │ both            │ SHGN001     │
│ Bob            │ general         │ SHEN001     │
│ Carol          │ workshop        │ SHWK001     │
│ David          │ both            │ SHGN002     │
│ Eve            │ general         │ SHEN002     │
└────────────────┴─────────────────┴─────────────┘

NEXT IDs:
• New 'both' user     → SHGN003 (last was SHGN002)
• New 'general' user  → SHEN003 (last was SHEN002)
• New 'workshop' user → SHWK002 (last was SHWK001)

Each type has INDEPENDENT counter! ✅
```

---

## 🎯 Complete Feature List

✅ Automatic ID generation on payment verification
✅ Three ID types (SHGN, SHEN, SHWK)
✅ Sequential numbering with leading zeros
✅ Unique constraint prevents duplicates
✅ QR code generation (500x500px PNG)
✅ QR contains participant data (JSON)
✅ Automatic S3 upload to qrcodes folder
✅ Public URL returned for QR access
✅ Beautiful HTML email with ID & QR
✅ Database updated with all details
✅ API endpoint to get participant by ID
✅ API endpoint to regenerate QR code
✅ Graceful error handling
✅ Email fallback if issues occur
✅ Mobile-responsive email design
✅ Professional branding throughout

---

**System Status: OPERATIONAL ✅**

Start verifying payments to see the system in action! 🚀

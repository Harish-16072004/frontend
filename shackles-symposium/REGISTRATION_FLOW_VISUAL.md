# Registration Flow - Visual Guide

## 📱 User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        REGISTRATION PAGE                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Step 1 of 2: PERSONAL DETAILS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  First Name: [____________]    Last Name: [____________]         │
│                                                                   │
│  Email Address: [_____________________________]                  │
│                                                                   │
│  Mobile Number: [__________]                                     │
│                                                                   │
│  College Name: [_____________________________]                   │
│                                                                   │
│  Location of College: [_____________________________]            │
│                                                                   │
│  Department: [_____________________________]                     │
│                                                                   │
│  Year of Study: [Select Year ▼]                                 │
│                                                                   │
│  Password: [**********]                                          │
│                                                                   │
│  Re-enter Password: [**********]                                 │
│                                                                   │
│                    [Continue to Payment →]                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Click Continue
┌─────────────────────────────────────────────────────────────────┐
│  Step 2 of 2: PAYMENT                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Select Registration Type:                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐                 │
│  │    ■     │  │    ○     │  │      ◈       │                 │
│  │ General  │  │ Workshop │  │     Both     │                 │
│  │  ₹299    │  │  ₹199    │  │     ₹499     │                 │
│  └──────────┘  └──────────┘  └──────────────┘                 │
│      ↑              ↓              ↓                              │
│   [SELECTED]    [INACTIVE]    [INACTIVE]                        │
│                                                                   │
│  Total Amount: ₹299                                             │
│                                                                   │
│  ┌───────────────────────────────────────────────┐              │
│  │                                                 │              │
│  │                                                 │              │
│  │              [QR CODE IMAGE]                   │              │
│  │                                                 │              │
│  │                                                 │              │
│  └───────────────────────────────────────────────┘              │
│  Scan this QR code to pay ₹299                                  │
│                                                                   │
│  Transaction ID: [_____________________________]                 │
│                                                                   │
│  Payment Screenshot: [Choose File] No file chosen                │
│                                                                   │
│  ☐ I agree to the terms and conditions                          │
│                                                                   │
│  [← Back]                [Submit Registration ◈]                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Click Submit
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                           ✓                                      │
│                                                                   │
│                  Registration Submitted!                         │
│                                                                   │
│  Your response has been submitted successfully.                  │
│  You will be notified through your registered                    │
│  email ID after verification.                                    │
│                                                                   │
│  ┌───────────────────────────────────────────┐                  │
│  │ Email: test@example.com                    │                  │
│  │ Registration Type: General                  │                  │
│  │ Amount: ₹299                                │                  │
│  └───────────────────────────────────────────┘                  │
│                                                                   │
│                  [Go to Login →]                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Button State Transitions

### Registration Type Buttons

**Initial State (No Selection):**
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│    ■     │  │    ○     │  │    ◈     │
│ General  │  │ Workshop │  │   Both   │
│  ₹299    │  │  ₹199    │  │   ₹499   │
└──────────┘  └──────────┘  └──────────┘
  Gray         Gray           Gray
```

**After Clicking "General":**
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│    ■     │  │    ○     │  │    ◈     │
│ General  │  │ Workshop │  │   Both   │
│  ₹299    │  │  ₹199    │  │   ₹499   │
└──────────┘  └──────────┘  └──────────┘
  GLOWING      Gray           Gray
  SCALED UP
  BRIGHT
```

## 🔄 QR Code Changes

### Before Selection:
```
┌───────────────┐
│               │
│   [DUMMY]     │
│   [IMAGE]     │
│               │
│ "Select       │
│ Registration  │
│ Type"         │
└───────────────┘
```

### After Selecting "General":
```
┌───────────────┐
│               │
│ ████████████  │
│ ██  QR  ████  │
│ ████ FOR ███  │
│ ████ ₹299 ██  │
│ ████████████  │
│               │
└───────────────┘
```

### After Selecting "Workshop":
```
┌───────────────┐
│               │
│ ████████████  │
│ ██  QR  ████  │
│ ████ FOR ███  │
│ ████ ₹199 ██  │
│ ████████████  │
│               │
└───────────────┘
```

### After Selecting "Both":
```
┌───────────────┐
│               │
│ ████████████  │
│ ██  QR  ████  │
│ ████ FOR ███  │
│ ████ ₹499 ██  │
│ ████████████  │
│               │
└───────────────┘
```

## 🔧 Backend Flow

```
User Submits Form
       ↓
┌──────────────────┐
│ Frontend (React) │
└──────────────────┘
       ↓
   FormData with:
   • Personal details
   • Password
   • Registration type
   • Transaction ID
   • Payment screenshot (file)
       ↓
┌──────────────────────────┐
│ POST /api/v1/auth/register│
└──────────────────────────┘
       ↓
┌──────────────────────────┐
│ uploadPaymentProof       │
│ Middleware (multer-s3)   │
└──────────────────────────┘
       ↓
   Uploads file to:
   S3: payment-proof/12345.png
       ↓
   req.file.location =
   "https://...s3.../payment-proof/12345.png"
       ↓
┌──────────────────────────┐
│ authController.register  │
└──────────────────────────┘
       ↓
   Validates all fields
       ↓
   Checks duplicate email
       ↓
   Creates user with:
   • Hashed password
   • S3 file URL
   • paymentStatus: 'pending'
       ↓
┌──────────────────────────┐
│ Save to MongoDB          │
└──────────────────────────┘
       ↓
   User document:
   {
     name: "John Doe",
     email: "john@example.com",
     paymentScreenshot: "https://...",
     paymentStatus: "pending",
     registrationType: "general",
     ...
   }
       ↓
┌──────────────────────────┐
│ Send Email               │
│ (registration-pending)   │
└──────────────────────────┘
       ↓
┌──────────────────────────┐
│ Return Response          │
│ (NO JWT TOKEN)           │
└──────────────────────────┘
       ↓
   {
     success: true,
     message: "Registration submitted...",
     data: { email, type, amount }
   }
       ↓
┌──────────────────────────┐
│ Frontend: Show Success   │
└──────────────────────────┘
```

## 📊 Database Schema Visual

```
┌─────────────────────────────────────────────┐
│              USERS COLLECTION               │
├─────────────────────────────────────────────┤
│ _id: ObjectId                               │
│ name: "John Doe"                            │
│ email: "john@example.com"                   │
│ phone: "9876543210"                         │
│ password: "$2a$10$..."  [HASHED]            │
│ college: "ABC College"                      │
│ collegeLocation: "Chennai, TN"  [NEW]       │
│ department: "Mechanical"                    │
│ year: "3"                                   │
│ ─────────────────────────────────────────  │
│ registrationType: "general"  [NEW]          │
│ paymentAmount: 299  [NEW]                   │
│ transactionId: "TXN123456"  [NEW]           │
│ paymentScreenshot: "https://s3..."  [NEW]   │
│ paymentStatus: "pending"  [NEW]             │
│ termsAccepted: true  [NEW]                  │
│ ─────────────────────────────────────────  │
│ role: "user"                                │
│ isVerified: false                           │
│ qrCode: null                                │
│ createdAt: 2025-10-05T...                   │
│ updatedAt: 2025-10-05T...                   │
└─────────────────────────────────────────────┘
```

## 🗂️ S3 Bucket Structure

```
shackles-25-26/
├── payment-proof/
│   ├── 1728123456789-abc123.png  ← User 1's screenshot
│   ├── 1728123457890-def456.png  ← User 2's screenshot
│   ├── 1728123458901-ghi789.png  ← User 3's screenshot
│   └── ...
│
└── participant-qr-code/
    ├── john-doe-REG001.png  ← Generated after verification
    ├── jane-smith-REG002.png
    └── ...
```

## 📧 Email Flow

```
Registration Submitted
       ↓
┌──────────────────────────┐
│ Email Service            │
└──────────────────────────┘
       ↓
Send to: user@example.com
Subject: "Registration Received - SHACKLES 2025!"
       ↓
┌─────────────────────────────────┐
│ Thank you for registering!      │
│                                 │
│ Your Details:                   │
│ Name: John Doe                  │
│ Type: General Registration      │
│ Amount: ₹299                    │
│ Transaction: TXN123456          │
│                                 │
│ Status: Pending Verification    │
│                                 │
│ We will verify your payment     │
│ and send you confirmation       │
│ within 24-48 hours.             │
└─────────────────────────────────┘
       ↓
Admin Verifies Payment
       ↓
┌──────────────────────────┐
│ Verification Email       │
└──────────────────────────┘
       ↓
Send to: user@example.com
Subject: "Registration Approved - SHACKLES 2025!"
       ↓
┌─────────────────────────────────┐
│ Congratulations! ✓              │
│                                 │
│ Your registration is approved!  │
│                                 │
│ Attached: Your QR Code          │
│                                 │
│ Show this QR code at entry      │
└─────────────────────────────────┘
```

## 🎯 Admin Workflow (Future Enhancement)

```
┌─────────────────────────────────────────┐
│         ADMIN DASHBOARD                 │
├─────────────────────────────────────────┤
│                                         │
│ Pending Registrations: 15               │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ John Doe | john@example.com         ││
│ │ Type: General | Amount: ₹299        ││
│ │ TxnID: TXN123456                    ││
│ │ [View Screenshot] [Approve] [Reject]││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ Jane Smith | jane@example.com       ││
│ │ Type: Both | Amount: ₹499           ││
│ │ TxnID: TXN789012                    ││
│ │ [View Screenshot] [Approve] [Reject]││
│ └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
         ↓ Admin clicks [Approve]
┌─────────────────────────────────────────┐
│ Update Database:                        │
│ • paymentStatus → "verified"            │
│ • Generate QR code                      │
│ • Upload QR to S3                       │
│ • Send approval email with QR           │
└─────────────────────────────────────────┘
```

## 🎨 Color Scheme

```
Registration Type Buttons:
┌────────────┐
│ INACTIVE   │  Border: rgba(10, 215, 161, 0.3)
│            │  Background: rgba(0, 0, 0, 0.5)
└────────────┘

┌────────────┐
│  ACTIVE    │  Border: rgba(255, 255, 255, 0.8)
│            │  Background: gradient green/pink
│            │  Glow: rgba(10, 215, 161, 0.4)
│            │  Scale: 1.05
└────────────┘

QR Code Border:
  Border: 3px solid rgba(255, 255, 255, 0.8)
  Shadow: rgba(10, 215, 161, 0.3)

Success Icon:
  Color: rgba(255, 255, 255, 0.8)
  Glow: rgba(10, 215, 161, 0.6)
  Animation: scale-in
```

---

**Visual Guide Complete**  
For implementation details, see: `REGISTRATION_RESTRUCTURE.md`  
For testing, see: `REGISTRATION_CHECKLIST.md`

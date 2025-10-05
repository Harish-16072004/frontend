# Registration System Restructure

## Overview
The registration system has been completely restructured to simplify the user experience with a streamlined 2-step process and clear payment flow.

## New Registration Flow

### Step 1: Personal Details
Participants fill in the following information:
1. **First Name** - Required
2. **Last Name** - Required
3. **Email Address** - Required, validated
4. **Mobile Number** - Required, 10-digit validation
5. **College Name** - Required
6. **Location of College** - Required (new field)
7. **Department** - Required
8. **Year of Study** - Required (dropdown: 1st, 2nd, 3rd, 4th)
9. **Password** - Required, minimum 6 characters
10. **Re-enter Password** - Required, must match password

### Step 2: Payment Section
Participants select registration type and complete payment:

#### Registration Type Selection (Buttons)
Three clickable buttons for registration types:
- **General Registration**: ₹299
- **Workshop Only**: ₹199
- **Both (General + Workshop)**: ₹499

**Visual Feedback:**
- Inactive state: Gray border with glow effect
- Active state: Bright border with colored glow, scale effect
- Amount is displayed prominently below selection

#### Dynamic QR Code Display
- **Before Selection**: Dummy placeholder image shown
- **After Selection**: Appropriate QR code shown based on selection:
  - General → QR for ₹299
  - Workshop → QR for ₹199
  - Both → QR for ₹499

#### Payment Details
1. **Transaction ID** - Required text field
2. **Payment Screenshot Upload** - Required image file
3. **Terms & Conditions** - Required checkbox

#### Submit Button
After clicking submit:
- Shows loading state
- Uploads data and payment proof to S3
- Redirects to success page

### Step 3: Success Page
After successful submission:
- ✓ Success icon with animation
- "Registration Submitted!" message
- Confirmation details (email, registration type, amount)
- Message: "You will be notified through your registered email ID after verification"
- "Go to Login" button

## Technical Implementation

### Frontend Changes

#### File: `frontend/src/pages/Auth/Register.jsx`
**Changes:**
- Reduced from 3 steps to 2 steps
- Added `firstName`, `lastName` fields (replaced single `name`)
- Added `collegeLocation` field
- Added `password` and `confirmPassword` fields
- Removed event/workshop selection grid
- Added `registrationType` selection (general/workshop/both)
- Added dynamic QR code display
- Added success screen component
- Updated validation logic

**New State Fields:**
```javascript
{
  firstName: '',
  lastName: '',
  collegeLocation: '',
  password: '',
  confirmPassword: '',
  registrationType: '', // 'general', 'workshop', 'both'
}
```

**New Functions:**
- `handleRegistrationTypeChange(type)` - Updates registration type
- `getAmount()` - Returns amount based on registration type
- `getQRCode()` - Returns appropriate QR code image

#### File: `frontend/src/styles/Register.css`
**New Styles Added:**
- `.registration-type-section` - Container for registration buttons
- `.registration-buttons` - Grid layout for buttons
- `.registration-btn` - Individual registration type button
- `.registration-btn.active` - Active button state
- `.amount-display` - Shows total amount
- `.qr-section` - QR code container
- `.qr-image` - QR code image styling
- `.success-card` - Success page styling
- `.success-icon` - Animated checkmark
- `.back-home-btn` - Login redirect button

### Backend Changes

#### File: `backend/src/models/User.js`
**New Fields Added:**
```javascript
collegeLocation: String
registrationType: String (enum: 'general', 'workshop', 'both')
paymentAmount: Number
transactionId: String
paymentScreenshot: String (S3 URL)
paymentStatus: String (enum: 'pending', 'verified', 'rejected')
termsAccepted: Boolean
```

#### File: `backend/src/controllers/authController.js`
**Changes to `register` function:**
- Accepts new fields from frontend
- Validates all required fields
- Checks for payment screenshot upload
- Saves payment screenshot to S3 (via multer-s3)
- Sets payment status to 'pending'
- Sends registration pending email
- Returns success without JWT token (user logs in after verification)

**Response Format:**
```javascript
{
  success: true,
  message: 'Registration submitted successfully. You will be notified via email after verification.',
  data: {
    email: user.email,
    registrationType: user.registrationType,
    amount: user.paymentAmount
  }
}
```

#### File: `backend/src/routes/authRoutes.js`
**Changes:**
- Added `uploadPaymentProof` middleware to `/register` route
- Middleware uploads file to S3 before controller execution

#### File: `backend/src/middleware/upload.js`
**New Export Added:**
- `uploadPaymentProof` - Multer-S3 middleware for payment screenshots
- Uploads to `payment-proof/` folder in S3 bucket
- 5MB file size limit
- Only accepts images (JPEG, PNG)
- Sets ACL to 'public-read'

## QR Code Setup

### Required Files
Place these files in `frontend/public/`:

1. **qr-general-299.png** - QR for ₹299 (general registration)
2. **qr-workshop-199.png** - QR for ₹199 (workshop only)
3. **qr-both-499.png** - QR for ₹499 (both)
4. **qr-dummy.png** - Placeholder image (shown before selection)

### Image Requirements
- **Format**: PNG preferred (or JPG)
- **Size**: 300x300 pixels or larger
- **Quality**: High resolution, must be scannable
- **Background**: White or transparent

### QR Code Generation
1. Use UPI payment links with specific amounts
2. Generate QR codes using online tools
3. Test scanning before deployment
4. Update QR codes if payment details change

See `frontend/QR_CODES_SETUP.md` for detailed instructions.

## Email Templates

### Registration Pending Email
**Template Name:** `registration-pending`

**Subject:** "Registration Received - SHACKLES 2025!"

**Context Variables:**
- `name` - User's full name
- `registrationType` - Type of registration
- `amount` - Payment amount
- `transactionId` - Transaction reference ID

**Content:**
- Thank you message
- Registration details
- Payment pending verification notice
- Expected verification timeline
- Contact information

## Admin Verification Workflow

### Process
1. Admin receives new registration notification
2. Admin views payment screenshot in dashboard
3. Admin verifies transaction ID and amount
4. Admin approves or rejects registration
5. System sends email to user:
   - **Approved**: Welcome email + QR code
   - **Rejected**: Rejection email with reason

### Admin Dashboard Requirements
- List all pending registrations
- View payment screenshots (S3 URLs)
- Verify transaction details
- Approve/reject buttons
- Bulk approval option
- Filter by registration type

## Database Schema Updates

### User Collection
```javascript
{
  // Existing fields...
  
  // New fields
  collegeLocation: String,
  registrationType: 'general' | 'workshop' | 'both',
  paymentAmount: Number,
  transactionId: String,
  paymentScreenshot: String, // S3 URL
  paymentStatus: 'pending' | 'verified' | 'rejected',
  termsAccepted: Boolean,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### POST /api/v1/auth/register
**Request (multipart/form-data):**
```
firstName: string
lastName: string
email: string
phone: string
password: string
confirmPassword: string
college: string
collegeLocation: string
department: string
year: string
registrationType: 'general' | 'workshop' | 'both'
amount: number
transactionId: string
termsAccepted: boolean
paymentScreenshot: file (image)
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration submitted successfully. You will be notified via email after verification.",
  "data": {
    "email": "user@example.com",
    "registrationType": "both",
    "amount": 499
  }
}
```

**Error Responses:**
- 400: Missing required fields
- 400: User already exists
- 400: No payment screenshot uploaded
- 400: Invalid file type
- 413: File too large

## Testing Checklist

### Frontend Testing
- [ ] Step 1 validation (all fields required)
- [ ] Password match validation
- [ ] Email format validation
- [ ] Phone number validation (10 digits)
- [ ] Step navigation (next/back buttons)
- [ ] Registration type button selection
- [ ] QR code changes based on selection
- [ ] Amount display updates correctly
- [ ] File upload works
- [ ] Terms checkbox required
- [ ] Form submission
- [ ] Success page displays correctly
- [ ] Login redirect works

### Backend Testing
- [ ] Registration endpoint accepts multipart data
- [ ] File uploads to S3 successfully
- [ ] User created in database with all fields
- [ ] Payment status set to 'pending'
- [ ] Email sent to user
- [ ] Duplicate email validation
- [ ] File size limit enforced
- [ ] File type validation
- [ ] Error handling

### Integration Testing
- [ ] End-to-end registration flow
- [ ] QR code images load correctly
- [ ] S3 upload permissions work
- [ ] Email delivery
- [ ] Database records accurate
- [ ] Admin can view registrations
- [ ] Admin can verify payments

## Deployment Notes

### Environment Variables Required
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=shackles-25-26
```

### Pre-Deployment Tasks
1. Upload all QR code images to `frontend/public/`
2. Test QR codes are scannable
3. Configure email templates
4. Set up S3 bucket and folders
5. Test file upload permissions
6. Create admin verification dashboard
7. Set up email notifications for admins

### Post-Deployment Tasks
1. Monitor registration submissions
2. Check S3 storage usage
3. Verify email delivery
4. Test payment verification workflow
5. Monitor error logs
6. Back up payment screenshots

## Security Considerations

### Frontend
- Password minimum 6 characters
- Client-side validation
- File type restrictions
- File size limits (5MB)
- HTTPS required for password transmission

### Backend
- bcrypt password hashing
- JWT token authentication
- File type validation
- File size limits enforced
- S3 access control
- Input sanitization
- Rate limiting on registration endpoint
- Email verification (optional enhancement)

## Future Enhancements

### Possible Additions
1. **Email Verification**: Send verification link before payment
2. **Payment Gateway Integration**: Replace manual verification
3. **SMS Notifications**: Send SMS on registration status
4. **Bulk QR Generation**: Generate QR for multiple payments
5. **Payment Reminders**: Auto-reminder for pending payments
6. **Referral System**: Track referrals and give discounts
7. **Early Bird Discounts**: Time-based pricing
8. **Group Registrations**: Register multiple participants at once

## Support & Troubleshooting

### Common Issues

#### QR Codes Not Showing
- Check files are in `frontend/public/` directory
- Verify file names match exactly
- Check file permissions
- Clear browser cache

#### File Upload Fails
- Check S3 credentials in `.env`
- Verify bucket exists and is accessible
- Check bucket policy allows uploads
- Verify file size under 5MB
- Check file format (JPG/PNG only)

#### Registration Fails
- Check all required fields filled
- Verify passwords match
- Check email format
- Verify phone number (10 digits)
- Check file uploaded successfully
- Check terms checkbox selected

#### Email Not Received
- Check email service configuration
- Verify SMTP credentials
- Check spam folder
- Verify email template exists
- Check server logs for errors

### Contact
For technical support or questions:
- Email: support@shackles.acgcet.edu.in
- Documentation: Check related markdown files
- Logs: Check backend console and error logs

## Migration Notes

### From Old System
If migrating from previous registration system:
1. Export existing user data
2. Map old fields to new schema
3. Set `paymentStatus` for existing users to 'verified'
4. Generate QR codes for verified users
5. Send migration notification emails
6. Test old user login still works

### Database Migration Script
```javascript
// Sample migration for existing users
db.users.updateMany(
  { paymentStatus: { $exists: false } },
  { 
    $set: { 
      paymentStatus: 'pending',
      registrationType: 'general',
      termsAccepted: true
    }
  }
);
```

## Version History

### v2.0.0 (Current)
- Restructured registration to 2-step process
- Added dynamic QR code display
- Integrated S3 upload for payment proofs
- Added registration type selection
- Implemented success page
- Updated User model with new fields

### v1.0.0 (Previous)
- 3-step registration process
- Event/workshop selection grid
- Accommodation option
- Multiple payment methods

---

**Last Updated**: October 5, 2025  
**Author**: Development Team  
**Status**: Implemented & Ready for Testing

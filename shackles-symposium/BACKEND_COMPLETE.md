# SHACKLES 2025 Backend - Complete Documentation

## 📁 Complete Backend Structure

```
backend/
├── package.json                         ✅ (50+ dependencies)
├── .env.example                         ✅ (All configurations)
├── src/
│   ├── server.js                        ✅ (Main entry point)
│   ├── config/
│   │   ├── database.js                  ✅ (MongoDB connection)
│   │   ├── aws.js                       ✅ (S3 configuration)
│   │   ├── email.js                     ✅ (Nodemailer setup)
│   │   └── redis.js                     ✅ (Redis client)
│   ├── models/
│   │   ├── User.js                      ✅ (User schema)
│   │   ├── Event.js                     ✅ (Event schema)
│   │   ├── Workshop.js                  ✅ (Workshop schema)
│   │   ├── Registration.js              ✅ (Registration schema)
│   │   ├── Payment.js                   ✅ (Payment schema)
│   │   └── Attendance.js                ✅ (Attendance schema)
│   ├── controllers/
│   │   ├── authController.js            ✅ (344 lines - Auth logic)
│   │   ├── userController.js            ✅ (175 lines - User CRUD)
│   │   ├── eventController.js           ✅ (190 lines - Event management)
│   │   ├── workshopController.js        ✅ (164 lines - Workshop management)
│   │   ├── registrationController.js    ✅ (330 lines - Registration + QR/PDF)
│   │   ├── paymentController.js         ✅ (362 lines - Razorpay integration)
│   │   ├── adminController.js           ✅ (347 lines - Dashboard + Analytics)
│   │   └── attendanceController.js      ✅ (195 lines - QR scanning)
│   ├── routes/
│   │   ├── authRoutes.js                ✅ (Auth endpoints)
│   │   ├── userRoutes.js                ✅ (User endpoints)
│   │   ├── eventRoutes.js               ✅ (Event endpoints)
│   │   ├── workshopRoutes.js            ✅ (Workshop endpoints)
│   │   ├── registrationRoutes.js        ✅ (Registration endpoints)
│   │   ├── paymentRoutes.js             ✅ (Payment endpoints)
│   │   ├── adminRoutes.js               ✅ (Admin endpoints)
│   │   └── attendanceRoutes.js          ✅ (Attendance endpoints)
│   ├── middleware/
│   │   ├── auth.js                      ✅ (JWT authentication)
│   │   ├── errorHandler.js              ✅ (Global error handling)
│   │   ├── rateLimiter.js               ✅ (Rate limiting)
│   │   ├── upload.js                    ✅ (File upload - Multer)
│   │   └── validation.js                ✅ (Request validation)
│   ├── utils/
│   │   ├── emailService.js              ✅ (Email templates + sending)
│   │   ├── qrGenerator.js               ✅ (QR code generation)
│   │   ├── pdfGenerator.js              ✅ (Ticket PDF generation)
│   │   ├── excelGenerator.js            ✅ (Excel export)
│   │   ├── googleSheets.js              ✅ (Google Sheets export)
│   │   └── s3Upload.js                  ✅ (AWS S3 file upload)
│   └── validators/
│       ├── authValidator.js             ✅ (Auth validation rules)
│       ├── userValidator.js             ✅ (User validation rules)
│       └── registrationValidator.js     ✅ (Registration validation)
```

## 📊 Statistics
- **Total Files Created**: 41 files
- **Total Lines of Code**: ~5,000+ lines
- **Controllers**: 8 files (2,107 lines)
- **Routes**: 8 files
- **Models**: 6 files
- **Middleware**: 5 files
- **Utils**: 6 files
- **Validators**: 3 files
- **Config**: 4 files

## 🚀 Next Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

### 3. Configure Environment Variables
Edit `.env` file with your actual values:

**Database:**
```env
MONGODB_URI=your_mongodb_atlas_uri
```

**JWT:**
```env
JWT_SECRET=your_strong_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

**Email (SMTP):**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@shackles2025.com
EMAIL_FROM_NAME=SHACKLES 2025
```

**Razorpay:**
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**AWS S3 (Optional):**
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=shackles-uploads
```

**Frontend URL:**
```env
FRONTEND_URL=http://localhost:5173
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test Server
Server should start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes (`/api/v1/auth`)
```
POST   /register              - Register new user
POST   /login                 - Login user
POST   /logout                - Logout user
POST   /forgot-password       - Request password reset
PUT    /reset-password/:token - Reset password with token
PUT    /update-profile        - Update user profile
PUT    /update-password       - Update password
GET    /me                    - Get current user
```

### User Routes (`/api/v1/users`)
```
GET    /               - Get all users (Admin)
GET    /:id            - Get single user (Admin)
PUT    /:id            - Update user (Admin)
DELETE /:id            - Delete user (Admin)
GET    /:id/registrations - Get user registrations
GET    /:id/payments   - Get user payments
```

### Event Routes (`/api/v1/events`)
```
GET    /               - Get all events
GET    /:id            - Get single event
POST   /               - Create event (Admin)
PUT    /:id            - Update event (Admin)
DELETE /:id            - Delete event (Admin)
GET    /category/:category - Get events by category
GET    /:id/registrations  - Get event registrations (Admin)
```

### Workshop Routes (`/api/v1/workshops`)
```
GET    /               - Get all workshops
GET    /:id            - Get single workshop
POST   /               - Create workshop (Admin)
PUT    /:id            - Update workshop (Admin)
DELETE /:id            - Delete workshop (Admin)
GET    /:id/registrations - Get workshop registrations (Admin)
```

### Registration Routes (`/api/v1/registrations`)
```
POST   /               - Create registration
GET    /               - Get all registrations
GET    /:id            - Get single registration
PUT    /:id            - Update registration
DELETE /:id            - Delete registration
POST   /:id/cancel     - Cancel registration
GET    /:id/download-ticket - Download ticket PDF with QR code
```

### Payment Routes (`/api/v1/payments`)
```
POST   /create-order   - Create Razorpay order
POST   /verify         - Verify payment
GET    /               - Get user payments
GET    /:id            - Get single payment
POST   /:id/refund     - Process refund (Admin)
POST   /webhook        - Razorpay webhook
```

### Admin Routes (`/api/v1/admin`)
```
GET    /dashboard      - Dashboard statistics
GET    /analytics      - Analytics data
GET    /users          - All users list
GET    /registrations  - All registrations
GET    /payments       - All payments
POST   /bulk-email     - Send bulk email
POST   /export/excel   - Export to Excel
POST   /export/sheets  - Export to Google Sheets
```

### Attendance Routes (`/api/v1/attendance`)
```
POST   /mark           - Mark attendance
POST   /verify-qr      - Verify QR and mark attendance
GET    /user/:userId   - Get user attendance
GET    /:eventId       - Get event attendance (Admin)
POST   /export/:eventId - Export attendance to Excel
```

## 🔐 Authentication & Authorization

### Middleware Usage
```javascript
const { protect, authorize } = require('./middleware/auth');

// Protected route (requires login)
router.get('/profile', protect, getUserProfile);

// Admin only route
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Admin or Volunteer
router.post('/attendance/mark', protect, authorize('admin', 'volunteer'), markAttendance);
```

### Roles
- **user**: Regular user (default)
- **volunteer**: Can mark attendance
- **admin**: Full access to all operations

## 💳 Payment Integration (Razorpay)

### Create Order Flow
1. Frontend calls `/api/v1/payments/create-order`
2. Backend creates Razorpay order
3. Frontend shows Razorpay checkout
4. After payment, frontend calls `/api/v1/payments/verify`
5. Backend verifies signature and updates registration

### Webhook Setup
Set webhook URL in Razorpay Dashboard:
```
https://yourdomain.com/api/v1/payments/webhook
```

## 📧 Email Templates Available

1. **Welcome Email**: Sent on user registration
2. **Payment Success**: Sent after successful payment
3. **Password Reset**: Sent with reset token
4. **Bulk Email**: Admin can send custom emails

## 🎫 Ticket Generation

### QR Code Features
- Contains registration ID, user ID, event ID
- Used for attendance verification
- Generated using `qrcode` library

### PDF Ticket Features
- Event details
- User information
- QR code for scanning
- Professional formatting
- Generated using `pdfkit`

## 📊 Data Export Features

### Excel Export
- Registrations with all details
- Payments history
- Attendance records
- Color-coded status
- Auto-formatted columns

### Google Sheets Export
- Real-time sync
- Create new sheets or update existing
- Formatted headers
- Frozen header row

## 🛡️ Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: bcryptjs with salt rounds
3. **Rate Limiting**: Prevent DDoS attacks
4. **Helmet**: Security headers
5. **Mongo Sanitize**: Prevent NoSQL injection
6. **CORS**: Cross-origin resource sharing
7. **Cookie Security**: HttpOnly, Secure flags

## 🧪 Testing the Backend

### Using Postman/Thunder Client

1. **Register User**
```json
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "9876543210",
  "college": "ABC College"
}
```

2. **Login**
```json
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "Password123"
}
```
Save the token from response cookies.

3. **Get Events**
```
GET /api/v1/events
```

4. **Create Registration** (with token)
```json
POST /api/v1/registrations
Headers: Cookie: token=<your_token>
{
  "event": "event_id_here",
  "amount": 299
}
```

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Check MONGODB_URI in .env
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify database user credentials

**2. Email Not Sending**
- Check EMAIL_* variables in .env
- For Gmail, enable "Less secure app access" or use App Password
- Verify SMTP port (587 for TLS, 465 for SSL)

**3. Payment Verification Failing**
- Verify RAZORPAY_KEY_SECRET is correct
- Check signature generation logic
- Enable Razorpay test mode for development

**4. File Upload Not Working**
- Check AWS credentials
- Verify S3 bucket permissions
- Ensure CORS is configured on S3 bucket

## 📝 Additional Notes

### Database Indexes
Models include indexes for:
- User: email (unique)
- Event: name, category, date
- Registration: user, event, registrationNumber (unique)
- Payment: transactionId (unique), orderId

### Soft Delete
Events support soft delete with `isActive` flag

### Pagination
Most list endpoints support:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### File Uploads
- Profile pictures: Max 5MB
- Documents: Max 10MB
- Allowed formats: jpg, jpeg, png, pdf

## 🎯 Production Deployment Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB Atlas cluster
- [ ] Set up proper email service (not Gmail)
- [ ] Configure AWS S3 for production
- [ ] Enable Razorpay live mode
- [ ] Set up SSL/TLS certificates
- [ ] Configure environment variables on server
- [ ] Set up proper logging (Winston, Morgan)
- [ ] Enable rate limiting
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Configure backup strategy for MongoDB
- [ ] Set up CI/CD pipeline
- [ ] Enable Razorpay webhooks
- [ ] Test all payment flows
- [ ] Set up error tracking (Sentry)

## 📚 Tech Stack Summary

- **Runtime**: Node.js 20.x
- **Framework**: Express 4.18.2
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Payment**: Razorpay
- **Email**: Nodemailer
- **File Upload**: Multer + AWS S3
- **PDF**: PDFKit
- **QR Code**: qrcode
- **Excel**: ExcelJS
- **Validation**: express-validator
- **Security**: helmet, express-mongo-sanitize, express-rate-limit

## 🎉 Backend Implementation Complete!

All 41 backend files have been successfully created with production-ready code including:
- Complete CRUD operations for all entities
- Razorpay payment integration
- QR code generation and scanning
- PDF ticket generation
- Email notifications
- Excel and Google Sheets export
- AWS S3 file uploads
- Admin dashboard with analytics
- Role-based access control
- Input validation
- Error handling
- Security features

**Total Backend Code**: ~5,000+ lines across 41 files

Ready for integration with frontend and deployment! 🚀

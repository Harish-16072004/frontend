# SHACKLES 25-26 Database Structure

## Overview
This document outlines the MongoDB database structure for the SHACKLES symposium website.

## Database Name
`shackles_symposium`

---

## Collections

### 1. **users**
Stores user registration and authentication data.

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  phone: String (required),
  college: String (required),
  department: String,
  year: Number,
  role: String (enum: ['participant', 'admin', 'coordinator'], default: 'participant'),
  isVerified: Boolean (default: false),
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `verificationToken`
- `resetPasswordToken`

---

### 2. **events**
Stores all event information (Technical, Non-Technical, Special Events, Workshops).

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  category: String (enum: ['technical', 'non-technical', 'special', 'workshop'], required),
  type: String (enum: ['individual', 'team'], required),
  maxTeamSize: Number (default: 1),
  rules: [String],
  prizes: {
    first: String,
    second: String,
    third: String
  },
  registrationFee: Number (required),
  venue: String,
  date: Date (required),
  time: String,
  maxParticipants: Number,
  currentParticipants: Number (default: 0),
  coordinators: [{
    name: String,
    phone: String,
    email: String
  }],
  isActive: Boolean (default: true),
  image: String (URL),
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

**Indexes:**
- `category`
- `isActive`
- `date`

---

### 3. **registrations**
Stores event registration data.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  eventId: ObjectId (ref: 'events', required),
  teamName: String (required for team events),
  teamMembers: [{
    name: String (required),
    email: String (required),
    phone: String (required),
    college: String (required),
    department: String,
    year: Number
  }],
  registrationNumber: String (unique, auto-generated),
  paymentStatus: String (enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending'),
  paymentId: String,
  paymentDetails: {
    amount: Number,
    method: String,
    transactionId: String,
    paidAt: Date
  },
  status: String (enum: ['registered', 'confirmed', 'cancelled', 'waitlist'], default: 'registered'),
  qrCode: String (URL to QR code),
  checkInStatus: Boolean (default: false),
  checkInTime: Date,
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

**Indexes:**
- `userId`
- `eventId`
- `registrationNumber` (unique)
- `paymentStatus`
- `status`
- Compound: `userId + eventId` (unique)

---

### 4. **accommodations**
Stores accommodation requests.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  requestNumber: String (unique, auto-generated),
  name: String (required),
  email: String (required),
  phone: String (required),
  college: String (required),
  gender: String (enum: ['male', 'female', 'other'], required),
  checkInDate: Date (required),
  checkOutDate: Date (required),
  numberOfDays: Number (required),
  roomType: String (enum: ['shared', 'individual'], default: 'shared'),
  specialRequirements: String,
  accommodationFee: Number (required),
  paymentStatus: String (enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending'),
  paymentId: String,
  paymentDetails: {
    amount: Number,
    method: String,
    transactionId: String,
    paidAt: Date
  },
  status: String (enum: ['requested', 'confirmed', 'cancelled'], default: 'requested'),
  roomNumber: String,
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

**Indexes:**
- `userId`
- `requestNumber` (unique)
- `paymentStatus`
- `status`

---

### 5. **workshops**
Stores workshop-specific details (extends events).

```javascript
{
  _id: ObjectId,
  eventId: ObjectId (ref: 'events', required),
  instructor: {
    name: String (required),
    designation: String,
    organization: String,
    bio: String,
    image: String (URL)
  },
  duration: String (e.g., "2 hours"),
  prerequisites: [String],
  learningOutcomes: [String],
  materials: [String],
  certificates: Boolean (default: true),
  maxCapacity: Number (required),
  currentEnrollment: Number (default: 0),
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

**Indexes:**
- `eventId` (unique)

---

### 6. **contactMessages**
Stores contact form submissions.

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String,
  subject: String (required),
  message: String (required),
  status: String (enum: ['new', 'read', 'replied', 'archived'], default: 'new'),
  repliedAt: Date,
  repliedBy: ObjectId (ref: 'users'),
  ipAddress: String,
  createdAt: Date (default: Date.now)
}
```

**Indexes:**
- `email`
- `status`
- `createdAt`

---

### 7. **notifications**
Stores system notifications for users.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  title: String (required),
  message: String (required),
  type: String (enum: ['info', 'success', 'warning', 'error'], default: 'info'),
  category: String (enum: ['registration', 'payment', 'event', 'general'], required),
  isRead: Boolean (default: false),
  link: String,
  createdAt: Date (default: Date.now)
}
```

**Indexes:**
- `userId`
- `isRead`
- `createdAt`

---

### 8. **teamMembers**
Stores team/organizer information for the Team page.

```javascript
{
  _id: ObjectId,
  name: String (required),
  role: String (required),
  designation: String (required),
  category: String (enum: ['staff', 'office-bearer', 'executive', 'coordinator'], required),
  phone: String,
  email: String,
  linkedin: String,
  image: String (URL),
  order: Number (for display ordering),
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

**Indexes:**
- `category`
- `isActive`
- `order`

---

### 9. **settings**
Stores application settings and configurations.

```javascript
{
  _id: ObjectId,
  key: String (unique, required),
  value: Mixed (required),
  type: String (enum: ['string', 'number', 'boolean', 'object', 'array']),
  description: String,
  isPublic: Boolean (default: false),
  updatedBy: ObjectId (ref: 'users'),
  updatedAt: Date (default: Date.now)
}
```

**Common Settings:**
- `symposium_date`: Date
- `registration_open`: Boolean
- `payment_gateway_key`: String
- `max_registrations_per_user`: Number
- `accommodation_available`: Boolean
- `accommodation_rate`: Number

**Indexes:**
- `key` (unique)

---

### 10. **analytics**
Stores analytics and tracking data.

```javascript
{
  _id: ObjectId,
  eventType: String (enum: ['page_view', 'registration', 'payment', 'download'], required),
  eventName: String,
  userId: ObjectId (ref: 'users'),
  data: Mixed,
  ipAddress: String,
  userAgent: String,
  referrer: String,
  timestamp: Date (default: Date.now)
}
```

**Indexes:**
- `eventType`
- `userId`
- `timestamp`

---

## Relationships

```
users (1) ─── (M) registrations
users (1) ─── (M) accommodations
users (1) ─── (M) notifications
events (1) ─── (M) registrations
events (1) ─── (1) workshops
users (Admin) (1) ─── (M) contactMessages (replies)
```

---

## Initial Data Requirements

### Events to Create:
1. **Technical Events (6)**
   - Paper Presentation
   - Project Expo
   - CAD Design
   - Coding Challenge
   - Circuit Debugging
   - Technical Quiz

2. **Non-Technical Events (3)**
   - Strategy Games
   - Creative Writing
   - Photography Contest

3. **Special Events (2)**
   - Keynote Sessions
   - Panel Discussions

4. **Workshops (2)**
   - Industry-relevant technical workshops

### Admin User:
```javascript
{
  email: "admin@shackles.com",
  password: "hashed_password",
  name: "Admin",
  role: "admin",
  isVerified: true
}
```

---

## Environment Variables Required

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/shackles_symposium
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/shackles_symposium

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Gateway (Razorpay/Stripe)
PAYMENT_KEY_ID=your_payment_key
PAYMENT_KEY_SECRET=your_payment_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_PROD=https://shackles.com

# Other
PORT=5000
NODE_ENV=development
```

---

## API Endpoints Structure

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/verify-email` - Verify email
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password
- GET `/api/auth/me` - Get current user

### Events
- GET `/api/events` - Get all events (with filters)
- GET `/api/events/:id` - Get single event
- POST `/api/events` - Create event (Admin)
- PUT `/api/events/:id` - Update event (Admin)
- DELETE `/api/events/:id` - Delete event (Admin)

### Registrations
- POST `/api/registrations` - Register for event
- GET `/api/registrations/user` - Get user's registrations
- GET `/api/registrations/:id` - Get single registration
- PUT `/api/registrations/:id/cancel` - Cancel registration
- POST `/api/registrations/:id/payment` - Process payment

### Accommodations
- POST `/api/accommodations` - Request accommodation
- GET `/api/accommodations/user` - Get user's accommodation requests
- GET `/api/accommodations/:id` - Get single request
- PUT `/api/accommodations/:id` - Update request
- DELETE `/api/accommodations/:id` - Cancel request

### Contact
- POST `/api/contact` - Submit contact form
- GET `/api/contact` - Get all messages (Admin)
- PUT `/api/contact/:id` - Update message status (Admin)

### Admin
- GET `/api/admin/dashboard` - Get dashboard stats
- GET `/api/admin/registrations` - Get all registrations
- GET `/api/admin/users` - Get all users
- PUT `/api/admin/registrations/:id/checkin` - Check-in participant

---

## Notes for Collaborator

1. **Start with User Authentication**: Implement user registration, login, and JWT authentication first.

2. **Then Events CRUD**: Create the events collection and API endpoints.

3. **Registration Flow**: Implement event registration with payment integration.

4. **Admin Panel**: Build admin dashboard to manage events, registrations, and users.

5. **Testing**: Use MongoDB Compass or Postman to test all endpoints.

6. **Validation**: Use Joi or express-validator for input validation.

7. **Error Handling**: Implement centralized error handling middleware.

8. **Security**: 
   - Use helmet.js for security headers
   - Implement rate limiting
   - Sanitize user inputs
   - Use bcrypt for password hashing

9. **File Uploads**: Use multer for image uploads (if needed)

10. **Email Service**: Set up nodemailer for verification and notification emails

---

## Sample Code Structure

```
server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── config.js          # Environment variables
├── models/
│   ├── User.js
│   ├── Event.js
│   ├── Registration.js
│   └── ...
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   ├── registrationController.js
│   └── ...
├── routes/
│   ├── auth.js
│   ├── events.js
│   ├── registrations.js
│   └── ...
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── error.js           # Error handler
│   └── validation.js      # Input validation
├── utils/
│   ├── sendEmail.js
│   ├── generateQR.js
│   └── helpers.js
└── server.js              # Entry point
```

---

## Priority Tasks for Backend Developer

1. ✅ Set up MongoDB connection
2. ✅ Create User model and authentication
3. ✅ Create Event model and CRUD operations
4. ✅ Implement registration system
5. ✅ Integrate payment gateway
6. ✅ Create admin routes
7. ✅ Set up email service
8. ✅ Implement file upload for images
9. ✅ Create analytics/logging
10. ✅ Write API documentation

---

## Contact
For questions about the database structure, contact the frontend team or refer to this document.

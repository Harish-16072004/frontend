# SHACKLES 25-26 Backend Development Guide

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual credentials.

4. **Install required packages**
   ```bash
   npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet express-rate-limit express-validator nodemailer multer cloudinary qrcode
   ```

5. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

6. **Run the server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

---

## Package.json Scripts

Add these to your `server/package.json`:

```json
{
  "name": "shackles-backend",
  "version": "1.0.0",
  "description": "Backend for SHACKLES 25-26 Symposium",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seeder.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "nodemailer": "^6.9.7",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "qrcode": "^1.5.3",
    "razorpay": "^2.9.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## Project Structure

```
server/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── cloudinary.js         # Cloudinary config (optional)
├── models/
│   ├── User.js              ✅ Created
│   ├── Event.js             ✅ Created
│   ├── Registration.js      ✅ Created
│   ├── Accommodation.js     ✅ Created
│   ├── Workshop.js          ⏳ To create
│   ├── ContactMessage.js    ⏳ To create
│   └── Notification.js      ⏳ To create
├── controllers/
│   ├── authController.js    ⏳ To create
│   ├── eventController.js   ⏳ To create
│   ├── registrationController.js ⏳ To create
│   ├── accommodationController.js ⏳ To create
│   ├── adminController.js   ⏳ To create
│   └── contactController.js ⏳ To create
├── routes/
│   ├── auth.js              ⏳ To create
│   ├── events.js            ⏳ To create
│   ├── registrations.js     ⏳ To create
│   ├── accommodations.js    ⏳ To create
│   ├── admin.js             ⏳ To create
│   └── contact.js           ⏳ To create
├── middleware/
│   ├── auth.js              ⏳ To create - JWT verification
│   ├── error.js             ⏳ To create - Error handler
│   ├── validate.js          ⏳ To create - Input validation
│   └── upload.js            ⏳ To create - File upload
├── utils/
│   ├── sendEmail.js         ⏳ To create
│   ├── generateQR.js        ⏳ To create
│   ├── seeder.js            ⏳ To create - Database seeder
│   └── helpers.js           ⏳ To create
├── .env.example             ✅ Created
└── server.js                ⏳ To create - Entry point
```

---

## Development Priority

### Phase 1: Foundation (Week 1)
1. ✅ Set up MongoDB connection (`config/db.js`)
2. ✅ Create core models (User, Event, Registration, Accommodation)
3. ⏳ Create basic Express server (`server.js`)
4. ⏳ Implement authentication middleware
5. ⏳ Create auth routes (register, login, verify)

### Phase 2: Core Features (Week 2)
1. ⏳ Implement Event CRUD operations
2. ⏳ Create Registration system
3. ⏳ Integrate payment gateway (Razorpay)
4. ⏳ Implement email notifications
5. ⏳ Create accommodation booking

### Phase 3: Admin Panel (Week 3)
1. ⏳ Admin dashboard API
2. ⏳ Registration management
3. ⏳ Check-in system
4. ⏳ Analytics endpoints
5. ⏳ Export functionality

### Phase 4: Polish (Week 4)
1. ⏳ Error handling & validation
2. ⏳ Security hardening
3. ⏳ Rate limiting
4. ⏳ API documentation
5. ⏳ Testing

---

## Sample Server.js

Create `server/server.js`:

```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'SHACKLES API is running' });
});

// Import routes (create these files)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/events', require('./routes/events'));
// app.use('/api/registrations', require('./routes/registrations'));
// app.use('/api/accommodations', require('./routes/accommodations'));
// app.use('/api/contact', require('./routes/contact'));
// app.use('/api/admin', require('./routes/admin'));

// Error handler middleware (create this)
// app.use(require('./middleware/error'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

---

## Sample Authentication Middleware

Create `server/middleware/auth.js`:

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
```

---

## Sample Auth Controller

Create `server/controllers/authController.js`:

```javascript
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, college } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      phone,
      college,
      verificationToken
    });

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your email - SHACKLES 25-26',
      text: `Please click this link to verify your email: ${verificationUrl}`
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

---

## Testing with Postman/Thunder Client

### Sample Requests:

**1. Register User**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "college": "ACGCET"
}
```

**2. Login User**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**3. Get Events**
```
GET http://localhost:5000/api/events?category=technical
```

---

## Database Seeding

Create `server/utils/seeder.js` to populate initial data:

```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    await Event.deleteMany();
    await User.deleteMany();

    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@shackles.com',
      password: 'admin123',
      phone: '1234567890',
      college: 'ACGCET',
      role: 'admin',
      isVerified: true
    });

    // Create sample events
    await Event.create([
      {
        title: 'Paper Presentation',
        description: 'Present your research papers',
        category: 'technical',
        type: 'team',
        maxTeamSize: 3,
        registrationFee: 200,
        date: new Date('2025-10-23'),
        time: '10:00 AM'
      },
      // Add more events...
    ]);

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
```

Run: `npm run seed`

---

## Important Notes

1. **Security**: Always hash passwords, validate inputs, use HTTPS in production
2. **Error Handling**: Implement proper error handling for all routes
3. **Validation**: Use express-validator or Joi for input validation
4. **Testing**: Test all endpoints with Postman/Thunder Client
5. **Documentation**: Document all API endpoints
6. **Git**: Commit frequently with meaningful messages

---

## Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Razorpay Docs](https://razorpay.com/docs/)
- [Nodemailer Docs](https://nodemailer.com/)

---

## Questions?

Refer to `DATABASE_STRUCTURE.md` for complete database schema and API endpoints list.

Good luck! 🚀

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const colors = require('colors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Sanitize data
app.use(mongoSanitize());

// Compress responses
app.use(compression());

// Apply rate limiting to API routes
app.use('/api/', rateLimiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SHACKLES Backend API is running!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/events', require('./routes/eventRoutes'));
app.use('/api/v1/workshops', require('./routes/workshopRoutes'));
app.use('/api/v1/registrations', require('./routes/registrationRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/attendance', require('./routes/attendanceRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SHACKLES 25-26 API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      events: '/api/v1/events',
      workshops: '/api/v1/workshops',
      registrations: '/api/v1/registrations',
      payments: '/api/v1/payments',
      admin: '/api/v1/admin',
      attendance: '/api/v1/attendance'
    }
  });
});

// Error handler (must be last middleware)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(70).cyan);
  console.log('  🚀 SHACKLES 25-26 BACKEND SERVER'.green.bold);
  console.log('  Department of Mechanical Engineering, ACGCET'.gray);
  console.log('═'.repeat(70).cyan + '\n');
  console.log(`  ⚡ Server:      ${`http://localhost:${PORT}`.green}`);
  console.log(`  🌍 Environment: ${process.env.NODE_ENV.yellow}`);
  console.log(`  📊 Database:    ${process.env.MONGODB_URI ? 'Connected'.green : 'Not Connected'.red}`);
  console.log(`  🔒 CORS:        ${process.env.FRONTEND_URL.cyan}`);
  console.log('\n' + '═'.repeat(70).cyan + '\n');
  console.log('  ✨ Ready to accept requests!'.cyan.bold + '\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = app;

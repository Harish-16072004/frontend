const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const colors = require('colors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Sanitize data
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
  message: 'Too many requests from this IP, please try again after 10 minutes'
});
app.use('/api/', limiter);

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Mount routes (to be added later)
// app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/events', require('./routes/events'));
// app.use('/api/v1/registrations', require('./routes/registrations'));
// app.use('/api/v1/accommodations', require('./routes/accommodations'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SHACKLES Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SHACKLES 25-26 API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      // auth: '/api/v1/auth',
      // events: '/api/v1/events',
      // registrations: '/api/v1/registrations',
      // accommodations: '/api/v1/accommodations'
    }
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  console.log(`║                                                        ║`);
  console.log(`║        🚀 SHACKLES 25-26 Backend Server 🚀           ║`);
  console.log(`║                                                        ║`);
  console.log(`╚════════════════════════════════════════════════════════╝\n`);
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  console.log(`API available at: http://localhost:${PORT}`.green);
  console.log(`Health check: http://localhost:${PORT}/api/health`.green);
  console.log(`\n✨ Ready to accept requests!\n`.cyan);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});

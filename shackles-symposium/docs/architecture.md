# Shackles Symposium - System Architecture

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Database Design](#database-design)
6. [API Design](#api-design)
7. [Security Architecture](#security-architecture)
8. [Deployment Architecture](#deployment-architecture)
9. [Scalability Considerations](#scalability-considerations)

---

## System Overview

Shackles Symposium is a full-stack event management platform designed for organizing technical and cultural symposiums. The system provides:

- **User Management**: Registration, authentication, and profile management
- **Event Management**: Browse, register, and participate in events
- **Workshop Management**: Enroll in technical workshops
- **Admin Dashboard**: Comprehensive admin controls for event organization
- **Payment Processing**: Secure payment gateway integration
- **Real-time Features**: QR code check-ins, live attendance tracking

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │
│   │   React UI   │────▶│  React Router│────▶│ Context API  │ │
│   │   (Vite)     │     │              │     │   (Auth)     │ │
│   └──────────────┘     └──────────────┘     └──────────────┘ │
│          │                                                      │
│          │ HTTPS/REST API                                      │
└──────────┼─────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │
│   │   Nginx      │────▶│  Node.js     │────▶│   Express    │ │
│   │ Load Balancer│     │   Runtime    │     │  Framework   │ │
│   └──────────────┘     └──────────────┘     └──────────────┘ │
│                                 │                              │
│                                 ▼                              │
│                    ┌────────────────────────┐                  │
│                    │   Middleware Layer     │                  │
│                    ├────────────────────────┤                  │
│                    │ • Authentication       │                  │
│                    │ • Rate Limiting        │                  │
│                    │ • Error Handling       │                  │
│                    │ • File Upload          │                  │
│                    │ • Validation           │                  │
│                    └────────────────────────┘                  │
│                                 │                              │
│                                 ▼                              │
│                    ┌────────────────────────┐                  │
│                    │  Controllers Layer     │                  │
│                    ├────────────────────────┤                  │
│                    │ • Auth Controller      │                  │
│                    │ • Event Controller     │                  │
│                    │ • User Controller      │                  │
│                    │ • Admin Controller     │                  │
│                    │ • Payment Controller   │                  │
│                    └────────────────────────┘                  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │
│   │   MongoDB    │     │    Redis     │     │   AWS S3     │ │
│   │  (Primary DB)│     │   (Cache)    │     │  (Storage)   │ │
│   └──────────────┘     └──────────────┘     └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           │                      │                      │
           ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│  • Email Service (SMTP)                                         │
│  • Payment Gateway (Razorpay)                                   │
│  • Google Sheets API                                            │
│  • QR Code Generator                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.4.20
- **Routing**: React Router DOM 7.1.3
- **State Management**: Context API
- **HTTP Client**: Axios
- **Styling**: Custom CSS with Squid Game theme

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + AWS S3
- **Validation**: Express Validator

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Security Scanning**: SonarQube, OWASP Dependency Check
- **Monitoring**: Health checks, logging

---

## Component Architecture

### Frontend Components

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Footer.jsx          # Page footer
│   │   └── Loader.jsx          # Loading spinner
│   ├── PrivateRoute.jsx        # Protected route wrapper
│   └── ...
├── pages/
│   ├── Home.jsx                # Landing page
│   ├── Events/                 # Event-related pages
│   ├── Auth/                   # Login/Register
│   └── Admin/                  # Admin dashboard pages
├── context/
│   └── AuthContext.jsx         # Global auth state
├── services/
│   └── api.js                  # API client configuration
└── hooks/
    ├── useAuth.jsx             # Authentication hook
    └── useApi.js               # API call hook
```

### Backend Architecture

```
src/
├── server.js                   # Application entry point
├── config/
│   ├── database.js             # MongoDB connection
│   ├── redis.js                # Redis configuration
│   ├── aws.js                  # AWS S3 setup
│   └── email.js                # Email service config
├── models/
│   ├── User.js                 # User schema
│   ├── Event.js                # Event schema
│   ├── Workshop.js             # Workshop schema
│   ├── Registration.js         # Registration schema
│   ├── Payment.js              # Payment schema
│   └── Attendance.js           # Attendance schema
├── controllers/
│   ├── authController.js       # Authentication logic
│   ├── eventController.js      # Event CRUD operations
│   ├── userController.js       # User management
│   ├── adminController.js      # Admin operations
│   ├── paymentController.js    # Payment processing
│   └── ...
├── middleware/
│   ├── auth.js                 # JWT verification
│   ├── validation.js           # Request validation
│   ├── errorHandler.js         # Error handling
│   ├── rateLimiter.js          # Rate limiting
│   └── upload.js               # File upload handling
├── routes/
│   ├── authRoutes.js           # Auth endpoints
│   ├── eventRoutes.js          # Event endpoints
│   ├── userRoutes.js           # User endpoints
│   ├── adminRoutes.js          # Admin endpoints
│   └── ...
├── validators/
│   ├── authValidator.js        # Auth input validation
│   ├── registrationValidator.js# Registration validation
│   └── userValidator.js        # User data validation
└── utils/
    ├── emailService.js         # Email sending
    ├── qrGenerator.js          # QR code generation
    ├── pdfGenerator.js         # PDF creation
    ├── s3Upload.js             # S3 file operations
    └── ...
```

---

## Database Design

### Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  phone: String,
  college: String,
  year: String,
  branch: String,
  role: String (enum: ['user', 'admin']),
  isVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Events Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String (enum: ['Technical', 'Cultural', 'Sports']),
  venue: String,
  eventDate: Date,
  registrationDeadline: Date,
  maxParticipants: Number,
  currentParticipants: Number,
  registrationFee: Number,
  image: String (S3 URL),
  rules: [String],
  prizes: { first, second, third },
  coordinators: [{ name, phone, email }],
  status: String (enum: ['upcoming', 'ongoing', 'completed']),
  createdAt: Date,
  updatedAt: Date
}
```

#### Registrations Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  workshopId: ObjectId (ref: Workshop),
  status: String (enum: ['pending', 'confirmed', 'cancelled']),
  paymentStatus: String,
  paymentId: String,
  qrCode: String,
  checkedIn: Boolean,
  checkedInAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- `Users.email`: Unique index for fast lookup
- `Events.eventDate`: Index for date-based queries
- `Registrations.userId + eventId`: Compound index to prevent duplicate registrations

---

## API Design

### Base URL
```
Development: http://localhost:5000/api
Production:  https://api.shackles-symposium.com/api
```

### Authentication Endpoints
```
POST   /auth/register          # Register new user
POST   /auth/login             # User login
POST   /auth/forgot-password   # Request password reset
POST   /auth/reset-password    # Reset password
GET    /auth/me                # Get current user
POST   /auth/verify-email      # Verify email address
```

### Event Endpoints
```
GET    /events                 # Get all events
GET    /events/:id             # Get event by ID
POST   /events                 # Create event (admin)
PUT    /events/:id             # Update event (admin)
DELETE /events/:id             # Delete event (admin)
```

### Registration Endpoints
```
POST   /registrations          # Register for event
GET    /registrations/my       # Get user's registrations
GET    /registrations/:id      # Get registration details
PUT    /registrations/:id      # Update registration
DELETE /registrations/:id      # Cancel registration
```

### Admin Endpoints
```
GET    /admin/dashboard        # Get dashboard stats
GET    /admin/users            # Get all users
GET    /admin/events           # Get all events with stats
POST   /admin/check-in         # Check-in participant
GET    /admin/reports          # Generate reports
```

---

## Security Architecture

### Authentication & Authorization
- **JWT-based authentication** with HttpOnly cookies
- **Role-based access control** (RBAC) for admin routes
- **Password hashing** using bcrypt
- **Token expiration** and refresh mechanisms

### Data Security
- **Input validation** on all endpoints
- **SQL/NoSQL injection prevention** via Mongoose sanitization
- **XSS protection** with express-xss-sanitizer
- **CORS configuration** for allowed origins
- **Rate limiting** to prevent abuse
- **Helmet.js** for security headers

### File Security
- **File type validation** for uploads
- **Size limits** on file uploads
- **Secure S3 bucket policies**
- **Signed URLs** for private content

### Secrets Management
- Environment variables for sensitive data
- Kubernetes secrets for production
- No hardcoded credentials

---

## Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend: http://localhost:3000
├── Backend:  http://localhost:5000
├── MongoDB:  localhost:27017
└── Redis:    localhost:6379
```

### Production Environment (Kubernetes)
```
Cloud Provider (AWS/GCP/Azure)
├── Load Balancer (Nginx Ingress)
│   ├── SSL/TLS Termination
│   └── Domain Routing
├── Frontend Pods (2-5 replicas)
│   └── Nginx serving React build
├── Backend Pods (3-10 replicas)
│   ├── Node.js + Express
│   └── Auto-scaling based on CPU/Memory
├── MongoDB Atlas (Managed)
│   ├── Replica Set
│   └── Automated Backups
├── Redis Cluster (Managed)
│   └── Session + Cache storage
└── AWS S3 (Object Storage)
    └── User uploads + static assets
```

### CI/CD Pipeline
```
Developer Push
    ↓
GitHub Actions Trigger
    ↓
┌─────────────────────┐
│   Build & Test      │
│ • Lint code         │
│ • Run unit tests    │
│ • Security scan     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Build Docker Images│
│ • Backend image     │
│ • Frontend image    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Push to Registry    │
│ • Docker Hub /ECR   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Deploy to K8s       │
│ • Update deployment │
│ • Rolling update    │
│ • Health checks     │
└─────────────────────┘
```

---

## Scalability Considerations

### Horizontal Scaling
- **Stateless backend** allows multiple pod replicas
- **Kubernetes HPA** for automatic scaling based on metrics
- **Load balancer** distributes traffic evenly

### Database Scaling
- **MongoDB sharding** for large data volumes
- **Read replicas** for read-heavy operations
- **Indexing strategy** for query optimization

### Caching Strategy
- **Redis caching** for frequently accessed data
- **CDN** for static assets and images
- **Browser caching** with proper cache headers

### Performance Optimization
- **Lazy loading** for frontend components
- **Code splitting** in React build
- **Database query optimization**
- **API response pagination**
- **Image compression** before upload

---

## Monitoring & Logging

### Application Monitoring
- Health check endpoints for liveness/readiness probes
- Error logging with timestamps and stack traces
- Performance metrics (response times, throughput)

### Infrastructure Monitoring
- Kubernetes metrics (CPU, memory, pod status)
- Database connection pool monitoring
- Redis cache hit/miss ratios

### Logging Strategy
- Centralized logging with ELK stack or CloudWatch
- Structured logging (JSON format)
- Log levels: ERROR, WARN, INFO, DEBUG

---

## Future Enhancements

1. **Real-time Features**: WebSocket integration for live updates
2. **Mobile App**: React Native version
3. **Analytics Dashboard**: Event insights and user behavior
4. **Social Integration**: OAuth with Google/Facebook
5. **AI-powered Recommendations**: Personalized event suggestions
6. **Multi-language Support**: Internationalization (i18n)
7. **Progressive Web App**: Offline capabilities

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintained by**: Shackles Symposium Development Team

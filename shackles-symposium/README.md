# 🎯 Shackles Symposium - Event Management Platform

<div align="center">

![Shackles Logo](https://via.placeholder.com/200x200?text=SHACKLES)

**A full-stack event management platform with Squid Game-inspired UI theme**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**Shackles Symposium** is a comprehensive event management platform designed for organizing technical and cultural symposiums. Built with modern web technologies and featuring a unique **Squid Game-themed UI**, this platform provides:

- ✅ **Complete Event Management**: Create, manage, and track events
- ✅ **Workshop Enrollment**: Technical workshop registration and tracking
- ✅ **User Authentication**: Secure JWT-based authentication
- ✅ **Admin Dashboard**: Comprehensive admin controls with real-time statistics
- ✅ **Payment Integration**: Razorpay payment gateway support
- ✅ **QR Code Check-ins**: Quick event check-in system
- ✅ **Real-time Analytics**: Dashboard with live statistics
- ✅ **Responsive Design**: Mobile-first approach with stunning Squid Game theme

---

## ✨ Features

### For Users
- 🔐 **Secure Registration & Login** with email verification
- 🎪 **Browse Events** by category (Technical, Cultural, Sports)
- 📝 **Easy Registration** for events and workshops
- 💳 **Secure Payments** via Razorpay integration
- 📱 **QR Code Tickets** for quick check-ins
- 👤 **Profile Management** with registration history

### For Administrators
- 📊 **Comprehensive Dashboard** with real-time statistics
- 👥 **User Management** - view, edit, and manage users
- 🎯 **Event Management** - CRUD operations for events
- ✅ **Attendance Tracking** with QR code scanning
- 💰 **Payment Verification** and revenue tracking
- 📦 **Kit Distribution** management
- 📈 **Analytics & Reports** - Excel/PDF export

### Technical Features
- 🚀 **High Performance** with Redis caching
- 🔒 **Security** - JWT, rate limiting, input validation
- 📦 **File Uploads** to AWS S3
- 📧 **Email Notifications** for important events
- 🎨 **Modern UI** with Squid Game theme (pink #E31B6C, cyan #0AD7A1)
- 🐳 **Docker Support** for easy deployment
- ☸️ **Kubernetes Ready** for scalability
- 🔄 **CI/CD Pipelines** with GitHub Actions

---

## 🛠️ Tech Stack

### Frontend
```
React 18.2.0      - UI Library
Vite 5.4.20       - Build Tool
React Router 6    - Routing
Axios             - HTTP Client
Context API       - State Management
Custom CSS        - Squid Game Theme
```

### Backend
```
Node.js           - Runtime
Express.js        - Web Framework
MongoDB           - Database
Mongoose          - ODM
Redis             - Caching
JWT               - Authentication
Multer + S3       - File Uploads
Nodemailer        - Email Service
```

### DevOps
```
Docker            - Containerization
Kubernetes        - Orchestration
GitHub Actions    - CI/CD
SonarQube         - Code Quality
OWASP             - Security Scanning
```

---

## 📁 Project Structure

```
shackles-symposium/
│
├── BACKEND/                    # Node.js + Express backend
│   ├── src/
│   │   ├── server.js          # Application entry point
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── utils/             # Helper functions
│   │   └── validators/        # Input validation
│   └── package.json
│
├── FRONTEND/                   # React + Vite frontend
│   ├── src/
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Root component
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context
│   │   ├── services/          # API calls
│   │   └── hooks/             # Custom hooks
│   └── package.json
│
├── .github/workflows/          # CI/CD pipelines
│   ├── ci-pipeline.yml        # Build & test
│   └── security-scan.yml      # Security scanning
│
├── docker/                     # Docker configurations
│   ├── docker-compose.yml     # Multi-container setup
│   ├── Dockerfile.backend     # Backend image
│   ├── Dockerfile.frontend    # Frontend image
│   └── nginx-frontend.conf    # Nginx config
│
├── kubernetes/                 # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── ingress.yaml
│
├── scripts/                    # Utility scripts
│   ├── setup.sh               # Environment setup
│   └── seed-db.js             # Database seeder
│
├── tests/                      # Test suites
│   ├── e2e/                   # End-to-end tests
│   ├── integration/           # Integration tests
│   └── load/                  # Load testing
│
├── docs/                       # Documentation
│   ├── architecture.md        # System architecture
│   ├── setup-guide.md         # Setup instructions
│   └── api/                   # API documentation
│
├── security/                   # Security configurations
│   ├── sast/                  # Static analysis
│   ├── dast/                  # Dynamic analysis
│   └── dependency-check/      # Dependency scanning
│
├── .env.example                # Environment template
├── .prettierrc                 # Code formatting
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v6.0+) or MongoDB Atlas account
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```powershell
   git clone https://github.com/your-username/shackles-symposium.git
   cd shackles-symposium
   ```

2. **Set up environment variables**
   ```powershell
   # Copy environment template
   cp .env.example BACKEND/.env
   cp .env.example FRONTEND/.env
   
   # Edit BACKEND/.env with your values
   # - MongoDB connection string
   # - JWT secret
   # - AWS credentials (optional)
   # - Email credentials (optional)
   ```

3. **Install dependencies**
   ```powershell
   # Backend
   cd BACKEND
   npm install
   
   # Frontend
   cd ../FRONTEND
   npm install
   ```

4. **Seed the database (optional)**
   ```powershell
   cd scripts
   node seed-db.js
   ```

5. **Start the application**
   ```powershell
   # Terminal 1 - Backend
   cd BACKEND
   npm run dev
   # Backend runs on http://localhost:5000
   
   # Terminal 2 - Frontend
   cd FRONTEND
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

**Note:** To seed the database with initial data, edit `scripts/seed-db.js` and add your data, then run `node scripts/seed-db.js`

---

## 🔧 Configuration

### Backend Configuration (`BACKEND/.env`)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/shackles_symposium
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shackles

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-chars
JWT_EXPIRE=7d

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend Configuration (`FRONTEND/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production:  https://api.shackles-symposium.com/api
```

### Authentication Endpoints
```http
POST   /auth/register          # Register new user
POST   /auth/login             # User login
GET    /auth/me                # Get current user
POST   /auth/forgot-password   # Request password reset
POST   /auth/reset-password    # Reset password
```

### Event Endpoints
```http
GET    /events                 # Get all events
GET    /events/:id             # Get event by ID
POST   /events                 # Create event (admin)
PUT    /events/:id             # Update event (admin)
DELETE /events/:id             # Delete event (admin)
```

### Registration Endpoints
```http
POST   /registrations          # Register for event
GET    /registrations/my       # Get user registrations
GET    /registrations/:id      # Get registration details
DELETE /registrations/:id      # Cancel registration
```

### Admin Endpoints
```http
GET    /admin/dashboard        # Dashboard statistics
GET    /admin/users            # All users
GET    /admin/events           # All events with stats
POST   /admin/check-in         # Check-in participant
```

**Full API Documentation**: See `docs/api/openapi.json` for complete OpenAPI specification

---

## 🐳 Docker Deployment

### Using Docker Compose

```powershell
cd docker
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Redis on port 6379
- Backend on port 5000
- Frontend on port 3000

### Individual Containers

```powershell
# Build images
docker build -f docker/Dockerfile.backend -t shackles-backend ./BACKEND
docker build -f docker/Dockerfile.frontend -t shackles-frontend ./FRONTEND

# Run containers
docker run -d -p 5000:5000 --name backend shackles-backend
docker run -d -p 3000:3000 --name frontend shackles-frontend
```

---

## ☸️ Kubernetes Deployment

```powershell
# Create namespace
kubectl create namespace shackles-symposium

# Create secrets
kubectl create secret generic shackles-secrets \
  --from-literal=mongodb-uri='your-mongodb-uri' \
  --from-literal=jwt-secret='your-jwt-secret' \
  --namespace=shackles-symposium

# Deploy
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/ingress.yaml

# Check status
kubectl get pods -n shackles-symposium
```

---

## 🔐 Security Features

- ✅ JWT-based authentication with HttpOnly cookies
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting to prevent abuse
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Dependency vulnerability scanning
- ✅ Static code analysis (SonarQube)

---

## 🧪 Testing

```powershell
# Backend tests
cd BACKEND
npm test

# Frontend tests
cd FRONTEND
npm test

# Integration tests
cd tests/integration
npm test

# E2E tests (if configured)
cd tests/e2e
npm test
```

---

## 📊 CI/CD Pipeline

GitHub Actions workflows automate:
- ✅ Code linting and formatting
- ✅ Unit and integration tests
- ✅ Security vulnerability scanning
- ✅ Docker image building
- ✅ Deployment to staging/production

**Workflows**: `.github/workflows/ci-pipeline.yml`, `.github/workflows/security-scan.yml`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Developed by**: Mechanical Engineering Association, ACGCET

**Lead Developer**: Harish J  
**Email**: harish16072004@gmail.com

---

## 🙏 Acknowledgments

- Squid Game for UI theme inspiration
- MongoDB Atlas for database hosting
- Vercel/Netlify for frontend hosting
- AWS for cloud infrastructure

---

## 📞 Support

For questions or issues:
- 📧 Email: harish16072004@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/shackles-symposium/issues)
- 📚 Documentation: See `/docs` folder

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by the Shackles Team

</div>

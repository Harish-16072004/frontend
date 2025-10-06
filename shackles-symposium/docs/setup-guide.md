# Shackles Symposium - Developer Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** (v8.x or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Alternatively, use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available)

### Optional Software
- **Docker** - [Download](https://www.docker.com/products/docker-desktop) (for containerized setup)
- **Redis** - [Download](https://redis.io/download) (for caching, optional but recommended)

### Check Prerequisites
```powershell
# Check Node.js version
node --version
# Should output: v16.x.x or higher

# Check npm version
npm --version
# Should output: v8.x.x or higher

# Check Git version
git --version
```

---

## Quick Start

For experienced developers who want to get started quickly:

```powershell
# 1. Clone the repository
git clone https://github.com/your-username/shackles-symposium.git
cd shackles-symposium

# 2. Run the setup script (Linux/Mac)
# ./scripts/setup.sh

# 3. Or manually:
# Create environment files
cp .env.example BACKEND/.env
cp .env.example FRONTEND/.env

# 4. Install dependencies
cd BACKEND; npm install; cd ..
cd FRONTEND; npm install; cd ..

# 5. Start MongoDB (if using local)
# mongod

# 6. Start backend
cd BACKEND; npm run dev; cd ..

# 7. Start frontend (in a new terminal)
cd FRONTEND; npm run dev
```

Open your browser:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Detailed Setup

### 1. Clone the Repository

```powershell
git clone https://github.com/your-username/shackles-symposium.git
cd shackles-symposium
```

### 2. Set Up MongoDB

#### Option A: Local MongoDB
```powershell
# Start MongoDB service
mongod

# In a new terminal, verify connection
mongosh
# Should connect to mongodb://localhost:27017
```

#### Option B: MongoDB Atlas (Recommended)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/shackles_symposium`

### 3. Set Up Redis (Optional but Recommended)

#### Windows
```powershell
# Download Redis for Windows from:
# https://github.com/microsoftarchive/redis/releases

# Or use Docker:
docker run -d -p 6379:6379 redis:7-alpine
```

#### Mac
```bash
brew install redis
redis-server
```

#### Linux
```bash
sudo apt-get install redis-server
redis-server
```

### 4. Create Environment Files

#### Backend Environment (`BACKEND/.env`)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/shackles_symposium
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shackles_symposium

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
JWT_EXPIRE=7d

# AWS S3 (optional - for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=shackles-uploads

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment (`FRONTEND/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

### 5. Install Dependencies

```powershell
# Backend dependencies
cd BACKEND
npm install

# Frontend dependencies
cd ../FRONTEND
npm install

# Return to root
cd ..
```

### 6. Seed the Database (Optional)

To populate the database with your initial data:

1. Edit `scripts/seed-db.js` and add your data to the arrays
2. Run the seeding script:

```powershell
cd scripts
node seed-db.js
```

**Note:** The seeder file is a template. You need to add your own user, event, and workshop data before running it.

---

## Configuration

### Backend Configuration

Edit `BACKEND/.env` to customize:

#### Required Settings
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A long, random string (minimum 32 characters)
- `PORT`: Backend server port (default: 5000)

#### Optional Settings
- `REDIS_HOST`, `REDIS_PORT`: Redis cache settings
- `AWS_*`: AWS S3 settings for file uploads
- `EMAIL_*`: SMTP settings for sending emails

### Frontend Configuration

Edit `FRONTEND/.env`:
- `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:5000/api)

### Squid Game Theme Customization

The UI uses a Squid Game theme defined in CSS variables:

**File**: `FRONTEND/src/index.css`

```css
:root {
  --primary-pink: #E31B6C;
  --primary-cyan: #0AD7A1;
  --dark-bg: #0a0a0a;
  --card-bg: #1a0a14;
}
```

---

## Running the Application

### Development Mode

#### Start Backend
```powershell
cd BACKEND
npm run dev
```
- Backend runs on: http://localhost:5000
- API endpoints: http://localhost:5000/api

#### Start Frontend (New Terminal)
```powershell
cd FRONTEND
npm run dev
```
- Frontend runs on: http://localhost:3000

### Production Mode

#### Build Frontend
```powershell
cd FRONTEND
npm run build
```
- Creates optimized build in `FRONTEND/dist`

#### Start Backend (Production)
```powershell
cd BACKEND
NODE_ENV=production node src/server.js
```

### Docker Setup (Alternative)

#### Using Docker Compose
```powershell
cd docker
docker-compose up
```

This starts:
- MongoDB on port 27017
- Redis on port 6379
- Backend on port 5000
- Frontend on port 3000

---

## Testing

### Run Backend Tests
```powershell
cd BACKEND
npm test
```

### Run Frontend Tests
```powershell
cd FRONTEND
npm test
```

### Run Integration Tests
```powershell
cd tests/integration
npm install
npm test
```

### Run E2E Tests (if configured)
```powershell
cd tests/e2e
npm install
npm test
```

---

## Deployment

### Using Docker

1. **Build Docker Images:**
```powershell
docker build -f docker/Dockerfile.backend -t shackles-backend ./BACKEND
docker build -f docker/Dockerfile.frontend -t shackles-frontend ./FRONTEND
```

2. **Run with Docker Compose:**
```powershell
cd docker
docker-compose up -d
```

### Using Kubernetes

1. **Create Namespace:**
```powershell
kubectl create namespace shackles-symposium
```

2. **Create Secrets:**
```powershell
kubectl create secret generic shackles-secrets `
  --from-literal=mongodb-uri='your-mongodb-uri' `
  --from-literal=jwt-secret='your-jwt-secret' `
  --namespace=shackles-symposium
```

3. **Deploy:**
```powershell
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/ingress.yaml
```

4. **Check Status:**
```powershell
kubectl get pods -n shackles-symposium
kubectl get services -n shackles-symposium
```

### Manual Deployment to Cloud

#### AWS EC2 / Azure VM / GCP Compute Engine

1. **SSH into server**
2. **Install Node.js, MongoDB, Redis**
3. **Clone repository**
4. **Set environment variables**
5. **Install dependencies**
6. **Build frontend**
7. **Use PM2 to run backend:**
```bash
npm install -g pm2
cd BACKEND
pm2 start src/server.js --name shackles-backend
pm2 save
pm2 startup
```

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `BACKEND/.env`
- If using Atlas, check network access settings

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### 3. Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
```powershell
cd BACKEND
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS Errors in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check `FRONTEND_URL` in `BACKEND/.env`
- Ensure backend CORS middleware is configured correctly

#### 5. JWT Token Invalid
```
Error: Invalid token
```
**Solution:**
- Clear browser cookies/localStorage
- Check `JWT_SECRET` is the same in backend .env
- Re-login to get a new token

#### 6. File Upload Fails
```
Error uploading file
```
**Solution:**
- Check AWS credentials in `BACKEND/.env`
- Verify S3 bucket permissions
- Check file size limits in `BACKEND/src/middleware/upload.js`

### Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: Open an issue on GitHub
- **Contact**: harish16072004@gmail.com

---

## Development Workflow

### Branch Strategy
```
main        → Production-ready code
develop     → Integration branch
feature/*   → New features
bugfix/*    → Bug fixes
hotfix/*    → Urgent production fixes
```

### Commit Message Format
```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(auth): add password reset functionality
```

### Code Style
- Run Prettier before committing:
```powershell
npm run format
```

- Run ESLint:
```powershell
npm run lint
```

---

## Project Structure Overview

```
shackles-symposium/
├── BACKEND/              # Node.js + Express backend
│   ├── src/
│   │   ├── server.js     # Entry point
│   │   ├── config/       # Database, AWS, Redis configs
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation, etc.
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── FRONTEND/             # React + Vite frontend
│   ├── src/
│   │   ├── main.jsx      # Entry point
│   │   ├── App.jsx       # Root component
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React Context
│   │   ├── services/     # API calls
│   │   └── hooks/        # Custom React hooks
│   └── package.json
│
├── docker/               # Docker configurations
├── kubernetes/           # Kubernetes manifests
├── scripts/              # Setup and seed scripts
├── tests/                # Test suites
├── docs/                 # Documentation
└── .github/workflows/    # CI/CD pipelines
```

---

## Next Steps

1. ✅ Complete environment setup
2. ✅ Run the application locally
3. 📝 Read the [Architecture Documentation](./architecture.md)
4. 🎨 Explore the Squid Game themed UI
5. 🔐 Test admin dashboard features
6. 🚀 Deploy to your preferred cloud platform

---

**Happy Coding!** 🎉

For any questions or issues, refer to the documentation or reach out to the development team.

**Last Updated**: January 2025  
**Version**: 1.0.0

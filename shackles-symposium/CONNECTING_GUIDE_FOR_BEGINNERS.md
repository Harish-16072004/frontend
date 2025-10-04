# 🔌 Complete Guide: Connecting Frontend, Backend & Database

## 📚 For Complete Beginners - SHACKLES Symposium

This guide will walk you through **step-by-step** how to connect your React frontend with the Node.js backend and MongoDB database.

---

## 🎯 What You're Connecting

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   FRONTEND      │  HTTP   │    BACKEND      │  CRUD   │    DATABASE     │
│   (React)       │ ◄─────► │   (Node.js)     │ ◄─────► │   (MongoDB)     │
│  Port: 5173     │ Requests│  Port: 5000     │ Queries │   Cloud/Local   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
     User sees              Processes logic            Stores data
     the website            & handles requests         permanently
```

---

## 📋 Prerequisites

Before starting, make sure you have installed:
- ✅ Node.js (v18 or higher) - [Download here](https://nodejs.org)
- ✅ Git - [Download here](https://git-scm.com)
- ✅ VS Code (recommended) - [Download here](https://code.visualstudio.com)
- ✅ MongoDB Atlas account (free) - [Sign up here](https://www.mongodb.com/cloud/atlas)

### Check if Node.js is installed:
```powershell
node --version
# Should show: v18.x.x or higher
```

---

## 🚀 STEP-BY-STEP SETUP

### 📍 STEP 1: Set Up MongoDB Database

#### 1.1 Create MongoDB Atlas Account (Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Start Free"** and create an account
3. Create a **FREE cluster** (M0 Sandbox - Free forever)
4. Choose your region (select closest to you, e.g., Mumbai for India)
5. Click **"Create Cluster"** and wait 3-5 minutes

#### 1.2 Create Database User

1. In MongoDB Atlas, go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `shackles_admin`
5. Password: Create a strong password (save it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

#### 1.3 Allow Network Access

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, use specific IP addresses
4. Click **"Confirm"**

#### 1.4 Get Your Connection String

1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://shackles_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **IMPORTANT:** Replace `<password>` with your actual password
6. Add database name: Replace `/?retryWrites` with `/shackles_db?retryWrites`

Final string should look like:
```
mongodb+srv://shackles_admin:yourPassword123@cluster0.xxxxx.mongodb.net/shackles_db?retryWrites=true&w=majority
```

---

### 📍 STEP 2: Configure Backend

#### 2.1 Create Backend Environment File

Navigate to backend folder and create `.env` file:

```powershell
# Open PowerShell in VS Code (Ctrl + `)
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\backend"

# Create .env file from example
Copy-Item .env.example .env

# Open .env file
code .env
```

#### 2.2 Edit Backend `.env` File

Open `backend/.env` and update these values:

```env
# ==========================================
# REQUIRED - Change these immediately
# ==========================================

# Environment
NODE_ENV=development
PORT=5000

# MongoDB - PASTE YOUR CONNECTION STRING HERE
MONGODB_URI=mongodb+srv://shackles_admin:yourPassword123@cluster0.xxxxx.mongodb.net/shackles_db?retryWrites=true&w=majority

# JWT Secret - CHANGE THIS to any random string
JWT_SECRET=my_super_secret_key_shackles_2025_change_this_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Frontend URL - This allows frontend to connect
FRONTEND_URL=http://localhost:5173

# ==========================================
# OPTIONAL - Can configure later
# ==========================================

# Email Configuration (for sending emails)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=SHACKLES 2025 <your.email@gmail.com>

# Razorpay (for payments - get from Razorpay dashboard)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# AWS S3 (for file uploads - optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=

# Redis (for caching - optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Admin Credentials (change these!)
ADMIN_EMAIL=admin@shackles.com
ADMIN_PASSWORD=Admin@2025
```

#### 2.3 Install Backend Dependencies

```powershell
# Make sure you're in backend folder
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\backend"

# Install all required packages
npm install

# This will install:
# - Express (web framework)
# - Mongoose (MongoDB connection)
# - JWT (authentication)
# - CORS (allows frontend to connect)
# - and all other dependencies
```

---

### 📍 STEP 3: Configure Frontend

#### 3.1 Create Frontend Environment File

```powershell
# Navigate to frontend folder
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\frontend"

# Create .env file
New-Item .env -ItemType File

# Open .env file
code .env
```

#### 3.2 Edit Frontend `.env` File

Add this content to `frontend/.env`:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api/v1

# App Configuration
VITE_APP_NAME=SHACKLES 2025
VITE_APP_VERSION=1.0.0

# Google Maps (optional - get from Google Cloud Console)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Razorpay (for payment display - get from Razorpay dashboard)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

**Important Notes:**
- ✅ `VITE_API_URL` tells frontend where the backend is running
- ✅ All Vite environment variables must start with `VITE_`
- ✅ Port 5000 is where your backend will run
- ✅ `/api/v1` is the base path for all API routes

#### 3.3 Install Frontend Dependencies

```powershell
# Make sure you're in frontend folder
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\frontend"

# Install all required packages
npm install

# This will install:
# - React
# - Vite
# - Axios (for API calls)
# - React Router (for navigation)
# - and all other dependencies
```

---

### 📍 STEP 4: Start Everything

#### 4.1 Start Backend Server (Terminal 1)

```powershell
# Open first terminal
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\backend"

# Start backend in development mode (auto-reloads on changes)
npm run dev

# You should see:
# ═══════════════════════════════════════════════════════════════════
#   🚀 SHACKLES 25-26 BACKEND SERVER
#   Department of Mechanical Engineering, ACGCET
# ═══════════════════════════════════════════════════════════════════
#   ⚡ Server:      http://localhost:5000
#   🌍 Environment: development
#   📊 Database:    Connected
#   🔒 CORS:        http://localhost:5173
# ═══════════════════════════════════════════════════════════════════
```

✅ **Backend is ready when you see "Database: Connected"**

#### 4.2 Start Frontend (Terminal 2)

```powershell
# Open second terminal (don't close the first one!)
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\frontend"

# Start frontend development server
npm run dev

# You should see:
#   VITE v5.x.x  ready in xxx ms
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: use --host to expose
```

✅ **Frontend is ready!**

---

### 📍 STEP 5: Test the Connection

#### 5.1 Test Backend Health

Open your browser and go to:
```
http://localhost:5000/health
```

You should see:
```json
{
  "success": true,
  "message": "SHACKLES Backend API is running!",
  "environment": "development",
  "timestamp": "2025-10-04T..."
}
```

#### 5.2 Test Backend API Endpoints

```
http://localhost:5000/
```

You should see all available endpoints:
```json
{
  "success": true,
  "message": "Welcome to SHACKLES 25-26 API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/v1/auth",
    "users": "/api/v1/users",
    "events": "/api/v1/events",
    ...
  }
}
```

#### 5.3 Test Frontend

Open your browser and go to:
```
http://localhost:5173/
```

You should see your **SHACKLES Symposium** homepage! 🎉

---

## 🔍 How the Connection Works

### When You Click a Button in Frontend:

```javascript
// 1. USER ACTION: User clicks "Login" button
// File: frontend/src/pages/Auth/Login.jsx

const handleLogin = async () => {
  // 2. FRONTEND sends HTTP request to BACKEND
  const response = await axios.post('/auth/login', {
    email: 'user@example.com',
    password: 'password123'
  });
  
  // 6. FRONTEND receives response
  console.log(response.data); // User data + token
};
```

```javascript
// 3. REQUEST INTERCEPTOR adds token
// File: frontend/src/services/api.js

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

```javascript
// 4. BACKEND receives request and processes
// File: backend/src/controllers/authController.js

exports.login = async (req, res) => {
  // Find user in database
  const user = await User.findOne({ email: req.body.email });
  
  // Check password
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  
  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
  // 5. BACKEND sends response
  res.json({ success: true, token, user });
};
```

### The Complete Flow:

```
USER CLICKS BUTTON
       ↓
FRONTEND (React) sends HTTP request via Axios
       ↓
BACKEND (Express) receives request
       ↓
BACKEND queries DATABASE (MongoDB)
       ↓
DATABASE returns data
       ↓
BACKEND processes data
       ↓
BACKEND sends response
       ↓
FRONTEND receives response
       ↓
FRONTEND updates UI
       ↓
USER SEES RESULT
```

---

## 🛠️ Common Issues & Solutions

### ❌ Issue 1: "Cannot connect to MongoDB"

**Symptoms:** Backend shows "Database: Not Connected"

**Solutions:**
```powershell
# Check 1: Is your connection string correct?
# Open backend/.env and verify MONGODB_URI

# Check 2: Did you replace <password> with your actual password?

# Check 3: Is your IP whitelisted in MongoDB Atlas?
# Go to Network Access and add 0.0.0.0/0

# Check 4: Test connection
cd backend
npm run dev
```

---

### ❌ Issue 2: "CORS Error" in Browser Console

**Symptoms:** 
```
Access to XMLHttpRequest at 'http://localhost:5000/api/v1/auth/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**
```powershell
# Check 1: Is backend .env FRONTEND_URL correct?
# backend/.env should have:
FRONTEND_URL=http://localhost:5173

# Check 2: Restart backend after changing .env
# Stop backend (Ctrl+C) and restart:
npm run dev
```

---

### ❌ Issue 3: "Network Error" or "Cannot reach backend"

**Symptoms:** Frontend shows "Network Error" when making API calls

**Solutions:**
```powershell
# Check 1: Is backend running?
# You should see backend terminal showing:
# "Server: http://localhost:5000"

# Check 2: Is frontend .env correct?
# frontend/.env should have:
VITE_API_URL=http://localhost:5000/api/v1

# Check 3: Restart frontend after changing .env
# Stop frontend (Ctrl+C) and restart:
npm run dev
```

---

### ❌ Issue 4: "Module not found" errors

**Symptoms:** Backend or Frontend won't start, shows module errors

**Solutions:**
```powershell
# Solution: Reinstall dependencies

# For Backend:
cd backend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install

# For Frontend:
cd frontend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

---

### ❌ Issue 5: "Port already in use"

**Symptoms:** 
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
```powershell
# Option 1: Kill process using port 5000
netstat -ano | findstr :5000
# Note the PID (last number)
taskkill /PID <PID> /F

# Option 2: Change port in backend/.env
PORT=5001

# Then update frontend/.env too:
VITE_API_URL=http://localhost:5001/api/v1
```

---

## 📱 Testing Your Connection

### Test 1: Register a New User

1. Open frontend: `http://localhost:5173/register`
2. Fill in registration form
3. Click "Register"
4. Check browser console (F12) - should see success message
5. Check backend terminal - should see "POST /api/v1/auth/register 201"

### Test 2: Login

1. Go to `http://localhost:5173/login`
2. Enter your credentials
3. Click "Login"
4. You should be redirected to dashboard/home
5. Check localStorage (F12 → Application → Local Storage) - should see token

### Test 3: Fetch Data

1. Go to `http://localhost:5173/events`
2. Events should load from backend
3. Check Network tab (F12) - should see API calls to backend

---

## 📁 Project Structure Explained

```
shackles-symposium/
│
├── frontend/                       # React application
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js             # ← Axios configuration (connects to backend)
│   │   ├── pages/
│   │   │   └── Auth/
│   │   │       ├── Login.jsx      # ← Makes API calls to login
│   │   │       └── Register.jsx   # ← Makes API calls to register
│   │   └── context/
│   │       └── AuthContext.jsx    # ← Manages user authentication state
│   ├── .env                       # ← Frontend environment variables
│   └── package.json
│
├── backend/                        # Node.js API server
│   ├── src/
│   │   ├── server.js              # ← Main server file (entry point)
│   │   ├── config/
│   │   │   └── database.js        # ← MongoDB connection
│   │   ├── controllers/
│   │   │   └── authController.js  # ← Handles login/register logic
│   │   ├── models/
│   │   │   └── User.js            # ← User database schema
│   │   └── routes/
│   │       └── authRoutes.js      # ← API endpoints (/api/v1/auth/...)
│   ├── .env                       # ← Backend environment variables
│   └── package.json
```

---

## 🎓 Understanding the Code

### Frontend: How API Calls Work

**File: `frontend/src/services/api.js`**
```javascript
// This creates an axios instance configured for your backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,  // All requests will be sent here
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically adds authentication token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Backend: How Routes Work

**File: `backend/src/server.js`**
```javascript
// This tells Express to use authRoutes for /api/v1/auth endpoints
app.use('/api/v1/auth', require('./routes/authRoutes'));

// So when frontend calls /api/v1/auth/login
// It will be handled by routes/authRoutes.js
```

**File: `backend/src/routes/authRoutes.js`**
```javascript
router.post('/login', authController.login);
// When POST request comes to /api/v1/auth/login
// It calls authController.login function
```

**File: `backend/src/controllers/authController.js`**
```javascript
exports.login = async (req, res) => {
  // 1. Get email and password from request
  const { email, password } = req.body;
  
  // 2. Find user in MongoDB
  const user = await User.findOne({ email });
  
  // 3. Check password
  const isValid = await user.comparePassword(password);
  
  // 4. Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
  // 5. Send response back to frontend
  res.json({ success: true, token, user });
};
```

---

## 🚀 Quick Start Commands

### One-Line Startup (After Setup)

**Terminal 1 (Backend):**
```powershell
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\backend"; npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\frontend"; npm run dev
```

### Or Create Startup Scripts:

**File: `start-backend.ps1`**
```powershell
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\backend"
npm run dev
```

**File: `start-frontend.ps1`**
```powershell
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\frontend"
npm run dev
```

Then just run:
```powershell
.\start-backend.ps1    # Terminal 1
.\start-frontend.ps1   # Terminal 2
```

---

## 📊 Monitoring Your Application

### View Backend Logs

Backend terminal shows:
```
POST /api/v1/auth/login 200 45ms     # Successful login
GET /api/v1/events 200 120ms         # Fetched events
POST /api/v1/users 201 89ms          # Created user
```

### View Frontend Network Requests

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Interact with your app
4. See all API calls with:
   - Request URL
   - Method (GET, POST, PUT, DELETE)
   - Status (200, 201, 400, 500)
   - Response data

---

## 🎯 Next Steps

### 1. Test All Features
- ✅ Registration
- ✅ Login
- ✅ View Events
- ✅ Register for Event
- ✅ Profile page
- ✅ Admin dashboard

### 2. Configure Optional Services
- 📧 Email (for password reset, confirmations)
- 💳 Razorpay (for payments)
- ☁️ AWS S3 (for file uploads)

### 3. Deploy to Production
- Deploy backend to Render/Railway/Heroku
- Deploy frontend to Vercel/Netlify
- Update environment variables with production URLs

---

## 📚 Additional Resources

- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Express.js Guide:** https://expressjs.com/
- **React Router:** https://reactrouter.com/
- **Axios Docs:** https://axios-http.com/
- **JWT Explained:** https://jwt.io/introduction

---

## 🆘 Need Help?

If you're stuck:

1. **Check both terminals** - Are backend and frontend running?
2. **Check browser console** (F12) - Are there error messages?
3. **Check .env files** - Are all values correct?
4. **Restart everything** - Sometimes a fresh start helps!

---

**Status:** You're now ready to connect everything! 🎉  
**Next:** Follow STEP 1-5 above carefully  
**Estimated Time:** 30-45 minutes for first setup


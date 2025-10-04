# 🔐 JWT Secret - Complete Guide for Beginners

## 📚 What is JWT Secret?

**JWT (JSON Web Token)** is like a secure digital ID card for your users.

### Simple Analogy:
```
Imagine a nightclub with a special stamp:

1. USER enters → Shows ID at door
2. BOUNCER checks ID → Verifies identity
3. BOUNCER stamps hand → Gives special invisible ink stamp
4. USER enters club → Can now enter anytime by showing stamp
5. BARTENDER sees stamp → Knows user is verified, serves drinks

JWT works the same way:
- User logs in (shows ID)
- Backend verifies credentials (checks ID)
- Backend generates JWT token (stamps hand)
- User stores token (has stamp on hand)
- User makes requests with token (shows stamp)
- Backend verifies token (checks stamp is real)
```

**JWT_SECRET** is the "invisible ink formula" that only your backend knows. Without it, no one can create fake stamps!

---

## 🎯 Why Do You Need JWT Secret?

### Security Reasons:

1. **Authentication** - Proves user is who they say they are
2. **Authorization** - Controls what users can access
3. **Stateless** - Backend doesn't need to remember every user
4. **Secure** - Can't be faked without the secret

### Without JWT:
```javascript
❌ User must login for EVERY request
❌ Backend must check database for EVERY request
❌ Slow and inefficient
❌ Poor user experience
```

### With JWT:
```javascript
✅ User logs in ONCE
✅ Gets token, sends with each request
✅ Backend verifies token quickly (no database check)
✅ Fast and efficient
✅ Great user experience
```

---

## 🔑 How to Create a Secure JWT Secret

### Method 1: Using Node.js (Recommended)

Open PowerShell and run:

```powershell
# Generate a secure random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

This will output something like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

**Copy this entire string and use it as your JWT_SECRET!**

### Method 2: Using PowerShell

```powershell
# Generate 64 random bytes and convert to hex
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### Method 3: Online Generator (Less Secure)

Go to: https://www.grc.com/passwords.htm
- Use the "63 random alpha-numeric characters" password
- **Note:** Less secure than Method 1, but okay for development

### Method 4: Create Your Own (Not Recommended for Production)

For development only, you can create a long random string:
```
shackles2025_harish_jwt_secret_key_mechanical_engineering_acgcet_symposium_secure_token_12345
```

**Important:** 
- ❌ Don't use simple words like "secret" or "password"
- ❌ Don't use your actual password
- ✅ Use at least 32 characters
- ✅ Use random mix of letters, numbers, symbols
- ✅ Different for development and production

---

## 🛠️ Let's Generate YOUR JWT Secret Now!

Run this command in your terminal:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

You'll get output like this (example):
```
8f3d7c2a9e1b4f6a3d5c7e9b2f4a6c8e1d3b5a7c9e2f4b6d8a1c3e5b7d9f2a4c6e8b1d3f5a7c9e2b4d6a8c1e3f5b7d9a2c4e6
```

**This is YOUR unique JWT secret!**

---

## 📝 How to Update Your JWT Secret

### Step 1: Generate New Secret

Run the command above and copy the output.

### Step 2: Open Your Backend .env File

```powershell
cd "C:\Users\Harish J\Desktop\shackles-master\shackles-symposium\backend"
code .env
```

### Step 3: Update JWT_SECRET

Find this line (around line 23):
```env
JWT_SECRET=shackles_2025_super_secret_jwt_key_change_this_in_production_12345
```

Replace with your generated secret:
```env
JWT_SECRET=8f3d7c2a9e1b4f6a3d5c7e9b2f4a6c8e1d3b5a7c9e2f4b6d8a1c3e5b7d9f2a4c6e8b1d3f5a7c9e2b4d6a8c1e3f5b7d9a2c4e6
```

### Step 4: Save and Restart Backend

```powershell
# Stop backend (Ctrl+C if running)
# Start backend again
npm run dev
```

**Done!** Your backend now uses a secure JWT secret! 🎉

---

## 🔍 How JWT is Already Implemented in Your Backend

Your backend already has JWT implemented! Let me show you where:

### 1. Environment Configuration

**File:** `backend/.env` (Line 23)
```env
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d              # Token valid for 7 days
JWT_COOKIE_EXPIRE=7        # Cookie valid for 7 days
```

### 2. User Model (Password Hashing & Token Generation)

**File:** `backend/src/models/User.js`

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Hash password with bcrypt (salt rounds: 10)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to generate JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },                    // Payload: user ID
    process.env.JWT_SECRET,               // Secret key
    { expiresIn: process.env.JWT_EXPIRE } // Expires in 7 days
  );
};

// Method to compare password
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

### 3. Auth Controller (Login/Register)

**File:** `backend/src/controllers/authController.js`

```javascript
// REGISTER USER
exports.register = async (req, res) => {
  // 1. Create user in database
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password  // Will be hashed by pre-save hook
  });
  
  // 2. Generate JWT token using the secret
  const token = user.getSignedJwtToken();
  
  // 3. Send token to frontend
  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

// LOGIN USER
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Find user by email
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // 2. Check if password matches
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // 3. Generate JWT token
  const token = user.getSignedJwtToken();
  
  // 4. Send token to frontend
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
};
```

### 4. Auth Middleware (Verify Token)

**File:** `backend/src/middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;
  
  // 1. Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({
      error: 'Not authorized to access this route'
    });
  }
  
  try {
    // 3. Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Get user from database
    req.user = await User.findById(decoded.id);
    
    next(); // Continue to next middleware/controller
  } catch (error) {
    return res.status(401).json({
      error: 'Not authorized to access this route'
    });
  }
};
```

### 5. Protected Routes

**File:** `backend/src/routes/userRoutes.js`

```javascript
const { protect } = require('../middleware/auth');

// Public route (no token needed)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route (token required)
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
```

---

## 🔄 JWT Flow in Your Application

### Complete Authentication Flow:

```
STEP 1: USER REGISTERS/LOGS IN
┌────────────────────────────────────────────────┐
│ Frontend sends:                                │
│ POST /api/v1/auth/login                       │
│ {                                              │
│   "email": "user@example.com",                │
│   "password": "password123"                   │
│ }                                              │
└────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────┐
│ Backend (authController.login):                │
│ 1. Find user in database                       │
│ 2. Compare password (bcrypt)                   │
│ 3. Generate JWT token:                         │
│                                                │
│    jwt.sign(                                   │
│      { id: user._id },        ← Payload        │
│      JWT_SECRET,              ← Your secret    │
│      { expiresIn: '7d' }      ← Expires        │
│    )                                           │
│                                                │
│ 4. Send token back to frontend                 │
└────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────┐
│ Frontend receives:                             │
│ {                                              │
│   "success": true,                             │
│   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...", │
│   "user": { ... }                              │
│ }                                              │
│                                                │
│ Frontend stores token in localStorage          │
└────────────────────────────────────────────────┘

STEP 2: USER ACCESSES PROTECTED ROUTE
┌────────────────────────────────────────────────┐
│ Frontend sends:                                │
│ GET /api/v1/users/profile                     │
│ Headers:                                       │
│   Authorization: Bearer eyJhbGc...            │
└────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────┐
│ Backend (auth middleware):                     │
│ 1. Extract token from Authorization header     │
│ 2. Verify token:                               │
│                                                │
│    jwt.verify(                                 │
│      token,                    ← From header   │
│      JWT_SECRET                ← Your secret   │
│    )                                           │
│                                                │
│ 3. If valid: Decode payload { id: user._id }  │
│ 4. Load user from database                     │
│ 5. Attach user to req.user                     │
│ 6. Continue to controller                      │
└────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────┐
│ Controller:                                    │
│ - Can access req.user                          │
│ - Process request                              │
│ - Send response                                │
└────────────────────────────────────────────────┘
```

---

## 🎯 JWT Token Structure

When you create a JWT token, it looks like this:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDFiODhjZjE2YzRhMzM4ZDVhNjkxYiIsImlhdCI6MTcyODEwMjU0OSwiZXhwIjoxNzI4NzA3MzQ5fQ.Kq5sZL_vPxK5rR8yN3qT9wZ2xA7mB1cC4dD6eE8fF0g
```

It has 3 parts separated by dots:

```
HEADER.PAYLOAD.SIGNATURE
```

### Part 1: Header (Algorithm & Type)
```json
{
  "alg": "HS256",    // Algorithm: HMAC SHA256
  "typ": "JWT"       // Type: JSON Web Token
}
```

### Part 2: Payload (User Data)
```json
{
  "id": "6701b88cf16c4a338d5a691b",  // User ID
  "iat": 1728102549,                 // Issued At (timestamp)
  "exp": 1728707349                  // Expires (timestamp)
}
```

### Part 3: Signature (Security)
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET  ← Your secret key makes this unique!
)
```

**The signature proves:**
- ✅ Token was created by your backend (only you have the secret)
- ✅ Token hasn't been tampered with
- ✅ Token is valid and trustworthy

---

## 🧪 Test Your JWT Implementation

### Test 1: Register a User

```powershell
# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"name":"Test User","email":"test@example.com","password":"password123","phone":"1234567890","college":"Test College","department":"CS"}'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### Test 2: Login

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"password123"}'
```

### Test 3: Access Protected Route

```powershell
# Copy the token from register/login response
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users/profile" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer $token" }
```

---

## 🔒 Security Best Practices

### DO ✅

1. **Use Long Random Secrets**
   ```env
   # Good (64+ characters)
   JWT_SECRET=8f3d7c2a9e1b4f6a3d5c7e9b2f4a6c8e1d3b5a7c9e2f4b6d8a1c3e5b7d9f2a4c6
   ```

2. **Different Secrets for Each Environment**
   ```env
   # Development
   JWT_SECRET=dev_secret_abc123...
   
   # Production
   JWT_SECRET=prod_secret_xyz789...
   ```

3. **Keep Secrets in .env (Never in Code)**
   ```javascript
   // ✅ Good
   jwt.sign(payload, process.env.JWT_SECRET)
   
   // ❌ Bad
   jwt.sign(payload, 'hardcoded_secret')
   ```

4. **Set Reasonable Expiration**
   ```env
   JWT_EXPIRE=7d      # 7 days for normal apps
   JWT_EXPIRE=1h      # 1 hour for high-security apps
   ```

5. **Use HTTPS in Production**
   - Prevents token interception
   - Encrypts all traffic

### DON'T ❌

1. **Never Use Simple Secrets**
   ```env
   # ❌ Bad
   JWT_SECRET=secret
   JWT_SECRET=password123
   JWT_SECRET=myapp
   ```

2. **Never Commit .env to Git**
   - .env should be in .gitignore
   - Use .env.example instead

3. **Never Share JWT Secrets**
   - Keep them private
   - Don't post on forums/chat

4. **Never Store Sensitive Data in JWT**
   ```javascript
   // ❌ Don't put passwords, credit cards, etc.
   jwt.sign({ id: user._id, password: user.password })
   
   // ✅ Only put user ID, basic info
   jwt.sign({ id: user._id, role: user.role })
   ```

---

## 🛠️ Quick Fix: Update Your JWT Secret Now

### Method 1: Automatic (Recommended)

I'll generate one for you! Run this:

```powershell
# Generate and save to variable
$jwtSecret = node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Display it
Write-Host "Your new JWT Secret:" -ForegroundColor Green
Write-Host $jwtSecret -ForegroundColor Yellow
Write-Host "`nCopy this and paste it in backend/.env as JWT_SECRET" -ForegroundColor Cyan
```

### Method 2: Manual

1. Run: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
2. Copy the output
3. Open `backend/.env`
4. Replace line 23:
   ```env
   JWT_SECRET=paste_your_generated_secret_here
   ```
5. Save file
6. Restart backend: `npm run dev`

---

## 📊 Current Status of Your JWT Implementation

Based on your backend code:

### ✅ What's Already Working:

1. **JWT Token Generation** - In User model
2. **Password Hashing** - bcrypt with salt rounds
3. **Login Endpoint** - /api/v1/auth/login
4. **Register Endpoint** - /api/v1/auth/register
5. **Auth Middleware** - Protects routes
6. **Token Verification** - Checks signature
7. **User Loading** - Attaches user to request

### ⚠️ What You Need to Do:

1. **Generate Secure JWT Secret** (follow steps above)
2. **Update backend/.env** with new secret
3. **Restart backend** to apply changes
4. **Test login/register** to verify it works

---

## 🎓 Understanding JWT in Simple Terms

```
Think of JWT like a movie ticket:

1. BUY TICKET (Login/Register)
   - You pay money (provide email/password)
   - Theater gives you ticket (backend generates JWT)
   - Ticket has: your name, movie, seat, time (payload)
   - Ticket has: special hologram (signature using JWT_SECRET)

2. ENTER THEATER (Access Protected Routes)
   - You show ticket at door (send JWT in Authorization header)
   - Guard checks hologram (backend verifies signature with JWT_SECRET)
   - If real: You can enter (access granted)
   - If fake: You're rejected (401 Unauthorized)

3. WATCH MOVIE (Use Application)
   - Keep ticket in pocket (store JWT in localStorage)
   - Show when asked (send with each request)
   - Valid until expiration (7 days in your case)

JWT_SECRET is like the special ink that makes the hologram.
Only the theater (your backend) knows the formula!
```

---

## 🚀 Quick Start Commands

### Generate JWT Secret:
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Update .env:
```powershell
code backend\.env
# Update JWT_SECRET on line 23
```

### Restart Backend:
```powershell
cd backend
npm run dev
```

### Test Login:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"test123"}'
```

---

## 📚 Additional Resources

- **JWT Official:** https://jwt.io/
- **JWT Debugger:** https://jwt.io/#debugger (paste token to see contents)
- **Node Crypto Docs:** https://nodejs.org/api/crypto.html
- **bcrypt Docs:** https://www.npmjs.com/package/bcryptjs

---

## ✅ Checklist

- [ ] Understand what JWT is
- [ ] Understand why JWT_SECRET is needed
- [ ] Generate secure JWT secret (64+ characters)
- [ ] Update JWT_SECRET in backend/.env
- [ ] Restart backend server
- [ ] Test register endpoint
- [ ] Test login endpoint
- [ ] Verify token is returned
- [ ] Test protected route with token

---

**Status:** JWT is already implemented in your backend! ✅  
**Next:** Generate a secure secret and update your .env file  
**Time:** 2 minutes  

**Your backend is secure and ready to authenticate users!** 🎉

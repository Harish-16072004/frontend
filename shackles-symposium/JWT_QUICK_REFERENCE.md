# 🔐 JWT Secret - Quick Reference Card

## ⚡ Ultra Quick Setup (2 Minutes)

### Step 1: Generate Secret (30 seconds)
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 2: Copy Output
```
Example output (yours will be different):
b645f32406fc084a0dacf3982d625efa58ee23fc40dd63d81f5883934b137cfa8397aad7b12e464dd238e8b46f3847bc98f3c57a6d2b758a940efebf85bd0acd
```

### Step 3: Update .env (1 minute)
```powershell
# Open file
code backend\.env

# Find line 23 (around line 23):
JWT_SECRET=shackles_2025_super_secret_jwt_key_change_this_in_production_12345

# Replace with (paste your generated secret):
JWT_SECRET=b645f32406fc084a0dacf3982d625efa58ee23fc40dd63d81f5883934b137cfa8397aad7b12e464dd238e8b46f3847bc98f3c57a6d2b758a940efebf85bd0acd

# Save file: Ctrl+S
```

### Step 4: Restart Backend (30 seconds)
```powershell
# If backend is running, stop it: Ctrl+C
# Start again:
cd backend
npm run dev
```

**✅ Done! Your JWT is now secure!**

---

## 🤔 What is JWT? (Simple Explanation)

```
JWT = Digital ID Card for Your Users

When user logs in:
1. Backend checks email/password ✅
2. Backend creates JWT token (like a VIP pass)
3. User stores token (keeps pass in wallet)
4. User sends token with each request (shows pass at door)
5. Backend verifies token (checks if pass is real)
6. If valid: User can access protected routes 🎉
```

---

## 🔑 Your Generated Secret

**Save this - you just generated it:**
```
b645f32406fc084a0dacf3982d625efa58ee23fc40dd63d81f5883934b137cfa8397aad7b12e464dd238e8b46f3847bc98f3c57a6d2b758a940efebf85bd0acd
```

**Or run the helper script:**
```powershell
.\generate-jwt-secret.ps1
```

---

## 📍 Where JWT is Used in Your Backend

### 1. User Model (`backend/src/models/User.js`)
```javascript
// Generates JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },              // User ID
    process.env.JWT_SECRET,         // ← YOUR SECRET HERE
    { expiresIn: '7d' }            // Valid for 7 days
  );
};
```

### 2. Auth Controller (`backend/src/controllers/authController.js`)
```javascript
// Login/Register
const token = user.getSignedJwtToken();  // Creates token
res.json({ success: true, token });      // Sends to frontend
```

### 3. Auth Middleware (`backend/src/middleware/auth.js`)
```javascript
// Verifies token on protected routes
const decoded = jwt.verify(token, process.env.JWT_SECRET);  // ← Uses your secret
req.user = await User.findById(decoded.id);
```

---

## 🧪 Test Your JWT Setup

### Test 1: Register
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"name":"Test","email":"test@test.com","password":"test123","phone":"1234567890","college":"Test","department":"CS"}'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  ← Your JWT token!
  "user": { ... }
}
```

### Test 2: Login
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"test123"}'
```

---

## 🔒 Security Checklist

- [ ] ✅ JWT secret is 64+ characters long
- [ ] ✅ JWT secret is random (not "secret" or "password")
- [ ] ✅ JWT secret is in .env file (not in code)
- [ ] ✅ .env file is in .gitignore (never commit to GitHub)
- [ ] ✅ Different secrets for dev and production
- [ ] ✅ Backend restarted after changing .env

---

## ⚠️ Common Mistakes

### ❌ DON'T DO THIS:
```env
JWT_SECRET=secret                    # Too short!
JWT_SECRET=password                  # Too obvious!
JWT_SECRET=myapp                     # Too simple!
```

### ✅ DO THIS:
```env
JWT_SECRET=b645f32406fc084a0dacf3982d625efa58ee23fc40dd63d81f5883934b137cfa...
# Long, random, cryptographically secure
```

---

## 🆘 Troubleshooting

### Error: "JsonWebTokenError: invalid signature"
**Cause:** JWT_SECRET was changed after tokens were created  
**Fix:** Log out and log back in (old tokens become invalid)

### Error: "TokenExpiredError: jwt expired"
**Cause:** Token expired (default: 7 days)  
**Fix:** Log in again to get new token

### Error: "Not authorized to access this route"
**Cause:** No token sent or invalid token  
**Fix:** Make sure Authorization header has "Bearer <token>"

---

## 🎓 JWT Token Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDFi...
│                                         │
└─ HEADER (algorithm)                    └─ PAYLOAD (user data) + SIGNATURE (security)
```

**Decode your token:** https://jwt.io/#debugger

---

## 📚 More Information

- **Full Guide:** [JWT_SECRET_GUIDE.md](./JWT_SECRET_GUIDE.md)
- **Connection Guide:** [CONNECTING_GUIDE_FOR_BEGINNERS.md](./CONNECTING_GUIDE_FOR_BEGINNERS.md)
- **Quick Start:** [CONNECTION_QUICK_START.md](./CONNECTION_QUICK_START.md)

---

## 🎯 Current Status

**Your Backend Already Has:**
- ✅ JWT token generation (User model)
- ✅ JWT verification (auth middleware)
- ✅ Login endpoint (POST /api/v1/auth/login)
- ✅ Register endpoint (POST /api/v1/auth/register)
- ✅ Protected routes (using protect middleware)

**You Just Need To:**
1. Generate secure JWT secret
2. Update backend/.env
3. Restart backend
4. Test login/register

**Time Required:** 2 minutes ⚡

---

**Your Generated Secret:**
```
b645f32406fc084a0dacf3982d625efa58ee23fc40dd63d81f5883934b137cfa8397aad7b12e464dd238e8b46f3847bc98f3c57a6d2b758a940efebf85bd0acd
```

**Paste in backend/.env line 23:**
```env
JWT_SECRET=b645f32406fc084a0dacf3982d625efa58ee23fc40dd63d81f5883934b137cfa8397aad7b12e464dd238e8b46f3847bc98f3c57a6d2b758a940efebf85bd0acd
```

**🎉 You're ready to authenticate users!**

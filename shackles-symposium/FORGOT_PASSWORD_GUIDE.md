# 🔐 Forgot Password Functionality - Complete Guide

## 🎯 Overview

Your SHACKLES Symposium system has a **complete forgot password implementation** already built! Here's how it works and how to use it.

---

## ✅ What's Already Implemented

Your backend has a secure 2-step password reset process:

1. **Step 1: Request Password Reset** - User enters email
2. **Step 2: Reset Password** - User clicks link in email, sets new password

### Security Features:
- ✅ **Hashed reset tokens** (SHA-256)
- ✅ **10-minute expiration** on reset links
- ✅ **Email verification** required
- ✅ **Secure token generation** (crypto.randomBytes)
- ✅ **Password validation** on reset

---

## 🔄 How It Works (Flow Diagram)

```
USER                    BACKEND                     EMAIL                    DATABASE
 │                         │                          │                          │
 │  1. Forgot Password?    │                          │                          │
 │ ────────────────────►   │                          │                          │
 │  (POST email)           │                          │                          │
 │                         │                          │                          │
 │                         │  2. Find User            │                          │
 │                         │ ─────────────────────────────────────────────────►  │
 │                         │                          │                          │
 │                         │  3. User exists?         │                          │
 │                         │ ◄─────────────────────────────────────────────────  │
 │                         │                          │                          │
 │                         │  4. Generate Token       │                          │
 │                         │    (random 20 bytes)     │                          │
 │                         │    Hash token (SHA-256)  │                          │
 │                         │    Set expiry (10 min)   │                          │
 │                         │                          │                          │
 │                         │  5. Save to DB           │                          │
 │                         │ ─────────────────────────────────────────────────►  │
 │                         │                          │                          │
 │                         │  6. Send Email           │                          │
 │                         │ ─────────────────────►   │                          │
 │                         │  (with reset link)       │                          │
 │                         │                          │                          │
 │  7. Check Email         │                          │  8. Receive Email        │
 │ ◄────────────────────────────────────────────────  │  (with reset link)       │
 │                         │                          │                          │
 │  9. Click Reset Link    │                          │                          │
 │  (opens reset page)     │                          │                          │
 │                         │                          │                          │
 │  10. Enter New Password │                          │                          │
 │ ────────────────────►   │                          │                          │
 │  (PUT /reset-password)  │                          │                          │
 │                         │                          │                          │
 │                         │  11. Verify Token        │                          │
 │                         │  (hash & check expiry)   │                          │
 │                         │ ─────────────────────────────────────────────────►  │
 │                         │                          │                          │
 │                         │  12. Token valid?        │                          │
 │                         │ ◄─────────────────────────────────────────────────  │
 │                         │                          │                          │
 │                         │  13. Update Password     │                          │
 │                         │  (hash new password)     │                          │
 │                         │  Clear reset token       │                          │
 │                         │ ─────────────────────────────────────────────────►  │
 │                         │                          │                          │
 │  14. Success! Login     │                          │                          │
 │ ◄────────────────────   │                          │                          │
 │  (with new password)    │                          │                          │
 │                         │                          │                          │
```

---

## 📋 API Endpoints

### 1. Request Password Reset

**Endpoint:**
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Error Responses:**
```json
// User not found
{
  "success": false,
  "message": "There is no user with that email"
}

// Email service failed
{
  "success": false,
  "message": "Email could not be sent"
}
```

---

### 2. Reset Password

**Endpoint:**
```http
PUT /api/v1/auth/reset-password/:resetToken
Content-Type: application/json

{
  "password": "NewSecurePassword123!"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "token": "jwt-token-here",
  "data": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
```json
// Invalid or expired token
{
  "success": false,
  "message": "Invalid or expired token"
}

// Validation error
{
  "success": false,
  "message": "Password must be at least 8 characters"
}
```

---

## 🧪 Testing with PowerShell

### Test 1: Request Password Reset

```powershell
# Make sure backend is running on port 5000

# Request password reset
$body = @{
    email = "harish@test.com"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/forgot-password" -Method Post -ContentType "application/json" -Body $body

# View response
$response | ConvertTo-Json
```

**Expected Output:**
```
{
  "success": true,
  "message": "Password reset email sent"
}
```

**What happens:**
1. Backend generates a reset token
2. Token is hashed and saved to database
3. Email is sent with reset link (e.g., `http://localhost:3000/reset-password/abc123...`)
4. Token expires in 10 minutes

---

### Test 2: Check Email Template

The email sent will look like this:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔐 SHACKLES 2025
  Password Reset Request
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hello Harish J,

You have requested to reset your password.

Please click the link below to reset your password:

[Reset Password] → http://localhost:3000/reset-password/a1b2c3d4e5...

This link will expire in 10 minutes.

If you didn't request this, please ignore this email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHACKLES 2025 - Technical Symposium
Department of Mechanical Engineering, ACGCET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Test 3: Reset Password (Manual - requires token from email)

```powershell
# Get the reset token from the email
$resetToken = "paste-token-from-email-here"

# Set new password
$body = @{
    password = "NewPassword123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/reset-password/$resetToken" -Method Put -ContentType "application/json" -Body $body

# View response
$response | ConvertTo-Json
```

**Expected Output:**
```
{
  "success": true,
  "message": "Password reset successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "670fc3a7b5e8f2a3c4d5e6f7",
    "name": "Harish J",
    "email": "harish@test.com",
    "role": "user"
  }
}
```

---

### Test 4: Verify Password Changed

```powershell
# Try logging in with NEW password
$body = @{
    email = "harish@test.com"
    password = "NewPassword123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body $body

# Should succeed!
Write-Host "✅ Login successful with new password!" -ForegroundColor Green
$response.data.user.name
```

---

## 🎨 Frontend Implementation Guide

### Page 1: Forgot Password Form

Create `frontend/src/pages/Auth/ForgotPassword.jsx`:

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      );

      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>🔐 Forgot Password?</h2>
        <p>Enter your email and we'll send you a reset link.</p>

        {message && (
          <div className="success-message">
            ✅ {message}
            <p>Check your email for the reset link.</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="back-to-login">
          <a href="/login">← Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
```

---

### Page 2: Reset Password Form

Create `frontend/src/pages/Auth/ResetPassword.jsx`:

```jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${resetToken}`,
        { password }
      );

      // Save token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard
      alert('✅ Password reset successful! Logging you in...');
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>🔐 Reset Your Password</h2>
        <p>Enter your new password below.</p>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={loading}
              minLength="8"
            />
            <small>Minimum 8 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
```

---

### CSS for Forms

Create `frontend/src/pages/Auth/ForgotPassword.css`:

```css
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.forgot-password-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
}

.forgot-password-card h2 {
  margin-bottom: 10px;
  color: #333;
  text-align: center;
}

.forgot-password-card p {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.success-message,
.error-message {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.success-message {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group small {
  display: block;
  margin-top: 5px;
  color: #999;
  font-size: 14px;
}

.submit-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-to-login {
  margin-top: 20px;
  text-align: center;
}

.back-to-login a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.back-to-login a:hover {
  text-decoration: underline;
}
```

---

### Add Routes to App.jsx

Update `frontend/src/App.jsx`:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Password Reset routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
```

---

### Add Link to Login Page

Update `frontend/src/pages/Auth/Login.jsx`:

```jsx
// Add this link below the login form
<div className="forgot-password-link">
  <a href="/forgot-password">Forgot Password?</a>
</div>
```

---

## ⚙️ Environment Configuration

Make sure `backend/.env` has:

```env
# Frontend URL (for reset link)
FRONTEND_URL=http://localhost:3000

# Email service (configure one of these)
# See EMAIL_SETUP_GUIDE.md for details
EMAIL_SERVICE=gmail
EMAIL_FROM=noreply@shackles.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🔒 Security Features Explained

### 1. Token Hashing
```javascript
// Plain token sent in email (can't be reversed)
const resetToken = crypto.randomBytes(20).toString('hex');
// → "a1b2c3d4e5f6..."

// Hashed token stored in database (secure)
const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
// → "8f7g6h5j4k3l..."
```

**Why?** If database is compromised, attackers can't use the hashed tokens.

---

### 2. Token Expiration
```javascript
this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
```

**Why?** Limits the window for potential attacks.

---

### 3. Token Clearing
```javascript
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;
await user.save();
```

**Why?** Token is deleted after use (can't be reused).

---

## 🧪 Complete Test Script

Save as `test-forgot-password.ps1`:

```powershell
# Test Forgot Password Flow

Write-Host "`n🔐 Testing Forgot Password Functionality`n" -ForegroundColor Cyan

# Check backend
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 2
    Write-Host "✅ Backend is running`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend not running!" -ForegroundColor Red
    exit 1
}

# Test 1: Request password reset
Write-Host "1. Requesting password reset for harish@test.com..." -ForegroundColor Yellow
$body = @{email = "harish@test.com"} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/forgot-password" -Method Post -ContentType "application/json" -Body $body
    Write-Host "✅ Password reset email sent!" -ForegroundColor Green
    Write-Host "   Message: $($response.message)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Request failed: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 2: Test with non-existent user
Write-Host "2. Testing with non-existent user..." -ForegroundColor Yellow
$body = @{email = "nonexistent@test.com"} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/forgot-password" -Method Post -ContentType "application/json" -Body $body
    Write-Host "❌ Should have failed!" -ForegroundColor Red
} catch {
    if ($_.ErrorDetails.Message -like "*no user with that email*") {
        Write-Host "✅ Correctly rejected non-existent user`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error`n" -ForegroundColor Red
    }
}

Write-Host "`n📧 Next steps:" -ForegroundColor Cyan
Write-Host "1. Check your email for the reset link" -ForegroundColor Gray
Write-Host "2. Click the link (or copy token from email)" -ForegroundColor Gray
Write-Host "3. Enter new password on reset page`n" -ForegroundColor Gray

Write-Host "✅ Test complete!`n" -ForegroundColor Green
```

---

## 📚 Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `backend/src/controllers/authController.js` | Reset logic | ✅ Complete |
| `backend/src/models/User.js` | Token generation | ✅ Complete |
| `backend/src/routes/authRoutes.js` | API routes | ✅ Complete |
| `backend/src/validators/authValidator.js` | Validation | ✅ Complete |
| `backend/src/utils/emailService.js` | Email sending | ✅ Complete |
| `frontend/src/pages/Auth/ForgotPassword.jsx` | Request form | 📝 Create this |
| `frontend/src/pages/Auth/ResetPassword.jsx` | Reset form | 📝 Create this |

---

## 🎯 Summary

✅ **Backend:** Fully implemented and secure!
- Token generation ✅
- Email sending ✅
- Password reset ✅
- Security features ✅

📝 **Frontend:** Needs implementation
- Create ForgotPassword page
- Create ResetPassword page
- Add routes
- Style components

---

## 🚀 Quick Start

1. **Test backend:** Run `.\test-forgot-password.ps1`
2. **Configure email:** See `backend/.env` for email settings
3. **Create frontend pages:** Use code examples above
4. **Test end-to-end:** Submit email → Check inbox → Reset password

---

**Your forgot password system is ready on the backend! Just need to build the frontend pages.** 🎉

For email configuration, see the email service documentation or let me know if you need help setting that up!

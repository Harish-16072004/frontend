# 🔐 Forgot Password - Quick Reference

## 🎯 What You Need to Know

Your backend **already has a complete forgot password system**! Here's what's implemented:

### ✅ Backend (100% Complete)
- **Token Generation:** Secure 20-byte random tokens with SHA-256 hashing
- **Email Sending:** Automated reset emails with secure links
- **Token Expiration:** 10-minute time limit for security
- **Password Reset:** Secure password update with validation
- **API Endpoints:** Two fully functional routes

### 📝 Frontend (Needs Implementation)
- Create ForgotPassword page (user enters email)
- Create ResetPassword page (user enters new password)
- Add routes to React Router
- Style the forms

---

## 🚀 Quick Test

```powershell
# In Terminal 1: Start backend
cd backend
node src/server.js

# In Terminal 2: Run test
.\test-forgot-password.ps1
```

---

## 📋 API Quick Reference

### Request Reset
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password
```http
PUT /api/v1/auth/reset-password/:resetToken
Content-Type: application/json

{
  "password": "NewPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "token": "jwt-token-here",
  "data": { ... }
}
```

---

## 🔄 Complete Flow

```
1. User visits /forgot-password
   ↓
2. User enters email
   ↓
3. Backend generates token
   ↓
4. Backend sends email with link
   ↓
5. User clicks link (opens /reset-password/:token)
   ↓
6. User enters new password
   ↓
7. Backend validates token & updates password
   ↓
8. User auto-logged in with new password
```

---

## ⏰ Token Details

| Property | Value |
|----------|-------|
| Generation | `crypto.randomBytes(20)` |
| Storage | SHA-256 hash |
| Expiration | 10 minutes |
| Single Use | Yes (deleted after use) |
| URL Format | `/reset-password/{token}` |

---

## 🎨 Frontend Components to Create

1. **ForgotPassword.jsx**
   - Email input form
   - Submit button
   - Success/error messages
   - Link back to login

2. **ResetPassword.jsx**
   - New password input
   - Confirm password input
   - Submit button
   - Token from URL params

3. **Routes in App.jsx**
   ```jsx
   <Route path="/forgot-password" element={<ForgotPassword />} />
   <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
   ```

4. **Link in Login.jsx**
   ```jsx
   <a href="/forgot-password">Forgot Password?</a>
   ```

---

## ⚙️ Environment Variables Required

```env
# In backend/.env
FRONTEND_URL=http://localhost:3000

# Email service (configure for production)
EMAIL_SERVICE=gmail
EMAIL_FROM=noreply@shackles.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🧪 Testing Checklist

- [ ] Backend health check passes
- [ ] Request reset with valid email succeeds
- [ ] Request reset with invalid email fails
- [ ] Request reset with non-existent email fails
- [ ] Email is sent (or check MongoDB for token)
- [ ] Reset password with valid token succeeds
- [ ] Reset password with expired token fails
- [ ] Reset password with invalid token fails
- [ ] User can login with new password

---

## 📁 Key Files

| File | Lines | Status |
|------|-------|--------|
| `backend/src/controllers/authController.js` | 194-250 | ✅ Complete |
| `backend/src/models/User.js` | 78-79, 111-121 | ✅ Complete |
| `backend/src/routes/authRoutes.js` | 18-19 | ✅ Complete |
| `backend/src/validators/authValidator.js` | 86-115 | ✅ Complete |
| `frontend/src/pages/Auth/ForgotPassword.jsx` | - | 📝 Create |
| `frontend/src/pages/Auth/ResetPassword.jsx` | - | 📝 Create |

---

## 🔒 Security Features

✅ **Token Hashing:** Plain token in email, hashed token in database  
✅ **Expiration:** 10-minute window to prevent abuse  
✅ **Single Use:** Token deleted after successful reset  
✅ **Password Validation:** Minimum 8 characters required  
✅ **Email Verification:** Only works for registered emails  

---

## 📧 Email Template

The reset email includes:
- User's name
- Reset link with token
- Expiration warning (10 minutes)
- Ignore instructions if not requested
- Symposium branding

Template file: `backend/views/emails/resetPassword.ejs`

---

## 🎯 Next Steps

1. **Test backend:** `.\test-forgot-password.ps1`
2. **Configure email:** Update `backend/.env`
3. **Create frontend pages:** Use code from `FORGOT_PASSWORD_GUIDE.md`
4. **Test end-to-end:** Submit email → Check inbox → Reset password

---

## 💡 Tips

- Keep backend running in **separate terminal** during tests
- Token expires in **10 minutes** - act fast when testing
- Check MongoDB if email not configured (token stored in `resetPasswordToken`)
- Use strong passwords (minimum 8 characters)
- Reset link format: `http://localhost:3000/reset-password/{token}`

---

**Your forgot password system is production-ready on the backend!** 🎉

Full guide: `FORGOT_PASSWORD_GUIDE.md`  
Test script: `test-forgot-password.ps1`

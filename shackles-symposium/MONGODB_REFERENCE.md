# 🚀 MongoDB Atlas - Quick Reference

## ✅ What You've Done
- [x] Created MongoDB Atlas account
- [x] Created free cluster
- [x] Created database user
- [x] Set up network access
- [x] Got connection string

## 📝 What You Need To Do Now

### Step 1: Get Your Connection String
1. Go to **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js, **Version**: 5.5 or later
5. **Copy** the connection string

**It looks like:**
```
mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 2: Update .env File
1. Open: `server\.env`
2. Find the line: `MONGODB_URI=...`
3. Replace with YOUR connection string
4. **Important**: Replace `<password>` with your actual password

**Example:**
```env
MONGODB_URI=mongodb+srv://shackles_admin:MyPassword123@shackles-cluster.abc12.mongodb.net/shackles_db?retryWrites=true&w=majority
```

### Step 3: Encode Special Characters in Password
If your password has special characters, encode them:

| Character | Replace With |
|-----------|--------------|
| @         | %40          |
| #         | %23          |
| $         | %24          |
| %         | %25          |
| &         | %26          |

**Example:**
- Password: `Pass@123#`
- Encoded: `Pass%40123%23`

### Step 4: Test Connection
```powershell
cd server
node test-connection.js
```

**Expected output:**
```
✅ MongoDB Atlas connected successfully!
📊 Database: shackles_db
✨ All tests passed!
```

---

## 🎯 Quick Commands

### Run Interactive Setup Helper
```powershell
.\setup-mongodb.ps1
```

### Test Connection Manually
```powershell
cd server
node test-connection.js
```

### Start Backend Server
```powershell
cd server
npm run dev
```

### Check if .env exists
```powershell
Test-Path server\.env
```

---

## ⚠️ Troubleshooting

### "Authentication failed"
- ✓ Check username/password are correct
- ✓ Encode special characters in password
- ✓ Verify user exists in Database Access

### "Connection timeout"
- ✓ Add 0.0.0.0/0 to Network Access in Atlas
- ✓ Check your internet connection
- ✓ Verify firewall isn't blocking MongoDB

### "Cannot find module 'dotenv'"
```powershell
cd server
npm install
```

### "MONGODB_URI not found"
- ✓ Ensure .env file exists in server folder
- ✓ Check file is named `.env` (not `.env.txt`)
- ✓ Verify MONGODB_URI is set correctly

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `server\.env` | Your database credentials (NEVER commit to git!) |
| `server\.env.example` | Template for .env file |
| `server\test-connection.js` | Test MongoDB connection |
| `setup-mongodb.ps1` | Interactive setup helper |
| `MONGODB_ATLAS_SETUP.md` | Complete setup guide |
| `MONGODB_QUICK_START.md` | 5-minute setup guide |

---

## 🔐 Security Checklist

- [x] `.env` is in `.gitignore` (already done)
- [ ] Update MONGODB_URI in .env with real credentials
- [ ] Generate strong JWT_SECRET (for production)
- [ ] Use 0.0.0.0/0 only for development
- [ ] Never share .env file via git or public channels

---

## 🎉 After Connection Works

1. **Start Backend**: `cd server && npm run dev`
2. **Collections Created**: Automatically when models are used
3. **Share Credentials**: With backend developer (securely!)
4. **Build APIs**: Start implementing endpoints

---

## 📚 Need More Help?

- **Quick Guide**: `MONGODB_QUICK_START.md`
- **Detailed Guide**: `MONGODB_ATLAS_SETUP.md`
- **MongoDB Docs**: https://www.mongodb.com/docs/atlas/
- **Mongoose Docs**: https://mongoosejs.com/docs/

---

**SHACKLES 25-26 | Department of Mechanical Engineering | ACGCET**

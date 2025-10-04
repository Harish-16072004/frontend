# 🚀 Quick Start: MongoDB Atlas for SHACKLES

## 5-Minute Setup Guide

### Step 1: Create Account (2 minutes)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or Email
3. Verify email

### Step 2: Create Free Cluster (2 minutes)
1. Click **"Build a Database"**
2. Choose **"M0 FREE"**
3. Provider: **AWS**, Region: **Mumbai (ap-south-1)**
4. Cluster Name: `shackles-cluster`
5. Click **"Create"**

### Step 3: Create User (30 seconds)
```
Username: shackles_admin
Password: Shackles2025@Secure!
```
✅ Save password somewhere safe!

### Step 4: Network Access (30 seconds)
1. Click **"Network Access"** → **"Add IP Address"**
2. Select **"Allow access from anywhere"** (0.0.0.0/0)
3. Click **"Confirm"**

### Step 5: Get Connection String (30 seconds)
1. Click **"Connect"** → **"Connect your application"**
2. Copy the string:
```
mongodb+srv://shackles_admin:<password>@shackles-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update Backend (1 minute)

**Create `server/.env` file:**
```bash
MONGODB_URI=mongodb+srv://shackles_admin:Shackles2025%40Secure!@shackles-cluster.xxxxx.mongodb.net/shackles_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `<password>` with your actual password and encode special characters!

### Step 7: Test Connection (30 seconds)

```powershell
cd server
node test-connection.js
```

You should see:
```
✅ MongoDB Atlas connected successfully!
📊 Database: shackles_db
✨ All tests passed!
```

---

## Password Special Character Encoding

If your password has special characters, encode them:

| Character | Encoded |
|-----------|---------|
| `@`       | `%40`   |
| `#`       | `%23`   |
| `$`       | `%24`   |
| `%`       | `%25`   |
| `&`       | `%26`   |
| `:`       | `%3A`   |
| `/`       | `%2F`   |

**Example:**
- Original: `Pass@123#`
- Encoded: `Pass%40123%23`

---

## Connection String Format

```
mongodb+srv://[USER]:[PASSWORD]@[CLUSTER]/[DATABASE]?options
```

**Your values:**
- `[USER]`: shackles_admin
- `[PASSWORD]`: Your encoded password
- `[CLUSTER]`: shackles-cluster.xxxxx.mongodb.net
- `[DATABASE]`: shackles_db

---

## Common Issues

### ❌ "Authentication failed"
→ Check username/password, encode special characters

### ❌ "Connection timeout"
→ Add 0.0.0.0/0 to Network Access in Atlas

### ❌ "ENOTFOUND"
→ Check cluster URL is correct

---

## Next Steps

1. ✅ Test connection: `node test-connection.js`
2. ✅ Start backend: `npm run dev`
3. ✅ Check models are created
4. ✅ Share credentials with backend developer

---

## Full Documentation

For detailed setup, troubleshooting, and best practices, see:
📚 **MONGODB_ATLAS_SETUP.md**

---

**SHACKLES 25-26 | Mechanical Engineering Association | ACGCET**

# 🎯 CONNECTION QUICK START - 5 Minutes

## ⚡ Fast Setup Guide

### Step 1: MongoDB (5 mins)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up → Create free cluster
3. Create user: `shackles_admin` + password
4. Network: Allow 0.0.0.0/0
5. Copy connection string

### Step 2: Backend .env (1 min)
```env
MONGODB_URI=your_connection_string_here
```

### Step 3: Frontend .env (30 sec)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Step 4: Install (2 mins)
```powershell
cd backend
npm install

cd ../frontend
npm install
```

### Step 5: Start! (30 sec)
```powershell
# Option 1: Double-click
.\start-all.ps1

# Option 2: Manual
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

### Step 6: Open
```
http://localhost:5173
```

## ✅ Quick Checklist
- [ ] MongoDB URI in backend/.env
- [ ] VITE_API_URL in frontend/.env  
- [ ] npm install in both folders
- [ ] Backend shows "Connected"
- [ ] Frontend shows localhost:5173
- [ ] Browser opens successfully

## 🧪 Quick Test
1. `http://localhost:5000/health` → success
2. `http://localhost:5173` → homepage loads
3. Try register → works = ✅ Done!

## 🚨 Quick Fix
- Backend won't start? → Check MongoDB URI
- Network Error? → Start backend first
- CORS Error? → Restart backend

**Full Guide:** `CONNECTING_GUIDE_FOR_BEGINNERS.md`

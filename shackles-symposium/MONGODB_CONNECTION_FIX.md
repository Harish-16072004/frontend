# MongoDB Connection Timeout - URGENT FIX

## 🚨 Current Issue
MongoDB Atlas connection is timing out after 30 seconds. The database connects initially but then disconnects during queries.

## Error Details
```
MongoNetworkTimeoutError: Socket 'secureConnect' timed out
MongoServerSelectionError: connection timed out
MongoDB disconnected
```

## 🔧 IMMEDIATE FIXES (Try in Order)

### Fix 1: Whitelist Your IP in MongoDB Atlas ⚡ (MOST LIKELY SOLUTION)

1. **Go to MongoDB Atlas Dashboard**: https://cloud.mongodb.com/
2. **Navigate to**: Network Access (left sidebar)
3. **Click**: "ADD IP ADDRESS"
4. **Option A** (Quick Fix for Development):
   - Click "ALLOW ACCESS FROM ANYWHERE"
   - IP Address: `0.0.0.0/0`
   - Comment: "Development Access"
   - Click "Confirm"
   
5. **Option B** (More Secure):
   - Click "ADD CURRENT IP ADDRESS"
   - It will auto-detect your IP
   - Click "Confirm"

6. **Wait 2-3 minutes** for changes to propagate

### Fix 2: Check Your Internet Connection
- Restart your router
- Disable VPN if you're using one
- Try switching networks (mobile hotspot, different WiFi)

### Fix 3: Update MongoDB Connection String

Your current connection string format should be:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Important**: Make sure there are NO special characters in your password that need URL encoding. If your password has special characters like `@`, `#`, `$`, etc., you need to URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `/` → `%2F`

### Fix 4: Firewall/Antivirus Check
- Temporarily disable Windows Firewall
- Temporarily disable antivirus
- Test the connection

### Fix 5: DNS Issue
Try using MongoDB Atlas with Google DNS:
1. Open Network Settings
2. Change DNS to:
   - Primary: `8.8.8.8`
   - Secondary: `8.8.4.4`

## 🧪 Test the Connection

After making changes, restart the backend:
```powershell
cd backend
npm run dev
```

## 📝 What I've Already Fixed

✅ Updated `database.js` with better connection options:
- Added `serverSelectionTimeoutMS: 10000` (faster timeout)
- Added `family: 4` (Force IPv4 instead of IPv6)
- Added reconnection event handlers
- Added helpful error messages

✅ Fixed CORS issues in server.js
✅ Added debug logging to auth controller

## 🔍 Verify MongoDB Atlas Settings

1. **Database User**:
   - Username: `HarishJ16`
   - Password: Check if it matches your .env file
   - Has "Read and write to any database" permission

2. **Database Name**: `shackles_db`

3. **Cluster Status**: Should be "Active" (not paused)

4. **Connection String Format**:
   ```
   mongodb+srv://HarishJ16:Loki2403@shackles2k25.seectqm.mongodb.net/shackles_db?retryWrites=true&w=majority
   ```

## 🎯 Most Likely Solution

**90% of the time, this is an IP whitelist issue.**

Go to MongoDB Atlas → Network Access → Add IP Address → "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)

Wait 2-3 minutes and try again!

## 📞 If Still Not Working

1. Check MongoDB Atlas Status Page: https://status.mongodb.com/
2. Try connecting from MongoDB Compass to verify credentials
3. Create a new cluster (free tier) as a test

## ⚠️ Temporary Workaround

If you need to test the frontend immediately without MongoDB:
- Use the test user that's already in memory
- Mock the data in the auth controller
- I can help you set this up if needed

---

**Next Steps After Whitelisting IP:**
1. Restart backend: `npm run dev`
2. Try logging in
3. Backend should show: `✅ User found, checking password...`
4. Login should succeed!


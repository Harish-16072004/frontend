# 🔧 Fix "Port Already in Use" Error - Quick Guide

## ❌ Error Message
```
Error: listen EADDRINUSE: address already in use :::5000
```

This means another process is already using port 5000.

---

## ✅ Quick Fix (3 Steps)

### **Step 1: Find the Process**
```powershell
netstat -ano | findstr :5000
```

**Output Example:**
```
TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       21204
TCP    [::]:5000              [::]:0                 LISTENING       21204
```

The last number (21204) is the **Process ID (PID)**.

---

### **Step 2: Kill the Process**
```powershell
taskkill /PID 21204 /F
```

Replace `21204` with your actual PID from Step 1.

**Expected Output:**
```
SUCCESS: The process with PID 21204 has been terminated.
```

---

### **Step 3: Verify Port is Free**
```powershell
netstat -ano | findstr :5000
```

**If successful:** No output (or only UDP ports shown)

---

### **Step 4: Restart Backend**
```powershell
cd backend
npm run dev
```

---

## 🚀 One-Line Solution (PowerShell)

**Find and kill in one command:**
```powershell
$port = 5000; $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; if ($process) { Stop-Process -Id $process -Force; Write-Host "✅ Killed process $process on port $port" -ForegroundColor Green } else { Write-Host "✅ Port $port is already free" -ForegroundColor Green }
```

---

## 🔍 Alternative: Find What's Using the Port

**See process details:**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
```

**Output shows:**
- Process name (e.g., node.exe)
- Process ID
- CPU/Memory usage

---

## 🛠️ Common Causes

1. **Previous backend still running**
   - You started `npm run dev` and it didn't stop properly
   - Closed terminal without stopping Node.js

2. **Multiple terminal windows**
   - Backend running in another terminal
   - Check all open PowerShell/Terminal windows

3. **VS Code integrated terminal**
   - Backend running in VS Code terminal
   - Check all terminal tabs in VS Code

4. **Crashed process**
   - Backend crashed but port wasn't released
   - Happens when process terminates unexpectedly

---

## ⚡ Prevention Tips

### **Proper Stop Method:**
```powershell
# When running npm run dev, stop with:
Ctrl + C

# Wait for "nodemon clean exit"
# Then close terminal
```

### **Check Before Starting:**
```powershell
# Always check port first
netstat -ano | findstr :5000

# If anything shows, kill it
# Then start backend
```

### **Use Process Manager:**
```powershell
# Install PM2 (optional)
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name shackles-backend

# Stop cleanly
pm2 stop shackles-backend

# Delete process
pm2 delete shackles-backend
```

---

## 📝 Quick Commands Reference

| Task | Command |
|------|---------|
| **Find port usage** | `netstat -ano \| findstr :5000` |
| **Kill by PID** | `taskkill /PID <PID> /F` |
| **Kill all Node** | `taskkill /IM node.exe /F` |
| **Find process** | `Get-Process -Id <PID>` |
| **List all Node** | `Get-Process node` |
| **Start backend** | `cd backend ; npm run dev` |
| **Stop backend** | `Ctrl + C` in terminal |

---

## 🚨 Nuclear Option (Kill All Node Processes)

**⚠️ WARNING: This kills ALL Node.js processes!**

```powershell
taskkill /IM node.exe /F
```

Use only if:
- You're sure no other Node apps are running
- Other methods failed
- You need to restart fresh

---

## 🔧 Change Backend Port (Alternative)

If you want to use a different port:

### **1. Edit `backend/.env`:**
```env
PORT=5001
```

### **2. Edit `backend/src/server.js`:**
```javascript
const PORT = process.env.PORT || 5001;
```

### **3. Update Frontend API URL:**
```javascript
// frontend/.env
VITE_API_URL=http://localhost:5001/api/v1
```

---

## ✅ Verification Checklist

After killing the process:

- [ ] Run `netstat -ano | findstr :5000` → Should show nothing
- [ ] Start backend with `npm run dev`
- [ ] See "Server running on port 5000" message
- [ ] Test API: `http://localhost:5000/health`
- [ ] No errors in terminal

---

## 🎯 Solved!

Port 5000 is now free. You can restart your backend:

```powershell
cd backend
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node src/server.js`
✅ MongoDB Connected Successfully!
✅ Server running on port 5000 in development mode
```

---

## 📞 Still Having Issues?

1. **Check Windows Firewall** - Might be blocking port
2. **Run PowerShell as Administrator** - Some commands need elevation
3. **Restart Computer** - Last resort to clear stuck processes
4. **Check antivirus** - Might be interfering with Node.js

---

**Quick fix applied! ✅ Process 21204 terminated. Port 5000 is now available.**

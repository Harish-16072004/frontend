# 📊 Google Sheets Export - Quick Setup Summary

## 🎯 What You Need To Do (5 Steps)

### ⏱️ **Estimated Time: 10-15 minutes**

---

## Step 1: Create Google Cloud Project (3 mins)

1. Go to: https://console.cloud.google.com/
2. Click "New Project"
3. Name: `shackles-symposium`
4. Click "CREATE"

---

## Step 2: Enable Google Sheets API (2 mins)

1. Go to: https://console.cloud.google.com/apis/library
2. Search: "Google Sheets API"
3. Click "ENABLE"

---

## Step 3: Create Service Account & Download Key (3 mins)

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Click "+ CREATE SERVICE ACCOUNT"
3. Name: `shackles-sheets-exporter`
4. Click "CREATE AND CONTINUE" → "CONTINUE" → "DONE"
5. Click on the created service account
6. Go to "KEYS" tab → "ADD KEY" → "Create new key" → "JSON"
7. Click "CREATE" - **A JSON file will download**

---

## Step 4: Configure Backend (2 mins)

### Option A: Using Environment Variables (Recommended)

Open the downloaded JSON file and copy these values to `backend/.env`:

```env
# GOOGLE SHEETS INTEGRATION
GOOGLE_CLIENT_EMAIL=your-service-account@shackles-symposium.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Long_Private_Key_Here...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_sheet_id_here
```

**Important:** 
- Keep the quotes around GOOGLE_PRIVATE_KEY
- Keep the `\n` characters in the key
- Get Sheet ID in next step

### Option B: Using JSON File

1. Move JSON file to: `backend/config/google-service-account.json`
2. Add to `.env`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=config/google-service-account.json
   GOOGLE_SHEET_ID=your_sheet_id_here
   ```

---

## Step 5: Create & Share Google Sheet (3 mins)

1. **Create Sheet:**
   - Go to: https://sheets.google.com/
   - Click "+ Blank"
   - Name: `SHACKLES 2025 - Registrations`

2. **Get Sheet ID:**
   - Copy the ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_SHEET_ID]/edit
   ```
   - Add it to `backend/.env` as `GOOGLE_SHEET_ID`

3. **Share with Service Account (CRITICAL!):**
   - Click "Share" button
   - Paste your service account email (from step 3)
   - Set permission: **"Editor"**
   - Uncheck "Notify people"
   - Click "Share"

---

## ✅ Test It!

**1. Restart Backend:**
```powershell
cd "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium\backend"
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
node src/server.js
```

**2. Run Test Script:**
```powershell
cd "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium"
.\test-google-sheets.ps1
```

If successful, you'll see:
- ✅ Export successful!
- 📊 Google Sheet URL: https://docs.google.com/spreadsheets/d/...
- Browser opens automatically with your data!

---

## 🔍 Troubleshooting

### "Failed to authenticate"
- ✅ Check GOOGLE_CLIENT_EMAIL is correct
- ✅ Check GOOGLE_PRIVATE_KEY has quotes and `\n` characters
- ✅ Restart backend after changing .env

### "Caller does not have permission"
- ✅ Did you share the Google Sheet with service account email?
- ✅ Is permission set to "Editor" (not Viewer)?

### "Requested entity was not found"
- ✅ Is GOOGLE_SHEET_ID correct?
- ✅ Copy it from the sheet URL

### "API has not been enabled"
- ✅ Enable Google Sheets API in Cloud Console
- ✅ Wait 2-3 minutes after enabling

---

## 📖 Full Documentation

For detailed explanations, see:
- `GOOGLE_SHEETS_EXPORT_GUIDE.md` - Complete setup guide
- `ADMIN_EXPORT_GUIDE.md` - Excel & PDF export guide

---

## 🎯 What You'll Get

After setup, you can:
- ✅ Export registrations to Google Sheets with one API call
- ✅ Share live data with your team
- ✅ Get auto-formatted sheets with blue headers
- ✅ View data from any device
- ✅ Collaborate in real-time

---

## 📋 Setup Checklist

Before testing, verify:

- [ ] Created Google Cloud project
- [ ] Enabled Google Sheets API
- [ ] Created service account
- [ ] Downloaded JSON key
- [ ] Added credentials to `.env`
- [ ] Created Google Sheet
- [ ] Got Sheet ID from URL
- [ ] Shared sheet with service account (as Editor)
- [ ] Restarted backend
- [ ] Ran test script

---

**Need help? Check the detailed guide:** `GOOGLE_SHEETS_EXPORT_GUIDE.md`

# 📊 Google Sheets Export - Complete Setup Guide

## 🎯 Overview

Google Sheets export allows you to:
- 📤 **Export data directly to Google Sheets** (instead of downloading Excel files)
- 🔗 **Get shareable links** to view/edit data online
- 👥 **Collaborate in real-time** with your team
- 🔄 **Auto-sync data** without manual downloads

This is perfect for:
- Sharing registration lists with event coordinators
- Real-time payment tracking dashboard
- Collaborative data verification

---

## 🚀 SETUP PROCESS

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Click "Select a project" → "New Project"
   - Project name: `shackles-symposium`
   - Click "CREATE"

2. **Enable Google Sheets API:**
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Google Sheets API"
   - Click on it → Click "ENABLE"

---

### Step 2: Create Service Account

1. **Navigate to Service Accounts:**
   - Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
   - Or: Menu (☰) → IAM & Admin → Service Accounts

2. **Create Service Account:**
   - Click "+ CREATE SERVICE ACCOUNT"
   
   **Account Details:**
   - Service account name: `shackles-sheets-exporter`
   - Service account ID: `shackles-sheets-exporter` (auto-filled)
   - Description: `Service account for exporting symposium data to Google Sheets`
   - Click "CREATE AND CONTINUE"

   **Grant Access (Optional):**
   - Skip this step (not needed for Sheets API)
   - Click "CONTINUE"

   **Grant Users Access (Optional):**
   - Skip this step
   - Click "DONE"

3. **Create JSON Key:**
   - Find your newly created service account in the list
   - Click on it to open details
   - Go to "KEYS" tab
   - Click "ADD KEY" → "Create new key"
   - Select "JSON" format
   - Click "CREATE"
   - **A JSON file will be downloaded automatically** (e.g., `shackles-symposium-abc123.json`)

**🔒 IMPORTANT:** Keep this JSON file secure! It contains credentials to access your Google Sheets.

---

### Step 3: Extract Credentials from JSON

Open the downloaded JSON file. It looks like this:

```json
{
  "type": "service_account",
  "project_id": "shackles-symposium",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...(long key)...==\n-----END PRIVATE KEY-----\n",
  "client_email": "shackles-sheets-exporter@shackles-symposium.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**Extract these two values:**
1. `client_email` → Copy this email address
2. `private_key` → Copy the entire private key (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

---

### Step 4: Configure Backend .env File

Open `backend/.env` and update the Google Sheets section:

```env
# GOOGLE SHEETS INTEGRATION
GOOGLE_CLIENT_EMAIL=shackles-sheets-exporter@shackles-symposium.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...(your full key)...==\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_google_sheet_id_here
```

**⚠️ Important Notes:**
- `GOOGLE_PRIVATE_KEY` must be wrapped in **double quotes**
- Keep the `\n` characters in the private key (they represent newlines)
- Don't add extra spaces or line breaks inside the quotes

**Example (with shortened key):**
```env
GOOGLE_CLIENT_EMAIL=shackles-sheets-exporter@shackles-symposium.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...(long key)...QEFAASC\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
```

---

### Step 5: Create Google Sheet & Share Access

#### 5.1 Create New Google Sheet

1. Go to: https://sheets.google.com/
2. Click "+ Blank" to create new spreadsheet
3. Name it: `SHACKLES 2025 - Registrations`

#### 5.2 Get Sheet ID

Look at the URL of your Google Sheet:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t/edit
                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                        This is your GOOGLE_SHEET_ID
```

**Copy this ID** and add it to your `.env` file.

#### 5.3 Share Sheet with Service Account

**CRITICAL STEP - Don't Skip!**

1. In your Google Sheet, click the **"Share"** button (top-right)
2. In "Add people and groups", **paste your service account email:**
   ```
   shackles-sheets-exporter@shackles-symposium.iam.gserviceaccount.com
   ```
3. Set permission to **"Editor"**
4. **Uncheck** "Notify people" (service accounts don't need notifications)
5. Click **"Share"** or **"Send"**

**Why?** Without sharing, the service account cannot write to your sheet!

---

### Step 6: Save Service Account JSON (Alternative Method)

Instead of adding credentials to `.env`, you can use the JSON file directly:

#### 6.1 Save JSON File

1. Create a `config` folder in backend (if not exists):
   ```powershell
   mkdir "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium\backend\config"
   ```

2. Move your downloaded JSON file there:
   ```powershell
   Move-Item "C:\Users\YourName\Downloads\shackles-symposium-abc123.json" "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium\backend\config\google-service-account.json"
   ```

3. Update `.env` to point to this file:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=config/google-service-account.json
   ```

#### 6.2 Add to .gitignore

**IMPORTANT:** Never commit service account JSON to Git!

Open `backend/.gitignore` and add:
```
# Google Service Account
config/google-service-account.json
*.json
```

---

## 🧪 TESTING GOOGLE SHEETS EXPORT

### Method 1: Using Service Account JSON File

Update `backend/src/utils/googleSheets.js` to use the JSON file:

```javascript
const getGoogleSheetsClient = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../../config/google-service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    return sheets;
  } catch (error) {
    console.error('Google Sheets auth error:', error);
    throw new Error('Failed to authenticate with Google Sheets API');
  }
};
```

### Method 2: Using Environment Variables

Update `backend/src/utils/googleSheets.js` to use .env credentials:

```javascript
const getGoogleSheetsClient = async () => {
  try {
    // Create credentials object from environment variables
    const credentials = {
      type: 'service_account',
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      project_id: process.env.GOOGLE_PROJECT_ID || 'shackles-symposium'
    };

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    return sheets;
  } catch (error) {
    console.error('Google Sheets auth error:', error);
    throw new Error('Failed to authenticate with Google Sheets API');
  }
};
```

---

### Test Script

Save this as `test-google-sheets.ps1`:

```powershell
# Test Google Sheets Export

Write-Host "`n📊 Testing Google Sheets Export..." -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

# Check if backend is running
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get -TimeoutSec 2
    Write-Host "✅ Backend is running`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running! Start it first:`n" -ForegroundColor Red
    Write-Host "   cd backend ; node src/server.js`n" -ForegroundColor Yellow
    exit 1
}

# Login as admin
Write-Host "1. Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "harish@test.com"
    password = "Loki@2403"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    $token = $login.token
    Write-Host "   ✅ Admin logged in: $($login.data.user.name)`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Login failed: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test Google Sheets Export
Write-Host "2. Exporting registrations to Google Sheets..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}
$exportBody = @{
    dataType = "registrations"
    filters = @{}
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/export/google-sheets" -Method Post -Headers $headers -ContentType "application/json" -Body $exportBody
    
    Write-Host "   ✅ Export successful!`n" -ForegroundColor Green
    Write-Host "   📊 Google Sheet URL:" -ForegroundColor Cyan
    Write-Host "   $($result.data.sheetUrl)`n" -ForegroundColor White
    Write-Host "   You can open this link in your browser to view the data.`n" -ForegroundColor Gray
    
} catch {
    Write-Host "   ❌ Export failed: $($_.Exception.Message)`n" -ForegroundColor Red
    Write-Host "   Check these things:" -ForegroundColor Yellow
    Write-Host "   1. Is Google Sheets API enabled in Google Cloud Console?" -ForegroundColor Gray
    Write-Host "   2. Is the service account email correct in .env?" -ForegroundColor Gray
    Write-Host "   3. Is the private key correct in .env?" -ForegroundColor Gray
    Write-Host "   4. Did you share your Google Sheet with the service account?" -ForegroundColor Gray
    Write-Host "   5. Is GOOGLE_SHEET_ID correct in .env?`n" -ForegroundColor Gray
}

Write-Host "===================================`n" -ForegroundColor Cyan
```

**Run the test:**
```powershell
cd "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium"
.\test-google-sheets.ps1
```

---

## 📋 API USAGE

### Endpoint

```
POST /api/v1/admin/export/google-sheets
Authorization: Bearer <admin-token>
Content-Type: application/json
```

### Request Body

```json
{
  "dataType": "registrations",
  "filters": {
    "status": "confirmed",
    "event": "event-id-here"
  }
}
```

### Response

```json
{
  "success": true,
  "message": "Data exported to Google Sheets successfully",
  "data": {
    "sheetUrl": "https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
  }
}
```

---

## 🎨 GOOGLE SHEETS FEATURES

The exported sheet will have:

✅ **Professional Formatting:**
- Blue header row with white text (#4F46E5)
- Frozen header row (stays visible while scrolling)
- Auto-fit columns
- All data properly formatted

✅ **Complete Data:**
- All registration fields
- Populated user information
- Populated event/workshop details
- Payment information
- Timestamps

✅ **Real-time Collaboration:**
- Share the link with team members
- Multiple people can view simultaneously
- Can download as Excel/PDF from Google Sheets
- Built-in filtering and sorting

---

## 🖥️ FRONTEND IMPLEMENTATION

### React Component Example

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const GoogleSheetsExport = () => {
  const [loading, setLoading] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');

  const handleExportToSheets = async (dataType, filters = {}) => {
    setLoading(true);
    setSheetUrl('');
    
    try {
      const response = await axios.post(
        '/api/v1/admin/export/google-sheets',
        { dataType, filters },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setSheetUrl(response.data.data.sheetUrl);
      alert('Data exported successfully! Click the link to view.');
      
    } catch (error) {
      alert('Export failed: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-sheets-export">
      <h3>📊 Export to Google Sheets</h3>
      
      <div className="export-buttons">
        <button 
          onClick={() => handleExportToSheets('registrations')}
          disabled={loading}
        >
          {loading ? 'Exporting...' : 'Export Registrations'}
        </button>

        <button 
          onClick={() => handleExportToSheets('users')}
          disabled={loading}
        >
          Export Users
        </button>

        <button 
          onClick={() => handleExportToSheets('payments', { paymentStatus: 'paid' })}
          disabled={loading}
        >
          Export Payments
        </button>
      </div>

      {sheetUrl && (
        <div className="sheet-link">
          <p>✅ Export successful!</p>
          <a href={sheetUrl} target="_blank" rel="noopener noreferrer">
            📊 Open Google Sheet →
          </a>
        </div>
      )}
    </div>
  );
};

export default GoogleSheetsExport;
```

---

## 🔧 TROUBLESHOOTING

### Error: "Failed to authenticate with Google Sheets API"

**Causes:**
1. Service account credentials are incorrect
2. JSON key file not found
3. Private key has incorrect formatting

**Solutions:**
- ✅ Verify `GOOGLE_CLIENT_EMAIL` matches the service account email
- ✅ Verify `GOOGLE_PRIVATE_KEY` is wrapped in double quotes
- ✅ Ensure `\n` characters are preserved in the private key
- ✅ Check the JSON file path is correct
- ✅ Restart the backend after changing .env

---

### Error: "The caller does not have permission"

**Causes:**
1. Google Sheet is not shared with service account
2. Service account has "Viewer" instead of "Editor" permission

**Solutions:**
- ✅ Open your Google Sheet
- ✅ Click "Share" button
- ✅ Add service account email with "Editor" permission
- ✅ Make sure you clicked "Share" or "Send"

---

### Error: "Requested entity was not found"

**Causes:**
1. `GOOGLE_SHEET_ID` is incorrect
2. Sheet was deleted
3. Sheet is in a different Google account

**Solutions:**
- ✅ Verify the Sheet ID from the URL
- ✅ Make sure the sheet exists
- ✅ Ensure you're using the correct Google account

---

### Error: "Google Sheets API has not been enabled"

**Causes:**
1. API is not enabled in Google Cloud Console
2. Wrong project selected

**Solutions:**
- ✅ Go to: https://console.cloud.google.com/apis/library
- ✅ Select your project (shackles-symposium)
- ✅ Search for "Google Sheets API"
- ✅ Click "ENABLE"
- ✅ Wait 2-3 minutes for activation

---

## 📊 COMPARISON: Excel vs Google Sheets

| Feature | Excel Export | Google Sheets Export |
|---------|--------------|---------------------|
| **Output** | .xlsx file download | Online shareable link |
| **Collaboration** | Manual sharing | Real-time collaboration |
| **Updates** | Re-export & re-download | Live updates in sheet |
| **Access** | Local file | Any device with internet |
| **Storage** | User's computer | Google Drive |
| **Sharing** | Email attachment | Share link |
| **Offline** | ✅ Yes | ❌ No (requires internet) |
| **Best for** | Backups, offline work | Team collaboration, dashboards |

---

## 🎯 USE CASES

### 1. Event Day Coordination
**Scenario:** Multiple coordinators need access to registration list

**Solution:**
```javascript
// Export all confirmed registrations
POST /api/v1/admin/export/google-sheets
{
  "dataType": "registrations",
  "filters": {
    "status": "confirmed",
    "event": "event-id"
  }
}
```
Share the returned Google Sheets URL with all coordinators.

---

### 2. Payment Tracking Dashboard
**Scenario:** Finance team needs real-time payment tracking

**Solution:**
```javascript
// Export all payments
POST /api/v1/admin/export/google-sheets
{
  "dataType": "payments",
  "filters": {}
}
```
Finance team gets live updates as payments are verified.

---

### 3. College-wise Participant Analysis
**Scenario:** Marketing team needs participant breakdown by college

**Solution:**
```javascript
// Export all users
POST /api/v1/admin/export/google-sheets
{
  "dataType": "users",
  "filters": {}
}
```
Team can use Google Sheets pivot tables for analysis.

---

## ✅ SETUP CHECKLIST

Before testing, make sure you've completed:

- [ ] Created Google Cloud project
- [ ] Enabled Google Sheets API
- [ ] Created service account
- [ ] Downloaded JSON key file
- [ ] Added credentials to `.env` file
- [ ] Created Google Sheet
- [ ] Copied Sheet ID to `.env`
- [ ] Shared sheet with service account email (as Editor)
- [ ] Restarted backend server
- [ ] Tested with PowerShell script

---

## 🚀 QUICK START COMMANDS

```powershell
# 1. Start backend
cd "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium\backend"
node src/server.js

# 2. In new terminal, test export
cd "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium"
.\test-google-sheets.ps1
```

---

## 📚 ADDITIONAL RESOURCES

- **Google Sheets API Documentation:** https://developers.google.com/sheets/api
- **Service Account Guide:** https://cloud.google.com/iam/docs/service-accounts
- **Google Cloud Console:** https://console.cloud.google.com/

---

**Your Google Sheets export is now ready! Follow the setup steps and test it.** 🎉

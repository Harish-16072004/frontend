# 📊 Google Sheets Export - Visual Flow Diagram

## 🔄 Complete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   GOOGLE SHEETS EXPORT FLOW                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   STEP 1:    │
│  Admin Panel │
│  (Frontend)  │
└──────┬───────┘
       │
       │ Click "Export to Google Sheets"
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  POST /api/v1/admin/export/google-sheets                 │
│  {                                                        │
│    "dataType": "registrations",                          │
│    "filters": { "status": "confirmed" }                  │
│  }                                                        │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Backend receives request
                   ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 2: adminController.js                              │
│  - Verifies admin authentication                         │
│  - Fetches data from MongoDB                             │
│  - Populates user/event details                          │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Data ready
                   ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 3: googleSheets.js                                 │
│  - Authenticates with Google API                         │
│  - Uses service account credentials                      │
│  - Gets Sheets API client                                │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Authenticated
                   ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 4: Write to Google Sheets                          │
│  - Clears existing data (A:Z)                            │
│  - Writes headers (first row)                            │
│  - Writes data rows                                      │
│  - Formats headers (blue background, white text)         │
│  - Freezes header row                                    │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Success
                   ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 5: Return Response                                 │
│  {                                                        │
│    "success": true,                                      │
│    "data": {                                             │
│      "sheetUrl": "https://docs.google.com/..."          │
│    }                                                     │
│  }                                                       │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ URL returned
                   ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 6: Frontend displays link                          │
│  "✅ Export successful! Click to view →"                 │
│  Opens link in new tab                                   │
└──────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│            GOOGLE API AUTHENTICATION                    │
└─────────────────────────────────────────────────────────┘

METHOD 1: JSON Key File
───────────────────────

backend/.env                backend/config/
┌─────────────┐            ┌──────────────────────┐
│             │            │ google-service-      │
│ GOOGLE_     │  ───────►  │ account.json         │
│ APPLICATION │  points to │                      │
│ _CREDENTIALS│            │ {                    │
│             │            │   "client_email":... │
└─────────────┘            │   "private_key": ... │
                           │ }                    │
                           └──────────┬───────────┘
                                      │
                                      │ Loaded by
                                      │ googleapis
                                      ▼
                           ┌──────────────────────┐
                           │ Google Sheets API    │
                           │ ✅ Authenticated     │
                           └──────────────────────┘


METHOD 2: Environment Variables (Recommended)
──────────────────────────────────────────────

backend/.env
┌───────────────────────────────────────────┐
│ GOOGLE_CLIENT_EMAIL=service@...          │
│ GOOGLE_PRIVATE_KEY="-----BEGIN..."       │
└───────────────┬───────────────────────────┘
                │
                │ Read by
                │ googleSheets.js
                ▼
┌───────────────────────────────────────────┐
│ Creates credentials object:               │
│ {                                         │
│   type: 'service_account',                │
│   client_email: process.env.GOOGLE_...,  │
│   private_key: process.env.GOOGLE_...    │
│ }                                         │
└───────────────┬───────────────────────────┘
                │
                │ Authenticates
                ▼
┌───────────────────────────────────────────┐
│ Google Sheets API                         │
│ ✅ Authenticated                          │
└───────────────────────────────────────────┘
```

---

## 📝 Permission Flow

```
┌──────────────────────────────────────────────────────────┐
│          WHO CAN ACCESS YOUR GOOGLE SHEET?               │
└──────────────────────────────────────────────────────────┘

YOUR GOOGLE ACCOUNT
┌────────────────────┐
│ harish@gmail.com   │  ←── Owner (full access)
└────────────────────┘
         │
         │ Creates sheet
         ▼
┌────────────────────────────────────┐
│  Google Sheet:                     │
│  "SHACKLES 2025 - Registrations"   │
│                                    │
│  ID: 1a2b3c...                     │
└────────────┬───────────────────────┘
             │
             │ Share with (CRITICAL STEP!)
             ▼
┌────────────────────────────────────────────────────┐
│ SERVICE ACCOUNT                                    │
│ shackles-sheets-exporter@shackles-symposium...     │
│                                                    │
│ Permission: Editor                                 │
│                                                    │
│ This allows your backend to:                      │
│ ✅ Read sheet data                                │
│ ✅ Write/update data                              │
│ ✅ Format cells                                   │
│ ✅ Clear data                                     │
└────────────────────────────────────────────────────┘

WITHOUT SHARING → ❌ "Caller does not have permission" error
WITH SHARING    → ✅ Export works perfectly
```

---

## 🗂️ Data Structure in Sheet

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  GOOGLE SHEET: SHACKLES 2025 - Registrations                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Row 1 (Header - Blue background, white text, frozen):                     │
│  ┌────────────┬──────────┬────────────┬─────────┬──────────┬─────────┐   │
│  │Registration│ Name     │ Email      │ College │ Event    │ Status  │   │
│  │ Number     │          │            │         │          │         │   │
│  └────────────┴──────────┴────────────┴─────────┴──────────┴─────────┘   │
│                                                                             │
│  Row 2+: Data rows                                                          │
│  ┌────────────┬──────────┬────────────┬─────────┬──────────┬─────────┐   │
│  │SHACK2025001│ Harish J │ harish@... │ ACGCET  │ Tech Sym │confirmed│   │
│  ├────────────┼──────────┼────────────┼─────────┼──────────┼─────────┤   │
│  │SHACK2025002│ John Doe │ john@...   │ MIT     │ Workshop │ pending │   │
│  ├────────────┼──────────┼────────────┼─────────┼──────────┼─────────┤   │
│  │SHACK2025003│ Jane Sm. │ jane@...   │ ACGCET  │ Hackath. │confirmed│   │
│  └────────────┴──────────┴────────────┴─────────┴──────────┴─────────┘   │
│                                                                             │
│  Features:                                                                  │
│  • Auto-fit columns                                                         │
│  • Sortable/filterable                                                      │
│  • Can add charts/pivot tables                                              │
│  • Download as Excel/PDF                                                    │
│  • Share with team members                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Update Flow (Live Sync)

```
SCENARIO: New registration happens
──────────────────────────────────

Time: 10:00 AM
┌────────────────────┐
│ User registers     │
│ on website         │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Saved to MongoDB   │
└────────────────────┘

Time: 10:05 AM
┌────────────────────┐
│ Admin clicks       │
│ "Export to Sheets" │
└─────────┬──────────┘
          │
          ▼
┌────────────────────────────┐
│ Current data exported      │
│ (includes new registration)│
└────────────────────────────┘
          │
          ▼
┌────────────────────────────┐
│ Google Sheet UPDATED       │
│ Old data cleared           │
│ Fresh data written         │
│                            │
│ Team sees latest data! ✅  │
└────────────────────────────┘

⚠️ Note: Not real-time! 
   Must click export again to sync.
```

---

## 🎨 Sheet Formatting Details

```
┌─────────────────────────────────────────────────────┐
│  HEADER ROW FORMATTING                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Background Color: #4F46E5 (Indigo)                │
│  ████████████████████████████                       │
│                                                     │
│  Text Color: #FFFFFF (White)                        │
│  Font Weight: Bold                                  │
│  Frozen: Yes (stays visible while scrolling)       │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  DATA ROWS                                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Format: Plain text                                 │
│  Auto-fit: Columns sized to content                 │
│  Borders: Standard grid lines                       │
│  Editable: Yes (if you have Editor permission)      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Export Types Comparison

```
┌──────────────────────────────────────────────────────────────┐
│              WHAT CAN YOU EXPORT?                            │
├──────────────────────────────────────────────────────────────┤

1. REGISTRATIONS (dataType: "registrations")
   ┌────────────────────────────────────────────────┐
   │ Fields Included:                               │
   │ • Registration number                          │
   │ • User info (name, email, phone, college)      │
   │ • Event/Workshop details                       │
   │ • Payment info                                 │
   │ • Status (pending/confirmed/attended)          │
   │ • Verification status                          │
   │ • QR code URL                                  │
   │ • Timestamps                                   │
   └────────────────────────────────────────────────┘

2. USERS (dataType: "users")
   ┌────────────────────────────────────────────────┐
   │ Fields Included:                               │
   │ • Name                                         │
   │ • Email                                        │
   │ • Phone                                        │
   │ • College                                      │
   │ • Department                                   │
   │ • Year                                         │
   │ • Roll number                                  │
   │ • Account created date                         │
   └────────────────────────────────────────────────┘

3. PAYMENTS (dataType: "payments")
   ┌────────────────────────────────────────────────┐
   │ Fields Included:                               │
   │ • User info                                    │
   │ • Amount                                       │
   │ • Payment method                               │
   │ • Transaction ID                               │
   │ • Status (pending/success/failed)              │
   │ • Payment screenshot URL                       │
   │ • Verification status                          │
   │ • Verified by (admin)                          │
   │ • Payment date                                 │
   └────────────────────────────────────────────────┘
```

---

## 🔍 Troubleshooting Flowchart

```
Export Failed? 🚨
│
├─ Error: "Failed to authenticate"
│  │
│  ├─ Check: GOOGLE_CLIENT_EMAIL in .env?
│  │  ├─ ✅ Yes → Continue
│  │  └─ ❌ No → Add it from JSON file
│  │
│  ├─ Check: GOOGLE_PRIVATE_KEY in .env?
│  │  ├─ ✅ Yes → Continue
│  │  └─ ❌ No → Add it from JSON file
│  │
│  ├─ Check: Private key has quotes and \n?
│  │  ├─ ✅ Yes → Continue
│  │  └─ ❌ No → Fix formatting
│  │
│  └─ Check: Backend restarted after .env change?
│     ├─ ✅ Yes → Contact support
│     └─ ❌ No → Restart backend!
│
├─ Error: "Caller does not have permission"
│  │
│  └─ Check: Sheet shared with service account?
│     ├─ ✅ Yes → Check permission is "Editor"
│     └─ ❌ No → Share sheet with service account email!
│
├─ Error: "Requested entity was not found"
│  │
│  └─ Check: GOOGLE_SHEET_ID correct?
│     ├─ ✅ Yes → Sheet might be deleted
│     └─ ❌ No → Copy ID from sheet URL
│
└─ Error: "API has not been enabled"
   │
   └─ Check: Google Sheets API enabled?
      ├─ ✅ Yes → Wait 2-3 minutes
      └─ ❌ No → Enable in Cloud Console
```

---

## 📈 Use Case Examples

```
USE CASE 1: Event Day Registration Desk
────────────────────────────────────────
┌─────────────────────────────────────────┐
│ SITUATION:                              │
│ 5 volunteers at registration desk      │
│ Need to check who's registered          │
│                                         │
│ SOLUTION:                               │
│ 1. Export confirmed registrations       │
│ 2. Share Google Sheet link with team    │
│ 3. Each volunteer opens on their phone  │
│ 4. Search participant name              │
│ 5. Mark attendance manually in sheet    │
└─────────────────────────────────────────┘


USE CASE 2: Marketing Analysis
──────────────────────────────
┌─────────────────────────────────────────┐
│ SITUATION:                              │
│ Need to know which colleges have most   │
│ registrations for marketing decisions   │
│                                         │
│ SOLUTION:                               │
│ 1. Export all users                     │
│ 2. Create pivot table in Google Sheets  │
│ 3. Group by "College" column            │
│ 4. Count registrations per college      │
│ 5. Create chart for presentation        │
└─────────────────────────────────────────┘


USE CASE 3: Payment Tracking
────────────────────────────
┌─────────────────────────────────────────┐
│ SITUATION:                              │
│ Finance team needs real-time payment    │
│ status without accessing admin panel    │
│                                         │
│ SOLUTION:                               │
│ 1. Export payments (approved only)      │
│ 2. Share sheet with finance team        │
│ 3. Team sees: amount, method, date      │
│ 4. Can calculate totals with SUM()      │
│ 5. Re-export daily for updates          │
└─────────────────────────────────────────┘
```

---

**This visual guide complements the setup documentation!**
**See `GOOGLE_SHEETS_EXPORT_GUIDE.md` for step-by-step instructions.**

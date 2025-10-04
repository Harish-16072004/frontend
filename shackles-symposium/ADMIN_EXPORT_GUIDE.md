# 📊 Admin Export Functionality Guide - Excel & PDF

## 🎯 Overview

Your admin panel has powerful export features to download data in multiple formats:

1. **📗 Excel Export** - Download registrations, users, payments as `.xlsx` files
2. **📄 PDF Export** - Generate event tickets and reports as PDF
3. **📊 Google Sheets Export** - Export directly to Google Sheets (optional)

---

## 📗 EXCEL EXPORT FUNCTIONALITY

### 🔧 **How It Works**

Admin can export data in Excel format for:
- All registrations
- All users
- All payments
- Filtered data (by status, event, date, etc.)

---

### 📋 **API Endpoint**

```
POST /api/v1/admin/export/excel
Authorization: Bearer <admin-token>
Content-Type: application/json
```

### 📥 **Request Body**

```json
{
  "dataType": "registrations",  // or "users" or "payments"
  "filters": {                   // Optional filters
    "status": "confirmed",
    "event": "event-id-here",
    "createdAt": {
      "$gte": "2025-01-01",
      "$lte": "2025-12-31"
    }
  }
}
```

### ✅ **Response**

The API returns an Excel file (`.xlsx`) for download with:
- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Filename**: `registrations-1728000000000.xlsx`
- **File is automatically downloaded by browser**

---

### 🧪 **Testing Excel Export**

#### Test 1: Export All Registrations

```powershell
# Login as admin
$adminLogin = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{email="admin@shackles.com";password="admin123"} | ConvertTo-Json)
$adminToken = $adminLogin.token

# Export registrations
$headers = @{"Authorization" = "Bearer $adminToken"}
$body = @{dataType = "registrations"} | ConvertTo-Json

# Download Excel file
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/export/excel" -Method Post -Headers $headers -ContentType "application/json" -Body $body -OutFile "registrations.xlsx"

Write-Host "✅ Excel file downloaded: registrations.xlsx"
```

#### Test 2: Export Confirmed Registrations Only

```powershell
$headers = @{"Authorization" = "Bearer $adminToken"}
$body = @{
    dataType = "registrations"
    filters = @{
        status = "confirmed"
        verificationStatus = "approved"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/export/excel" -Method Post -Headers $headers -ContentType "application/json" -Body $body -OutFile "confirmed-registrations.xlsx"

Write-Host "✅ Filtered Excel downloaded: confirmed-registrations.xlsx"
```

#### Test 3: Export All Users

```powershell
$headers = @{"Authorization" = "Bearer $adminToken"}
$body = @{dataType = "users"} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/export/excel" -Method Post -Headers $headers -ContentType "application/json" -Body $body -OutFile "users.xlsx"

Write-Host "✅ Users exported: users.xlsx"
```

#### Test 4: Export Payments

```powershell
$headers = @{"Authorization" = "Bearer $adminToken"}
$body = @{
    dataType = "payments"
    filters = @{
        paymentStatus = "paid"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/export/excel" -Method Post -Headers $headers -ContentType "application/json" -Body $body -OutFile "payments.xlsx"

Write-Host "✅ Payments exported: payments.xlsx"
```

---

### 📊 **Excel File Features**

The generated Excel file includes:

✅ **Beautiful Formatting:**
- Blue header row with white text
- Auto-sized columns
- Borders around all cells
- Readable fonts

✅ **Complete Data:**
- All registration fields
- User information (populated)
- Event/Workshop details (populated)
- Payment information
- Timestamps

✅ **Example Excel Structure (Registrations):**

| Registration Number | User Name | Email | Phone | College | Event | Status | Payment Status | Verified | Amount | Created At |
|---------------------|-----------|-------|-------|---------|-------|--------|----------------|----------|--------|------------|
| SHACK202500001 | Harish J | harish@test.com | 9876543210 | ACGCET | Tech Symposium | confirmed | paid | approved | 500 | 2025-10-04 |
| SHACK202500002 | John Doe | john@example.com | 9876543211 | MIT | Workshop 2025 | pending | pending | pending | 300 | 2025-10-05 |

---

## 📄 PDF EXPORT FUNCTIONALITY

### 🎫 **PDF Ticket Generation**

Admin can generate PDF tickets for confirmed registrations.

### 📋 **API Endpoint**

```
GET /api/v1/registrations/:id/download-ticket
Authorization: Bearer <user-or-admin-token>
```

### 🧪 **Testing PDF Ticket Generation**

```powershell
# Get registration ID first
$headers = @{"Authorization" = "Bearer $token"}
$registrations = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/registrations/my-registrations" -Method Get -Headers $headers

$registrationId = $registrations.data[0]._id

# Download PDF ticket
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/registrations/$registrationId/download-ticket" -Method Get -Headers $headers -OutFile "ticket.pdf"

Write-Host "✅ PDF ticket downloaded: ticket.pdf"
```

### 📄 **PDF Ticket Features**

The generated PDF includes:

✅ **Professional Design:**
- SHACKLES 2025 header with branding
- Event details section
- Participant information
- QR code for entry verification
- Styled borders and colors

✅ **Ticket Information:**
- Registration number
- Participant name, email, phone
- College and department
- Event/Workshop name
- Date, time, venue
- **Scannable QR code** (embedded)
- Instructions for entry

✅ **Example PDF Layout:**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│           🎉 SHACKLES 2025 🎉                   │
│   National Level Technical Symposium            │
│   Parisutham Institute of Technology            │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│            EVENT TICKET                         │
│                                                 │
│  Event Name:         Tech Symposium 2025        │
│  Registration No:    SHACK202500001             │
│  Participant:        Harish J                   │
│  Email:              harish@test.com            │
│  College:            ACGCET                     │
│  Department:         Mechanical Engineering     │
│                                                 │
│  Date:               March 15, 2025             │
│  Venue:              Main Auditorium            │
│                                                 │
│           [QR CODE HERE]                        │
│       Scan this at entrance                     │
│                                                 │
│  Important: Bring this ticket and valid ID      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📊 GOOGLE SHEETS EXPORT (Optional)

### 📋 **API Endpoint**

```
POST /api/v1/admin/export/google-sheets
Authorization: Bearer <admin-token>
Content-Type: application/json
```

### 📥 **Request Body**

```json
{
  "dataType": "registrations",
  "filters": {}
}
```

### ✅ **Response**

```json
{
  "success": true,
  "message": "Data exported to Google Sheets successfully",
  "data": {
    "sheetUrl": "https://docs.google.com/spreadsheets/d/..."
  }
}
```

**Note:** Requires Google Sheets API setup (separate configuration).

---

## 🎯 **Data Types Available for Export**

### 1. **Registrations** (`dataType: "registrations"`)

**Exported Fields:**
- registrationNumber
- user (name, email, phone, college, department)
- event/workshop (name, category, fees)
- status (pending, confirmed, attended)
- paymentStatus (pending, paid, failed)
- verificationStatus (pending, approved, rejected)
- paymentScreenshot (S3 URL)
- transactionId
- qrCode (S3 URL)
- amount
- createdAt, updatedAt

**Use Cases:**
- Attendee list for event
- Payment verification tracking
- Registration analytics
- Attendance reports

---

### 2. **Users** (`dataType: "users"`)

**Exported Fields:**
- name
- email
- phone
- college
- department
- year
- rollNumber
- role (user, admin)
- isVerified
- createdAt

**Use Cases:**
- User database backup
- Contact list for bulk emails
- College-wise participant analysis
- Department-wise statistics

---

### 3. **Payments** (`dataType: "payments"`)

**Exported Fields:**
- user (name, email)
- amount
- paymentMethod
- transactionId
- status (pending, success, failed)
- paymentScreenshot
- verificationStatus
- verifiedBy
- createdAt

**Use Cases:**
- Financial reports
- Payment reconciliation
- Transaction audit
- Revenue analysis

---

## 🔍 **Advanced Filtering Examples**

### Filter by Date Range

```json
{
  "dataType": "registrations",
  "filters": {
    "createdAt": {
      "$gte": "2025-01-01T00:00:00.000Z",
      "$lte": "2025-12-31T23:59:59.999Z"
    }
  }
}
```

### Filter by College

```json
{
  "dataType": "users",
  "filters": {
    "college": "ACGCET"
  }
}
```

### Filter by Event

```json
{
  "dataType": "registrations",
  "filters": {
    "event": "event-object-id-here",
    "status": "confirmed"
  }
}
```

### Filter by Payment Status

```json
{
  "dataType": "registrations",
  "filters": {
    "paymentStatus": "paid",
    "verificationStatus": "approved"
  }
}
```

---

## 🖥️ **Frontend Implementation Guide**

### React Component Example:

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const ExportData = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async (dataType, filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.post(
        '/api/v1/admin/export/excel',
        { dataType, filters },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          responseType: 'blob' // Important for file download
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${dataType}-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert('Excel file downloaded successfully!');
    } catch (error) {
      alert('Export failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-controls">
      <h3>Export Data</h3>
      
      <button 
        onClick={() => handleExport('registrations')}
        disabled={loading}
      >
        {loading ? 'Exporting...' : 'Export All Registrations'}
      </button>

      <button 
        onClick={() => handleExport('registrations', { status: 'confirmed' })}
        disabled={loading}
      >
        Export Confirmed Only
      </button>

      <button 
        onClick={() => handleExport('users')}
        disabled={loading}
      >
        Export All Users
      </button>

      <button 
        onClick={() => handleExport('payments', { paymentStatus: 'paid' })}
        disabled={loading}
      >
        Export Payments
      </button>
    </div>
  );
};

export default ExportData;
```

---

## 📱 **Admin Dashboard - Export Section**

### Suggested UI Layout:

```
╔═══════════════════════════════════════════════╗
║  📊 EXPORT DATA                               ║
╠═══════════════════════════════════════════════╣
║                                               ║
║  Select Data Type:                            ║
║  ( ) Registrations                            ║
║  ( ) Users                                    ║
║  ( ) Payments                                 ║
║                                               ║
║  Filters:                                     ║
║  Status: [All ▼]                              ║
║  Date From: [2025-01-01]                      ║
║  Date To: [2025-12-31]                        ║
║  Event: [All Events ▼]                        ║
║                                               ║
║  [📗 Export to Excel]  [📊 Export to Sheets]  ║
║                                               ║
╚═══════════════════════════════════════════════╝

╔═══════════════════════════════════════════════╗
║  🎫 GENERATE TICKETS                          ║
╠═══════════════════════════════════════════════╣
║                                               ║
║  Registration Number: [SHACK202500001]        ║
║                                               ║
║  [📄 Download PDF Ticket]                     ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

---

## ✅ **Quick Test Script**

Save this as `test-exports.ps1`:

```powershell
# Test Admin Export Functionality

Write-Host "`n📊 Testing Export Functionality..." -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Login as admin
Write-Host "1. Logging in as admin..." -ForegroundColor Yellow
$login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{email="admin@shackles.com";password="admin123"} | ConvertTo-Json)
$token = $login.token
Write-Host "   ✅ Admin logged in`n" -ForegroundColor Green

# Test 1: Export Registrations
Write-Host "2. Exporting all registrations..." -ForegroundColor Yellow
$headers = @{"Authorization" = "Bearer $token"}
$body = @{dataType = "registrations"} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/export/excel" -Method Post -Headers $headers -ContentType "application/json" -Body $body -OutFile "registrations.xlsx"
    Write-Host "   ✅ registrations.xlsx downloaded`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Test 2: Export Users
Write-Host "3. Exporting all users..." -ForegroundColor Yellow
$body = @{dataType = "users"} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/export/excel" -Method Post -Headers $headers -ContentType "application/json" -Body $body -OutFile "users.xlsx"
    Write-Host "   ✅ users.xlsx downloaded`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Test 3: Export Confirmed Registrations
Write-Host "4. Exporting confirmed registrations..." -ForegroundColor Yellow
$body = @{dataType = "registrations"; filters = @{status = "confirmed"}} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/export/excel" -Method Post -Headers $headers -ContentType "application/json" -Body $body -OutFile "confirmed.xlsx"
    Write-Host "   ✅ confirmed.xlsx downloaded`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)`n" -ForegroundColor Red
}

Write-Host "====================================`n" -ForegroundColor Cyan
Write-Host "✅ Export tests complete!" -ForegroundColor Cyan
Write-Host "Check current folder for Excel files.`n" -ForegroundColor Gray
```

**Run it:**
```powershell
.\test-exports.ps1
```

---

## 📊 **Summary**

| Feature | Endpoint | Method | Response | Use Case |
|---------|----------|--------|----------|----------|
| **Export Excel** | `/api/v1/admin/export/excel` | POST | `.xlsx` file | Download registrations/users/payments |
| **Export Google Sheets** | `/api/v1/admin/export/google-sheets` | POST | Sheet URL | Share data online |
| **Download Ticket** | `/api/v1/registrations/:id/download-ticket` | GET | `.pdf` file | User event ticket |

---

## 🎯 **Key Features:**

✅ **Excel Export:**
- Professional formatting (blue headers, borders)
- Auto-sized columns
- Supports filtering
- Downloads as `.xlsx`

✅ **PDF Ticket:**
- Branded design
- QR code embedded
- All event details
- Ready to print

✅ **Flexible Filters:**
- By status
- By date range
- By event
- By college
- Custom MongoDB queries

---

**Your export functionality is ready to use! Test it with the commands above.** 🚀

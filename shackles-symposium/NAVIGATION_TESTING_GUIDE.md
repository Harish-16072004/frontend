# 🎉 SHACKLES 25-26 - SYSTEM READY FOR TESTING

## ✅ SERVERS RUNNING SUCCESSFULLY

### Backend Server ✅
```
🚀 Server:      http://localhost:5000
🌍 Environment: development
📊 Database:    Connected (MongoDB Atlas - shackles_db)
🔒 CORS:        Enabled for http://localhost:3000
✨ Status:      Ready to accept requests!
```

### Frontend Server ✅
```
➜  Local:   http://localhost:3000/
📦 Build:   Vite v5.4.20
⚡ Status:  Ready
```

---

## 🔐 ADMIN LOGIN CREDENTIALS

```
📧 Email:    admin@acgcet.edu
🔑 Password: Admin@123
👤 Role:     admin
```

---

## 🗺️ COMPLETE NAVIGATION MAP

### 1️⃣ START HERE: Admin Login
1. Open browser to: **http://localhost:3000**
2. Click **"Login"** in header navigation
3. Enter admin credentials:
   - Email: `admin@acgcet.edu`
   - Password: `Admin@123`
4. Click **"Login"** button
5. You will be redirected to the **Admin Dashboard**

---

## 🎯 NAVIGATION TESTING FLOW

### Phase 1: Admin Dashboard (`/admin`)
**URL**: http://localhost:3000/admin

#### What You Should See:
✅ **Statistics Cards** (4 cards):
- Total Registrations
- Verified Payments
- Pending Payments
- Total Revenue

✅ **Quick Actions** (5 cards):
1. 👥 **Manage Users** → Click to test User Management
2. 📅 **Manage Events** → Click to test Event Management
3. 💳 **Verify Payments** → Click to test Payment Verification
4. 📷 **QR Scanner** → Click to test QR Scanning
5. 🎒 **Kit Distribution** → Click to test Kit Distribution

✅ **Event-wise Registrations Chart**
✅ **Recent Registrations Table**

---

### Phase 2: User Management (`/admin/users`)
**Navigation**: Click "Manage Users" card OR visit http://localhost:3000/admin/users

#### Test Checklist:
- [ ] **Page loads without errors**
- [ ] **Statistics dashboard displays** (8 metrics at top)
- [ ] **Users table shows** with columns:
  - Checkbox for bulk selection
  - Participant ID
  - Name, Email, Phone
  - College
  - Registration Type
  - Payment Status
  - Kit Status
  - Actions (View Details, Edit, Delete)

#### Test Search & Filters:
- [ ] **Search box** - Type to search users
- [ ] **Registration Type Filter** - Dropdown (All/General/Workshop/Both)
- [ ] **Payment Status Filter** - Dropdown (All/Verified/Pending/Failed)
- [ ] **Kit Status Filter** - Dropdown (All/Collected/Not Collected)

#### Test Bulk Actions:
1. **Select Users**:
   - [ ] Click individual checkboxes
   - [ ] Click "Select All" checkbox in table header
   - [ ] Watch selected count update

2. **Bulk Actions Bar** (appears when users selected):
   - [ ] ✅ **Verify Payments** - Verify multiple payments at once
   - [ ] 🎫 **Generate IDs** - Generate participant IDs for selected users
   - [ ] 📧 **Send Emails** - Send bulk emails (choose template)
   - [ ] 💾 **Export to CSV** - Download selected users as CSV
   - [ ] 🗑️ **Delete Selected** - Remove selected users (with confirmation)

3. **View User Details**:
   - [ ] Click "View Details" on any user
   - [ ] Modal opens showing:
     - Full user information
     - Payment details
     - QR code (if generated)
     - Action buttons
   - [ ] Click "Download QR" to save QR code
   - [ ] Close modal (X button or click outside)

#### Test Pagination:
- [ ] Navigate between pages (10 users per page)
- [ ] Page numbers update correctly

---

### Phase 3: Event Management (`/admin/events`)
**Navigation**: Click "Manage Events" card OR visit http://localhost:3000/admin/events

#### Test Tab System:
- [ ] **Events Tab** - Should be active by default
- [ ] **Workshops Tab** - Click to switch

#### Test Statistics:
- [ ] **Total Events** count
- [ ] **Total Workshops** count
- [ ] **Upcoming Events** count
- [ ] **Total Registrations** count

#### Test Events Tab:

1. **Create New Event**:
   - [ ] Click **"Create Event"** button
   - [ ] Modal opens with form
   - [ ] Fill in required fields:
     ```
     Event Name: Test Technical Event
     Category: Technical
     Description: Test event description
     Date: [Select future date]
     Time: [Select time]
     Venue: Main Hall
     Coordinator Name: John Doe
     Coordinator Email: john@example.com
     Coordinator Phone: 9999999999
     Registration Fee: 500
     Max Participants: 100
     ```
   - [ ] **Add Dynamic Fields**:
     - Rules: Click "Add Rule" → Enter rule text
     - Prizes: Click "Add Prize" → Enter prize details
     - Speakers: Click "Add Speaker" → Enter speaker info
     - Sponsors: Click "Add Sponsor" → Enter sponsor name
     - Requirements: Click "Add Requirement" → Enter requirement
   - [ ] Click **"Create Event"** button
   - [ ] Success message appears
   - [ ] New event card appears in grid

2. **View Event Cards**:
   - [ ] Each card shows:
     - Event name
     - Category badge (colored)
     - Date & time
     - Venue
     - Registration count
     - Status badge
     - Edit and Delete buttons

3. **Edit Event**:
   - [ ] Click **"Edit"** button on any event
   - [ ] Modal opens with pre-filled data
   - [ ] Modify any field (change name, date, etc.)
   - [ ] Add/remove dynamic fields
   - [ ] Click **"Update Event"** button
   - [ ] Verify changes appear in card

4. **Delete Event**:
   - [ ] Click **"Delete"** button on test event
   - [ ] Confirmation dialog appears
   - [ ] Click "Confirm"
   - [ ] Event removed from grid

5. **Search & Filter**:
   - [ ] Search by event name
   - [ ] Filter by category (All/Technical/Non-Technical/Special)
   - [ ] Results update in real-time

#### Test Workshops Tab:

1. **Switch to Workshops**:
   - [ ] Click **"Workshops"** tab
   - [ ] Tab becomes active
   - [ ] Workshops grid loads

2. **Create Workshop**:
   - [ ] Click **"Create Workshop"** button
   - [ ] Fill in form:
     ```
     Workshop Name: Test Workshop
     Description: Workshop description
     Date: [Select date]
     Time: [Select time]
     Duration: 3 hours
     Venue: Lab 101
     Instructor Name: Jane Smith
     Instructor Email: jane@example.com
     Instructor Phone: 8888888888
     Registration Fee: 800
     Max Participants: 50
     ```
   - [ ] Add dynamic fields:
     - Prerequisites: "Basic programming knowledge"
     - Topics: "Topic 1", "Topic 2"
     - Tools: "Laptop", "IDE"
     - Benefits: "Hands-on experience"
   - [ ] Click **"Create Workshop"** button
   - [ ] Verify success

3. **Edit & Delete Workshop**:
   - [ ] Test edit functionality (same as events)
   - [ ] Test delete functionality (same as events)

4. **Search Workshops**:
   - [ ] Search by workshop name
   - [ ] Verify results

---

### Phase 4: QR Scanner (`/admin/scanner`)
**Navigation**: Click "QR Scanner" card OR visit http://localhost:3000/admin/scanner

#### Test QR Scanner:
- [ ] Page loads QR scanner component
- [ ] Browser requests camera permission
- [ ] Grant camera access
- [ ] Camera feed appears in scanner box
- [ ] Select camera from dropdown (if multiple cameras)

#### Test QR Scanning:
**Note**: You need a valid participant QR code to test this

1. **Scan Valid QR Code**:
   - [ ] Hold QR code in front of camera
   - [ ] Scanner detects and decodes QR
   - [ ] Participant details display:
     - Name
     - Participant ID
     - Registration Type
     - Payment Status
     - Kit Status
   - [ ] Success animation plays

2. **Scan Invalid QR Code**:
   - [ ] Scan random QR code
   - [ ] Error message appears
   - [ ] Error animation plays

---

### Phase 5: Event Check-In (`/admin/event-checkin/:eventId`)
**Navigation**: Manual URL (replace :eventId with actual event ID)

**Example**: http://localhost:3000/admin/event-checkin/67123456789abcdef0123456

#### Test Event Check-In:
- [ ] Page loads with event details at top
- [ ] QR scanner initializes
- [ ] Camera permission granted

#### Test Access Control:

1. **Authorized Participant**:
   - [ ] Scan QR of user registered for THIS event
   - [ ] Validate registration type matches event category
   - [ ] Success message: "Access Granted! ✅"
   - [ ] Attendance marked in database
   - [ ] Green animation plays

2. **Unauthorized Participant**:
   - [ ] Scan QR of user NOT registered for this event
   - [ ] Error message: "Access Denied! ❌"
   - [ ] Reason displayed:
     - "Not registered for this event"
     - OR "Wrong registration type"
     - OR "Payment not verified"
   - [ ] Red animation plays

---

### Phase 6: Kit Distribution (`/admin/kit-distribution`)
**Navigation**: Click "Kit Distribution" card OR visit http://localhost:3000/admin/kit-distribution

#### Test Kit Distribution Interface:
- [ ] Page loads without errors
- [ ] QR scanner appears
- [ ] **Collection Points** section displays:
  - Main Entrance
  - Registration Desk
  - Event Hall
- [ ] **Kit Contents** section lists:
  - Participant ID Card
  - Event Schedule
  - T-shirt
  - Bag
  - Stationery
  - Refreshment Coupons

#### Test Kit Collection Process:

1. **Valid Collection**:
   - [ ] Scan participant QR code
   - [ ] Validate:
     - ✅ Participant ID generated
     - ✅ Payment verified
     - ✅ Kit not already collected
   - [ ] Click "Mark as Collected"
   - [ ] Select collection point
   - [ ] Success message appears
   - [ ] Kit status updated in database

2. **Already Collected**:
   - [ ] Scan QR of user who already collected kit
   - [ ] Warning message: "Kit already collected"
   - [ ] Show collection date and point

3. **Invalid Collection**:
   - [ ] Scan QR of user without participant ID
   - [ ] Error: "Participant ID not generated"
   - [ ] Scan QR of user with unverified payment
   - [ ] Error: "Payment not verified"

#### Test Kit Status Check:
- [ ] Click "Check Kit Status" button
- [ ] Enter participant ID
- [ ] View collection status:
  - Collected: Yes/No
  - Collection Date
  - Collection Point
  - Collected By (admin name)

#### Test Scan History:
- [ ] Click "View Scan History"
- [ ] Enter participant ID
- [ ] See all previous scans:
  - Scan type (Check-in/Kit)
  - Event name (if applicable)
  - Timestamp
  - Location

---

### Phase 7: Payment Verification (`/admin/payments`)
**Navigation**: Click "Verify Payments" card OR visit http://localhost:3000/admin/payments

#### Test Payment Verification:
- [ ] Page loads pending payments list
- [ ] Each payment shows:
  - User details
  - Payment proof image
  - Amount
  - Registration type
  - Actions
- [ ] Click "View Proof" to enlarge image
- [ ] Click "Verify" to approve payment
- [ ] Click "Reject" to reject payment
- [ ] Filter by status (Pending/Verified/Failed)

---

## 🧪 CRITICAL API ENDPOINT TESTS

### Test Backend APIs (Use PowerShell or Postman)

#### 1. Test Events API:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/events" -Method GET
```
**Expected**: `{ success: true, events: [...], count: N }`

#### 2. Test Workshops API:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/workshops" -Method GET
```
**Expected**: `{ success: true, workshops: [...], count: N }`

#### 3. Test Admin Stats API (Requires Auth Token):
First, login to get token:
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@acgcet.edu","password":"Admin@123"}'
$token = $response.token
```

Then test kit stats:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/kit-stats" -Method GET -Headers @{Authorization="Bearer $token"}
```

Test event stats:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/event-stats" -Method GET -Headers @{Authorization="Bearer $token"}
```

Test user list:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/users" -Method GET -Headers @{Authorization="Bearer $token"}
```

---

## 📋 QUICK NAVIGATION CHECKLIST

### ✅ Complete This Test Sequence:

1. **Login** → http://localhost:3000/login
   - [ ] Login with admin credentials
   - [ ] Verify redirect to dashboard

2. **Dashboard** → http://localhost:3000/admin
   - [ ] Stats cards display
   - [ ] All 5 quick action cards visible
   - [ ] Click each card to test navigation

3. **User Management** → http://localhost:3000/admin/users
   - [ ] Table loads with data
   - [ ] Search works
   - [ ] Filters work
   - [ ] Bulk selection works
   - [ ] Bulk actions available
   - [ ] View details modal opens

4. **Event Management** → http://localhost:3000/admin/events
   - [ ] Both tabs (Events & Workshops) work
   - [ ] Stats display correctly
   - [ ] Create modal opens
   - [ ] Form validation works
   - [ ] CRUD operations successful

5. **QR Scanner** → http://localhost:3000/admin/scanner
   - [ ] Camera permission granted
   - [ ] Scanner initializes
   - [ ] Can switch cameras
   - [ ] QR scanning works

6. **Kit Distribution** → http://localhost:3000/admin/kit-distribution
   - [ ] Scanner loads
   - [ ] Collection points display
   - [ ] Kit contents list shows
   - [ ] QR validation works

7. **Navigation Between Pages**:
   - [ ] Use browser back/forward buttons
   - [ ] Direct URL access works
   - [ ] Auth state persists on refresh
   - [ ] Logout works correctly

---

## 🎨 UI/UX VERIFICATION

### Visual Checks:
- [ ] **Purple gradient theme** in User Management
- [ ] **Red gradient theme** in Event Management
- [ ] **Consistent header** across all pages
- [ ] **Responsive design** (test on mobile size)
- [ ] **Animations smooth** (modals, loaders, toasts)
- [ ] **Icons display** correctly (emojis or icons)
- [ ] **Loading states** show during API calls
- [ ] **Error messages** are clear and helpful

---

## 🐛 KNOWN ISSUES (Non-Critical)

### Backend Warnings:
1. **Mongoose Duplicate Index Warning**
   - Status: Non-blocking
   - Location: participantId field in User model
   - Impact: None on functionality

2. **AWS SDK v2 Deprecation Notice**
   - Status: Non-blocking
   - Impact: None on functionality
   - Action: Consider upgrading to AWS SDK v3 in future

### Frontend Warnings:
1. **CSS Compatibility** (min-height: auto in Firefox 22+)
   - Status: Minor
   - Impact: Minimal visual difference in older Firefox
   - Action: Can be ignored or use alternative CSS

---

## 🚀 SUCCESS CRITERIA

### ✅ Your testing is successful if:
1. All pages load without errors
2. All navigation links work
3. All CRUD operations complete successfully
4. Search and filters return correct results
5. Bulk actions execute properly
6. QR scanner initializes and can scan codes
7. Modals open and close correctly
8. API calls return expected data
9. Authentication flow works end-to-end
10. No console errors in browser DevTools

---

## 📞 TROUBLESHOOTING

### If pages don't load:
1. Check both servers are running
2. Verify ports 3000 and 5000 are not blocked
3. Check browser console for errors
4. Clear browser cache and reload

### If authentication fails:
1. Verify admin credentials correct
2. Check MongoDB connection
3. Verify JWT token generation
4. Check network tab in DevTools

### If API calls fail:
1. Check backend server logs
2. Verify CORS configuration
3. Check API endpoint URLs
4. Verify auth token in request headers

---

## 🎉 YOU'RE ALL SET!

**Your SHACKLES 25-26 Admin System is ready for testing!**

### Start Testing Now:
1. Open http://localhost:3000 in your browser
2. Login with admin@acgcet.edu / Admin@123
3. Follow the testing flow above
4. Report any issues you encounter

**Happy Testing! 🚀**

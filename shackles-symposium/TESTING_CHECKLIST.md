# 🧪 SHACKLES 25-26 - Complete Testing Checklist

## ✅ Server Status

### Backend Server
- **Status**: ✅ Running
- **Port**: 5000
- **URL**: http://localhost:5000
- **Database**: ✅ Connected to MongoDB Atlas (shackles_db)
- **Environment**: Development
- **CORS**: Enabled for http://localhost:3000

### Frontend Server
- **Status**: ✅ Running
- **Port**: 3000
- **URL**: http://localhost:3000
- **Build Tool**: Vite v5.4.20
- **Dependencies**: ✅ Optimized (html5-qrcode)

---

## 🔍 Navigation Flow Testing

### Phase 1: Public Routes (No Authentication Required)

#### Test 1: Home & Navigation
- [ ] Navigate to `http://localhost:3000`
- [ ] Verify home page loads correctly
- [ ] Check header navigation links work
- [ ] Test footer links

#### Test 2: Events Pages
- [ ] Click "Events" in navigation
- [ ] Navigate to `/events/technical`
- [ ] Navigate to `/events/non-technical`
- [ ] Navigate to `/events/special`
- [ ] Verify all event categories display correctly

#### Test 3: Other Public Pages
- [ ] Navigate to `/workshops`
- [ ] Navigate to `/accommodation`
- [ ] Navigate to `/team`
- [ ] Navigate to `/contact`
- [ ] Verify all pages render without errors

---

### Phase 2: Authentication Flow

#### Test 4: Login/Register
- [ ] Navigate to `/login`
- [ ] Test login form validation
- [ ] **Login as Admin**:
  - Email: `admin@shackles.com`
  - Password: `admin123`
- [ ] Verify successful login redirects properly
- [ ] Check auth token is stored
- [ ] Navigate to `/register` and test registration form

#### Test 5: Protected User Routes
- [ ] After login, navigate to `/profile`
- [ ] Verify profile page loads with user data
- [ ] Test logout functionality

---

### Phase 3: Admin Dashboard Navigation

#### Test 6: Admin Dashboard Access
- [ ] Navigate to `/admin`
- [ ] Verify admin dashboard loads
- [ ] Check statistics cards display:
  - Total Registrations
  - Verified Payments
  - Pending Payments
  - Total Revenue
- [ ] Verify event-wise registrations chart
- [ ] Check recent registrations table

#### Test 7: Quick Actions Navigation
From the admin dashboard, test all 5 quick action cards:

##### 1. Manage Users (👥)
- [ ] Click "Manage Users" card
- [ ] Verify navigation to `/admin/users`
- [ ] Page should load User Management interface

##### 2. Manage Events (📅)
- [ ] Click "Manage Events" card
- [ ] Verify navigation to `/admin/events`
- [ ] Page should load Event Management interface

##### 3. Verify Payments (💳)
- [ ] Click "Verify Payments" card
- [ ] Verify navigation to `/admin/payments`
- [ ] Page should load Payment Verification interface

##### 4. QR Scanner (📷)
- [ ] Click "QR Scanner" card
- [ ] Verify navigation to `/admin/scanner`
- [ ] Page should load QR Scanner interface

##### 5. Kit Distribution (🎒)
- [ ] Click "Kit Distribution" card
- [ ] Verify navigation to `/admin/kit-distribution`
- [ ] Page should load Kit Distribution interface

---

## 🎯 Feature Testing - User Management Page

### Test 8: User Management - Basic Features
Navigate to `/admin/users` and verify:

#### Page Load
- [ ] Page loads without errors
- [ ] Statistics dashboard displays 8 metrics:
  - Total Users
  - Verified Payments
  - Pending Payments
  - Total Revenue
  - Generated IDs
  - Kits Collected
  - General Registrations
  - Workshop Registrations

#### User Table
- [ ] Users table displays with columns:
  - Checkbox (bulk selection)
  - Participant ID
  - Name
  - Email
  - Phone
  - College
  - Registration Type
  - Payment Status
  - Kit Status
  - Actions
- [ ] Pagination controls work (10 items per page)
- [ ] Table data loads from API

### Test 9: User Management - Search & Filters

#### Search Functionality
- [ ] Search by name
- [ ] Search by email
- [ ] Search by phone
- [ ] Search by participant ID
- [ ] Search by college
- [ ] Clear search button works

#### Triple Filter System
- [ ] **Registration Type Filter**:
  - All (default)
  - General Only
  - Workshop Only
  - Both
- [ ] **Payment Status Filter**:
  - All (default)
  - Verified
  - Pending
  - Failed
- [ ] **Kit Status Filter**:
  - All (default)
  - Collected
  - Not Collected
- [ ] Multiple filters work together

#### Sorting
- [ ] Click column headers to sort
- [ ] Sort by name (A-Z, Z-A)
- [ ] Sort by date (newest, oldest)
- [ ] Sort indicators show correctly

### Test 10: User Management - Bulk Actions

#### Bulk Selection
- [ ] Click individual checkboxes to select users
- [ ] Click "Select All" checkbox in header
- [ ] Selected count displays in bulk actions bar
- [ ] Selected rows highlight with blue background

#### Bulk Action 1: Verify Payments
- [ ] Select 2-3 users with pending payments
- [ ] Click "Verify Payments" button
- [ ] Verify success message appears
- [ ] Check payment status updates in table
- [ ] Test API call: `PUT /api/v1/admin/payments/:userId/verify`

#### Bulk Action 2: Generate IDs
- [ ] Select users without participant IDs
- [ ] Click "Generate IDs" button
- [ ] Verify loading indicator shows
- [ ] Check success/failure count message
- [ ] Verify participant IDs appear in table
- [ ] Test API call: `POST /api/v1/admin/generate-participant-id/:userId`

#### Bulk Action 3: Send Emails
- [ ] Select multiple users
- [ ] Click "Send Emails" button
- [ ] Choose email template:
  - Welcome Email
  - Reminder Email
  - QR Code Email
- [ ] Verify email sending progress
- [ ] Check success message
- [ ] Test API call: `POST /api/v1/admin/bulk-email`

#### Bulk Action 4: Export to CSV
- [ ] Select users (or select all)
- [ ] Click "Export to CSV" button
- [ ] Verify CSV file downloads
- [ ] Open CSV and verify data format
- [ ] Check all fields are included

#### Bulk Action 5: Delete Users
- [ ] Select test users (be careful!)
- [ ] Click "Delete Selected" button
- [ ] Verify confirmation dialog appears
- [ ] Confirm deletion
- [ ] Check users removed from table
- [ ] Test API call: `DELETE /api/v1/admin/users/:userId`

### Test 11: User Management - User Details Modal

#### Modal Display
- [ ] Click "View Details" button on any user
- [ ] Verify modal opens with animation
- [ ] Check all user information displays:
  - Profile section (name, email, phone)
  - College & Department
  - Registration details
  - Payment information
  - Participant ID
  - QR Code (if generated)

#### QR Code Features
- [ ] QR code displays correctly
- [ ] Click "Download QR" button
- [ ] Verify PNG file downloads
- [ ] Check QR code image quality

#### Modal Actions
- [ ] Verify Payment button (if pending)
- [ ] Generate ID button (if not generated)
- [ ] View Kit Status button
- [ ] View Scan History button
- [ ] Close modal (X button and outside click)

---

## 🎯 Feature Testing - Event Management Page

### Test 12: Event Management - Basic Features
Navigate to `/admin/events` and verify:

#### Page Load
- [ ] Page loads without errors
- [ ] Tab system displays:
  - Events tab (default active)
  - Workshops tab
- [ ] Statistics dashboard shows 4 metrics:
  - Total Events
  - Total Workshops
  - Upcoming Events
  - Total Registrations

### Test 13: Events Tab - CRUD Operations

#### View Events
- [ ] Events display in card grid
- [ ] Each card shows:
  - Event name
  - Category badge
  - Date & time
  - Venue
  - Registration count
  - Status badge
  - Action buttons (Edit, Delete)
- [ ] Empty state shows when no events

#### Create Event
- [ ] Click "Create Event" button
- [ ] Modal opens with form
- [ ] Fill in required fields:
  - Event Name
  - Category (Technical/Non-Technical/Special)
  - Description
  - Date & Time
  - Venue
  - Coordinator Details
  - Registration Fee
  - Max Participants
- [ ] Add dynamic fields:
  - Rules (multiple items)
  - Prizes (multiple items)
  - Speakers (multiple items)
  - Sponsors (multiple items)
  - Requirements (multiple items)
- [ ] Click "Create Event" button
- [ ] Verify success message
- [ ] Check new event appears in grid
- [ ] Test API call: `POST /api/v1/events`

#### Update Event
- [ ] Click "Edit" button on any event
- [ ] Modal opens with pre-filled data
- [ ] Modify event details
- [ ] Update dynamic arrays (add/remove items)
- [ ] Click "Update Event" button
- [ ] Verify success message
- [ ] Check changes reflect in card
- [ ] Test API call: `PUT /api/v1/events/:id`

#### Delete Event
- [ ] Click "Delete" button on test event
- [ ] Confirm deletion in dialog
- [ ] Verify success message
- [ ] Check event removed from grid
- [ ] Test API call: `DELETE /api/v1/events/:id`

#### Search & Filter
- [ ] Search events by name
- [ ] Filter by category:
  - All
  - Technical
  - Non-Technical
  - Special
- [ ] Verify search and filter work together

### Test 14: Workshops Tab - CRUD Operations

#### Switch to Workshops Tab
- [ ] Click "Workshops" tab
- [ ] Tab switches with active state
- [ ] Workshops grid loads

#### View Workshops
- [ ] Workshops display in card grid
- [ ] Each card shows:
  - Workshop name
  - Date & time
  - Venue
  - Duration
  - Registration count
  - Status badge
  - Action buttons

#### Create Workshop
- [ ] Click "Create Workshop" button
- [ ] Modal opens with form
- [ ] Fill in required fields:
  - Workshop Name
  - Description
  - Date & Time
  - Duration
  - Venue
  - Instructor Details
  - Registration Fee
  - Max Participants
- [ ] Add dynamic fields:
  - Prerequisites
  - Topics Covered
  - Tools Required
  - Benefits
- [ ] Click "Create Workshop" button
- [ ] Verify success message
- [ ] Test API call: `POST /api/v1/workshops`

#### Update Workshop
- [ ] Click "Edit" button on workshop
- [ ] Modify workshop details
- [ ] Update dynamic arrays
- [ ] Click "Update Workshop" button
- [ ] Verify changes saved
- [ ] Test API call: `PUT /api/v1/workshops/:id`

#### Delete Workshop
- [ ] Click "Delete" button
- [ ] Confirm deletion
- [ ] Verify workshop removed
- [ ] Test API call: `DELETE /api/v1/workshops/:id`

#### Search Workshops
- [ ] Search workshops by name
- [ ] Verify search results

---

## 🎯 Feature Testing - QR Scanning System

### Test 15: General QR Scanner
Navigate to `/admin/scanner` and verify:

#### Scanner Interface
- [ ] Page loads QR scanner component
- [ ] Camera permission request appears
- [ ] Select camera from dropdown
- [ ] Camera preview shows in scanner box
- [ ] Scanner detects QR codes

#### Scan Validation
- [ ] Scan a valid participant QR code
- [ ] Verify participant details display:
  - Name
  - Participant ID
  - Registration type
  - Payment status
- [ ] Test with invalid QR code
- [ ] Verify error message shows

### Test 16: Event Check-In
Navigate to `/admin/event-checkin/:eventId`:

#### Setup
- [ ] Navigate with actual event ID
- [ ] Page loads with event details
- [ ] QR scanner initializes

#### Access Control Validation
- [ ] Scan QR of user registered for this event
- [ ] Verify access granted message
- [ ] Attendance marked successfully
- [ ] Test API: `POST /api/v1/qr-scan/attendance/:eventId`

#### Access Denial
- [ ] Scan QR of user NOT registered for event
- [ ] Verify access denied message
- [ ] Check error explains reason:
  - Not registered for event
  - Wrong registration type
  - Payment not verified

#### Visual Feedback
- [ ] Success animations display correctly
- [ ] Error animations display correctly
- [ ] Sound effects (if enabled)

### Test 17: Kit Distribution
Navigate to `/admin/kit-distribution` and verify:

#### Kit Distribution Interface
- [ ] Page loads without errors
- [ ] QR scanner initializes
- [ ] Collection points display
- [ ] Kit contents list shows

#### Kit Collection Process
- [ ] Scan participant QR code
- [ ] Verify validations:
  - Participant ID generated
  - Payment verified
  - Kit not already collected
- [ ] Mark kit as collected
- [ ] Verify success message
- [ ] Test API: `POST /api/v1/qr-scan/kit-distribution`

#### Kit Status Check
- [ ] View kit status for participant
- [ ] Check collection date/time
- [ ] Verify collection point
- [ ] Test API: `GET /api/v1/qr-scan/kit-status/:participantId`

#### Collection History
- [ ] View participant's scan history
- [ ] Check all previous scans listed
- [ ] Verify timestamps correct
- [ ] Test API: `GET /api/v1/qr-scan/history/:participantId`

---

## 🔧 API Endpoint Testing

### Backend Health Check
Test all new endpoints created:

#### Admin Statistics Endpoints
```bash
# Get kit statistics
curl -X GET http://localhost:5000/api/v1/admin/kit-stats \
  -H "Authorization: Bearer YOUR_TOKEN"
Expected: { success: true, stats: {...} }

# Get event statistics
curl -X GET http://localhost:5000/api/v1/admin/event-stats \
  -H "Authorization: Bearer YOUR_TOKEN"
Expected: { success: true, stats: {...} }
```

#### Bulk Operations Endpoints
```bash
# Send bulk emails
curl -X POST http://localhost:5000/api/v1/admin/bulk-email \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userIds": ["..."], "emailType": "welcome"}'
Expected: { success: true, sent: N, failed: M }

# Generate participant ID
curl -X POST http://localhost:5000/api/v1/admin/generate-participant-id/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
Expected: { success: true, participantId: "...", qrCodeUrl: "..." }
```

#### Event/Workshop Endpoints
```bash
# Get all events
curl -X GET http://localhost:5000/api/v1/events
Expected: { success: true, events: [...] }

# Get all workshops
curl -X GET http://localhost:5000/api/v1/workshops
Expected: { success: true, workshops: [...] }
```

---

## 🐛 Error Handling Tests

### Test 18: Error States

#### Network Errors
- [ ] Stop backend server
- [ ] Try to load admin pages
- [ ] Verify error messages display
- [ ] Check loading states work correctly

#### Authentication Errors
- [ ] Logout from admin account
- [ ] Try to access `/admin/users` directly
- [ ] Verify redirect to login page
- [ ] Try to access with invalid token

#### Validation Errors
- [ ] Submit forms with empty required fields
- [ ] Enter invalid email format
- [ ] Enter invalid phone number
- [ ] Verify error messages display

#### API Errors
- [ ] Test with invalid user ID
- [ ] Test with invalid event ID
- [ ] Test duplicate operations
- [ ] Verify error handling gracefully

---

## 📱 Responsive Design Testing

### Test 19: Mobile Responsiveness

#### Desktop View (> 1024px)
- [ ] All admin pages display properly
- [ ] Tables don't overflow
- [ ] Modals centered correctly
- [ ] Navigation accessible

#### Tablet View (768px - 1024px)
- [ ] Layout adjusts appropriately
- [ ] Cards stack properly
- [ ] Forms remain usable
- [ ] QR scanner works

#### Mobile View (< 768px)
- [ ] Hamburger menu appears
- [ ] Tables scroll horizontally
- [ ] Forms stack vertically
- [ ] Bulk actions accessible
- [ ] QR scanner full width

---

## 🎨 UI/UX Testing

### Test 20: Visual & Interactive Elements

#### Loading States
- [ ] Loaders display during API calls
- [ ] Skeleton screens for tables
- [ ] Button loading states
- [ ] Progress indicators

#### Animations
- [ ] Modal fade-in animations
- [ ] Success/error message animations
- [ ] Card hover effects
- [ ] Button hover states

#### Feedback
- [ ] Success messages display (green)
- [ ] Error messages display (red)
- [ ] Info messages display (blue)
- [ ] Toast notifications work

---

## ✅ Final Integration Tests

### Test 21: Complete User Flow

#### Flow 1: New Participant Registration → ID Generation → QR Scan
1. [ ] Register new user from frontend
2. [ ] Admin verifies payment
3. [ ] Admin generates participant ID
4. [ ] QR code created and uploaded to S3
5. [ ] Email sent with QR code
6. [ ] QR code scanned at event
7. [ ] Attendance marked successfully
8. [ ] Kit distributed and marked

#### Flow 2: Bulk Operations
1. [ ] Admin selects 10 pending users
2. [ ] Bulk verify payments
3. [ ] Bulk generate IDs
4. [ ] Bulk send QR code emails
5. [ ] Export data to CSV
6. [ ] Verify all operations completed

#### Flow 3: Event Management
1. [ ] Admin creates new event
2. [ ] Users register for event
3. [ ] Admin updates event details
4. [ ] QR scanning at event check-in
5. [ ] View attendance reports
6. [ ] Event completion

---

## 🎯 Performance Testing

### Test 22: Load & Performance

#### Page Load Times
- [ ] User Management page < 2s
- [ ] Event Management page < 2s
- [ ] Admin Dashboard < 1s
- [ ] QR Scanner initialization < 1s

#### API Response Times
- [ ] User list API < 1s
- [ ] Event list API < 500ms
- [ ] QR validation API < 300ms
- [ ] Stats API < 500ms

#### Large Data Sets
- [ ] Test with 100+ users
- [ ] Test with 50+ events
- [ ] Pagination works smoothly
- [ ] Search remains fast

---

## 📝 Testing Summary

### Current Status
- **Backend Server**: ✅ Running on port 5000
- **Frontend Server**: ✅ Running on port 3000
- **Database**: ✅ Connected to MongoDB Atlas
- **Routing**: ✅ All routes configured
- **Components**: ✅ All pages implemented

### Testing Priority
1. **HIGH**: Authentication and admin access
2. **HIGH**: User Management CRUD operations
3. **HIGH**: Event Management CRUD operations
4. **MEDIUM**: QR scanning functionality
5. **MEDIUM**: Bulk operations
6. **LOW**: UI/UX refinements

### Known Issues to Check
- [ ] Mongoose duplicate index warning (participantId)
- [ ] AWS SDK v2 deprecation notice (non-critical)
- [ ] CSS compatibility warning (min-height: auto in Firefox)

---

## 🚀 Next Steps After Testing

1. **Fix Critical Bugs**: Address any blocking issues found
2. **Optimize Performance**: Improve slow endpoints
3. **Enhance UX**: Add more feedback and animations
4. **Add Analytics**: Track user actions and events
5. **Production Deployment**: Prepare for production environment
6. **Documentation**: Update user guides and API docs

---

**Testing Started**: October 5, 2025
**Testers**: Begin with Phase 1 (Public Routes) and progress sequentially.
**Report Issues**: Document all bugs with screenshots and steps to reproduce.

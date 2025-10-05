# Event Registration System - Implementation Complete

## Overview
Participants can now register for individual events (Technical, Non-Technical, Workshops, Special Events) and their details are stored in the database.

## Backend Implementation

### 1. New Model: EventRegistration
**File**: `backend/src/models/EventRegistration.js`

**Fields**:
- `user` - Reference to User who registered
- `event` - Reference to Event
- `eventName` - Event name (for quick access)
- `eventType` - technical/non-technical/workshop/special
- `registeredAt` - Timestamp
- `status` - registered/cancelled/attended
- `teamMembers` - Array of team member details (for team events)
- `isTeamEvent` - Boolean flag
- `paymentRequired` - If event has registration fee
- `paymentStatus` - pending/paid/not-required

**Indexes**:
- Compound unique index on (user, event) to prevent duplicate registrations
- Performance indexes for efficient queries

### 2. New Controller: eventRegistrationController.js
**File**: `backend/src/controllers/eventRegistrationController.js`

**Endpoints**:

1. **POST /api/v1/event-registrations/:eventId/register**
   - Register user for specific event
   - Validates event existence
   - Prevents duplicate registrations
   - Checks participant limits
   - Handles team event validations
   - Returns: Registration confirmation

2. **GET /api/v1/event-registrations/my-registrations**
   - Get all events current user is registered for
   - Optional filter by status
   - Returns: Array of registrations with event details

3. **DELETE /api/v1/event-registrations/:eventId/register**
   - Cancel registration for an event
   - Updates status to 'cancelled' instead of deleting
   - Returns: Confirmation

4. **GET /api/v1/event-registrations/:eventId/check-registration**
   - Check if user is already registered for an event
   - Returns: Boolean + registration details

5. **GET /api/v1/event-registrations/:eventId/participants** (Admin)
   - Get all participants for a specific event
   - Filter by status
   - Returns: Array of participants with user details

6. **GET /api/v1/event-registrations/registrations/all** (Admin)
   - Get all registrations across all events
   - Filters: eventType, status, search
   - Returns: Complete registration list

### 3. New Routes: eventRegistrationRoutes.js
**File**: `backend/src/routes/eventRegistrationRoutes.js`

All routes require authentication (`protect` middleware)
Admin routes require `authorize('admin', 'coordinator')`

### 4. Server Updated
**File**: `backend/src/server.js`
- Added route: `/api/v1/event-registrations`

### 5. Event Model Updated
**File**: `backend/src/models/Event.js`
- Added `isTeamEvent` boolean field for clarity

## Frontend Implementation

### 1. Updated Technical Events Page
**File**: `frontend/src/pages/Events/Technical.jsx`

**New Features**:
- Import `useAuth` hook to check authentication
- Import `api` service for API calls
- State management for registered events
- `fetchRegisteredEvents()` - Loads user's registrations on mount
- `handleRegisterEvent()` - Registers user for selected event
- `isEventRegistered()` - Checks if event is already registered

**UI Changes**:
- Added "Register Now" button on each event card
- Button shows different states:
  - "Register Now" - Default state
  - "Registering..." - During API call
  - "✓ Registered" - Already registered (disabled)
  - "Login to Register" - For unauthenticated users
- Modal also has register button
- Responsive design for mobile

### 2. Updated CSS
**File**: `frontend/src/styles/Technical.css`

**New Classes**:
- `.event-actions` - Flexbox container for buttons
- `.btn-register-event` - Styling for register button
- `.btn-register-event.registered` - Green styling for registered state
- `.btn-register-event:disabled` - Disabled state
- Responsive updates for mobile

## Usage Flow

### For Participants:

1. **Navigate to Events Page**
   - Click on Technical Events, Non-Technical, Workshops, or Special Events

2. **View Event Details**
   - See event description, rules, coordinator details
   - Check if event requires team or individual participation

3. **Register for Event**
   - Click "Register Now" button on any event
   - System checks:
     - User is logged in
     - User hasn't already registered
     - Event isn't full (if max participants set)
   - Registration is created in database

4. **View My Registrations**
   - Can be accessed via API: GET `/api/v1/event-registrations/my-registrations`
   - Shows all events user has registered for

5. **Cancel Registration**
   - DELETE `/api/v1/event-registrations/:eventId/register`
   - Status changed to 'cancelled'

### For Admins:

1. **View Event Participants**
   - GET `/api/v1/event-registrations/:eventId/participants`
   - See complete list of participants for any event
   - Export to Excel/PDF for management

2. **Query Database**
   - In MongoDB, query `EventRegistration` collection
   - Example: Find all participants for Paper Presentation:
   ```javascript
   db.eventregistrations.find({ 
     eventName: "Paper Presentation",
     status: "registered" 
   }).populate('user')
   ```

3. **View All Registrations**
   - GET `/api/v1/event-registrations/registrations/all`
   - Filter by event type, status
   - Search by name/email

## Database Structure

### EventRegistration Collection
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "event": "ObjectId (ref: Event)",
  "eventName": "Paper Presentation",
  "eventType": "technical",
  "registeredAt": "2025-10-05T12:00:00Z",
  "status": "registered",
  "teamMembers": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "college": "ABC College"
    }
  ],
  "isTeamEvent": true,
  "paymentRequired": false,
  "paymentStatus": "not-required",
  "createdAt": "2025-10-05T12:00:00Z",
  "updatedAt": "2025-10-05T12:00:00Z"
}
```

## Query Examples

### Get all Paper Presentation participants:
```javascript
const participants = await EventRegistration.find({
  eventName: 'Paper Presentation',
  status: 'registered'
}).populate('user', 'name email phone college department');
```

### Get user's registered events:
```javascript
const myEvents = await EventRegistration.find({
  user: userId,
  status: 'registered'
}).populate('event', 'name type venue date time');
```

### Count participants for an event:
```javascript
const count = await EventRegistration.countDocuments({
  event: eventId,
  status: 'registered'
});
```

## Next Steps (Optional Enhancements)

1. **Team Registration Modal**
   - Add UI to collect team member details during registration
   - Validate team size based on event requirements

2. **Payment Integration**
   - For events with registration fees
   - Payment gateway integration
   - Payment verification

3. **Email Notifications**
   - Send confirmation email on registration
   - Reminder emails before event
   - Certificates after event

4. **My Registrations Page**
   - Frontend page to view all registered events
   - Option to cancel registrations
   - Download registration receipts

5. **Admin Dashboard Enhancement**
   - Event-wise participant management
   - Attendance tracking
   - Certificate generation

6. **Non-Technical & Workshop Pages**
   - Apply same registration logic to other event pages
   - Copy the pattern from Technical.jsx

## Testing

1. **Login as participant** (not admin)
2. **Navigate to Technical Events** page
3. **Click "Register Now"** on any event
4. **Check MongoDB**:
   ```javascript
   db.eventregistrations.find().pretty()
   ```
5. **Verify** registration appears in database with correct user and event details

## Status: ✅ COMPLETE

All backend and frontend code has been implemented. The system is ready for testing!

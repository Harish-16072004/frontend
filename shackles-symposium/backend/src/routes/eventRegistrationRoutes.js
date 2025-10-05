const express = require('express');
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventParticipants,
  checkRegistration,
  getAllRegistrations
} = require('../controllers/eventRegistrationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes (require authentication)
router.use(protect);

// User routes
router.get('/my-registrations', getMyRegistrations);
router.post('/:eventId/register', registerForEvent);
router.delete('/:eventId/register', cancelRegistration);
router.get('/:eventId/check-registration', checkRegistration);

// Admin routes
router.get('/registrations/all', authorize('admin', 'coordinator'), getAllRegistrations);
router.get('/:eventId/participants', authorize('admin', 'coordinator'), getEventParticipants);

module.exports = router;

const { body, param, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Create registration validation
exports.validateCreateRegistration = [
  body('event')
    .notEmpty()
    .withMessage('Event ID is required')
    .isMongoId()
    .withMessage('Invalid event ID format'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  
  body('teamMembers')
    .optional()
    .isArray()
    .withMessage('Team members must be an array'),
  
  body('teamMembers.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Team member name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Team member name must be between 2 and 50 characters'),
  
  body('teamMembers.*.email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Team member email must be valid'),
  
  body('teamMembers.*.phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Team member phone must be a valid 10-digit number'),
  
  handleValidationErrors
];

// Workshop registration validation
exports.validateWorkshopRegistration = [
  body('workshop')
    .notEmpty()
    .withMessage('Workshop ID is required')
    .isMongoId()
    .withMessage('Invalid workshop ID format'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  
  handleValidationErrors
];

// Registration ID validation
exports.validateRegistrationId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid registration ID format'),
  
  handleValidationErrors
];

// Update registration validation
exports.validateUpdateRegistration = [
  param('id')
    .isMongoId()
    .withMessage('Invalid registration ID format'),
  
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Invalid status. Must be pending, confirmed, or cancelled'),
  
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'refunded'])
    .withMessage('Invalid payment status'),
  
  body('teamMembers')
    .optional()
    .isArray()
    .withMessage('Team members must be an array'),
  
  handleValidationErrors
];

// Cancel registration validation
exports.validateCancelRegistration = [
  param('id')
    .isMongoId()
    .withMessage('Invalid registration ID format'),
  
  body('reason')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Cancellation reason must be between 10 and 500 characters'),
  
  handleValidationErrors
];

// Query filters validation
exports.validateQueryFilters = [
  body('event')
    .optional()
    .isMongoId()
    .withMessage('Invalid event ID format'),
  
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Invalid status filter'),
  
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'refunded'])
    .withMessage('Invalid payment status filter'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  handleValidationErrors
];

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

// Update user validation
exports.validateUpdateUser = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian phone number'),
  
  body('college')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('College name must be between 3 and 200 characters'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department name must not exceed 100 characters'),
  
  body('year')
    .optional()
    .isIn(['1st', '2nd', '3rd', '4th', 'PG', 'Other'])
    .withMessage('Invalid year selection'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin', 'volunteer'])
    .withMessage('Invalid role selection'),
  
  handleValidationErrors
];

// User ID validation
exports.validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  handleValidationErrors
];

// Bulk email validation
exports.validateBulkEmail = [
  body('recipients')
    .isArray({ min: 1 })
    .withMessage('Recipients must be an array with at least one email'),
  
  body('recipients.*')
    .isEmail()
    .withMessage('All recipients must be valid email addresses'),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Email subject is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Email message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long'),
  
  handleValidationErrors
];

// Query filters validation
exports.validateQueryFilters = [
  body('role')
    .optional()
    .isIn(['user', 'admin', 'volunteer'])
    .withMessage('Invalid role filter'),
  
  body('college')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('College name too long'),
  
  body('year')
    .optional()
    .isIn(['1st', '2nd', '3rd', '4th', 'PG', 'Other'])
    .withMessage('Invalid year filter'),
  
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

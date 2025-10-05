const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const { ErrorResponse } = require('./errorHandler');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configure multer for file uploads (memory storage)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Invalid file type. Only JPEG, PNG, PDF, DOC, and DOCX files are allowed', 400));
  }
};

// Image file filter for payment screenshots
const paymentImageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Only image files (JPEG, PNG) are allowed for payment screenshots', 400));
  }
};

// Payment proof upload middleware (memory storage)
const paymentProofUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: paymentImageFilter
});

// Helper function to upload buffer to S3
const uploadToS3 = async (file) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = path.extname(file.originalname);
  const fileName = `payment-proof/${timestamp}-${randomString}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype
    // Removed ACL: 'public-read' - bucket doesn't allow ACLs
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};

// Export payment proof upload middleware and S3 helper
exports.uploadPaymentProof = paymentProofUpload.single('paymentScreenshot');
exports.uploadToS3 = uploadToS3;

// Upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Single file upload
exports.uploadSingle = (fieldName) => upload.single(fieldName);

// Multiple files upload
exports.uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// Multiple fields upload
exports.uploadFields = (fields) => upload.fields(fields);

// Image file filter
exports.imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Only image files (JPEG, PNG) are allowed', 400));
  }
};

// Document file filter
exports.documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Only PDF and Word documents are allowed', 400));
  }
};

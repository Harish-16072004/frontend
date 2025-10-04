const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

/**
 * Upload file to S3
 * @param {Object} file - File object from multer
 * @param {String} folder - Folder name in S3 bucket
 * @returns {Promise<Object>} Upload result with file URL
 */
exports.uploadToS3 = async (file, folder = 'uploads') => {
  try {
    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${timestamp}-${randomString}${fileExtension}`;

    // Upload parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer || fs.createReadStream(file.path),
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    // Upload to S3
    const result = await s3.upload(params).promise();

    // Delete local file if it exists
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      success: true,
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket,
      etag: result.ETag
    };

  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3: ' + error.message);
  }
};

/**
 * Upload multiple files to S3
 * @param {Array} files - Array of file objects
 * @param {String} folder - Folder name in S3 bucket
 * @returns {Promise<Array>} Array of upload results
 */
exports.uploadMultipleToS3 = async (files, folder = 'uploads') => {
  try {
    const uploadPromises = files.map(file => exports.uploadToS3(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple S3 upload error:', error);
    throw new Error('Failed to upload files to S3');
  }
};

/**
 * Delete file from S3
 * @param {String} fileKey - S3 object key
 * @returns {Promise<Object>} Delete result
 */
exports.deleteFromS3 = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey
    };

    const result = await s3.deleteObject(params).promise();

    return {
      success: true,
      message: 'File deleted successfully',
      result
    };

  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3: ' + error.message);
  }
};

/**
 * Delete multiple files from S3
 * @param {Array} fileKeys - Array of S3 object keys
 * @returns {Promise<Object>} Delete result
 */
exports.deleteMultipleFromS3 = async (fileKeys) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Delete: {
        Objects: fileKeys.map(key => ({ Key: key })),
        Quiet: false
      }
    };

    const result = await s3.deleteObjects(params).promise();

    return {
      success: true,
      message: `${result.Deleted.length} files deleted successfully`,
      deleted: result.Deleted,
      errors: result.Errors
    };

  } catch (error) {
    console.error('Multiple S3 delete error:', error);
    throw new Error('Failed to delete files from S3');
  }
};

/**
 * Get signed URL for private file
 * @param {String} fileKey - S3 object key
 * @param {Number} expiresIn - URL expiration in seconds (default: 1 hour)
 * @returns {String} Signed URL
 */
exports.getSignedUrl = (fileKey, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Expires: expiresIn
    };

    const url = s3.getSignedUrl('getObject', params);
    return url;

  } catch (error) {
    console.error('Signed URL error:', error);
    throw new Error('Failed to generate signed URL');
  }
};

/**
 * Check if file exists in S3
 * @param {String} fileKey - S3 object key
 * @returns {Promise<Boolean>} True if exists
 */
exports.fileExists = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey
    };

    await s3.headObject(params).promise();
    return true;

  } catch (error) {
    if (error.code === 'NotFound') {
      return false;
    }
    throw error;
  }
};

/**
 * Upload base64 image to S3
 * @param {String} base64String - Base64 encoded image
 * @param {String} folder - Folder name
 * @param {String} fileName - File name
 * @returns {Promise<Object>} Upload result
 */
exports.uploadBase64ToS3 = async (base64String, folder = 'uploads', fileName = null) => {
  try {
    // Extract base64 data and content type
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate filename if not provided
    if (!fileName) {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = contentType.split('/')[1];
      fileName = `${folder}/${timestamp}-${randomString}.${extension}`;
    } else {
      fileName = `${folder}/${fileName}`;
    }

    // Upload parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
      ContentEncoding: 'base64',
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();

    return {
      success: true,
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket
    };

  } catch (error) {
    console.error('Base64 S3 upload error:', error);
    throw new Error('Failed to upload base64 image to S3');
  }
};

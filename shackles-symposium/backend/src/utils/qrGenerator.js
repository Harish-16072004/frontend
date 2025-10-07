const QRCode = require('qrcode');
const { uploadBufferToS3 } = require('./s3Upload');

/**
 * Generate QR code for registration
 * @param {Object} data - Registration data to encode
 * @returns {Promise<String>} Base64 encoded QR code image
 */
exports.generateQR = async (data) => {
  try {
    // Convert data to JSON string
    const qrData = typeof data === 'string' ? data : JSON.stringify(data);

    // Generate QR code as base64 string
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate QR code as buffer
 * @param {Object} data - Registration data to encode
 * @returns {Promise<Buffer>} QR code image buffer
 */
exports.generateQRBuffer = async (data) => {
  try {
    const qrData = typeof data === 'string' ? data : JSON.stringify(data);

    const buffer = await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      quality: 0.95,
      margin: 1,
      width: 300
    });

    return buffer;
  } catch (error) {
    console.error('QR Code buffer generation error:', error);
    throw new Error('Failed to generate QR code buffer');
  }
};

/**
 * Generate QR code for registration with custom options
 * @param {String} registrationId - Registration ID
 * @param {Object} options - Custom QR options
 * @returns {Promise<String>} Base64 encoded QR code
 */
exports.generateRegistrationQR = async (registrationId, options = {}) => {
  try {
    const qrData = {
      type: 'registration',
      id: registrationId,
      timestamp: Date.now()
    };

    const defaultOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 2,
      width: 400,
      color: {
        dark: '#1F2937',
        light: '#FFFFFF'
      }
    };

    const qrOptions = { ...defaultOptions, ...options };

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), qrOptions);

    return qrCodeDataURL;
  } catch (error) {
    console.error('Registration QR generation error:', error);
    throw new Error('Failed to generate registration QR code');
  }
};

/**
 * Generate QR code for participant ID and upload to S3
 * @param {String} participantId - Unique participant ID (e.g., SHGN001)
 * @param {Object} userData - Additional user data to encode
 * @returns {Promise<Object>} Object with QR code URL and S3 key
 */
exports.generateParticipantQR = async (participantId, userData = {}) => {
  try {
    // SECURITY: Only encode minimal, non-sensitive data
    // The token will be validated server-side to get full participant details
    const qrData = {
      t: userData.qrToken,  // Secure token (shortened key for smaller QR)
      p: participantId,     // Participant ID
      v: userData.qrTokenVersion || 1,  // Version for revocation
      e: 'SHACKLES2025'     // Event identifier
    };

    // Generate QR code as buffer
    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      type: 'png',
      quality: 1,
      margin: 2,
      width: 500,
      color: {
        dark: '#1F2937',
        light: '#FFFFFF'
      }
    });

    // Upload to S3
    const s3Result = await uploadBufferToS3(
      qrBuffer,
      `${participantId}.png`,
      'image/png',
      'participant-qr-code'  // Match the S3 folder name
    );

    return {
      qrCodeUrl: s3Result.url,
      qrCodeKey: s3Result.key,
      participantId,
      generatedAt: new Date()
    };

  } catch (error) {
    console.error('❌ Participant QR generation error:', error);
    throw new Error('Failed to generate participant QR code: ' + error.message);
  }
};

/**
 * Generate QR code for participant and return as base64 (for email)
 * @param {String} participantId - Unique participant ID
 * @param {Object} userData - Additional user data
 * @returns {Promise<String>} Base64 encoded QR code
 */
exports.generateParticipantQRBase64 = async (participantId, userData = {}) => {
  try {
    // SECURITY: Only encode minimal, non-sensitive data
    const qrData = {
      t: userData.qrToken,
      p: participantId,
      v: userData.qrTokenVersion || 1,
      e: 'SHACKLES2025'
    };

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 1,
      margin: 2,
      width: 500,
      color: {
        dark: '#1F2937',
        light: '#FFFFFF'
      }
    });

    return qrCodeDataURL;

  } catch (error) {
    console.error('❌ Base64 QR generation error:', error);
    throw new Error('Failed to generate base64 QR code');
  }
};

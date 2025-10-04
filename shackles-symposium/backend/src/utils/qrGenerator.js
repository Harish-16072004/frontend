const QRCode = require('qrcode');

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

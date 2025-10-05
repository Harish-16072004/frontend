const User = require('../models/User');

/**
 * Generate unique participant ID based on registration type
 * @param {String} registrationType - 'general', 'workshop', or 'both'
 * @returns {Promise<String>} Unique participant ID
 */
exports.generateParticipantId = async (registrationType) => {
  try {
    let prefix = '';
    let searchPrefix = '';

    // Determine prefix based on registration type
    switch (registrationType) {
      case 'both':
        prefix = 'SHGN'; // General + Workshop
        searchPrefix = 'SHGN';
        break;
      case 'general':
        prefix = 'SHEN'; // Only Events
        searchPrefix = 'SHEN';
        break;
      case 'workshop':
        prefix = 'SHWK'; // Only Workshop
        searchPrefix = 'SHWK';
        break;
      default:
        throw new Error('Invalid registration type');
    }

    // Find the highest existing ID for this prefix
    const lastUser = await User.findOne({
      participantId: { $regex: `^${searchPrefix}` }
    })
      .sort({ participantId: -1 })
      .select('participantId')
      .lean();

    let nextNumber = 1;

    if (lastUser && lastUser.participantId) {
      // Extract the number part and increment
      const lastNumber = parseInt(lastUser.participantId.replace(searchPrefix, ''), 10);
      nextNumber = lastNumber + 1;
    }

    // Format number with leading zeros (e.g., 001, 002, etc.)
    const paddedNumber = String(nextNumber).padStart(3, '0');
    const participantId = `${prefix}${paddedNumber}`;

    // Check if ID already exists (rare edge case with concurrent requests)
    const exists = await User.findOne({ participantId });
    if (exists) {
      // Recursively try next number if collision occurs
      return exports.generateParticipantId(registrationType);
    }

    return participantId;

  } catch (error) {
    console.error('❌ Error generating participant ID:', error);
    throw new Error('Failed to generate participant ID: ' + error.message);
  }
};

/**
 * Get the next available ID for preview (without saving)
 * @param {String} registrationType - 'general', 'workshop', or 'both'
 * @returns {Promise<String>} Next available participant ID
 */
exports.getNextParticipantId = async (registrationType) => {
  try {
    let prefix = '';

    switch (registrationType) {
      case 'both':
        prefix = 'SHGN';
        break;
      case 'general':
        prefix = 'SHEN';
        break;
      case 'workshop':
        prefix = 'SHWK';
        break;
      default:
        throw new Error('Invalid registration type');
    }

    const lastUser = await User.findOne({
      participantId: { $regex: `^${prefix}` }
    })
      .sort({ participantId: -1 })
      .select('participantId')
      .lean();

    let nextNumber = 1;
    if (lastUser && lastUser.participantId) {
      const lastNumber = parseInt(lastUser.participantId.replace(prefix, ''), 10);
      nextNumber = lastNumber + 1;
    }

    const paddedNumber = String(nextNumber).padStart(3, '0');
    return `${prefix}${paddedNumber}`;

  } catch (error) {
    console.error('❌ Error getting next participant ID:', error);
    throw new Error('Failed to get next participant ID');
  }
};

/**
 * Validate participant ID format
 * @param {String} participantId - ID to validate
 * @returns {Boolean} True if valid format
 */
exports.validateParticipantId = (participantId) => {
  if (!participantId) return false;
  
  // Valid formats: SHGN001, SHEN001, SHWK001
  const validPrefixes = ['SHGN', 'SHEN', 'SHWK'];
  const prefix = participantId.substring(0, 4);
  const number = participantId.substring(4);

  return (
    validPrefixes.includes(prefix) &&
    number.length === 3 &&
    /^\d{3}$/.test(number)
  );
};

/**
 * Get registration type from participant ID
 * @param {String} participantId - Participant ID
 * @returns {String} Registration type ('general', 'workshop', or 'both')
 */
exports.getRegistrationTypeFromId = (participantId) => {
  if (!participantId) return null;

  const prefix = participantId.substring(0, 4);

  switch (prefix) {
    case 'SHGN':
      return 'both';
    case 'SHEN':
      return 'general';
    case 'SHWK':
      return 'workshop';
    default:
      return null;
  }
};

module.exports = exports;

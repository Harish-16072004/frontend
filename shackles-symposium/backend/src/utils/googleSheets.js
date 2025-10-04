const { google } = require('googleapis');
const path = require('path');

/**
 * Get Google Sheets API client
 * Supports two authentication methods:
 * 1. JSON key file (GOOGLE_APPLICATION_CREDENTIALS env variable)
 * 2. Environment variables (GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY)
 */
const getGoogleSheetsClient = async () => {
  try {
    let auth;

    // Method 1: Use JSON key file if GOOGLE_APPLICATION_CREDENTIALS is set
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../../', process.env.GOOGLE_APPLICATION_CREDENTIALS),
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
    } 
    // Method 2: Use environment variables
    else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const credentials = {
        type: 'service_account',
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        project_id: process.env.GOOGLE_PROJECT_ID || 'shackles-symposium'
      };

      auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
    } 
    // No credentials found
    else {
      throw new Error(
        'Google Sheets credentials not found. Please set either:\n' +
        '1. GOOGLE_APPLICATION_CREDENTIALS (path to JSON key file), OR\n' +
        '2. GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY (from service account)'
      );
    }

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    return sheets;
  } catch (error) {
    console.error('Google Sheets auth error:', error);
    throw new Error('Failed to authenticate with Google Sheets API: ' + error.message);
  }
};

/**
 * Export data to Google Sheets
 * @param {Array} data - Array of objects to export
 * @param {String} spreadsheetId - Google Sheets ID
 * @param {String} sheetName - Sheet name
 * @returns {Promise<Object>} Result object
 */
exports.exportToGoogleSheets = async (data, spreadsheetId, sheetName = 'Sheet1') => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const sheets = await getGoogleSheetsClient();

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Convert data to 2D array
    const values = [
      headers, // Header row
      ...data.map(row => headers.map(header => row[header] || ''))
    ];

    // Clear existing data
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${sheetName}!A:Z`
    });

    // Update with new data
    const result = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      resource: { values }
    });

    // Format header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.31, green: 0.27, blue: 0.9 },
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true
                  }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)'
            }
          },
          {
            updateSheetProperties: {
              properties: {
                sheetId: 0,
                gridProperties: {
                  frozenRowCount: 1
                }
              },
              fields: 'gridProperties.frozenRowCount'
            }
          }
        ]
      }
    });

    return {
      success: true,
      updatedCells: result.data.updatedCells,
      updatedRows: result.data.updatedRows,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
    };

  } catch (error) {
    console.error('Google Sheets export error:', error);
    throw new Error('Failed to export to Google Sheets: ' + error.message);
  }
};

/**
 * Create new spreadsheet and export data
 * @param {Array} data - Data to export
 * @param {String} title - Spreadsheet title
 * @param {String} sheetName - Sheet name
 * @returns {Promise<Object>} Created spreadsheet info
 */
exports.createAndExportToGoogleSheets = async (data, title, sheetName = 'Sheet1') => {
  try {
    const sheets = await getGoogleSheetsClient();

    // Create new spreadsheet
    const createResponse = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title
        },
        sheets: [
          {
            properties: {
              title: sheetName
            }
          }
        ]
      }
    });

    const spreadsheetId = createResponse.data.spreadsheetId;

    // Export data to the new spreadsheet
    await exports.exportToGoogleSheets(data, spreadsheetId, sheetName);

    return {
      success: true,
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
      title
    };

  } catch (error) {
    console.error('Google Sheets creation error:', error);
    throw new Error('Failed to create and export Google Sheets');
  }
};

/**
 * Append data to existing Google Sheet
 * @param {Array} data - Data to append
 * @param {String} spreadsheetId - Spreadsheet ID
 * @param {String} sheetName - Sheet name
 * @returns {Promise<Object>} Result object
 */
exports.appendToGoogleSheets = async (data, spreadsheetId, sheetName = 'Sheet1') => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to append');
    }

    const sheets = await getGoogleSheetsClient();

    // Get headers
    const headers = Object.keys(data[0]);

    // Convert data to 2D array
    const values = data.map(row => headers.map(header => row[header] || ''));

    // Append data
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values }
    });

    return {
      success: true,
      updatedCells: result.data.updates.updatedCells,
      updatedRows: result.data.updates.updatedRows,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
    };

  } catch (error) {
    console.error('Google Sheets append error:', error);
    throw new Error('Failed to append to Google Sheets');
  }
};

/**
 * Export registrations to Google Sheets with formatting
 * @param {Array} registrations - Registration data
 * @param {String} spreadsheetId - Spreadsheet ID (optional, creates new if not provided)
 * @returns {Promise<Object>} Result object
 */
exports.exportRegistrationsToSheets = async (registrations, spreadsheetId = null) => {
  try {
    const formattedData = registrations.map(reg => ({
      'Registration No': reg.registrationNumber,
      'Name': reg.user?.name || 'N/A',
      'Email': reg.user?.email || 'N/A',
      'Phone': reg.user?.phone || 'N/A',
      'College': reg.user?.college || 'N/A',
      'Department': reg.user?.department || 'N/A',
      'Year': reg.user?.year || 'N/A',
      'Event': reg.event?.name || 'N/A',
      'Category': reg.event?.category || 'N/A',
      'Status': reg.status,
      'Amount': `₹${reg.amount}`,
      'Payment Status': reg.paymentStatus,
      'Registration Date': new Date(reg.createdAt).toLocaleDateString()
    }));

    if (spreadsheetId) {
      return await exports.exportToGoogleSheets(formattedData, spreadsheetId, 'Registrations');
    } else {
      const title = `SHACKLES Registrations - ${new Date().toLocaleDateString()}`;
      return await exports.createAndExportToGoogleSheets(formattedData, title, 'Registrations');
    }

  } catch (error) {
    console.error('Registration export error:', error);
    throw new Error('Failed to export registrations to Google Sheets');
  }
};

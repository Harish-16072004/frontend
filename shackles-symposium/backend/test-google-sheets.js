/**
 * Google Sheets Connection Test
 * Tests the Google Sheets integration
 */

require('dotenv').config();
const { exportToGoogleSheets } = require('./src/utils/googleSheets');

// Test data
const testData = [
  {
    'Participant ID': 'TEST001',
    'Name': 'Test User 1',
    'Email': 'test1@example.com',
    'College': 'Test College',
    'Registration Type': 'both',
    'Status': 'Active'
  },
  {
    'Participant ID': 'TEST002',
    'Name': 'Test User 2',
    'Email': 'test2@example.com',
    'College': 'Test College',
    'Registration Type': 'general',
    'Status': 'Active'
  },
  {
    'Participant ID': 'TEST003',
    'Name': 'Test User 3',
    'Email': 'test3@example.com',
    'College': 'Test College',
    'Registration Type': 'workshop',
    'Status': 'Active'
  }
];

console.log('🧪 Testing Google Sheets Integration...\n');
console.log('Configuration:');
console.log('- Google Client Email:', process.env.GOOGLE_CLIENT_EMAIL ? '✅ Set' : '❌ Not Set');
console.log('- Google Private Key:', process.env.GOOGLE_PRIVATE_KEY ? '✅ Set' : '❌ Not Set');
console.log('- Google Sheet ID:', process.env.GOOGLE_SHEET_ID || '❌ Not Set');
console.log('\n');

if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
  console.error('❌ ERROR: Google Sheets credentials not configured in .env file');
  console.log('\nPlease set the following in your .env file:');
  console.log('- GOOGLE_CLIENT_EMAIL');
  console.log('- GOOGLE_PRIVATE_KEY');
  console.log('- GOOGLE_SHEET_ID (optional, will be prompted)');
  process.exit(1);
}

const spreadsheetId = process.env.GOOGLE_SHEET_ID || '19srWIvkr9cHBSCuIk5EUcji5P1X0GscO_UOKXeAViBU';
const sheetName = 'Sheet1'; // Use default sheet name

console.log(`📊 Attempting to export test data to Google Sheet: ${spreadsheetId}`);
console.log(`Sheet Name: ${sheetName}\n`);

exportToGoogleSheets(testData, spreadsheetId, sheetName)
  .then(result => {
    console.log('✅ SUCCESS! Google Sheets export completed\n');
    console.log('Result:');
    console.log('- Spreadsheet URL:', result.spreadsheetUrl);
    console.log('- Updated Cells:', result.updatedCells);
    console.log('- Updated Rows:', result.updatedRows);
    console.log('\n📈 Open the spreadsheet to view the test data!');
    console.log(result.spreadsheetUrl);
  })
  .catch(error => {
    console.error('❌ ERROR: Google Sheets export failed\n');
    console.error('Error Details:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Verify service account email has access to the Google Sheet');
    console.log(`   - Share the sheet with: ${process.env.GOOGLE_CLIENT_EMAIL}`);
    console.log('   - Grant "Editor" permissions');
    console.log('2. Check if Google Sheets API is enabled in Google Cloud Console');
    console.log('3. Verify the private key is correctly formatted in .env');
    console.log('4. Make sure the spreadsheet ID is correct');
    process.exit(1);
  });

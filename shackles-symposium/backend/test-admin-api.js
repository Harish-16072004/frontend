const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

const testAdminAPI = async () => {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login as admin
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@acgcet.edu',
      password: 'Admin@123'
    }).catch(err => {
      if (err.response) {
        console.error('Login error:', err.response.status, err.response.data);
      } else {
        console.error('Login error:', err.message);
      }
      throw err;
    });

    const token = loginRes.data.token;
    console.log('✅ Login successful! Token:', token.substring(0, 20) + '...');

    // Test getting pending payments
    console.log('\n📋 Fetching pending payments...');
    const pendingRes = await axios.get(`${API_URL}/admin/payments/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`✅ Found ${pendingRes.data.data.length} pending payments:`);
    pendingRes.data.data.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
      console.log(`    Type: ${user.registrationType}, Amount: ₹${user.paymentAmount}`);
      console.log(`    Transaction: ${user.transactionId}`);
      console.log(`    Screenshot: ${user.paymentScreenshot ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Test getting stats
    console.log('📊 Fetching payment statistics...');
    const statsRes = await axios.get(`${API_URL}/admin/payments/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Statistics:');
    console.log('  Total:', statsRes.data.data.totalPayments);
    console.log('  Pending:', statsRes.data.data.pendingPayments);
    console.log('  Verified:', statsRes.data.data.verifiedPayments);
    console.log('  Rejected:', statsRes.data.data.rejectedPayments);
    console.log('  Total Revenue: ₹' + statsRes.data.data.totalRevenue);

    console.log('\n✅ All admin API endpoints are working!');

  } catch (error) {
    if (error.response) {
      console.error('❌ Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
};

testAdminAPI();

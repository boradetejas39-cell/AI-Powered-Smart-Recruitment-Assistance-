// Test frontend connection to backend
const axios = require('axios');

async function testConnection() {
  try {
    console.log('🔍 Testing frontend connection to backend...');
    
    // Test the exact same way frontend does
    const api = axios.create({
      baseURL: 'http://localhost:5001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Test login
    const response = await api.post('/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    });

    console.log('✅ Frontend-style connection successful!');
    console.log('Response:', response.data);
    
    // Test the response structure
    if (response.data.success && response.data.data && response.data.data.token) {
      console.log('✅ Response structure is correct');
    } else {
      console.log('❌ Response structure is incorrect');
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testConnection();

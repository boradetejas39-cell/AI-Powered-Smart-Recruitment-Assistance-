const axios = require('axios');

// Test authentication endpoints
async function testAuth() {
  const baseURL = 'http://localhost:5001/api';
  
  console.log('🔍 Testing Authentication Endpoints...\n');
  
  try {
    // Test registration
    console.log('1️⃣ Testing Registration...');
    const registerData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'hr',
      company: 'Test Company'
    };
    
    const registerResponse = await axios.post(`${baseURL}/auth/register`, registerData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Registration Success:', registerResponse.data);
    console.log('Token:', registerResponse.data.data.token);
    
    // Test login with existing user
    console.log('\n2️⃣ Testing Login with existing user...');
    const loginData = {
      email: 'admin@example.com',
      password: 'password123'
    };
    
    const loginResponse = await axios.post(`${baseURL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login Success:', loginResponse.data);
    console.log('Token:', loginResponse.data.data.token);
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
    }
  }
}

testAuth();

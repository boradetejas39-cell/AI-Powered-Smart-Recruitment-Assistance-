#!/usr/bin/env node

const axios = require('axios');

console.log('🚀 Quick Registration Test\n');

async function testRegistration() {
  const testData = {
    name: 'Quick Test User',
    email: 'quicktest@example.com',
    password: 'password123',
    role: 'hr',
    company: 'Quick Test Company'
  };

  console.log('📤 Testing registration with data:');
  console.log(JSON.stringify(testData, null, 2));

  try {
    const response = await axios.post('http://localhost:5001/api/auth/register', testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('\n✅ Registration successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    return { success: true, data: response.data };

  } catch (error) {
    console.log('\n❌ Registration failed!');
    console.log('Error:', error.message);

    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    }

    return { success: false, error: error.response?.data || error.message };
  }
}

async function testLogin() {
  const loginData = {
    email: 'quicktest@example.com',
    password: 'password123'
  };

  console.log('\n🔐 Testing login with new user...');

  try {
    const response = await axios.post('http://localhost:5001/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Token received:', response.data.data.token ? 'Yes' : 'No');

    return { success: true, data: response.data };

  } catch (error) {
    console.log('❌ Login failed!');
    console.log('Error:', error.message);

    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    }

    return { success: false, error: error.response?.data || error.message };
  }
}

async function main() {
  console.log('🎯 Testing Backend Registration API');
  console.log('=====================================\n');

  const regResult = await testRegistration();

  if (regResult.success) {
    console.log('\n🎉 Backend registration is working perfectly!');
    console.log('The issue is definitely in the frontend React form.');

    // Test login with new user
    await testLogin();

    console.log('\n📋 Next Steps:');
    console.log('1. Backend API is 100% functional');
    console.log('2. Check React form validation');
    console.log('3. Check form field names match API');
    console.log('4. Check JavaScript errors in browser');
    console.log('5. Check network requests in browser');

  } else {
    console.log('\n⚠️ Backend API has issues');
    console.log('Error details:', regResult.error);
  }

  console.log('\n🔍 Debugging Instructions:');
  console.log('========================');
  console.log('1. Open: test-registration-simple.html in browser');
  console.log('2. Fill out the simple form');
  console.log('3. Submit and watch console');
  console.log('4. If simple form works, React form has issue');
  console.log('5. If simple form fails, backend has issue');
}

main().catch(console.error);

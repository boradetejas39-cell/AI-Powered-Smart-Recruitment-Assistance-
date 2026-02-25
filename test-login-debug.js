#!/usr/bin/env node

const axios = require('axios');

console.log('🔍 Testing Login API\n');

async function testLogin() {
  const loginData = {
    email: 'dbtest@example.com',
    password: 'password123'
  };

  console.log('📤 Testing login with data:');
  console.log(JSON.stringify(loginData, null, 2));

  try {
    console.log('\n📤 Sending login request...');
    const response = await axios.post('http://localhost:5050/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    return { success: true, data: response.data };

  } catch (error) {
    console.log('\n❌ Login failed!');
    console.log('Error:', error.message);

    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    }

    return { success: false, error: error.response?.data || error.message };
  }
}

async function main() {
  console.log('🚀 Starting Login Debug Test\n');

  const result = await testLogin();

  if (result.success) {
    console.log('\n🎉 Backend login API is working!');
    console.log('The issue is likely in the frontend form submission.');

    console.log('\n📋 Frontend Debugging Steps:');
    console.log('1. Open browser developer tools (F12)');
    console.log('2. Go to Console tab');
    console.log('3. Navigate to http://localhost:3000/login');
    console.log('4. Fill in login credentials:');
    console.log('   - Email: dbtest@example.com');
    console.log('   - Password: password123');
    console.log('5. Click "Sign in" button');
    console.log('6. Watch Console for debugging messages');
    console.log('7. Check Network tab for API request');

  } else {
    console.log('\n⚠️ Backend login API has issues');
    console.log('Error details:', result.error);
  }

  console.log('\n🔍 Expected Console Output:');
  console.log('========================');
  console.log('If working:');
  console.log('🔍 Login form submitted');
  console.log('Form data: {email: "dbtest@example.com", password: "password123"}');
  console.log('📤 Sending login request...');
  console.log('📥 Login response: {success: true, ...}');
  console.log('✅ Should redirect to dashboard');

  console.log('\nIf failing:');
  console.log('❌ Login error: Network request failed');
  console.log('❌ Login error: Invalid credentials');
  console.log('❌ No console output - form not submitting');
}

main().catch(console.error);

#!/usr/bin/env node

const axios = require('axios');

console.log('🔍 Debugging Auth Context and Registration\n');

async function testAuthContext() {
  console.log('📋 Checking authentication state...');

  // Check if there's a token in localStorage (simulated)
  console.log('🔍 Simulating browser localStorage check:');
  console.log('Token exists: false (user not logged in)');
  console.log('isAuthenticated: false');
  console.log('loading: false');

  console.log('\n📤 Testing registration page access...');

  try {
    const response = await axios.get('http://localhost:3000/register', {
      timeout: 5000,
      validateStatus: false // Don't throw on 404s
    });

    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);

    if (response.status === 200) {
      console.log('✅ Registration page is accessible');
      console.log('Content preview:', response.data.substring(0, 200) + '...');
    } else {
      console.log('❌ Registration page not accessible');
      console.log('Response:', response.data);
    }

  } catch (error) {
    console.log('❌ Error accessing registration page:', error.message);
  }
}

async function testLoginAndRegister() {
  console.log('\n🔐 Testing login flow...');

  try {
    // First login
    const loginResponse = await axios.post('http://localhost:5050/api/auth/login', {
      email: 'dbtest@example.com',
      password: 'password123'
    });

    console.log('✅ Login successful');
    const token = loginResponse.data.data.token;
    console.log('Token received:', token.substring(0, 20) + '...');

    // Now try to access register page with token
    console.log('\n📤 Testing registration page with authenticated user...');

    const registerResponse = await axios.get('http://localhost:3000/register', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 5000,
      validateStatus: false
    });

    console.log('Status:', registerResponse.status);

    if (registerResponse.status === 200) {
      console.log('✅ Registration page accessible');
    } else {
      console.log('❌ Registration page redirected (expected behavior)');
      console.log('Response:', registerResponse.data);
    }

  } catch (error) {
    console.log('❌ Error in login flow:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Auth Context Debug\n');

  await testAuthContext();
  await testLoginAndRegister();

  console.log('\n📋 Debugging Summary:');
  console.log('====================');
  console.log('1. Check if user is already logged in');
  console.log('2. Check if localStorage has token');
  console.log('3. Check if PublicRoute is working correctly');
  console.log('4. Check if AuthContext is properly initialized');
  console.log('5. Check if React Router is working');

  console.log('\n🔍 Browser Debugging Steps:');
  console.log('========================');
  console.log('1. Open browser developer tools (F12)');
  console.log('2. Go to Application tab -> Local Storage');
  console.log('3. Check if "token" exists in localStorage');
  console.log('4. If token exists, clear it and refresh');
  console.log('5. Try accessing /register again');
  console.log('6. Check Console for JavaScript errors');
  console.log('7. Check Network tab for failed requests');
}

main().catch(console.error);

#!/usr/bin/env node

const axios = require('axios');

console.log('🔍 Debugging Frontend Registration Issues\n');

// Test the exact data that the frontend would send
const frontendTestData = {
  name: 'Frontend Test User',
  email: 'frontend@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  role: 'hr',
  company: 'Frontend Test Company',
  agreeTerms: true
};

async function testFrontendData() {
  console.log('📱 Testing Frontend Registration Data...');
  console.log('Data being sent:', JSON.stringify(frontendTestData, null, 2));

  try {
    // Remove confirmPassword and agreeTerms as the frontend does
    const { confirmPassword, agreeTerms, ...apiData } = frontendTestData;

    console.log('API Data (after removing frontend fields):', JSON.stringify(apiData, null, 2));

    const response = await axios.post('http://localhost:5001/api/auth/register', apiData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Registration successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    return { success: true, data: response.data };

  } catch (error) {
    console.log('❌ Registration failed!');
    console.log('Status:', error.response?.status || 'No status');
    console.log('Error:', error.response?.data || error.message);

    if (error.response?.data?.errors) {
      console.log('Validation Errors:', error.response.data.errors);
    }

    return { success: false, error: error.response?.data || error.message };
  }
}

async function testValidationScenarios() {
  console.log('\n🧪 Testing Common Validation Issues...');

  const testCases = [
    {
      name: 'Missing Name',
      data: { email: 'test@example.com', password: 'password123', role: 'hr' }
    },
    {
      name: 'Invalid Email',
      data: { name: 'Test', email: 'invalid-email', password: 'password123', role: 'hr' }
    },
    {
      name: 'Short Password',
      data: { name: 'Test', email: 'test@example.com', password: '123', role: 'hr' }
    },
    {
      name: 'Valid Data',
      data: { name: 'Valid User', email: 'valid@example.com', password: 'password123', role: 'hr', company: 'Valid Company' }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    console.log('Data:', JSON.stringify(testCase.data, null, 2));

    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', testCase.data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });

      console.log('✅ Success:', response.data.message);
    } catch (error) {
      console.log('❌ Failed:', error.response?.data?.message || error.message);
      if (error.response?.data?.errors) {
        console.log('Validation errors:', error.response.data.errors);
      }
    }
  }
}

function provideFrontendDebugTips() {
  console.log('\n🔧 Frontend Debugging Checklist:');
  console.log('=====================================');
  console.log('1. Open browser developer tools (F12)');
  console.log('2. Go to Console tab - look for JavaScript errors');
  console.log('3. Go to Network tab - check the registration request');
  console.log('4. Verify the request payload matches expected format');
  console.log('5. Check response status and error messages');
  console.log('');
  console.log('Common Frontend Issues:');
  console.log('- Form validation preventing submission');
  console.log('- Terms checkbox not checked');
  console.log('- Network connectivity issues');
  console.log('- JavaScript errors blocking execution');
  console.log('- CORS issues (less likely with current setup)');
  console.log('');
  console.log('Manual Testing Steps:');
  console.log('1. Go to http://localhost:3002/register');
  console.log('2. Open F12 developer tools');
  console.log('3. Fill out the form completely:');
  console.log('   - Name: Any name');
  console.log('   - Email: Valid email format');
  console.log('   - Password: 6+ characters');
  console.log('   - Confirm Password: Must match');
  console.log('   - Role: Select HR Professional');
  console.log('   - Company: Enter company name');
  console.log('   - Terms: Check the checkbox');
  console.log('4. Click "Create account"');
  console.log('5. Watch Network tab for the request');
  console.log('6. Check Console for any errors');
}

async function runDebugTests() {
  console.log('🚀 Starting Frontend Registration Debug\n');

  const result = await testFrontendData();
  await testValidationScenarios();

  provideFrontendDebugTips();

  console.log('\n📊 Debug Summary:');
  console.log('=================');
  console.log('Backend API Status:', result.success ? '✅ Working' : '❌ Issues detected');

  if (result.success) {
    console.log('✅ Backend registration is working correctly');
    console.log('❌ Issue is likely in the frontend');
    console.log('🔧 Follow the debugging steps above');
  } else {
    console.log('❌ Backend has issues - check server logs');
  }
}

runDebugTests().catch(console.error);

#!/usr/bin/env node

const axios = require('axios');

console.log('🔍 Debugging Registration Process\n');

// Test various registration scenarios to identify the issue
const testCases = [
  {
    name: 'Valid Registration',
    data: {
      name: 'Debug User',
      email: 'debug@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'hr',
      company: 'Debug Company'
    }
  },
  {
    name: 'Missing Company Field',
    data: {
      name: 'Debug User 2',
      email: 'debug2@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'hr'
      // Missing company field
    }
  },
  {
    name: 'Admin Role (No Company Required)',
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'admin'
    }
  }
];

async function runTests() {
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log('Data:', JSON.stringify(testCase.data, null, 2));

    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', testCase.data, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Success!');
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
      console.log('❌ Failed!');
      console.log('Status:', error.response?.status || 'No status');
      console.log('Error:', error.response?.data || error.message);

      if (error.response?.data?.errors) {
        console.log('Validation Errors:', error.response.data.errors);
      }
    }
  }

  console.log('\n🔍 Frontend Debugging Tips:');
  console.log('1. Check browser console (F12) for JavaScript errors');
  console.log('2. Look at Network tab for failed requests');
  console.log('3. Verify form data is being sent correctly');
  console.log('4. Check if validation is preventing submission');
  console.log('5. Ensure the terms checkbox is checked (if required)');

  console.log('\n📱 Manual Testing Steps:');
  console.log('1. Go to http://localhost:3002/register');
  console.log('2. Fill out the form with:');
  console.log('   - Name: Test User');
  console.log('   - Email: test@example.com');
  console.log('   - Password: password123');
  console.log('   - Confirm Password: password123');
  console.log('   - Role: HR Professional');
  console.log('   - Company: Test Company');
  console.log('3. Check the "Terms of Service" checkbox');
  console.log('4. Click "Create account"');
  console.log('5. Check browser console for any errors');
}

runTests().catch(console.error);

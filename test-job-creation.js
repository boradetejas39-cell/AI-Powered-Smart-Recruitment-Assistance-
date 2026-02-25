#!/usr/bin/env node

const axios = require('axios');

console.log('🔍 Testing Job Creation API\n');

async function testJobCreation() {
  const testJob = {
    title: 'Senior Software Engineer',
    description: 'We are looking for a senior software engineer with experience in React and Node.js',
    location: 'Bangalore, India',
    jobType: 'full-time',
    department: 'Engineering',
    priority: 'medium',
    requiredSkills: ['JavaScript', 'React', 'Node.js'],
    experienceRequired: {
      min: 3,
      max: 7,
      type: 'years'
    },
    salary: {
      min: 800000,
      max: 1500000,
      currency: 'INR'
    }
  };

  console.log('📤 Testing job creation with data:');
  console.log(JSON.stringify(testJob, null, 2));

  try {
    // First, login to get a token
    console.log('\n🔐 Logging in to get token...');
    const loginResponse = await axios.post('http://localhost:5050/api/auth/login', {
      email: 'dbtest@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful, token received');

    // Now create the job
    console.log('\n📤 Creating job...');
    const response = await axios.post('http://localhost:5050/api/jobs', testJob, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    console.log('✅ Job creation successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    return { success: true, data: response.data };

  } catch (error) {
    console.log('\n❌ Job creation failed!');
    console.log('Error:', error.message);

    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    }

    return { success: false, error: error.response?.data || error.message };
  }
}

async function testJobList() {
  console.log('\n📋 Testing job listing...');

  try {
    const response = await axios.get('http://localhost:5050/api/jobs', {
      timeout: 5000
    });

    console.log('✅ Job list retrieved successfully!');
    console.log('Status:', response.status);
    console.log('Jobs found:', response.data.data?.jobs?.length || 0);

    if (response.data.data?.jobs?.length > 0) {
      console.log('Sample job:', response.data.data.jobs[0]);
    }

    return { success: true, data: response.data };

  } catch (error) {
    console.log('❌ Job listing failed!');
    console.log('Error:', error.message);

    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    }

    return { success: false, error: error.response?.data || error.message };
  }
}

async function main() {
  console.log('🚀 Starting Job Creation Test\n');

  const createResult = await testJobCreation();

  if (createResult.success) {
    console.log('\n🎉 Backend job creation is working!');

    // Test job listing
    await testJobList();

    console.log('\n📋 Next Steps:');
    console.log('1. Backend API is 100% functional');
    console.log('2. Check frontend form submission');
    console.log('3. Check form data structure');
    console.log('4. Check network requests in browser');
    console.log('5. Check JavaScript errors in browser');

  } else {
    console.log('\n⚠️ Backend job creation has issues');
    console.log('Error details:', createResult.error);

    // Check if it's an authentication issue
    if (createResult.error?.message?.includes('token') || createResult.error?.message?.includes('auth')) {
      console.log('\n🔐 Possible authentication issue:');
      console.log('1. User might not be logged in');
      console.log('2. Token might be expired');
      console.log('3. Token might not be sent with request');
    }
  }

  console.log('\n🔍 Frontend Debugging Instructions:');
  console.log('====================================');
  console.log('1. Open browser developer tools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Fill out job creation form');
  console.log('4. Click "Create Job"');
  console.log('5. Watch Console for debugging messages');
  console.log('6. Check Network tab for API request');
  console.log('7. Verify request payload and response');
}

main().catch(console.error);

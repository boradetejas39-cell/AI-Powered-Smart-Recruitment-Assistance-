#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Database Connectivity\n');

const API_BASE = 'http://localhost:5000/api';
const DB_DIR = path.join(__dirname, 'file-db');

async function testDatabaseFiles() {
  console.log('📁 Checking Database Files...');
  
  const files = ['users.json', 'jobs.json', 'resumes.json', 'matches.json'];
  let allFilesExist = true;
  
  files.forEach(file => {
    const filePath = path.join(DB_DIR, file);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`✅ ${file}: ${data.length} records`);
    } else {
      console.log(`❌ ${file}: File not found`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

async function testAPIConnectivity() {
  console.log('\n🌐 Testing API Connectivity...');
  
  try {
    const response = await axios.get(`${API_BASE}/health`, { timeout: 5000 });
    console.log('✅ API Health Check:', response.data.status);
    console.log('   Message:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ API Health Check Failed:', error.message);
    return false;
  }
}

async function testUserOperations() {
  console.log('\n👤 Testing User Operations...');
  
  // Test registration
  const testUser = {
    name: 'DB Test User ' + Date.now(),
    email: `dbtest${Date.now()}@example.com`,
    password: 'password123',
    role: 'hr',
    company: 'Database Test Company'
  };
  
  try {
    // Register new user
    const regResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    console.log('✅ User Registration:', regResponse.data.message);
    console.log('   User ID:', regResponse.data.data.user.id);
    
    // Test login
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User Login:', loginResponse.data.message);
    
    // Test protected route with token
    const token = loginResponse.data.data.token;
    const profileResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Protected Route Access:', profileResponse.data.data.user.email);
    
    return true;
  } catch (error) {
    console.log('❌ User Operations Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testDataPersistence() {
  console.log('\n💾 Testing Data Persistence...');
  
  try {
    // Get current user count
    const usersPath = path.join(DB_DIR, 'users.json');
    const beforeData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const beforeCount = beforeData.length;
    
    // Register a new user
    const testUser = {
      name: 'Persistence Test',
      email: `persist${Date.now()}@example.com`,
      password: 'password123',
      role: 'admin'
    };
    
    await axios.post(`${API_BASE}/auth/register`, testUser);
    
    // Check if data was saved
    const afterData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const afterCount = afterData.length;
    
    if (afterCount > beforeCount) {
      console.log('✅ Data Persistence: Records increased from', beforeCount, 'to', afterCount);
      
      // Verify the new user data
      const newUser = afterData.find(u => u.email === testUser.email);
      if (newUser) {
        console.log('✅ New User Data Verified:');
        console.log('   ID:', newUser._id);
        console.log('   Name:', newUser.name);
        console.log('   Role:', newUser.role);
        console.log('   Created:', newUser.createdAt);
        return true;
      }
    }
    
    console.log('❌ Data Persistence: No new records found');
    return false;
  } catch (error) {
    console.log('❌ Data Persistence Test Failed:', error.message);
    return false;
  }
}

async function testDatabaseReadWrite() {
  console.log('\n🔄 Testing Database Read/Write...');
  
  try {
    // Test reading users
    const usersResponse = await axios.get(`${API_BASE}/resumes`);
    console.log('✅ Database Read: Retrieved', usersResponse.data.length, 'resumes');
    
    // Test jobs endpoint
    const jobsResponse = await axios.get(`${API_BASE}/jobs`);
    console.log('✅ Database Read: Retrieved', jobsResponse.data.length, 'jobs');
    
    // Test matches endpoint
    const matchesResponse = await axios.get(`${API_BASE}/matches`);
    console.log('✅ Database Read: Retrieved', matchesResponse.data.length, 'matches');
    
    return true;
  } catch (error) {
    console.log('❌ Database Read/Write Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function runDatabaseTests() {
  console.log('🚀 Starting Database Connectivity Tests\n');
  
  const results = {
    files: await testDatabaseFiles(),
    api: await testAPIConnectivity(),
    users: await testUserOperations(),
    persistence: await testDataPersistence(),
    readWrite: await testDatabaseReadWrite()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test.charAt(0).toUpperCase() + test.slice(1)} Test`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All Database Tests Passed!');
    console.log('✅ Database is fully functional');
    console.log('✅ Data persistence working');
    console.log('✅ API endpoints responding');
    console.log('✅ User authentication working');
  } else {
    console.log('\n⚠️  Some Database Tests Failed');
    console.log('Please check the errors above');
  }
  
  console.log('\n📱 Database Status:');
  console.log('- Type: File-based JSON database');
  console.log('- Location: ./file-db/');
  console.log('- Collections: users, jobs, resumes, matches');
  console.log('- Status:', allPassed ? '✅ Connected and Working' : '⚠️ Issues Detected');
}

runDatabaseTests().catch(console.error);

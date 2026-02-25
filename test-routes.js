#!/usr/bin/env node

const axios = require('axios');

console.log('🔍 Testing Frontend Routes\n');

async function testRoutes() {
  const baseUrl = 'http://localhost:3000';
  
  const routes = [
    '/',
    '/login',
    '/register',
    '/showcase'
  ];
  
  for (const route of routes) {
    try {
      console.log(`\n🌐 Testing: ${baseUrl}${route}`);
      const response = await axios.get(`${baseUrl}${route}`, { 
        timeout: 5000,
        validateStatus: false // Don't throw on 404s
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📄 Content Type: ${response.headers['content-type']}`);
      console.log(`📏 Content Length: ${response.data.length} characters`);
      
      if (response.status === 200) {
        console.log('✅ Route is accessible');
      } else {
        console.log('⚠️ Unexpected status code');
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Connection refused - frontend not running');
      } else if (error.response) {
        console.log(`❌ HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  }
}

async function testDirectRegister() {
  console.log('\n🎯 Testing Register Route Specifically...');
  
  try {
    const response = await axios.get('http://localhost:3000/register', {
      timeout: 5000,
      validateStatus: false
    });
    
    console.log('✅ Register Route Response:');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data preview:', response.data.substring(0, 200) + '...');
    
    return response.status === 200;
  } catch (error) {
    console.log('❌ Register Route Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Route Testing\n');
  
  await testRoutes();
  const registerWorks = await testDirectRegister();
  
  console.log('\n📊 Route Test Results:');
  console.log('========================');
  console.log(`Register Route: ${registerWorks ? '✅ Working' : '❌ Not Working'}`);
  
  if (registerWorks) {
    console.log('\n🎉 Frontend routes are working!');
    console.log('Try accessing: http://localhost:3000/register');
    console.log('If still not working, check:');
    console.log('1. Browser cache (try hard refresh: Ctrl+F5)');
    console.log('2. JavaScript errors (check browser console)');
    console.log('3. Network issues (check Network tab)');
  } else {
    console.log('\n⚠️ Frontend routing issues detected');
    console.log('The register route may not be properly configured');
  }
}

main().catch(console.error);

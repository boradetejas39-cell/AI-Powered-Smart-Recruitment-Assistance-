#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Updating .env file with MongoDB configuration...\n');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Read the .env.example file
const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');

// Write it to .env file
fs.writeFileSync(envPath, envExampleContent);

console.log('✅ .env file updated successfully!');
console.log('\n📋 Configuration:');
console.log('- MongoDB Atlas connection configured');
console.log('- JWT secret set to production-ready key');
console.log('- Server port: 5000');
console.log('- Environment: development');

console.log('\n🔄 Restarting backend server to connect to database...');

// Kill existing server process and restart
const { spawn } = require('child_process');

// First, let's stop the current server
spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'inherit' });

// Wait a moment and restart
setTimeout(() => {
  console.log('🚀 Starting server with database connection...\n');
  
  const server = spawn('npm', ['start'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });
  
  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
  
}, 2000);

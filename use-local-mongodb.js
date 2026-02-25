#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Switching to local MongoDB configuration...\n');

const envPath = path.join(__dirname, '.env');

// Create local MongoDB configuration
const localEnvConfig = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ai-recruiter
MONGODB_TEST_URI=mongodb://localhost:27017/ai-recruiter-test

# JWT Configuration
JWT_SECRET=ai-recruiter-super-secret-jwt-key-development
JWT_EXPIRE=7d

# Server Configuration
PORT=5050
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
`;

// Write the new configuration
fs.writeFileSync(envPath, localEnvConfig);

console.log('✅ Updated .env file for local MongoDB!');
console.log('\n📋 Configuration:');
console.log('- MongoDB URI: mongodb://localhost:27017/ai-recruiter');
console.log('- Server port: 5000');
console.log('- Environment: development');

console.log('\n🔧 Next steps:');
console.log('1. Make sure MongoDB is running locally');
console.log('2. If not installed, download from: https://www.mongodb.com/try/download/community');
console.log('3. Start MongoDB service: net start MongoDB');
console.log('4. Restart this server: npm start');

console.log('\n🔄 Restarting server with local MongoDB...');

// Restart the server
const { spawn } = require('child_process');

// Kill existing processes
spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'inherit' });

// Wait and restart
setTimeout(() => {
  console.log('🚀 Starting server with local MongoDB...\n');

  const server = spawn('npm', ['start'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });

}, 2000);

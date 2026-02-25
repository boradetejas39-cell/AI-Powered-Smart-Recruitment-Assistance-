#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📦 MongoDB Installation Guide for Windows\n');

console.log('MongoDB is not installed on your system. Here are the installation options:\n');

console.log('🔧 Option 1: Install MongoDB Community Server (Recommended)');
console.log('1. Visit: https://www.mongodb.com/try/download/community');
console.log('2. Select:');
console.log('   - Version: 7.0 (or latest stable)');
console.log('   - Platform: Windows');
console.log('   - Package: msi');
console.log('3. Download and run the installer');
console.log('4. Choose "Complete" installation');
console.log('5. Install MongoDB as a service (recommended)');
console.log('6. Install MongoDB Compass (GUI tool) - optional\n');

console.log('🔧 Option 2: Install via Chocolatey (if you have Chocolatey)');
console.log('Run in PowerShell as Administrator:');
console.log('choco install mongodb\n');

console.log('🔧 Option 3: Use Docker (if you have Docker)');
console.log('Run this command:');
console.log('docker run --name mongodb -p 27017:27017 -d mongo:latest\n');

console.log('🔧 Option 4: Use MongoDB Atlas (Cloud Database)');
console.log('1. Go to: https://www.mongodb.com/atlas');
console.log('2. Create a free account');
console.log('3. Create a free cluster');
console.log('4. Whitelist your IP address');
console.log('5. Update .env with Atlas connection string\n');

console.log('⚡ Quick Setup - File-Based Database (No Installation Needed)');
console.log('I can create a file-based database that works immediately without MongoDB installation.\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Would you like me to create a file-based database instead? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Setting up file-based database...');
    setupFileDatabase();
  } else {
    console.log('\n📚 Please install MongoDB using one of the options above.');
    console.log('After installation, restart this server with: npm start');
  }
  rl.close();
});

function setupFileDatabase() {
  // Create a simple file-based database solution
  const dbDir = path.join(__dirname, 'file-db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
  }

  // Update .env to use file-based database
  const envPath = path.join(__dirname, '.env');
  const fileDbEnvConfig = `# Database Configuration
# Using file-based database (no MongoDB required)
MONGODB_URI=file-based
MONGODB_TEST_URI=file-based

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

  fs.writeFileSync(envPath, fileDbEnvConfig);

  console.log('✅ File-based database configured!');
  console.log('📁 Database files will be stored in: ./file-db/');
  console.log('🔄 Restarting server...\n');

  // Restart server
  const { spawn } = require('child_process');
  spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'inherit' });

  setTimeout(() => {
    const server = spawn('npm', ['start'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });
  }, 2000);
}

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AI-Recruiter Setup Script\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('✅ Creating .env file from .env.example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created successfully!');
  console.log('\n⚠️  IMPORTANT: Please edit your .env file with your actual configuration:');
  console.log('- MONGODB_URI: Your MongoDB connection string');
  console.log('- JWT_SECRET: A secure secret key for JWT tokens');
  console.log('- PORT: Server port (default: 5000)');
} else {
  console.log('✅ .env file already exists');
}

// Check uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('✅ Creating uploads directory...');
  fs.mkdirSync(uploadsPath, { recursive: true });
  
  // Create .gitkeep for uploads directory
  const gitkeepPath = path.join(uploadsPath, '.gitkeep');
  fs.writeFileSync(gitkeepPath, '');
  console.log('✅ Uploads directory created successfully!');
} else {
  console.log('✅ Uploads directory already exists');
}

// Check node_modules
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('⚠️  node_modules not found. Please run: npm install');
} else {
  console.log('✅ Backend dependencies installed');
}

// Check client node_modules
const clientNodeModulesPath = path.join(__dirname, 'client', 'node_modules');
if (!fs.existsSync(clientNodeModulesPath)) {
  console.log('⚠️  Client dependencies not found. Please run: cd client && npm install');
} else {
  console.log('✅ Frontend dependencies installed');
}

console.log('\n🎉 Setup check complete!');
console.log('\nNext steps:');
console.log('1. Edit .env file with your configuration');
console.log('2. Ensure MongoDB is running');
console.log('3. Start backend: npm run dev');
console.log('4. Start frontend: cd client && npm start');
console.log('5. Visit: http://localhost:3000');

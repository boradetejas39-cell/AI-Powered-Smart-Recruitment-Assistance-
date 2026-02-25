#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up client environment variables...\n');

const clientEnvPath = path.join(__dirname, '.env');

// Create client .env file with correct API URL
const clientEnvContent = `# API Configuration
REACT_APP_API_URL=http://localhost:5001/api

# Other environment variables
REACT_APP_ENV=development
GENERATE_SOURCEMAP=false
`;

fs.writeFileSync(clientEnvPath, clientEnvContent);

console.log('✅ Client .env file created/updated!');
console.log('📋 Configuration:');
console.log('- API URL: http://localhost:5001/api');
console.log('- Environment: development');
console.log('- Source maps: disabled (faster builds)');

console.log('\n🔄 Restarting frontend to apply changes...');

// Kill frontend process
const { spawn } = require('child_process');
spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'inherit' });

// Wait and restart
setTimeout(() => {
  console.log('🚀 Starting frontend with correct API configuration...\n');

  const frontend = spawn('npm', ['start'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  frontend.on('close', (code) => {
    console.log(`Frontend process exited with code ${code}`);
  });

}, 2000);

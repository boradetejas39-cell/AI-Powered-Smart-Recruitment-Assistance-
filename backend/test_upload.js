const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');

const filePath = process.argv[2] || 'uploads/test_resume.pdf';
const token = fs.readFileSync('token.txt', 'utf8').trim();

const form = new FormData();
form.append('resume', fs.createReadStream(filePath), {
  filename: path.basename(filePath),
  contentType: 'application/pdf'
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/resumes/upload',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    ...form.getHeaders()
  }
};

console.log('Uploading file:', filePath);
console.log('Options:', options);

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log('Response:', JSON.stringify(parsed, null, 2));
      if (parsed.success) {
        console.log('\n✅ UPLOAD SUCCESSFUL!');
      } else {
        console.log('\n❌ UPLOAD FAILED:', parsed.message);
        process.exit(1);
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
  process.exit(1);
});

form.pipe(req);

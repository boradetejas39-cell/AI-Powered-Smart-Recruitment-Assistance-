const axios = require('axios');

// Create API instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a test user
const createTestUser = async () => {
  try {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'user',
      company: '',
      phone: '+1234567890'
    };

    // Register the user
    const response = await api.post('/auth/register', userData);
    console.log('Test user created:', response.data);
    
    // Login to get token
    const loginResponse = await api.post('/auth/login', {
      email: 'john.doe@example.com',
      password: 'password123'
    });
    
    console.log('Test user logged in:', loginResponse.data);
    console.log('Token:', loginResponse.data.data.token);
    
    return loginResponse.data.data.token;
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

createTestUser();

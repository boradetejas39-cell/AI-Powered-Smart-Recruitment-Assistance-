const request = require('supertest');
const app = require('../server');

describe('AI-Recruiter API Tests', () => {
  describe('Health Check', () => {
    test('GET /api/health should return 200', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Authentication Endpoints', () => {
    test('POST /api/auth/register should validate input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);
      
      expect(response.body).toHaveProperty('errors');
    });

    test('POST /api/auth/login should validate input', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);
      
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('Job Endpoints', () => {
    test('GET /api/jobs should return jobs list', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Resume Endpoints', () => {
    test('GET /api/resumes should return resumes list', async () => {
      const response = await request(app)
        .get('/api/resumes')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory storage for demo - make it globally accessible
global.users = [
  {
    _id: '1',
    name: 'Demo HR User',
    email: 'hr@example.com',
    password: 'password',
    role: 'hr',
    company: 'Demo Company',
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true
  },
  {
    _id: '2',
    name: 'Demo Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    company: 'Demo Company',
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true
  }
];
global.userIdCounter = 3;

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI Recruiter Demo API is running',
    timestamp: new Date().toISOString()
  });
});

// Import auth routes
const authRoutes = require('./routes/auth');

// Use auth routes
app.use('/api/auth', authRoutes);

// Demo jobs endpoint
app.get('/api/jobs', (req, res) => {
  res.json({
    success: true,
    data: {
      jobs: [
        {
          _id: 1,
          title: 'Software Engineer',
          description: 'Looking for a skilled software engineer...',
          location: 'Remote',
          jobType: 'full-time',
          status: 'active',
          requiredSkills: ['JavaScript', 'React', 'Node.js'],
          experienceRequired: { min: 2, max: 5, experienceType: 'years' },
          createdAt: new Date()
        }
      ],
      pagination: {
        current: 1,
        pages: 1,
        total: 1,
        limit: 10
      }
    }
  });
});

// Demo resumes endpoint
app.get('/api/resumes', (req, res) => {
  res.json({
    success: true,
    data: {
      resumes: [
        {
          _id: 1,
          candidateName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          skills: ['JavaScript', 'React', 'Node.js'],
          experience: [
            {
              company: 'Tech Corp',
              position: 'Software Engineer',
              startDate: '2020-01-01',
              endDate: '2023-12-31'
            }
          ],
          education: [
            {
              institution: 'University',
              degree: 'Bachelor',
              field: 'Computer Science'
            }
          ],
          status: 'active',
          createdAt: new Date()
        }
      ],
      pagination: {
        current: 1,
        pages: 1,
        total: 1,
        limit: 10
      }
    }
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Demo server running on port ${PORT}`);
  console.log('Note: This is a demo version with in-memory storage');
  console.log('Frontend should be available at http://localhost:3000');
});

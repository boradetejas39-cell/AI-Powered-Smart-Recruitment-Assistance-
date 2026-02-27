const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const connectDB = require('./utils/db');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const resumeRoutes = require('./routes/resumes');
const matchRoutes = require('./routes/matches');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const jobStatusService = require('./services/jobStatusService');

// Initialize Express app
const app = express();

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.originalUrl);
  next();
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-production-domain.com']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes (register early so they're available regardless of DB timing)
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);         // 🔒 Admin-only routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AI Recruiter API is running',
    timestamp: new Date().toISOString()
  });
});

// Job status management endpoints
app.get('/api/jobs/status/update', async (req, res) => {
  try {
    const result = await jobStatusService.updateJobStatuses();
    res.status(200).json({
      success: true,
      message: 'Job statuses updated successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update job statuses',
      error: error.message
    });
  }
});

app.get('/api/jobs/:id/status', async (req, res) => {
  try {
    const jobId = req.params.id;
    const result = jobStatusService.getJobStatus({ _id: jobId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get job status',
      error: error.message
    });
  }
});

// Serve static assets in production (must come before 404 handler)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  // Catch-all: serve React app for non-API routes only
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler (must be last)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection and server start
const startServer = () => {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

connectDB()
  .then((connected) => {
    if (connected) {
      console.log('Database connection: Connected');
      console.log('🔄 Starting automatic job status scheduler...');

      // Run status updates every hour
      setInterval(async () => {
        await jobStatusService.updateJobStatuses();
      }, 60 * 60 * 1000);

      // Run initial status update after 5 seconds
      setTimeout(async () => {
        await jobStatusService.updateJobStatuses();
      }, 5000);
    } else {
      console.log('Database connection: Not connected (starting server without database)');
      console.log('Note: Database features will not be available.');
    }
    startServer();
  })
  .catch((err) => {
    console.error('Unexpected error:', err.message || err);
    console.log('Starting server anyway...');
    startServer();
  });

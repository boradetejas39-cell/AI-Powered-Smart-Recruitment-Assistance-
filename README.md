# AI-Powered Smart Recruitment Assistant

A comprehensive full-stack web application that automates resume screening and intelligently matches candidates with job descriptions using AI-based semantic analysis.

## 🚀 Features

### Core Functionality
- **AI-Powered Resume Parsing**: Automatically extract structured data from PDF/DOCX resumes
- **Intelligent Candidate Matching**: Use NLP and semantic analysis to match candidates with jobs
- **Skill-Based Scoring**: Weighted algorithm considering skills, experience, and education
- **Real-time Analytics**: Comprehensive dashboard with recruitment insights
- **Role-Based Access**: Admin and HR user roles with appropriate permissions

### Advanced Features
- **Semantic Search**: Beyond keyword matching for better candidate discovery
- **Resume Feedback Generator**: AI-powered suggestions for resume improvement
- **Export Functionality**: Export ranked results to CSV
- **Candidate Comparison**: Side-by-side comparison of multiple candidates
- **Automated Notifications**: Real-time alerts for important recruitment activities

## 🏗️ Architecture

```
Frontend (React.js)
    ↓
Backend API (Node.js + Express.js)
    ↓
AI/NLP Processing Module
    ↓
MongoDB Database
```

### Technology Stack

#### Frontend
- **React.js** - Modern UI framework
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Hook Form** - Form management

#### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling

#### AI/NLP
- **Natural.js** - NLP processing
- **PDF-Parse** - PDF text extraction
- **Mammoth** - DOCX text extraction
- **Cosine Similarity** - Semantic matching

## 📁 Project Structure

```
AI-Recruiter/
├── server.js                 # Main server file
├── package.json              # Backend dependencies
├── .env.example              # Environment variables template
├── models/                   # Database models
│   ├── User.js              # User schema
│   ├── Job.js               # Job schema
│   ├── Resume.js             # Resume schema
│   └── Match.js              # Match result schema
├── routes/                   # API routes
│   ├── auth.js               # Authentication routes
│   ├── jobs.js               # Job management routes
│   ├── resumes.js            # Resume management routes
│   ├── matches.js            # Matching routes
│   └── dashboard.js          # Dashboard analytics routes
├── middleware/               # Custom middleware
│   ├── auth.js               # Authentication middleware
│   ├── upload.js             # File upload middleware
│   └── errorHandler.js       # Error handling middleware
├── services/                 # Business logic services
│   ├── aiMatchingService.js  # AI matching algorithm
│   └── resumeParserService.js # Resume parsing service
├── client/                   # React frontend
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/            # Page components
│   │   └── utils/            # Utility functions
│   └── package.json          # Frontend dependencies
└── uploads/                  # File upload directory
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-Recruiter
```

### 2. Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ai-recruiter

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Server Configuration
PORT=5050
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup

#### Navigate to Client Directory
```bash
cd client
```

#### Install Dependencies
```bash
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/hr),
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

### Jobs Collection
```javascript
{
  title: String,
  description: String,
  requiredSkills: [String],
  experienceRequired: {
    min: Number,
    max: Number,
    type: String
  },
  location: String,
  jobType: String,
  status: String,
  createdBy: ObjectId (ref: User),
  applicants: [ObjectId] (ref: Resume),
  priority: String
}
```

### Resumes Collection
```javascript
{
  candidateName: String,
  email: String,
  phone: String,
  skills: [String],
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date
  }],
  rawText: String,
  fileName: String,
  filePath: String,
  fileType: String,
  uploadedBy: ObjectId (ref: User),
  totalExperience: Number,
  status: String
}
```

### Matches Collection
```javascript
{
  jobId: ObjectId (ref: Job),
  resumeId: ObjectId (ref: Resume),
  score: Number,
  breakdown: {
    skillMatch: {
      score: Number,
      matchedSkills: [Object],
      missingSkills: [Object]
    },
    experienceMatch: {
      score: Number,
      requiredYears: Number,
      candidateYears: Number
    },
    educationMatch: {
      score: Number,
      highestDegree: String
    }
  },
  status: String,
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date
}
```

## 🤖 AI Matching Algorithm

### Scoring Formula
The matching algorithm uses a weighted approach:

```
Overall Score = (Skill Match × 0.6) + (Experience Match × 0.3) + (Education Match × 0.1)
```

### Skill Matching Process
1. **Text Preprocessing**: Clean and normalize text from resumes and job descriptions
2. **Tokenization**: Break down text into individual tokens
3. **Stopword Removal**: Remove common stopwords that don't add semantic value
4. **Stemming**: Reduce words to their root form
5. **Skill Extraction**: Identify and extract relevant skills using keyword matching
6. **Semantic Analysis**: Use cosine similarity for semantic matching
7. **Weighted Scoring**: Apply category-specific weights to skills

### Experience Matching
- Compare required experience with candidate's total experience
- Apply bonus points for exceeding requirements
- Consider relevance of experience to job requirements

### Education Matching
- Identify highest education level
- Match field of study with job requirements
- Consider institution reputation (future enhancement)

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive input validation using express-validator
- **File Upload Security**: File type and size validation
- **CORS Configuration**: Proper CORS setup for cross-origin requests
- **Rate Limiting**: API rate limiting to prevent abuse
- **SQL/NoSQL Injection Prevention**: Parameterized queries and input sanitization

## 📈 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs` - Get jobs with filtering
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Resumes
- `POST /api/resumes/upload` - Upload and parse resume
- `GET /api/resumes` - Get resumes with filtering
- `GET /api/resumes/:id` - Get resume details
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### Matches
- `POST /api/matches/calculate/:jobId/:resumeId` - Calculate match
- `POST /api/matches/job/:jobId` - Match all resumes for job
- `GET /api/matches/job/:jobId` - Get matches for job
- `GET /api/matches/:id` - Get match details
- `PUT /api/matches/:id/status` - Update match status

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/analytics` - Detailed analytics
- `GET /api/dashboard/alerts` - System alerts

## 🧪 Testing

### Backend Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing
```bash
cd client
npm test
```

## 🚀 Deployment

### Production Build

#### Backend
```bash
# Set production environment
export NODE_ENV=production

# Start production server
npm start
```

#### Frontend
```bash
cd client
npm run build
```

### Docker Deployment
```bash
# Build Docker image
docker build -t ai-recruiter .

# Run container
docker run -p 5000:5000 ai-recruiter
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-very-secure-jwt-secret
PORT=5050
```

## 📊 Performance Considerations

### Database Optimization
- Indexed fields for faster queries
- Pagination for large datasets
- Aggregation pipelines for complex analytics
- Connection pooling for MongoDB

### Frontend Optimization
- Code splitting for better loading performance
- Lazy loading for images and components
- Caching strategies for API responses
- Optimized bundle size with tree shaking

### AI Processing Optimization
- Async processing for resume parsing
- Caching of parsed results
- Batch processing for multiple matches
- Background job processing for heavy computations

## 🔧 Future Enhancements

### Planned Features
- **Video Interview Integration**: Automated video interview scheduling and analysis
- **Advanced Analytics**: Predictive analytics for hiring success rates
- **Integration with ATS**: Integration with popular Applicant Tracking Systems
- **Mobile App**: Native mobile applications for iOS and Android
- **AI Chatbot**: Intelligent chatbot for candidate queries
- **Reference Checking**: Automated reference checking process
- **Onboarding Integration**: Seamless integration with onboarding systems

### Technical Improvements
- **Microservices Architecture**: Split into microservices for better scalability
- **Machine Learning Models**: Advanced ML models for better matching accuracy
- **Real-time Notifications**: WebSocket-based real-time updates
- **Advanced Search**: Elasticsearch integration for advanced search capabilities
- **Multi-language Support**: Support for multiple languages in resumes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@airecruiter.com
- Documentation: [Wiki](https://github.com/your-repo/wiki)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Natural.js team for the excellent NLP library
- React.js community for the amazing framework
- MongoDB team for the robust database solution
- All contributors and users of this project

---

**Built with ❤️ by the AI Recruiter Team**

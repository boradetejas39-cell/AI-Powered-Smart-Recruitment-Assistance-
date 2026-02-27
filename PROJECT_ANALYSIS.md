# AI-Recruiter — Project Analysis Report

**Project Name:** AI-Powered Smart Recruitment Assistant  
**Version:** 1.0.0  
**License:** MIT  
**Date:** February 27, 2026  

---

## 1. Executive Summary

AI-Recruiter is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application that serves as an intelligent recruitment management platform. It leverages AI-powered services for resume parsing, candidate screening, interview management, and job-candidate matching. The system supports four user roles (Job Seeker, Recruiter, HR Professional, Administrator) with role-based access control and a dual API architecture (v1 legacy + v2 production MVC).

---

## 2. Technology Stack

### 2.1 Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | Runtime | Server environment |
| Express.js | ^4.18.2 | Web framework |
| MongoDB Atlas | Cloud | Primary database |
| Mongoose | ^7.5.0 | ODM for MongoDB |
| JSON Web Token | ^9.0.2 | Authentication |
| bcryptjs | ^2.4.3 | Password hashing |
| Multer | ^1.4.5 | File upload handling |
| pdf-parse | ^1.1.1 | PDF resume parsing |
| mammoth | ^1.6.0 | DOCX resume parsing |
| natural | ^6.5.0 | NLP for AI matching |
| Helmet | ^7.0.0 | Security headers |
| express-rate-limit | ^6.10.0 | Rate limiting |
| Joi | ^18.0.2 | Request validation |
| xss | ^1.0.15 | XSS sanitization |
| nodemailer | ^8.0.1 | Email notifications |
| Nodemon | ^3.0.1 | Dev hot-reload |

### 2.2 Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^18.2.0 | UI framework |
| React Router DOM | ^6.3.0 | Client-side routing |
| Axios | ^1.4.0 | HTTP client |
| Tailwind CSS | ^3.3.3 | Utility-first CSS |
| Recharts | ^2.7.2 | Data visualization/charts |
| Headless UI | ^1.7.15 | Accessible UI components |
| Heroicons | ^2.2.0 | SVG icon library |
| Lucide React | ^0.263.1 | Additional icons |
| react-hook-form | ^7.45.2 | Form management |
| react-hot-toast | ^2.4.1 | Toast notifications |
| date-fns | ^2.30.0 | Date utilities |
| clsx | ^1.2.1 | Conditional classnames |

### 2.3 DevOps & Deployment
| Technology | Purpose |
|---|---|
| Vercel | Production deployment |
| concurrently | Run backend + frontend in dev |
| Git | Version control |

---

## 3. Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│                     localhost:3000 (dev)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Pages   │  │Components│  │ Contexts  │  │ API Layer│     │
│  │ (17 dirs)│  │  (UI/    │  │(AuthCtx)  │  │(axios,v2)│     │
│  │          │  │  Layout) │  │           │  │          │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP (Axios)
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                       │
│                     localhost:5001 (dev)                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Middleware Pipeline                        │  │
│  │  Helmet → RateLimit → CORS → JSON → Sanitize → Auth   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────┐                  │
│  │  V1 Routes      │    │  V2 Routes (MVC)│                  │
│  │  /api/auth      │    │  /api/v2/auth   │                  │
│  │  /api/jobs      │    │  /api/v2/jobs   │                  │
│  │  /api/resumes   │    │  /api/v2/apps   │                  │
│  │  /api/matches   │    │  /api/v2/interviews│               │
│  │  /api/dashboard │    │  /api/v2/pipeline│                 │
│  │  /api/admin     │    │  /api/v2/analytics│                │
│  └─────────────────┘    │  /api/v2/notifications│            │
│                          │  /api/v2/admin  │                 │
│                          └─────────────────┘                 │
│  ┌─────────────────┐    ┌─────────────────┐                  │
│  │   Controllers   │    │    Services     │                  │
│  │  (8 controllers)│───▶│  (8 services)  │                  │
│  └─────────────────┘    └────────┬────────┘                  │
│                                  │                           │
│  ┌─────────────────┐    ┌────────▼────────┐                  │
│  │     Models       │    │   Utilities     │                 │
│  │  (8 Mongoose)   │    │  (logger, API   │                 │
│  │                  │    │   response,     │                 │
│  │                  │    │   validators)   │                 │
│  └────────┬─────────┘    └─────────────────┘                 │
└───────────┼──────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────┐    ┌──────────────────────┐
│   MongoDB Atlas      │    │   File System        │
│   (Primary DB)       │    │   (file-db/ fallback)│
│   8 Collections      │    │   uploads/           │
└──────────────────────┘    └──────────────────────┘
```

---

## 4. File Structure & Metrics

### Total Source Files: **103** (51 backend + 52 frontend)

### 4.1 Backend Structure (`backend/`)
```
backend/
├── server.js                    # Express app entry point (207 lines)
├── package.json                 # Backend dependencies
├── test_upload.js               # Upload testing utility
│
├── controllers/                 # V2 Request handlers (8 files)
│   ├── adminController.js
│   ├── analyticsController.js
│   ├── applicationController.js
│   ├── authController.js
│   ├── interviewController.js
│   ├── jobController.js
│   ├── notificationController.js
│   └── pipelineController.js
│
├── models/                      # Mongoose schemas (8 files)
│   ├── ActivityLog.js           # Admin activity tracking
│   ├── Application.js           # Job applications
│   ├── Interview.js             # Interview scheduling & AI questions
│   ├── Job.js                   # Job postings
│   ├── Match.js                 # AI-computed job-resume matches
│   ├── Notification.js          # In-app notifications
│   ├── Resume.js                # Parsed resume data
│   └── User.js                  # User accounts & auth
│
├── routes/
│   ├── admin.js                 # V1 admin routes
│   ├── auth.js                  # V1 auth routes
│   ├── dashboard.js             # V1 dashboard routes
│   ├── jobs.js                  # V1 job routes
│   ├── matches.js               # V1 match routes
│   ├── resumes.js               # V1 resume routes
│   └── v2/                      # V2 production routes (8 files)
│       ├── admin.js
│       ├── analytics.js
│       ├── applications.js
│       ├── auth.js
│       ├── interviews.js
│       ├── jobs.js
│       ├── notifications.js
│       └── pipeline.js
│
├── services/                    # Business logic layer (8 files)
│   ├── aiInterviewService.js    # AI-powered interview questions
│   ├── aiMatchingService.js     # AI job-resume matching (NLP)
│   ├── aiScreeningService.js    # AI resume screening
│   ├── analyticsService.js      # Dashboard analytics aggregation
│   ├── emailService.js          # Email notification service
│   ├── jobStatusService.js      # Automatic job status updates
│   ├── pipelineService.js       # Recruitment pipeline management
│   └── resumeParserService.js   # PDF/DOCX resume parsing
│
├── middleware/                   # Express middleware (6 files)
│   ├── auth.js                  # JWT authentication
│   ├── errorHandler.js          # Global error handler
│   ├── rateLimiter.js           # Rate limiting (auth, upload, API, AI)
│   ├── sanitize.js              # XSS input sanitization
│   ├── upload.js                # Multer file upload config
│   └── validate.js              # Joi request validation
│
├── utils/                       # Utility modules (5 files)
│   ├── apiResponse.js           # Standardized API response helpers
│   ├── db.js                    # MongoDB connection manager
│   ├── logger.js                # Structured request/error logging
│   ├── memoryStore.js           # File-based fallback data store
│   └── validators.js            # Joi validation schemas
│
├── file-db/                     # JSON file fallback storage
│   ├── applications.json
│   ├── jobs.json
│   ├── matches.json
│   ├── resumes.json
│   └── users.json
│
└── uploads/                     # Uploaded resume files (PDF/DOCX)
```

### 4.2 Frontend Structure (`client/src/`)
```
client/src/
├── App.js                       # Root component & route definitions
├── index.js                     # React DOM entry point
├── index.css                    # Tailwind CSS imports
│
├── api/                         # API communication layer
│   ├── axios.js                 # Axios instance, interceptors, base config
│   └── v2.js                    # V2 API service functions
│
├── contexts/
│   └── AuthContext.js           # Authentication state management
│
├── components/
│   ├── Layout/
│   │   ├── Layout.js            # Main app layout with sidebar (375 lines)
│   │   └── AuthLayout.js        # Auth pages layout
│   ├── UI/                      # Reusable UI component library
│   │   ├── Advanced.js          # Advanced UI components
│   │   ├── Alert.js             # Alert/notification component
│   │   ├── Avatar.js            # User avatar
│   │   ├── Button.js            # Button variants
│   │   ├── Card.js              # Card container
│   │   ├── Currency.js          # Currency formatter
│   │   ├── Form.js              # Form elements
│   │   ├── index.js             # UI components barrel export
│   │   ├── Layout.js            # Layout primitives
│   │   └── Progress.js          # Progress bar
│   └── __tests__/
│       └── Button.test.js       # Button component tests
│
├── pages/                       # Page components (17 directories)
│   ├── Home.js                  # Public landing page
│   ├── ComponentShowcase.js     # UI component demo page
│   ├── CurrencyDemo.js          # Currency formatting demo
│   │
│   ├── Auth/
│   │   ├── Login.js             # Login form
│   │   └── Register.js          # Registration (4 roles)
│   │
│   ├── Dashboard/
│   │   ├── Dashboard.js         # Main dashboard
│   │   └── Analytics.js         # V1 analytics charts
│   │
│   ├── Jobs/
│   │   ├── JobList.js           # Job listings (HR/Admin)
│   │   ├── JobCreate.js         # Create new job
│   │   ├── JobDetail.js         # View job details
│   │   └── JobEdit.js           # Edit existing job
│   │
│   ├── Resumes/
│   │   ├── ResumeList.js        # Resume listings
│   │   ├── ResumeUpload.js      # Upload resume (PDF/DOCX)
│   │   ├── ResumeDetail.js      # View parsed resume
│   │   ├── ResumeEdit.js        # Edit resume data
│   │   └── ResumeList_backup.js # Backup of original list
│   │
│   ├── Matches/
│   │   ├── MatchList.js         # AI match listings
│   │   ├── MatchDetail.js       # Match score breakdown
│   │   └── MatchResults.js      # Job-specific match results
│   │
│   ├── Applications/            # V2 Feature
│   │   ├── ApplicationList.js   # Application management
│   │   └── ApplicationDetail.js # Application details
│   │
│   ├── Interviews/              # V2 Feature
│   │   ├── InterviewList.js     # Interview scheduling
│   │   └── InterviewDetail.js   # Interview details & AI questions
│   │
│   ├── Pipeline/                # V2 Feature
│   │   └── PipelineBoard.js     # Kanban-style hiring pipeline
│   │
│   ├── Analytics/               # V2 Feature
│   │   └── AnalyticsV2.js       # Advanced analytics dashboard
│   │
│   ├── Admin/                   # V2 Feature
│   │   └── AdminPanel.js        # System administration
│   │
│   ├── Notifications/           # V2 Feature
│   │   └── NotificationList.js  # In-app notification center
│   │
│   ├── Profile/
│   │   └── Profile.js           # User profile management
│   │
│   ├── Settings/
│   │   └── Settings.js          # App settings
│   │
│   └── User/                    # Job seeker-specific pages
│       ├── UserDashboard.js     # User's dashboard
│       ├── ResumeUpload.js      # User resume upload
│       ├── JobList.js           # Browse available jobs
│       └── JobApply.js          # Apply to a job
│
└── utils/
    └── currency.js              # Currency formatting utility
```

---

## 5. Database Design

### Database: MongoDB Atlas
**Connection:** `mongodb+srv://...@recruiter.vsvy6cx.mongodb.net/ai-recruiter`

### 5.1 Collections (8 total)

| Collection | Model | Key Fields | Relationships |
|---|---|---|---|
| **users** | User | name, email, password (bcrypt), role, company | Referenced by all others |
| **jobs** | Job | title, company, description, requirements, skills, status, salary, deadline | Created by User |
| **resumes** | Resume | candidate info, skills, experience, education, parsed text, file path | Belongs to User |
| **applications** | Application | job, applicant, resume, status, stage, coverLetter, screeningScore | Job + User + Resume |
| **matches** | Match | job, resume, score, skillMatches, breakdown | Job + Resume |
| **interviews** | Interview | application, job, candidate, type, scheduledAt, questions, feedback | Application + Job + User |
| **notifications** | Notification | user, type, title, message, read, link | Belongs to User |
| **activitylogs** | ActivityLog | user, action, resource, details, ip | Belongs to User |

### 5.2 Fallback Storage
When MongoDB is unavailable, the system falls back to `file-db/*.json` files with a `MemoryStore` utility that persists data to disk and auto-hashes plaintext passwords.

---

## 6. API Endpoints

### 6.1 V1 Legacy Routes (`/api/`)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login (JWT) |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/jobs` | List all jobs |
| POST | `/api/jobs` | Create job |
| GET | `/api/jobs/:id` | Get job detail |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
| GET | `/api/resumes` | List resumes |
| POST | `/api/resumes` | Upload & parse resume |
| GET | `/api/resumes/:id` | Get resume detail |
| PUT | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |
| GET | `/api/matches` | List matches |
| POST | `/api/matches/run/:jobId` | Run AI matching |
| GET | `/api/matches/:id` | Get match detail |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/admin/*` | Admin management |
| GET | `/api/health` | Health check |

### 6.2 V2 Production Routes (`/api/v2/`)

| Method | Endpoint | Purpose |
|---|---|---|
| **Auth** | | |
| POST | `/api/v2/auth/register` | Register with validation |
| POST | `/api/v2/auth/login` | Login with rate limiting |
| GET | `/api/v2/auth/me` | Get authenticated user |
| **Jobs** | | |
| GET | `/api/v2/jobs` | List jobs (filtered, paginated) |
| POST | `/api/v2/jobs` | Create job (HR/Admin) |
| GET | `/api/v2/jobs/:id` | Get job details |
| PUT | `/api/v2/jobs/:id` | Update job |
| DELETE | `/api/v2/jobs/:id` | Delete job |
| **Applications** | | |
| GET | `/api/v2/applications` | List applications |
| POST | `/api/v2/applications` | Create application |
| GET | `/api/v2/applications/:id` | Application detail |
| PATCH | `/api/v2/applications/:id/status` | Update application status |
| POST | `/api/v2/applications/:id/screen` | AI screening |
| **Interviews** | | |
| GET | `/api/v2/interviews` | List interviews |
| POST | `/api/v2/interviews` | Schedule interview |
| GET | `/api/v2/interviews/:id` | Interview detail |
| PATCH | `/api/v2/interviews/:id` | Update interview |
| POST | `/api/v2/interviews/:id/questions` | Generate AI questions |
| POST | `/api/v2/interviews/:id/evaluate` | AI evaluation |
| **Pipeline** | | |
| GET | `/api/v2/pipeline/:jobId` | Get hiring pipeline for job |
| PATCH | `/api/v2/pipeline/:appId/move` | Move candidate between stages |
| **Analytics** | | |
| GET | `/api/v2/analytics/overview` | Overview dashboard metrics |
| GET | `/api/v2/analytics/pipeline` | Pipeline analytics |
| GET | `/api/v2/analytics/hiring` | Hiring metrics |
| **Notifications** | | |
| GET | `/api/v2/notifications` | List notifications |
| PATCH | `/api/v2/notifications/:id/read` | Mark as read |
| PATCH | `/api/v2/notifications/read-all` | Mark all as read |
| **Admin** | | |
| GET | `/api/v2/admin/users` | List all users |
| GET | `/api/v2/admin/stats` | System statistics |
| GET | `/api/v2/admin/activity-logs` | Activity logs |
| PATCH | `/api/v2/admin/users/:id` | Update user |
| DELETE | `/api/v2/admin/users/:id` | Delete user |

---

## 7. Authentication & Authorization

### 7.1 Authentication Flow
1. User registers with name, email, password, role, (optional company)
2. Password hashed with bcryptjs (10 salt rounds)
3. JWT token issued on login (expires in 7 days)
4. Token stored in `localStorage` on frontend
5. Axios interceptor auto-attaches `Authorization: Bearer <token>` header
6. Backend `auth` middleware verifies JWT on protected routes

### 7.2 Role-Based Access Control

| Role | Code | Access Level |
|---|---|---|
| **Job Seeker** | `user` | Browse jobs, upload resume, apply, view interviews, notifications |
| **Recruiter** | `recruiter` | Jobs, applications, interviews, pipeline, resumes, matches, analytics |
| **HR Professional** | `hr` | Full access to all recruitment features |
| **Administrator** | `admin` | Full access + Admin Panel (user management, system stats, logs) |

### 7.3 Navigation (Role-Based Sidebar)
- **user:** Dashboard, Browse Jobs, My Resumes, Applications, Interviews, Notifications
- **recruiter:** Dashboard, Jobs, Applications, Interviews, Pipeline, Resumes, Matches, Analytics, Notifications
- **hr/admin:** All of the above + Settings; admin additionally gets Admin Panel

---

## 8. AI-Powered Features

### 8.1 Resume Parser (`resumeParserService.js`)
- Parses uploaded PDF files (using `pdf-parse`) and DOCX files (using `mammoth`)
- Extracts: skills, experience, education, contact info, summary
- NLP-based keyword extraction using the `natural` library

### 8.2 AI Matching (`aiMatchingService.js`)
- Compares job requirements against parsed resume data
- Uses TF-IDF and cosine similarity (via `natural` library)
- Scores: skills match, experience match, education match, overall match
- Returns percentage score with detailed breakdown

### 8.3 AI Screening (`aiScreeningService.js`)
- Automated initial screening of applications
- Scores candidates based on resume-job fit
- Provides pass/fail recommendation with reasoning

### 8.4 AI Interview (`aiInterviewService.js`)
- Generates interview questions based on job requirements and candidate profile
- Supports different question types (technical, behavioral, situational)
- AI-powered response evaluation and scoring

### 8.5 Job Status Service (`jobStatusService.js`)
- Automatic job status lifecycle management
- Runs on an hourly scheduler (via `setInterval`)
- Updates jobs from active → closed based on deadlines

### 8.6 Pipeline Service (`pipelineService.js`)
- Manages hiring pipeline stages: `applied → screening → shortlisted → interview → evaluation → offer → hired/rejected`
- Aggregation queries for pipeline visualization
- Stage transition tracking

### 8.7 Analytics Service (`analyticsService.js`)
- Aggregates hiring metrics: total applications, time-to-hire, conversion rates
- Pipeline stage distribution
- Trend analysis over time

---

## 9. Security Measures

| Layer | Implementation |
|---|---|
| **Transport** | HTTPS in production |
| **Headers** | Helmet.js (CSP, HSTS, X-Frame, etc.) |
| **Authentication** | JWT with 7-day expiry |
| **Password** | bcryptjs with 10 salt rounds |
| **Rate Limiting** | Global: 1000/15min (dev), 100/15min (prod); Auth: 100/15min (dev), 15/15min (prod) |
| **Input Sanitization** | XSS library on all inputs |
| **Validation** | Joi schemas + express-validator |
| **CORS** | Restrict origins per environment |
| **File Upload** | 10MB limit, file type restriction (PDF/DOCX), Multer |
| **Error Handling** | Global error handler, no stack traces in production |

---

## 10. Frontend Route Map

| Route | Page Component | Auth Required |
|---|---|---|
| `/` | Home (Landing page) | No |
| `/login` | Login | No (redirects if auth'd) |
| `/register` | Register | No (redirects if auth'd) |
| `/showcase` | ComponentShowcase | No |
| `/app/dashboard` | Dashboard | Yes |
| `/app/analytics` | Analytics (V1) | Yes |
| `/app/jobs` | JobList | Yes |
| `/app/jobs/new` | JobCreate | Yes |
| `/app/jobs/:id` | JobDetail | Yes |
| `/app/jobs/:id/edit` | JobEdit | Yes |
| `/app/resumes` | ResumeList | Yes |
| `/app/resumes/upload` | ResumeUpload | Yes |
| `/app/resumes/:id` | ResumeDetail | Yes |
| `/app/resumes/:id/edit` | ResumeEdit | Yes |
| `/app/matches` | MatchList | Yes |
| `/app/matches/:id` | MatchDetail | Yes |
| `/app/jobs/:jobId/matches` | MatchResults | Yes |
| `/app/applications` | ApplicationList | Yes |
| `/app/applications/:id` | ApplicationDetail | Yes |
| `/app/interviews` | InterviewList | Yes |
| `/app/interviews/:id` | InterviewDetail | Yes |
| `/app/pipeline` | PipelineBoard | Yes |
| `/app/analytics-v2` | AnalyticsV2 | Yes |
| `/app/admin` | AdminPanel | Yes |
| `/app/notifications` | NotificationList | Yes |
| `/app/profile` | Profile | Yes |
| `/app/settings` | Settings | Yes |
| `/app/user/dashboard` | UserDashboard | Yes |
| `/app/user/resumes/upload` | UserResumeUpload | Yes |
| `/app/user/jobs` | UserJobList | Yes |
| `/app/user/apply/:jobId` | UserJobApply | Yes |

---

## 11. Deployment Configuration

### 11.1 Vercel (Production)
- **Build:** `npm install --prefix backend && npm install --prefix client && npm run build --prefix client`
- **Routes:** `/api/*` → `backend/server.js`, `/*` → `client/build/`
- **Environment:** `NODE_ENV=production`

### 11.2 Development
```bash
# Install all dependencies
npm run install-all

# Run both backend + frontend (concurrently)
npm run dev-full

# Backend only: http://localhost:5001
npm run backend

# Frontend only: http://localhost:3000
npm run client
```

### 11.3 Environment Variables (`.env`)
| Variable | Description | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | Token expiry duration | `7d` |
| `PORT` | Backend server port | `5001` |
| `NODE_ENV` | Environment mode | `development` |
| `MAX_FILE_SIZE` | Upload file size limit (bytes) | `10485760` (10MB) |
| `UPLOAD_PATH` | Upload directory path | `./uploads` |

---

## 12. Key Design Patterns

| Pattern | Usage |
|---|---|
| **MVC Architecture** | V2 routes → Controllers → Services → Models |
| **Middleware Pipeline** | Security → Rate Limit → CORS → Parse → Sanitize → Auth → Route |
| **Repository Pattern** | MemoryStore with file-db fallback when MongoDB unavailable |
| **Interceptor Pattern** | Axios request/response interceptors for auth & error handling |
| **Context + Provider** | React Context API for global auth state (`AuthContext`) |
| **Protected Routes** | `ProtectedRoute` component wrapping authenticated pages |
| **Barrel Exports** | `components/UI/index.js` re-exports all UI components |
| **Role-Based UI** | `Layout.js` renders different navigation per user role |
| **Dual API Versioning** | V1 (legacy simple routes) + V2 (production MVC) side by side |
| **Scheduler Pattern** | Hourly `setInterval` for automatic job status updates |

---

## 13. Testing

| Type | File | Coverage |
|---|---|---|
| API Integration Tests | `tests/api.test.js` | Auth, Jobs, Resumes, Matches endpoints |
| Component Unit Tests | `client/src/components/__tests__/Button.test.js` | Button component |
| Upload Tests | `backend/test_upload.js` | File upload utility |

---

## 14. Known Considerations

1. **Rate Limiting** — Development mode uses generous limits (1000 req/15min) to avoid throttling during testing; production uses strict limits.
2. **Fallback Storage** — When MongoDB is unreachable, the system degrades gracefully to JSON file-based storage (`file-db/`). Data persists across restarts.
3. **AI Services** — Use the `natural` NLP library (rule-based, not LLM). No external AI API keys required.
4. **File Uploads** — Resume PDFs and DOCX files stored locally in `backend/uploads/`. Not suitable for serverless without external storage (e.g., S3).
5. **Dual API Versions** — V1 routes remain for backward compatibility. V2 routes follow strict MVC with validation, sanitization, and standardized responses.

---

## 15. Dependency Summary

| Category | Count |
|---|---|
| Backend production dependencies | 16 |
| Backend dev dependencies | 1 (nodemon) |
| Frontend dependencies | 18 |
| Root dev dependencies | 1 (concurrently) |
| **Total unique packages** | **~36** |

---

*Generated on February 27, 2026*

# AI-Recruiter Project Structure

## 📁 Folder Organization

```
AI-Recruiter/
├── backend/              # Backend API (Node.js/Express)
│   ├── server.js         # Main server file
│   ├── routes/           # API routes (auth, jobs, resumes, etc.)
│   ├── models/           # Database models
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── file-db/          # File-based database (JSON files)
│   ├── uploads/          # File upload directory
│   ├── package.json      # Backend dependencies
│   └── node_modules/     # Backend dependencies
│
├── client/               # Frontend App (React) - Standard naming
│   ├── src/              # Source code
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   └── utils/        # Utility functions
│   ├── public/           # Public assets
│   ├── build/            # Production build
│   ├── package.json      # Frontend dependencies
│   └── node_modules/     # Frontend dependencies
│
├── vercel.json           # Vercel deployment config
├── package.json          # Root package.json (convenience scripts)
├── .env.production       # Production environment variables
└── README.md             # Project documentation
```

## 🚀 Quick Start Commands

### Run Backend Only
```bash
cd backend && npm start
```
Backend runs on: http://localhost:5001

### Run Frontend Only
```bash
cd client && npm start
```
Frontend runs on: http://localhost:3000

### Run Both (Full Stack Development)
```bash
# Option 1: Use concurrently (runs both in parallel)
npm run dev-full

# Option 2: Manual - run in two separate terminals
# Terminal 1:
cd backend && npm start
# Terminal 2:
cd client && npm start
```

### Install All Dependencies
```bash
npm run install-all
```

### Build Frontend for Production
```bash
npm run build
```

## 🔧 Configuration Files

- **Backend**: `backend/package.json`
- **Frontend**: `client/package.json`
- **Vercel**: `vercel.json` (configured for new structure)
- **Environment**: `.env.production`

## 📦 Deployment

### Full Stack (Vercel)
```bash
vercel --prod
```

### Backend Only (Vercel)
```bash
vercel --prod --config vercel-backend.json
```

## 📝 Important Notes

- **Backend**: Port 5001 (development), uses file-based database by default
- **Frontend**: Port 3000 (development), React app
- **API URL**: `http://localhost:5001/api`
- **No MongoDB required** - works with file-based database

## 🔐 Default Login Credentials

- **Admin**: admin@example.com / password123
- **HR User**: test123@example.com / password123

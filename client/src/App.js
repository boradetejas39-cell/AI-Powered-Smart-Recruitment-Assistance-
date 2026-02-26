import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/UI';

// Layout Components
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';

// Dashboard Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Dashboard/Analytics';
import CurrencyDemo from './pages/CurrencyDemo';

// Job Pages
import JobList from './pages/Jobs/JobList';
import JobCreate from './pages/Jobs/JobCreate';
import JobEdit from './pages/Jobs/JobEdit';
import JobDetail from './pages/Jobs/JobDetail';

// Resume Pages
import ResumeList from './pages/Resumes/ResumeList';
import ResumeUpload from './pages/Resumes/ResumeUpload';
import ResumeDetail from './pages/Resumes/ResumeDetail';
import ResumeEdit from './pages/Resumes/ResumeEdit';

// Match Pages
import MatchList from './pages/Matches/MatchList';
import MatchDetail from './pages/Matches/MatchDetail';
import MatchResults from './pages/Matches/MatchResults';

// Profile Pages
import Profile from './pages/Profile/Profile';

// User Pages
import UserDashboard from './pages/User/UserDashboard';
import UserResumeUpload from './pages/User/ResumeUpload';
import UserJobList from './pages/User/JobList';
import UserJobApply from './pages/User/JobApply';

// Settings Pages
import Settings from './pages/Settings/Settings';

// Component Showcase
import ComponentShowcase from './pages/ComponentShowcase';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log('🔒 ProtectedRoute check:', { isAuthenticated, loading });

  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted');
  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/app/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/showcase" element={<ComponentShowcase />} />
            <Route path="/login" element={<PublicRoute><AuthLayout><Login /></AuthLayout></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><AuthLayout><Register /></AuthLayout></PublicRoute>} />

            {/* Protected Routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Dashboard */}
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="currency-demo" element={<CurrencyDemo />} />

              {/* Jobs */}
              <Route path="jobs" element={<JobList />} />
              <Route path="jobs/new" element={<JobCreate />} />
              <Route path="jobs/:id" element={<JobDetail />} />
              <Route path="jobs/:id/edit" element={<JobEdit />} />

              {/* Resumes */}
              <Route path="resumes" element={<ResumeList />} />
              <Route path="resumes/upload" element={<ResumeUpload />} />
              <Route path="resumes/:id" element={<ResumeDetail />} />
              <Route path="resumes/:id/edit" element={<ResumeEdit />} />

              {/* Matches */}
              <Route path="matches" element={<MatchList />} />
              <Route path="matches/:id" element={<MatchDetail />} />
              <Route path="jobs/:jobId/matches" element={<MatchResults />} />

              {/* Profile & Settings */}
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />

              {/* User Routes */}
              <Route path="user/dashboard" element={<UserDashboard />} />
              <Route path="user/resumes/upload" element={<UserResumeUpload />} />
              <Route path="user/jobs" element={<UserJobList />} />
              <Route path="user/apply/:jobId" element={<UserJobApply />} />
            </Route>

            {/* 404 Fallback - More specific */}
            <Route path="/app/*" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

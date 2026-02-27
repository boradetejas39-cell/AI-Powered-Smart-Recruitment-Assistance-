import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChevronDownIcon,
  DocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  FunnelIcon,
  ShieldCheckIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';

const Layout = () => {
  const { user, logout, isAdmin, isHR } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isRecruiter = user?.role === 'recruiter';
  const isUser = user?.role === 'user';

  // Role-based navigation
  const getNavigation = () => {
    // Job Seeker (user role) - simplified view
    if (isUser) {
      return [
        { name: 'Dashboard', href: '/app/user/dashboard', icon: HomeIcon },
        { name: 'Browse Jobs', href: '/app/user/jobs', icon: BriefcaseIcon },
        { name: 'My Resumes', href: '/app/user/resumes/upload', icon: DocumentTextIcon },
        { name: 'Applications', href: '/app/applications', icon: DocumentCheckIcon },
        { name: 'Interviews', href: '/app/interviews', icon: ChatBubbleLeftRightIcon },
        { name: 'Notifications', href: '/app/notifications', icon: BellIcon },
      ];
    }

    // Recruiter - pipeline focused
    if (isRecruiter) {
      return [
        { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
        { name: 'Jobs', href: '/app/jobs', icon: BriefcaseIcon },
        { name: 'Applications', href: '/app/applications', icon: DocumentCheckIcon },
        { name: 'Interviews', href: '/app/interviews', icon: ChatBubbleLeftRightIcon },
        { name: 'Pipeline', href: '/app/pipeline', icon: FunnelIcon },
        { name: 'Resumes', href: '/app/resumes', icon: DocumentTextIcon },
        { name: 'Matches', href: '/app/matches', icon: UserGroupIcon },
        { name: 'Analytics', href: '/app/analytics-v2', icon: PresentationChartLineIcon },
        { name: 'Notifications', href: '/app/notifications', icon: BellIcon },
      ];
    }

    // HR / Admin - full access
    const items = [
      { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
      { name: 'Analytics', href: '/app/analytics', icon: ChartBarIcon },
      { name: 'Jobs', href: '/app/jobs', icon: BriefcaseIcon },
      { name: 'Resumes', href: '/app/resumes', icon: DocumentTextIcon },
      { name: 'Matches', href: '/app/matches', icon: UserGroupIcon },
      { name: 'Applications', href: '/app/applications', icon: DocumentCheckIcon },
      { name: 'Interviews', href: '/app/interviews', icon: ChatBubbleLeftRightIcon },
      { name: 'Pipeline', href: '/app/pipeline', icon: FunnelIcon },
      { name: 'Analytics V2', href: '/app/analytics-v2', icon: PresentationChartLineIcon },
      { name: 'Notifications', href: '/app/notifications', icon: BellIcon },
    ];
    if (isAdmin) {
      items.push({ name: 'Admin Panel', href: '/app/admin', icon: ShieldCheckIcon });
    }
    return items;
  };

  const navigation = getNavigation();

  const userNavigation = [
    { name: 'Your Profile', href: '/app/profile', icon: UserIcon },
    { name: 'Settings', href: '/app/settings', icon: CogIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)} />

        <div className={`relative flex w-64 flex-1 flex-col bg-gradient-to-b from-slate-900 to-slate-800 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-6 border-b border-slate-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-white">AI Recruiter</h1>
                <p className="text-xs text-gray-400">Recruitment Platform</p>
              </div>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all ${active
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-slate-700'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-700 p-4 space-y-4">
            <div className="flex items-center px-2">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="space-y-1">
              {userNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center px-4 py-2 text-sm text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-300 rounded-lg hover:bg-red-600/20 hover:text-red-300 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:bg-gradient-to-b lg:from-slate-900 lg:to-slate-800 lg:border-r lg:border-slate-700">
        <div className="flex items-center px-6 py-6 border-b border-slate-700">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-white">AI Recruiter</h1>
            <p className="text-xs text-gray-400">Smart Platform</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-all ${active
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                  : 'text-gray-300 hover:bg-slate-700'
                  }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-700 p-4 space-y-4">
          <div className="flex items-center px-2">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Mobile navigation options */}
          <div className="space-y-1">
            <Link
              to="/app/profile"
              className="flex items-center px-2 py-2 text-sm text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <UserIcon className="h-4 w-4 mr-3" />
              Your Profile
            </Link>
            <Link
              to="/app/settings"
              className="flex items-center px-2 py-2 text-sm text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <CogIcon className="h-4 w-4 mr-3" />
              Settings
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="flex items-center w-full px-2 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <button
              type="button"
              className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <Link to="/app/notifications" className="text-gray-400 hover:text-gray-600 relative transition-colors group">
                <BellIcon className="h-6 w-6" />
              </Link>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200" />

              {/* User profile dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="h-9 w-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400 hidden sm:block" />
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/app/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      to="/app/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <CogIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-50">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

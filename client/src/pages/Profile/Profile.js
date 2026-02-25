import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

const Profile = () => {
  const { user } = useAuth();
  const isHR = user?.role === 'hr' || user?.role === 'admin';
  const isRegularUser = user?.role === 'user';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">
          {isHR ? 'Manage your HR account settings' : 
           isRegularUser ? 'Manage your job seeker profile' : 
           'Manage your account settings'}
        </p>
      </div>
      
      <Card>
        <CardBody>
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                <div className="text-gray-600 font-bold text-2xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
              {user?.company && (
                <p className="text-sm text-gray-500">Company: {user.company}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="input mt-1 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input mt-1 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={user?.phone || ''}
                  disabled
                  className="input mt-1 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role || ''}
                  disabled
                  className="input mt-1 bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Role-based Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isHR && (
                <>
                  <Link to="/app/dashboard" className="btn-outline flex items-center">
                    <BriefcaseIcon className="h-4 w-4 mr-2" />
                    HR Dashboard
                  </Link>
                  <Link to="/app/resumes" className="btn-outline flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Manage Resumes
                  </Link>
                </>
              )}
              
              {isRegularUser && (
                <>
                  <Link to="/app/user/dashboard" className="btn-outline flex items-center">
                    <BriefcaseIcon className="h-4 w-4 mr-2" />
                    My Dashboard
                  </Link>
                  <Link to="/app/user/resumes/upload" className="btn-outline flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Upload Resume
                  </Link>
                </>
              )}
              
              <Link to="/app/settings" className="btn-outline flex items-center">
                <CogIcon className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;

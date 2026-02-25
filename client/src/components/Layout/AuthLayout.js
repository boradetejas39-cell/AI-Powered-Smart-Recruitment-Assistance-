import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-32 right-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home link */}
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6">
            <SparklesIcon className="h-5 w-5 mr-2" />
            Back to Home
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-600/50">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            AI Recruiter
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Smart Recruitment Platform
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 AI Recruiter. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/UI';
import { Button } from '../../components/UI';
import { SparklesIcon, UserIcon, EnvelopeIcon, LockClosedIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Google "G" logo SVG (official colors)
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// Role pill options
const roleOptions = [
  { value: 'user', label: 'Job Seeker', icon: '🔍', description: 'Find your dream job' },
  { value: 'recruiter', label: 'Recruiter', icon: '🎯', description: 'Hire top talent' },
  { value: 'hr', label: 'HR Pro', icon: '👔', description: 'Manage hiring pipeline' },
  { value: 'admin', label: 'Admin', icon: '⚙️', description: 'System administrator' }
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    company: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Google sign-up via useGoogleLogin hook (custom button)
  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setErrors({});
      try {
        const result = await googleLogin(tokenResponse.access_token, formData.role, 'access_token');
        if (result.success) {
          toast.success('Account created with Google!');
          navigate('/app/dashboard');
        } else {
          setErrors({ general: result.error });
        }
      } catch (error) {
        setErrors({ general: 'Google sign-up failed' });
        toast.error('Google sign-up failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error('Google sign-up failed');
      setErrors({ general: 'Google sign-up was cancelled or failed' });
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if ((formData.role === 'hr' || formData.role === 'recruiter') && !formData.company.trim()) {
      newErrors.company = 'Company name is required for HR/Recruiter';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { confirmPassword, agreeTerms, ...registrationData } = formData;
      const result = await register(registrationData);
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/app/dashboard');
      } else {
        if (result.error) setErrors({ general: result.error });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <SparklesIcon className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          {/* Error message */}
          {errors.general && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          {/* Role Selection — Pill Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              I want to join as
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: opt.value }))}
                  className={`relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 text-left transition-all duration-200 ${formData.role === opt.value
                    ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  <div>
                    <div className={`text-sm font-semibold ${formData.role === opt.value ? 'text-blue-700' : 'text-gray-700'}`}>
                      {opt.label}
                    </div>
                    <div className={`text-[10px] leading-tight ${formData.role === opt.value ? 'text-blue-500' : 'text-gray-400'}`}>
                      {opt.description}
                    </div>
                  </div>
                  {formData.role === opt.value && (
                    <div className="absolute top-1.5 right-1.5">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={() => handleGoogleSignup()}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {googleLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              <GoogleIcon />
            )}
            <span>{googleLoading ? 'Creating account...' : 'Sign up with Google'}</span>
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">
            Uses the role selected above
          </p>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-4 text-gray-400 font-medium">or sign up with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="pl-11"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-11"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>
            </div>

            {(formData.role === 'hr' || formData.role === 'recruiter') && (
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    required
                    className="pl-11"
                    placeholder="Acme Inc."
                    value={formData.company}
                    onChange={handleChange}
                    error={errors.company}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="pl-11"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="pl-11"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start pt-1">
              <input
                id="agree-terms"
                name="agreeTerms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5 transition"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="agree-terms" className="ml-2.5 block text-sm text-gray-600 leading-snug">
                I agree to the{' '}
                <button type="button" className="text-blue-600 hover:text-blue-500 underline font-medium">Terms</button>
                {' '}and{' '}
                <button type="button" className="text-blue-600 hover:text-blue-500 underline font-medium">Privacy Policy</button>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-xs text-red-500 -mt-1">{errors.agreeTerms}</p>
            )}

            <Button
              type="submit"
              className="w-full py-3 text-base font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
              loading={loading}
              disabled={loading || googleLoading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Protected by reCAPTCHA and subject to our{' '}
          <button type="button" className="text-gray-500 hover:text-gray-700 underline">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input, Select } from '../../components/UI';
import { Button } from '../../components/UI';
import { SparklesIcon, UserIcon, EnvelopeIcon, LockClosedIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'hr',
    company: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    console.log('🔍 Validating form...');

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'hr' && !formData.company.trim()) {
      newErrors.company = 'Company name is required for HR role';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service';
    }

    console.log('🔍 Validation errors found:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔍 Registration form submitted');
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      console.log('Errors:', errors);
      return;
    }

    console.log('✅ Form validation passed');
    setLoading(true);

    try {
      const { confirmPassword, agreeTerms, ...registrationData } = formData;
      console.log('📤 Sending registration data:', registrationData);
      
      const result = await register(registrationData);
      console.log('📥 Registration response:', result);
      
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/app/dashboard');
      } else {
        // Set error from backend response
        if (result.error) {
          setErrors({ general: result.error });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="pl-10"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
                options={[
                  { value: 'hr', label: 'HR Professional' },
                  { value: 'admin', label: 'Administrator' }
                ]}
              />
            </div>

            {formData.role === 'hr' && (
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    required={formData.role === 'hr'}
                    className="pl-10"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleChange}
                    error={errors.company}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="pl-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="pl-10"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agreeTerms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <button type="button" className="text-blue-600 hover:text-blue-500 underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-blue-600 hover:text-blue-500 underline">
                Privacy Policy
              </button>
            </label>
          </div>
          
          {errors.agreeTerms && (
            <div className="mt-2">
              <p className="text-sm text-red-600">{errors.agreeTerms}</p>
            </div>
          )}

          <div>
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

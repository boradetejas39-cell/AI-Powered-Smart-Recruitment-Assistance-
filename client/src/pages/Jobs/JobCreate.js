import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { SalaryRangeInput } from '../../components/UI/Currency';

const JobCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [salary, setSalary] = useState({
    min: '',
    max: '',
    currency: 'INR' // Default to INR for Indian users
  });

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const experienceType = watch('experienceType', 'years');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const onSubmit = async (data) => {
    console.log('🔍 Job creation form submitted');
    console.log('Form data:', data);
    console.log('Skills:', skills);
    console.log('Salary:', salary);

    if (skills.length === 0) {
      console.log('❌ No skills provided');
      toast.error('Please add at least one required skill');
      return;
    }

    const jobData = {
      ...data,
      requiredSkills: skills,
      experienceRequired: {
        min: parseInt(data.minExperience) || 0,
        max: parseInt(data.maxExperience) || 0,
        type: experienceType
      },
      salary: {
        min: salary.min ? parseFloat(salary.min) : null,
        max: salary.max ? parseFloat(salary.max) : null,
        currency: salary.currency
      }
    };

    // Remove temporary fields
    delete jobData.minExperience;
    delete jobData.maxExperience;
    delete jobData.experienceType;

    console.log('📤 Final job data:', jobData);

    // Debug validation requirements
    console.log('🔍 Validation Check:');
    console.log('Title length:', jobData.title?.length, '(min: 2, max: 200)');
    console.log('Description length:', jobData.description?.length, '(min: 10, max: 5000)');
    console.log('Location length:', jobData.location?.length, '(min: 2, max: 200)');
    console.log('RequiredSkills array:', jobData.requiredSkills?.length, '(min: 1)');
    console.log('Skills:', jobData.requiredSkills);
    console.log('ExperienceRequired:', jobData.experienceRequired);
    console.log('Salary:', jobData.salary);

    // Check for missing required fields
    const requiredFields = ['title', 'description', 'location', 'requiredSkills'];
    const missingFields = requiredFields.filter(field => !jobData[field]);
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
    }

    // Check skills validation
    if (jobData.requiredSkills && jobData.requiredSkills.length > 0) {
      const invalidSkills = jobData.requiredSkills.filter(skill => skill.length < 2);
      if (invalidSkills.length > 0) {
        console.log('❌ Skills too short:', invalidSkills);
      }
    }

    try {
      setLoading(true);
      console.log('📤 Sending job creation request...');
      console.log('Request URL:', api.defaults.baseURL + '/jobs');
      console.log('Request method:', 'POST');

      // Make request with proper headers
      const response = await api.post('/jobs', jobData);
      console.log('📥 Job creation response:', response.data);

      toast.success('Job created successfully!');
      navigate(`/app/jobs/${response.data.data.job._id}`);
    } catch (error) {
      console.error('❌ Job creation error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error config:', error.config);

      // Detailed error information
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
        error.response.data.errors.forEach((err, index) => {
          console.error(`  ${index + 1}. Field: ${err.path}, Value: "${err.value}", Message: ${err.msg}`);
        });
      }

      const errorMessage = error.response?.data?.message || 'Failed to create job';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate('/app/jobs')}
          className="text-gray-400 hover:text-gray-600 mr-4"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Job</h1>
          <p className="text-gray-600">Post a new job opening</p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card-body">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title *
                </label>
                <input
                  id="title"
                  type="text"
                  className={`input mt-1 ${errors.title ? 'input-error' : ''}`}
                  placeholder="e.g. Senior Software Engineer"
                  {...register('title', { required: 'Job title is required' })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Job Description *
                </label>
                <textarea
                  id="description"
                  rows={6}
                  className={`input mt-1 ${errors.description ? 'input-error' : ''}`}
                  placeholder="Provide a detailed description of the role, responsibilities, and what you're looking for in a candidate..."
                  {...register('description', {
                    required: 'Job description is required',
                    minLength: {
                      value: 10,
                      message: 'Description must be at least 10 characters'
                    }
                  })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <input
                    id="location"
                    type="text"
                    className={`input mt-1 ${errors.location ? 'input-error' : ''}`}
                    placeholder="e.g. San Francisco, CA or Remote"
                    {...register('location', { required: 'Location is required' })}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-error-600">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    id="department"
                    type="text"
                    className="input mt-1"
                    placeholder="e.g. Engineering"
                    {...register('department')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                    Job Type
                  </label>
                  <select
                    id="jobType"
                    className="input mt-1"
                    {...register('jobType')}
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    id="priority"
                    className="input mt-1"
                    {...register('priority')}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Experience Requirements */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Experience Requirements</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="minExperience" className="block text-sm font-medium text-gray-700">
                    Minimum Experience
                  </label>
                  <input
                    id="minExperience"
                    type="number"
                    min="0"
                    className="input mt-1"
                    placeholder="0"
                    {...register('minExperience')}
                  />
                </div>

                <div>
                  <label htmlFor="maxExperience" className="block text-sm font-medium text-gray-700">
                    Maximum Experience
                  </label>
                  <input
                    id="maxExperience"
                    type="number"
                    min="0"
                    className="input mt-1"
                    placeholder="10"
                    {...register('maxExperience')}
                  />
                </div>

                <div>
                  <label htmlFor="experienceType" className="block text-sm font-medium text-gray-700">
                    Experience Type
                  </label>
                  <select
                    id="experienceType"
                    className="input mt-1"
                    {...register('experienceType')}
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Required Skills</h3>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Add Skills *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input flex-1"
                    placeholder="e.g. JavaScript, React, Node.js"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-outline"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {skills.length === 0 && (
                <p className="text-sm text-gray-500">Add at least one required skill</p>
              )}
            </div>

            {/* Salary Range (Optional) */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Salary Range (Optional)</h3>

              <SalaryRangeInput
                salary={salary}
                onChange={setSalary}
                disabled={loading}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="card-footer">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/app/jobs')}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Job'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreate;

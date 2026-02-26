import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { SalaryRangeDisplay } from '../../components/UI/Currency';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.data.job);
      setError(null);
    } catch (error) {
      console.error('Error fetching job:', error);
      setError(error.response?.data?.message || 'Failed to fetch job details');
      toast.error('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted successfully');
      navigate('/app/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'inactive':
        return 'bg-warning-100 text-warning-800';
      case 'closed':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-error-100 text-error-800';
      case 'high':
        return 'bg-warning-100 text-warning-800';
      case 'medium':
        return 'bg-primary-100 text-primary-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link
            to="/app/jobs"
            className="text-gray-400 hover:text-gray-600 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
            <p className="text-gray-600">Loading job information...</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link
            to="/app/jobs"
            className="text-gray-400 hover:text-gray-600 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
            <p className="text-gray-600">Error loading job information</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-center py-12">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Job not found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {error || 'The job you are looking for does not exist.'}
              </p>
              <div className="mt-6">
                <Link
                  to="/app/jobs"
                  className="btn-primary"
                >
                  Back to Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/app/jobs"
            className="text-gray-400 hover:text-gray-600 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600">Job details and information</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/app/jobs/${id}/edit`}
            className="btn-outline"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="btn-outline text-error-600 hover:text-error-700 hover:border-error-300"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Information */}
          <div className="card">
            <div className="card-body">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="card">
            <div className="card-body">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Requirements</h2>
              
              {/* Required Skills */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Requirements */}
              {job.experienceRequired && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Experience Required</h3>
                  <div className="text-sm text-gray-600">
                    {job.experienceRequired.min === job.experienceRequired.max ? (
                      `${job.experienceRequired.min} ${job.experienceRequired.type}`
                    ) : (
                      `${job.experienceRequired.min} - ${job.experienceRequired.max} ${job.experienceRequired.type}`
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Metadata */}
          <div className="card">
            <div className="card-body">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Information</h2>
              
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{job.location}</p>
                  </div>
                </div>

                {/* Job Type */}
                {job.jobType && (
                  <div className="flex items-start">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Job Type</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {job.jobType.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Department */}
                {job.department && (
                  <div className="flex items-start">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Department</p>
                      <p className="text-sm text-gray-600">{job.department}</p>
                    </div>
                  </div>
                )}

                {/* Salary */}
                {job.salary && (job.salary.min || job.salary.max) && (
                  <div className="flex items-start">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Salary Range</p>
                      <SalaryRangeDisplay 
                        salary={job.salary} 
                        showDecimals={false}
                        className="text-sm text-gray-600"
                      />
                    </div>
                  </div>
                )}

                {/* Status and Priority */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <span className={`badge ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Priority</span>
                    <span className={`badge ${getPriorityColor(job.priority)}`}>
                      {job.priority}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-start pt-4 border-t border-gray-200">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Posted</p>
                    <p className="text-sm text-gray-600">{formatDate(job.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posted By */}
          {job.createdBy && (
            <div className="card">
              <div className="card-body">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Posted By</h2>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {job.createdBy.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {job.createdBy.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

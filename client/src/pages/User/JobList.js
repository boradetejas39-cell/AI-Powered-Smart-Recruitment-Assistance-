import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    salary: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add filters to params
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/jobs?${params.toString()}`);
      const jobsData = response?.data?.data?.jobs || [];
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/app/user/dashboard" className="btn-outline mb-4">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
        <p className="text-gray-600">Browse and apply for job opportunities</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardBody>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or keywords..."
                  className="input pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City or State"
                    className="input"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
                  </label>
                  <select
                    className="input"
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50000-80000"
                    className="input"
                    value={filters.salary}
                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                  />
                </div>
              </div>
            )}
          </form>
        </CardBody>
      </Card>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            {jobs.length} Job{jobs.length !== 1 ? 's' : ''} Available
          </h2>
        </CardHeader>
        <CardBody>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {job.jobType}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Posted: {formatDate(job.createdAt)}
                        </div>
                      </div>

                      {/* Skills */}
                      {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
                          <div className="flex flex-wrap gap-1">
                            {job.requiredSkills.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.requiredSkills.length > 5 && (
                              <span className="text-xs text-gray-500">
                                +{job.requiredSkills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Link to={`/app/user/apply/${job._id}`} className="btn-primary">
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default JobList;

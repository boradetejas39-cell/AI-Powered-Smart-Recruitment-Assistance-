import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    skills: '',
    minExperience: '',
    maxExperience: '',
    location: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'inactive':
        return 'bg-warning-100 text-warning-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.limit,
        ...filters
      };
      
      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.get('/resumes', { params });
      console.log('📋 Resume API response:', response.data);
      console.log('📄 Resumes data:', response.data.data.resumes);
      console.log('📊 First resume details:', response.data.data.resumes[0]);
      setResumes(response.data.data.resumes);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, filters.search, filters.status, filters.minExperience, filters.maxExperience]);

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatExperience = (experience) => {
    if (!experience || experience.length === 0) return 'No experience';
    
    const totalYears = experience.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      return total + years;
    }, 0);

    return `${Math.round(totalYears * 10) / 10} years`;
  };

  const handleDeleteResume = async (resumeId, resumeName) => {
    if (window.confirm(`Are you sure you want to delete the resume for ${resumeName}? This action cannot be undone.`)) {
      try {
        const response = await api.delete(`/resumes/${resumeId}`);
        console.log('Delete response:', response.data);
        
        // Refresh the resumes list
        fetchResumes();
        
        // Show success message
        alert('Resume deleted successfully');
      } catch (error) {
        console.error('Error deleting resume:', error);
        
        // Check if the error response contains a specific message from the server
        const errorMessage = error.response && error.response.data && error.response.data.message
                             ? error.response.data.message
                             : 'An unexpected error occurred. Please try again.';
        
        alert(`Error deleting resume: ${errorMessage}`);
      }
    }
  };

  const toggleDropdown = (resumeId) => {
    setShowDropdown(showDropdown === resumeId ? null : resumeId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumes</h1>
          <p className="text-gray-600">Manage candidate resumes and profiles</p>
        </div>
        <Link
          to="/app/resumes/upload"
          className="btn-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Upload Resume
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-soft rounded-lg p-6">
        {/* Search Bar */}
        <form onSubmit={(e) => { e.preventDefault(); fetchResumes(); }} className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resumes by name, email, skills..."
              className="input pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
          >
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
        </form>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. JavaScript, React"
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Experience (years)
              </label>
              <input
                type="number"
                className="input"
                placeholder="0"
                value={filters.minExperience}
                onChange={(e) => handleFilterChange('minExperience', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Experience (years)
              </label>
              <input
                type="number"
                className="input"
                placeholder="10"
                value={filters.maxExperience}
                onChange={(e) => handleFilterChange('maxExperience', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="input"
                placeholder="City or State"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Resumes List */}
      <div className="bg-white shadow-soft rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading a candidate resume.
            </p>
            <div className="mt-6">
              <Link
                to="/app/resumes/upload"
                className="btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Upload Resume
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Candidate</th>
                  <th className="table-header-cell">Experience</th>
                  <th className="table-header-cell">Skills</th>
                  <th className="table-header-cell">Location</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Uploaded</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {resumes.map((resume) => {
                  console.log('📝 Rendering resume:', resume._id, 'Name:', resume.candidateName);
                  return (
                    <tr key={resume._id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/app/resumes/${resume._id}`} className="hover:text-primary-600">
                              {resume.candidateName || 'No Name'}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">{resume.email || 'No Email'}</div>
                          {resume.phone && (
                            <div className="text-xs text-gray-400">{resume.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {formatExperience(resume.experience)}
                      </div>
                      {resume.experience?.[0]?.company && (
                        <div className="text-xs text-gray-500">
                          {resume.experience[0].company}
                        </div>
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {resume.skills?.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {resume.skills?.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{resume.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-gray-900">
                        {resume.currentLocation && (
                          <>
                            <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {resume.currentLocation}
                          </>
                        )}
                        {!resume.currentLocation && (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${getStatusColor(resume.status)}`}>
                        {resume.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(resume.createdAt)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="relative dropdown-container">
                        <button 
                          className="text-gray-400 hover:text-gray-600 p-1"
                          onClick={() => toggleDropdown(resume._id)}
                        >
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {showDropdown === resume._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              <Link
                                to={`/app/resumes/${resume._id}`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowDropdown(null)}
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                              <button
                                onClick={() => {
                                  handleDeleteResume(resume._id, resume.candidateName);
                                  setShowDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete Resume
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPagination({...pagination, current: Math.max(1, pagination.current - 1)})}
                  disabled={pagination.current === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination({...pagination, current: Math.min(pagination.pages, pagination.current + 1)})}
                  disabled={pagination.current === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.current - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.current * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPagination({...pagination, current: Math.max(1, pagination.current - 1)})}
                      disabled={pagination.current === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.current <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.current >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.current - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination({...pagination, current: pageNum})}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === pagination.current
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPagination({...pagination, current: Math.min(pagination.pages, pagination.current + 1)})}
                      disabled={pagination.current === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeList;

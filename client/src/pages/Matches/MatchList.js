import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChartBarIcon,
  StarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minScore: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.current]);

  const fetchMatches = async () => {
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

      // Since we don't have a direct endpoint for all matches, we'll need to fetch from jobs
      // For now, let's simulate this or use the matches endpoint if available
      await axios.get('/api/matches/stats');
      
      // This is a placeholder - in a real implementation, you'd have a proper endpoint
      // For now, we'll show a message or fetch from individual jobs
      setMatches([]);
      setPagination({
        current: 1,
        pages: 1,
        total: 0,
        limit: 10
      });
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-600 bg-success-100';
    if (score >= 60) return 'text-warning-600 bg-warning-100';
    if (score >= 40) return 'text-primary-600 bg-primary-100';
    return 'text-error-600 bg-error-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'reviewed':
        return 'bg-primary-100 text-primary-800';
      case 'shortlisted':
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-error-100 text-error-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
          <p className="text-gray-600">Review and manage candidate-job matches</p>
        </div>
        <button className="btn-outline">
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Matches</p>
              <p className="stat-value">0</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <StarIcon className="h-8 w-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">High Matches (80%+)</p>
              <p className="stat-value">0</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-warning-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Score</p>
              <p className="stat-value">0%</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <BriefcaseIcon className="h-8 w-8 text-secondary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Shortlisted</p>
              <p className="stat-value">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-soft rounded-lg p-6">
        {/* Search Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search matches by candidate name, job title..."
              className="input pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
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
                Minimum Score
              </label>
              <select
                className="input"
                value={filters.minScore}
                onChange={(e) => handleFilterChange('minScore', e.target.value)}
              >
                <option value="">All Scores</option>
                <option value="80">80% and above</option>
                <option value="60">60% and above</option>
                <option value="40">40% and above</option>
                <option value="20">20% and above</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job
              </label>
              <select className="input">
                <option value="">All Jobs</option>
                <option value="">Job 1</option>
                <option value="">Job 2</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Matches List */}
      <div className="bg-white shadow-soft rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No matches found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Matches will appear here once you calculate them for your jobs.
            </p>
            <div className="mt-6">
              <Link
                to="/app/jobs"
                className="btn-primary"
              >
                Go to Jobs to Calculate Matches
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Candidate</th>
                  <th className="table-header-cell">Job</th>
                  <th className="table-header-cell">Match Score</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Created</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {matches.map((match) => (
                  <tr key={match._id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-sm">
                              {match.resumeId?.candidateName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              to={`/app/resumes/${match.resumeId?._id}`}
                              className="hover:text-primary-600"
                            >
                              {match.resumeId?.candidateName}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">{match.resumeId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        <Link
                          to={`/app/jobs/${match.jobId?._id}`}
                          className="hover:text-primary-600"
                        >
                          {match.jobId?.title}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">{match.jobId?.location}</div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(match.score)}`}>
                          {match.score}%
                        </span>
                        {match.score >= 80 && (
                          <StarIcon className="h-4 w-4 text-warning-500 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${getStatusColor(match.status)}`}>
                        {match.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-500">
                        {formatDate(match.createdAt)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/app/matches/${match._id}`}
                          className="text-primary-600 hover:text-primary-900 text-sm"
                        >
                          View Details
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                          to={`/app/jobs/${match.jobId?._id}/matches`}
                          className="text-primary-600 hover:text-primary-900 text-sm"
                        >
                          All Matches
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
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

export default MatchList;

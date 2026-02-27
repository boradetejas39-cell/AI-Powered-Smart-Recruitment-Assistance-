import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeftIcon,
  UserIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChartBarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const MatchResults = () => {
  const { jobId } = useParams();
  const [matches, setMatches] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minScore: '',
    status: ''
  });
  const [calculating, setCalculating] = useState(false);

  const fetchJobDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/jobs/${jobId}`);
      setJob(response.data.data.job);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  }, [jobId]);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/matches/job/${jobId}`);
      setMatches(response.data.data.matches || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, filters]);

  const calculateMatches = async () => { // eslint-disable-line no-unused-vars
    try {
      setCalculating(true);
      await axios.post(`/api/matches/job/${jobId}`);
      await fetchMatches();
    } catch (error) {
      console.error('Error calculating matches:', error);
    } finally {
      setCalculating(false);
    }
  };

  const calculateAllMatches = async () => {
    try {
      setCalculating(true);
      await axios.post(`/api/matches/job/${jobId}`);
      await fetchMatches();
    } catch (error) {
      console.error('Error calculating matches:', error);
    } finally {
      setCalculating(false);
    }
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

  const getSkillMatchPercentage = (breakdown) => {
    if (!breakdown?.skillMatch) return 0;
    return breakdown.skillMatch.score;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/app/jobs"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Match Results</h1>
            <p className="text-gray-600">
              {job ? `Candidates matching "${job.title}"` : 'Loading job details...'}
            </p>
          </div>
        </div>
        <button
          onClick={calculateAllMatches}
          disabled={calculating}
          className="btn-primary disabled:opacity-50"
        >
          {calculating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Calculating...
            </div>
          ) : (
            'Recalculate All Matches'
          )}
        </button>
      </div>

      {/* Job Info Card */}
      {job && (
        <div className="card">
          <div className="card-body">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                <div className="mt-2">
                  <span className="badge badge-primary">{job.jobType}</span>
                  <span className="badge badge-secondary ml-2">{job.priority}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Required Skills</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.requiredSkills?.slice(0, 5).map((skill, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills?.length > 5 && (
                    <span className="text-xs text-gray-500">+{job.requiredSkills.length - 5} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-soft rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Score
            </label>
            <select
              className="input"
              value={filters.minScore}
              onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
            >
              <option value="">All Scores</option>
              <option value="80">80% and above</option>
              <option value="60">60% and above</option>
              <option value="40">40% and above</option>
              <option value="20">20% and above</option>
            </select>
          </div>

          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="input"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
        </div>
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
              Try adjusting your filters or calculate matches for this job.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Candidate</th>
                  <th className="table-header-cell">Match Score</th>
                  <th className="table-header-cell">Skill Match</th>
                  <th className="table-header-cell">Experience</th>
                  <th className="table-header-cell">Status</th>
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
                            <UserIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              to={`/app/resumes/${match.resumeId._id}`}
                              className="hover:text-primary-600"
                            >
                              {match.resumeId.candidateName}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">{match.resumeId.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(match.score)}`}>
                            {match.score}%
                          </span>
                          {match.score >= 80 && (
                            <StarIcon className="h-4 w-4 text-warning-500 ml-2" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${getSkillMatchPercentage(match.breakdown)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {getSkillMatchPercentage(match.breakdown)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {match.breakdown?.skillMatch?.totalMatched || 0}/
                          {match.breakdown?.skillMatch?.totalRequired || 0} skills
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {formatExperience(match.resumeId.experience)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {match.resumeId.experience?.[0]?.company}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${getStatusColor(match.status)}`}>
                        {match.status}
                      </span>
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
                          to={`/app/resumes/${match.resumeId._id}`}
                          className="text-primary-600 hover:text-primary-900 text-sm"
                        >
                          Resume
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Matches</p>
                <p className="stat-value">{matches.length}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">High Matches (80%+)</p>
                <p className="stat-value">
                  {matches.filter(m => m.score >= 80).length}
                </p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="stat-value">
                  {Math.round(matches.reduce((sum, m) => sum + m.score, 0) / matches.length)}%
                </p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-secondary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Shortlisted</p>
                <p className="stat-value">
                  {matches.filter(m => m.status === 'shortlisted').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchResults;

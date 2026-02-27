import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
    fetchPerformance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/dashboard/analytics', {
        params: { period: timeRange }
      });
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await axios.get('/api/dashboard/performance');
      setPerformance(response.data.data);
    } catch (error) {
      console.error('Error fetching performance:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Prepare chart data
  const trends = analytics?.trends || {};
  const distributions = analytics?.distributions || {};

  const activityData = trends.jobs?.map((item, index) => ({
    name: `Day ${index + 1}`,
    jobs: item.count,
    resumes: trends.resumes?.[index]?.count || 0,
    matches: trends.matches?.[index]?.count || 0,
    avgScore: trends.matches?.[index]?.avgScore || 0
  })) || [];

  const jobTypeData = distributions.jobTypes?.map(item => ({
    name: item._id || 'Unknown',
    value: item.count
  })) || [];

  const skillData = distributions.skills?.slice(0, 10).map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const scoreData = distributions.scores?.map((item, index) => ({
    name: `${index * 20}-${(index + 1) * 20}%`,
    value: item.count,
    fill: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'][index] || '#6b7280'
  })) || [];

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Detailed insights into your recruitment performance</p>
        </div>
        <select
          className="input"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BriefcaseIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Jobs</p>
              <p className="stat-value">{trends.jobs?.reduce((sum, item) => sum + item.count, 0) || 0}</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-success-500 mr-1" />
                <span className="text-xs text-success-600">+12% from last period</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resumes Processed</p>
              <p className="stat-value">{trends.resumes?.reduce((sum, item) => sum + item.count, 0) || 0}</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-success-500 mr-1" />
                <span className="text-xs text-success-600">+8% from last period</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Matches Made</p>
              <p className="stat-value">{trends.matches?.reduce((sum, item) => sum + item.count, 0) || 0}</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-success-500 mr-1" />
                <span className="text-xs text-success-600">+15% from last period</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Match Score</p>
              <p className="stat-value">
                {performance?.avgScoreOverTime?.[performance.avgScoreOverTime.length - 1]?.avgScore?.toFixed(1) || '0'}%
              </p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-success-500 mr-1" />
                <span className="text-xs text-success-600">+3% from last period</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trends */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Activity Trends</h3>
            <p className="text-sm text-gray-600">Jobs, resumes, and matches over time</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="jobs" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                <Area type="monotone" dataKey="resumes" stackId="1" stroke="#22c55e" fill="#22c55e" />
                <Area type="monotone" dataKey="matches" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Type Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Job Type Distribution</h3>
            <p className="text-sm text-gray-600">Breakdown by job type</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills Demand */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Top Skills in Demand</h3>
            <p className="text-sm text-gray-600">Most requested skills across all jobs</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Match Score Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Match Score Distribution</h3>
            <p className="text-sm text-gray-600">Distribution of match scores</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
          <p className="text-sm text-gray-600">Key performance indicators</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {performance?.timeToHire?.avgTimeToHire?.toFixed(1) || '0'} days
              </div>
              <div className="text-sm text-gray-500">Average Time to Hire</div>
              <div className="text-xs text-gray-400 mt-1">
                Min: {performance?.timeToHire?.minTimeToHire?.toFixed(1) || '0'} days |
                Max: {performance?.timeToHire?.maxTimeToHire?.toFixed(1) || '0'} days
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {performance?.conversionRates?.find(r => r._id === 'hired')?.count || '0'}
              </div>
              <div className="text-sm text-gray-500">Successful Hires</div>
              <div className="text-xs text-gray-400 mt-1">
                {performance?.conversionRates?.find(r => r._id === 'shortlisted')?.count || '0'} shortlisted
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {performance?.topPerformingJobs?.[0]?.avgMatchScore?.toFixed(1) || '0'}%
              </div>
              <div className="text-sm text-gray-500">Best Job Match Score</div>
              <div className="text-xs text-gray-400 mt-1">
                {performance?.topPerformingJobs?.[0]?.title || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Distribution */}
      {distributions.experience && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Candidate Experience Distribution</h3>
            <p className="text-sm text-gray-600">Breakdown of candidate experience levels</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {distributions.experience.map((bucket, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{bucket.count}</div>
                  <div className="text-sm text-gray-500">
                    {bucket._id === '20+' ? '20+ years' : `${bucket._id}-${bucket._id + 1} years`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardBody, StatCard } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, analyticsRes, alertsRes] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/dashboard/analytics'),
        api.get('/dashboard/alerts')
      ]);

      setOverview(overviewRes.data.data);
      setAnalytics(analyticsRes.data.data);
      setAlerts(alertsRes.data.data.alerts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = overview?.stats || {};
  const recentActivity = overview?.recentActivity || {};
  const topMatches = overview?.topMatches || [];
  const jobMatchCounts = overview?.jobMatchCounts || [];

  // Prepare chart data
  const chartData = analytics?.trends?.jobs?.map((item, index) => ({
    name: `Day ${index + 1}`,
    jobs: item.count,
    resumes: analytics?.trends?.resumes?.[index]?.count || 0,
    matches: analytics?.trends?.matches?.[index]?.count || 0
  })) || [];

  const scoreDistribution = analytics?.distributions?.scores?.map((item, index) => ({
    name: `${index * 20}-${(index + 1) * 20}%`,
    value: item.count,
    fill: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'][index] || '#6b7280'
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your recruitment overview.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/app/jobs/new">
            <Button variant="primary" size="md">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Job
            </Button>
          </Link>
          <Link to="/app/resumes/upload">
            <Button variant="secondary" size="md">
              <PlusIcon className="h-5 w-5 mr-2" />
              Upload Resumes
            </Button>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <Card key={index} className="border-l-4" style={{
              borderLeftColor: alert.type === 'error' ? '#dc2626' :
                alert.type === 'warning' ? '#d97706' :
                  alert.type === 'success' ? '#16a34a' : '#3b82f6'
            }}>
              <CardBody className="flex items-center gap-4">
                {alert.type === 'error' && <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />}
                {alert.type === 'warning' && <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0" />}
                {alert.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BriefcaseIcon}
          label="Active Jobs"
          value={stats.activeJobs || 0}
          subtext="Jobs posted"
          trendColor="blue"
        />
        <StatCard
          icon={DocumentTextIcon}
          label="Total Resumes"
          value={stats.totalResumes || 0}
          subtext="In database"
          trendColor="green"
        />
        <StatCard
          icon={UserGroupIcon}
          label="Matched Candidates"
          value={stats.matchedCandidates || 0}
          subtext="This month"
          trendColor="purple"
        />
        <StatCard
          icon={CheckCircleIcon}
          label="Avg Match Score"
          value={`${stats.averageMatchScore || 0}%`}
          subtext="AI accuracy"
          trendColor="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trends Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Recruitment Trends</h3>
              <p className="text-sm text-gray-600 mt-1">Last 14 days activity</p>
            </CardHeader>
            <CardBody>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      cursor={{ stroke: '#e5e7eb' }}
                    />
                    <Line type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="resumes" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="matches" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Score Distribution */}
        <div>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Match Scores</h3>
              <p className="text-sm text-gray-600 mt-1">Distribution</p>
            </CardHeader>
            <CardBody>
              {scoreDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} candidates`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Matches */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Matches</h3>
              <p className="text-sm text-gray-600 mt-1">Best candidates</p>
            </div>
            <Link to="/app/matches" className="text-primary-600 hover:text-primary-700">
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </CardHeader>
          <CardBody>
            {topMatches.length > 0 ? (
              <div className="space-y-4">
                {topMatches.map((match, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{match.candidateName}</p>
                      <p className="text-sm text-gray-600">{match.jobTitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">{match.matchScore}%</div>
                      <p className="text-xs text-gray-500">match</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No matches available yet</p>
            )}
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-600 mt-1">Latest updates</p>
            </div>
            <ClockIcon className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardBody>
            {Object.values(recentActivity).some(v => v?.length) ? (
              <div className="space-y-4">
                {recentActivity?.jobs?.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <BriefcaseIcon className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Matching Candidates Per Job */}
      {jobMatchCounts.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Matching Candidates Per Job</h3>
            <p className="text-sm text-gray-600 mt-1">Number of matched candidates for each job posting</p>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Candidates</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Top Score</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobMatchCounts.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                          {item.candidateCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-semibold ${item.avgScore >= 70 ? 'text-green-600' :
                            item.avgScore >= 40 ? 'text-yellow-600' : 'text-red-500'
                          }`}>
                          {item.avgScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-semibold ${item.topScore >= 70 ? 'text-green-600' :
                            item.topScore >= 40 ? 'text-yellow-600' : 'text-red-500'
                          }`}>
                          {item.topScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/app/matches/results/${item.jobId}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;

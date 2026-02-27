import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../api/v2';
import {
    ChartBarIcon,
    BriefcaseIcon,
    UserGroupIcon,
    CheckCircleIcon,
    SparklesIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

const AnalyticsV2 = () => {
    const [overview, setOverview] = useState(null);
    const [pipeline, setPipeline] = useState([]);
    const [topJobs, setTopJobs] = useState([]);
    const [skills, setSkills] = useState([]);
    const [scores, setScores] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [, setInterviewStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [ovRes, pipRes, topRes, skillRes, scoreRes, monthRes, ivRes] = await Promise.all([
                    analyticsAPI.overview(),
                    analyticsAPI.pipeline(),
                    analyticsAPI.topJobs(5),
                    analyticsAPI.skills(),
                    analyticsAPI.scores(),
                    analyticsAPI.monthly(6),
                    analyticsAPI.interviews(),
                ]);
                setOverview(ovRes.data.data);
                setPipeline(pipRes.data.data || []);
                setTopJobs(topRes.data.data || []);
                setSkills(skillRes.data.data || []);
                setScores(scoreRes.data.data || []);
                setMonthly(monthRes.data.data || []);
                setInterviewStats(ivRes.data.data);
            } catch (err) {
                console.error('Analytics fetch failed', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
        );
    }

    const stats = overview || {};

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
                <p className="text-gray-500 mt-1">Recruitment KPIs & insights</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Jobs', value: stats.totalJobs || 0, icon: BriefcaseIcon, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Active Jobs', value: stats.activeJobs || 0, icon: CheckCircleIcon, color: 'text-green-600 bg-green-50' },
                    { label: 'Applications', value: stats.totalApplications || 0, icon: UserGroupIcon, color: 'text-purple-600 bg-purple-50' },
                    { label: 'Candidates', value: stats.totalCandidates || 0, icon: UserGroupIcon, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Shortlisted', value: stats.shortlisted || 0, icon: SparklesIcon, color: 'text-yellow-600 bg-yellow-50' },
                    { label: 'Hired', value: stats.selected || 0, icon: CheckCircleIcon, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Avg Match Score', value: `${stats.averageMatchScore || 0}%`, icon: ChartBarIcon, color: 'text-cyan-600 bg-cyan-50' },
                    { label: 'Hiring Rate', value: `${stats.hiringSuccessRate || 0}%`, icon: ArrowTrendingUpIcon, color: 'text-pink-600 bg-pink-50' },
                ].map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                                    <p className="text-xs text-gray-500">{kpi.label}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pipeline Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Distribution</h2>
                    {pipeline.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={pipeline.map(p => ({ name: p._id, count: p.count }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-10">No data yet</p>
                    )}
                </div>

                {/* Score Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h2>
                    {scores.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={scores.map(s => ({ name: s._id, value: s.count }))} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                    {scores.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-10">No data yet</p>
                    )}
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trend */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Applications</h2>
                    {monthly.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={monthly.map(m => ({ month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`, count: m.count }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-10">No data yet</p>
                    )}
                </div>

                {/* Top Jobs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Jobs by Applicants</h2>
                    {topJobs.length > 0 ? (
                        <div className="space-y-3">
                            {topJobs.map((j, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{j.jobTitle || j._id}</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${Math.min((j.count / (topJobs[0]?.count || 1)) * 100, 100)}%` }} />
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{j.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-10">No data yet</p>
                    )}
                </div>
            </div>

            {/* Skills Demand */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Skills in Demand</h2>
                {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 20).map((s, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-sm font-medium text-indigo-700">
                                {s._id} <span className="text-xs text-indigo-400">({s.count})</span>
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-6">No skill data yet</p>
                )}
            </div>
        </div>
    );
};

export default AnalyticsV2;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../../api/v2';
import { useAuth } from '../../contexts/AuthContext';
import {
    DocumentTextIcon,
    FunnelIcon,
    EyeIcon,
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

const stageBadge = {
    applied: 'bg-blue-100 text-blue-800',
    screening: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-indigo-100 text-indigo-800',
    interview: 'bg-purple-100 text-purple-800',
    evaluation: 'bg-orange-100 text-orange-800',
    offer: 'bg-emerald-100 text-emerald-800',
    hired: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const ApplicationList = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
    const [filters, setFilters] = useState({ stage: '', search: '', page: 1 });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchApplications(); }, [filters.page, filters.stage]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const params = { page: filters.page, limit: 15 };
            if (filters.stage) params.stage = filters.stage;
            const res = await applicationAPI.list(params);
            setApplications(res.data.data || []);
            setMeta(res.data.meta || { page: 1, pages: 1, total: 0 });
        } catch (err) {
            console.error('Failed to load applications', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReScreen = async (id) => {
        try {
            await applicationAPI.reScreen(id);
            fetchApplications();
        } catch (err) {
            console.error('Re-screen failed', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
                    <p className="text-gray-500 mt-1">{meta.total} total applications</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                    value={filters.stage}
                    onChange={(e) => setFilters({ ...filters, stage: e.target.value, page: 1 })}
                    className="rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="">All Stages</option>
                    {Object.keys(stageBadge).map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                </select>
                <button onClick={fetchApplications} className="ml-auto text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1">
                    <ArrowPathIcon className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-3 text-gray-500">No applications found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{app.candidateId?.name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{app.candidateId?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{app.jobId?.title || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{app.jobId?.company}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${stageBadge[app.currentStage] || 'bg-gray-100 text-gray-800'}`}>
                                                {app.currentStage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {app.screeningResult?.matchScore != null ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${app.screeningResult.matchScore >= 70 ? 'bg-green-500' : app.screeningResult.matchScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                            style={{ width: `${app.screeningResult.matchScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{app.screeningResult.matchScore}%</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">Not screened</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                            <Link
                                                to={`/app/applications/${app._id}`}
                                                className="inline-flex items-center text-primary-600 hover:text-primary-800 text-sm"
                                            >
                                                <EyeIcon className="h-4 w-4 mr-1" /> View
                                            </Link>
                                            {(user?.role === 'admin' || user?.role === 'hr' || user?.role === 'recruiter') && (
                                                <button
                                                    onClick={() => handleReScreen(app._id)}
                                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                                                >
                                                    <ArrowPathIcon className="h-4 w-4 mr-1" /> Re-screen
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta.pages > 1 && (
                        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Page {meta.page} of {meta.pages} ({meta.total} total)
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                                    disabled={meta.page <= 1}
                                    className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                                    disabled={meta.page >= meta.pages}
                                    className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApplicationList;

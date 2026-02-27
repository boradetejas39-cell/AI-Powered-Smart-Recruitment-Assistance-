import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interviewAPI } from '../../api/v2';
import {
    ChatBubbleLeftRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

const statusBadge = {
    pending: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-yellow-100 text-yellow-800',
    evaluated: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
};

const recBadge = {
    strong_hire: 'bg-green-100 text-green-700',
    hire: 'bg-emerald-100 text-emerald-700',
    maybe: 'bg-yellow-100 text-yellow-700',
    reject: 'bg-red-100 text-red-700',
};

const InterviewList = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
    const [filters, setFilters] = useState({ status: '', page: 1 });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchInterviews(); }, [filters.page, filters.status]);

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            const params = { page: filters.page, limit: 15 };
            if (filters.status) params.status = filters.status;
            const res = await interviewAPI.list(params);
            setInterviews(res.data.data || []);
            setMeta(res.data.meta || { page: 1, pages: 1, total: 0 });
        } catch (err) {
            console.error('Failed to load interviews', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Interviews</h1>
                <p className="text-gray-500 mt-1">{meta.total} total interviews</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                    className="rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="evaluated">Evaluated</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                </div>
            ) : interviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-3 text-gray-500">No interviews yet</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {interviews.map((iv) => (
                        <Link key={iv._id} to={`/app/interviews/${iv._id}`}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{iv.candidateId?.name || 'Candidate'}</p>
                                    <p className="text-sm text-gray-500">{iv.candidateId?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">{iv.questions?.length || 0} questions</p>
                                    {iv.overallScore != null && (
                                        <p className="text-lg font-bold text-primary-600">{iv.overallScore}%</p>
                                    )}
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[iv.status] || 'bg-gray-100'}`}>{iv.status?.replace('_', ' ')}</span>
                                {iv.recommendation && (
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${recBadge[iv.recommendation] || 'bg-gray-100'}`}>
                                        {iv.recommendation?.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}

                    {meta.pages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-sm text-gray-500">Page {meta.page} of {meta.pages}</p>
                            <div className="flex gap-2">
                                <button onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} disabled={meta.page <= 1}
                                    className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40">
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </button>
                                <button onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} disabled={meta.page >= meta.pages}
                                    className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40">
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

export default InterviewList;

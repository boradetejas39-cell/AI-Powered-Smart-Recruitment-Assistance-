import React, { useState, useEffect } from 'react';
import { pipelineAPI, applicationAPI } from '../../api/v2';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import {
    FunnelIcon,
} from '@heroicons/react/24/outline';

const STAGES = [
    { key: 'applied', label: 'Applied', color: 'bg-blue-500', light: 'bg-blue-50 border-blue-200' },
    { key: 'screening', label: 'Screening', color: 'bg-yellow-500', light: 'bg-yellow-50 border-yellow-200' },
    { key: 'shortlisted', label: 'Shortlisted', color: 'bg-indigo-500', light: 'bg-indigo-50 border-indigo-200' },
    { key: 'interview', label: 'Interview', color: 'bg-purple-500', light: 'bg-purple-50 border-purple-200' },
    { key: 'evaluation', label: 'Evaluation', color: 'bg-orange-500', light: 'bg-orange-50 border-orange-200' },
    { key: 'offer', label: 'Offer', color: 'bg-emerald-500', light: 'bg-emerald-50 border-emerald-200' },
    { key: 'hired', label: 'Hired', color: 'bg-green-500', light: 'bg-green-50 border-green-200' },
    { key: 'rejected', label: 'Rejected', color: 'bg-red-500', light: 'bg-red-50 border-red-200' },
];

const PipelineBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [pipelineData, setPipelineData] = useState({});
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch jobs for the selector
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/jobs');
                const jobList = res.data.data?.jobs || res.data.data || [];
                setJobs(jobList);
                if (jobList.length > 0) setSelectedJob(jobList[0]._id);
            } catch (err) {
                console.error('Failed to load jobs', err);
            }
        };
        fetchJobs();
    }, []);

    // Fetch pipeline + applications when job changes
    useEffect(() => {
        if (!selectedJob) return;
        const fetchPipeline = async () => {
            setLoading(true);
            try {
                const [pipeRes, appRes] = await Promise.all([
                    pipelineAPI.getJob(selectedJob),
                    applicationAPI.list({ jobId: selectedJob, limit: 100 })
                ]);
                // API returns an object like { applied: 3, screening: 1, ... }
                const pData = pipeRes.data.data || {};
                setPipelineData(Array.isArray(pData) ? {} : pData);
                setApplications(appRes.data.data || []);
            } catch (err) {
                console.error('Failed to load pipeline', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPipeline();
    }, [selectedJob]);

    const getStageCount = (stageKey) => {
        return pipelineData[stageKey] || 0;
    };

    const getStageApps = (stageKey) => {
        return applications.filter(a => a.currentStage === stageKey);
    };

    const totalApps = applications.length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Recruitment Pipeline</h1>
                    <p className="text-gray-500 mt-1">Track candidates through hiring stages</p>
                </div>
            </div>

            {/* Job Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-3">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500 flex-1 max-w-md"
                >
                    {jobs.map(j => (
                        <option key={j._id} value={j._id}>{j.title} — {j.company}</option>
                    ))}
                </select>
                <span className="text-sm text-gray-500 ml-auto">{totalApps} candidates</span>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                </div>
            ) : (
                <>
                    {/* Stage Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                        {STAGES.map(stage => {
                            const count = getStageCount(stage.key);
                            return (
                                <div key={stage.key} className={`rounded-xl border p-3 text-center ${stage.light}`}>
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                    <p className="text-xs text-gray-600 mt-1">{stage.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Kanban Board */}
                    <div className="overflow-x-auto pb-4">
                        <div className="flex gap-4 min-w-[1200px]">
                            {STAGES.map(stage => {
                                const stageApps = getStageApps(stage.key);
                                return (
                                    <div key={stage.key} className="flex-1 min-w-[180px]">
                                        <div className={`flex items-center gap-2 mb-3 px-2`}>
                                            <div className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                                            <span className="text-sm font-semibold text-gray-700">{stage.label}</span>
                                            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 ml-auto">{stageApps.length}</span>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-2 space-y-2 min-h-[200px] border border-gray-100">
                                            {stageApps.length === 0 ? (
                                                <p className="text-xs text-gray-400 text-center py-8">No candidates</p>
                                            ) : (
                                                stageApps.map(app => (
                                                    <Link key={app._id} to={`/app/applications/${app._id}`}
                                                        className="block bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{app.candidateId?.name || 'Candidate'}</p>
                                                        <p className="text-xs text-gray-500 truncate">{app.resumeId?.name || app.candidateId?.email}</p>
                                                        {app.screeningResult?.matchScore != null && (
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                                                    <div
                                                                        className={`h-1.5 rounded-full ${app.screeningResult.matchScore >= 70 ? 'bg-green-500' : app.screeningResult.matchScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                                        style={{ width: `${app.screeningResult.matchScore}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-medium text-gray-500">{app.screeningResult.matchScore}%</span>
                                                            </div>
                                                        )}
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PipelineBoard;

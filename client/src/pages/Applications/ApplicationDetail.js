import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { applicationAPI, interviewAPI } from '../../api/v2';
import { useAuth } from '../../contexts/AuthContext';
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon,
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

const STAGES = ['applied', 'screening', 'shortlisted', 'interview', 'evaluation', 'offer', 'hired', 'rejected'];

const ApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const isHRAdmin = ['admin', 'hr', 'recruiter'].includes(user?.role);

    useEffect(() => { fetchApp(); }, [id]);

    const fetchApp = async () => {
        try {
            const res = await applicationAPI.get(id);
            setApp(res.data.data.application);
        } catch (err) {
            console.error('Failed to load application', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStageChange = async (newStage) => {
        setActionLoading(true);
        try {
            await applicationAPI.updateStatus(id, { status: newStage, notes: `Moved to ${newStage} by ${user.name}` });
            fetchApp();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update stage');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReScreen = async () => {
        setActionLoading(true);
        try {
            await applicationAPI.reScreen(id);
            fetchApp();
        } catch (err) {
            console.error('Re-screen failed', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleStartInterview = async () => {
        setActionLoading(true);
        try {
            const res = await interviewAPI.start({ applicationId: id });
            navigate(`/app/interviews/${res.data.data.interview._id}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to start interview');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
        );
    }

    if (!app) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Application not found</p>
                <Link to="/app/applications" className="text-primary-600 hover:underline mt-2 inline-block">Back to list</Link>
            </div>
        );
    }

    const screening = app.screeningResult;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Back */}
            <button onClick={() => navigate('/app/applications')} className="flex items-center text-gray-500 hover:text-gray-800 text-sm">
                <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Applications
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{app.candidateId?.name || 'Candidate'}</h1>
                        <p className="text-gray-500">{app.candidateId?.email}</p>
                        <p className="text-sm text-gray-400 mt-1">Applied for <span className="font-semibold text-gray-700">{app.jobId?.title}</span></p>
                    </div>
                    <span className={`self-start inline-flex px-3 py-1 rounded-full text-sm font-medium ${stageBadge[app.currentStage] || 'bg-gray-100 text-gray-800'}`}>
                        {app.currentStage}
                    </span>
                </div>

                {/* Stage Progress */}
                <div className="mt-6">
                    <div className="flex items-center gap-1 overflow-x-auto pb-2">
                        {STAGES.filter(s => s !== 'rejected').map((stage, i) => {
                            const idx = STAGES.indexOf(app.currentStage);
                            const stageIdx = STAGES.indexOf(stage);
                            const isCurrent = stage === app.currentStage;
                            const isPast = stageIdx < idx && app.currentStage !== 'rejected';
                            return (
                                <div key={stage} className="flex items-center">
                                    <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${isCurrent ? 'bg-primary-600 text-white' :
                                            isPast ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-400'
                                        }`}>
                                        {isPast && <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />}
                                        {stage}
                                    </div>
                                    {i < STAGES.length - 2 && <div className={`w-4 h-0.5 ${isPast ? 'bg-green-300' : 'bg-gray-200'}`} />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* HR Actions */}
                {isHRAdmin && (
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                        {STAGES.filter(s => s !== app.currentStage).map(stage => (
                            <button
                                key={stage}
                                onClick={() => handleStageChange(stage)}
                                disabled={actionLoading}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${stage === 'rejected' ? 'border-red-300 text-red-600 hover:bg-red-50' :
                                        'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Move to {stage}
                            </button>
                        ))}
                        <button onClick={handleReScreen} disabled={actionLoading}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-indigo-300 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 flex items-center gap-1">
                            <ArrowPathIcon className="h-3.5 w-3.5" /> Re-screen
                        </button>
                        <button onClick={handleStartInterview} disabled={actionLoading}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center gap-1">
                            <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" /> Start AI Interview
                        </button>
                    </div>
                )}
            </div>

            {/* AI Screening Result */}
            {screening && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <SparklesIcon className="h-5 w-5 text-yellow-500" /> AI Screening Result
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-primary-600">{screening.matchScore}%</p>
                            <p className="text-sm text-gray-500 mt-1">Match Score</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${screening.recommendation === 'hire' ? 'bg-green-100 text-green-700' :
                                    screening.recommendation === 'maybe' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                {screening.recommendation?.toUpperCase()}
                            </span>
                            <p className="text-sm text-gray-500 mt-2">Recommendation</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-600">{screening.summary || 'N/A'}</p>
                            <p className="text-sm text-gray-500 mt-1">Summary</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-green-700 mb-2">Strengths</h3>
                            <ul className="space-y-1">
                                {(screening.strengths || []).map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-red-700 mb-2">Weaknesses</h3>
                            <ul className="space-y-1">
                                {(screening.weaknesses || []).map((w, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <XCircleIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" /> {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Stage History */}
            {app.stageHistory && app.stageHistory.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Stage History</h2>
                    <div className="space-y-3">
                        {app.stageHistory.map((h, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm">
                                <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stageBadge[h.stage] || 'bg-gray-100 text-gray-600'}`}>
                                    {h.stage}
                                </span>
                                <span className="text-gray-500">{h.notes}</span>
                                <span className="ml-auto text-gray-400 text-xs">{new Date(h.movedAt).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cover Letter */}
            {app.coverLetter && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h2>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">{app.coverLetter}</p>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetail;

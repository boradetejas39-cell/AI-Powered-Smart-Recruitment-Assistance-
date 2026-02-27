import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../../api/v2';
import { useAuth } from '../../contexts/AuthContext';
import {
    ArrowLeftIcon,
    PaperAirplaneIcon,
    SparklesIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const difficultyColor = {
    easy: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    hard: 'text-red-600 bg-red-50',
};

const InterviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [answeringQ, setAnsweringQ] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
    const isHRAdmin = ['admin', 'hr', 'recruiter'].includes(user?.role);

    const fetchInterview = React.useCallback(async () => {
        try {
            const res = await interviewAPI.get(id);
            setInterview(res.data.data.interview);
        } catch (err) {
            console.error('Failed to load interview', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchInterview(); }, [fetchInterview]);


    const handleSubmitAnswer = async (questionId) => {
        if (!currentAnswer.trim()) return;
        setSubmitting(true);
        try {
            await interviewAPI.answer(id, { questionId, answer: currentAnswer });
            setCurrentAnswer('');
            setAnsweringQ(null);
            fetchInterview();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEvaluate = async () => {
        setEvaluating(true);
        try {
            await interviewAPI.evaluate(id);
            fetchInterview();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to evaluate');
        } finally {
            setEvaluating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
        );
    }

    if (!interview) {
        return <div className="text-center py-20 text-gray-500">Interview not found</div>;
    }

    const answered = interview.questions?.filter(q => q.answer).length || 0;
    const total = interview.questions?.length || 0;
    const isEvaluated = interview.status === 'evaluated';

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <button onClick={() => navigate('/app/interviews')} className="flex items-center text-gray-500 hover:text-gray-800 text-sm">
                <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Interviews
            </button>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
                            AI Interview
                        </h1>
                        <p className="text-gray-500 mt-1">{interview.candidateId?.name || 'Candidate'} &middot; {interview.candidateId?.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isEvaluated ? 'bg-green-100 text-green-700' :
                            interview.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                            {interview.status?.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>{answered}/{total} answered</span>
                        <span>{Math.round((answered / total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${(answered / total) * 100}%` }} />
                    </div>
                </div>

                {/* Evaluate Button */}
                {isHRAdmin && !isEvaluated && answered > 0 && (
                    <button onClick={handleEvaluate} disabled={evaluating}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2">
                        <SparklesIcon className="h-4 w-4" />
                        {evaluating ? 'Evaluating...' : 'Evaluate with AI'}
                    </button>
                )}
            </div>

            {/* Overall Result */}
            {isEvaluated && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-purple-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <SparklesIcon className="h-5 w-5 text-purple-600" /> AI Evaluation Result
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                            <p className="text-4xl font-bold text-primary-600">{interview.overallScore}%</p>
                            <p className="text-sm text-gray-500">Overall Score</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${interview.recommendation === 'strong_hire' ? 'bg-green-100 text-green-700' :
                                interview.recommendation === 'hire' ? 'bg-emerald-100 text-emerald-700' :
                                    interview.recommendation === 'maybe' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                }`}>{interview.recommendation?.replace('_', ' ').toUpperCase()}</span>
                            <p className="text-sm text-gray-500 mt-2">Recommendation</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-sm text-gray-600">{interview.feedbackSummary}</p>
                            <p className="text-sm text-gray-500 mt-1">Summary</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-green-700 text-sm mb-2">Strengths</h3>
                            {(interview.strengths || []).map((s, i) => (
                                <p key={i} className="flex items-start gap-2 text-sm text-gray-700 mb-1">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> {s}
                                </p>
                            ))}
                        </div>
                        <div>
                            <h3 className="font-medium text-red-700 text-sm mb-2">Weaknesses</h3>
                            {(interview.weaknesses || []).map((w, i) => (
                                <p key={i} className="flex items-start gap-2 text-sm text-gray-700 mb-1">
                                    <XCircleIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" /> {w}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Questions */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Questions ({total})</h2>
                {(interview.questions || []).map((q, i) => (
                    <div key={q._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-400">Q{i + 1}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColor[q.difficulty] || 'bg-gray-50 text-gray-600'}`}>
                                    {q.difficulty}
                                </span>
                                <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">{q.category}</span>
                            </div>
                            {q.evaluation?.score != null && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${q.evaluation.score >= 70 ? 'bg-green-100 text-green-700' : q.evaluation.score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    {q.evaluation.score}%
                                </span>
                            )}
                        </div>
                        <p className="text-gray-900 font-medium mb-3">{q.text}</p>

                        {q.answer ? (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-700">{q.answer}</p>
                                {q.evaluation?.feedback && (
                                    <p className="text-xs text-indigo-600 mt-2 border-t border-gray-200 pt-2">
                                        <SparklesIcon className="h-3 w-3 inline mr-1" />
                                        {q.evaluation.feedback}
                                    </p>
                                )}
                            </div>
                        ) : answeringQ === q._id ? (
                            <div className="space-y-2">
                                <textarea
                                    value={currentAnswer}
                                    onChange={(e) => setCurrentAnswer(e.target.value)}
                                    placeholder="Type your answer..."
                                    rows={4}
                                    className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => { setAnsweringQ(null); setCurrentAnswer(''); }}
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSubmitAnswer(q._id)}
                                        disabled={submitting || !currentAnswer.trim()}
                                        className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-1"
                                    >
                                        <PaperAirplaneIcon className="h-3.5 w-3.5" />
                                        {submitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        ) : !isEvaluated && (
                            <button onClick={() => setAnsweringQ(q._id)}
                                className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                                Answer this question →
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InterviewDetail;

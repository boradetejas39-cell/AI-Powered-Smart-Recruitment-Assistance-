const Interview = require('../models/Interview');
const Application = require('../models/Application');
const aiInterviewService = require('../services/aiInterviewService');
const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');
const { ok, created, badRequest, notFound, serverError } = require('../utils/apiResponse');

/**
 * Interview Controller — AI-driven interview system.
 */

// ── POST /api/v2/interviews/start ───────────────────────────────
exports.startInterview = async (req, res) => {
    try {
        const { applicationId, questionCount } = req.body;

        const application = await Application.findById(applicationId)
            .populate('jobId').populate('resumeId');
        if (!application) return notFound(res, 'Application not found');

        // Prevent duplicate active interviews
        const existing = await Interview.findOne({
            applicationId, status: { $in: ['pending', 'in_progress'] }
        });
        if (existing) return badRequest(res, 'An active interview already exists for this application');

        // Generate questions via AI
        const questions = aiInterviewService.generateQuestions(
            application.jobId, application.resumeId, questionCount || 8
        );

        const interview = await Interview.create({
            applicationId,
            jobId: application.jobId._id,
            candidateId: application.candidateId,
            questions: questions.map(q => ({
                text: q.text, category: q.category, difficulty: q.difficulty
            })),
            status: 'pending'
        });

        // Link interview to application
        application.interviewId = interview._id;
        application.currentStage = 'interview';
        application.stageHistory.push({
            stage: 'interview', movedBy: req.user._id,
            notes: 'Interview started'
        });
        await application.save();

        ActivityLog.record({
            userId: req.user._id, action: 'interview_scheduled',
            description: `Interview started for application ${applicationId}`,
            targetModel: 'Interview', targetId: interview._id
        }).catch(() => { });

        logger.info('Interview started', { interviewId: interview._id });
        return created(res, 'Interview started', {
            interview: {
                _id: interview._id,
                status: interview.status,
                questions: interview.questions.map(q => ({
                    _id: q._id, text: q.text, category: q.category, difficulty: q.difficulty
                }))
            }
        });
    } catch (error) {
        logger.error('Start interview error', { error: error.message });
        return serverError(res, 'Failed to start interview', error);
    }
};

// ── POST /api/v2/interviews/:id/answer ──────────────────────────
exports.submitAnswer = async (req, res) => {
    try {
        const { questionId, answer } = req.body;
        const interview = await Interview.findById(req.params.id);
        if (!interview) return notFound(res, 'Interview not found');

        if (interview.status === 'evaluated' || interview.status === 'expired') {
            return badRequest(res, 'This interview is no longer active');
        }

        const question = interview.questions.id(questionId);
        if (!question) return notFound(res, 'Question not found');

        question.answer = answer;
        question.answeredAt = new Date();

        // Update interview status
        if (interview.status === 'pending') {
            interview.status = 'in_progress';
            interview.startedAt = interview.startedAt || new Date();
        }

        // Check if all questions answered
        const allAnswered = interview.questions.every(q => q.answer);
        if (allAnswered) interview.status = 'completed';

        await interview.save();

        return ok(res, 'Answer submitted', {
            questionId,
            totalQuestions: interview.questions.length,
            answered: interview.questions.filter(q => q.answer).length,
            status: interview.status
        });
    } catch (error) {
        return serverError(res, 'Failed to submit answer', error);
    }
};

// ── POST /api/v2/interviews/:id/evaluate ────────────────────────
exports.evaluateInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) return notFound(res, 'Interview not found');

        if (interview.status === 'evaluated') {
            return badRequest(res, 'Interview already evaluated');
        }

        const unanswered = interview.questions.filter(q => !q.answer);
        if (unanswered.length > interview.questions.length * 0.5) {
            return badRequest(res, 'Too many unanswered questions to evaluate');
        }

        // Evaluate each answer individually
        for (const question of interview.questions) {
            if (question.answer) {
                const evaluation = aiInterviewService.evaluateAnswer(question.answer, []);
                question.evaluation = {
                    score: evaluation.score,
                    feedback: evaluation.feedback,
                    keywords: evaluation.keywordsFound || []
                };
            }
        }

        // Overall evaluation
        const overallResult = aiInterviewService.evaluateInterview(interview.questions);
        interview.overallScore = overallResult.overallScore;
        interview.feedbackSummary = overallResult.feedbackSummary;
        interview.strengths = overallResult.strengths;
        interview.weaknesses = overallResult.weaknesses;
        interview.recommendation = overallResult.recommendation;
        interview.status = 'evaluated';
        interview.completedAt = new Date();

        await interview.save();

        ActivityLog.record({
            userId: req.user._id, action: 'interview_evaluated',
            description: `Interview evaluated: score ${interview.overallScore}`,
            targetModel: 'Interview', targetId: interview._id
        }).catch(() => { });

        return ok(res, 'Interview evaluated', {
            overallScore: interview.overallScore,
            recommendation: interview.recommendation,
            feedbackSummary: interview.feedbackSummary,
            strengths: interview.strengths,
            weaknesses: interview.weaknesses
        });
    } catch (error) {
        logger.error('Evaluate interview error', { error: error.message });
        return serverError(res, 'Failed to evaluate interview', error);
    }
};

// ── GET /api/v2/interviews/:id ──────────────────────────────────
exports.getInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)
            .populate('applicationId').populate('candidateId', 'name email');
        if (!interview) return notFound(res, 'Interview not found');

        // Candidates can only see their own
        if (req.user.role === 'user' &&
            interview.candidateId._id.toString() !== req.user._id.toString()) {
            return notFound(res, 'Interview not found');
        }

        return ok(res, 'Interview fetched', { interview });
    } catch (error) {
        return serverError(res, 'Failed to fetch interview', error);
    }
};

// ── GET /api/v2/interviews?applicationId=xxx ────────────────────
exports.getInterviews = async (req, res) => {
    try {
        const { applicationId, status, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (req.user.role === 'user') filter.candidateId = req.user._id;
        if (applicationId) filter.applicationId = applicationId;
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [interviews, total] = await Promise.all([
            Interview.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
                .populate('applicationId', 'currentStage')
                .populate('candidateId', 'name email').lean(),
            Interview.countDocuments(filter)
        ]);

        return ok(res, 'Interviews fetched', interviews, {
            page: parseInt(page), limit: parseInt(limit),
            total, pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        return serverError(res, 'Failed to fetch interviews', error);
    }
};

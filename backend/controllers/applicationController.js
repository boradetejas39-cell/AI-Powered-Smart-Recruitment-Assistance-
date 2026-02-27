const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const aiScreeningService = require('../services/aiScreeningService');
const ActivityLog = require('../models/ActivityLog');
const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');
const { ok, created, badRequest, notFound, conflict, serverError } = require('../utils/apiResponse');

/**
 * Application Controller — Candidate application lifecycle.
 */

// ── POST /api/v2/applications ───────────────────────────────────
exports.apply = async (req, res) => {
    try {
        const { jobId, resumeId, coverLetter } = req.body;
        const candidateId = req.user._id;

        // Validate job exists & is open
        const job = await Job.findById(jobId);
        if (!job) return notFound(res, 'Job not found');
        if (job.status !== 'active' && job.status !== 'open') {
            return badRequest(res, 'This job is no longer accepting applications');
        }

        // Validate resume exists & belongs to candidate
        const resume = await Resume.findById(resumeId);
        if (!resume) return notFound(res, 'Resume not found');

        // Check duplicate application
        const exists = await Application.findOne({ jobId, resumeId });
        if (exists) return conflict(res, 'You have already applied to this job with this resume');

        // Run AI screening
        let screeningResult = null;
        try {
            screeningResult = await aiScreeningService.screenCandidate(job, resume);
            logger.info('AI screening completed', { jobId, resumeId, score: screeningResult.matchScore });
        } catch (err) {
            logger.warn('AI screening failed, proceeding without', { error: err.message });
        }

        const application = await Application.create({
            jobId, resumeId, candidateId, coverLetter,
            screeningResult: screeningResult || undefined,
            currentStage: 'applied'
        });

        // Notify candidate
        sendEmail(req.user.email, 'application_received', {
            name: req.user.name, jobTitle: job.title
        }).catch(() => { });

        ActivityLog.record({
            userId: candidateId, action: 'application_submitted',
            description: `Applied to: ${job.title}`,
            targetModel: 'Application', targetId: application._id
        }).catch(() => { });

        return created(res, 'Application submitted', { application });
    } catch (error) {
        if (error.code === 11000) return conflict(res, 'Duplicate application');
        logger.error('Apply error', { error: error.message });
        return serverError(res, 'Failed to submit application', error);
    }
};

// ── GET /api/v2/applications ────────────────────────────────────
exports.getApplications = async (req, res) => {
    try {
        const {
            page = 1, limit = 20, jobId, stage, minScore, maxScore,
            sortBy = 'createdAt', order = 'desc'
        } = req.query;

        const filter = {};

        // Candidates see only their own applications
        if (req.user.role === 'user') {
            filter.candidateId = req.user._id;
        }

        if (jobId) filter.jobId = jobId;
        if (stage) filter.currentStage = stage;
        if (minScore || maxScore) {
            filter['screeningResult.matchScore'] = {};
            if (minScore) filter['screeningResult.matchScore'].$gte = parseInt(minScore);
            if (maxScore) filter['screeningResult.matchScore'].$lte = parseInt(maxScore);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

        const [applications, total] = await Promise.all([
            Application.find(filter).sort(sort).skip(skip).limit(parseInt(limit))
                .populate('jobId', 'title company department')
                .populate('candidateId', 'name email')
                .populate('resumeId', 'name skills experience')
                .lean(),
            Application.countDocuments(filter)
        ]);

        return ok(res, 'Applications fetched', applications, {
            page: parseInt(page), limit: parseInt(limit),
            total, pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        return serverError(res, 'Failed to fetch applications', error);
    }
};

// ── GET /api/v2/applications/:id ────────────────────────────────
exports.getApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId').populate('candidateId', 'name email')
            .populate('resumeId').populate('interviewId');

        if (!application) return notFound(res, 'Application not found');

        // Candidates can only view their own
        if (req.user.role === 'user' &&
            application.candidateId._id.toString() !== req.user._id.toString()) {
            return notFound(res, 'Application not found');
        }

        return ok(res, 'Application fetched', { application });
    } catch (error) {
        return serverError(res, 'Failed to fetch application', error);
    }
};

// ── PUT /api/v2/applications/:id/status ─────────────────────────
exports.updateStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const application = await Application.findById(req.params.id);
        if (!application) return notFound(res, 'Application not found');

        application.currentStage = status;
        application.stageHistory.push({
            stage: status,
            movedBy: req.user._id,
            notes: notes || ''
        });
        await application.save();

        ActivityLog.record({
            userId: req.user._id, action: 'application_status_changed',
            description: `Application moved to ${status}`,
            targetModel: 'Application', targetId: application._id
        }).catch(() => { });

        return ok(res, `Application status updated to ${status}`, { application });
    } catch (error) {
        return serverError(res, 'Failed to update application status', error);
    }
};

// ── POST /api/v2/applications/:id/screen ────────────────────────
exports.reScreen = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId').populate('resumeId');
        if (!application) return notFound(res, 'Application not found');

        const result = await aiScreeningService.screenCandidate(
            application.jobId, application.resumeId
        );

        application.screeningResult = result;
        await application.save();

        return ok(res, 'Re-screening completed', { screeningResult: result });
    } catch (error) {
        logger.error('Re-screen error', { error: error.message });
        return serverError(res, 'Failed to re-screen application', error);
    }
};

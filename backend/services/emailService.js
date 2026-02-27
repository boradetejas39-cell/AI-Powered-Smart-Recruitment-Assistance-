const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Email Service — Handles all outbound email via Nodemailer.
 *
 * Environment variables:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *
 * Falls back to a console-only mock when SMTP is not configured,
 * so the app never crashes due to missing email config.
 */

// ── Transporter Singleton ───────────────────────────────────────────

let transporter = null;

function getTransporter() {
    if (transporter) return transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10) || 587,
            secure: parseInt(process.env.SMTP_PORT, 10) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        logger.info('Email transporter configured', { host: process.env.SMTP_HOST });
    } else {
        // Mock transporter — logs to console, never throws
        transporter = {
            sendMail: async (opts) => {
                logger.info('📧 [MOCK EMAIL] Would send email', {
                    to: opts.to,
                    subject: opts.subject
                });
                return { messageId: `mock-${Date.now()}` };
            }
        };
        logger.warn('SMTP not configured — emails will be logged to console');
    }
    return transporter;
}

// ── Template Rendering ──────────────────────────────────────────────

const TEMPLATES = {
    application_received: (data) => ({
        subject: `Application Received — ${data.jobTitle || 'New Position'}`,
        html: `
      <h2>Application Received</h2>
      <p>Dear ${data.candidateName || 'Candidate'},</p>
      <p>Thank you for applying for <strong>${data.jobTitle}</strong>.</p>
      <p>Your application has been received and our team will review it shortly.</p>
      <p>Application ID: <code>${data.applicationId || 'N/A'}</code></p>
      <br><p>Best regards,<br>AI Recruiter Team</p>
    `
    }),

    shortlisted: (data) => ({
        subject: `Congratulations! You've been shortlisted — ${data.jobTitle}`,
        html: `
      <h2>You've Been Shortlisted!</h2>
      <p>Dear ${data.candidateName || 'Candidate'},</p>
      <p>We're pleased to inform you that you have been shortlisted for <strong>${data.jobTitle}</strong>.</p>
      <p>Match Score: <strong>${data.matchScore || 'N/A'}%</strong></p>
      <p>Next steps will be communicated to you soon.</p>
      <br><p>Best regards,<br>AI Recruiter Team</p>
    `
    }),

    rejected: (data) => ({
        subject: `Application Update — ${data.jobTitle}`,
        html: `
      <h2>Application Update</h2>
      <p>Dear ${data.candidateName || 'Candidate'},</p>
      <p>Thank you for your interest in <strong>${data.jobTitle}</strong>.</p>
      <p>After careful review, we have decided to move forward with other candidates.</p>
      <p>We encourage you to apply for future openings.</p>
      <br><p>Best regards,<br>AI Recruiter Team</p>
    `
    }),

    interview_scheduled: (data) => ({
        subject: `AI Interview Ready — ${data.jobTitle}`,
        html: `
      <h2>AI Interview Available</h2>
      <p>Dear ${data.candidateName || 'Candidate'},</p>
      <p>Your AI interview for <strong>${data.jobTitle}</strong> is now ready.</p>
      <p>Please complete it at your earliest convenience.</p>
      <br><p>Best regards,<br>AI Recruiter Team</p>
    `
    }),

    new_candidate_hr: (data) => ({
        subject: `New Candidate Applied — ${data.jobTitle}`,
        html: `
      <h2>New Application</h2>
      <p>A new candidate has applied for <strong>${data.jobTitle}</strong>.</p>
      <p>Candidate: <strong>${data.candidateName}</strong></p>
      <p>Match Score: <strong>${data.matchScore || 'Pending'}%</strong></p>
      <p>Log in to the dashboard to review.</p>
      <br><p>AI Recruiter System</p>
    `
    }),

    stage_change: (data) => ({
        subject: `Application Status Updated — ${data.jobTitle}`,
        html: `
      <h2>Status Update</h2>
      <p>Dear ${data.candidateName || 'Candidate'},</p>
      <p>Your application for <strong>${data.jobTitle}</strong> has moved to: <strong>${data.stage}</strong>.</p>
      ${data.notes ? `<p>Notes: ${data.notes}</p>` : ''}
      <br><p>Best regards,<br>AI Recruiter Team</p>
    `
    }),

    offer_letter: (data) => ({
        subject: `Offer Letter — ${data.jobTitle}`,
        html: `
      <h2>Congratulations!</h2>
      <p>Dear ${data.candidateName || 'Candidate'},</p>
      <p>We are pleased to offer you the position of <strong>${data.jobTitle}</strong>.</p>
      <p>Please review the details and respond at your earliest convenience.</p>
      <br><p>Best regards,<br>AI Recruiter Team</p>
    `
    }),

    password_reset: (data) => ({
        subject: 'Password Reset Request',
        html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset.</p>
      <p>Use the following link to reset your password (valid for 1 hour):</p>
      <p><a href="${data.resetUrl}">${data.resetUrl}</a></p>
      <p>If you did not request this, please ignore this email.</p>
      <br><p>AI Recruiter Team</p>
    `
    }),

    custom: (data) => ({
        subject: data.subject || 'Notification',
        html: `<p>${data.body || ''}</p>`
    })
};

// ── Public API ──────────────────────────────────────────────────────

/**
 * Send an email using a named template.
 * @param {string} to        Recipient email address
 * @param {string} template  Template key (see TEMPLATES above)
 * @param {object} data      Template variables
 * @returns {{ success: boolean, messageId?: string, error?: string }}
 */
async function sendEmail(to, template, data = {}) {
    try {
        const tmpl = TEMPLATES[template] || TEMPLATES.custom;
        const { subject, html } = tmpl(data);

        const mailOptions = {
            from: process.env.SMTP_FROM || '"AI Recruiter" <noreply@ai-recruiter.com>',
            to,
            subject,
            html
        };

        const info = await getTransporter().sendMail(mailOptions);
        logger.info('Email sent', { to, template, messageId: info.messageId });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        logger.error('Email send failed', { to, template, error: error.message });
        return { success: false, error: error.message };
    }
}

/**
 * Send notification to all HR/admin users for a given event.
 */
async function notifyHR(template, data = {}) {
    try {
        const User = require('../models/User');
        const hrUsers = await User.find({ role: { $in: ['hr', 'admin'] }, isActive: true }).select('email').lean();
        const results = await Promise.allSettled(
            hrUsers.map((u) => sendEmail(u.email, template, data))
        );
        const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        logger.info(`HR notifications sent: ${sent}/${hrUsers.length}`, { template });
        return { sent, total: hrUsers.length };
    } catch (error) {
        logger.error('notifyHR failed', { error: error.message });
        return { sent: 0, total: 0 };
    }
}

module.exports = { sendEmail, notifyHR, TEMPLATES };

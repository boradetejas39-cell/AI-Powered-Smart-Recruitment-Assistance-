/**
 * V2 API Service — Centralized calls to production backend endpoints.
 */
import api from './axios';

// ── Helper: v2 base ─────────────────────────────────────────────
const v2 = (path) => `/v2${path}`;

// ── Applications ────────────────────────────────────────────────
export const applicationAPI = {
    list: (params) => api.get(v2('/applications'), { params }),
    get: (id) => api.get(v2(`/applications/${id}`)),
    apply: (data) => api.post(v2('/applications'), data),
    updateStatus: (id, data) => api.put(v2(`/applications/${id}/status`), data),
    reScreen: (id) => api.post(v2(`/applications/${id}/screen`)),
};

// ── Interviews ──────────────────────────────────────────────────
export const interviewAPI = {
    list: (params) => api.get(v2('/interviews'), { params }),
    get: (id) => api.get(v2(`/interviews/${id}`)),
    start: (data) => api.post(v2('/interviews/start'), data),
    answer: (id, data) => api.post(v2(`/interviews/${id}/answer`), data),
    evaluate: (id) => api.post(v2(`/interviews/${id}/evaluate`)),
};

// ── Pipeline ────────────────────────────────────────────────────
export const pipelineAPI = {
    getJob: (jobId) => api.get(v2(`/pipeline/${jobId}`)),
    move: (appId, data) => api.put(v2(`/pipeline/${appId}/move`), data),
    history: (appId) => api.get(v2(`/pipeline/${appId}/history`)),
};

// ── Analytics ───────────────────────────────────────────────────
export const analyticsAPI = {
    overview: () => api.get(v2('/analytics/overview')),
    pipeline: (params) => api.get(v2('/analytics/pipeline'), { params }),
    topJobs: (limit) => api.get(v2('/analytics/top-jobs'), { params: { limit } }),
    skills: () => api.get(v2('/analytics/skills')),
    scores: () => api.get(v2('/analytics/scores')),
    monthly: (months) => api.get(v2('/analytics/monthly'), { params: { months } }),
    interviews: () => api.get(v2('/analytics/interviews')),
};

// ── Notifications ───────────────────────────────────────────────
export const notificationAPI = {
    list: (params) => api.get(v2('/notifications'), { params }),
    send: (data) => api.post(v2('/notifications/send'), data),
    markRead: (id) => api.put(v2(`/notifications/${id}/read`)),
    markAllRead: () => api.put(v2('/notifications/read-all')),
};

// ── Admin ───────────────────────────────────────────────────────
export const adminAPI = {
    getUsers: (params) => api.get(v2('/admin/users'), { params }),
    getUser: (id) => api.get(v2(`/admin/users/${id}`)),
    updateRole: (id, data) => api.put(v2(`/admin/users/${id}/role`), data),
    blockUser: (id, data) => api.put(v2(`/admin/users/${id}/block`), data),
    unblockUser: (id) => api.put(v2(`/admin/users/${id}/unblock`)),
    deleteUser: (id) => api.delete(v2(`/admin/users/${id}`)),
    activityLogs: (params) => api.get(v2('/admin/activity-logs'), { params }),
    systemStats: () => api.get(v2('/admin/system-stats')),
};

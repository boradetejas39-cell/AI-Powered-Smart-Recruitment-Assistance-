import React, { useState, useEffect, useCallback } from 'react';
import { notificationAPI } from '../../api/v2';
import {
    BellIcon,
    CheckIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    EnvelopeOpenIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';

const typeBadge = {
    application: 'bg-blue-100 text-blue-700',
    interview: 'bg-purple-100 text-purple-700',
    match: 'bg-green-100 text-green-700',
    status: 'bg-yellow-100 text-yellow-700',
    system: 'bg-gray-100 text-gray-700',
};

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, unread: 0 });
    const [filter, setFilter] = useState('all');

    const fetchNotifications = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (filter === 'unread') params.read = false;
            if (filter === 'read') params.read = true;
            const res = await notificationAPI.list(params);
            setNotifications(res.data.data || []);
            setMeta(res.data.meta || { page: 1, pages: 1, total: 0, unread: 0 });
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchNotifications(1);
    }, [fetchNotifications]);

    const handleMarkRead = async (id) => {
        try {
            await notificationAPI.markRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setMeta(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
        } catch (err) {
            console.error('Failed to mark notification read', err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationAPI.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setMeta(prev => ({ ...prev, unread: 0 }));
        } catch (err) {
            console.error('Failed to mark all notifications read', err);
        }
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <BellIcon className="h-8 w-8 text-primary-600" /> Notifications
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {meta.unread > 0 ? `${meta.unread} unread notification${meta.unread > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                {meta.unread > 0 && (
                    <button onClick={handleMarkAllRead}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                        <CheckCircleIcon className="h-4 w-4" /> Mark All Read
                    </button>
                )}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
                {['all', 'unread', 'read'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                    <BellIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No notifications</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map(n => (
                        <div key={n._id}
                            className={`bg-white rounded-xl shadow-sm border p-4 flex items-start gap-4 transition-colors ${!n.read ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200'}`}
                        >
                            <div className={`p-2 rounded-full ${!n.read ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                                {n.read ? <EnvelopeOpenIcon className="h-5 w-5" /> : <EnvelopeIcon className="h-5 w-5" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {n.type && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeBadge[n.type] || 'bg-gray-100 text-gray-700'}`}>
                                            {n.type}
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400">{timeAgo(n.createdAt)}</span>
                                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500" />}
                                </div>
                                <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.title || 'Notification'}</p>
                                {n.message && <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>}
                            </div>

                            {!n.read && (
                                <button onClick={() => handleMarkRead(n._id)}
                                    className="flex-shrink-0 text-primary-600 hover:text-primary-800 p-1 rounded-lg hover:bg-primary-50"
                                    title="Mark as read"
                                >
                                    <CheckIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta.pages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
                    <p className="text-sm text-gray-500">Page {meta.page} of {meta.pages} ({meta.total} total)</p>
                    <div className="flex gap-2">
                        <button onClick={() => fetchNotifications(meta.page - 1)} disabled={meta.page <= 1}
                            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40">
                            <ChevronLeftIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => fetchNotifications(meta.page + 1)} disabled={meta.page >= meta.pages}
                            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40">
                            <ChevronRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationList;

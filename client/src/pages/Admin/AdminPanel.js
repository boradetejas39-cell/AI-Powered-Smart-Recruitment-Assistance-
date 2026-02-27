import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/v2';
import {
    UsersIcon,
    NoSymbolIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ServerIcon,
    ClockIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';

const roleBadge = {
    admin: 'bg-red-100 text-red-700',
    hr: 'bg-blue-100 text-blue-700',
    recruiter: 'bg-purple-100 text-purple-700',
    user: 'bg-gray-100 text-gray-700',
};

const AdminPanel = () => {
    const [tab, setTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [systemStats, setSystemStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userMeta, setUserMeta] = useState({ page: 1, pages: 1, total: 0 });
    const [logMeta, setLogMeta] = useState({ page: 1, pages: 1, total: 0 });
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        if (tab === 'users') fetchUsers();
        else if (tab === 'logs') fetchLogs();
        else if (tab === 'system') fetchSystemStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: 15 };
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;
            const res = await adminAPI.getUsers(params);
            setUsers(res.data.data || []);
            setUserMeta(res.data.meta || { page: 1, pages: 1, total: 0 });
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const res = await adminAPI.activityLogs({ page, limit: 25 });
            setLogs(res.data.data || []);
            setLogMeta(res.data.meta || { page: 1, pages: 1, total: 0 });
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSystemStats = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.systemStats();
            setSystemStats(res.data.data);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminAPI.updateRole(userId, { role: newRole });
            fetchUsers(userMeta.page);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update role');
        }
    };

    const handleBlock = async (userId) => {
        if (!window.confirm('Block this user?')) return;
        try {
            await adminAPI.blockUser(userId, { reason: 'Blocked by admin' });
            fetchUsers(userMeta.page);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to block user');
        }
    };

    const handleUnblock = async (userId) => {
        try {
            await adminAPI.unblockUser(userId);
            fetchUsers(userMeta.page);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to unblock user');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Permanently delete this user? This cannot be undone.')) return;
        try {
            await adminAPI.deleteUser(userId);
            fetchUsers(userMeta.page);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const tabs = [
        { key: 'users', label: 'Users', icon: UsersIcon },
        { key: 'logs', label: 'Activity Logs', icon: ClockIcon },
        { key: 'system', label: 'System Stats', icon: ServerIcon },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-500 mt-1">User management, logs & system monitoring</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                {tabs.map(t => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Icon className="h-4 w-4" /> {t.label}
                        </button>
                    );
                })}
            </div>

            {/* USERS TAB */}
            {tab === 'users' && (
                <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
                        <div className="relative flex-1 max-w-xs">
                            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchUsers(1)}
                                placeholder="Search users..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); }}
                            className="rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500">
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="hr">HR</option>
                            <option value="recruiter">Recruiter</option>
                            <option value="user">User</option>
                        </select>
                        <button onClick={() => fetchUsers(1)} className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 flex items-center gap-1">
                            <ArrowPathIcon className="h-4 w-4" /> Search
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map(u => (
                                        <tr key={u._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900">{u.name}</p>
                                                <p className="text-xs text-gray-500">{u.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                    className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${roleBadge[u.role] || 'bg-gray-100'}`}
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="hr">HR</option>
                                                    <option value="recruiter">Recruiter</option>
                                                    <option value="user">User</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.isBlocked ? (
                                                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Blocked</span>
                                                ) : (
                                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {u.isBlocked ? (
                                                    <button onClick={() => handleUnblock(u._id)} className="text-green-600 hover:text-green-800 text-xs font-medium">
                                                        Unblock
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleBlock(u._id)} className="text-yellow-600 hover:text-yellow-800 text-xs font-medium">
                                                        <NoSymbolIcon className="h-4 w-4 inline" /> Block
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:text-red-800 text-xs font-medium">
                                                    <TrashIcon className="h-4 w-4 inline" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {userMeta.pages > 1 && (
                                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
                                    <p className="text-sm text-gray-500">Page {userMeta.page} of {userMeta.pages} ({userMeta.total} users)</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => fetchUsers(userMeta.page - 1)} disabled={userMeta.page <= 1}
                                            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40">
                                            <ChevronLeftIcon className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => fetchUsers(userMeta.page + 1)} disabled={userMeta.page >= userMeta.pages}
                                            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40">
                                            <ChevronRightIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* LOGS TAB */}
            {tab === 'logs' && (
                loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {logs.map(log => (
                                    <tr key={log._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-3 text-sm text-gray-900">{log.userId?.name || 'System'}</td>
                                        <td className="px-6 py-3"><span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{log.action}</span></td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{log.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {logMeta.pages > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
                                <p className="text-sm text-gray-500">Page {logMeta.page} of {logMeta.pages}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => fetchLogs(logMeta.page - 1)} disabled={logMeta.page <= 1}
                                        className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40">
                                        <ChevronLeftIcon className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => fetchLogs(logMeta.page + 1)} disabled={logMeta.page >= logMeta.pages}
                                        className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40">
                                        <ChevronRightIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            )}

            {/* SYSTEM STATS TAB */}
            {tab === 'system' && (
                loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                    </div>
                ) : systemStats && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { label: 'Users', value: systemStats.users?.total || 0 },
                                { label: 'Jobs', value: systemStats.jobs || 0 },
                                { label: 'Applications', value: systemStats.applications || 0 },
                                { label: 'Interviews', value: systemStats.interviews || 0 },
                                { label: 'Resumes', value: systemStats.resumes || 0 },
                            ].map((s, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                    <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Users by Role */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Users by Role</h3>
                            <div className="flex gap-4 flex-wrap">
                                {Object.entries(systemStats.users?.byRole || {}).map(([role, count]) => (
                                    <div key={role} className={`px-4 py-2 rounded-lg ${roleBadge[role] || 'bg-gray-100'}`}>
                                        <span className="text-lg font-bold">{count}</span>
                                        <span className="ml-2 text-sm capitalize">{role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Server Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Server Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Uptime</p>
                                    <p className="font-medium text-gray-900">{Math.round((systemStats.server?.uptime || 0) / 3600)} hours</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Memory (RSS)</p>
                                    <p className="font-medium text-gray-900">{Math.round((systemStats.server?.memory?.rss || 0) / 1024 / 1024)} MB</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Node Version</p>
                                    <p className="font-medium text-gray-900">{systemStats.server?.nodeVersion}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default AdminPanel;

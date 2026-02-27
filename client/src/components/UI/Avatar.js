import React from 'react';

export const Avatar = ({ src, alt, size = 'md', className = '', fallback = 'U', status }) => {
    const sizeClass = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
    }[size];

    return (
        <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-medium overflow-hidden ${sizeClass} ${className}`}>
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
                <span>{fallback.charAt(0).toUpperCase()}</span>
            )}
            {status && (
                <span className={`absolute bottom-0 right-0 rounded-full border-2 border-white ${status === 'online' ? 'bg-green-500' :
                    status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-500'
                    } ${size === 'xs' ? 'h-1.5 w-1.5' :
                        size === 'sm' ? 'h-2 w-2' :
                            'h-2.5 w-2.5'
                    }`} />
            )}
        </div>
    );
};

export const AvatarGroup = ({ avatars = [], max = 3, size = 'sm' }) => {
    const displayed = avatars.slice(0, max);
    const remaining = avatars.length - max;

    return (
        <div className="flex -space-x-2">
            {displayed.map((avatar, index) => (
                <Avatar
                    key={index}
                    {...avatar}
                    size={size}
                    className="ring-2 ring-white"
                />
            ))}
            {remaining > 0 && (
                <div className="relative flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium ring-2 ring-white h-10 w-10 text-sm">
                    +{remaining}
                </div>
            )}
        </div>
    );
};

export const Badge = ({ children, variant = 'default', icon: Icon, className = '' }) => {
    const variantClass = {
        default: 'bg-gray-100 text-gray-900',
        primary: 'bg-blue-100 text-blue-900',
        success: 'bg-green-100 text-green-900',
        warning: 'bg-yellow-100 text-yellow-900',
        danger: 'bg-red-100 text-red-900',
        info: 'bg-cyan-100 text-cyan-900',
    }[variant];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 ${variantClass} ${className}`}>
            {Icon && <Icon className="h-3 w-3" />}
            {children}
        </span>
    );
};

export const StatusBadge = ({ status, className = '' }) => {
    const config = {
        active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
        inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
        approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approved' },
        rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}>
            <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: 'currentColor' }} />
            {config.label}
        </span>
    );
};

export const Tag = ({ children, onRemove, variant = 'default', className = '' }) => {
    const variantClass = {
        default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        success: 'bg-green-100 text-green-800 hover:bg-green-200',
    }[variant];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm gap-2 transition-colors ${variantClass} ${className}`}>
            {children}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="hover:text-current focus:outline-none"
                >
                    ×
                </button>
            )}
        </span>
    );
};

import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
    const config = {
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: InformationCircleIcon,
            iconColor: 'text-blue-500',
            titleColor: 'text-blue-900',
            textColor: 'text-blue-800'
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: CheckCircleIcon,
            iconColor: 'text-green-500',
            titleColor: 'text-green-900',
            textColor: 'text-green-800'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            icon: ExclamationTriangleIcon,
            iconColor: 'text-yellow-500',
            titleColor: 'text-yellow-900',
            textColor: 'text-yellow-800'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            icon: XCircleIcon,
            iconColor: 'text-red-500',
            titleColor: 'text-red-900',
            textColor: 'text-red-800'
        }
    }[type];

    const Icon = config.icon;

    return (
        <div className={`${config.bg} border ${config.border} rounded-lg p-4 flex gap-4 ${className}`}>
            <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
            <div className="flex-1">
                {title && <p className={`font-medium ${config.titleColor}`}>{title}</p>}
                {message && <p className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>{message}</p>}
            </div>
            {onClose && (
                <button onClick={onClose} className={`flex-shrink-0 ${config.iconColor} hover:opacity-75`}>
                    <XCircleIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
    <div className={`text-center py-12 ${className}`}>
        {Icon && (
            <div className="flex justify-center mb-4">
                <Icon className="h-12 w-12 text-gray-400" />
            </div>
        )}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
        {action && (
            <div className="mt-6">
                {action}
            </div>
        )}
    </div>
);

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClass = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    }[size];

    return (
        <svg className={`animate-spin ${sizeClass} text-blue-600 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
};

export const Breadcrumb = ({ items }) => (
    <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
            {items.map((item, index) => (
                <li key={index}>
                    <div className="flex items-center">
                        {index > 0 && (
                            <span className="text-gray-400 mx-2">/</span>
                        )}
                        {item.href ? (
                            <a href={item.href} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                {item.label}
                            </a>
                        ) : (
                            <span className="text-sm font-medium text-gray-900">
                                {item.label}
                            </span>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    </nav>
);

export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
                <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${className}`}>
                    {title && (
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                {title}
                            </h3>
                        </div>
                    )}
                    <div className="px-4 py-4 sm:px-6 sm:py-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

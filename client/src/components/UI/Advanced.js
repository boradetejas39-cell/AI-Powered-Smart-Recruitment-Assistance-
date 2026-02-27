import React, { useState } from 'react';

export const Dropdown = ({ button, items = [], align = 'left', className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative inline-block text-left ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center"
            >
                {button}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className={`absolute z-50 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 ${align === 'right' ? 'right-0' : 'left-0'
                        }`}>
                        <div className="py-1">
                            {items.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        item.onClick?.();
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                                >
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export const Tooltip = ({ content, children, position = 'top', className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClass = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2',
    }[position];

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>

            {isVisible && (
                <div className={`absolute ${positionClass} left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs py-2 px-3 rounded-lg z-50`}>
                    {content}
                </div>
            )}
        </div>
    );
};

export const Table = ({ columns, data, rowAction, className = '' }) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-6 py-3 text-left font-medium text-gray-700"
                            >
                                {col.label}
                            </th>
                        ))}
                        {rowAction && <th className="px-6 py-3 text-left font-medium text-gray-700">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            {columns.map((col) => (
                                <td
                                    key={`${rowIndex}-${col.key}`}
                                    className="px-6 py-4"
                                >
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                            {rowAction && (
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {rowAction.map((action, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => action.onClick(row)}
                                                className={`text-xs font-medium px-3 py-1 rounded transition-colors ${action.variant === 'danger'
                                                    ? 'text-red-600 hover:bg-red-50'
                                                    : 'text-blue-600 hover:bg-blue-50'
                                                    }`}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const Divider = ({ text, className = '' }) => {
    return (
        <div className={`flex items-center gap-4 ${className}`}>
            <div className="flex-1 h-px bg-gray-200" />
            {text && <span className="text-sm text-gray-600">{text}</span>}
            <div className="flex-1 h-px bg-gray-200" />
        </div>
    );
};

export const Stat = ({ label, value, icon: Icon, color = 'blue' }) => {
    const colorClass = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600',
    }[color];

    return (
        <div className="flex items-center gap-4">
            {Icon && (
                <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                </div>
            )}
            <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export const KeyValue = ({ label, value, className = '' }) => (
    <div className={className}>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="mt-1 text-sm text-gray-900 font-medium">{value}</p>
    </div>
);

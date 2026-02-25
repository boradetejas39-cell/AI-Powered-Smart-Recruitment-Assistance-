import React from 'react';

export const Input = React.forwardRef(({
    type = 'text',
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}, ref) => (
    <div className="w-full">
        {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
        )}
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
            )}
            <input
                ref={ref}
                type={type}
                className={`w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
                {...props}
            />
        </div>
        {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
    </div>
));

Input.displayName = 'Input';

export const Select = React.forwardRef(({
    label,
    error,
    options = [],
    className = '',
    ...props
}, ref) => (
    <div className="w-full">
        {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
        )}
        <select
            ref={ref}
            className={`w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors appearance-none bg-white cursor-pointer ${error ? 'border-red-500' : ''} ${className}`}
            {...props}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
    </div>
));

Select.displayName = 'Select';

export const Textarea = React.forwardRef(({
    label,
    error,
    className = '',
    ...props
}, ref) => (
    <div className="w-full">
        {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
        )}
        <textarea
            ref={ref}
            className={`w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none ${error ? 'border-red-500' : ''} ${className}`}
            {...props}
        />
        {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
    </div>
));

Textarea.displayName = 'Textarea';

export const Tabs = ({ tabs, activeTab, onChange }) => (
    <div>
        <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${activeTab === tab.id
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-600 border-transparent hover:text-gray-900'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    </div>
);

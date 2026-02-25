import React from 'react';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    ...props
}) => {
    const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const sizeClass = {
        xs: 'px-3 py-1.5 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-3.5 text-base'
    }[size];

    const variantClass = {
        primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:opacity-50',
        success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg hover:from-green-700 hover:to-green-800 focus:ring-green-500 disabled:opacity-50',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:from-red-700 hover:to-red-800 focus:ring-red-500 disabled:opacity-50',
        warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-500 disabled:opacity-50',
        outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:opacity-50',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:opacity-50',
    }[variant];

    return (
        <button
            className={`${baseClass} ${sizeClass} ${variantClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {children && <span className="ml-2">{children}</span>}
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className="h-4 w-4 mr-2" />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon className="h-4 w-4 ml-2" />}
                </>
            )}
        </button>
    );
};

export const IconButton = ({ icon: Icon, variant = 'secondary', size = 'md', className = '', ...props }) => {
    const baseClass = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const sizeClass = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-2.5',
    }[size];

    const variantClass = {
        primary: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        secondary: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
        danger: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
    }[variant];

    return (
        <button className={`${baseClass} ${sizeClass} ${variantClass} ${className}`} {...props}>
            <Icon className="h-5 w-5" />
        </button>
    );
};

export default Button;

import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => (
    <div
        className={`bg-white rounded-xl shadow-sm border border-gray-100 ${hover ? 'hover:shadow-md transition-shadow' : ''} ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
        {children}
    </div>
);

export const CardBody = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl ${className}`}>
        {children}
    </div>
);

export const StatCard = ({ icon: Icon, label, value, subtext, trend, trendColor = 'green' }) => (
    <Card className="overflow-hidden" hover>
        <CardBody>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm font-medium ${trendColor === 'green' ? 'text-green-600' :
                                trendColor === 'red' ? 'text-red-600' :
                                    'text-blue-600'
                            }`}>
                            {trend}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-lg ${trendColor === 'green' ? 'bg-green-100' :
                            trendColor === 'red' ? 'bg-red-100' :
                                'bg-blue-100'
                        }`}>
                        <Icon className={`h-6 w-6 ${trendColor === 'green' ? 'text-green-600' :
                                trendColor === 'red' ? 'text-red-600' :
                                    'text-blue-600'
                            }`} />
                    </div>
                )}
            </div>
        </CardBody>
    </Card>
);

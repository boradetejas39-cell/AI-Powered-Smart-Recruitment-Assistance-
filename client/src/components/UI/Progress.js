import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const Progress = ({ value, max = 100, size = 'md', showLabel = false, color = 'blue', animated = true, className = '' }) => {
    const percentage = (value / max) * 100;

    const sizeClass = {
        xs: 'h-1',
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    }[size];

    const colorClass = {
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        red: 'bg-red-600',
        yellow: 'bg-yellow-600',
        purple: 'bg-purple-600',
    }[color];

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-600">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClass}`}>
                <div
                    className={`${colorClass} ${sizeClass} rounded-full transition-all duration-300 ${animated ? 'animate-pulse' : ''}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export const ProgressBar = ({ steps, currentStep, className = '' }) => {
    return (
        <div className={`flex items-center ${className}`}>
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        <div className={`flex items-center justify-center h-10 w-10 rounded-full font-medium transition-all ${index < currentStep
                                ? 'bg-green-600 text-white'
                                : index === currentStep
                                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                            {index < currentStep ? '✓' : index + 1}
                        </div>
                        <span className="text-xs font-medium mt-2 text-center text-gray-600 w-20">{step}</span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                            }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export const Pagination = ({ currentPage, totalPages, onChange, showInfo = true, className = '' }) => {
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className={`flex items-center justify-between ${className}`}>
            {showInfo && (
                <div className="text-sm text-gray-600">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </div>
            )}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onChange(currentPage - 1)}
                    disabled={!canGoPrev}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </button>

                <div className="flex gap-1">
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => onChange(page)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onChange(currentPage + 1)}
                    disabled={!canGoNext}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export const Skeleton = ({ height = 'h-4', width = 'w-full', count = 1, className = '' }) => {
    return (
        <div className={className}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={`${height} ${width} bg-gray-200 rounded-lg animate-pulse mb-2`} />
            ))}
        </div>
    );
};

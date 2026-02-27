import React from 'react';

export const Header = ({ logo, title, actions, className = '' }) => {
    return (
        <header className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {logo && <div className="text-2xl font-bold text-blue-600">{logo}</div>}
                    {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
        </header>
    );
};

export const Sidebar = ({ items, logo, className = '' }) => {
    return (
        <aside className={`w-64 bg-gray-900 text-white h-screen flex flex-col overflow-y-auto ${className}`}>
            {logo && (
                <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="text-xl font-bold">{logo}</h2>
                </div>
            )}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {items.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${item.active
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                            }`}
                    >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
        </aside>
    );
};

export const Footer = ({ copyright, links, className = '' }) => {
    return (
        <footer className={`bg-gray-900 text-gray-400 border-t border-gray-800 ${className}`}>
            <div className="px-6 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        {copyright && <p className="text-sm">{copyright}</p>}
                    </div>
                    {links && (
                        <div className="flex gap-6">
                            {links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="text-sm hover:text-white transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
};

export const Container = ({ children, className = '' }) => (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
    </div>
);

export const PageHeader = ({ title, description, action, className = '' }) => (
    <div className={`mb-8 ${className}`}>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-2 text-gray-600">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
    </div>
);

export const Section = ({ title, children, className = '' }) => (
    <div className={className}>
        {title && <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>}
        {children}
    </div>
);

export const Grid = ({ columns = 3, gap = 4, children, className = '' }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-${gap} ${className}`}>
        {children}
    </div>
);

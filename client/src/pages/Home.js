import React from 'react';
import { Link } from 'react-router-dom';
import {
    SparklesIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    ChartBarIcon,
    UserGroupIcon,
    ArrowRightIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/UI/Button';

const Home = () => {
    const features = [
        {
            icon: SparklesIcon,
            title: 'AI-Powered Matching',
            description: 'Advanced AI algorithms analyze resumes and intelligently match candidates with job openings'
        },
        {
            icon: DocumentTextIcon,
            title: 'Resume Parsing',
            description: 'Automatically extract and parse resume data from multiple formats with high accuracy'
        },
        {
            icon: UserGroupIcon,
            title: 'Talent Pool Management',
            description: 'Organize and manage your growing candidate database efficiently'
        },
        {
            icon: BriefcaseIcon,
            title: 'Job Posting',
            description: 'Create and manage job listings with comprehensive screening criteria'
        },
        {
            icon: ChartBarIcon,
            title: 'Analytics & Insights',
            description: 'Get detailed analytics on hiring performance and candidate trends'
        },
        {
            icon: SparklesIcon,
            title: 'Smart Recommendations',
            description: 'Receive AI-powered recommendations for the best candidate matches'
        }
    ];

    const benefits = [
        'Save 80% of time on resume screening',
        'Improve hiring quality with data-driven decisions',
        'Reduce hiring costs significantly',
        'Streamline your entire recruitment workflow',
        'Access detailed candidate analytics',
        'Make better hiring decisions faster'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/10 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                                <SparklesIcon className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">AI Recruiter</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-white hover:text-primary-200 transition">
                                Sign In
                            </Link>
                            <Link to="/register">
                                <Button variant="primary">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Transform Your Hiring with <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">AI Intelligence</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Automate resume screening, find perfect candidates faster, and make data-driven hiring decisions. Let AI power your recruitment.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register">
                            <Button variant="primary" size="lg">
                                Start Free Trial <ArrowRightIcon className="h-5 w-5 ml-2" />
                            </Button>
                        </Link>
                        <button className="px-8 py-3.5 text-base font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors">
                            Watch Demo
                        </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-4">No credit card required. Start hiring smarter today.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary-400 mb-2">10,000+</p>
                        <p className="text-gray-300">Resumes Processed</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary-400 mb-2">95%</p>
                        <p className="text-gray-300">Match Accuracy</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary-400 mb-2">500+</p>
                        <p className="text-gray-300">Happy Companies</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
                    <p className="text-gray-300">Everything you need to modernize your recruitment process</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 hover:border-primary-400 hover:bg-white/20 transition-all duration-300"
                            >
                                <div className="h-12 w-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:bg-primary-500/40 transition-colors mb-4">
                                    <Icon className="h-6 w-6 text-primary-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-8">Why Choose AI Recruiter?</h2>
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-gray-300 text-lg">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-400/30 rounded-2xl p-12 flex flex-col items-center justify-center h-96">
                        <BriefcaseIcon className="h-24 w-24 text-primary-400 opacity-50 mb-4" />
                        <p className="text-center text-gray-300">Simplified recruitment workflow</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to revolutionize your hiring?</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join hundreds of companies using AI Recruiter to find their perfect candidates faster and smarter.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button variant="primary" size="lg">Start Your Free Trial</Button>
                        </Link>
                        <button className="px-6 py-3 text-base font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button className="hover:text-white transition">Features</button></li>
                                <li><button className="hover:text-white transition">Pricing</button></li>
                                <li><button className="hover:text-white transition">Security</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button className="hover:text-white transition">About</button></li>
                                <li><button className="hover:text-white transition">Blog</button></li>
                                <li><button className="hover:text-white transition">Careers</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button className="hover:text-white transition">Privacy</button></li>
                                <li><button className="hover:text-white transition">Terms</button></li>
                                <li><button className="hover:text-white transition">Contact</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button className="hover:text-white transition">Twitter</button></li>
                                <li><button className="hover:text-white transition">LinkedIn</button></li>
                                <li><button className="hover:text-white transition">GitHub</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 flex justify-between items-center">
                        <p className="text-gray-400">© 2026 AI Recruiter. All rights reserved.</p>
                        <div className="flex items-center space-x-2">
                            <div className="h-6 w-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                                <SparklesIcon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-white font-semibold">AI Recruiter</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

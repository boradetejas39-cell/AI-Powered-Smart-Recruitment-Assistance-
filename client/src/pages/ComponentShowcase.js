import React, { useState } from 'react';
import {
    Button,
    Card,
    CardBody,
    Badge,
    Avatar,
    Progress,
    Pagination,
    Alert,
    LoadingSpinner,
    Input,
    Select,
    Textarea,
    StatusBadge,
    Tag,
} from '../components/UI';
import { UserIcon } from '@heroicons/react/24/outline';

export const ComponentShowcase = () => {
    const [currentPage, setCurrentPage] = useState(1);
    // Form data state available for future use
    const [/* formData */, /* setFormData */] = useState({
        name: '',
        email: '',
        message: ''
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Component Library</h1>
                    <p className="text-lg text-gray-600">Beautiful, accessible, and reusable UI components</p>
                </div>

                {/* Buttons Section */}
                <Card className="mb-8 hover">
                    <CardBody>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Buttons</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-3">Variants</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="primary">Primary</Button>
                                    <Button variant="secondary">Secondary</Button>
                                    <Button variant="success">Success</Button>
                                    <Button variant="danger">Danger</Button>
                                    <Button variant="outline">Outline</Button>
                                    <Button variant="ghost">Ghost</Button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-3">Sizes</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm">Small</Button>
                                    <Button size="md">Medium</Button>
                                    <Button size="lg">Large</Button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Badges Section */}
                <Card className="mb-8 hover">
                    <CardBody>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Badges & Tags</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-3">Badges</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="default">Default</Badge>
                                    <Badge variant="primary">Primary</Badge>
                                    <Badge variant="success">Success</Badge>
                                    <Badge variant="warning">Warning</Badge>
                                    <Badge variant="danger">Danger</Badge>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-3">Status Badges</h3>
                                <div className="flex flex-wrap gap-2">
                                    <StatusBadge status="active" />
                                    <StatusBadge status="inactive" />
                                    <StatusBadge status="pending" />
                                    <StatusBadge status="approved" />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Avatars Section */}
                <Card className="mb-8 hover">
                    <CardBody>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Avatars</h2>
                        <div className="flex items-center gap-6">
                            <Avatar size="xs" fallback="JD" />
                            <Avatar size="sm" fallback="JD" />
                            <Avatar size="md" fallback="JD" />
                            <Avatar size="lg" fallback="JD" />
                            <Avatar size="xl" fallback="JD" />
                            <Avatar size="lg" fallback="JD" status="online" />
                            <Avatar size="lg" fallback="JD" status="away" />
                        </div>
                    </CardBody>
                </Card>

                {/* Progress Section */}
                <Card className="mb-8 hover">
                    <CardBody>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Progress</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-3">Progress Bar</h3>
                                <Progress value={65} max={100} showLabel />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-3">Progress Colors</h3>
                                <div className="space-y-3">
                                    <Progress value={50} color="blue" />
                                    <Progress value={70} color="green" />
                                    <Progress value={30} color="red" />
                                    <Progress value={85} color="yellow" />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Pagination Section */}
                <Card className="mb-8 hover">
                    <CardBody>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Pagination</h2>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={10}
                            onChange={setCurrentPage}
                        />
                    </CardBody>
                </Card>

                {/* Alerts Section */}
                <Card className="mb-8 hover">
                    <CardBody>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Alerts</h2>
                        <div className="space-y-3">
                            <Alert type="info" title="Info Alert" message="This is an informational message" />
                            <Alert type="success" title="Success Alert" message="Your action was successful" />
                            <Alert type="warning" title="Warning Alert" message="Please be careful with this action" />
                            <Alert type="error" title="Error Alert" message="Something went wrong" />
                        </div>
                    </CardBody>
                </Card>

                {/* Forms Section */}
                <Card className="mb-8 hover">
                    <CardBody>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Form Elements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                icon={UserIcon}
                            />
                            <Input
                                label="Email"
                                type="email"
                                placeholder="john@example.com"
                            />
                            <Select
                                label="Select Option"
                                options={[
                                    { value: 'opt1', label: 'Option 1' },
                                    { value: 'opt2', label: 'Option 2' },
                                    { value: 'opt3', label: 'Option 3' },
                                ]}
                            />
                            <Input
                                label="Search"
                                placeholder="Type something..."
                            />
                        </div>
                        <div className="mt-6">
                            <Textarea
                                label="Message"
                                placeholder="Enter your message..."
                                rows="4"
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* Loading States */}
                <Card className="mb-8 hover">
                    <CardBody>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Loading States</h2>
                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <LoadingSpinner size="sm" />
                                <p className="text-xs text-gray-600 mt-2">Small</p>
                            </div>
                            <div className="text-center">
                                <LoadingSpinner size="md" />
                                <p className="text-xs text-gray-600 mt-2">Medium</p>
                            </div>
                            <div className="text-center">
                                <LoadingSpinner size="lg" />
                                <p className="text-xs text-gray-600 mt-2">Large</p>
                            </div>
                            <div className="text-center">
                                <Button loading>Loading...</Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Tags Section */}
                <Card className="hover">
                    <CardBody>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Tags</h2>
                        <div className="flex flex-wrap gap-2">
                            <Tag variant="default">React</Tag>
                            <Tag variant="primary">JavaScript</Tag>
                            <Tag variant="success">Web Design</Tag>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ComponentShowcase;

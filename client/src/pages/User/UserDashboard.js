import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

const UserDashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userResumes, setUserResumes] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileResponse = await api.get('/auth/profile');
      setUserProfile(profileResponse.data.data.user);
      
      // Fetch user's resumes
      const resumesResponse = await api.get('/resumes/my');
      setUserResumes(resumesResponse.data.data.resumes || []);
      
      // Fetch applied jobs
      const applicationsResponse = await api.get('/jobs/my-applications');
      setAppliedJobs(applicationsResponse.data.data.applications || []);
      
      // Fetch available jobs
      const jobsResponse = await api.get('/jobs');
      setAvailableJobs(jobsResponse.data.data.jobs || []);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      // Check if user has a resume
      if (userResumes.length === 0) {
        alert('Please upload a resume before applying for jobs');
        return;
      }
      
      // Use first resume for application
      const resumeId = userResumes[0]._id;
      
      await api.post('/jobs/apply', {
        jobId,
        resumeId,
        coverLetter: 'I am interested in this position and would like to discuss further.'
      });
      
      alert('Application submitted successfully!');
      fetchUserData(); // Refresh data
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Error applying for job. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
        <p className="text-gray-600">Manage your profile and job applications</p>
      </div>

      {/* User Profile Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <UserIcon className="h-5 w-5 mr-2" />
            Your Profile
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                <div className="text-gray-600 font-bold text-xl">
                  {userProfile?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{userProfile?.name}</h3>
              <p className="text-sm text-gray-500">{userProfile?.email}</p>
              {userProfile?.phone && (
                <p className="text-sm text-gray-500">{userProfile.phone}</p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Resumes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                My Resumes
              </h2>
              <Link to="/app/user/resumes/upload" className="btn-primary btn-sm">
                <PlusIcon className="h-4 w-4 mr-1" />
                Upload
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {userResumes.length === 0 ? (
              <div className="text-center py-8">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes uploaded</h3>
                <p className="mt-1 text-sm text-gray-500">Upload your resume to apply for jobs</p>
                <Link to="/app/user/resumes/upload" className="btn-primary mt-4">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Upload Resume
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userResumes.map((resume) => (
                  <div key={resume._id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{resume.candidateName}</h4>
                        <p className="text-sm text-gray-500">
                          {resume.skills?.slice(0, 3).join(', ')}
                          {resume.skills?.length > 3 && ` +${resume.skills.length - 3} more`}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Uploaded: {formatDate(resume.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Applied Jobs */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              Applied Jobs
            </h2>
          </CardHeader>
          <CardBody>
            {appliedJobs.length === 0 ? (
              <div className="text-center py-8">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start applying for jobs to track your applications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appliedJobs.map((application) => (
                  <div key={application._id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{application.jobTitle}</h4>
                        <p className="text-sm text-gray-500">{application.company}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {application.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            Applied: {formatDate(application.appliedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Available Jobs */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-2" />
            Available Jobs
          </h2>
        </CardHeader>
        <CardBody>
          {availableJobs.length === 0 ? (
            <div className="text-center py-8">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableJobs.slice(0, 5).map((job) => (
                <div key={job._id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.company}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {job.jobType}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button
                        onClick={() => handleApplyJob(job._id)}
                        className="btn-primary"
                        disabled={userResumes.length === 0}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {availableJobs.length > 5 && (
                <div className="text-center mt-4">
                  <Link to="/app/jobs" className="btn-outline">
                    View All Jobs
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default UserDashboard;

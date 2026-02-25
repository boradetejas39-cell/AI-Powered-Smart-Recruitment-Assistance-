import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  BriefcaseIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

const JobApply = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [userResumes, setUserResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobData();
  }, [jobId]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      
      // Fetch job details
      const jobResponse = await api.get(`/jobs/${jobId}`);
      setJob(jobResponse.data.data.job);
      
      // Fetch user's resumes
      const resumesResponse = await api.get('/resumes/my');
      setUserResumes(resumesResponse.data.data.resumes || []);
      
    } catch (error) {
      console.error('Error fetching job data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!selectedResume) {
      alert('Please select a resume to apply');
      return;
    }

    setApplying(true);
    
    try {
      await api.post('/jobs/apply', {
        jobId,
        resumeId: selectedResume,
        coverLetter
      });
      
      alert('Application submitted successfully!');
      // Redirect to dashboard
      window.location.href = '/app/user/dashboard';
      
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setApplying(false);
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

  if (!job) {
    return (
      <div className="space-y-6">
        <div>
          <Link to="/app/user/jobs" className="btn-outline mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Job Not Found</h1>
          <p className="text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/app/user/jobs" className="btn-outline mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Apply for Job</h1>
        <p className="text-gray-600">Submit your application for this position</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                Job Details
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {job.jobType}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <span className="h-4 w-4 mr-1">📅</span>
                    Posted: {formatDate(job.createdAt)}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                  <p className="text-gray-600 line-clamp-4">{job.description}</p>
                </div>
                
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Application Form */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Your Application
              </h2>
            </CardHeader>
            <CardBody>
              {userResumes.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Resumes Available</h3>
                  <p className="mt-1 text-sm text-gray-500">You need to upload a resume before applying for jobs</p>
                  <Link to="/app/user/resumes/upload" className="btn-primary mt-4">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Upload Resume
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6">
                  {/* Resume Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Resume *
                    </label>
                    <select
                      className="input"
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                      required
                    >
                      <option value="">Choose a resume...</option>
                      {userResumes.map((resume) => (
                        <option key={resume._id} value={resume._id}>
                          {resume.candidateName} - {formatDate(resume.createdAt)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      className="input"
                      rows={6}
                      placeholder="Tell us why you're interested in this position..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={!selectedResume || applying}
                      className="btn-primary w-full"
                    >
                      {applying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobApply;

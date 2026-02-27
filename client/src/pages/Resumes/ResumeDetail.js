import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TagIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const ResumeDetail = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchResumeDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/resumes/${id}`);
      setResume(response.data.data.resume || response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching resume details:', err);
      setError('Failed to load resume details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the resume for ${resume.candidateName}? This action cannot be undone.`)) {
      try {
        await api.delete(`/resumes/${id}`);
        window.location.href = '/app/resumes';
      } catch (error) {
        console.error('Error deleting resume:', error);
        alert('Error deleting resume. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatExperience = (experience) => {
    if (!experience || experience.length === 0) return 'No experience';

    const totalYears = experience.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      return total + years;
    }, 0);

    return `${Math.round(totalYears * 10) / 10} years`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'inactive':
        return 'bg-warning-100 text-warning-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
        <Link to="/app/resumes" className="btn-primary">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Resumes
        </Link>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Not Found</h1>
          <p className="text-gray-600">The requested resume could not be found.</p>
        </div>
        <Link to="/app/resumes" className="btn-primary">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Resumes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/app/resumes" className="btn-outline mb-4 inline-flex">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Resumes
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Resume Details</h1>
          <p className="text-gray-600">View candidate resume information</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-outline">
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn-danger"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Candidate Information */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Candidate Information</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-16 w-16">
                  <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{resume.candidateName}</h3>
                  <span className={`badge ${getStatusColor(resume.status)}`}>
                    {resume.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{resume.email}</span>
              </div>
              {resume.phone && (
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{resume.phone}</span>
                </div>
              )}
              {resume.currentLocation && (
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{resume.currentLocation}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">Uploaded: {formatDate(resume.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TagIcon className="h-5 w-5 mr-2" />
              Skills
            </h2>
          </div>
          <div className="card-body">
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              Work Experience
            </h2>
            <p className="text-sm text-gray-600">Total: {formatExperience(resume.experience)}</p>
          </div>
          <div className="card-body space-y-4">
            {resume.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-primary-200 pl-4">
                <h3 className="font-medium text-gray-900">{exp.company}</h3>
                {exp.position && (
                  <p className="text-gray-600">{exp.position}</p>
                )}
                {exp.startDate && (
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </p>
                )}
                {exp.description && (
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Education
            </h2>
          </div>
          <div className="card-body space-y-4">
            {resume.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-secondary-200 pl-4">
                <h3 className="font-medium text-gray-900">{edu.institution}</h3>
                {edu.degree && (
                  <p className="text-gray-600">{edu.degree}</p>
                )}
                {edu.field && (
                  <p className="text-gray-600">{edu.field}</p>
                )}
                {edu.year && (
                  <p className="text-sm text-gray-500">Year: {edu.year}</p>
                )}
                {edu.gpa && (
                  <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Information */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            File Information
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">File Name</p>
              <p className="text-gray-900">{resume.fileName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">File Type</p>
              <p className="text-gray-900">{resume.fileType?.toUpperCase() || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetail;

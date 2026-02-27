import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(file);
    setParsedData(null);
  };

  const removeFile = () => {
    setFile(null);
    setParsedData(null);
    setJobMatches([]);
    setUploadProgress(0);
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await api.post('/resumes/upload', formData, {
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setParsedData(response.data.data.resume);
      // Capture job matches from response
      if (response.data.matches && response.data.matches.length > 0) {
        setJobMatches(response.data.matches);
        toast.success(`Resume uploaded! Matched with ${response.data.matches.length} job(s)`);
      } else {
        setJobMatches([]);
        toast.success('Resume uploaded and parsed successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const goToResumeDetail = () => {
    if (parsedData) {
      navigate(`/app/resumes/${parsedData._id}`);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>
        <p className="text-gray-600">Upload and parse candidate resumes for AI matching</p>
      </div>

      {/* Upload Area */}
      <div className="card">
        <div className="card-body">
          {!file ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive
                ? 'border-primary-400 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="btn-primary">
                    Select a file
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="mt-2 text-sm text-gray-600">
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF or DOCX up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={uploading}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="text-gray-900">{uploadProgress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {!uploading && !parsedData && (
                <div className="flex justify-center">
                  <button onClick={uploadFile} className="btn-primary">
                    Upload and Parse Resume
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Parsed Data Preview */}
      {parsedData && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Parsed Resume Data
            </h3>
            <p className="text-sm text-gray-600">
              Review the extracted information below
            </p>
          </div>
          <div className="card-body space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Basic Information</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{parsedData.candidateName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{parsedData.email}</dd>
                  </div>
                  {parsedData.phone && (
                    <div>
                      <dt className="text-xs text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{parsedData.phone}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Experience</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs text-gray-500">Total Experience</dt>
                    <dd className="text-sm text-gray-900">{parsedData.totalExperience} years</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Current Position</dt>
                    <dd className="text-sm text-gray-900">
                      {parsedData.experience?.[0]?.position || 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Extracted Skills</h4>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="badge badge-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience History */}
            {parsedData.experience && parsedData.experience.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Experience History</h4>
                <div className="space-y-3">
                  {parsedData.experience.slice(0, 3).map((exp, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900">{exp.position}</h5>
                        <span className="text-xs text-gray-500">
                          {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} -
                          {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      {exp.description && (
                        <p className="text-xs text-gray-500 mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Education</h4>
                <div className="space-y-2">
                  {parsedData.education.slice(0, 2).map((edu, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} -
                        {edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/app/resumes')}
                className="btn-outline"
              >
                Upload Another
              </button>
              <button
                onClick={goToResumeDetail}
                className="btn-primary"
              >
                View Resume Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Match Results */}
      {parsedData && jobMatches.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5 text-primary-600" />
                  Matching Jobs ({jobMatches.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  AI-matched job openings based on skills, experience, and education
                </p>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {jobMatches.map((match, index) => (
                <div
                  key={match.matchId || index}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">{match.job?.title || 'Untitled Job'}</h4>
                      {match.score >= 70 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircleIcon className="h-3 w-3" /> Strong Match
                        </span>
                      )}
                      {match.score >= 40 && match.score < 70 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Moderate
                        </span>
                      )}
                      {match.score < 40 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <ExclamationCircleIcon className="h-3 w-3" /> Low
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      {match.job?.location && <span>{match.job.location}</span>}
                      {match.job?.jobType && <span className="capitalize">{match.job.jobType}</span>}
                      {match.job?.department && <span>{match.job.department}</span>}
                    </div>
                    {/* Skill breakdown */}
                    {match.breakdown?.skillMatch && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {match.breakdown.skillMatch.matchedSkills?.slice(0, 6).map((s, i) => (
                          <span key={i} className="inline-block px-2 py-0.5 text-xs rounded bg-green-50 text-green-700 border border-green-200">
                            {s.skill}
                          </span>
                        ))}
                        {match.breakdown.skillMatch.missingSkills?.slice(0, 3).map((s, i) => (
                          <span key={`m-${i}`} className="inline-block px-2 py-0.5 text-xs rounded bg-red-50 text-red-600 border border-red-200 line-through">
                            {s.skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 text-center flex-shrink-0">
                    <div className={`text-2xl font-bold ${match.score >= 70 ? 'text-green-600' :
                      match.score >= 40 ? 'text-yellow-600' : 'text-red-500'
                      }`}>
                      {match.score}%
                    </div>
                    <p className="text-xs text-gray-500">match</p>
                    {/* Mini breakdown */}
                    <div className="mt-1 text-xs text-gray-400 space-y-0.5">
                      <div>Skills: {match.breakdown?.skillMatch?.score || 0}%</div>
                      <div>Exp: {match.breakdown?.experienceMatch?.score || 0}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {jobMatches.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No active job postings to match against.</p>
                <p className="text-sm mt-1">Create job postings first, then upload resumes to see matches.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No matches message */}
      {parsedData && jobMatches.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-8">
            <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 font-medium">No job matches found</p>
            <p className="text-sm text-gray-500 mt-1">
              Create job postings to automatically match candidates when resumes are uploaded.
            </p>
            <Link to="/app/jobs/new" className="btn-primary inline-block mt-4">
              Create Job Posting
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;

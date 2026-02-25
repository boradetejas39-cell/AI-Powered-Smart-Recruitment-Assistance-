import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  DocumentTextIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

const UserResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post('/resumes/user-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadResult(response.data.data);
      setFile(null);
      // Reset file input
      e.target.reset();
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/app/user/dashboard" className="btn-outline mb-4">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>
        <p className="text-gray-600">Upload your resume to apply for jobs</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Upload Your Resume
          </h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleUpload} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume File (PDF or Word format, max 10MB)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  {file ? (
                    <div className="flex flex-col items-center">
                      <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF or Word documents up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Display */}
            {uploadResult && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Upload Successful!</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Your resume has been uploaded successfully.</p>
                      <p className="font-medium">Candidate Name: {uploadResult.candidateName}</p>
                      <p>Skills Found: {uploadResult.skills?.join(', ') || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={!file || uploading}
                className="btn-primary"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                    Upload Resume
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Tips for Better Results</h2>
        </CardHeader>
        <CardBody>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Use a clear, professional resume format
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Include your contact information at the top
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              List your skills and experience clearly
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Save as PDF for best compatibility
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              File size should be under 10MB
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserResumeUpload;

import React from 'react';
import { useParams } from 'react-router-dom';

const ResumeEdit = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Resume</h1>
        <p className="text-gray-600">Update resume information</p>
      </div>
      
      <div className="card">
        <div className="card-body">
          <p>Resume ID: {id}</p>
          <p>Resume edit form will be loaded here...</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeEdit;

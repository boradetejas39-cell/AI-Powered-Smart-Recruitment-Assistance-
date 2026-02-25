import React from 'react';
import { useParams } from 'react-router-dom';

const JobEdit = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-600">Update job posting information</p>
      </div>
      
      <div className="card">
        <div className="card-body">
          <p>Job ID: {id}</p>
          <p>Job edit form will be loaded here...</p>
        </div>
      </div>
    </div>
  );
};

export default JobEdit;

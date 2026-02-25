import React from 'react';
import { useParams } from 'react-router-dom';

const MatchDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Match Details</h1>
        <p className="text-gray-600">View detailed match information</p>
      </div>
      
      <div className="card">
        <div className="card-body">
          <p>Match ID: {id}</p>
          <p>Match details will be loaded here...</p>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;

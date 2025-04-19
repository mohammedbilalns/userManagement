import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="loading loading-spinner loading-lg text-primary"></div>
      <div className="text-2xl text-primary mt-4">Loading...</div>
    </div>
  );
};

export default LoadingSpinner; 
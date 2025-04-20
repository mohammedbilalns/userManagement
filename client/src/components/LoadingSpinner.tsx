import React, { useState, useEffect } from 'react';

const LoadingSpinner: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!showSpinner) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-32">
      <div className="loading loading-spinner loading-md text-primary"></div>
      <div className="text-lg text-primary mt-2">Loading...</div>
    </div>
  );
};

export default LoadingSpinner; 
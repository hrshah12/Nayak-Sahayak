import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-dashed rounded-full animate-spin"></div>
  );
};

export default LoadingSpinner;

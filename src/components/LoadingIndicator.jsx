import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = ({ message = 'Loading data...' }) => {
  return (
    <div className="loading-indicator">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;

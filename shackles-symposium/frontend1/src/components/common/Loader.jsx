import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="loader-container">
        <div className="loader-squid">
          <div className="squid-shapes">
            <div className="shape square"></div>
            <div className="shape circle"></div>
            <div className="shape triangle"></div>
          </div>
          <p className="loader-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loader-inline">
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;

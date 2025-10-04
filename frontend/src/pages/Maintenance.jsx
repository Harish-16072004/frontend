import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Maintenance.css';

const Maintenance = () => {
  const location = useLocation();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  // Effect to scroll to top when location changes
  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstimatedTime = () => {
    const future = new Date();
    future.setDate(future.getDate() + 7); // Estimated 1 week
    return future.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="maintenance-container">
      {/* Background Pattern */}
      <div className="maintenance-bg-pattern">
        <div className="pattern-square"></div>
        <div className="pattern-triangle"></div>
        <div className="pattern-circle"></div>
      </div>
      
      {/* Main Content */}
      <div className="maintenance-content">
        {/* Squid Game Logo/Symbol */}
        <div className="maintenance-logo">
          <div className="squid-symbol">
            <div className="symbol-square">□</div>
            <div className="symbol-triangle">△</div>
            <div className="symbol-circle">○</div>
          </div>
        </div>

        {/* Main Message */}
        <div className="maintenance-message">
          <h1 className="maintenance-title">SYSTEM UNDER MAINTENANCE</h1>
          
          <div className="maintenance-subtitle-en">The Game Will Begin Soon</div>
        </div>

        {/* Status Information 
        <div className="maintenance-info">
          <div className="info-card">
            <div className="info-icon">⚙️</div>
            <h3>Registration System</h3>
            <p>Currently being upgraded for enhanced security</p>
            <div className="status-badge maintenance">Under Development</div>
          </div>

          <div className="info-card">
            <div className="info-icon">🔐</div>
            <h3>Payment Gateway</h3>
            <p>Implementing secure payment processing</p>
            <div className="status-badge maintenance">Coming Soon</div>
          </div>

          <div className="info-card">
            <div className="info-icon">📱</div>
            <h3>User Dashboard</h3>
            <p>Building personalized experience</p>
            <div className="status-badge maintenance">In Progress</div>
          </div>
        </div>

        Timeline 
        <div className="maintenance-timeline">
          <h3>Expected Timeline</h3>
          <div className="timeline-item">
            <span className="timeline-date">Today ({getCurrentDate()})</span>
            <span className="timeline-event">Backend Development Started</span>
          </div>
          <div className="timeline-item">
            <span className="timeline-date">{getEstimatedTime()}</span>
            <span className="timeline-event">Registration Opens</span>
          </div>
        </div>

        Contact Information 
        <div className="maintenance-contact">
          <h3>Need Help?</h3>
          <p>For urgent inquiries, please contact our support team</p>
          <div className="contact-buttons">
            <a href="/contact" className="contact-btn">
              <span>📧</span> Contact Us
            </a>
            <a href="/" className="contact-btn">
              <span>🏠</span> Back to Home
            </a>
          </div>
        </div>

        {/* Game Reference */}
        {/* <div className="maintenance-footer">
          <div className="game-number">게임 번호: 001</div>
          <div className="game-status">PLAYER STATUS: WAITING</div>
        </div> */}
      </div>
        {/* End Main Content */}
      {/* <div className="floating-shapes">
        <div className="shape shape-1">□</div>
        <div className="shape shape-2">△</div>
        <div className="shape shape-3">○</div>
        <div className="shape shape-4">□</div>
        <div className="shape shape-5">△</div>
        <div className="shape shape-6">○</div>
      </div> */}
    </div>
  );
};

export default Maintenance;
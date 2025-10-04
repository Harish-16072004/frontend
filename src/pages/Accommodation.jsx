import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Accommodation.css';

const Accommodation = () => {
  const location = useLocation();
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(false);

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

  const handleDateToggle = (date) => {
    setSelectedDates(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      } else {
        return [...prev, date];
      }
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (selectedDates.length === 0 || !selectedGender || !rulesAccepted) {
      alert('Please select at least one date, gender, and accept the rules');
      return;
    }
    // Redirect to maintenance page since backend is not ready
    window.location.href = '/maintenance';
  };

  return (
    <div className="accommodation">
      <section className="accommodation-hero">
        <h1 className="accommodation-title">Accommodation</h1>
        <p className="accommodation-subtitle">ONLINE REGISTRATION FORM TO AVAIL</p>
      </section>

      <section className="accommodation-main">
        <div className="accommodation-container">
          {/* Rules Section */}
          <div className="rules-section">
            <h2 className="rules-title">RULES</h2>
            <div className="rules-list">
              <div className="rule-item">
                <span className="rule-number">1.</span>
                <p>ALL ACCOMMODATION REQUESTS MUST BE MADE AT THE TIME OF GENERAL REGISTRATION.</p>
              </div>
              <div className="rule-item">
                <span className="rule-number">2.</span>
                <p>PARTICIPANTS ARE REQUIRED TO COMPLETE THE ONLINE REGISTRATION FORM TO AVAIL ACCOMMODATION FACILITIES.</p>
              </div>
              <div className="rule-item">
                <span className="rule-number">3.</span>
                <p>ROOMS WILL BE ASSIGNED BY THE HOSPITALITY TEAM BASED ON AVAILABILITY.</p>
              </div>
              <div className="rule-item">
                <span className="rule-number">4.</span>
                <p>PARTICIPANTS ARE RESPONSIBLE FOR THE SAFETY OF THEIR PERSONAL BELONGINGS THROUGHOUT THEIR STAY.</p>
              </div>
              <div className="rule-item">
                <span className="rule-number">5.</span>
                <p>ACCOMMODATION WILL BE PROVIDED STRICTLY FOR THE NIGHTS OF OCTOBER 22 AND 23 ONLY. NO EXTENSIONS WILL BE PERMITTED.</p>
              </div>
              <div className="rule-item">
                <span className="rule-number">6.</span>
                <p>PARTICIPANTS ATTENDING WORKSHOPS SCHEDULED ON OCTOBER 23 WILL BE ELIGIBLE FOR ACCOMMODATION ON THAT DATE.</p>
              </div>
              <div className="rule-item">
                <span className="rule-number">7.</span>
                <p>HOSTEL RULES AND TIMINGS MUST BE FOLLOWED WITHOUT EXCEPTION.</p>
              </div>
            </div>
          </div>

          {/* Registration Form Section */}
          <div className="registration-form-section">
            <form onSubmit={handleRegister} className="accommodation-form">
              <div className="form-group">
                <label className="form-label">SELECT ACCOMMODATION DATES:</label>
                <div className="date-selection">
                  <button
                    type="button"
                    className={`date-btn ${selectedDates.includes('OCT 23') ? 'active' : ''}`}
                    onClick={() => handleDateToggle('OCT 23')}
                  >
                    OCT 23
                    {selectedDates.includes('OCT 23') && <span className="selected-indicator">✓</span>}
                  </button>
                  <button
                    type="button"
                    className={`date-btn ${selectedDates.includes('OCT 24') ? 'active' : ''}`}
                    onClick={() => handleDateToggle('OCT 24')}
                  >
                    OCT 24
                    {selectedDates.includes('OCT 24') && <span className="selected-indicator">✓</span>}
                  </button>
                </div>
                {selectedDates.length > 0 && (
                  <p className="selected-dates-info">
                    Selected: {selectedDates.join(' & ')}
                  </p>
                )}
              </div>

              <div className="gender-selection">
                <select 
                  value={selectedGender} 
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="gender-select"
                  required
                >
                  <option value="">SELECT GENDER</option>
                  <option value="male">MALE</option>
                  <option value="female">FEMALE</option>
                </select>
              </div>

              <div className="rules-checkbox">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={rulesAccepted} 
                    onChange={(e) => setRulesAccepted(e.target.checked)}
                    required
                  />
                  <span className="checkmark"></span>
                  I have read all the rules mentioned above
                </label>
              </div>

              <button type="submit" className="btn-register-base btn-register-maintenance btn-register-full">
                REGISTRATION COMING SOON 🔧
              </button>
            </form>
          </div>
        </div>
      </section>
      {/*
      <section className="accommodation-contact">
        <div className="contact-container">
          <h2>Accommodation Coordinators</h2>
          <div className="coordinators-grid">
            <div className="coordinator-card">
              <h3>Boys Accommodation</h3>
              <p className="coordinator-name">Vignesh</p>
              <a href="tel:+919361428799" className="coordinator-phone">
                <span className="phone-icon">📞</span>
                +91 93614 28799
              </a>
            </div>
            <div className="coordinator-card">
              <h3>Girls Accommodation</h3>
              <p className="coordinator-name">Sharun</p>
              <a href="tel:+919384583077" className="coordinator-phone">
                <span className="phone-icon">📞</span>
                +91 93845 83077
              </a>
            </div>
          </div>
          <p className="contact-note">
            For any queries regarding accommodation, please contact the coordinators above
          </p>
        </div>
      </section>
      */}
    </div>
  );
};

export default Accommodation;

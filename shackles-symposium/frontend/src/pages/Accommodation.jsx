import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Accommodation.css';

const Accommodation = () => {
  const [needsAccommodation, setNeedsAccommodation] = useState(false);

  return (
    <div className="accommodation">
      <section className="accommodation-hero">
        <h1 className="accommodation-title">Accommodation</h1>
        <p className="accommodation-subtitle">Comfortable Stay for Outstation Participants</p>
      </section>

      <section className="accommodation-info">
        <div className="info-container">
          <div className="info-content">
            <h2>Stay with Us</h2>
            <p className="info-desc">
              We provide comfortable and secure accommodation facilities for outstation participants 
              attending SHACKLES 2025. Our accommodation is located near the college campus, 
              ensuring easy access to all event venues.
            </p>

            <div className="facility-highlights">
              <div className="highlight-card">
                <span className="highlight-icon">🏠</span>
                <h3>Comfortable Rooms</h3>
                <p>Separate arrangements for male and female participants</p>
              </div>
              <div className="highlight-card">
                <span className="highlight-icon">🛏️</span>
                <h3>Clean Facilities</h3>
                <p>Well-maintained rooms with basic amenities</p>
              </div>
              <div className="highlight-card">
                <span className="highlight-icon">🔒</span>
                <h3>Secure Environment</h3>
                <p>24/7 security and supervision</p>
              </div>
              <div className="highlight-card">
                <span className="highlight-icon">🍽️</span>
                <h3>Meals Included</h3>
                <p>Breakfast and dinner provided</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="accommodation-details">
        <div className="details-container">
          <div className="details-card">
            <h2>Accommodation Details</h2>
            
            <div className="detail-item">
              <div className="detail-label">
                <span className="detail-icon">📅</span>
                <strong>Check-in:</strong>
              </div>
              <p>October 22, 2025 (Evening) - 4:00 PM onwards</p>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <span className="detail-icon">📅</span>
                <strong>Check-out:</strong>
              </div>
              <p>October 24, 2025 (Evening) - 6:00 PM</p>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <span className="detail-icon">💰</span>
                <strong>Cost:</strong>
              </div>
              <p>₹300 per person (2 nights, 3 days)</p>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <span className="detail-icon">📍</span>
                <strong>Location:</strong>
              </div>
              <p>Near ACGCET Campus, Karaikudi</p>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <span className="detail-icon">🍽️</span>
                <strong>Meals Provided:</strong>
              </div>
              <p>Dinner (Oct 22), Breakfast & Lunch (Oct 23), Breakfast & Lunch (Oct 24)</p>
            </div>
          </div>

          <div className="amenities-card">
            <h2>Amenities Provided</h2>
            <ul className="amenities-list">
              <li>
                <span className="check-icon">✓</span>
                <span>Bedding (Mattress, Pillow, Bedsheet)</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Clean washroom facilities</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Common area for relaxation</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>24/7 Security</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Separate facilities for boys and girls</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>WiFi connectivity (limited)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="accommodation-rules">
        <div className="rules-container">
          <h2>Rules & Guidelines</h2>
          <div className="rules-grid">
            <div className="rule-card">
              <span className="rule-number">1</span>
              <p>Participants must carry valid ID proof (College ID/Aadhar Card)</p>
            </div>
            <div className="rule-card">
              <span className="rule-number">2</span>
              <p>Maintain cleanliness and discipline at all times</p>
            </div>
            <div className="rule-card">
              <span className="rule-number">3</span>
              <p>Strictly follow check-in and check-out timings</p>
            </div>
            <div className="rule-card">
              <span className="rule-number">4</span>
              <p>No smoking, alcohol, or any prohibited substances</p>
            </div>
            <div className="rule-card">
              <span className="rule-number">5</span>
              <p>Participants are responsible for their personal belongings</p>
            </div>
            <div className="rule-card">
              <span className="rule-number">6</span>
              <p>Follow all instructions given by accommodation coordinators</p>
            </div>
          </div>
        </div>
      </section>

      <section className="accommodation-contact">
        <div className="contact-container">
          <h2>Accommodation Coordinators</h2>
          <div className="coordinators-grid">
            <div className="coordinator-card">
              <div className="coordinator-icon">👨‍💼</div>
              <h3>Boys Accommodation</h3>
              <p className="coordinator-name">Vignesh</p>
              <a href="tel:+919361428799" className="coordinator-phone">
                <span className="phone-icon">📞</span>
                +91 9361428799
              </a>
            </div>
            <div className="coordinator-card">
              <div className="coordinator-icon">👩‍💼</div>
              <h3>Girls Accommodation</h3>
              <p className="coordinator-name">Sharun</p>
              <a href="tel:+919384583077" className="coordinator-phone">
                <span className="phone-icon">📞</span>
                +91 9384583077
              </a>
            </div>
          </div>
          <p className="contact-note">
            For any queries regarding accommodation, please contact the coordinators above
          </p>
        </div>
      </section>

      <section className="accommodation-cta">
        <h2>Need Accommodation?</h2>
        <p>Indicate your requirement during registration</p>
        <Link to="/register" className="btn-register-accommodation">
          Register Now
        </Link>
      </section>
    </div>
  );
};

export default Accommodation;

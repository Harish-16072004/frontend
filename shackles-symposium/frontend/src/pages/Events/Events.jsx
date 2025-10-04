import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Events.css';

const Events = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/events';

  if (!isMainPage) {
    return <Outlet />;
  }

  return (
    <div className="events">
      <section className="events-hero">
        <h1 className="events-title">
          <span className="glitch-events" data-text="EVENTS">EVENTS</span>
        </h1>
        <p className="events-subtitle">11 Challenges. 3 Categories. Infinite Possibilities.</p>
      </section>

      <section className="events-categories">
        <div className="events-container">
          <Link to="/events/technical" className="event-category-card technical">
            <div className="category-header">
              <span className="category-icon">■</span>
              <h2>Technical Events</h2>
            </div>
            <p className="category-count">6 Events</p>
            <div className="category-list">
              <span>Paper Presentation</span>
              <span>Technical Quiz</span>
              <span>CAD Modelling</span>
              <span>Water Rocketry</span>
              <span>Motor Montage</span>
              <span>Mech O Mania</span>
            </div>
            <div className="category-cta">
              <span>Explore</span>
              <span className="arrow">→</span>
            </div>
          </Link>

          <Link to="/events/non-technical" className="event-category-card non-technical">
            <div className="category-header">
              <span className="category-icon">○</span>
              <h2>Non-Technical Events</h2>
            </div>
            <p className="category-count">3 Events</p>
            <div className="category-list">
              <span>IPL Auction</span>
              <span>Kollywood Quiz</span>
              <span>Red Light Green Light</span>
            </div>
            <div className="category-cta">
              <span>Explore</span>
              <span className="arrow">→</span>
            </div>
          </Link>

          <Link to="/events/special" className="event-category-card special">
            <div className="category-header">
              <span className="category-icon">△</span>
              <h2>Special Events</h2>
            </div>
            <p className="category-count">2 Events</p>
            <div className="category-list">
              <span>Idea Pitching</span>
              <span>Robo Soccer</span>
            </div>
            <div className="category-cta">
              <span>Explore</span>
              <span className="arrow">→</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="events-info">
        <div className="info-container">
          <div className="info-card">
            <h3>📅 Event Dates</h3>
            <p>October 23-24, 2025</p>
          </div>
          <div className="info-card">
            <h3>💰 Registration Fee</h3>
            <p>₹299 for all events</p>
          </div>
        </div>
      </section>

      <section className="events-cta">
        <h2>Ready to Compete?</h2>
        <p>Register now and showcase your skills</p>
        <Link to="/register" className="btn-register-events">
          Register Now
        </Link>
      </section>
    </div>
  );
};

export default Events;

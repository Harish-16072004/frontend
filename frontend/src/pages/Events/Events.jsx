import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Events.css';

const Events = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/events';

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

  if (!isMainPage) {
    return <Outlet />;
  }

  return (
    <div className="events">
      <section className="events-hero">
        <h1 className="events-title">
          <span className="glitch-events" data-text="EVENTS">EVENTS</span>
        </h1>
        <p className="events-subtitle">12 Challenges. 3 Categories. Infinite Possibilities.</p>
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
              <span>INNOVATION DUEL</span>
              <span>BRAIN BUSTERS</span>
              <span>SKY SHOT</span>
              <span>MECH SHOWDOWN</span>
              <span>ENGINE GAMBLE</span>
              <span>DIMENSIONS FORGE</span>
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
            <p className="category-count">4 Events</p>
            <div className="category-list">
              <span>SURVIVAL BID</span>
              <span>FILM QUEST</span>
              <span>RED LIGHT GREEN LIGHT</span>
              <span>DALGONA CANDY</span>
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
              <span>VISION TRIAL</span>
              <span>ROBO RUMBLE</span>
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
            <h3>📅 Event Date</h3>
            <p>October 24, 2025</p>
          </div>
          <div className="info-card">
            <h3>💰 Registration Fee</h3>
            <p>₹299</p>
          </div>
        </div>
      </section>

      <section className="events-cta">
        <h2>Ready to Compete?</h2>
        <p>Register now and showcase your skills</p>
        <Link to="/register" className="btn-register-base btn-register-primary btn-register-large">
          Register Now
        </Link>
      </section>
    </div>
  );
};

export default Events;

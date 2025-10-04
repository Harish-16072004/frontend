import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Technical.css';

const Special = () => {
  const location = useLocation();
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const specialEvents = [
    {
      id: 1,
      name: 'VISION TRIAL',
      symbol: '△',
      description: 'Present your innovative business ideas to a panel of judges and investors.',
      rules: [
        'Team size: 2-3 members',
        'Pitch duration: 5 minutes',
        'Q&A session: 3 minutes',
        'Idea must be original and innovative',
        'Presentation + prototype/mock-up required',
        'Focus on feasibility and market potential',
      ],
      coordinator: {
        name: 'VIGNESH',
        phone: '+91 9787537488',
      },
    },
    {
      id: 2,
      name: 'ROBO RUMBLE',
      symbol: '△',
      description: 'Build and control robots to compete in an exciting soccer match.',
      rules: [
        'Team size: 3-4 members',
        'Robot specifications: Max 30cm × 30cm × 30cm',
        'Wired/Wireless control allowed',
        'Match duration: 10 minutes',
        'Standard soccer rules apply',
        'Robot must be built on-site (materials provided)',
      ],
      coordinator: {
        name: 'SHYAM SUNDAR',
        phone: '+91 8072372844',
      },
    },
  ];

  return (
    <div className="technical-events special-page">
      <section className="technical-hero">
        <div className="hero-symbol special-symbol">△</div>
        <h1 className="technical-title special-title">Special Events</h1>
        <p className="technical-subtitle">2 Premium Events with Bigger Prizes</p>
        <Link to="/events" className="btn-back">
          ← Back to Events
        </Link>
      </section>

      <section className="technical-grid">
        <div className="container special-container">
          {specialEvents.map((event) => (
            <div 
              key={event.id} 
              className="event-card special"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="event-symbol">{event.symbol}</div>
              <h3 className="event-name">{event.name}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-footer">
                <div className="event-coordinator">
                  <span className="coordinator-icon">📞</span>
                  <div>
                    <p className="coordinator-name">{event.coordinator.name}</p>
                    <p className="coordinator-phone">{event.coordinator.phone}</p>
                  </div>
                </div>
                <button className="btn-view-details btn-special">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedEvent && (
        <div className="event-modal" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>
              ×
            </button>
            <div className="modal-header">
              <span className="modal-symbol special-modal-symbol">{selectedEvent.symbol}</span>
              <h2>{selectedEvent.name}</h2>
            </div>
            <p className="modal-description">{selectedEvent.description}</p>
            
            <div className="modal-section">
              <h3>Rules & Regulations</h3>
              <ul className="modal-rules">
                {selectedEvent.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="modal-section">
              <h3>Prizes</h3>
              <p className="modal-prizes special-prizes">{selectedEvent.prizes}</p>
            </div>

            <div className="modal-section">
              <h3>Event Coordinator</h3>
              <div className="modal-coordinator">
                <p><strong>{selectedEvent.coordinator.name}</strong></p>
                <p>{selectedEvent.coordinator.phone}</p>
              </div>
            </div>

            <Link to="/maintenance" className="btn-register-base btn-register-maintenance">
              Registration Coming Soon 🔧
            </Link>
          </div>
        </div>
      )}

      <section className="technical-cta">
        <h2>Ready for the Ultimate Challenge?</h2>
        <p>Registration opens soon - Backend system under development</p>
        <Link to="/maintenance" className="btn-register-base btn-register-maintenance btn-register-large">
          Registration Coming Soon 🔧
        </Link>
      </section>

      <style jsx>{`
        .special-symbol,
        .special-title {
          color: #2ecc71 !important;
          text-shadow: 0 0 30px rgba(46, 204, 113, 0.6) !important;
        }

        .technical-hero {
          background: linear-gradient(135deg, #0a2d0a 0%, #000000 50%, #0a2d0a 100%) !important;
        }

        .special-container {
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)) !important;
          max-width: 1000px;
          margin: 0 auto;
        }

        .event-card.special {
          border-color: #2ecc71 !important;
          background: linear-gradient(135deg, rgba(46, 204, 113, 0.08) 0%, rgba(0, 0, 0, 0.9) 100%) !important;
        }

        .event-card.special::before {
          background: radial-gradient(circle, rgba(46, 204, 113, 0.15) 0%, transparent 70%) !important;
        }

        .event-card.special:hover {
          border-color: #58d68d !important;
          box-shadow: 0 20px 60px rgba(46, 204, 113, 0.4) !important;
        }

        .event-card.special .event-symbol {
          color: #2ecc71 !important;
          text-shadow: 0 0 20px rgba(46, 204, 113, 0.5) !important;
        }

        .event-card.special:hover .event-symbol {
          color: #58d68d !important;
          text-shadow: 0 0 30px rgba(46, 204, 113, 0.8) !important;
        }

        .event-card.special .event-coordinator {
          background: rgba(46, 204, 113, 0.1) !important;
          border-color: rgba(46, 204, 113, 0.3) !important;
        }

        .event-card.special .event-coordinator:hover {
          background: rgba(46, 204, 113, 0.15) !important;
          border-color: rgba(46, 204, 113, 0.5) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 5px 15px rgba(46, 204, 113, 0.2) !important;
        }

        .btn-special {
          background: #2ecc71 !important;
          border: 2px solid #2ecc71 !important;
          color: white !important;
          box-shadow: 0 0 20px rgba(46, 204, 113, 0.3) !important;
        }

        .btn-special:hover {
          background: transparent !important;
          color: #2ecc71 !important;
          box-shadow: 0 5px 25px rgba(46, 204, 113, 0.5) !important;
        }

        .special-modal-symbol {
          color: #2ecc71 !important;
        }

        .modal-content {
          border-color: #2ecc71 !important;
        }

        .modal-rules li::before {
          color: #2ecc71 !important;
        }

        .special-prizes {
          background: rgba(46, 204, 113, 0.15) !important;
          border-color: rgba(46, 204, 113, 0.4) !important;
        }

        @media (max-width: 768px) {
          .special-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Special;

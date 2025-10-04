import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Technical.css';

const Special = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const specialEvents = [
    {
      id: 1,
      name: 'Idea Pitching',
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
        name: 'Gokul S',
        phone: '+91 9514585887',
      },
    },
    {
      id: 2,
      name: 'Robo Soccer',
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
        name: 'Sharun',
        phone: '+91 9384583077',
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

            <Link to="/register" className="btn-register-modal">
              Register for this Event
            </Link>
          </div>
        </div>
      )}

      <section className="technical-cta">
        <h2>Ready for the Ultimate Challenge?</h2>
        <p>Register now for ₹299 and compete in these premium events</p>
        <Link to="/register" className="btn-register-tech">
          Register Now
        </Link>
      </section>

      <style jsx>{`
        .special-symbol,
        .special-title {
          color: var(--vip-gold) !important;
          text-shadow: 0 0 30px rgba(255, 191, 0, 0.6) !important;
        }

        .special-container {
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)) !important;
          max-width: 1000px;
          margin: 0 auto;
        }

        .event-card.special {
          border-color: var(--vip-gold);
          background: linear-gradient(135deg, rgba(255, 191, 0, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%);
        }

        .event-card.special::before {
          background: radial-gradient(circle, rgba(255, 191, 0, 0.1) 0%, transparent 70%);
        }

        .event-card.special:hover {
          border-color: var(--player-green);
          box-shadow: 0 20px 60px rgba(255, 191, 0, 0.5);
        }

        .event-card.special .event-symbol {
          color: var(--vip-gold);
        }

        .event-card.special:hover .event-symbol {
          color: var(--player-green);
        }

        .btn-special {
          background: var(--vip-gold) !important;
          border-color: var(--vip-gold) !important;
          color: var(--bg-primary) !important;
        }

        .btn-special:hover {
          background: transparent !important;
          color: var(--vip-gold) !important;
          box-shadow: 0 5px 20px rgba(255, 191, 0, 0.5) !important;
        }

        .special-modal-symbol {
          color: var(--vip-gold) !important;
        }

        .modal-content {
          border-color: var(--vip-gold) !important;
        }

        .modal-rules li::before {
          color: var(--vip-gold) !important;
        }

        .special-prizes {
          background: rgba(255, 191, 0, 0.15) !important;
          border-color: rgba(255, 191, 0, 0.4) !important;
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

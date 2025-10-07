import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Technical.css';

const NonTechnical = () => {
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

  const nonTechnicalEvents = [
    {
      id: 1,
      name: 'SURVIVAL BID',
      symbol: '○',
      description: 'Build your dream IPL team through strategic bidding and team management.',
      rules: [
        'Team size: 3-4 members',
        'Virtual budget provided',
        'Multiple rounds of bidding',
        'Strategic team building required',
        'Points based on actual IPL performance',
      ],
      coordinator: {
        name: 'SIVASH ',
        phone: '+91 9360462604',
      },
 
    },
    {
      id: 2,
      name: 'FILM QUEST',
      symbol: '○',
      description: 'Test your knowledge of Tamil cinema across decades.',
      rules: [
        'Team size: 2 members',
        '3 rounds: Visual, Audio, Rapid Fire',
        'Topics: Movies, actors, directors, music',
        'No phones allowed',
        'Duration: 1.5 hours',
      ],
      coordinator: {
        name: 'ILAKKIYA RAJAN KALAI',
        phone: '+91 9360644238',
      },
    },
    {
      id: 3,
      name: 'Red Light Green Light',
      symbol: '○',
      description: 'The iconic Squid Game challenge - freeze on red, move on green!',
      rules: [
        'Individual participation',
        'Movement only on "green light"',
        'Complete freeze on "red light"',
        'Any movement results in elimination',
        'First to finish line wins',
      ],
      coordinator: {
        name: 'THARUN RAJ',
        phone: '+91 6369516359',
      },
    },
    {
      id: 4,
      name: 'Dalgona Candy',
      symbol: '○',
      description: 'Extract the shape from dalgona candy without breaking it - inspired by the famous Squid Game challenge!',
      rules: [
        'Individual participation',
        'Choose your shape: circle, triangle, star, or umbrella',
        'Use provided needle to carefully extract the shape',
        'Breaking the shape results in elimination',
        'Time limit: 10 minutes',
        'Clean extraction required for winning',
      ],
      coordinator: {
        name: 'JEYAPRAKASH',
        phone: '+91 6385237887',
      },
    },
  ];

  return (
    <div className="technical-events non-technical-page">
      <section className="technical-hero">
        <div className="hero-symbol non-tech-symbol">○</div>
        <h1 className="technical-title non-tech-title">Non-Technical Events</h1>
        <p className="technical-subtitle">4 Fun-Filled Events for Everyone</p>
        <Link to="/events" className="btn-back">
          ← Back to Events
        </Link>
      </section>

      <section className="technical-grid">
        <div className="container">
          {nonTechnicalEvents.map((event) => (
            <div 
              key={event.id} 
              className="event-card non-technical"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="event-symbol">{event.symbol}</div>
              <h3 className="event-name">{event.name}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-footer">
                <div className="event-coordinator">
                  <span className="coordinator-icon">📞</span>
                  <div className="coordinator-info">
                    <p className="coordinator-name">{event.coordinator.name}</p>
                    <a href={`tel:${event.coordinator.phone}`} className="coordinator-phone">
                      {event.coordinator.phone}
                    </a>
                  </div>
                </div>
                <button className="btn-view-details btn-non-tech">View Details</button>
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
              <span className="modal-symbol non-tech-modal-symbol">{selectedEvent.symbol}</span>
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
              <p className="modal-prizes">{selectedEvent.prizes}</p>
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
        <h2>Ready to Have Fun?</h2>
        <p>Registration opens soon - Backend system under development</p>
        <Link to="/maintenance" className="btn-register-base btn-register-maintenance btn-register-large">
          Registration Coming Soon 🔧
        </Link>
      </section>

      <style jsx>{`
        .non-tech-symbol,
        .non-tech-title {
          color: #3498db !important;
          text-shadow: 0 0 30px rgba(52, 152, 219, 0.6) !important;
        }

        .technical-hero {
          background: linear-gradient(135deg, #0a1a2d 0%, #000000 50%, #0a1a2d 100%) !important;
        }

        .event-card.non-technical {
          border-color: #3498db !important;
          background: linear-gradient(135deg, rgba(52, 152, 219, 0.08) 0%, rgba(0, 0, 0, 0.9) 100%) !important;
        }

        .event-card.non-technical::before {
          background: radial-gradient(circle, rgba(52, 152, 219, 0.15) 0%, transparent 70%) !important;
        }

        .event-card.non-technical:hover {
          border-color: #5dade2 !important;
          box-shadow: 0 20px 60px rgba(52, 152, 219, 0.4) !important;
        }

        .event-card.non-technical .event-symbol {
          color: #3498db !important;
          text-shadow: 0 0 20px rgba(52, 152, 219, 0.5) !important;
        }

        .event-card.non-technical:hover .event-symbol {
          color: #5dade2 !important;
          text-shadow: 0 0 30px rgba(52, 152, 219, 0.8) !important;
        }

        .event-card.non-technical .event-coordinator {
          background: rgba(52, 152, 219, 0.1) !important;
          border-color: rgba(52, 152, 219, 0.3) !important;
        }

        .event-card.non-technical .event-coordinator:hover {
          background: rgba(52, 152, 219, 0.15) !important;
          border-color: rgba(52, 152, 219, 0.5) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.2) !important;
        }

        .btn-non-tech {
          background: #3498db !important;
          border: 2px solid #3498db !important;
          color: white !important;
          box-shadow: 0 0 20px rgba(52, 152, 219, 0.3) !important;
        }

        .btn-non-tech:hover {
          background: transparent !important;
          color: #3498db !important;
          box-shadow: 0 5px 25px rgba(52, 152, 219, 0.5) !important;
        }

        .non-tech-modal-symbol {
          color: #3498db !important;
        }

        .modal-content {
          border-color: #3498db !important;
        }

        .modal-rules li::before {
          color: #3498db !important;
        }
      `}</style>
    </div>
  );
};

export default NonTechnical;

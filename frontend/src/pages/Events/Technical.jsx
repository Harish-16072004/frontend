import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Technical.css';

const Technical = () => {
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

  const technicalEvents = [
    {
      id: 1,
      name: 'INNOVATION DUEL',
      symbol: '■',
      description: 'Present innovative research papers and engineering solutions.',
      rules: [
        'Team size: 2-3 members',
        'Presentation time: 10 minutes',
        'Topic: Any mechanical engineering domain',
        'Abstract submission deadline: October 10, 2025',
        'PPT format required',
      ],
      coordinator: {
        name: 'Mogith',
        phone: '+91 6374763740',
      },
    },
    {
      id: 2,
      name: 'BRAIN BUSTERS',
      symbol: '■',
      description: 'Test your mechanical engineering knowledge across multiple rounds.',
      rules: [
        'Team size: 2 members',
        '3 rounds: Prelims, Buzzer, Rapid Fire',
        'Topics: Thermodynamics, Mechanics, Manufacturing, etc.',
        'No electronic devices allowed',
        'Duration: 2 hours',
      ],
      coordinator: {
        name: 'Jeffery Shakil',
        phone: '+91 8778531340',
      },
    },
    {
      id: 3,
      name: 'DIMENSIONS FORGE',
      symbol: '■',
      description: 'Design and model engineering components using CAD software.',
      rules: [
        'Individual participation',
        'Software: CATIA/SolidWorks/AutoCAD',
        'Duration: 3 hours',
        'Problem statement given on-site',
        'Own laptop required',
      ],
      coordinator: {
        name: 'Kumaran',
        phone: '+91 9514585887',
      },
    },
    {
      id: 4,
      name: 'SKY SHOT',
      symbol: '■',
      description: 'Build and launch water rockets to achieve maximum distance and accuracy.',
      rules: [
        'Team size: 3-4 members',
        'Rocket must be made on-site',
        'Materials provided',
        'Judged on distance and accuracy',
        'Safety protocols mandatory',
      ],
      coordinator: {
        name: 'Muthuvel',
        phone: '+91 9361428799',
      },
    },
    {
      id: 5,
      name: 'ENGINE GAMBLE',
      symbol: '■',
      description: 'Disassemble and reassemble motors against the clock.',
      rules: [
        'Team size: 2 members',
        'Time-based challenge',
        'Proper sequence required',
        'Tools provided',
        'Fastest team wins',
      ],
      coordinator: {
        name: 'Hariprasath A',
        phone: '+91 9384583077',
      },
    },
    {
      id: 6,
      name: 'MECH SHOWDOWN',
      symbol: '■',
      description: 'Multiple mini-challenges testing diverse mechanical skills.',
      rules: [
        'Team size: 3 members',
        '5 different challenges',
        'Points-based system',
        'Time limit for each challenge',
        'Team with highest points wins',
      ],
      coordinator: {
        name: 'Anees Ahamed T',
        phone: '+91 8098726547',
      },
    },
  ];

  return (
    <div className="technical-events">
      <section className="technical-hero">
        <div className="hero-symbol">■</div>
        <h1 className="technical-title">Technical Events</h1>
        <p className="technical-subtitle">6 Challenging Events for Engineering Minds</p>
        <Link to="/events" className="btn-back">
          ← Back to Events
        </Link>
      </section>

      <section className="technical-grid">
        <div className="container">
          {technicalEvents.map((event) => (
            <div 
              key={event.id} 
              className="event-card technical"
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
                <button className="btn-view-details">View Details</button>
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
              <span className="modal-symbol">{selectedEvent.symbol}</span>
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
        <h2>Ready to Compete?</h2>
        <p>Registration opens soon - Backend system under development</p>
        <Link to="/maintenance" className="btn-register-base btn-register-maintenance btn-register-large">
          Registration Coming Soon 🔧
        </Link>
      </section>
    </div>
  );
};

export default Technical;

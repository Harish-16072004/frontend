import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import '../../styles/Technical.css';

const NonTechnical = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(null);
  const { isAuthenticated } = useAuth();

  const nonTechnicalEvents = [
    {
      id: 1,
      name: 'IPL Auction',
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
        name: 'Abishek',
        phone: '+91 9384583077',
      },
 
    },
    {
      id: 2,
      name: 'Kollywood Quiz',
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
        name: 'Dharun',
        phone: '+91 8098726547',
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
        name: 'Naveen',
        phone: '+91 9361428799',
      },     prizes: '1st: ₹4000 | 2nd: ₹2500 | 3rd: ₹1500',
    },
    {
      id: 4,
      name: 'New Non-Technical Event',
      symbol: '○',
      description: 'Exciting new event coming soon! Details to be announced.',
      rules: [
        'Event details coming soon',
        'Check back for updates',
        'Registration will open soon',
      ],
      coordinator: {
        name: 'Event Team',
        phone: '+91 9384583077',
      },
      prizes: 'To be announced',
    },
  ];

  // Fetch user's registered events on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchRegisteredEvents();
    }
  }, [isAuthenticated]);

  const fetchRegisteredEvents = async () => {
    try {
      const { data } = await api.get('/event-registrations/my-registrations');
      const eventIds = new Set(data.data.map(reg => reg.event._id));
      setRegisteredEvents(eventIds);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleRegisterEvent = async (event, e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to register for events');
      return;
    }

    if (registeredEvents.has(event.id.toString())) {
      alert('You are already registered for this event');
      return;
    }

    setRegistering(event.id);
    try {
      const { data } = await api.post(`/event-registrations/${event.id}/register`, {
        isTeamEvent: event.teamSize ? true : false,
        teamMembers: []
      });

      alert(`Successfully registered for ${event.name}!`);
      setRegisteredEvents(new Set([...registeredEvents, event.id.toString()]));
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      alert(message);
    } finally {
      setRegistering(null);
    }
  };

  const isEventRegistered = (eventId) => {
    return registeredEvents.has(eventId.toString());
  };

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
                  <div>
                    <p className="coordinator-name">{event.coordinator.name}</p>
                    <p className="coordinator-phone">{event.coordinator.phone}</p>
                  </div>
                </div>
                <div className="event-actions">
                  <button className="btn-view-details btn-non-tech">View Details</button>
                  {isAuthenticated && (
                    <button 
                      className={`btn-register-event ${isEventRegistered(event.id) ? 'registered' : ''}`}
                      onClick={(e) => handleRegisterEvent(event, e)}
                      disabled={registering === event.id || isEventRegistered(event.id)}
                    >
                      {registering === event.id ? 'Registering...' : 
                       isEventRegistered(event.id) ? '✓ Registered' : 'Register Now'}
                    </button>
                  )}
                  {!isAuthenticated && (
                    <Link to="/login" className="btn-register-event" onClick={(e) => e.stopPropagation()}>
                      Login to Register
                    </Link>
                  )}
                </div>
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

            {isAuthenticated && (
              <button 
                className={`btn-register-modal ${isEventRegistered(selectedEvent.id) ? 'registered' : ''}`}
                onClick={(e) => handleRegisterEvent(selectedEvent, e)}
                disabled={registering === selectedEvent.id || isEventRegistered(selectedEvent.id)}
              >
                {registering === selectedEvent.id ? 'Registering...' : 
                 isEventRegistered(selectedEvent.id) ? '✓ Already Registered' : 'Register for this Event'}
              </button>
            )}
            {!isAuthenticated && (
              <Link to="/login" className="btn-register-modal">
                Login to Register
              </Link>
            )}
          </div>
        </div>
      )}

      <section className="technical-cta">
        <h2>Ready to Have Fun?</h2>
        <p>Register now for ₹299 and get access to all events</p>
        <Link to="/register" className="btn-register-tech">
          Register Now
        </Link>
      </section>

      <style jsx>{`
        .non-tech-symbol,
        .non-tech-title {
          color: var(--player-green) !important;
          text-shadow: 0 0 30px rgba(10, 215, 161, 0.6) !important;
        }

        .event-card.non-technical {
          border-color: var(--player-green);
          background: linear-gradient(135deg, rgba(10, 215, 161, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%);
        }

        .event-card.non-technical::before {
          background: radial-gradient(circle, rgba(10, 215, 161, 0.1) 0%, transparent 70%);
        }

        .event-card.non-technical:hover {
          border-color: var(--guard-pink);
          box-shadow: 0 20px 60px rgba(10, 215, 161, 0.5);
        }

        .event-card.non-technical .event-symbol {
          color: var(--player-green);
        }

        .event-card.non-technical:hover .event-symbol {
          color: var(--guard-pink);
        }

        .btn-non-tech {
          background: var(--player-green) !important;
          border-color: var(--player-green) !important;
        }

        .btn-non-tech:hover {
          background: transparent !important;
          color: var(--player-green) !important;
          box-shadow: 0 5px 20px rgba(10, 215, 161, 0.5) !important;
        }

        .non-tech-modal-symbol {
          color: var(--player-green) !important;
        }

        .modal-content {
          border-color: var(--player-green) !important;
        }

        .modal-rules li::before {
          color: var(--player-green) !important;
        }
      `}</style>
    </div>
  );
};

export default NonTechnical;

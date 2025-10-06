import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import '../../styles/Technical.css';

const Special = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [specialEvents, setSpecialEvents] = useState([]);
  const { isAuthenticated} = useAuth();

  // Fallback static events (used if API fails)
  const staticSpecialEvents = [
    {
      id: 'vision-trial',
      name: 'Vision Trial',
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
      id: 'robo-rumble',
      name: 'Robo Rumble',
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

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events?category=special');
        if (data && data.data && data.data.length > 0) {
          setSpecialEvents(data.data);
        } else {
          setSpecialEvents(staticSpecialEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setSpecialEvents(staticSpecialEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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

    // Check if this is a real event from database (has _id) or static fallback
    if (!event._id) {
      alert('Event registration is currently unavailable. Events are being set up in the database. Please check back later.');
      return;
    }

    const eventId = event._id;

    if (registeredEvents.has(eventId)) {
      alert('You are already registered for this event');
      return;
    }

    setRegistering(eventId);
    try {
      const { data } = await api.post(`/event-registrations/${eventId}/register`, {
        isTeamEvent: event.teamSize ? true : false,
        teamMembers: []
      });

      alert(`Successfully registered for ${event.name}!`);
      setRegisteredEvents(new Set([...registeredEvents, eventId]));
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
    <div className="technical-events special-page">
      <section className="technical-hero">
        <div className="hero-symbol special-symbol">△</div>
        <h1 className="technical-title special-title">Special Events</h1>
        <p className="technical-subtitle">2 Premium Events with Bigger Prizes</p>
        <Link to="/events" className="btn-back">
          ← Back to Events
        </Link>
      </section>

      {loading ? (
        <div className="loading-container">
          <p>Loading events...</p>
        </div>
      ) : (
      <section className="technical-grid">
        <div className="container special-container">
          {specialEvents.map((event) => (
            <div 
              key={event._id || event.id} 
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
                    <p className="coordinator-name">
                      {event.coordinators?.[0]?.name || event.coordinator?.name || 'TBA'}
                    </p>
                    <p className="coordinator-phone">
                      {event.coordinators?.[0]?.phone || event.coordinator?.phone || 'TBA'}
                    </p>
                  </div>
                </div>
                <div className="event-actions">
                  <button className="btn-view-details btn-special">View Details</button>
                  {isAuthenticated && (
                    <button 
                      className={`btn-register-event ${isEventRegistered(event._id || event.id) ? 'registered' : ''}`}
                      onClick={(e) => handleRegisterEvent(event, e)}
                      disabled={registering === (event._id || event.id) || isEventRegistered(event._id || event.id)}
                    >
                      {registering === (event._id || event.id) ? 'Registering...' : 
                       isEventRegistered(event._id || event.id) ? '✓ Registered' : 'Register Now'}
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
      )}

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
              <p className="modal-prizes special-prizes">
                {selectedEvent.prizes?.first 
                  ? `🥇 ${selectedEvent.prizes.first} | 🥈 ${selectedEvent.prizes.second || 'TBA'} | 🥉 ${selectedEvent.prizes.third || 'TBA'}`
                  : selectedEvent.prizes || 'To be announced'}
              </p>
            </div>

            <div className="modal-section">
              <h3>Event Coordinator</h3>
              <div className="modal-coordinator">
                <p><strong>
                  {selectedEvent.coordinators?.[0]?.name || selectedEvent.coordinator?.name || 'TBA'}
                </strong></p>
                <p>
                  {selectedEvent.coordinators?.[0]?.phone || selectedEvent.coordinator?.phone || 'TBA'}
                </p>
              </div>
            </div>

            {isAuthenticated && (
              <button 
                className={`btn-register-modal ${isEventRegistered(selectedEvent._id || selectedEvent.id) ? 'registered' : ''}`}
                onClick={(e) => handleRegisterEvent(selectedEvent, e)}
                disabled={registering === (selectedEvent._id || selectedEvent.id) || isEventRegistered(selectedEvent._id || selectedEvent.id)}
              >
                {registering === (selectedEvent._id || selectedEvent.id) ? 'Registering...' : 
                 isEventRegistered(selectedEvent._id || selectedEvent.id) ? '✓ Already Registered' : 'Register for this Event'}
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

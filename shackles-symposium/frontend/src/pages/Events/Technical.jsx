import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import '../../styles/Technical.css';

const Technical = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [technicalEvents, setTechnicalEvents] = useState([]);
  const { isAuthenticated } = useAuth();

  // Fallback static events (used if API fails)
  const staticTechnicalEvents = [
    {
      id: 'innovation-duel',
      name: 'Innovation Duel',
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
      id: 'brain-busters-arena',
      name: 'Brain Busters Arena',
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
      id: 'dimensions-forge',
      name: 'Dimensions Forge',
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
        name: 'Praveen',
        phone: '+91 9514585887',
      },
    },
    {
      id: 'sky-shot',
      name: 'Sky Shot',
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
        name: 'Vignesh',
        phone: '+91 9361428799',
      },
    },
    {
      id: 'engine-gamble',
      name: 'Engine Gamble',
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
        name: 'Sanjay',
        phone: '+91 9384583077',
      },
    },
    {
      id: 'mech-showdown',
      name: 'Mech Showdown',
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
        name: 'Shobith',
        phone: '+91 8098726547',
      },
    },
  ];

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('🔍 Fetching technical events...');
        const response = await api.get('/events?category=technical');
        console.log('📦 API Response:', response);
        console.log('📊 Response data:', response.data);
        
        const { data } = response;
        
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          console.log(`✅ Found ${data.data.length} technical events from API`);
          setTechnicalEvents(data.data);
        } else {
          console.log('⚠️ No events found in API, using static fallback');
          console.log('Data structure:', { hasData: !!data, hasDataProp: !!data?.data, isArray: Array.isArray(data?.data), length: data?.data?.length });
          setTechnicalEvents(staticTechnicalEvents);
        }
      } catch (error) {
        console.error('❌ Error fetching events:', error);
        console.error('Error details:', error.response?.data || error.message);
        setTechnicalEvents(staticTechnicalEvents);
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
    e.stopPropagation(); // Prevent modal from opening
    
    console.log('🔍 Event object:', event);
    console.log('🆔 Event ID:', event._id);
    console.log('📋 Event keys:', Object.keys(event));
    
    if (!isAuthenticated) {
      alert('Please login to register for events');
      return;
    }

    // Check if this is a real event from database (has _id) or static fallback
    if (!event._id) {
      console.error('❌ No _id found on event:', event);
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
        teamMembers: [] // For now, empty. Can add team member modal later
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
    <div className="technical-events">
      <section className="technical-hero">
        <div className="hero-symbol">■</div>
        <h1 className="technical-title">Technical Events</h1>
        <p className="technical-subtitle">6 Challenging Events for Engineering Minds</p>
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
        <div className="container">
          {technicalEvents.map((event, index) => {
            console.log(`Event ${index}:`, event);
            console.log(`Event ${index} _id:`, event._id);
            return (
            <div 
              key={event._id || event.id} 
              className="event-card technical"
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
                  <button className="btn-view-details">View Details</button>
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
          );
          })}
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
              <p className="modal-prizes">
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
        <h2>Ready to Compete?</h2>
        <p>Register now for ₹299 and get access to all events</p>
        <Link to="/register" className="btn-register-tech">
          Register Now
        </Link>
      </section>
    </div>
  );
};

export default Technical;

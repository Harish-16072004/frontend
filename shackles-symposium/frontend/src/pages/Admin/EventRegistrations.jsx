import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';
import './EventRegistrations.css';

const EventRegistrations = () => {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all registrations
      const regResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/event-registrations/registrations/all`,
        { headers }
      );

      // Fetch events
      const eventsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/events`,
        { headers }
      );

      // Fetch workshops
      const workshopsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/workshops`,
        { headers }
      );

      setRegistrations(regResponse.data.data || []);
      setEvents(eventsResponse.data.data || eventsResponse.data.events || []);
      setWorkshops(workshopsResponse.data.data || workshopsResponse.data.workshops || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group registrations by event
  const groupedRegistrations = () => {
    const grouped = {};

    registrations.forEach(reg => {
      const eventId = reg.event?._id || reg.event;
      const eventName = reg.event?.name || reg.eventName || 'Unknown Event';
      const eventType = reg.eventType || 'event';

      if (!grouped[eventId]) {
        grouped[eventId] = {
          eventId,
          eventName,
          eventType,
          registrations: []
        };
      }

      grouped[eventId].registrations.push(reg);
    });

    // Filter by event if selected
    if (selectedEvent !== 'all') {
      return { [selectedEvent]: grouped[selectedEvent] };
    }

    // Filter by type
    if (filterType !== 'all') {
      const filtered = {};
      Object.keys(grouped).forEach(key => {
        if (grouped[key].eventType === filterType) {
          filtered[key] = grouped[key];
        }
      });
      return filtered;
    }

    return grouped;
  };

  const filteredRegistrations = (regs) => {
    if (!searchTerm) return regs;
    return regs.filter(reg =>
      reg.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.user?.college?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) {
    return <Loader />;
  }

  const grouped = groupedRegistrations();

  return (
    <div className="event-registrations-page">
      <div className="registrations-container">
        <div className="page-header">
          <h1 className="page-title">EVENT-WISE REGISTRATIONS</h1>
          <p className="page-subtitle">View all participant registrations by event</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Event Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="technical">Technical</option>
              <option value="non-technical">Non-Technical</option>
              <option value="workshop">Workshop</option>
              <option value="special">Special</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search Participant:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, email, or college..."
              className="filter-input"
            />
          </div>

          <div className="stats-summary">
            <span className="stat-item">
              Total Registrations: <strong>{registrations.length}</strong>
            </span>
            <span className="stat-item">
              Events: <strong>{Object.keys(grouped).length}</strong>
            </span>
          </div>
        </div>

        {/* Registrations by Event */}
        <div className="events-list">
          {Object.keys(grouped).length === 0 ? (
            <div className="no-data">
              <p>No registrations found</p>
            </div>
          ) : (
            Object.values(grouped).map((eventGroup, index) => {
              const filtered = filteredRegistrations(eventGroup.registrations);
              if (filtered.length === 0 && searchTerm) return null;

              return (
                <div key={index} className="event-registration-card">
                  <div className="event-card-header">
                    <div className="event-title-section">
                      <h2 className="event-title">{eventGroup.eventName}</h2>
                      <span className={`event-type-tag ${eventGroup.eventType}`}>
                        {eventGroup.eventType === 'workshop' ? '🛠️ Workshop' :
                         eventGroup.eventType === 'technical' ? '💻 Technical' :
                         eventGroup.eventType === 'non-technical' ? '🎭 Non-Technical' :
                         eventGroup.eventType === 'special' ? '⭐ Special' : '📅 Event'}
                      </span>
                    </div>
                    <div className="registration-count">
                      <span className="count-badge">{filtered.length}</span>
                      <span className="count-label">Participants</span>
                    </div>
                  </div>

                  <div className="participants-table-wrapper">
                    <table className="participants-table">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>College</th>
                          <th>Department</th>
                          <th>Registered On</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((reg, idx) => (
                          <tr key={reg._id}>
                            <td>{idx + 1}</td>
                            <td className="name-cell">{reg.user?.name || 'N/A'}</td>
                            <td>{reg.user?.email || 'N/A'}</td>
                            <td>{reg.user?.phone || 'N/A'}</td>
                            <td>{reg.user?.college || 'N/A'}</td>
                            <td>{reg.user?.department || 'N/A'}</td>
                            <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${reg.status}`}>
                                {reg.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistrations;

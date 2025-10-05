import { useState, useEffect } from 'react';
import axios from 'axios';
import './EventManagement.css';

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'workshops'
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalWorkshops: 0,
    upcomingEvents: 0,
    activeWorkshops: 0
  });

  // Form state for Events
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    category: 'technical',
    type: 'individual',
    isTeamEvent: false,
    teamSize: { min: 1, max: 1 },
    venue: '',
    date: '',
    time: { start: '', end: '' },
    maxParticipants: 100,
    registrationDeadline: '',
    rules: [''],
    prizes: {
      first: '',
      second: '',
      third: ''
    },
    coordinators: [{ name: '', phone: '', email: '' }],
    status: 'upcoming'
  });

  // Form state for Workshops
  const [workshopForm, setWorkshopForm] = useState({
    title: '',
    description: '',
    instructor: {
      name: '',
      designation: '',
      organization: '',
      bio: ''
    },
    duration: { hours: 2 },
    schedule: [{ date: '', startTime: '', endTime: '', topic: '' }],
    venue: '',
    maxParticipants: 50,
    registrationDeadline: '',
    prerequisites: [''],
    learningOutcomes: [''],
    materials: [''],
    fee: 0,
    coordinators: [{ name: '', phone: '', email: '' }],
    status: 'upcoming'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'events') {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/events`,
          { headers }
        );
        setEvents(response.data.events || []);
      } else {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/workshops`,
          { headers }
        );
        setWorkshops(response.data.workshops || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const upcoming = events.filter(e => new Date(e.date) > now).length;
    const active = workshops.filter(w => w.status === 'active').length;

    return {
      totalEvents: events.length,
      totalWorkshops: workshops.length,
      upcomingEvents: upcoming,
      activeWorkshops: active
    };
  };

  // Filter data
  const getFilteredData = () => {
    const data = activeTab === 'events' ? events : workshops;
    let filtered = [...data];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const name = activeTab === 'events' ? item.name : item.title;
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.venue.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Category filter (for events only)
    if (activeTab === 'events' && categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    return filtered;
  };

  const handleCreateNew = () => {
    setModalMode('create');
    setSelectedItem(null);
    if (activeTab === 'events') {
      setEventForm({
        name: '',
        description: '',
        category: 'technical',
        type: 'individual',
        isTeamEvent: false,
        teamSize: { min: 1, max: 1 },
        venue: '',
        date: '',
        time: { start: '', end: '' },
        maxParticipants: 100,
        registrationDeadline: '',
        rules: [''],
        prizes: { first: '', second: '', third: '' },
        coordinators: [{ name: '', phone: '', email: '' }],
        status: 'upcoming'
      });
    } else {
      setWorkshopForm({
        title: '',
        description: '',
        instructor: {
          name: '',
          designation: '',
          organization: '',
          bio: ''
        },
        duration: { hours: 2 },
        schedule: [{ date: '', startTime: '', endTime: '', topic: '' }],
        venue: '',
        maxParticipants: 50,
        registrationDeadline: '',
        prerequisites: [''],
        learningOutcomes: [''],
        materials: [''],
        fee: 0,
        coordinators: [{ name: '', phone: '', email: '' }],
        status: 'upcoming'
      });
    }
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setSelectedItem(item);
    if (activeTab === 'events') {
      setEventForm(item);
    } else {
      setWorkshopForm(item);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = activeTab === 'events' ? 'events' : 'workshops';
      
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/${endpoint}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete. Check console.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const formData = activeTab === 'events' ? eventForm : workshopForm;
      const endpoint = activeTab === 'events' ? 'events' : 'workshops';

      if (modalMode === 'create') {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/${endpoint}`,
          formData,
          { headers }
        );
        alert('Created successfully!');
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/${endpoint}/${selectedItem._id}`,
          formData,
          { headers }
        );
        alert('Updated successfully!');
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save. Check console.');
    }
  };

  // Helper functions for array fields
  const addArrayField = (field, value = '') => {
    if (activeTab === 'events') {
      setEventForm({
        ...eventForm,
        [field]: [...eventForm[field], value]
      });
    } else {
      setWorkshopForm({
        ...workshopForm,
        [field]: [...workshopForm[field], value]
      });
    }
  };

  const removeArrayField = (field, index) => {
    if (activeTab === 'events') {
      const newArray = eventForm[field].filter((_, i) => i !== index);
      setEventForm({ ...eventForm, [field]: newArray });
    } else {
      const newArray = workshopForm[field].filter((_, i) => i !== index);
      setWorkshopForm({ ...workshopForm, [field]: newArray });
    }
  };

  const updateArrayField = (field, index, value) => {
    if (activeTab === 'events') {
      const newArray = [...eventForm[field]];
      newArray[index] = value;
      setEventForm({ ...eventForm, [field]: newArray });
    } else {
      const newArray = [...workshopForm[field]];
      newArray[index] = value;
      setWorkshopForm({ ...workshopForm, [field]: newArray });
    }
  };

  const filteredData = getFilteredData();
  const currentStats = calculateStats();

  if (loading) {
    return (
      <div className="event-management loading">
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-management">
      {/* Header */}
      <div className="em-header">
        <div className="em-title">
          <h1>🎭 Event Management</h1>
          <p>Manage events, workshops, and schedules</p>
        </div>
        <button className="btn-create" onClick={handleCreateNew}>
          ➕ Create New {activeTab === 'events' ? 'Event' : 'Workshop'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card events">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-value">{currentStats.totalEvents}</div>
            <div className="stat-label">Total Events</div>
          </div>
        </div>

        <div className="stat-card workshops">
          <div className="stat-icon">🛠️</div>
          <div className="stat-info">
            <div className="stat-value">{currentStats.totalWorkshops}</div>
            <div className="stat-label">Total Workshops</div>
          </div>
        </div>

        <div className="stat-card upcoming">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-value">{currentStats.upcomingEvents}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-value">{currentStats.activeWorkshops}</div>
            <div className="stat-label">Active Workshops</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          🎯 Events ({events.length})
        </button>
        <button
          className={`tab ${activeTab === 'workshops' ? 'active' : ''}`}
          onClick={() => setActiveTab('workshops')}
        >
          🛠️ Workshops ({workshops.length})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder={`🔍 Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === 'events' && (
          <div className="filters">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="non-technical">Non-Technical</option>
              <option value="special">Special</option>
            </select>
          </div>
        )}
      </div>

      {/* Data Grid */}
      <div className="data-grid">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No {activeTab} found</h3>
            <p>Create your first {activeTab === 'events' ? 'event' : 'workshop'} to get started!</p>
            <button className="btn-create" onClick={handleCreateNew}>
              ➕ Create New
            </button>
          </div>
        ) : (
          filteredData.map((item) => (
            <div key={item._id} className="data-card">
              <div className="card-header">
                <h3>{activeTab === 'events' ? item.name : item.title}</h3>
                <div className="card-actions">
                  <button
                    className="btn-icon edit"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDelete(item._id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="card-body">
                <p className="description">
                  {item.description.substring(0, 150)}
                  {item.description.length > 150 ? '...' : ''}
                </p>

                <div className="card-details">
                  {activeTab === 'events' ? (
                    <>
                      <div className="detail-item">
                        <span className="label">📍 Venue:</span>
                        <span className="value">{item.venue}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">📅 Date:</span>
                        <span className="value">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">⏰ Time:</span>
                        <span className="value">
                          {item.time.start} - {item.time.end}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">🎯 Category:</span>
                        <span className={`badge badge-${item.category}`}>
                          {item.category}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">👥 Type:</span>
                        <span className="value">{item.type}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">👤 Max:</span>
                        <span className="value">{item.maxParticipants}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="detail-item">
                        <span className="label">👨‍🏫 Instructor:</span>
                        <span className="value">{item.instructor.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">⏱️ Duration:</span>
                        <span className="value">{item.duration.hours} hours</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">📍 Venue:</span>
                        <span className="value">{item.venue}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">💰 Fee:</span>
                        <span className="value">₹{item.fee || 0}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">👤 Max:</span>
                        <span className="value">{item.maxParticipants}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="card-footer">
                  <span className={`status-badge status-${item.status}`}>
                    {item.status}
                  </span>
                  <span className="registration-count">
                    {item.registrations?.length || 0} registered
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            
            <div className="modal-header">
              <h2>
                {modalMode === 'create' ? '➕ Create' : '✏️ Edit'}{' '}
                {activeTab === 'events' ? 'Event' : 'Workshop'}
              </h2>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {activeTab === 'events' ? (
                  // Event Form
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Event Name *</label>
                      <input
                        type="text"
                        value={eventForm.name}
                        onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Description *</label>
                      <textarea
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        rows="4"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                        required
                      >
                        <option value="technical">Technical</option>
                        <option value="non-technical">Non-Technical</option>
                        <option value="special">Special</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Type *</label>
                      <select
                        value={eventForm.type}
                        onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                        required
                      >
                        <option value="individual">Individual</option>
                        <option value="team">Team</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Venue *</label>
                      <input
                        type="text"
                        value={eventForm.venue}
                        onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Start Time *</label>
                      <input
                        type="time"
                        value={eventForm.time.start}
                        onChange={(e) => setEventForm({
                          ...eventForm,
                          time: { ...eventForm.time, start: e.target.value }
                        })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>End Time *</label>
                      <input
                        type="time"
                        value={eventForm.time.end}
                        onChange={(e) => setEventForm({
                          ...eventForm,
                          time: { ...eventForm.time, end: e.target.value }
                        })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Max Participants *</label>
                      <input
                        type="number"
                        value={eventForm.maxParticipants}
                        onChange={(e) => setEventForm({ ...eventForm, maxParticipants: parseInt(e.target.value) })}
                        required
                        min="1"
                      />
                    </div>

                    <div className="form-group">
                      <label>Registration Deadline *</label>
                      <input
                        type="datetime-local"
                        value={eventForm.registrationDeadline}
                        onChange={(e) => setEventForm({ ...eventForm, registrationDeadline: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Status *</label>
                      <select
                        value={eventForm.status}
                        onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                        required
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Rules</label>
                      {eventForm.rules.map((rule, index) => (
                        <div key={index} className="array-field">
                          <input
                            type="text"
                            value={rule}
                            onChange={(e) => updateArrayField('rules', index, e.target.value)}
                            placeholder={`Rule ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeArrayField('rules', index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => addArrayField('rules', '')}
                      >
                        + Add Rule
                      </button>
                    </div>

                    <div className="form-group full-width">
                      <h4>Prizes</h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>First Prize</label>
                          <input
                            type="text"
                            value={eventForm.prizes.first}
                            onChange={(e) => setEventForm({
                              ...eventForm,
                              prizes: { ...eventForm.prizes, first: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Second Prize</label>
                          <input
                            type="text"
                            value={eventForm.prizes.second}
                            onChange={(e) => setEventForm({
                              ...eventForm,
                              prizes: { ...eventForm.prizes, second: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Third Prize</label>
                          <input
                            type="text"
                            value={eventForm.prizes.third}
                            onChange={(e) => setEventForm({
                              ...eventForm,
                              prizes: { ...eventForm.prizes, third: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Workshop Form
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Workshop Title *</label>
                      <input
                        type="text"
                        value={workshopForm.title}
                        onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Description *</label>
                      <textarea
                        value={workshopForm.description}
                        onChange={(e) => setWorkshopForm({ ...workshopForm, description: e.target.value })}
                        rows="4"
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <h4>Instructor Details</h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Name *</label>
                          <input
                            type="text"
                            value={workshopForm.instructor.name}
                            onChange={(e) => setWorkshopForm({
                              ...workshopForm,
                              instructor: { ...workshopForm.instructor, name: e.target.value }
                            })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Designation</label>
                          <input
                            type="text"
                            value={workshopForm.instructor.designation}
                            onChange={(e) => setWorkshopForm({
                              ...workshopForm,
                              instructor: { ...workshopForm.instructor, designation: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Organization</label>
                          <input
                            type="text"
                            value={workshopForm.instructor.organization}
                            onChange={(e) => setWorkshopForm({
                              ...workshopForm,
                              instructor: { ...workshopForm.instructor, organization: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Duration (hours) *</label>
                      <input
                        type="number"
                        value={workshopForm.duration.hours}
                        onChange={(e) => setWorkshopForm({
                          ...workshopForm,
                          duration: { hours: parseInt(e.target.value) }
                        })}
                        required
                        min="1"
                      />
                    </div>

                    <div className="form-group">
                      <label>Venue *</label>
                      <input
                        type="text"
                        value={workshopForm.venue}
                        onChange={(e) => setWorkshopForm({ ...workshopForm, venue: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Max Participants *</label>
                      <input
                        type="number"
                        value={workshopForm.maxParticipants}
                        onChange={(e) => setWorkshopForm({ ...workshopForm, maxParticipants: parseInt(e.target.value) })}
                        required
                        min="1"
                      />
                    </div>

                    <div className="form-group">
                      <label>Fee (₹)</label>
                      <input
                        type="number"
                        value={workshopForm.fee}
                        onChange={(e) => setWorkshopForm({ ...workshopForm, fee: parseInt(e.target.value) })}
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label>Registration Deadline *</label>
                      <input
                        type="datetime-local"
                        value={workshopForm.registrationDeadline}
                        onChange={(e) => setWorkshopForm({ ...workshopForm, registrationDeadline: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Status *</label>
                      <select
                        value={workshopForm.status}
                        onChange={(e) => setWorkshopForm({ ...workshopForm, status: e.target.value })}
                        required
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Prerequisites</label>
                      {workshopForm.prerequisites.map((prereq, index) => (
                        <div key={index} className="array-field">
                          <input
                            type="text"
                            value={prereq}
                            onChange={(e) => updateArrayField('prerequisites', index, e.target.value)}
                            placeholder={`Prerequisite ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeArrayField('prerequisites', index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => addArrayField('prerequisites', '')}
                      >
                        + Add Prerequisite
                      </button>
                    </div>

                    <div className="form-group full-width">
                      <label>Learning Outcomes</label>
                      {workshopForm.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="array-field">
                          <input
                            type="text"
                            value={outcome}
                            onChange={(e) => updateArrayField('learningOutcomes', index, e.target.value)}
                            placeholder={`Outcome ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeArrayField('learningOutcomes', index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => addArrayField('learningOutcomes', '')}
                      >
                        + Add Outcome
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    {modalMode === 'create' ? 'Create' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;

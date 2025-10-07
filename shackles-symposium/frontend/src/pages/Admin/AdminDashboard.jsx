import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/common/Loader';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    verifiedPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    generalOnly: 0,
    workshopOnly: 0,
    both: 0,
    kitsIssued: 0,
    eventWiseRegistrations: [],
    recentRegistrations: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch users data
      const usersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const users = usersResponse.data.users || [];
      
      // Fetch all events
      const eventsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/events`
      );
      
      // Fetch all workshops
      const workshopsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/workshops`
      );
      
      // Fetch all event registrations
      const registrationsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/event-registrations/registrations/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const events = eventsResponse.data.data || eventsResponse.data.events || [];
      const workshops = workshopsResponse.data.data || workshopsResponse.data.workshops || [];
      const allRegistrations = registrationsResponse.data.data || [];
      
      console.log('📊 Dashboard Data:', {
        users: users.length,
        events: events.length,
        workshops: workshops.length,
        registrations: allRegistrations.length
      });
      
      // Calculate stats from real data
      const totalUsers = users.length;
      const verifiedUsers = users.filter(u => u.paymentStatus === 'verified').length;
      const pendingUsers = users.filter(u => u.paymentStatus === 'pending').length;
      const totalRevenue = users
        .filter(u => u.paymentStatus === 'verified')
        .reduce((sum, u) => sum + (u.paymentAmount || 0), 0);
      
      const generalOnly = users.filter(u => u.registrationType === 'general').length;
      const workshopOnly = users.filter(u => u.registrationType === 'workshop').length;
      const both = users.filter(u => u.registrationType === 'both').length;
      const kitsIssued = users.filter(u => u.participantId).length;
      
      // Get recent registrations (last 10)
      const recentUsers = users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(user => ({
          id: user.participantId || 'Pending',
          name: user.name,
          college: user.college,
          date: user.createdAt,
          status: user.paymentStatus
        }));
      
      // Event-wise registrations - count from EventRegistration collection
      // Combine events and workshops
      const allEventItems = [
        ...events.map(e => ({ id: e._id, name: e.name, type: e.category || e.type || 'event' })),
        ...workshops.map(w => ({ id: w._id, name: w.title, type: 'workshop' }))
      ];
      
      // Count registrations for each event/workshop
      const eventCounts = {};
      allRegistrations.forEach(reg => {
        const eventId = reg.event?._id || reg.event;
        if (eventId) {
          eventCounts[eventId] = (eventCounts[eventId] || 0) + 1;
        }
      });
      
      // Map counts to event names and sort by count
      const eventWiseRegistrations = allEventItems
        .map(item => ({
          name: item.name,
          type: item.type,
          count: eventCounts[item.id] || 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 events/workshops
      
      setStats({
        totalRegistrations: totalUsers,
        verifiedPayments: verifiedUsers,
        pendingPayments: pendingUsers,
        totalRevenue: totalRevenue,
        generalOnly,
        workshopOnly,
        both,
        kitsIssued,
        eventWiseRegistrations,
        recentRegistrations: recentUsers
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">SHACKLES 2025 Management</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card registrations">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3 className="stat-label">Total Registrations</h3>
              <p className="stat-value">{stats.totalRegistrations}</p>
            </div>
          </div>

          <div className="stat-card verified">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <h3 className="stat-label">Verified Payments</h3>
              <p className="stat-value">{stats.verifiedPayments}</p>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3 className="stat-label">Pending Payments</h3>
              <p className="stat-value">{stats.pendingPayments}</p>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3 className="stat-label">Total Revenue</h3>
              <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Registration Type Stats */}
        <div className="stats-grid" style={{ marginTop: '20px' }}>
          <div className="stat-card" style={{ borderLeft: '4px solid #3498db' }}>
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3 className="stat-label">General Only</h3>
              <p className="stat-value">{stats.generalOnly}</p>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid #f39c12' }}>
            <div className="stat-icon">🛠️</div>
            <div className="stat-content">
              <h3 className="stat-label">Workshop Only</h3>
              <p className="stat-value">{stats.workshopOnly}</p>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid #e74c3c' }}>
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3 className="stat-label">Both</h3>
              <p className="stat-value">{stats.both}</p>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid #1abc9c' }}>
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3 className="stat-label">Kits Issued</h3>
              <p className="stat-value">{stats.kitsIssued}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/users" className="action-card">
              <span className="action-icon">👥</span>
              <span className="action-label">Manage Users</span>
            </Link>
            <Link to="/admin/events" className="action-card">
              <span className="action-icon">📅</span>
              <span className="action-label">Manage Events</span>
            </Link>
            <Link to="/admin/registrations" className="action-card">
              <span className="action-icon">📋</span>
              <span className="action-label">View Registrations</span>
            </Link>
            <Link to="/admin/payments" className="action-card">
              <span className="action-icon">💳</span>
              <span className="action-label">Verify Payments</span>
            </Link>
            <Link to="/admin/scanner" className="action-card">
              <span className="action-icon">📷</span>
              <span className="action-label">QR Scanner</span>
            </Link>
            <Link to="/admin/kit-distribution" className="action-card">
              <span className="action-icon">🎒</span>
              <span className="action-label">Kit Distribution</span>
            </Link>
          </div>
        </div>

        {/* Event-wise Registrations */}
        <div className="event-stats">
          <h2 className="section-title">Event-wise Registrations (All Categories)</h2>
          <div className="events-chart">
            {stats.eventWiseRegistrations.map((event, index) => (
              <div key={index} className="event-bar">
                <div className="event-info">
                  <span className="event-name">{event.name}</span>
                  <span className={`event-type-badge ${event.type}`}>
                    {event.type === 'workshop' ? '🛠️ Workshop' : 
                     event.type === 'technical' ? '💻 Tech' :
                     event.type === 'non-technical' ? '🎭 Non-Tech' :
                     event.type === 'special' ? '⭐ Special' : '📅 Event'}
                  </span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${Math.min((event.count / 70) * 100, 100)}%` }}
                  >
                    <span className="bar-value">{event.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="recent-registrations">
          <h2 className="section-title">Recent Registrations</h2>
          <div className="table-container">
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>Registration ID</th>
                  <th>Name</th>
                  <th>College</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentRegistrations.map((reg, index) => (
                  <tr key={index}>
                    <td className="reg-id">{reg.id}</td>
                    <td>{reg.name}</td>
                    <td>{reg.college}</td>
                    <td>{new Date(reg.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${reg.status}`}>
                        {reg.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/admin/users" className="view-all-link">
            View All Registrations →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

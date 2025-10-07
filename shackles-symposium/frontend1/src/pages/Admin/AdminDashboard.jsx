import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    verifiedPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    eventWiseRegistrations: [],
    recentRegistrations: []
  });

  useEffect(() => {
    // Fetch dashboard data
    const fetchStats = async () => {
      try {
        // Mock data - replace with actual API call
        setStats({
          totalRegistrations: 247,
          verifiedPayments: 198,
          pendingPayments: 49,
          totalRevenue: 148506,
          eventWiseRegistrations: [
            { name: 'Paper Presentation', count: 45 },
            { name: 'Technical Quiz', count: 52 },
            { name: 'CAD Modelling', count: 38 },
            { name: 'Water Rocketry', count: 31 },
            { name: 'IPL Auction', count: 64 },
            { name: 'Idea Pitching', count: 27 }
          ],
          recentRegistrations: [
            { id: 'SHACKLES2025-0245', name: 'Rajesh Kumar', college: 'Anna University', date: '2025-10-01', status: 'verified' },
            { id: 'SHACKLES2025-0246', name: 'Priya Sharma', college: 'MIT Chennai', date: '2025-10-01', status: 'pending' },
            { id: 'SHACKLES2025-0247', name: 'Amit Patel', college: 'PSG Tech', date: '2025-10-02', status: 'verified' }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
            <Link to="/admin/payments" className="action-card">
              <span className="action-icon">💳</span>
              <span className="action-label">Verify Payments</span>
            </Link>
            <Link to="/admin/qr-scanner" className="action-card">
              <span className="action-icon">📷</span>
              <span className="action-label">Scan QR Codes</span>
            </Link>
          </div>
        </div>

        {/* Event-wise Registrations */}
        <div className="event-stats">
          <h2 className="section-title">Event-wise Registrations</h2>
          <div className="events-chart">
            {stats.eventWiseRegistrations.map((event, index) => (
              <div key={index} className="event-bar">
                <span className="event-name">{event.name}</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${(event.count / 70) * 100}%` }}
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

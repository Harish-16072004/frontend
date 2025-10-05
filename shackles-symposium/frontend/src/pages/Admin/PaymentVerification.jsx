import { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentVerification.css';

const PaymentVerification = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, verified, stats
  const [pendingPayments, setPendingPayments] = useState([]);
  const [verifiedPayments, setVerifiedPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // verify or reject
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');

  const API_URL = 'http://localhost:5000/api/v1';

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (activeTab === 'pending') {
        const res = await axios.get(`${API_URL}/admin/payments/pending`, config);
        setPendingPayments(res.data.data);
      } else if (activeTab === 'verified') {
        const res = await axios.get(`${API_URL}/admin/payments/verified`, config);
        setVerifiedPayments(res.data.data);
      } else if (activeTab === 'stats') {
        const res = await axios.get(`${API_URL}/admin/payments/stats`, config);
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load data. Please login as admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/admin/payments/${selectedPayment._id}/verify`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Payment verified successfully!');
      setShowModal(false);
      setNotes('');
      setSelectedPayment(null);
      fetchData();
    } catch (error) {
      console.error('Failed to verify payment:', error);
      alert('Failed to verify payment');
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/admin/payments/${selectedPayment._id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Payment rejected');
      setShowModal(false);
      setReason('');
      setSelectedPayment(null);
      fetchData();
    } catch (error) {
      console.error('Failed to reject payment:', error);
      alert('Failed to reject payment');
    }
  };

  const openModal = (payment, action) => {
    setSelectedPayment(payment);
    setActionType(action);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
    setNotes('');
    setReason('');
    setActionType('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRegistrationTypeBadge = (type) => {
    const badges = {
      general: { text: 'General ₹299', color: '#0ad7a1' },
      workshop: { text: 'Workshop ₹199', color: '#e74c3c' },
      both: { text: 'Both ₹499', color: '#9b59b6' }
    };
    const badge = badges[type] || badges.general;
    return (
      <span 
        className="reg-type-badge" 
        style={{ backgroundColor: badge.color }}
      >
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="payment-verification-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="payment-verification-container">
      <div className="verification-header">
        <h1>💳 Payment Verification</h1>
        <p>Manage and verify user registrations</p>
      </div>

      {/* Tabs */}
      <div className="verification-tabs">
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending ({pendingPayments.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'verified' ? 'active' : ''}`}
          onClick={() => setActiveTab('verified')}
        >
          ✅ Verified
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
      </div>

      {/* Content */}
      <div className="verification-content">
        {activeTab === 'pending' && (
          <div className="pending-payments">
            {pendingPayments.length === 0 ? (
              <div className="empty-state">
                <h3>🎉 No pending payments!</h3>
                <p>All registrations have been processed.</p>
              </div>
            ) : (
              <div className="payments-grid">
                {pendingPayments.map((payment) => (
                  <div key={payment._id} className="payment-card">
                    <div className="card-header">
                      <h3>{payment.name}</h3>
                      {getRegistrationTypeBadge(payment.registrationType)}
                    </div>
                    
                    <div className="card-details">
                      <div className="detail-row">
                        <span className="label">📧 Email:</span>
                        <span>{payment.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">📱 Phone:</span>
                        <span>{payment.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">🏫 College:</span>
                        <span>{payment.college}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">📍 Location:</span>
                        <span>{payment.collegeLocation}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">🎓 Department:</span>
                        <span>{payment.department} - Year {payment.year}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">💰 Amount:</span>
                        <span className="amount">₹{payment.paymentAmount}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">🔢 Transaction ID:</span>
                        <span className="transaction-id">{payment.transactionId}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">📅 Registered:</span>
                        <span>{formatDate(payment.createdAt)}</span>
                      </div>
                    </div>

                    {/* Payment Screenshot */}
                    <div className="payment-screenshot">
                      <h4>Payment Screenshot:</h4>
                      <a 
                        href={payment.paymentScreenshot} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="screenshot-link"
                      >
                        <img 
                          src={payment.paymentScreenshot} 
                          alt="Payment proof" 
                          className="screenshot-preview"
                        />
                        <span>🔍 View Full Size</span>
                      </a>
                    </div>

                    {/* Actions */}
                    <div className="card-actions">
                      <button
                        className="btn-verify"
                        onClick={() => openModal(payment, 'verify')}
                      >
                        ✅ Verify Payment
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => openModal(payment, 'reject')}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'verified' && (
          <div className="verified-payments">
            <h2>✅ Verified Payments ({verifiedPayments.length})</h2>
            {verifiedPayments.length === 0 ? (
              <div className="empty-state">
                <h3>No verified payments yet</h3>
              </div>
            ) : (
              <div className="verified-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>College</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Transaction ID</th>
                      <th>Verified On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifiedPayments.map((payment) => (
                      <tr key={payment._id}>
                        <td>{payment.name}</td>
                        <td>{payment.email}</td>
                        <td>{payment.college}</td>
                        <td>{getRegistrationTypeBadge(payment.registrationType)}</td>
                        <td>₹{payment.paymentAmount}</td>
                        <td>{payment.transactionId}</td>
                        <td>{formatDate(payment.verifiedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && stats && (
          <div className="payment-stats">
            <h2>📊 Payment Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{stats.totalRegistrations}</h3>
                <p>Total Registrations</p>
              </div>
              <div className="stat-card pending">
                <h3>{stats.pendingPayments}</h3>
                <p>Pending Verification</p>
              </div>
              <div className="stat-card verified">
                <h3>{stats.verifiedPayments}</h3>
                <p>Verified</p>
              </div>
              <div className="stat-card rejected">
                <h3>{stats.rejectedPayments}</h3>
                <p>Rejected</p>
              </div>
              <div className="stat-card revenue">
                <h3>₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                <p>Total Revenue</p>
              </div>
            </div>

            {stats.revenueByType && stats.revenueByType.length > 0 && (
              <div className="revenue-breakdown">
                <h3>Revenue Breakdown by Type:</h3>
                <div className="breakdown-grid">
                  {stats.revenueByType.map((item) => (
                    <div key={item._id} className="breakdown-card">
                      {getRegistrationTypeBadge(item._id)}
                      <p className="breakdown-count">{item.count} registrations</p>
                      <p className="breakdown-revenue">₹{item.totalRevenue.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedPayment && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {actionType === 'verify' ? '✅ Verify Payment' : '❌ Reject Payment'}
              </h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="payment-summary">
                <h3>{selectedPayment.name}</h3>
                <p>Email: {selectedPayment.email}</p>
                <p>Amount: ₹{selectedPayment.paymentAmount}</p>
                <p>Transaction ID: {selectedPayment.transactionId}</p>
              </div>

              {actionType === 'verify' ? (
                <div className="form-group">
                  <label>Notes (Optional):</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any verification notes..."
                    rows="4"
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label>Reason for Rejection *:</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please provide a clear reason for rejection..."
                    rows="4"
                    required
                  />
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              {actionType === 'verify' ? (
                <button className="btn-verify" onClick={handleVerify}>
                  ✅ Verify Payment
                </button>
              ) : (
                <button className="btn-reject" onClick={handleReject}>
                  ❌ Reject Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;

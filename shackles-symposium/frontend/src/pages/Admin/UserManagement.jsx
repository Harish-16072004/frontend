import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    registrationType: 'all',
    paymentStatus: 'all',
    kitStatus: 'all'
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    general: 0,
    workshop: 0,
    both: 0,
    kitsIssued: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Bulk Actions State
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Fetch users
  useEffect(() => {
    fetchUsers();
    fetchKitStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const usersData = response.data.users || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
      calculateStats(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const fetchKitStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/kit-stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setStats(prev => ({ ...prev, kitsIssued: response.data.kitsIssued || 0 }));
      }
    } catch (error) {
      console.log('Kit stats not available');
    }
  };

  const calculateStats = (usersData) => {
    const stats = {
      total: usersData.length,
      verified: usersData.filter(u => u.paymentStatus === 'verified').length,
      pending: usersData.filter(u => u.paymentStatus === 'pending').length,
      rejected: usersData.filter(u => u.paymentStatus === 'rejected').length,
      general: usersData.filter(u => u.registrationType === 'general').length,
      workshop: usersData.filter(u => u.registrationType === 'workshop').length,
      both: usersData.filter(u => u.registrationType === 'both').length,
      kitsIssued: usersData.filter(u => u.participantId).length
    };
    setStats(stats);
  };

  // Search and filter
  useEffect(() => {
    let result = [...users];

    // Search
    if (searchTerm) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        (user.participantId && user.participantId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.college.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filters
    if (filters.registrationType !== 'all') {
      result = result.filter(user => user.registrationType === filters.registrationType);
    }
    if (filters.paymentStatus !== 'all') {
      result = result.filter(user => user.paymentStatus === filters.paymentStatus);
    }
    if (filters.kitStatus !== 'all') {
      if (filters.kitStatus === 'issued') {
        result = result.filter(user => user.participantId);
      } else {
        result = result.filter(user => !user.participantId);
      }
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy, sortOrder, users]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setShowUserModal(true);

    // Fetch full user details including kit status
    try {
      const token = localStorage.getItem('token');
      if (user.participantId) {
        const kitResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/qr-scan/kit-status/${user.participantId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const attendanceResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/qr-scan/history/${user.participantId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSelectedUser(prev => ({
          ...prev,
          kitDetails: kitResponse.data.kit,
          attendanceHistory: attendanceResponse.data.attendance
        }));
      }
    } catch (error) {
      console.log('Error fetching additional details:', error);
    }
  };

  const downloadQR = (user) => {
    const canvas = document.getElementById(`qr-${user._id}`);
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${user.participantId}_QR.png`;
      link.href = url;
      link.click();
    }
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Participant ID', 'Name', 'Email', 'Phone', 'College', 'Department', 'Registration Type', 'Payment Status', 'Verified Date'],
      ...filteredUsers.map(user => [
        user.participantId || 'N/A',
        user.name,
        user.email,
        user.phone,
        user.college,
        user.department,
        user.registrationType,
        user.paymentStatus,
        user.verifiedAt ? new Date(user.verifiedAt).toLocaleDateString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `participants_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Bulk Actions Functions
  const toggleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(u => u._id));
    }
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkVerifyPayments = async () => {
    if (!window.confirm(`Verify payments for ${selectedUsers.length} users?`)) return;
    
    setBulkActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const selectedUserData = users.filter(u => selectedUsers.includes(u._id));
      
      for (const user of selectedUserData) {
        if (user.paymentStatus === 'pending') {
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/v1/admin/verify-payment/${user._id}`,
            { status: 'verified' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
      
      alert('Payments verified successfully!');
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error('Error verifying payments:', error);
      alert('Failed to verify some payments. Check console.');
    }
    setBulkActionLoading(false);
  };

  const handleBulkGenerateIDs = async () => {
    if (!window.confirm(`Generate Participant IDs for ${selectedUsers.length} verified users?`)) return;
    
    setBulkActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const selectedUserData = users.filter(u => 
        selectedUsers.includes(u._id) && 
        u.paymentStatus === 'verified' && 
        !u.participantId
      );
      
      if (selectedUserData.length === 0) {
        alert('No eligible users (must be verified and without ID)');
        setBulkActionLoading(false);
        return;
      }

      for (const user of selectedUserData) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/admin/generate-participant-id/${user._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      alert(`Generated IDs for ${selectedUserData.length} users!`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error('Error generating IDs:', error);
      alert('Failed to generate some IDs. Check console.');
    }
    setBulkActionLoading(false);
  };

  const handleBulkSendEmails = async () => {
    const emailType = window.prompt(
      'Enter email type:\n1. "welcome" - Welcome email\n2. "reminder" - Event reminder\n3. "qr" - Send QR codes',
      'welcome'
    );
    
    if (!emailType) return;
    
    if (!window.confirm(`Send ${emailType} emails to ${selectedUsers.length} users?`)) return;
    
    setBulkActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const selectedUserData = users.filter(u => selectedUsers.includes(u._id));
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/bulk-email`,
        { 
          userIds: selectedUsers,
          emailType: emailType 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Emails sent successfully!');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Email sending may not be configured yet.');
    }
    setBulkActionLoading(false);
  };

  const handleBulkExport = () => {
    const selectedUserData = users.filter(u => selectedUsers.includes(u._id));
    
    const csvContent = [
      ['Participant ID', 'Name', 'Email', 'Phone', 'College', 'Department', 'Registration Type', 'Payment Status', 'Verified Date'],
      ...selectedUserData.map(user => [
        user.participantId || 'N/A',
        user.name,
        user.email,
        user.phone,
        user.college,
        user.department,
        user.registrationType,
        user.paymentStatus,
        user.verifiedAt ? new Date(user.verifiedAt).toLocaleDateString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `selected_participants_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    alert(`Exported ${selectedUsers.length} participants!`);
  };

  // Clear selections when filters change
  useEffect(() => {
    setSelectedUsers([]);
  }, [searchTerm, filters, sortBy, sortOrder]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'verified': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'rejected': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getRegistrationTypeBadge = (type) => {
    switch (type) {
      case 'general': return 'badge-general';
      case 'workshop': return 'badge-workshop';
      case 'both': return 'badge-both';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="user-management loading">
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading participants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      {/* Header */}
      <div className="um-header">
        <div className="um-title">
          <h1>👥 User Management</h1>
          <p>Manage all registered participants</p>
        </div>
        <div className="header-actions">
          <button 
            className="bulk-actions-toggle"
            onClick={() => setShowBulkActions(!showBulkActions)}
          >
            {showBulkActions ? '✓ Bulk Mode ON' : '☐ Bulk Mode OFF'}
          </button>
          <button className="export-btn" onClick={exportToExcel}>
            📊 Export All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Registered</div>
          </div>
        </div>

        <div className="stat-card verified">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.verified}</div>
            <div className="stat-label">Payment Verified</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Payment Pending</div>
          </div>
        </div>

        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-value">{stats.rejected}</div>
            <div className="stat-label">Payment Rejected</div>
          </div>
        </div>
      </div>

      {/* Registration Type Stats */}
      <div className="type-stats">
        <div className="type-card general">
          <span className="type-icon">🎯</span>
          <span className="type-value">{stats.general}</span>
          <span className="type-label">General Only</span>
        </div>
        <div className="type-card workshop">
          <span className="type-icon">🛠️</span>
          <span className="type-value">{stats.workshop}</span>
          <span className="type-label">Workshop Only</span>
        </div>
        <div className="type-card both">
          <span className="type-icon">⭐</span>
          <span className="type-value">{stats.both}</span>
          <span className="type-label">Both</span>
        </div>
        <div className="type-card kits">
          <span className="type-icon">📦</span>
          <span className="type-value">{stats.kitsIssued}</span>
          <span className="type-label">Kits Issued</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by name, email, phone, participant ID, or college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select
            value={filters.registrationType}
            onChange={(e) => setFilters({ ...filters, registrationType: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="workshop">Workshop</option>
            <option value="both">Both</option>
          </select>

          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
          >
            <option value="all">All Payment Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.kitStatus}
            onChange={(e) => setFilters({ ...filters, kitStatus: e.target.value })}
          >
            <option value="all">All Kit Status</option>
            <option value="issued">Kit Issued</option>
            <option value="not-issued">Kit Not Issued</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="college">Sort by College</option>
          </select>

          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} participants</p>
        {selectedUsers.length > 0 && (
          <span className="selection-count">
            ✓ {selectedUsers.length} selected
          </span>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && selectedUsers.length > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-info">
            <span className="bulk-count">
              ✓ {selectedUsers.length} participant{selectedUsers.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="bulk-buttons">
            <button 
              className="bulk-btn verify"
              onClick={handleBulkVerifyPayments}
              disabled={bulkActionLoading}
            >
              ✅ Verify Payments
            </button>
            <button 
              className="bulk-btn generate"
              onClick={handleBulkGenerateIDs}
              disabled={bulkActionLoading}
            >
              🆔 Generate IDs
            </button>
            <button 
              className="bulk-btn email"
              onClick={handleBulkSendEmails}
              disabled={bulkActionLoading}
            >
              📧 Send Emails
            </button>
            <button 
              className="bulk-btn export"
              onClick={handleBulkExport}
              disabled={bulkActionLoading}
            >
              📥 Export Selected
            </button>
            <button 
              className="bulk-btn clear"
              onClick={() => setSelectedUsers([])}
            >
              ✕ Clear
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              {showBulkActions && (
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={toggleSelectAll}
                    title="Select all on this page"
                  />
                </th>
              )}
              <th>Participant ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>College</th>
              <th>Type</th>
              <th>Payment</th>
              <th>Kit Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user._id} className={selectedUsers.includes(user._id) ? 'selected-row' : ''}>
                {showBulkActions && (
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleSelectUser(user._id)}
                    />
                  </td>
                )}
                <td>
                  {user.participantId ? (
                    <span className="participant-id">{user.participantId}</span>
                  ) : (
                    <span className="no-id">Not Generated</span>
                  )}
                </td>
                <td className="name-cell">
                  <strong>{user.name}</strong>
                  <small>{user.department}</small>
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.college}</td>
                <td>
                  <span className={`badge ${getRegistrationTypeBadge(user.registrationType)}`}>
                    {user.registrationType}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(user.paymentStatus)}`}>
                    {user.paymentStatus}
                  </span>
                </td>
                <td>
                  {user.participantId ? (
                    <span className="badge badge-success">✓ Issued</span>
                  ) : (
                    <span className="badge badge-secondary">Pending</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => handleViewUser(user)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUserModal(false)}>×</button>
            
            <div className="modal-header">
              <h2>Participant Details</h2>
              {selectedUser.participantId && (
                <div className="participant-id-badge">{selectedUser.participantId}</div>
              )}
            </div>

            <div className="modal-body">
              {/* Personal Information */}
              <div className="detail-section">
                <h3>👤 Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedUser.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedUser.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>College:</label>
                    <span>{selectedUser.college}</span>
                  </div>
                  <div className="detail-item">
                    <label>Department:</label>
                    <span>{selectedUser.department}</span>
                  </div>
                  <div className="detail-item">
                    <label>Year:</label>
                    <span>{selectedUser.year}</span>
                  </div>
                </div>
              </div>

              {/* Registration Details */}
              <div className="detail-section">
                <h3>📝 Registration Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Registration Type:</label>
                    <span className={`badge ${getRegistrationTypeBadge(selectedUser.registrationType)}`}>
                      {selectedUser.registrationType}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Status:</label>
                    <span className={`badge ${getStatusBadgeClass(selectedUser.paymentStatus)}`}>
                      {selectedUser.paymentStatus}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Amount:</label>
                    <span>₹{selectedUser.paymentAmount}</span>
                  </div>
                  <div className="detail-item">
                    <label>Registration Date:</label>
                    <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
                  </div>
                  {selectedUser.verifiedAt && (
                    <div className="detail-item">
                      <label>Verified Date:</label>
                      <span>{new Date(selectedUser.verifiedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code */}
              {selectedUser.participantId && (
                <div className="detail-section qr-section">
                  <h3>🔲 QR Code</h3>
                  <div className="qr-container">
                    <QRCodeCanvas
                      id={`qr-${selectedUser._id}`}
                      value={JSON.stringify({
                        participantId: selectedUser.participantId,
                        name: selectedUser.name,
                        email: selectedUser.email,
                        registrationType: selectedUser.registrationType,
                        generatedAt: new Date().toISOString(),
                        eventName: 'SHACKLES 2025'
                      })}
                      size={200}
                      level="H"
                    />
                    <button
                      className="download-qr-btn"
                      onClick={() => downloadQR(selectedUser)}
                    >
                      📥 Download QR Code
                    </button>
                  </div>
                </div>
              )}

              {/* Kit Distribution Status */}
              {selectedUser.kitDetails && (
                <div className="detail-section">
                  <h3>📦 Kit Distribution</h3>
                  <div className="kit-info">
                    <p><strong>ID Card Number:</strong> {selectedUser.kitDetails.idCardNumber}</p>
                    <p><strong>Issued At:</strong> {new Date(selectedUser.kitDetails.issuedAt).toLocaleString()}</p>
                    <p><strong>Collection Point:</strong> {selectedUser.kitDetails.collectionPoint}</p>
                    <div className="kit-contents">
                      <strong>Kit Contents:</strong>
                      <ul>
                        {selectedUser.kitDetails.contents?.map((item, i) => (
                          <li key={i}>{item.item} ×{item.quantity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance History */}
              {selectedUser.attendanceHistory && selectedUser.attendanceHistory.length > 0 && (
                <div className="detail-section">
                  <h3>📊 Attendance History</h3>
                  <div className="attendance-list">
                    {selectedUser.attendanceHistory.map((attendance, i) => (
                      <div key={i} className="attendance-item">
                        <span className="event-name">
                          {attendance.event?.name || attendance.workshop?.name}
                        </span>
                        <span className="check-in-time">
                          {new Date(attendance.checkInTime).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

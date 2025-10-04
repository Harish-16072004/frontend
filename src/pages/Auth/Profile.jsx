import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import QRCode from 'qrcode.react';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        // API call would go here
        // For now, using mock data
        setProfileData({
          ...user,
          registrationId: 'SHACKLES2025-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
          events: ['paper-presentation', 'technical-quiz', 'cad-modelling'],
          workshops: ['additive-manufacturing'],
          accommodation: true,
          paymentStatus: 'verified',
          totalAmount: 1196,
          registrationDate: '2025-09-15'
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">SHACKLES 2025 Registration</p>
        </div>

        <div className="profile-content">
          {/* QR Code Section */}
          <div className="qr-section">
            <div className="qr-card">
              <h2 className="card-title">Your Entry Pass</h2>
              <div className="qr-wrapper">
                <QRCode
                  value={profileData?.registrationId || 'SHACKLES2025'}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="registration-id">{profileData?.registrationId}</p>
              <p className="qr-instruction">
                Show this QR code at the venue for entry and attendance
              </p>
              <button className="download-qr-btn">
                📥 Download QR Code
              </button>
            </div>

            <div className="status-card">
              <div className="status-item">
                <span className="status-label">Payment Status</span>
                <span className={`status-value ${profileData?.paymentStatus}`}>
                  {profileData?.paymentStatus === 'verified' ? '✓ Verified' : '⏳ Pending'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Total Amount Paid</span>
                <span className="status-value amount">₹{profileData?.totalAmount}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Registration Date</span>
                <span className="status-value">
                  {new Date(profileData?.registrationDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="details-section">
            <h2 className="section-title">■ Personal Information</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Name</span>
                <span className="detail-value">{user?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{user?.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">College</span>
                <span className="detail-value">{user?.college}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">{user?.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Year</span>
                <span className="detail-value">{user?.year}</span>
              </div>
            </div>
          </div>

          {/* Events Registered */}
          <div className="events-section">
            <h2 className="section-title">○ Registered Events</h2>
            <div className="events-list">
              {profileData?.events?.map((event, index) => (
                <div key={index} className="event-badge">
                  {event.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              ))}
            </div>
          </div>

          {/* Workshops */}
          {profileData?.workshops?.length > 0 && (
            <div className="workshops-section">
              <h2 className="section-title">◈ Registered Workshops</h2>
              <div className="workshops-list">
                {profileData?.workshops?.map((workshop, index) => (
                  <div key={index} className="workshop-badge">
                    {workshop.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accommodation */}
          {profileData?.accommodation && (
            <div className="accommodation-section">
              <h2 className="section-title">🏠 Accommodation</h2>
              <div className="accommodation-info">
                <p>✓ Accommodation booked for October 22-24, 2025</p>
                <p>Check-in: Oct 22, 4:00 PM | Check-out: Oct 24, 6:00 PM</p>
              </div>
            </div>
          )}

          {/* Important Information */}
          <div className="info-section">
            <h2 className="section-title">📋 Important Information</h2>
            <ul className="info-list">
              <li>Event Date: October 23-24, 2025</li>
              <li>Venue: ACGCET, Karaikudi</li>
              <li>Bring a valid college ID for verification</li>
              <li>Report to registration desk by 9:00 AM on October 23</li>
              <li>Keep your QR code ready for attendance marking</li>
              <li>Certificates will be provided after event completion</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <Link to="/contact" className="action-btn support-btn">
              Need Help? Contact Support
            </Link>
            <button onClick={logout} className="action-btn logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

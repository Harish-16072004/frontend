import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import QRCode from 'qrcode.react';
import api from '../../services/api';
import '../../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const qrRef = useRef();

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        // Fetch user's event registrations
        const { data: regData } = await api.get('/event-registrations/my-registrations');
        setRegistrations(regData.data || []);

        // Fetch user's full profile
        const { data: userData } = await api.get('/auth/me');
        
        setProfileData({
          ...userData.data,
          registrationId: userData.data.participantId || userData.data._id,
          participantId: userData.data.participantId || null,
          qrCodeUrl: userData.data.qrCode || null,
          events: regData.data?.map(reg => reg.event?.name || 'Unknown Event') || [],
          paymentStatus: userData.data.paymentStatus || 'pending',
          totalAmount: userData.data.paymentAmount || 0,
          registrationDate: userData.data.createdAt
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Fallback to basic user data
        setProfileData({
          ...user,
          registrationId: user?.participantId || user?._id || user?.id || 'SHACKLES2025',
          participantId: user?.participantId || null,
          qrCodeUrl: user?.qrCode || null,
          events: [],
          paymentStatus: user?.paymentStatus || 'pending',
          totalAmount: user?.paymentAmount || 0,
          registrationDate: user?.createdAt || new Date()
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const downloadQRCode = () => {
    // If QR code URL exists from S3, download it directly
    if (profileData?.qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `SHACKLES2025-${profileData?.participantId || profileData?.name?.replace(/\s+/g, '_')}-QR.png`;
      link.href = profileData.qrCodeUrl;
      link.target = '_blank';
      link.click();
    } else {
      // Fallback to canvas if no S3 URL (for unverified users)
      const canvas = qrRef.current?.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `SHACKLES2025-${profileData?.name?.replace(/\s+/g, '_')}-QR.png`;
        link.href = url;
        link.click();
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">PLAYER PROFILE</h1>
          <p className="profile-subtitle">SHACKLES 25-26 • SURVIVAL REGISTRATION</p>
        </div>

        <div className="profile-content">
          {/* QR Code Section */}
          <div className="qr-section">
            <div className="qr-card">
              <h2 className="card-title">◈ ENTRY PASS ◈</h2>
              <div className="qr-wrapper" ref={qrRef}>
                {profileData?.qrCodeUrl ? (
                  // Show QR code from S3 if payment is verified
                  <img 
                    src={profileData.qrCodeUrl} 
                    alt="Participant QR Code"
                    style={{ width: '220px', height: '220px', display: 'block' }}
                  />
                ) : profileData?.paymentStatus === 'verified' ? (
                  // Payment verified but QR not yet generated
                  <div style={{ 
                    width: '220px', 
                    height: '220px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: '#00D7A1',
                    fontSize: '14px',
                    textAlign: 'center',
                    padding: '20px'
                  }}>
                    <span style={{ fontSize: '48px', marginBottom: '10px' }}>⚙️</span>
                    <span>QR Code is being generated...</span>
                    <span style={{ fontSize: '12px', marginTop: '10px' }}>Please refresh in a few minutes</span>
                  </div>
                ) : (
                  // Payment not verified - show temporary QR with participant ID
                  <QRCode
                    value={profileData?.participantId || profileData?.registrationId || profileData?._id || 'SHACKLES2025-PENDING'}
                    size={220}
                    level="H"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                )}
              </div>
              <p className="registration-id">
                {profileData?.participantId ? (
                  <>PLAYER ID: {profileData.participantId}</>
                ) : (
                  <>PLAYER #{profileData?.registrationId?.slice(-8)?.toUpperCase() || '00000000'}</>
                )}
              </p>
              {profileData?.paymentStatus === 'verified' && profileData?.qrCodeUrl ? (
                <p className="qr-instruction">
                  ✅ QR CODE VERIFIED & ACTIVE
                </p>
              ) : profileData?.paymentStatus === 'verified' ? (
                <p className="qr-instruction">
                  ⚙️ YOUR QR CODE IS BEING GENERATED
                </p>
              ) : profileData?.paymentStatus === 'pending' ? (
                <p className="qr-instruction">
                  ⏳ AWAITING PAYMENT VERIFICATION
                </p>
              ) : (
                <p className="qr-instruction">
                  ⚠️ PAYMENT VERIFICATION REQUIRED
                </p>
              )}
              <button 
                className="download-qr-btn" 
                onClick={downloadQRCode}
                disabled={!profileData?.qrCodeUrl && profileData?.paymentStatus !== 'verified'}
              >
                📥 DOWNLOAD QR CODE
              </button>
            </div>

            <div className="status-card">
              <h2 className="card-title">■ STATUS ■</h2>
              <div className="status-item">
                <span className="status-label">PAYMENT</span>
                <span className={`status-badge ${profileData?.paymentStatus}`}>
                  {profileData?.paymentStatus === 'verified' && '✓ VERIFIED'}
                  {profileData?.paymentStatus === 'pending' && '⏳ PENDING'}
                  {profileData?.paymentStatus === 'rejected' && '✗ REJECTED'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">AMOUNT PAID</span>
                <span className="status-value amount">₹{profileData?.totalAmount || 0}</span>
              </div>
              <div className="status-item">
                <span className="status-label">REGISTERED ON</span>
                <span className="status-value">
                  {new Date(profileData?.registrationDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">REGISTRATION TYPE</span>
                <span className="status-value registration-type">
                  {profileData?.registrationType?.toUpperCase() || 'GENERAL'}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="details-section">
            <h2 className="section-title">■ PLAYER INFORMATION</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">NAME</span>
                <span className="detail-value">{profileData?.name || user?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">EMAIL</span>
                <span className="detail-value">{profileData?.email || user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">PHONE</span>
                <span className="detail-value">{profileData?.phone || user?.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">COLLEGE</span>
                <span className="detail-value">{profileData?.college || user?.college}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">DEPARTMENT</span>
                <span className="detail-value">{profileData?.department || user?.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">YEAR</span>
                <span className="detail-value">{profileData?.year || user?.year}</span>
              </div>
              {profileData?.collegeLocation && (
                <div className="detail-item">
                  <span className="detail-label">LOCATION</span>
                  <span className="detail-value">{profileData.collegeLocation}</span>
                </div>
              )}
              {profileData?.rollNumber && (
                <div className="detail-item">
                  <span className="detail-label">ROLL NUMBER</span>
                  <span className="detail-value">{profileData.rollNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Events Registered */}
          {profileData?.events?.length > 0 && (
            <div className="events-section">
              <h2 className="section-title">○ REGISTERED EVENTS</h2>
              <div className="events-list">
                {profileData.events.map((event, index) => (
                  <div key={index} className="event-badge">
                    {typeof event === 'string' ? event : event?.name || 'Unknown Event'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Information */}
          <div className="info-section">
            <h2 className="section-title">📋 GAME RULES & INSTRUCTIONS</h2>
            <ul className="info-list">
              <li>🎯 EVENT DATE: October 23-24, 2025</li>
              <li>🏛️ VENUE: ACGCET, Karaikudi</li>
              <li>🆔 Bring valid college ID for verification</li>
              <li>⏰ Report to registration desk by 9:00 AM on October 23</li>
              <li>📱 Keep your QR code ready for attendance marking</li>
              <li>🏆 Certificates will be provided after event completion</li>
              <li>⚠️ Follow all instructions from event coordinators</li>
              <li>🎉 Most importantly - Have fun and make memories!</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <Link to="/events" className="action-btn register-more-btn">
              ⚡ Register for More Events
            </Link>
            <Link to="/contact" className="action-btn support-btn">
              💬 Need Help? Contact Support
            </Link>
            <button onClick={logout} className="action-btn logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

/**
 * Event Check-in Page
 * Scan QR codes to check in participants at events
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRScanner from '../../components/QRScanner/QRScanner';
import axios from 'axios';
import './EventCheckIn.css';

const EventCheckIn = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [recentCheckIns, setRecentCheckIns] = useState([]);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvent(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event details');
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleQRScan = async (qrData) => {
    console.log('QR Scanned:', qrData);
    setProcessing(true);
    setError(null);
    setScanResult(null);

    try {
      const token = localStorage.getItem('token');
      
      // Step 1: Validate QR code
      const validateResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/qr-scan/scan-qr`,
        {
          qrData,
          eventId,
          eventType: event?.category === 'workshop' ? 'workshop' : 'event'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Validation response:', validateResponse.data);

      if (!validateResponse.data.success) {
        // Access denied or other error
        setScanResult({
          success: false,
          ...validateResponse.data
        });
        setProcessing(false);
        return;
      }

      // Check if already checked in
      if (validateResponse.data.alreadyCheckedIn) {
        setScanResult({
          success: true,
          alreadyCheckedIn: true,
          ...validateResponse.data
        });
        setProcessing(false);
        return;
      }

      // Step 2: Check in participant
      const checkInResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/qr-scan/check-in`,
        {
          participantId: validateResponse.data.participant.id,
          eventId,
          eventType: event?.category === 'workshop' ? 'workshop' : 'event',
          deviceInfo: {
            userAgent: navigator.userAgent,
            ipAddress: 'N/A' // Will be set by backend
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Check-in response:', checkInResponse.data);

      setScanResult({
        success: true,
        ...checkInResponse.data
      });

      // Add to recent check-ins
      setRecentCheckIns(prev => [
        {
          ...checkInResponse.data.attendance,
          timestamp: new Date()
        },
        ...prev.slice(0, 9) // Keep last 10
      ]);

      setProcessing(false);

    } catch (error) {
      console.error('Check-in error:', error);
      
      const errorMessage = error.response?.data?.message || 'Check-in failed';
      const errorData = error.response?.data || {};
      
      setScanResult({
        success: false,
        error: errorData.error || 'CHECK_IN_ERROR',
        message: errorMessage,
        ...errorData
      });
      
      setProcessing(false);
    }
  };

  const handleClearResult = () => {
    setScanResult(null);
    setScanning(true);
  };

  const handleStartScanning = () => {
    setScanning(true);
    setScanResult(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="checkin-page loading">
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkin-page error">
        <div className="error-container">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/events')}>
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkin-page">
      <div className="checkin-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="event-info">
          <h1>📋 Event Check-In</h1>
          <h2>{event?.name}</h2>
          <div className="event-meta">
            <span className="category">{event?.category}</span>
            <span className="venue">📍 {event?.venue}</span>
            <span className="date">📅 {new Date(event?.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="checkin-content">
        {!scanning && !scanResult && (
          <div className="start-container">
            <div className="start-card">
              <div className="icon">📱</div>
              <h3>Ready to Scan</h3>
              <p>Click the button below to start scanning participant QR codes</p>
              <button className="start-button" onClick={handleStartScanning}>
                Start Scanning
              </button>
            </div>
          </div>
        )}

        {scanning && !scanResult && !processing && (
          <div className="scanner-container">
            <QRScanner 
              onScan={handleQRScan}
              isActive={scanning}
            />
          </div>
        )}

        {processing && (
          <div className="processing-container">
            <div className="processing-card">
              <div className="spinner"></div>
              <h3>Processing...</h3>
              <p>Validating QR code and checking in participant</p>
            </div>
          </div>
        )}

        {scanResult && (
          <div className="result-container">
            {scanResult.success && !scanResult.alreadyCheckedIn && (
              <div className="result-card success">
                <div className="result-header">
                  <div className="icon">✅</div>
                  <h2>Check-In Successful!</h2>
                </div>
                
                <div className="participant-details">
                  <div className="detail-row">
                    <span className="label">Participant ID:</span>
                    <span className="value">{scanResult.attendance?.participant?.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Name:</span>
                    <span className="value">{scanResult.attendance?.participant?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{scanResult.attendance?.participant?.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">College:</span>
                    <span className="value">{scanResult.attendance?.participant?.college}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Check-In Time:</span>
                    <span className="value">
                      {new Date(scanResult.attendance?.checkInTime).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button className="continue-button" onClick={handleClearResult}>
                  Scan Next Participant
                </button>
              </div>
            )}

            {scanResult.alreadyCheckedIn && (
              <div className="result-card warning">
                <div className="result-header">
                  <div className="icon">⚠️</div>
                  <h2>Already Checked In</h2>
                </div>
                
                <div className="participant-details">
                  <div className="detail-row">
                    <span className="label">Participant:</span>
                    <span className="value">{scanResult.participant?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Previous Check-In:</span>
                    <span className="value">
                      {new Date(scanResult.attendance?.checkInTime).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="warning-message">
                  This participant has already been checked in for this event.
                </p>

                <button className="continue-button" onClick={handleClearResult}>
                  Scan Next Participant
                </button>
              </div>
            )}

            {!scanResult.success && (
              <div className="result-card error">
                <div className="result-header">
                  <div className="icon">❌</div>
                  <h2>
                    {scanResult.error === 'ACCESS_DENIED' ? 'Access Denied' : 'Check-In Failed'}
                  </h2>
                </div>

                {scanResult.error === 'ACCESS_DENIED' && (
                  <div className="access-denied">
                    <div className="participant-info">
                      <h3>{scanResult.participant?.name}</h3>
                      <p className="participant-id">{scanResult.participant?.id}</p>
                    </div>
                    
                    <div className="denial-reason">
                      <div className="reason-box">
                        <p className="registration-type">
                          Registration: <strong>{scanResult.participant?.registrationType?.toUpperCase()}</strong>
                        </p>
                        <p className="event-type">
                          Event: <strong>{scanResult.event?.category?.toUpperCase()}</strong>
                        </p>
                      </div>
                      <div className="message-box">
                        {scanResult.message}
                      </div>
                    </div>
                  </div>
                )}

                {scanResult.error !== 'ACCESS_DENIED' && (
                  <div className="error-details">
                    <p className="error-message">{scanResult.message}</p>
                    {scanResult.participant && (
                      <div className="participant-info">
                        <p><strong>{scanResult.participant.name}</strong></p>
                        <p>{scanResult.participant.id}</p>
                      </div>
                    )}
                  </div>
                )}

                <button className="continue-button error" onClick={handleClearResult}>
                  Try Another Code
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recent Check-ins */}
        {recentCheckIns.length > 0 && (
          <div className="recent-checkins">
            <h3>Recent Check-Ins ({recentCheckIns.length})</h3>
            <div className="checkins-list">
              {recentCheckIns.map((checkin, index) => (
                <div key={index} className="checkin-item">
                  <div className="checkin-icon">✓</div>
                  <div className="checkin-details">
                    <div className="checkin-name">{checkin.participant?.name}</div>
                    <div className="checkin-id">{checkin.participant?.id}</div>
                  </div>
                  <div className="checkin-time">
                    {new Date(checkin.checkInTime).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCheckIn;

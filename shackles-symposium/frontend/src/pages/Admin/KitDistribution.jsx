/**
 * Kit Distribution Page
 * Scan QR codes to issue registration kits
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../../components/QRScanner/QRScanner';
import axios from 'axios';
import './KitDistribution.css';

const KitDistribution = () => {
  const navigate = useNavigate();
  
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [collectionPoint, setCollectionPoint] = useState('main-desk');
  const [recentIssuances, setRecentIssuances] = useState([]);

  const handleQRScan = async (qrData) => {
    console.log('QR Scanned:', qrData);
    setProcessing(true);
    setScanResult(null);

    try {
      // Decode QR data to get participant ID
      const participantData = JSON.parse(qrData);
      const participantId = participantData.participantId;

      const token = localStorage.getItem('token');
      
      // Issue kit
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/qr-scan/issue-kit`,
        {
          participantId,
          collectionPoint,
          deviceInfo: {
            userAgent: navigator.userAgent,
            ipAddress: 'N/A'
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Kit issuance response:', response.data);

      setScanResult({
        success: true,
        ...response.data
      });

      // Add to recent issuances if new
      if (!response.data.alreadyIssued) {
        setRecentIssuances(prev => [
          {
            ...response.data.kit,
            timestamp: new Date()
          },
          ...prev.slice(0, 9) // Keep last 10
        ]);
      }

      setProcessing(false);

    } catch (error) {
      console.error('Kit issuance error:', error);
      
      const errorMessage = error.response?.data?.message || 'Kit issuance failed';
      const errorData = error.response?.data || {};
      
      setScanResult({
        success: false,
        error: errorData.error || 'KIT_ISSUANCE_ERROR',
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
  };

  const getKitItemIcon = (item) => {
    const icons = {
      'ID Card': '🆔',
      'Workshop ID Card': '🆔',
      'Event Schedule': '📅',
      'Workshop Schedule': '📅',
      'Event Bag': '🎒',
      'Pen': '🖊️',
      'Notepad': '📓',
      'Event Brochure': '📰',
      'Badge': '🏷️',
      'Workshop Material': '📚',
      'Certificate Template': '📜',
      'Workshop Toolkit': '🛠️'
    };
    return icons[item] || '📦';
  };

  return (
    <div className="kit-distribution-page">
      <div className="kit-header">
        <button className="back-button" onClick={() => navigate('/admin')}>
          ← Back
        </button>
        <div className="header-info">
          <h1>📦 Registration Kit Distribution</h1>
          <p>Scan participant QR codes to issue registration kits</p>
        </div>
      </div>

      <div className="kit-content">
        {/* Collection Point Selector */}
        <div className="settings-card">
          <h3>📍 Collection Point</h3>
          <div className="collection-points">
            <label className={collectionPoint === 'main-desk' ? 'active' : ''}>
              <input
                type="radio"
                name="collection-point"
                value="main-desk"
                checked={collectionPoint === 'main-desk'}
                onChange={(e) => setCollectionPoint(e.target.value)}
                disabled={scanning || processing}
              />
              <span>🏢 Main Desk</span>
            </label>
            <label className={collectionPoint === 'workshop-desk' ? 'active' : ''}>
              <input
                type="radio"
                name="collection-point"
                value="workshop-desk"
                checked={collectionPoint === 'workshop-desk'}
                onChange={(e) => setCollectionPoint(e.target.value)}
                disabled={scanning || processing}
              />
              <span>🛠️ Workshop Desk</span>
            </label>
            <label className={collectionPoint === 'event-venue' ? 'active' : ''}>
              <input
                type="radio"
                name="collection-point"
                value="event-venue"
                checked={collectionPoint === 'event-venue'}
                onChange={(e) => setCollectionPoint(e.target.value)}
                disabled={scanning || processing}
              />
              <span>🎪 Event Venue</span>
            </label>
          </div>
        </div>

        {!scanning && !scanResult && (
          <div className="start-container">
            <div className="start-card">
              <div className="icon">📱</div>
              <h3>Ready to Issue Kits</h3>
              <p>Scan participant QR codes to distribute registration kits</p>
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
              <p>Issuing registration kit</p>
            </div>
          </div>
        )}

        {scanResult && (
          <div className="result-container">
            {scanResult.success && !scanResult.alreadyIssued && (
              <div className="result-card success">
                <div className="result-header">
                  <div className="icon">✅</div>
                  <h2>Kit Issued Successfully!</h2>
                </div>
                
                <div className="kit-details">
                  <div className="id-card-section">
                    <h3>🆔 ID Card Number</h3>
                    <div className="id-card-number">{scanResult.kit?.idCardNumber}</div>
                  </div>

                  <div className="participant-section">
                    <h4>Participant Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">ID:</span>
                        <span className="value">{scanResult.kit?.participant?.id}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Name:</span>
                        <span className="value">{scanResult.kit?.participant?.name}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">College:</span>
                        <span className="value">{scanResult.kit?.participant?.college}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Type:</span>
                        <span className="value badge">{scanResult.kit?.participant?.registrationType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="kit-contents-section">
                    <h4>📦 Kit Contents</h4>
                    <div className="contents-grid">
                      {scanResult.kit?.contents?.map((item, index) => (
                        <div key={index} className="kit-item">
                          <span className="item-icon">{getKitItemIcon(item.item)}</span>
                          <span className="item-name">{item.item}</span>
                          <span className="item-quantity">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="issuance-info">
                    <p>
                      <strong>Issued at:</strong> {new Date(scanResult.kit?.issuedAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Collection Point:</strong> {collectionPoint.replace('-', ' ').toUpperCase()}
                    </p>
                  </div>
                </div>

                <button className="continue-button" onClick={handleClearResult}>
                  Issue Next Kit
                </button>
              </div>
            )}

            {scanResult.alreadyIssued && (
              <div className="result-card warning">
                <div className="result-header">
                  <div className="icon">⚠️</div>
                  <h2>Kit Already Issued</h2>
                </div>
                
                <div className="kit-details">
                  <div className="id-card-section warning">
                    <h3>🆔 ID Card Number</h3>
                    <div className="id-card-number">{scanResult.kit?.idCardNumber}</div>
                  </div>

                  <div className="warning-message">
                    <p>This participant has already received their registration kit.</p>
                    <div className="previous-issuance">
                      <p><strong>Previously issued at:</strong></p>
                      <p>{new Date(scanResult.kit?.issuedAt).toLocaleString()}</p>
                      <p><strong>By:</strong> {scanResult.kit?.issuedBy?.name}</p>
                    </div>
                  </div>

                  <div className="kit-contents-section">
                    <h4>📦 Kit Contents (Already Issued)</h4>
                    <div className="contents-grid">
                      {scanResult.kit?.contents?.map((item, index) => (
                        <div key={index} className="kit-item">
                          <span className="item-icon">{getKitItemIcon(item.item)}</span>
                          <span className="item-name">{item.item}</span>
                          <span className="item-quantity">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="continue-button" onClick={handleClearResult}>
                  Scan Next Participant
                </button>
              </div>
            )}

            {!scanResult.success && (
              <div className="result-card error">
                <div className="result-header">
                  <div className="icon">❌</div>
                  <h2>Kit Issuance Failed</h2>
                </div>

                <div className="error-details">
                  <div className="error-message">
                    {scanResult.message}
                  </div>
                  
                  {scanResult.error === 'PAYMENT_NOT_VERIFIED' && (
                    <div className="error-info">
                      <p>⚠️ The participant's payment has not been verified yet.</p>
                      <p>Please direct them to the registration desk for payment verification.</p>
                    </div>
                  )}
                  
                  {scanResult.error === 'USER_NOT_FOUND' && (
                    <div className="error-info">
                      <p>⚠️ Invalid QR code or participant not found.</p>
                      <p>Please verify the QR code is valid and try again.</p>
                    </div>
                  )}
                </div>

                <button className="continue-button error" onClick={handleClearResult}>
                  Try Another Code
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recent Issuances */}
        {recentIssuances.length > 0 && (
          <div className="recent-issuances">
            <h3>Recent Kit Issuances ({recentIssuances.length})</h3>
            <div className="issuances-list">
              {recentIssuances.map((issuance, index) => (
                <div key={index} className="issuance-item">
                  <div className="issuance-icon">📦</div>
                  <div className="issuance-details">
                    <div className="issuance-name">{issuance.participant?.name}</div>
                    <div className="issuance-id">{issuance.participant?.id}</div>
                    <div className="issuance-card">🆔 {issuance.idCardNumber}</div>
                  </div>
                  <div className="issuance-badge">{issuance.participant?.registrationType}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitDistribution;

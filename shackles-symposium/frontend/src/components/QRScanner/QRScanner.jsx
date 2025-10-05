/**
 * QR Scanner Component
 * Uses device camera to scan QR codes
 */

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './QRScanner.css';

const QRScanner = ({ onScan, onError, isActive = true }) => {
  const scannerRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  useEffect(() => {
    // Get available cameras
    Html5QrcodeScanner.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          setCameras(devices);
          // Try to find back camera for mobile
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
        } else {
          setError('No cameras found on this device');
        }
      })
      .catch(err => {
        console.error('Error getting cameras:', err);
        setError('Failed to access camera. Please grant camera permissions.');
      });
  }, []);

  useEffect(() => {
    if (!isActive || !selectedCamera || !scannerRef.current) {
      return;
    }

    // Initialize scanner
    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerRef.current.id,
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250
        },
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: { ideal: 'environment' }, // Prefer back camera
          deviceId: selectedCamera
        }
      },
      false // verbose
    );

    // Success callback
    const onScanSuccess = (decodedText, decodedResult) => {
      console.log('QR Code scanned:', decodedText);
      setIsScanning(false);
      
      // Stop scanning temporarily
      html5QrcodeScanner.pause(true);
      
      // Call parent callback
      if (onScan) {
        onScan(decodedText, decodedResult);
      }
      
      // Resume after 2 seconds
      setTimeout(() => {
        if (html5QrcodeScanner.getState() === 2) { // PAUSED
          html5QrcodeScanner.resume();
          setIsScanning(true);
        }
      }, 2000);
    };

    // Error callback
    const onScanFailure = (error) => {
      // Don't log "No MultiFormat Readers" errors - these are normal
      if (!error.includes('No MultiFormat')) {
        console.warn('QR scan error:', error);
      }
    };

    // Start scanning
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    setScanner(html5QrcodeScanner);
    setIsScanning(true);

    // Cleanup
    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(error => {
          console.error('Error clearing scanner:', error);
        });
      }
    };
  }, [isActive, selectedCamera, onScan]);

  const handleCameraChange = (e) => {
    const newCameraId = e.target.value;
    setSelectedCamera(newCameraId);
    
    // Clear current scanner
    if (scanner) {
      scanner.clear().catch(console.error);
      setScanner(null);
    }
  };

  const handleResume = () => {
    if (scanner && scanner.getState() === 2) { // PAUSED
      scanner.resume();
      setIsScanning(true);
    }
  };

  return (
    <div className="qr-scanner-container">
      {error && (
        <div className="scanner-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {cameras.length > 1 && (
        <div className="camera-selector">
          <label htmlFor="camera-select">📷 Select Camera:</label>
          <select 
            id="camera-select"
            value={selectedCamera || ''}
            onChange={handleCameraChange}
            disabled={isScanning}
          >
            {cameras.map(camera => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Camera ${camera.id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="scanner-wrapper">
        <div 
          id="qr-scanner" 
          ref={scannerRef}
          className={isScanning ? 'scanning' : ''}
        />
      </div>

      {!isScanning && scanner && (
        <button 
          className="resume-button"
          onClick={handleResume}
        >
          Resume Scanning
        </button>
      )}

      <div className="scanner-instructions">
        <p>📱 Point your camera at the QR code</p>
        <p>🎯 Keep the QR code within the frame</p>
        <p>💡 Make sure you have good lighting</p>
      </div>
    </div>
  );
};

export default QRScanner;

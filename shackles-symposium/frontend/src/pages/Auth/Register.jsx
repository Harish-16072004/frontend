import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import '../../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '',
    collegeLocation: '',
    password: '',
    confirmPassword: '',
    // Registration Type
    registrationType: '', // 'general', 'workshop', 'both'
    // Payment
    paymentScreenshot: null,
    transactionId: '',
    // Agreement
    termsAccepted: false
  });

  // Payment QR codes - Replace these URLs with your actual QR code image URLs
  const qrCodes = {
    general: '/qr-general-299.png', // Replace with actual QR for ₹299
    workshop: '/qr-workshop-199.png', // Replace with actual QR for ₹199
    both: '/qr-both-499.png', // Replace with actual QR for ₹499
    dummy: '/qr-dummy.png' // Replace with dummy/placeholder image
  };
  
  // Fallback placeholder (base64 encoded simple image)
  const fallbackQR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlFSIENvZGU8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2FhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGxhY2Vob2xkZXI8L3RleHQ+PC9zdmc+';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleRegistrationTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      registrationType: type
    }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setFormData(prev => ({ ...prev, paymentScreenshot: file }));
      setError('');
    }
  };

  const getAmount = () => {
    switch (formData.registrationType) {
      case 'general':
        return 299;
      case 'workshop':
        return 199;
      case 'both':
        return 499;
      default:
        return 0;
    }
  };

  const getQRCode = () => {
    if (!formData.registrationType) {
      return qrCodes.dummy;
    }
    return qrCodes[formData.registrationType] || qrCodes.dummy;
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.college || !formData.department || 
        !formData.year || !formData.collegeLocation) {
      setError('Please fill in all personal details');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.registrationType) {
      setError('Please select a registration type');
      return false;
    }
    if (!formData.transactionId) {
      setError('Please enter transaction ID');
      return false;
    }
    if (!formData.paymentScreenshot) {
      setError('Please upload payment screenshot');
      return false;
    }
    if (!formData.termsAccepted) {
      setError('Please accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Combine first and last name
      submitData.append('name', `${formData.firstName} ${formData.lastName}`);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('college', formData.college);
      submitData.append('department', formData.department);
      submitData.append('year', formData.year);
      submitData.append('collegeLocation', formData.collegeLocation);
      submitData.append('password', formData.password);
      submitData.append('registrationType', formData.registrationType);
      submitData.append('amount', getAmount());
      submitData.append('transactionId', formData.transactionId);
      submitData.append('termsAccepted', formData.termsAccepted);
      
      if (formData.paymentScreenshot) {
        submitData.append('paymentScreenshot', formData.paymentScreenshot);
      }

      await register(submitData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen after submission
  if (submitted) {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="register-card success-card">
            <div className="success-icon">✓</div>
            <h1 className="success-title">Registration Submitted!</h1>
            <p className="success-message">
              Your response has been submitted successfully. You will be notified through your registered email ID after verification.
            </p>
            <div className="success-details">
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Registration Type:</strong> {formData.registrationType.charAt(0).toUpperCase() + formData.registrationType.slice(1)}</p>
              <p><strong>Amount:</strong> ₹{getAmount()}</p>
            </div>
            <Link to="/login" className="back-home-btn">
              Go to Login →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="symbol-decoration">◈</div>
            <h1 className="register-title">Join SHACKLES 2025</h1>
            <p className="register-subtitle">National Level Technical Symposium</p>
            
            <div className="progress-bar">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Personal Details</div>
              </div>
              <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Payment</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="form-step">
                <h2 className="step-title">■ Personal Details</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="form-input"
                    maxLength="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="college" className="form-label">College Name</label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="Your college/institution name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="collegeLocation" className="form-label">Location of College</label>
                  <input
                    type="text"
                    id="collegeLocation"
                    name="collegeLocation"
                    value={formData.collegeLocation}
                    onChange={handleChange}
                    placeholder="City, State"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="department" className="form-label">Department</label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Mechanical Engineering"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="year" className="form-label">Year of Study</label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Fourth Year</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password (min 6 characters)"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Re-enter Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Section */}
            {step === 2 && (
              <div className="form-step">
                <h2 className="step-title">○ Registration & Payment</h2>
                
                <div className="registration-type-section">
                  <h3 className="section-title">Select Registration Type</h3>
                  <div className="registration-buttons">
                    <button
                      type="button"
                      className={`registration-btn ${formData.registrationType === 'general' ? 'active' : ''}`}
                      onClick={() => handleRegistrationTypeChange('general')}
                    >
                      <span className="btn-icon">■</span>
                      <span className="btn-text">General Registration</span>
                      <span className="btn-price">₹299</span>
                    </button>

                    <button
                      type="button"
                      className={`registration-btn ${formData.registrationType === 'workshop' ? 'active' : ''}`}
                      onClick={() => handleRegistrationTypeChange('workshop')}
                    >
                      <span className="btn-icon">○</span>
                      <span className="btn-text">Workshop Only</span>
                      <span className="btn-price">₹199</span>
                    </button>

                    <button
                      type="button"
                      className={`registration-btn ${formData.registrationType === 'both' ? 'active' : ''}`}
                      onClick={() => handleRegistrationTypeChange('both')}
                    >
                      <span className="btn-icon">◈</span>
                      <span className="btn-text">Both (General + Workshop)</span>
                      <span className="btn-price">₹499</span>
                    </button>
                  </div>

                  {formData.registrationType && (
                    <div className="amount-display">
                      <span className="amount-label">Total Amount:</span>
                      <span className="amount-value">₹{getAmount()}</span>
                    </div>
                  )}
                </div>

                <div className="qr-section">
                  <h3 className="section-title">Payment QR Code</h3>
                  <div className="qr-container">
                    <img 
                      src={getQRCode()} 
                      alt="Payment QR Code" 
                      className="qr-image"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = fallbackQR;
                      }}
                    />
                    {!formData.registrationType && (
                      <p className="qr-hint">Select a registration type to view QR code</p>
                    )}
                    {formData.registrationType && (
                      <p className="qr-info">Scan this QR code to pay ₹{getAmount()}</p>
                    )}
                  </div>
                </div>

                <div className="payment-details-section">
                  <h3 className="section-title">Payment Details</h3>
                  
                  <div className="form-group">
                    <label htmlFor="transactionId" className="form-label">Transaction ID / Reference Number</label>
                    <input
                      type="text"
                      id="transactionId"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="Enter transaction/reference ID"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="paymentScreenshot" className="form-label">Upload Payment Screenshot</label>
                    <input
                      type="file"
                      id="paymentScreenshot"
                      name="paymentScreenshot"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="file-input"
                      required
                    />
                    {formData.paymentScreenshot && (
                      <div className="file-preview">
                        ✓ {formData.paymentScreenshot.name}
                      </div>
                    )}
                    <p className="input-hint">Max size: 5MB | Formats: JPG, PNG, JPEG</p>
                  </div>
                </div>

                <div className="terms-section">
                  <label className="terms-checkbox">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      required
                    />
                    <span className="checkbox-text">
                      I agree to the <Link to="/terms" target="_blank">terms and conditions</Link> and confirm that all information provided is accurate
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-actions">
              {step > 1 && (
                <button type="button" onClick={handleBack} className="back-btn">
                  ← Back
                </button>
              )}
              
              {step < 2 ? (
                <button type="button" onClick={handleNext} className="next-btn">
                  Continue to Payment →
                </button>
              ) : (
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader inline={true} size="small" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Registration</span>
                      <span className="btn-symbol">◈</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="register-footer">
            <p className="footer-text">
              Already have an account?{' '}
              <Link to="/login" className="login-link">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Personal Details
    name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '',
    // Event Selection
    events: [],
    workshops: [],
    needsAccommodation: false,
    // Payment
    paymentScreenshot: null,
    transactionId: '',
    // Agreement
    termsAccepted: false
  });

  const events = [
    { id: 'paper-presentation', name: 'Paper Presentation', fee: 299, category: 'technical' },
    { id: 'project-expo', name: 'Project Expo', fee: 299, category: 'technical' },
    { id: 'cad-modelling', name: 'CAD Modelling', fee: 299, category: 'technical' },
    { id: 'connection', name: 'Connection', fee: 299, category: 'technical' },
    { id: 'treasure-hunt', name: 'Treasure Hunt', fee: 299, category: 'technical' },
    { id: 'reverse-engineering', name: 'Reverse Engineering', fee: 299, category: 'technical' },
    { id: 'ipl-auction', name: 'IPL Auction', fee: 299, category: 'non-technical' },
    { id: 'kollywood-quiz', name: 'Kollywood Quiz', fee: 299, category: 'non-technical' },
    { id: 'red-light-green-light', name: 'Red Light Green Light', fee: 299, category: 'non-technical' },
    { id: 'idea-pitching', name: 'Idea Pitching', fee: 299, category: 'special' },
    { id: 'robo-soccer', name: 'Robo Soccer', fee: 299, category: 'special' }
  ];

  const workshops = [
    { id: 'additive-manufacturing', name: 'Additive Manufacturing (3D Printing)', fee: 199, time: '10:00 AM - 1:00 PM' },
    { id: 'iot', name: 'IoT & Smart Systems', fee: 199, time: '2:00 PM - 5:00 PM' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleEventSelection = (eventId) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(id => id !== eventId)
        : [...prev.events, eventId]
    }));
    setError('');
  };

  const handleWorkshopSelection = (workshopId) => {
    setFormData(prev => ({
      ...prev,
      workshops: prev.workshops.includes(workshopId)
        ? prev.workshops.filter(id => id !== workshopId)
        : [...prev.workshops, workshopId]
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

  const calculateTotal = () => {
    const eventsFee = formData.events.length * 299;
    const workshopsFee = formData.workshops.length * 199;
    const accommodationFee = formData.needsAccommodation ? 300 : 0;
    return eventsFee + workshopsFee + accommodationFee;
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.college || !formData.department || !formData.year) {
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
    return true;
  };

  const validateStep2 = () => {
    if (formData.events.length === 0 && formData.workshops.length === 0) {
      setError('Please select at least one event or workshop');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.paymentScreenshot) {
      setError('Please upload payment screenshot');
      return false;
    }
    if (!formData.transactionId) {
      setError('Please enter transaction ID');
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
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'events' || key === 'workshops') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'paymentScreenshot' && formData[key]) {
          submitData.append(key, formData[key]);
        } else {
          submitData.append(key, formData[key]);
        }
      });

      await register(submitData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                <div className="step-label">Personal</div>
              </div>
              <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Events</div>
              </div>
              <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
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
                
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>

                <div className="form-row">
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
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="form-input"
                      maxLength="10"
                    />
                  </div>
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
                    >
                      <option value="">Select Year</option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Fourth Year</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Event Selection */}
            {step === 2 && (
              <div className="form-step">
                <h2 className="step-title">○ Select Events & Workshops</h2>
                
                <div className="selection-section">
                  <h3 className="section-title">■ Technical Events (₹299 each)</h3>
                  <div className="selection-grid">
                    {events.filter(e => e.category === 'technical').map(event => (
                      <label key={event.id} className="selection-card">
                        <input
                          type="checkbox"
                          checked={formData.events.includes(event.id)}
                          onChange={() => handleEventSelection(event.id)}
                        />
                        <span className="card-content">
                          <span className="card-name">{event.name}</span>
                          <span className="card-fee">₹{event.fee}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="selection-section">
                  <h3 className="section-title">○ Non-Technical Events (₹299 each)</h3>
                  <div className="selection-grid">
                    {events.filter(e => e.category === 'non-technical').map(event => (
                      <label key={event.id} className="selection-card">
                        <input
                          type="checkbox"
                          checked={formData.events.includes(event.id)}
                          onChange={() => handleEventSelection(event.id)}
                        />
                        <span className="card-content">
                          <span className="card-name">{event.name}</span>
                          <span className="card-fee">₹{event.fee}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="selection-section">
                  <h3 className="section-title">△ Special Events (₹299 each)</h3>
                  <div className="selection-grid">
                    {events.filter(e => e.category === 'special').map(event => (
                      <label key={event.id} className="selection-card">
                        <input
                          type="checkbox"
                          checked={formData.events.includes(event.id)}
                          onChange={() => handleEventSelection(event.id)}
                        />
                        <span className="card-content">
                          <span className="card-name">{event.name}</span>
                          <span className="card-fee">₹{event.fee}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="selection-section">
                  <h3 className="section-title">◈ Workshops (₹199 each)</h3>
                  <div className="selection-grid">
                    {workshops.map(workshop => (
                      <label key={workshop.id} className="selection-card">
                        <input
                          type="checkbox"
                          checked={formData.workshops.includes(workshop.id)}
                          onChange={() => handleWorkshopSelection(workshop.id)}
                        />
                        <span className="card-content">
                          <span className="card-name">{workshop.name}</span>
                          <span className="card-time">{workshop.time}</span>
                          <span className="card-fee">₹{workshop.fee}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="selection-section">
                  <label className="accommodation-checkbox">
                    <input
                      type="checkbox"
                      name="needsAccommodation"
                      checked={formData.needsAccommodation}
                      onChange={handleChange}
                    />
                    <span className="checkbox-text">
                      I need accommodation (₹300 for 2 nights: Oct 22-24, 2025)
                    </span>
                  </label>
                </div>

                <div className="total-section">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-amount">₹{calculateTotal()}</span>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="form-step">
                <h2 className="step-title">△ Payment Details</h2>
                
                <div className="payment-info">
                  <h3 className="info-title">Payment Instructions</h3>
                  <div className="info-content">
                    <p><strong>Total Amount to Pay: ₹{calculateTotal()}</strong></p>
                    <p>Payment Methods:</p>
                    <ul>
                      <li><strong>UPI:</strong> shackles2025@acgcet</li>
                      <li><strong>Account No:</strong> 1234567890</li>
                      <li><strong>IFSC Code:</strong> SBIN0012345</li>
                      <li><strong>Account Name:</strong> SHACKLES 2025</li>
                    </ul>
                    <p className="warning-text">⚠ Please complete payment before uploading screenshot</p>
                  </div>
                </div>

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
                  />
                  {formData.paymentScreenshot && (
                    <div className="file-preview">
                      ✓ {formData.paymentScreenshot.name}
                    </div>
                  )}
                  <p className="input-hint">Max size: 5MB | Formats: JPG, PNG, JPEG</p>
                </div>

                <div className="terms-section">
                  <label className="terms-checkbox">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
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
              
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="next-btn">
                  Continue →
                </button>
              ) : (
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader inline={true} size="small" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
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

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Check if token exists
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.put(`/auth/reset-password/${token}`, {
        password: formData.password
      });

      if (data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to reset password. The link may have expired or is invalid.'
      );
      if (err.response?.status === 400) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="error-content">
              <div className="error-icon">✗</div>
              <h2 className="error-title">Invalid or Expired Link</h2>
              <p className="error-message">
                This password reset link is invalid or has expired.
                Reset links are only valid for 10 minutes.
              </p>
              <Link to="/forgot-password" className="action-btn">
                Request New Link
              </Link>
              <Link to="/login" className="back-link">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          {!success ? (
            <>
              <div className="reset-password-header">
                <div className="symbol-decoration">🔒</div>
                <h1 className="reset-password-title">Reset Password</h1>
                <p className="reset-password-subtitle">
                  Enter your new password below
                </p>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="reset-password-form">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password (min. 6 characters)"
                    className="form-input"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="form-input"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>

                <div className="password-requirements">
                  <p className="requirements-title">Password Requirements:</p>
                  <ul className="requirements-list">
                    <li className={formData.password.length >= 6 ? 'valid' : ''}>
                      At least 6 characters
                    </li>
                    <li className={formData.password === formData.confirmPassword && formData.password ? 'valid' : ''}>
                      Passwords match
                    </li>
                  </ul>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>

              <div className="reset-password-footer">
                <Link to="/login" className="back-link">
                  ← Back to Login
                </Link>
              </div>
            </>
          ) : (
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h2 className="success-title">Password Reset Successful!</h2>
              <p className="success-message">
                Your password has been successfully reset.
              </p>
              <p className="success-note">
                You will be redirected to the login page in 3 seconds...
              </p>
              <Link to="/login" className="action-btn">
                Go to Login Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

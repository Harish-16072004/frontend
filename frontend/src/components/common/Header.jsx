import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-text">SHACKLES 25-26</span>
        </Link>

        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/events" onClick={closeMenu}>Events</Link>
          <Link to="/workshops" onClick={closeMenu}>Workshops</Link>
          <Link to="/accommodation" onClick={closeMenu}>Accommodation</Link>
          <Link to="/team" onClick={closeMenu}>Team</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>

          {isAuthenticated ? (
            <>
              <Link to="/maintenance" onClick={closeMenu} className="profile-link maintenance-link">
                <span className="user-name">Account (Maintenance)</span>
              </Link>
              {(user?.role === 'admin' || user?.role === 'organizer') && (
                <Link to="/maintenance" onClick={closeMenu} className="admin-link maintenance-link">
                  Admin (Under Development)
                </Link>
              )}
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/maintenance" onClick={closeMenu} className="btn-login maintenance-btn">
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

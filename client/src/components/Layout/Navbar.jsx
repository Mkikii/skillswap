import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css'; // Optional: for additional styling

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Helper to check if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          🎯 SkillSwap
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          {user ? (
            // Logged-in User Menu
            <div className="user-menu">
              <span className="welcome-message">Welcome, {user.username}!</span>
              
              <Link 
                to="/listings" 
                className={`nav-link ${isActiveLink('/listings') ? 'active' : ''}`}
              >
                Browse Skills
              </Link>
              
              <Link 
                to="/create-listing" 
                className={`nav-link ${isActiveLink('/create-listing') ? 'active' : ''}`}
              >
                Create Listing
              </Link>
              
              <Link 
                to="/sessions" 
                className={`nav-link ${isActiveLink('/sessions') ? 'active' : ''}`}
              >
                My Sessions
              </Link>
              
              <button 
                onClick={logout} 
                className="btn btn-logout"
              >
                Logout
              </button>
            </div>
          ) : (
            // Guest Menu
            <div className="guest-menu">
              <Link 
                to="/listings" 
                className={`nav-link ${isActiveLink('/listings') ? 'active' : ''}`}
              >
                Browse Skills
              </Link>
              
              <Link 
                to="/login" 
                className={`nav-link ${isActiveLink('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
              
              <Link 
                to="/register" 
                className="btn btn-primary"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
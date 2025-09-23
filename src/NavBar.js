import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogoutClick() {
    fetch('/logout', {
      method: 'DELETE',
    }).then(() => {
      onLogout();
      navigate('/');
    });
  }

  return (
    <nav className="navbar">
      <Link to="/" className="site-title">SkillSwap</Link>
      <div className="nav-links">
        <Link to="/browse">Browse Skills</Link>
        {user ? (
          <>
            <Link to="/create-listing">Create Listing</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogoutClick} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
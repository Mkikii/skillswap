import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-purple-600 font-cursive">SkillSwap</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/listings" className="text-white hover:text-gray-300 transition-colors">
              Browse Listings
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">Welcome, {user.username}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-brown-700 hover:bg-brown-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-brown-700 hover:bg-brown-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
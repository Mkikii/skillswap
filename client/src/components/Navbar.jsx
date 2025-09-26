import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i className='bx bx-transfer-alt text-white text-xl'></i>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
              SkillSwap
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/listings" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center space-x-1"
            >
              <i className='bx bx-search-alt-2'></i>
              <span>Browse Skills</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">Hi, {user.username}!</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium flex items-center space-x-1"
                >
                  <i className='bx bx-log-out'></i>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center space-x-1"
                >
                  <i className='bx bx-log-in'></i>
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm px-4 py-2"
                >
                  <i className='bx bx-user-plus mr-1'></i>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
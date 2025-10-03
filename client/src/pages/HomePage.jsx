import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://skillswap-production-0e78.up.railway.app'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'maureen@example.com',
          password: 'password123'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        login(data.user, data.access_token);
        alert('Demo login successful! Welcome to SkillSwap!');
        navigate('/listings');
      } else {
        alert('Demo login failed: ' + data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Demo login failed. Please check your connection and try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                SKILLSWAP
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={handleDemoLogin}
                    className="bg-black hover:bg-gray-900 text-white border border-purple-600 px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Try Demo
                  </button>
                  <Link
                    to="/auth"
                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-white">Welcome, <span className="font-semibold text-purple-600">{user.username}</span></span>
                  <Link
                    to="/listings"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Create Listing
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Share Skills,
            <span className="block bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Learn Together
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with expert teachers in your community and discover new skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/listings"
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-4 rounded-lg font-semibold transition-all flex items-center"
            >
              Explore Skills
            </Link>
            {!user && (
              <Link
                to="/auth"
                className="bg-black hover:bg-gray-900 text-white border border-purple-600 text-lg px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Start Teaching
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-600 transition-all">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-white mb-3">Learn Any Skill</h3>
              <p className="text-gray-300 leading-relaxed">From programming to cooking, find expert teachers in any field.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-600 transition-all">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-3">Share Your Expertise</h3>
              <p className="text-gray-300 leading-relaxed">Earn by teaching skills you are passionate about.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-600 transition-all">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-white mb-3">Community Driven</h3>
              <p className="text-gray-300 leading-relaxed">Connect with like-minded learners and teachers.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-300 font-medium">Skills Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-300 font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">4.8/5</div>
              <div className="text-gray-300 font-medium">Average Rating</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center max-w-4xl mx-auto">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join our community of learners and teachers today. Share your skills or learn something new!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/listings"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                Browse Listings
              </Link>
              {!user && (
                <Link
                  to="/auth"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
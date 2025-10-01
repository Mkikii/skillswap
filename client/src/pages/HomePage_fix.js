import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCode, FaUsers, FaStar, FaArrowRight, FaRocket, FaGraduationCap } from 'react-icons/fa';

function HomePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5555'}/api/auth/login`, {
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
        localStorage.setItem('token', data.access_token);
        login(data.user);
        navigate('/listings');
      } else {
        alert('Demo login failed. Please try again.');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      alert('Network error. Please try again.');
    }
  };

  const features = [
    {
      icon: <FaCode className="text-3xl text-pink-700" />,
      title: 'Learn Any Skill',
      description: 'From programming to cooking, find expert teachers in any field.'
    },
    {
      icon: <FaUsers className="text-3xl text-pink-700" />,
      title: 'Share Your Expertise',
      description: 'Earn by teaching skills you\'re passionate about.'
    },
    {
      icon: <FaStar className="text-3xl text-pink-700" />,
      title: 'Community Driven',
      description: 'Connect with like-minded learners and teachers.'
    }
  ];

  const stats = [
    { number: '50+', label: 'Skills Available' },
    { number: '100+', label: 'Active Users' },
    { number: '4.8/5', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-700 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent">
                SKILLSWAP
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={handleDemoLogin}
                    className="bg-black hover:bg-gray-900 text-white border border-pink-700 px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Try Demo
                  </button>
                  <Link
                    to="/auth"
                    className="border-2 border-pink-700 text-pink-700 hover:bg-pink-700 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-white">Welcome, <span className="font-semibold text-pink-700">{user.username}</span>!</span>
                  <Link
                    to="/listings"
                    className="bg-pink-700 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Create Listing
                  </Link>
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
            <span className="block bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent">
              Learn Together
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with expert teachers in your community and discover new skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/listings"
              className="bg-pink-700 hover:bg-pink-600 text-white text-lg px-8 py-4 rounded-lg font-semibold transition-all flex items-center"
            >
              Explore Skills <FaArrowRight className="ml-2 inline" />
            </Link>
            {!user && (
              <Link
                to="/auth"
                className="bg-black hover:bg-gray-900 text-white border border-pink-700 text-lg px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Start Teaching
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="bg-black border border-gray-800 rounded-2xl p-8 text-center hover:border-pink-700 transition-all">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-pink-700 mb-2">{stat.number}</div>
                <div className="text-white font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-black border border-gray-800 rounded-2xl p-12 text-center max-w-4xl mx-auto">
            <FaRocket className="text-5xl text-pink-700 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Join our community of learners and teachers today. Share your skills or learn something new!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/listings"
                className="bg-pink-700 hover:bg-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                Browse Listings
              </Link>
              {!user && (
                <Link
                  to="/auth"
                  className="border-2 border-pink-700 text-pink-700 hover:bg-pink-700 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
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
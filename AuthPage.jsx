import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaCheckCircle, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: ''
  });

  // Demo accounts for testing
  const demoAccounts = [
    {
      role: '👨‍🏫 Teacher',
      email: 'seoyeji@example.com',
      password: 'password123',
      description: 'Expert Python & Web Development teacher'
    },
    {
      role: '👩‍🎓 Student',
      email: 'maureen@example.com', 
      password: 'password123',
      description: 'Student learning web development'
    },
    {
      role: '👨‍🍳 Cooking Expert',
      email: 'jimin@example.com',
      password: 'password123',
      description: 'Professional chef and cooking instructor'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          login(data.user, data.access_token);
          alert(`🎉 Welcome back, ${data.user.username}!`);
          navigate('/');
        } else {
          alert('✅ Registration successful! Please login with your credentials.');
          setIsLogin(true);
          setFormData({ username: '', email: '', password: '', bio: '' });
        }
      } else {
        alert('❌ ' + (data.error || 'Authentication failed'));
      }
    } catch (error) {
      alert('❌ Authentication failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        login(data.user, data.access_token);
        alert(`🎉 Demo login successful! Welcome ${data.user.username}!`);
        navigate('/');
      } else {
        alert('❌ Demo login failed: ' + data.error);
      }
    } catch (error) {
      alert('❌ Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cream-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Demo Accounts */}
        <div className="space-y-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-8">
              <FaArrowLeft />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <div className="text-center lg:text-left">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <span className="text-white font-bold text-3xl">S</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">SkillSwap</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {isLogin ? 'Sign in to continue your learning journey' : 'Join our community of learners and teachers'}
              </p>
            </div>
          </div>

          {/* Demo Accounts Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center lg:text-left">
              🚀 Try Demo Accounts
            </h2>
            <p className="text-gray-600 text-center lg:text-left">
              Test the platform with these pre-configured accounts:
            </p>
            
            <div className="space-y-4">
              {demoAccounts.map((account, index) => (
                <div 
                  key={index}
                  className="card hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-primary-200"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {account.role.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {account.role}
                      </h3>
                      <p className="text-sm text-gray-600">{account.description}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        <strong>Email:</strong> {account.email} • <strong>Password:</strong> password123
                      </div>
                    </div>
                    <button 
                      className="btn-primary text-sm px-4 py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemoLogin(account.email, account.password);
                      }}
                      disabled={loading}
                    >
                      {loading ? '...' : 'Login'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <FaGraduationCap className="text-primary-600 text-xl" />
                <div>
                  <div className="font-semibold text-gray-900">Learn Skills</div>
                  <div className="text-sm text-gray-600">From expert teachers</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <FaChalkboardTeacher className="text-primary-600 text-xl" />
                <div>
                  <div className="font-semibold text-gray-900">Teach Others</div>
                  <div className="text-sm text-gray-600">Share your expertise</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="card border-2 border-primary-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Join SkillSwap'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  rows="3"
                  placeholder="Tell us about yourself and your skills..."
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Switch between Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Why Join SkillSwap?
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Connect with verified expert teachers</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Share your skills and earn money</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Fair and transparent pricing</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Rate and review your experiences</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

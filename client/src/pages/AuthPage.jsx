
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://skillswap-production-0e78.up.railway.app'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        login(data.user);
        navigate('/');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fillDemoAccount = (type) => {
    if (type === 'student') {
      setFormData({
        ...formData,
        email: 'maureen@example.com',
        password: 'password123'
      });
    } else if (type === 'teacher') {
      setFormData({
        ...formData,
        email: 'kikii@example.com',
        password: 'password123'
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-purple-600">
            {isLogin ? 'Sign in to SkillSwap' : 'Join SkillSwap'}
          </h2>
          <p className="mt-2 text-center text-lg text-gray-300">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {isLogin && (
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p className="text-white text-center mb-3 font-medium">Try demo accounts:</p>
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('student')}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors"
              >
                Student Demo: maureen@example.com
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('teacher')}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors"
              >
                Teacher Demo: kikii@example.com
              </button>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required={!isLogin}
                  className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Create account')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-purple-400 hover:text-purple-300 font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
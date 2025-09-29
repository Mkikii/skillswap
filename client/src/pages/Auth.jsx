import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => setIsSignUp(!isSignUp);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await register(formData.username, formData.email, formData.password);
      } else {
        await login({ email: formData.email, password: formData.password });
      }
      navigate('/listings');
    } catch (err) {
      setError('Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = (email, password) => {
    setFormData({
      ...formData,
      email,
      password
    });
    setIsSignUp(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-500">
      <div className="w-full max-w-2xl bg-white bg-opacity-90 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 to-blue-600 p-10 w-1/2">
          <h3 className="text-2xl font-bold text-white mb-2">New to SkillSwap?</h3>
          <p className="text-white mb-6 text-center">Sign up and join our expert community!</p>
          <button
            className="btn-secondary px-6 py-2 rounded-full bg-white text-purple-700 font-bold shadow hover:bg-purple-100 transition"
            onClick={handleToggle}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
        <div className="flex-1 p-8">
          {isSignUp ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-700">Create Account</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="username"
                  placeholder="e.g. kiki, maureen, molly, carl, vanessa, dominique"
                  className="mb-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="mb-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="mb-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button type="submit" className="btn-primary w-full mb-2" disabled={loading}>
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
              </form>
              <div className="text-center mt-4">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={handleToggle}
                  disabled={loading}
                >
                  Already have an account? Sign In
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Welcome Back</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="mb-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="mb-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button type="submit" className="btn-primary w-full mb-2" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
              </form>
              <button className="btn-secondary w-full mb-2" onClick={() => useDemoAccount('teacher@demo.com', 'demo123')}>
                Use Teacher Demo
              </button>
              <button className="btn-secondary w-full" onClick={() => useDemoAccount('student@demo.com', 'demo123')}>
                Use Student Demo
              </button>
              <div className="text-center mt-4">
                <button
                  className="text-purple-700 hover:underline"
                  onClick={handleToggle}
                  disabled={loading}
                >
                  New to SkillSwap? Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { demoAccount } from '../data/skills-data';

const loginValidationSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

const signupValidationSchema = yup.object({
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  bio: yup.string().max(500, 'Bio must be less than 500 characters')
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Auto-fill demo credentials when component mounts
  useEffect(() => {
    if (isLogin) {
      loginFormik.setValues({
        email: demoAccount.email,
        password: demoAccount.password
      });
    }
  }, [isLogin]);

  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        await login(values.email, values.password);
        navigate('/listings');
      } catch (error) {
        setError(error.response?.data?.error || 'Login failed');
      }
      setLoading(false);
    }
  });

  const signupFormik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      bio: ''
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        await register(values);
        navigate('/listings');
      } catch (error) {
        setError(error.response?.data?.error || 'Registration failed');
      }
      setLoading(false);
    }
  });

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(demoAccount.email, demoAccount.password);
      navigate('/listings');
    } catch (error) {
      setError(error.response?.data?.error || 'Demo login failed');
    }
    setLoading(false);
  };

  const currentFormik = isLogin ? loginFormik : signupFormik;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Branding */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-8 md:p-12 flex flex-col justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                {isLogin ? 'New to SkillSwap?' : 'Welcome Back!'}
              </h2>
              <p className="text-blue-100 mb-8">
                {isLogin 
                  ? 'Join our community of learners and teachers' 
                  : 'Sign in to access your account and continue learning'
                }
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-blue-600 transition-all font-semibold"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                {isLogin ? 'Welcome Back' : 'Join SkillSwap'}
              </h2>
              <p className="text-gray-600 text-center mb-6">
                {isLogin ? 'Sign in to your account' : 'Create your account today'}
              </p>

              {/* Demo Account Banner */}
              {isLogin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Account (Auto-filled)</h3>
                  <p className="text-xs text-blue-600">
                    Email: <strong>{demoAccount.email}</strong><br/>
                    Password: <strong>{demoAccount.password}</strong>
                  </p>
                  <button
                    onClick={handleDemoLogin}
                    disabled={loading}
                    className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    {loading ? 'Signing In...' : 'Quick Login with Demo'}
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={currentFormik.handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={signupFormik.values.username}
                        onChange={signupFormik.handleChange}
                        onBlur={signupFormik.handleBlur}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                      {signupFormik.touched.username && signupFormik.errors.username && (
                        <div className="text-red-500 text-sm mt-1">{signupFormik.errors.username}</div>
                      )}
                    </div>
                    <div>
                      <textarea
                        name="bio"
                        placeholder="Tell us about yourself (optional)"
                        value={signupFormik.values.bio}
                        onChange={signupFormik.handleChange}
                        onBlur={signupFormik.handleBlur}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                        disabled={loading}
                      />
                      {signupFormik.touched.bio && signupFormik.errors.bio && (
                        <div className="text-red-500 text-sm mt-1">{signupFormik.errors.bio}</div>
                      )}
                    </div>
                  </>
                )}
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={currentFormik.values.email}
                    onChange={currentFormik.handleChange}
                    onBlur={currentFormik.handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  {currentFormik.touched.email && currentFormik.errors.email && (
                    <div className="text-red-500 text-sm mt-1">{currentFormik.errors.email}</div>
                  )}
                </div>
                
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={currentFormik.values.password}
                    onChange={currentFormik.handleChange}
                    onBlur={currentFormik.handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  {currentFormik.touched.password && currentFormik.errors.password && (
                    <div className="text-red-500 text-sm mt-1">{currentFormik.errors.password}</div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
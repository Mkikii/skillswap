import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as yup from 'yup';

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

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

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
        setError(error.response?.data?.message || 'Login failed');
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
        setError(error.response?.data?.message || 'Registration failed');
      }
      setLoading(false);
    }
  });

  const handleDemoLogin = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/listings');
    } catch (error) {
      setError(error.response?.data?.message || 'Demo login failed');
    }
    setLoading(false);
  };

  const currentFormik = isLogin ? loginFormik : signupFormik;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
        <div className="flex">
          <div className={`w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex flex-col justify-center transition-all duration-500 ${isLogin ? 'order-1' : 'order-2'}`}>
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                {isLogin ? 'New to SkillSwap?' : 'Already have an account?'}
              </h2>
              <p className="text-blue-100 mb-8">
                {isLogin ? 'Join our community of learners and teachers' : 'Sign in to access your account'}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-blue-600 transition-all"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>

          <div className={`w-1/2 p-12 transition-all duration-500 ${isLogin ? 'order-2' : 'order-1'}`}>
            <div className="max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                {isLogin ? 'Welcome Back' : 'Join SkillSwap'}
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
                      />
                      {signupFormik.touched.username && signupFormik.errors.username && (
                        <div className="text-red-500 text-sm mt-1">{signupFormik.errors.username}</div>
                      )}
                    </div>
                    <div>
                      <textarea
                        name="bio"
                        placeholder="Tell us about yourself"
                        value={signupFormik.values.bio}
                        onChange={signupFormik.handleChange}
                        onBlur={signupFormik.handleBlur}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
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
                    placeholder="Email"
                    value={currentFormik.values.email}
                    onChange={currentFormik.handleChange}
                    onBlur={currentFormik.handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </button>
              </form>

              {isLogin && (
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => handleDemoLogin('teacher@demo.com', 'demo123')}
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Use Teacher Demo
                  </button>
                  <button
                    onClick={() => handleDemoLogin('student@demo.com', 'demo123')}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Use Student Demo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
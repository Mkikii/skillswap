import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      bio: ''
    },
    validationSchema: isLogin 
      ? Yup.object({
          email: Yup.string().email('Invalid email address').required('Required'),
          password: Yup.string().required('Required')
        })
      : Yup.object({
          username: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email address').required('Required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required')
        }),
    onSubmit: async (values) => {
      setError('');
      try {
        if (isLogin) {
          await login(values.email, values.password);
        } else {
          await register(values.username, values.email, values.password, values.bio);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Authentication failed');
      }
    }
  });

  const useDemoAccount = (email, password) => {
    formik.setFieldValue('email', email);
    formik.setFieldValue('password', password);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-600 font-cursive">SkillSwap</h2>
          <p className="mt-2 text-2xl font-bold text-dark-purple">
            {isLogin ? 'Sign in to SkillSwap' : 'Join SkillSwap'}
          </p>
          <p className="mt-2 text-gray-300">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Demo Account Buttons */}
        {isLogin && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 text-center">Try demo accounts:</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => useDemoAccount('maureen@example.com', 'password123')}
                className="w-full bg-brown-700 hover:bg-brown-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Student Demo: maureen@example.com
              </button>
              <button
                type="button"
                onClick={() => useDemoAccount('seoyeji@example.com', 'password123')}
                className="w-full bg-brown-700 hover:bg-brown-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Teacher Demo: seoyeji@example.com
              </button>
            </div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white"
                placeholder="Choose a username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-400 text-sm mt-1">{formik.errors.username}</div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-400 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white"
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-400 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                Bio (Optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white"
                placeholder="Tell us about yourself..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bio}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-brown-700 hover:bg-brown-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            {isLogin ? 'Sign in' : 'Create account'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-brown-700 hover:text-brown-600 font-medium"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
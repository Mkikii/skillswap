import React, { useState, useEffect } from 'react';
import { skills, demoAccounts } from './data/data';
import Homepage from './components/Homepage';
import AuthPage from './components/AuthPage';
import SkillsListings from './components/SkillsListings';

const SkillSwap = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isSliding, setIsSliding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState(() => {
    const savedUsers = JSON.parse(localStorage?.getItem('skillswap_users') || '[]');
    return [...Object.values(demoAccounts), ...savedUsers];
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage?.getItem('skillswap_current_user') || 'null');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const saveToStorage = (key, data) => {
    try {
      const storage = {};
      storage[key] = JSON.stringify(data);
      return true;
    } catch (error) {
      console.warn('Storage not available, using memory only');
      return false;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleRegister = () => {
    setError('');
    setIsLoading(true);

    if (!formData.name.trim()) {
      setError('Name is required');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    const existingUser = users.find(u => u.email === formData.email);
    if (existingUser) {
      setError('Email already exists. Please login instead.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: 'student'
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      saveToStorage('skillswap_users', updatedUsers.filter(u => !Object.values(demoAccounts).includes(u)));
      saveToStorage('skillswap_current_user', newUser);

      setUser(newUser);
      setSuccess('Account created successfully!');
      setIsLoading(false);

      setTimeout(() => {
        setCurrentPage('listings');
        setFormData({ email: '', password: '', name: '' });
        setSuccess('');
      }, 1500);
    }, 1000);
  };

  const handleLogin = () => {
    setError('');
    setIsLoading(true);

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const foundUser = users.find(u =>
        u.email.toLowerCase() === formData.email.toLowerCase() &&
        u.password === formData.password
      );

      if (foundUser) {
        saveToStorage('skillswap_current_user', foundUser);
        setUser(foundUser);
        setSuccess('Login successful!');
        setIsLoading(false);

        setTimeout(() => {
          setCurrentPage('listings');
          setFormData({ email: '', password: '', name: '' });
          setSuccess('');
        }, 1500);
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null);
    saveToStorage('skillswap_current_user', null);
    setCurrentPage('home');
    setFormData({ email: '', password: '', name: '' });
    setError('');
    setSuccess('');
  };

  const handleDemoLogin = (type) => {
    const account = demoAccounts[type];
    setFormData(account);
    setIsLoading(true);
    setTimeout(() => {
      setUser(account);
      saveToStorage('skillswap_current_user', account);
      setSuccess('Demo login successful!');
      setIsLoading(false);
      setTimeout(() => {
        setCurrentPage('listings');
        setFormData({ email: '', password: '', name: '' });
        setSuccess('');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="font-sans">
      {currentPage === 'home' && <Homepage setCurrentPage={setCurrentPage} setAuthMode={setAuthMode} />}
      {currentPage === 'auth' && <AuthPage
        authMode={authMode}
        setAuthMode={setAuthMode}
        isSliding={isSliding}
        setIsSliding={setIsSliding}
        formData={formData}
        setFormData={setFormData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isLoading={isLoading}
        error={error}
        setError={setError}
        success={success}
        setSuccess={setSuccess}
        handleRegister={handleRegister}
        handleLogin={handleLogin}
        handleDemoLogin={handleDemoLogin}
      />}
      {currentPage === 'listings' && <SkillsListings skills={skills} user={user} setCurrentPage={setCurrentPage} setAuthMode={setAuthMode} />}
    </div>
  );
};

export default SkillSwap;

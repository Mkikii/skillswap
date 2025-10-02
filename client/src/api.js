import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SkillsListings from './pages/SkillsListings';
import UserProfile from './pages/UserProfile';
import BookingPage from './pages/BookingPage';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/listings" element={<SkillsListings />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/book/:listingId" element={<BookingPage />} />
            <Route path="/review/:teacherId" element={<ReviewPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
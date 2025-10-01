import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import SkillsListings from './pages/SkillsListings'
import UserProfile from './pages/UserProfile'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="font-sans">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/listings" element={<SkillsListings />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
// Force redeploy Wed 01 Oct 2025 05:23:54 PM EAT

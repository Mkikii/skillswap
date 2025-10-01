import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import SkillsListings from './pages/SkillsListings'

function App() {
  return (
    <AuthProvider>
      <div className="font-sans">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/listings" element={<SkillsListings />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App

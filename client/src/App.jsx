import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import SkillsListings from './pages/SkillsListings'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-black">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/listings" element={<SkillsListings />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App// Force styling deployment Wed 01 Oct 2025 10:34:58 PM EAT
 

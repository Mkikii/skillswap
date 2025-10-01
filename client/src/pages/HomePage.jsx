import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            SKILLSWAP
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Share Skills, Learn Together
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with expert teachers in your community
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/listings')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Explore Skills
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="bg-white text-gray-800 border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Start Teaching
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Community</h3>
            <ul className="text-gray-600 space-y-1">
              <li>Connect with verified experts</li>
              <li>50+ Teachers</li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Fair Pricing</h3>
            <ul className="text-gray-600 space-y-1">
              <li>Teachers set their rates</li>
              <li>No hidden fees</li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Quality</h3>
            <ul className="text-gray-600 space-y-1">
              <li>Rate your experiences</li>
              <li>4.9 Rating</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCode, FaUsers, FaStar, FaGraduationCap, FaChalkboardTeacher, FaHandshake } from 'react-icons/fa';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-purple-600 mb-6 font-cursive">
            SkillSwap
          </h1>
          <p className="text-2xl md:text-3xl text-dark-green mb-8">
            🎯 Share Skills • Learn Together 🌱
          </p>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Connect with experts, learn new skills, and share your knowledge with our community.
          </p>
          
          {user ? (
            <div className="space-y-4">
              <p className="text-lg text-white">Welcome back, {user.username}! 👋</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/listings"
                  className="bg-brown-700 hover:bg-brown-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  📚 Browse Listings
                </Link>
                <Link
                  to="/listings"
                  className="bg-brown-700 hover:bg-brown-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  🎓 Teach a Skill
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auth"
                  className="bg-brown-700 hover:bg-brown-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  🚀 Get Started
                </Link>
                <Link
                  to="/listings"
                  className="border-2 border-brown-700 text-brown-700 hover:bg-brown-700 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  🔍 Browse Skills
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 text-center">
            <FaChalkboardTeacher className="text-yellow-400 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">Teach Your Skills</h3>
            <p className="text-gray-300">Share your expertise and earn while helping others learn</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 text-center">
            <FaGraduationCap className="text-yellow-400 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">Learn from Experts</h3>
            <p className="text-gray-300">Find skilled teachers and master new abilities</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 text-center">
            <FaHandshake className="text-yellow-400 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">Build Community</h3>
            <p className="text-gray-300">Connect with like-minded learners and teachers</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-brown-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <p className="text-white">Sign Up</p>
            </div>
            <div className="text-center">
              <div className="bg-brown-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <p className="text-white">Browse or Create Listings</p>
            </div>
            <div className="text-center">
              <div className="bg-brown-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <p className="text-white">Book Sessions</p>
            </div>
            <div className="text-center">
              <div className="bg-brown-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <p className="text-white">Learn & Grow</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Share Skills, Learn Together
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with expert teachers in your community. Learn new skills or share your expertise with others.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/listings"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Browse Skills
          </Link>
          {!user && (
            <Link
              to="/register"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              Start Teaching
            </Link>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className='bx bx-target-lock text-2xl text-blue-600'></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Experts</h3>
            <p className="text-gray-600">Discover skilled teachers in programming, music, languages, and more.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className='bx bx-credit-card text-2xl text-green-600'></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Set Your Rate</h3>
            <p className="text-gray-600">Teachers set their hourly rates. Learn valuable skills at fair prices.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className='bx bx-star text-2xl text-purple-600'></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Build Community</h3>
            <p className="text-gray-600">Join a network of learners and teachers supporting each other's growth.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
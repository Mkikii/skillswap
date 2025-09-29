import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-purple-500">
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
          <span role="img" aria-label="fire">🔥</span> SKILLSWAP <span role="img" aria-label="fire">🔥</span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-6 font-medium drop-shadow">
          Share Skills, Learn Together
        </p>
        <p className="text-lg text-white mb-10">
          Connect with expert teachers in your community
        </p>
        <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
          <Link to="/listings" className="btn-primary text-lg px-8 py-3 rounded-full shadow hover-lift flex items-center justify-center">
            <span role="img" aria-label="search">🔍</span> <span className="ml-2">Explore Skills</span>
          </Link>
          <Link to="/auth" className="btn-secondary text-lg px-8 py-3 rounded-full shadow hover-lift flex items-center justify-center">
            <span role="img" aria-label="rocket">🚀</span> <span className="ml-2">Start Teaching</span>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 max-w-4xl w-full mx-auto">
        <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow card-hover flex flex-col items-center">
          <div className="text-3xl mb-2"><span role="img" aria-label="community">👥</span></div>
          <div className="font-bold text-gray-800 mb-1">Expert Community</div>
          <div className="text-gray-600 text-sm text-center">Connect with verified experts.<br />50+ Teachers.</div>
        </div>
        <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow card-hover flex flex-col items-center">
          <div className="text-3xl mb-2"><span role="img" aria-label="money">💰</span></div>
          <div className="font-bold text-gray-800 mb-1">Fair Pricing</div>
          <div className="text-gray-600 text-sm text-center">Teachers set their rates.<br />No hidden fees.</div>
        </div>
        <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow card-hover flex flex-col items-center">
          <div className="text-3xl mb-2"><span role="img" aria-label="star">⭐</span></div>
          <div className="font-bold text-gray-800 mb-1">Quality Assured</div>
          <div className="text-gray-600 text-sm text-center">Rate your experiences.<br />4.9★ Rating.</div>
        </div>
      </div>
      <div className="text-white text-lg font-semibold mb-8 bg-black bg-opacity-20 rounded-full px-6 py-2 shadow">
        📊 50+ Teachers • 100+ Skills • 500+ Students
      </div>
      <Link to="/auth" className="btn-primary text-xl px-10 py-4 rounded-full shadow hover-lift">
        <span role="img" aria-label="target">🎯</span> Get Started Today
      </Link>
    </div>
  </div>
);

export default Home;
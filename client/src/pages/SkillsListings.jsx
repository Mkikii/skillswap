import React, { useState, useEffect } from 'react';
import { listingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { skills } from '../data/skills-data';

const SkillsListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await listingsAPI.getAll();
      setListings(response.data.listings || []);
    } catch (error) {
      setError('Failed to fetch listings');
      console.error('Error fetching listings:', error);
    }
    setLoading(false);
  };

  const displayListings = listings.length > 0 ? listings : skills;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Available Skills ({displayListings.length})
          </h1>
          <p className="text-xl text-gray-600">
            Find expert teachers for skills you want to learn
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayListings.map((listing, index) => (
            <div key={listing.id || index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{listing.category === 'Programming' ? '💻' : listing.category === 'Music' ? '🎵' : listing.category === 'Design' ? '🎨' : listing.category === 'Language' ? '🗣️' : listing.category === 'Art' ? '📸' : '🧘'}</div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  KSh {listing.price}/hour
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{listing.title}</h3>
              <p className="text-gray-600 mb-4">{listing.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Teacher: {listing.teacher}</span>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {displayListings.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No skills available yet</h3>
            <p className="text-gray-500">Check back later for new learning opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsListings;
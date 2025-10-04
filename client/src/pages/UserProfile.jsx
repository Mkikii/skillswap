import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaArrowLeft, FaGraduationCap, FaUser, FaCalendar } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'https://skillswap-production-0e78.up.railway.app';

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
      } else {
        setError(data.error || 'Failed to fetch user profile');
      }
    } catch (error) {
      setError('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
        size={16}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-300 mb-6">{error || 'User not found'}</p>
          <Link to="/" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="flex items-center space-x-2 text-pink-600 hover:text-pink-500 transition-colors">
            <FaArrowLeft />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-pink-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
              <p className="text-gray-300 mb-4">{user.bio || 'No bio provided'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-pink-600" />
                  <span className="text-gray-300">Member since</span>
                  <span className="font-semibold text-white">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaStar className="text-pink-600" />
                  <span className="text-gray-300">Rating</span>
                  <span className="font-semibold text-white">{user.average_rating || 0} ⭐</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaGraduationCap className="text-pink-600" />
                  <span className="text-gray-300">Reviews</span>
                  <span className="font-semibold text-white">{user.total_reviews || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <FaGraduationCap className="text-pink-600" />
            <span>Skills & Expertise</span>
          </h2>
          
          {user.skills && user.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.skills.map((skillData, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{skillData.name}</h3>
                    <span className="text-xs bg-pink-900 text-pink-200 px-2 py-1 rounded-full">
                      {skillData.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <span>Proficiency:</span>
                    <span className="font-semibold text-pink-600 capitalize">
                      {skillData.proficiency_level}
                    </span>
                  </div>
                  {skillData.years_experience && (
                    <div className="text-sm text-gray-300 mt-1">
                      {skillData.years_experience} year{skillData.years_experience !== 1 ? 's' : ''} experience
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Skills Added</h3>
              <p className="text-gray-300">This user hasn't added any skills yet.</p>
            </div>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Teaching Listings</h2>
          
          {user.listings && user.listings.length > 0 ? (
            <div className="space-y-4">
              {user.listings.map((listing) => (
                <div key={listing.id} className="border border-gray-700 rounded-lg p-4 hover:border-pink-600 transition-colors">
                  <h3 className="font-semibold text-white mb-2">{listing.title}</h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-pink-600 font-bold">KSh {listing.price_per_hour}/hr</span>
                    <span className="text-gray-400">{listing.skill_name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Listings</h3>
              <p className="text-gray-300">This user hasn't created any teaching listings yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
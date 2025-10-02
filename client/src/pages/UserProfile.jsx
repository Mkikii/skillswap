import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaArrowLeft, FaGraduationCap, FaUser, FaCalendar } from 'react-icons/fa';
import { usersAPI } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-primary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-primary-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'User not found'}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-primary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
            <FaArrowLeft />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="card mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
              <p className="text-gray-600 mb-4">{user.bio || 'No bio provided'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-primary-600" />
                  <span className="text-gray-600">Member since</span>
                  <span className="font-semibold">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaStar className="text-primary-600" />
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold">{user.average_rating || 0} ⭐</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaGraduationCap className="text-primary-600" />
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-semibold">{user.total_reviews || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <FaGraduationCap className="text-primary-600" />
            <span>Skills & Expertise</span>
          </h2>
          
          {user.skills && user.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.skills.map((skillData, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{skillData.skill.name}</h3>
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                      {skillData.skill.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Proficiency:</span>
                    <span className="font-semibold text-primary-600 capitalize">
                      {skillData.proficiency_level}
                    </span>
                  </div>
                  {skillData.years_experience && (
                    <div className="text-sm text-gray-600 mt-1">
                      {skillData.years_experience} year{skillData.years_experience !== 1 ? 's' : ''} experience
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Skills Added</h3>
              <p className="text-gray-600">This user hasn't added any skills yet.</p>
            </div>
          )}
        </div>

        {/* Listings Section */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Teaching Listings</h2>
          
          {user.listings && user.listings.length > 0 ? (
            <div className="space-y-4">
              {user.listings.map((listing) => (
                <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary-600 font-bold">KSh {listing.price_per_hour}/hr</span>
                    <span className="text-gray-500">{listing.skill_name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Listings</h3>
              <p className="text-gray-600">This user hasn't created any teaching listings yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

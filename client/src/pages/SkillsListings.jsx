import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaStar, FaTrash, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

function SkillsListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_per_hour: '',
    skill_id: ''
  });

  useEffect(() => {
    fetchListings();
    fetchSkills();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/listings`);
      const data = await response.json();
      setListings(data.listings || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setFormError('Failed to connect to server.');
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/api/skills`);
      const data = await response.json();
      setSkills(data.skills || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setFormError('Failed to load skills.');
    }
  };

  const createListing = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!user) {
      setFormError('Please login to create a listing');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const requestData = {
        title: formData.title,
        description: formData.description,
        price_per_hour: parseFloat(formData.price_per_hour),
        skill_id: parseInt(formData.skill_id)
      };

      console.log('Creating listing with:', requestData);

      const response = await fetch(`${API_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      console.log('Backend response:', result);

      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', price_per_hour: '', skill_id: '' });
        fetchListings();
        alert('Listing created successfully!');
      } else {
        setFormError(result.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormError('Network error. Please try again.');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchListings();
        alert('Listing deleted successfully!');
      } else {
        alert('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
        size={14}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-700 mx-auto"></div>
          <p className="mt-4 text-white">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center space-x-2 text-pink-700 hover:text-pink-600 transition-colors">
            <FaArrowLeft />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Logged in as: <span className="font-semibold text-pink-700">{user.username}</span>
              </span>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setFormError('');
                }}
                className="bg-pink-700 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
              >
                <FaPlus />
                <span>{showForm ? 'Cancel' : 'Create New Listing'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All Skill Listings
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Discover amazing skills from our expert community or share your own expertise
          </p>
        </div>

        {showForm && (
          <div className="bg-black p-8 rounded-lg mb-12 max-w-2xl mx-auto border border-pink-700">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Listing</h2>
              <p className="text-white mt-2">Share your skills with the community</p>
            </div>

            {formError && (
              <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center space-x-3">
                <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
                <span className="text-red-200">{formError}</span>
              </div>
            )}

            <form onSubmit={createListing} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-700 focus:border-transparent transition-all text-white"
                    placeholder="e.g., Advanced Python Programming"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Price per Hour (KSh) *
                  </label>
                  <input
                    type="number"
                    value={formData.price_per_hour}
                    onChange={(e) => setFormData({...formData, price_per_hour: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-700 focus:border-transparent transition-all text-white"
                    min="1"
                    max="999"
                    step="1"
                    placeholder="450"
                    required
                  />
                  <p className="text-xs text-white mt-1">Must be between 1 and 999 KSh</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Skill Category *
                </label>
                <select
                  value={formData.skill_id}
                  onChange={(e) => setFormData({...formData, skill_id: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-700 focus:border-transparent transition-all text-white"
                  required
                >
                  <option value="">Choose a skill category</option>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name} • {skill.category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-700 focus:border-transparent transition-all text-white"
                  rows="4"
                  placeholder="Describe what students will learn in your sessions..."
                  required
                />
                <p className="text-xs text-white mt-1">Be clear about what you'll teach</p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-pink-700 hover:bg-pink-600 text-white py-4 text-lg font-semibold rounded-lg transition-all"
              >
                Create Listing
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map(listing => (
            <div key={listing.id} className="bg-black p-6 rounded-lg border border-gray-700 hover:border-pink-700 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.round(listing.teacher_rating))}
                    </div>
                    <span className="text-sm text-white">
                      ({listing.teacher_review_count} reviews)
                    </span>
                  </div>
                </div>
                
                {user && user.id === listing.teacher_id && (
                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => handleDeleteListing(listing.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full hover:bg-red-900"
                      title="Delete listing"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-white mb-4 leading-relaxed">
                {listing.description}
              </p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-pink-700">
                  KSh {listing.price_per_hour}
                  <span className="text-sm font-normal text-white">/hr</span>
                </span>
                <span className="text-sm text-white bg-pink-700 px-3 py-1 rounded-full font-medium">
                  {listing.skill_name}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-white">by <span className="font-semibold text-pink-700">{listing.teacher_username}</span></span>
                <div className="flex space-x-3">
                  <button 
                    className="text-pink-700 hover:text-pink-600 font-semibold transition-colors"
                    onClick={() => alert('Rating feature coming soon!')}
                  >
                    Rate
                  </button>
                  <button 
                    className="text-white hover:text-gray-300 font-semibold transition-colors"
                    onClick={() => alert('Review feature coming soon!')}
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">No listings yet</h3>
            <p className="text-white mb-6 max-w-md mx-auto">
              Be the first to share your skills with the community and start teaching!
            </p>
            {user ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-pink-700 hover:bg-pink-600 text-white text-lg px-8 py-4 rounded-lg"
              >
                Create First Listing
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-pink-700 hover:bg-pink-600 text-white text-lg px-8 py-4 rounded-lg"
              >
                Sign Up to Create Listing
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillsListings;
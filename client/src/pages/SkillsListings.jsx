import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaStar, FaEdit, FaTrash, FaArrowLeft, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

function SkillsListings() {
  const { user, getToken } = useAuth();
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
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!user) {
      setFormError('Please login to create a listing');
      return;
    }

    // Validate form data
    if (!formData.title.trim() || !formData.description.trim() || !formData.price_per_hour || !formData.skill_id) {
      setFormError('All fields are required');
      return;
    }

    const price = parseFloat(formData.price_per_hour);
    if (isNaN(price) || price <= 0) {
      setFormError('Price must be a number greater than 0');
      return;
    }

    if (price > 999) {
      setFormError('Price per hour must be 3 digits or less');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setFormError('Authentication token missing. Please login again.');
        return;
      }

      console.log('Sending create listing request with token');
      
      const response = await fetch(`${API_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price_per_hour: price,
          skill_id: parseInt(formData.skill_id)
        })
      });

      const data = await response.json();
      console.log('Create listing response:', response.status);
      
      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', price_per_hour: '', skill_id: '' });
        setFormError('');
        fetchListings();
        alert('🎉 Listing created successfully!');
      } else {
        setFormError(data.error || `Failed to create listing (Status: ${response.status})`);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      setFormError('Failed to create listing. Please check your connection and try again.');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchListings();
        alert('✅ Listing deleted successfully!');
      } else {
        alert('❌ Failed to delete listing');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-primary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
            <FaArrowLeft />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          {user && (
            <button
              onClick={() => {
                setShowForm(!showForm);
                setFormError('');
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <FaPlus />
              <span>{showForm ? 'Cancel' : 'Create New Listing'}</span>
            </button>
          )}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All Skill Listings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing skills from our expert community or share your own expertise
          </p>
        </div>

        {/* Debug Info */}
        {user && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <FaCheckCircle />
              <span>Logged in as: <strong>{user.username}</strong> (ID: {user.id})</span>
            </div>
          </div>
        )}

        {/* Create Listing Form */}
        {showForm && (
          <div className="card mb-12 max-w-2xl mx-auto border-2 border-primary-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Listing</h2>
              <p className="text-gray-600 mt-2">Share your skills with the community</p>
            </div>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                <span className="text-red-700">{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateListing} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="e.g., Advanced Python Programming"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price per Hour (KSh) *
                  </label>
                  <input
                    type="number"
                    value={formData.price_per_hour}
                    onChange={(e) => setFormData({...formData, price_per_hour: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    min="1"
                    max="999"
                    step="1"
                    placeholder="450"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be between 1 and 999 KSh</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skill Category *
                </label>
                <select
                  value={formData.skill_id}
                  onChange={(e) => setFormData({...formData, skill_id: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  rows="4"
                  placeholder="Describe what students will learn in your sessions..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Be clear about what you'll teach</p>
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-4 text-lg font-semibold"
              >
                🚀 Create Listing
              </button>
            </form>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map(listing => (
            <div key={listing.id} className="card group hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.round(listing.teacher_rating))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({listing.teacher_review_count} reviews)
                    </span>
                  </div>
                </div>
                
                {/* Delete button for listing owner */}
                {user && user.id === listing.teacher_id && (
                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => handleDeleteListing(listing.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                      title="Delete listing"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                {listing.description}
              </p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-primary-600">
                  KSh {listing.price_per_hour}
                  <span className="text-sm font-normal text-gray-500">/hr</span>
                </span>
                <span className="text-sm text-gray-700 bg-primary-100 px-3 py-1 rounded-full font-medium">
                  {listing.skill_name}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">by <span className="font-semibold text-primary-600">{listing.teacher_username}</span></span>
                <div className="flex space-x-3">
                  <button 
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                    onClick={() => alert('⭐ Rating feature coming soon!')}
                  >
                    Rate
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                    onClick={() => alert('📝 Review feature coming soon!')}
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Be the first to share your skills with the community and start teaching!
            </p>
            {user ? (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary text-lg px-8 py-4"
              >
                Create First Listing
              </button>
            ) : (
              <Link
                to="/auth"
                className="btn-primary text-lg px-8 py-4"
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

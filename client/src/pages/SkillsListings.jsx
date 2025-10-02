import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaStar, FaTrash, FaEdit, FaArrowLeft, FaExclamationTriangle, FaUser, FaMoneyBillWave, FaGraduationCap } from 'react-icons/fa';
import { listingsAPI, skillsAPI } from '../services/api';

function SkillsListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
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
      const response = await listingsAPI.getAll();
      setListings(response.data.listings || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setFormError('Failed to connect to server.');
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setFormError('Failed to load skills.');
    }
  };

  const handleCreateOrUpdateListing = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!user) {
      setFormError('Please login to create a listing');
      return;
    }

    try {
      // Validate form data
      if (!formData.title.trim() || !formData.description.trim() || !formData.price_per_hour || !formData.skill_id) {
        setFormError('All fields are required');
        return;
      }

      if (parseFloat(formData.price_per_hour) < 1 || parseFloat(formData.price_per_hour) > 999) {
        setFormError('Price must be between 1 and 999 KSh');
        return;
      }

      if (editingListing) {
        // Update existing listing
        await listingsAPI.update(editingListing.id, formData);
        alert('Listing updated successfully!');
      } else {
        // Create new listing
        await listingsAPI.create(formData);
        alert('Listing created successfully!');
      }

      setShowForm(false);
      setEditingListing(null);
      setFormData({ title: '', description: '', price_per_hour: '', skill_id: '' });
      fetchListings();
    } catch (error) {
      console.error('Error saving listing:', error);
      setFormError(error.response?.data?.error || 'Failed to save listing');
    }
  };

  const handleEditListing = (listing) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title,
      description: listing.description,
      price_per_hour: listing.price_per_hour.toString(),
      skill_id: skills.find(s => s.name === listing.skill_name)?.id || ''
    });
    setShowForm(true);
    setFormError('');
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await listingsAPI.delete(listingId);
      fetchListings();
      alert('Listing deleted successfully!');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingListing(null);
    setFormData({ title: '', description: '', price_per_hour: '', skill_id: '' });
    setFormError('');
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center space-x-2 text-pink-700 hover:text-pink-600 transition-colors">
            <FaArrowLeft />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-white">
                <FaUser className="inline mr-2" />
                Welcome, <span className="font-semibold text-pink-700">{user.username}</span>
              </span>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingListing(null);
                  setFormData({ title: '', description: '', price_per_hour: '', skill_id: '' });
                  setFormError('');
                }}
                className="bg-pink-700 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
              >
                <FaPlus />
                <span>Create New Listing</span>
              </button>
            </div>
          )}
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All Skill Listings
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Discover amazing skills from our expert community or share your own expertise
          </p>
        </div>

        {/* Create/Edit Listing Form */}
        {showForm && (
          <div className="bg-black p-8 rounded-lg mb-12 max-w-2xl mx-auto border border-pink-700">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingListing ? 'Edit Listing' : 'Create New Listing'}
              </h2>
              <p className="text-white mt-2">
                {editingListing ? 'Update your listing details' : 'Share your skills with the community'}
              </p>
            </div>

            {formError && (
              <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center space-x-3">
                <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
                <span className="text-red-200">{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateOrUpdateListing} className="space-y-6">
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
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-700 hover:bg-pink-600 text-white py-4 text-lg font-semibold rounded-lg transition-all"
                >
                  {editingListing ? 'Update Listing' : 'Create Listing'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 text-lg font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map(listing => (
            <div key={listing.id} className="bg-black p-6 rounded-lg border border-gray-700 hover:border-pink-700 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-600 transition-colors">
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
                
                {/* Edit/Delete buttons - only show if user owns the listing */}
                {user && user.id === listing.teacher_id && (
                  <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditListing(listing)}
                      className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-full hover:bg-blue-900"
                      title="Edit listing"
                    >
                      <FaEdit size={16} />
                    </button>
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
              
              <p className="text-white mb-4 leading-relaxed line-clamp-3">
                {listing.description}
              </p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-pink-700 flex items-center">
                  <FaMoneyBillWave className="mr-2" />
                  KSh {listing.price_per_hour}
                  <span className="text-sm font-normal text-white ml-1">/hr</span>
                </span>
                <span className="text-sm text-white bg-pink-700 px-3 py-1 rounded-full font-medium flex items-center">
                  <FaGraduationCap className="mr-1" />
                  {listing.skill_name}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-700">
                <span className="text-white">
                  by <span className="font-semibold text-pink-700">{listing.teacher_username}</span>
                </span>
                <Link 
                  to={`/user/${listing.teacher_id}`}
                  className="text-pink-700 hover:text-pink-600 font-semibold transition-colors"
                >
                  View Profile
                </Link>
              </div>

              {/* Book Session Button */}
              <div className="mt-4">
                <Link
                  to={`/book/${listing.id}`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-all text-center block"
                >
                  Book Session
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
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
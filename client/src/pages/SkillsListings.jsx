import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingsAPI, skillsAPI } from '../services/api';

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
      const response = await listingsAPI.getAll();
      if (response.data && response.data.listings) {
        setListings(response.data.listings);
      } else {
        setListings([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      if (response.data && response.data.skills) {
        setSkills(response.data.skills);
      } else {
        setSkills([]);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return 'Title is required';
    }
    if (!formData.description.trim()) {
      return 'Description is required';
    }
    if (!formData.price_per_hour || formData.price_per_hour < 1 || formData.price_per_hour > 9999) {
      return 'Price must be between 1 and 9999 KSh';
    }
    if (!formData.skill_id) {
      return 'Please select a skill';
    }
    return null;
  };

  const createListing = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!user) {
      setFormError('Please login to create a listing');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await listingsAPI.create(formData);
      
      setShowForm(false);
      setFormData({ title: '', description: '', price_per_hour: '', skill_id: '' });
      fetchListings();
      alert('Listing created successfully!');
    } catch (error) {
      console.error('Error creating listing:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create listing. Please try again.';
      setFormError(errorMessage);
    }
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
          <Link to="/" className="flex items-center space-x-2 text-pink-600 hover:text-pink-500">
            <span>Back to Home</span>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Welcome, <span className="font-semibold text-pink-600">{user.username}</span>
              </span>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                {showForm ? 'Cancel' : 'Create New Listing'}
              </button>
            </div>
          )}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All Skill Listings
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover amazing skills from our expert community
          </p>
        </div>

        {showForm && (
          <div className="bg-gray-900 p-8 rounded-lg mb-12 max-w-2xl mx-auto border border-pink-600">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Create New Listing</h2>

            {formError && (
              <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={createListing} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-600 text-white"
                  placeholder="e.g., Advanced Python Programming"
                  required
                  minLength={5}
                  maxLength={200}
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
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-600 text-white"
                  min="1"
                  max="9999"
                  step="50"
                  placeholder="450"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Must be between 1 and 9999 KSh</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Skill Category *
                </label>
                <select
                  value={formData.skill_id}
                  onChange={(e) => setFormData({...formData, skill_id: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-600 text-white"
                  required
                >
                  <option value="">Choose a skill</option>
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
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-600 text-white"
                  rows="4"
                  placeholder="Describe what you'll teach..."
                  required
                  minLength={10}
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 text-lg font-semibold rounded-lg transition-all"
              >
                Create Listing
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map(listing => (
            <div key={listing.id} className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-pink-600 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {listing.title}
                  </h3>
                  <div className="text-sm text-gray-400 mb-2">
                    by {listing.teacher_username}
                  </div>
                </div>
                
                {user && user.id === listing.teacher_id && (
                  <button 
                    onClick={() => handleDeleteListing(listing.id)}
                    className="text-red-400 hover:text-red-300 transition-colors ml-2 px-3 py-1 bg-red-900 rounded"
                    title="Delete listing"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              <p className="text-gray-300 mb-4">
                {listing.description}
              </p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-pink-600">
                  KSh {listing.price_per_hour}
                  <span className="text-sm font-normal text-gray-400">/hr</span>
                </span>
                <span className="text-sm text-white bg-pink-600 px-3 py-1 rounded-full">
                  {listing.skill_name}
                </span>
              </div>

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

        {listings.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-white mb-2">No listings yet</h3>
            <p className="text-gray-300 mb-6">
              Be the first to share your skills!
            </p>
            {user ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white text-lg px-8 py-4 rounded-lg"
              >
                Create First Listing
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-pink-600 hover:bg-pink-700 text-white text-lg px-8 py-4 rounded-lg"
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
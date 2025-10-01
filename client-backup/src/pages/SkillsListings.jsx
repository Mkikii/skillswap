import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

function SkillsListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
    } catch (error) {
      console.error('Error fetching listings:', error);
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
    if (!user) {
      alert('Please login to create a listing');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', price_per_hour: '', skill_id: '' });
        fetchListings();
        alert('Listing created successfully!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">All Skill Listings</h1>
        
        {user && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              {showForm ? 'Cancel' : 'Create New Listing'}
            </button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleCreateListing} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Listing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price per Hour (KSh)</label>
                <input
                  type="number"
                  value={formData.price_per_hour}
                  onChange={(e) => setFormData({...formData, price_per_hour: e.target.value})}
                  className="w-full p-2 border rounded"
                  min="1"
                  max="999"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Skill</label>
              <select
                value={formData.skill_id}
                onChange={(e) => setFormData({...formData, skill_id: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a skill</option>
                {skills.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name} ({skill.category})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Listing
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
              <p className="text-gray-600 mb-2">{listing.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-600 font-bold">KSh {listing.price_per_hour}/hr</span>
                <span className="text-sm text-gray-500">by {listing.teacher_username}</span>
              </div>
              <div className="text-sm text-gray-500">
                {listing.skill_name} • {listing.teacher_rating} ⭐ ({listing.teacher_review_count} reviews)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkillsListings;
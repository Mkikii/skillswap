import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI, skillsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_per_hour: '',
    skill_id: ''
  });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillsAPI.getAll();
        setSkills(response.data.skills);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user) {
      setError('Please log in to create a listing');
      setLoading(false);
      return;
    }

    try {
      await listingsAPI.create(formData);
      navigate('/listings');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create listing');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="container text-center p-4">
        <h2>Please log in to create a listing</h2>
        <p>You need to be logged in to share your skills with the community.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div className="card">
        <h2 className="text-center">Create Skill Listing</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Listing Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Professional Python Tutoring"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe what you'll teach and your experience..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="form-control"
              rows="4"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price per Hour ($)</label>
            <input
              id="price"
              type="number"
              placeholder="25"
              value={formData.price_per_hour}
              onChange={(e) => setFormData({...formData, price_per_hour: e.target.value})}
              className="form-control"
              min="1"
              step="0.5"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="skill">Skill Category</label>
            <select
              id="skill"
              value={formData.skill_id}
              onChange={(e) => setFormData({...formData, skill_id: e.target.value})}
              className="form-control"
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
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Creating Listing...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
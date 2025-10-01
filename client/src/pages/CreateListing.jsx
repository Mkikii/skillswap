import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI, skillsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  title: yup.string().min(5, 'Title must be at least 5 characters').required('Title is required'),
  description: yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
  price_per_hour: yup.number().min(100, 'Price must be at least KSH 100').max(999, 'Price must be less than KSH 1000').required('Price is required'),
  skill_id: yup.number().required('Skill is required')
});

const CreateListing = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price_per_hour: '',
      skill_id: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await listingsAPI.create(values);
        console.log('Listing created:', response.data);
        navigate('/listings');
      } catch (error) {
        console.error('Failed to create listing:', error.response?.data || error.message);
        alert(error.response?.data?.error || 'Failed to create listing');
      }
      setLoading(false);
    }
  });

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to create a listing</h2>
          <p className="text-gray-600">You need to be logged in to share your skills with the community.</p>
          <button 
            onClick={() => navigate('/auth')}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Create Skill Listing</h2>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Listing Title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Professional Python Tutoring"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe what you'll teach and your experience..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="price_per_hour" className="block text-sm font-medium text-gray-700 mb-2">Price per Hour (KSH)</label>
              <input
                id="price_per_hour"
                name="price_per_hour"
                type="number"
                placeholder="250"
                value={formik.values.price_per_hour}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="100"
                max="999"
                step="50"
              />
              {formik.touched.price_per_hour && formik.errors.price_per_hour && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.price_per_hour}</div>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="skill_id" className="block text-sm font-medium text-gray-700 mb-2">Skill Category</label>
              <select
                id="skill_id"
                name="skill_id"
                value={formik.values.skill_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a skill</option>
                {skills.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name} ({skill.category})
                  </option>
                ))}
              </select>
              {formik.touched.skill_id && formik.errors.skill_id && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.skill_id}</div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
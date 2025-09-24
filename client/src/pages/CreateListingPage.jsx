import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

function CreateListingPage({ user }) {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch skills from the backend to populate the dropdown
  useEffect(() => {
    fetch('/skills')
      .then(response => response.json())
      .then(data => setSkills(data))
      .catch(err => console.error("Could not fetch skills:", err));
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price_per_hour: 0,
      skill_id: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      price_per_hour: Yup.number().required('Price is required').min(0, 'Price must be a positive number'),
      skill_id: Yup.number().required('Skill is required'),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSuccessMessage(null);
      setError(null);

      fetch('/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.error || 'Failed to create listing.');
          });
        }
        return response.json();
      })
      .then(() => {
        setSuccessMessage('Listing created successfully!');
        resetForm();
        navigate('/profile'); // Redirect to profile page after creation
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
    },
  });

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="form-container">
      <h2>Create a New Skill Listing</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Listing Title</label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="error">{formik.errors.title}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="error">{formik.errors.description}</div>
          ) : null}
        </div>
        
        <div className="form-group">
          <label htmlFor="skill_id">Skill</label>
          <select
            id="skill_id"
            name="skill_id"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.skill_id}
          >
            <option value="">Select a Skill</option>
            {skills.map(skill => (
              <option key={skill.id} value={skill.id}>{skill.name}</option>
            ))}
          </select>
          {formik.touched.skill_id && formik.errors.skill_id ? (
            <div className="error">{formik.errors.skill_id}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="price_per_hour">Price per Hour</label>
          <input
            id="price_per_hour"
            name="price_per_hour"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price_per_hour}
          />
          {formik.touched.price_per_hour && formik.errors.price_per_hour ? (
            <div className="error">{formik.errors.price_per_hour}</div>
          ) : null}
        </div>

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}

export default CreateListingPage;
import axios from 'axios';

const API_BASE_URL = 'https://skillswap-production-0e78.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

// Permanent error handling for listings
const formatListingData = (data) => {
  if (!data.title?.trim() || !data.description?.trim() || !data.price_per_hour || !data.skill_id) {
    throw new Error('All fields are required');
  }
  
  const price = parseFloat(data.price_per_hour);
  if (price < 1 || price > 999 || isNaN(price)) {
    throw new Error('Price must be between 1 and 999 KSh');
  }
  
  const skillId = parseInt(data.skill_id);
  if (isNaN(skillId)) {
    throw new Error('Please select a valid skill');
  }
  
  return {
    title: data.title.trim(),
    description: data.description.trim(),
    price_per_hour: price,
    skill_id: skillId
  };
};

// Permanent error handling for sessions
const formatSessionData = (data) => {
  if (!data.listing_id || !data.scheduled_date) {
    throw new Error('Date and listing are required');
  }
  
  const duration = parseFloat(data.duration_hours);
  if (duration < 0.5 || duration > 8 || isNaN(duration)) {
    throw new Error('Duration must be between 0.5 and 8 hours');
  }
  
  return {
    listing_id: parseInt(data.listing_id),
    scheduled_date: data.scheduled_date,
    duration_hours: duration,
    notes: data.notes?.trim() || ''
  };
};

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/profile'),
};

export const listingsAPI = {
  getAll: () => api.get('/api/listings'),
  getById: (id) => api.get(`/api/listings/${id}`),
  create: (listingData) => {
    const formattedData = formatListingData(listingData);
    return api.post('/api/listings', formattedData);
  },
  update: (id, listingData) => {
    const formattedData = formatListingData(listingData);
    return api.put(`/api/listings/${id}`, formattedData);
  },
  delete: (id) => api.delete(`/api/listings/${id}`),
  getMyListings: () => api.get('/api/listings/my-listings'),
};

export const skillsAPI = {
  getAll: () => api.get('/api/skills'),
};

export const sessionsAPI = {
  getAll: () => api.get('/api/sessions'),
  create: (sessionData) => {
    const formattedData = formatSessionData(sessionData);
    return api.post('/api/sessions', formattedData);
  },
  getMySessions: () => api.get('/api/sessions/my-sessions'),
};

export const reviewsAPI = {
  getAll: () => api.get('/api/reviews'),
  create: (reviewData) => api.post('/api/reviews', reviewData),
};

export const usersAPI = {
  getProfile: (id) => api.get(`/api/users/${id}`),
  addSkill: (skillData) => api.post('/api/users/skills', skillData),
  removeSkill: (skillId) => api.delete(`/api/users/skills/${skillId}`),
  search: (params) => api.get('/api/users/search', { params }),
  getExperts: () => api.get('/api/users/experts'),
};

export default api;
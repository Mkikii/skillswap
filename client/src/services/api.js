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

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/profile'),
};

export const listingsAPI = {
  getAll: () => api.get('/api/listings'),
  getById: (id) => api.get(`/api/listings/${id}`),
  create: (listingData) => {
    const formattedData = {
      title: listingData.title?.trim(),
      description: listingData.description?.trim(),
      price_per_hour: parseFloat(listingData.price_per_hour) || 0,
      skill_id: parseInt(listingData.skill_id) || 0
    };
    return api.post('/api/listings', formattedData);
  },
  update: (id, listingData) => api.put(`/api/listings/${id}`, listingData),
  delete: (id) => api.delete(`/api/listings/${id}`),
  getMyListings: () => api.get('/api/listings/my-listings'),
};

export const skillsAPI = {
  getAll: () => api.get('/api/skills'),
};

export const sessionsAPI = {
  getAll: () => api.get('/api/sessions'),
  create: (sessionData) => {
    const formattedData = {
      listing_id: parseInt(sessionData.listing_id) || 0,
      scheduled_date: sessionData.scheduled_date,
      duration_hours: parseFloat(sessionData.duration_hours) || 1.0,
      notes: sessionData.notes || ''
    };
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
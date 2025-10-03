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

const formatListingData = (data) => ({
  title: data.title?.trim(),
  description: data.description?.trim(),
  price_per_hour: parseFloat(data.price_per_hour) || 0,
  skill_id: parseInt(data.skill_id) || 0
});

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/profile'),
};

export const listingsAPI = {
  getAll: () => api.get('/api/listings'),
  getById: (id) => api.get(`/api/listings/${id}`),
  create: (listingData) => api.post('/api/listings', formatListingData(listingData)),
  update: (id, listingData) => api.put(`/api/listings/${id}`, formatListingData(listingData)),
  delete: (id) => api.delete(`/api/listings/${id}`),
  getMyListings: () => api.get('/api/listings/my-listings'),
};

export const skillsAPI = {
  getAll: () => api.get('/api/skills'),
};

export const sessionsAPI = {
  getAll: () => api.get('/api/sessions'),
  create: (sessionData) => api.post('/api/sessions', sessionData),
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
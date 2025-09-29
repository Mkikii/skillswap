import axios from 'axios';

const API_BASE_URL = 'http://localhost:5555';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/profile'),
};

export const listingsAPI = {
  getAll: () => api.get('/api/listings'),
  getById: (id) => api.get(`/api/listings/${id}`),
  create: (listingData) => api.post('/api/listings', listingData),
};

export const skillsAPI = {
  getAll: () => api.get('/api/skills'),
};

export const sessionsAPI = {
  getAll: () => api.get('/api/sessions'),
  create: (sessionData) => api.post('/api/sessions', sessionData),
  update: (id, sessionData) => api.put(`/api/sessions/${id}`, sessionData),
};

export const reviewsAPI = {
  getAll: () => api.get('/api/reviews'),
  create: (reviewData) => api.post('/api/reviews', reviewData),
  getMyReviews: () => api.get('/api/reviews/my-reviews'),
};

export default api;

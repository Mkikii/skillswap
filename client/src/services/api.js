import axios from 'axios';

const API_URL = 'http://localhost:5555';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/api/auth/profile'),
};

export const listingsAPI = {
  getAll: () => api.get('/api/listings'),
  getById: (id) => api.get(`/api/listings/${id}`),
  create: (listingData) => api.post('/api/listings', listingData),
  getByUser: (userId) => api.get(`/api/listings/user/${userId}`),
};

export const skillsAPI = {
  getAll: () => api.get('/api/skills'),
};

export const sessionsAPI = {
  create: (sessionData) => api.post('/api/sessions', sessionData),
  getUserSessions: () => api.get('/api/sessions/user'),
};

export default api;
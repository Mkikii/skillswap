import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5555/api';

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
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const listingsAPI = {
  getAll: () => api.get('/listings'),
  getById: (id) => api.get(`/listings/${id}`),
  create: (listingData) => api.post('/listings', listingData),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
};

export default api;
import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5555"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  register: (userData) => api.post("/api/auth/register", userData),
  login: (credentials) => api.post("/api/auth/login", credentials),
  getProfile: () => api.get("/api/auth/profile"),
  updateProfile: (userData) => api.put("/api/auth/profile", userData),
  changePassword: (passwordData) => api.put("/api/auth/change-password", passwordData),
}

export const skillsAPI = {
  getAll: () => api.get("/api/skills"),
  create: (skillData) => api.post("/api/skills", skillData),
}

export const listingsAPI = {
  getAll: () => api.get("/api/listings"),
  getById: (id) => api.get(`/api/listings/${id}`),
  create: (listingData) => api.post("/api/listings", listingData),
  update: (id, listingData) => api.put(`/api/listings/${id}`, listingData),
  delete: (id) => api.delete(`/api/listings/${id}`),
  getByUser: (userId) => api.get(`/api/listings/user/${userId}`),
}

export const sessionsAPI = {
  getAll: () => api.get("/api/sessions"),
  getById: (id) => api.get(`/api/sessions/${id}`),
  create: (sessionData) => api.post("/api/sessions", sessionData),
  update: (id, sessionData) => api.put(`/api/sessions/${id}`, sessionData),
  getByUser: (userId) => api.get(`/api/sessions/user/${userId}`),
}

export const reviewsAPI = {
  getAll: () => api.get("/api/reviews"),
  getById: (id) => api.get(`/api/reviews/${id}`),
  create: (reviewData) => api.post("/api/reviews", reviewData),
  getByUser: (userId) => api.get(`/api/reviews/user/${userId}`),
}

export default api

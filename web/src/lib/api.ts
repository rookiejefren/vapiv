import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (username: string, email: string, password: string, code: string) =>
    api.post('/auth/register', { username, email, password, code }),
  sendCode: (email: string, purpose: 'register' | 'reset') =>
    api.post('/auth/send-code', { email, purpose }),
  resetPassword: (email: string, code: string, new_password: string) =>
    api.post('/auth/reset-password', { email, code, new_password }),
};

// API Key management
export const apiKeyApi = {
  list: () => api.get('/user/apikeys'),
  create: (name: string) => api.post('/user/apikeys', { name }),
  delete: (id: string) => api.delete(`/user/apikeys/${id}`),
};

// User API
export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updatePassword: (oldPassword: string, newPassword: string) =>
    api.post('/user/password', { old_password: oldPassword, new_password: newPassword }),
  getUsage: () => api.get('/user/usage'),
  getLogs: (page: number = 1, limit: number = 20) =>
    api.get(`/user/logs?page=${page}&limit=${limit}`),
};

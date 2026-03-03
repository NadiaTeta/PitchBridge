import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_URL = import.meta.env.DEV ? '/api/v1' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');

// Create axios instance with proper typing
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests with proper typing
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Handle responses with proper typing
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success: boolean; error: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
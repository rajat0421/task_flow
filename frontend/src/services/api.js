import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add logging for debugging
const logNetworkActivity = (config) => {
  if (import.meta.env.DEV) {
    console.log(`[API] ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
  }
  return config;
};

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return logNetworkActivity(config);
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    if (import.meta.env.DEV) {
      console.error('[API Response Error]', {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }
    
    // Handle 401 Unauthorized errors (expired token)
    if (error.response && error.response.status === 401) {
      // Clear token
      localStorage.removeItem('token');
      
      // Only redirect to login if not already on auth pages
      const authPaths = ['/login', '/register', '/oauth-callback'];
      const isAuthPage = authPaths.some(path => window.location.pathname.includes(path));
      
      if (!isAuthPage) {
        // Store the current path to redirect back after login
        localStorage.setItem('redirectPath', window.location.pathname);
        window.location.href = '/login';
      }
    }
    
    // Ensure error is properly formatted for handling in app components
    if (error.response && !error.response.data.error && !error.response.data.message) {
      error.response.data = { 
        ...error.response.data,
        error: error.response.statusText || 'An error occurred'
      };
    }
    
    return Promise.reject(error);
  }
);

export default api; 
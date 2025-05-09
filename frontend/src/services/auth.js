import api from './api';
import { jwtDecode } from 'jwt-decode';

// Register a new user
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

// Login a user
export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

// Logout a user
export const logout = () => {
  localStorage.removeItem('token');
};

// Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
};

// Get current user ID from token
export const getCurrentUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    return null;
  }
}; 
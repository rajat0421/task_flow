import api from './api';
import { jwtDecode } from 'jwt-decode';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    // Rethrow with more details if available
    throw error;
  }
};

// Login a user
export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Validate token after saving
      try {
        const decoded = jwtDecode(response.data.token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          console.error('Token expired immediately after login');
          localStorage.removeItem('token');
          throw new Error('Authentication failed - token expired');
        }
      } catch (tokenError) {
        console.error('Token validation error:', tokenError);
        localStorage.removeItem('token');
        throw new Error('Invalid authentication token received');
      }
    } else {
      throw new Error('No token received from server');
    }
    
    return response.data;
  } catch (error) {
    // Ensure error propagation with proper formatting
    console.error('Login error:', error);
    throw error;
  }
};

// Logout a user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('redirectPath');
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
      console.log('Token expired, logging out');
      localStorage.removeItem('token');
      return false;
    }
    
    // Additionally verify token has expected fields
    if (!decoded.id || !decoded.email) {
      console.log('Token missing required fields, logging out');
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
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
    console.error('Error getting user ID from token:', error);
    return null;
  }
}; 
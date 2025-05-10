import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated as checkTokenValidity, logout, login, register } from '../services/auth';
import { getCurrentUserInfo } from '../services/users';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = checkTokenValidity();
      
      if (authenticated) {
        // Get user info from token
        const userInfo = getCurrentUserInfo();
        if (userInfo) {
          setUser({ 
            authenticated: true,
            ...userInfo
          });
        } else {
          // If we can't get user info, the token may be invalid
          logout();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    setError(null);
    try {
      const data = await login(credentials);
      
      // Get user info from token after login
      const userInfo = getCurrentUserInfo();
      
      if (!userInfo) {
        throw new Error('Failed to get user information');
      }
      
      setUser({ 
        authenticated: true,
        ...userInfo
      });
      
      navigate('/dashboard');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      // Improved error handling - extract error message from response or use fallback
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);
      return false;
    }
  };

  const handleOAuthLogin = async () => {
    setError(null);
    try {
      // The token is already set in localStorage by the OAuthCallback component
      // Just update the user context with the user info from the token
      const userInfo = getCurrentUserInfo();
      
      if (!userInfo) {
        throw new Error('Failed to get user information');
      }
      
      setUser({ 
        authenticated: true,
        ...userInfo
      });
      
      return true;
    } catch (err) {
      console.error('OAuth login error:', err);
      setError('Failed to complete authentication');
      return false;
    }
  };

  const handleRegister = async (userData) => {
    setError(null);
    try {
      await register(userData);
      navigate('/login');
      return true;
    } catch (err) {
      // Improved error handling - extract error message from response or use fallback
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return false;
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const updateUserContext = (userData) => {
    if (user) {
      setUser(prevUser => ({
        ...prevUser,
        ...userData
      }));
    }
  };

  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    handleOAuthLogin,
    isAuthenticated: () => !!user && user.authenticated === true,
    updateUserContext
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, logout, login, register } from '../services/auth';
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
      const authenticated = isAuthenticated();
      setUser(authenticated ? { authenticated: true } : null);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    setError(null);
    try {
      await login(credentials);
      setUser({ authenticated: true });
      navigate('/dashboard');
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
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
      setError(err.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: () => !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
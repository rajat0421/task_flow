import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const OAuthCallback = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOAuthLogin } = useAuth();

  useEffect(() => {
    const processOAuthLogin = async () => {
      try {
        // Get token from URL parameter
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setStatus('error');
          setError('No authentication token received');
          return;
        }
        
        // Store token and update auth context
        localStorage.setItem('token', token);
        await handleOAuthLogin();
        
        setStatus('success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setError(err.message || 'Failed to authenticate');
        console.error('OAuth callback error:', err);
      }
    };

    processOAuthLogin();
  }, [location, navigate, handleOAuthLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {status === 'processing' && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Completing Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we log you in...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FiCheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Login Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Redirecting you to your dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FiAlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Authentication Failed
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || 'An unknown error occurred during authentication.'}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback; 
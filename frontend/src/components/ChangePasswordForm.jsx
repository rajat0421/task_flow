import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiLock, FiAlertCircle, FiCheckCircle, 
  FiEye, FiEyeOff, FiShield
} from 'react-icons/fi';
import { changePassword } from '../services/users';
import { toast } from 'react-toastify';

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (error) {
      setError(null);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Current password is required');
      return false;
    }
    
    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }
    
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess(true);
      toast.success('Password changed successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to change password';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <FiShield className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-start"
        >
          <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
      
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm flex items-start"
        >
          <FiCheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>Password updated successfully</span>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              required
              value={formData.currentPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              {showPasswords.current ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="newPassword"
              name="newPassword"
              type={showPasswords.new ? "text" : "password"}
              required
              minLength={6}
              value={formData.newPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              {showPasswords.new ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              {showPasswords.confirm ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Updating...
              </div>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChangePasswordForm; 
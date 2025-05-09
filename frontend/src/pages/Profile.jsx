import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiSave, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/users';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUserContext } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfileData({
          name: data.name || '',
          email: data.email || ''
        });
      } catch (err) {
        setError('Failed to load profile. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    try {
      setSaving(true);
      await updateUserProfile({ name: profileData.name });
      
      // Update user context if we're storing user details there
      if (updateUserContext) {
        updateUserContext({ name: profileData.name });
      }
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile.');
      toast.error('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-6"
    >
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">User Profile</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-start">
            <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing || saving}
                  className={`pl-10 block w-full rounded-md border shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm
                    ${isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-transparent bg-gray-50 dark:bg-gray-800'}`}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  disabled={true}
                  className="pl-10 block w-full rounded-md border-transparent bg-gray-50 dark:bg-gray-800 shadow-sm py-2 px-3 text-gray-500 dark:text-gray-400 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Email cannot be changed
              </p>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {saving ? 'Saving...' : (
                      <>
                        <FiSave className="mr-2 -ml-1 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Account created: <span className="text-gray-700 dark:text-gray-300">March 15, 2023</span></p>
          <p className="mt-2">Last login: <span className="text-gray-700 dark:text-gray-300">Today</span></p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile; 
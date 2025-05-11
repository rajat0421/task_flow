import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, FiSave, FiAlertCircle, FiMail, 
  FiCalendar, FiClock, FiEdit2, FiCheckCircle,
  FiAward, FiTrendingUp
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/users';
import { toast } from 'react-toastify';
import ChangePasswordForm from '../components/ChangePasswordForm';

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
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Profile Header */}
      <motion.div 
        variants={itemVariants}
        className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-8 text-white shadow-lg"
      >
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-300"
          >
            <FiEdit2 className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
            {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
            <div className="flex items-center space-x-2 text-white/80">
              <FiMail className="h-4 w-4" />
              <span>{profileData.email}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiAward className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <FiTrendingUp className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Productivity Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FiClock className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Form */}
      {isEditing && (
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-start">
              <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  disabled={saving}
                  className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  disabled={true}
                  className="pl-10 block w-full rounded-lg border-transparent bg-gray-50 dark:bg-gray-800 shadow-sm py-2 px-3 text-gray-500 dark:text-gray-400 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Email cannot be changed
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {saving ? 'Saving...' : (
                  <>
                    <FiSave className="mr-2 -ml-1 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Change Password Form */}
      <motion.div variants={itemVariants}>
        <ChangePasswordForm />
      </motion.div>
      
      {/* Account Info */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiCalendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">March 15, 2023</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">Today</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile; 
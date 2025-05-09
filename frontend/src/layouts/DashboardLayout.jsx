import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiMenu, FiX, FiHome, FiList, FiBarChart2, 
  FiUser, FiLogOut, FiMoon, FiSun, FiBell,
  FiSettings, FiChevronDown
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Check for dark mode preference
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    setProfileDropdownOpen(false);
    navigate('/profile');
  };
  
  // Handle logout
  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (user && user.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.name[0].toUpperCase();
    }
    return 'U';
  };
  
  // Define navigation links
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Tasks', path: '/tasks', icon: <FiList /> },
    { name: 'Analytics', path: '/analytics', icon: <FiBarChart2 /> },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Mobile Top Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 md:hidden">
        <div className="px-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 dark:text-gray-400 focus:outline-none"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
            TaskFlow
          </Link>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 dark:text-gray-400 relative">
              <FiBell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white ring-offset-2 ring-offset-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {getUserInitials()}
            </button>
          </div>
        </div>

        {/* Mobile Profile Dropdown */}
        {profileDropdownOpen && (
          <div className="absolute right-4 z-50 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <p className="font-medium">{user?.name || 'User'}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 truncate">{user?.email || 'user@example.com'}</p>
            </div>
            <button
              onClick={handleProfileClick}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiUser className="inline-block mr-2" size={16} />
              Your Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiLogOut className="inline-block mr-2" size={16} />
              Log Out
            </button>
          </div>
        )}
      </header>
      
      {/* Sidebar (Mobile Drawer or Desktop Sidebar) */}
      <div className="flex flex-1 overflow-hidden">
        <motion.aside 
          className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          initial={{ x: '-100%' }}
          animate={{ x: sidebarOpen || window.innerWidth >= 768 ? 0 : '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Sidebar Header - only show on desktop */}
          <div className="hidden md:flex p-4 items-center border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              TaskFlow
            </Link>
          </div>
          
          {/* Navigation Links */}
          <nav className="mt-5 px-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={toggleDarkMode}
                className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                {darkMode ? (
                  <>
                    <FiSun className="mr-3" /> Light Mode
                  </>
                ) : (
                  <>
                    <FiMoon className="mr-3" /> Dark Mode
                  </>
                )}
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <FiLogOut className="mr-3" /> Log Out
            </button>
          </div>
        </motion.aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="hidden md:flex justify-end mb-6">
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 dark:text-gray-400 relative">
                <FiBell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </button>
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
                >
                  <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                    {getUserInitials()}
                  </div>
                  <FiChevronDown className={`ml-1 h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Desktop Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium">{user?.name || 'User'}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiUser className="inline-block mr-2" size={16} />
                      Your Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut className="inline-block mr-2" size={16} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Outlet />
        </main>
      </div>
      
      {/* Overlay when mobile sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout; 
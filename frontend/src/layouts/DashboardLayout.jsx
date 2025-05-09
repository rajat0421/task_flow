import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiMenu, FiX, FiHome, FiList, FiBarChart2, 
  FiUser, FiLogOut, FiMoon, FiSun, FiBell
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  
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
            <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
              U
            </div>
          </div>
        </div>
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
              onClick={logout}
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
              <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                U
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
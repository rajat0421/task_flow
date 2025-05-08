import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiUser, FiSettings, FiLogOut, FiCheck, FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

export default function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Task deadline approaching',
      message: 'Project proposal is due in 2 days',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'New task assigned',
      message: 'You have been assigned a new task by Admin',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      title: 'Task completed',
      message: 'Website redesign task has been completed',
      time: '3 days ago',
      read: true
    }
  ]);
  
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    dispatch(logout());
    window.location = '/login';
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                TaskFlow
              </div>
              <div className="ml-10 hidden md:flex space-x-6">
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Dashboard
                </Link>
                <Link to="/tasks" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Tasks
                </Link>
                <Link to="/analytics" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Analytics
                </Link>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Quick add button */}
              <button
                className="p-1 mr-4 bg-indigo-50 dark:bg-indigo-900 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiPlus className="h-5 w-5" />
              </button>
            
              {/* Notification dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                >
                  <FiBell className="h-5 w-5 sm:h-6 sm:w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {isNotificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 z-50">
                    <div className="py-2 px-4 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center"
                        >
                          <FiCheck className="mr-1" /> Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                          No notifications
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${notification.read ? 'opacity-70' : ''}`}
                          >
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-indigo-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="py-2 px-4">
                      <Link to="/notifications" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 block text-center">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile dropdown */}
              <div className="ml-3 relative" ref={profileRef}>
                <div>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      JD
                    </div>
                  </button>
                </div>
                
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">john.doe@example.com</p>
                    </div>
                    
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                      <FiUser className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Your Profile
                    </Link>
                    
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                      <FiSettings className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <FiLogOut className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 
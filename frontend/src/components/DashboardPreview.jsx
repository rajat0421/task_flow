import React from 'react';
import { motion } from 'framer-motion';

const DashboardPreview = () => {
  return (
    <div className="relative">
      {/* Decorative elements */}
      <motion.div 
        className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -bottom-10 -right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          delay: 2,
          ease: "easeInOut"
        }}
      />
      
      {/* Dashboard preview image */}
      <motion.div 
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ rotate: 1 }}
        whileHover={{ rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3"></div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold text-gray-800 dark:text-white">Dashboard</div>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-md w-3/4"></div>
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                className="h-20 bg-gray-100 dark:bg-gray-700 rounded-md"
                whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              />
              <motion.div 
                className="h-20 bg-gray-100 dark:bg-gray-700 rounded-md"
                whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                transition={{ delay: 0.05 }}
              />
              <motion.div 
                className="h-20 bg-gray-100 dark:bg-gray-700 rounded-md"
                whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                transition={{ delay: 0.1 }}
              />
              <motion.div 
                className="h-20 bg-gray-100 dark:bg-gray-700 rounded-md"
                whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                transition={{ delay: 0.15 }}
              />
            </div>
            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPreview; 
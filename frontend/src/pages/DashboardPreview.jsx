import { motion } from 'framer-motion';

export default function DashboardPreview() {
  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      {/* Dashboard preview image */}
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ rotate: 1 }}
        whileHover={{ rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3" />
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold text-gray-800 dark:text-white">Dashboard</div>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-md w-3/4" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-md" />
              <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-md" />
              <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-md" />
              <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-md" />
            </div>
            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-md" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
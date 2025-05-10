import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBarChart2, FiTrendingUp, FiTrendingDown, 
  FiCheck, FiClock, FiAlertCircle, FiCalendar, FiList
} from 'react-icons/fi';
import { getAllTasks } from '../services/tasks';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
//import DebugAuthStatus from '../components/DebugAuthStatus';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  PointElement, 
  LineElement
);

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'
  const [showDebug, setShowDebug] = useState(false);
  
  // Summary statistics
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
    averageCompletionTime: 0
  });

  // Chart data
  const [statusData, setStatusData] = useState({
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(34, 197, 94, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(107, 114, 128, 0.7)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(107, 114, 128, 1)'
      ],
      borderWidth: 1,
    }]
  });

  const [priorityData, setPriorityData] = useState({
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(34, 197, 94, 0.7)',
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(34, 197, 94, 1)',
      ],
      borderWidth: 1,
    }]
  });

  const [weeklyData, setWeeklyData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Tasks Completed',
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      tension: 0.4,
    }]
  });

  const [productivityData, setProductivityData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Tasks Created',
        data: [],
        backgroundColor: 'rgba(59, 130, 246, 0.4)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Tasks Completed',
        data: [],
        backgroundColor: 'rgba(34, 197, 94, 0.4)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        fill: true,
      },
    ]
  });
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  useEffect(() => {
    if (tasks.length > 0) {
      calculateStatistics();
    }
  }, [tasks, dateRange]);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      
      // Handle the new response format that includes owned and shared tasks
      let taskList = [];
      if (data.owned && data.shared) {
        // Combine owned and shared tasks into a single list
        taskList = [...data.owned, ...data.shared];
        console.log('Analytics: Tasks loaded successfully', { 
          owned: data.owned.length, 
          shared: data.shared.length,
          total: taskList.length
        });
      } else {
        // Fallback for backwards compatibility
        taskList = data;
        console.log('Analytics: Using fallback task format');
      }
      
      setTasks(taskList);
      calculateStatistics(taskList);
      setError(null);
    } catch (err) {
      console.error('Analytics: Error fetching tasks:', err);
      // More detailed error logging
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Status:', err.response.status);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error details:', err.message);
      }
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateStatistics = (taskData = tasks) => {
    if (!taskData || taskData.length === 0) {
      // Set default values for empty state
      setSummary({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0,
        completionRate: 0,
        averageCompletionTime: 0
      });
      
      // Also reset chart data
      setStatusData({
        ...statusData,
        datasets: [{...statusData.datasets[0], data: [0, 0, 0]}]
      });
      
      setPriorityData({
        ...priorityData,
        datasets: [{...priorityData.datasets[0], data: [0, 0, 0]}]
      });
      
      const monthLabels = getLastSixMonths();
      setProductivityData({
        labels: monthLabels,
        datasets: [
          {...productivityData.datasets[0], data: Array(6).fill(0)},
          {...productivityData.datasets[1], data: Array(6).fill(0)}
        ]
      });
      
      return;
    }

    const now = new Date();
    
    // Filter tasks based on date range
    let filteredTasks = [];
    if (dateRange === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filteredTasks = taskData.filter(task => new Date(task.createdAt) >= oneWeekAgo);
    } else if (dateRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filteredTasks = taskData.filter(task => new Date(task.createdAt) >= oneMonthAgo);
    } else {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      filteredTasks = taskData.filter(task => new Date(task.createdAt) >= oneYearAgo);
    }
    
    const completed = filteredTasks.filter(task => task.status === 'completed');
    const inProgress = filteredTasks.filter(task => task.status === 'in-progress');
    const pending = filteredTasks.filter(task => task.status === 'pending');
    const overdue = filteredTasks.filter(task => 
      task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < now
    );
    
    // Calculate completion rate
    const completionRate = filteredTasks.length > 0 
      ? Math.round((completed.length / filteredTasks.length) * 100) 
      : 0;
    
    // Calculate average completion time (in days)
    let totalCompletionDays = 0;
    let tasksWithCompletionTime = 0;
    
    completed.forEach(task => {
      if (task.updatedAt && task.createdAt) {
        const createdDate = new Date(task.createdAt);
        const completedDate = new Date(task.updatedAt);
        const timeDiff = completedDate.getTime() - createdDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert to days
        
        if (daysDiff >= 0) {
          totalCompletionDays += daysDiff;
          tasksWithCompletionTime++;
        }
      }
    });
    
    const averageCompletionTime = tasksWithCompletionTime > 0 
      ? Math.round((totalCompletionDays / tasksWithCompletionTime) * 10) / 10 
      : 0;
    
    setSummary({
      total: filteredTasks.length,
      completed: completed.length,
      inProgress: inProgress.length,
      pending: pending.length,
      overdue: overdue.length,
      completionRate,
      averageCompletionTime
    });

    // Update status chart data
    setStatusData({
      ...statusData,
      datasets: [{
        ...statusData.datasets[0], 
        data: [completed.length, inProgress.length, pending.length]
      }]
    });

    // Update priority chart data
    const highPriority = filteredTasks.filter(task => task.priority === 'high').length;
    const mediumPriority = filteredTasks.filter(task => task.priority === 'medium').length;
    const lowPriority = filteredTasks.filter(task => task.priority === 'low').length;
    
    setPriorityData({
      ...priorityData,
      datasets: [{
        ...priorityData.datasets[0], 
        data: [highPriority, mediumPriority, lowPriority]
      }]
    });

    // Calculate weekly completion data
    const weeklyCompletionData = calculateWeeklyCompletionData(completed);
    setWeeklyData({
      ...weeklyData,
      datasets: [{
        ...weeklyData.datasets[0],
        data: weeklyCompletionData
      }]
    });

    // Calculate productivity trend data
    const productivityTrendData = calculateProductivityTrend(taskData);
    setProductivityData(productivityTrendData);
  };

  // Calculate weekly completion data
  const calculateWeeklyCompletionData = (completedTasks) => {
    const completionByDay = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    
    // Get tasks completed in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentlyCompletedTasks = completedTasks.filter(task => 
      task.updatedAt && new Date(task.updatedAt) >= oneWeekAgo
    );
    
    // Group by day of week
    recentlyCompletedTasks.forEach(task => {
      const completedDate = new Date(task.updatedAt);
      const dayOfWeek = completedDate.getDay(); // 0 = Sunday, 6 = Saturday
      completionByDay[dayOfWeek]++;
    });
    
    // Reorder to start with Monday
    return [...completionByDay.slice(1), completionByDay[0]];
  };

  // Get labels for the last six months
  const getLastSixMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(month.toLocaleString('default', { month: 'short' }));
    }
    return months;
  };

  // Calculate productivity trend data
  const calculateProductivityTrend = (taskData) => {
    const monthLabels = getLastSixMonths();
    const createdByMonth = Array(6).fill(0);
    const completedByMonth = Array(6).fill(0);
    
    const now = new Date();
    
    taskData.forEach(task => {
      if (task.createdAt) {
        const createdDate = new Date(task.createdAt);
        const monthsDiff = (now.getFullYear() - createdDate.getFullYear()) * 12 + 
                           (now.getMonth() - createdDate.getMonth());
        
        if (monthsDiff >= 0 && monthsDiff < 6) {
          const monthIndex = 5 - monthsDiff;
          createdByMonth[monthIndex]++;
          
          // If the task is completed, increment completed count
          if (task.status === 'completed' && task.updatedAt) {
            const completedDate = new Date(task.updatedAt);
            const completedMonthsDiff = (now.getFullYear() - completedDate.getFullYear()) * 12 + 
                                       (now.getMonth() - completedDate.getMonth());
            
            if (completedMonthsDiff >= 0 && completedMonthsDiff < 6) {
              const completedMonthIndex = 5 - completedMonthsDiff;
              completedByMonth[completedMonthIndex]++;
            }
          }
        }
      }
    });
    
    return {
      labels: monthLabels,
      datasets: [
        {
          label: 'Tasks Created',
          data: createdByMonth,
          backgroundColor: 'rgba(59, 130, 246, 0.4)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          fill: true,
        },
        {
          label: 'Tasks Completed',
          data: completedByMonth,
          backgroundColor: 'rgba(34, 197, 94, 0.4)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          fill: true,
        }
      ]
    };
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Completion Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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

  // Empty state component
  const EmptyState = ({ message, icon }) => (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
      {icon}
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Debug section */}
        <div className="flex justify-end">
          <button 
            onClick={() => setShowDebug(!showDebug)} 
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>
        
        {showDebug && <DebugAuthStatus />}
        
        {/* Error message with retry button */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <FiAlertCircle className="text-red-500 dark:text-red-400 h-8 w-8 mb-2" />
          <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
        
        {/* Rest of your Analytics UI */}
        
      </motion.div>
    );
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Debug section */}
      <div className="flex justify-end">
        <button 
          onClick={() => setShowDebug(!showDebug)} 
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
      </div>
      
      {showDebug && <DebugAuthStatus />}
      
      {/* Header */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View detailed analytics about your tasks and productivity
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setDateRange('week')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  dateRange === 'week'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setDateRange('month')}
                className={`px-4 py-2 text-sm font-medium border-t border-b ${
                  dateRange === 'month'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setDateRange('year')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                  dateRange === 'year'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Year
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Summary Stats */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {/* Completion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
              <FiCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{summary.completionRate}%</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${summary.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Average Completion Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
              <FiClock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion Time</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {summary.averageCompletionTime} <span className="text-sm font-normal">days</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Tasks In Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
              <FiTrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {summary.inProgress} <span className="text-sm font-normal">tasks</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Overdue Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-4">
              <FiAlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {summary.overdue} <span className="text-sm font-normal">tasks</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Status Distribution</h2>
          <div className="h-72">
            {summary.total > 0 ? (
              <Pie data={statusData} />
            ) : (
              <EmptyState 
                message="No tasks found. Create tasks to see status distribution." 
                icon={<FiBarChart2 className="h-10 w-10 opacity-40" />} 
              />
            )}
          </div>
        </motion.div>
        
        {/* Priority Distribution Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Priority Distribution</h2>
          <div className="h-72">
            {summary.total > 0 ? (
              <Pie data={priorityData} />
            ) : (
              <EmptyState 
                message="No tasks found. Create tasks to see priority distribution." 
                icon={<FiBarChart2 className="h-10 w-10 opacity-40" />} 
              />
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        {/* Productivity Trend */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Productivity Trend</h2>
          <div className="h-80">
            {productivityData.datasets[0].data.some(value => value > 0) ? (
              <Line options={lineOptions} data={productivityData} />
            ) : (
              <EmptyState 
                message="No data available for productivity trend. Start creating tasks!" 
                icon={<FiBarChart2 className="h-10 w-10 opacity-40" />} 
              />
            )}
          </div>
        </motion.div>
        
        {/* Weekly Task Completion */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly Task Completion</h2>
          <div className="h-72">
            {weeklyData.datasets[0].data.some(value => value > 0) ? (
              <Bar 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Weekly Task Completion',
                    },
                  },
                }} 
                data={weeklyData} 
              />
            ) : (
              <EmptyState 
                message="No tasks completed this week. Complete tasks to see weekly stats." 
                icon={<FiBarChart2 className="h-10 w-10 opacity-40" />} 
              />
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Task Distribution */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Status Breakdown</h2>
        
        {summary.total > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: 'Completed Tasks', 
                count: summary.completed, 
                percentage: summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0,
                color: 'bg-green-500' 
              },
              { 
                title: 'In Progress Tasks', 
                count: summary.inProgress, 
                percentage: summary.total > 0 ? Math.round((summary.inProgress / summary.total) * 100) : 0,
                color: 'bg-blue-500' 
              },
              { 
                title: 'Pending Tasks', 
                count: summary.pending, 
                percentage: summary.total > 0 ? Math.round((summary.pending / summary.total) * 100) : 0,
                color: 'bg-gray-500' 
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">{item.title}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                  <div 
                    className={`${item.color} h-2.5 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.count}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            message="No tasks found. Create tasks to see status breakdown." 
            icon={<FiList className="h-10 w-10 opacity-40" />} 
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Analytics; 
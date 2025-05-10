import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiPlus, FiList, FiClock, FiCheckCircle, 
  FiAlertCircle, FiBarChart2, FiArrowUp, FiArrowDown 
} from 'react-icons/fi';
import { getAllTasks } from '../services/tasks';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
//import DebugAuthStatus from '../components/DebugAuthStatus';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0
  });
  const [priorityStats, setPriorityStats] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({
    labels: [],
    data: []
  });
  const [productivityScore, setProductivityScore] = useState({
    score: 0,
    change: 0
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      
      // Handle the new response format that includes owned and shared tasks
      if (data.owned && data.shared) {
        const allTasks = [...data.owned, ...data.shared];
        setTasks(allTasks);
        // Calculate stats
        calculateStatistics(allTasks);
      } else {
        // Fallback for backwards compatibility
        setTasks(data);
        // Calculate stats
        calculateStatistics(data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const calculateStatistics = (taskData) => {
    if (!taskData || taskData.length === 0) {
      // Set default empty values for all stats
      setStats({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0
      });
      setPriorityStats([
        { priority: 'High', count: 0, percentage: 0 },
        { priority: 'Medium', count: 0, percentage: 0 },
        { priority: 'Low', count: 0, percentage: 0 },
      ]);
      setWeeklyStats({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [0, 0, 0, 0, 0, 0, 0]
      });
      setProductivityScore({
        score: 0,
        change: 0
      });
      return;
    }

    const now = new Date();
    const completed = taskData.filter(task => task.status === 'completed').length;
    const inProgress = taskData.filter(task => task.status === 'in-progress').length;
    const pending = taskData.filter(task => task.status === 'pending').length;
    const overdue = taskData.filter(task => {
      return task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < now;
    }).length;
    
    setStats({
      total: taskData.length,
      completed,
      inProgress,
      pending,
      overdue
    });

    // Calculate priority breakdown
    const highPriority = taskData.filter(task => task.priority === 'high').length;
    const mediumPriority = taskData.filter(task => task.priority === 'medium').length;
    const lowPriority = taskData.filter(task => task.priority === 'low').length;
    
    setPriorityStats([
      { 
        priority: 'High', 
        count: highPriority, 
        percentage: taskData.length > 0 ? Math.round((highPriority / taskData.length) * 100) : 0 
      },
      { 
        priority: 'Medium', 
        count: mediumPriority, 
        percentage: taskData.length > 0 ? Math.round((mediumPriority / taskData.length) * 100) : 0 
      },
      { 
        priority: 'Low', 
        count: lowPriority, 
        percentage: taskData.length > 0 ? Math.round((lowPriority / taskData.length) * 100) : 0 
      },
    ]);

    // Calculate weekly completion data
    const weeklyData = calculateWeeklyCompletion(taskData);
    setWeeklyStats(weeklyData);

    // Calculate productivity score
    const prodScore = calculateProductivityScore(taskData);
    setProductivityScore(prodScore);
  };

  // Function to calculate weekly task completion
  const calculateWeeklyCompletion = (taskData) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const completionByDay = [0, 0, 0, 0, 0, 0, 0];
    
    // Get only completed tasks with completion dates (updatedAt)
    const completedTasks = taskData.filter(task => task.status === 'completed' && task.updatedAt);
    
    // Get tasks completed in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentCompletedTasks = completedTasks.filter(task => 
      new Date(task.updatedAt) >= oneWeekAgo
    );
    
    // Group by day of week
    recentCompletedTasks.forEach(task => {
      const completionDate = new Date(task.updatedAt);
      const dayOfWeek = completionDate.getDay(); // 0 = Sunday, 6 = Saturday
      completionByDay[dayOfWeek]++;
    });
    
    // Reorder to start with Monday
    const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const orderedData = [...completionByDay.slice(1), completionByDay[0]];
    
    return {
      labels: orderedDays,
      data: orderedData
    };
  };

  // Function to calculate productivity score
  const calculateProductivityScore = (taskData) => {
    // If no tasks, return zeros
    if (taskData.length === 0) {
      return { score: 0, change: 0 };
    }
    
    // Base calculation: completed tasks / total tasks
    const completionRate = taskData.filter(task => task.status === 'completed').length / taskData.length;
    
    // Calculate on-time completion rate
    const onTimeCompletions = taskData.filter(task => {
      if (task.status !== 'completed' || !task.dueDate || !task.updatedAt) return false;
      const dueDate = new Date(task.dueDate);
      const completionDate = new Date(task.updatedAt);
      return completionDate <= dueDate;
    }).length;
    
    const taskWithDueDates = taskData.filter(task => task.dueDate).length;
    const onTimeRate = taskWithDueDates > 0 ? onTimeCompletions / taskWithDueDates : 0;
    
    // Calculate productivity trend (compare with last week)
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const tasksCompletedLastWeek = taskData.filter(task => {
      if (task.status !== 'completed' || !task.updatedAt) return false;
      const completionDate = new Date(task.updatedAt);
      return completionDate >= oneWeekAgo && completionDate <= now;
    }).length;
    
    const tasksCompletedPreviousWeek = taskData.filter(task => {
      if (task.status !== 'completed' || !task.updatedAt) return false;
      const completionDate = new Date(task.updatedAt);
      return completionDate >= twoWeeksAgo && completionDate < oneWeekAgo;
    }).length;
    
    // Calculate percentage change
    let percentageChange = 0;
    if (tasksCompletedPreviousWeek > 0) {
      percentageChange = Math.round(((tasksCompletedLastWeek - tasksCompletedPreviousWeek) / tasksCompletedPreviousWeek) * 100);
    } else if (tasksCompletedLastWeek > 0) {
      percentageChange = 100; // If there were no tasks before but there are now, 100% increase
    }
    
    // Calculate final score (weighted average)
    // 60% completion rate, 40% on-time rate
    const score = Math.round((completionRate * 0.6 + onTimeRate * 0.4) * 100);
    
    return {
      score,
      change: percentageChange
    };
  };

  // Chart data for status distribution
  const statusChartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [stats.completed, stats.inProgress, stats.pending],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // green
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(107, 114, 128, 0.8)' // gray
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(107, 114, 128, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for weekly task completion
  const weeklyChartData = {
    labels: weeklyStats.labels,
    datasets: [
      {
        label: 'Tasks Completed',
        data: weeklyStats.data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  // Chart options
  const barOptions = {
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
  };

  // Container animation
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

  // Item animation
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
      <div className="h-full flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <FiAlertCircle className="text-red-500 h-12 w-12 mb-4" />
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

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
      {error && (
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
      )}

      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome back!</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Here's an overview of your tasks and progress
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/tasks"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              New Task
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
              <FiList className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        {/* Completed Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
              <FiCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        {/* In Progress Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
              <FiClock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.inProgress}</p>
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
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Status Distribution</h2>
          <div className="h-64">
            {stats.total > 0 ? (
              <Pie data={statusChartData} />
            ) : (
              <EmptyState 
                message="No tasks found. Create tasks to see status distribution." 
                icon={<FiBarChart2 className="h-10 w-10 opacity-40" />} 
              />
            )}
          </div>
        </motion.div>
        
        {/* Weekly Progress Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly Progress</h2>
          <div className="h-64">
            {weeklyStats.data.some(value => value > 0) ? (
              <Bar options={barOptions} data={weeklyChartData} />
            ) : (
              <EmptyState 
                message="No completed tasks in the past week." 
                icon={<FiBarChart2 className="h-10 w-10 opacity-40" />} 
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Tasks Section */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Tasks</h2>
          <Link 
            to="/tasks" 
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.slice(0, 5).map((task) => (
                <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {task.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : task.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {task.priority === 'high' && <FiArrowUp className="h-3 w-3 mr-1" />}
                      {task.priority === 'low' && <FiArrowDown className="h-3 w-3 mr-1" />}
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {task.dueDate 
                      ? new Date(task.dueDate).toLocaleDateString() 
                      : 'No due date'}
                  </td>
                </tr>
              ))}
              
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No tasks found. Create your first task!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Task Priority Section */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Priority Breakdown</h2>
        
        {stats.total > 0 ? (
          <div className="space-y-4">
            {priorityStats.map((item) => (
              <div key={item.priority} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.priority} Priority
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.count} tasks ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      item.priority === 'High' 
                        ? 'bg-red-500' 
                        : item.priority === 'Medium' 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`} 
                    style={{ width: `${item.percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            message="No tasks found. Create tasks to see priority breakdown." 
            icon={<FiList className="h-10 w-10 opacity-40" />} 
          />
        )}
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/tasks"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Task Board</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your tasks</p>
          </div>
          <FiList className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
        </Link>
        
        <Link
          to="/analytics"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Analytics</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">View detailed reports</p>
          </div>
          <FiBarChart2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
        </Link>
        
        <div className="bg-primary-600 dark:bg-primary-800 rounded-lg shadow-sm p-6 text-white">
          <h3 className="text-lg font-medium">Productivity Score</h3>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-3xl font-bold">{productivityScore.score}%</span>
            {productivityScore.score > 0 && (
              <span className="text-primary-200 text-sm flex items-center">
                {productivityScore.change >= 0 ? (
                  <>
                    <FiArrowUp className="h-4 w-4 mr-1" />
                    {Math.abs(productivityScore.change)}% from last week
                  </>
                ) : (
                  <>
                    <FiArrowDown className="h-4 w-4 mr-1" />
                    {Math.abs(productivityScore.change)}% from last week
                  </>
                )}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard; 
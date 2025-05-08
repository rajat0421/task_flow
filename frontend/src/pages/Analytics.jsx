import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiArrowUp, FiArrowDown, FiCheck, FiClock, FiFlag, FiCalendar } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import API from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('week'); // week, month, year
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
    completionRate: 0,
    weeklyTasksCreated: [],
    weeklyTasksCompleted: [],
    tasksByPriority: { high: 0, medium: 0, low: 0 },
    tasksByStatus: { pending: 0, 'in-progress': 0, completed: 0 }
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      calculateStats();
    }
  }, [tasks, dateRange]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    
    // Basic counts
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    
    // Calculate overdue tasks
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      return new Date(task.dueDate) < now;
    }).length;
    
    // Calculate completion rate
    const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
    
    // Group tasks by priority
    const tasksByPriority = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low' || !task.priority).length
    };
    
    // Group tasks by status
    const tasksByStatus = {
      pending: pending,
      'in-progress': inProgress,
      completed: completed
    };
    
    // Time series data calculation based on date range
    let timeLabels = [];
    let tasksCreated = [];
    let tasksCompleted = [];
    
    const getDatesInRange = () => {
      const dates = [];
      const endDate = new Date();
      let startDate;
      
      if (dateRange === 'week') {
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          dates.push(date);
        }
        return dates;
      } else if (dateRange === 'month') {
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 30);
        
        for (let i = 0; i < 10; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + (i * 3)); // Every 3 days
          dates.push(date);
        }
        return dates;
      } else if (dateRange === 'year') {
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 12);
        
        for (let i = 0; i < 12; i++) {
          const date = new Date(startDate);
          date.setMonth(startDate.getMonth() + i);
          dates.push(date);
        }
        return dates;
      }
    };
    
    const formatDateLabel = (date) => {
      if (dateRange === 'week') {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (dateRange === 'month') {
        return `${date.getMonth() + 1}/${date.getDate()}`;
      } else if (dateRange === 'year') {
        return date.toLocaleDateString('en-US', { month: 'short' });
      }
    };
    
    const dates = getDatesInRange();
    timeLabels = dates.map(date => formatDateLabel(date));
    
    tasksCreated = dates.map(date => {
      return tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        if (dateRange === 'week' || dateRange === 'month') {
          return taskDate.getDate() === date.getDate() && 
                 taskDate.getMonth() === date.getMonth() &&
                 taskDate.getFullYear() === date.getFullYear();
        } else if (dateRange === 'year') {
          return taskDate.getMonth() === date.getMonth() &&
                 taskDate.getFullYear() === date.getFullYear();
        }
      }).length;
    });
    
    tasksCompleted = dates.map(date => {
      return tasks.filter(task => {
        if (task.status !== 'completed') return false;
        // We're assuming the completion date is when the status was updated to completed
        // In a real app, you'd have a separate field for completedAt
        const taskDate = new Date(task.updatedAt);
        if (dateRange === 'week' || dateRange === 'month') {
          return taskDate.getDate() === date.getDate() && 
                 taskDate.getMonth() === date.getMonth() &&
                 taskDate.getFullYear() === date.getFullYear();
        } else if (dateRange === 'year') {
          return taskDate.getMonth() === date.getMonth() &&
                 taskDate.getFullYear() === date.getFullYear();
        }
      }).length;
    });
    
    setStats({
      total: tasks.length,
      completed,
      pending,
      inProgress,
      overdue,
      completionRate,
      weeklyTasksCreated: tasksCreated,
      weeklyTasksCompleted: tasksCompleted,
      weeklyLabels: timeLabels,
      tasksByPriority,
      tasksByStatus
    });
  };
  
  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151',
        }
      },
      title: {
        display: false
      },
    },
    scales: {
      x: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 1,
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151',
        }
      }
    }
  };
  
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151',
          padding: 20
        }
      }
    },
    cutout: '65%'
  };
  
  // Chart data
  const taskProgressData = {
    labels: stats.weeklyLabels,
    datasets: [
      {
        label: 'Tasks Created',
        data: stats.weeklyTasksCreated,
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.3
      },
      {
        label: 'Tasks Completed',
        data: stats.weeklyTasksCompleted,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3
      }
    ]
  };
  
  const tasksByPriorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [
          stats.tasksByPriority.high,
          stats.tasksByPriority.medium,
          stats.tasksByPriority.low
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(34, 197, 94, 0.7)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const tasksByStatusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          stats.tasksByStatus.pending,
          stats.tasksByStatus['in-progress'],
          stats.tasksByStatus.completed
        ],
        backgroundColor: [
          'rgba(251, 191, 36, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)'
        ],
        borderColor: [
          'rgba(251, 191, 36, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your productivity and task completion trends
          </p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-800 dark:text-red-300" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Time Range Selector */}
        <div className="mb-6 flex justify-end">
          <div className="inline-flex shadow-sm rounded-md">
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                dateRange === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 text-sm font-medium ${
                dateRange === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                dateRange === 'year'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-center">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
              <FiCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h2>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <FiArrowUp className="h-5 w-5 sm:h-6 sm:w-6 mr-1" /> 12%
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-center">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
              <FiClock className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</h2>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <FiArrowUp className="h-5 w-5 sm:h-6 sm:w-6 mr-1" /> 4%
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-center">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
              <FiFlag className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</h2>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
                <span className="ml-2 text-xs font-medium text-red-600 dark:text-red-400 flex items-center">
                  <FiArrowDown className="h-5 w-5 sm:h-6 sm:w-6 mr-1" /> 2%
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-center">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
              <FiCalendar className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h2>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <FiArrowUp className="h-5 w-5 sm:h-6 sm:w-6 mr-1" /> 8%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Progress Over Time</h3>
            <div className="h-80">
              <Line options={lineChartOptions} data={taskProgressData} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tasks by Priority</h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut options={doughnutChartOptions} data={tasksByPriorityData} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tasks by Status</h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut options={doughnutChartOptions} data={tasksByStatusData} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.slice(0, 5).map((task, index) => (
              <div key={index} className="px-5 py-4">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm">
                    JD
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.status === 'completed' ? 'Completed' : 'Updated'} task: {task.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(task.updatedAt || Date.now()).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 
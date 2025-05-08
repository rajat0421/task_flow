import { useState, useEffect } from 'react';
import { FiList, FiGrid, FiPieChart } from 'react-icons/fi';
import API from '../services/api';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import NewTaskForm from '../components/NewTaskForm';
import TaskFilters from '../components/TaskFilters';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    searchTerm: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    highPriority: 0
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [tasks]);

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
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const highPriority = tasks.filter(task => task.priority === 'high').length;

    setStats({
      total: tasks.length,
      completed,
      inProgress,
      pending,
      highPriority
    });
  };

  const handleCreateTask = async (newTask) => {
    try {
      setError('');
      const { data } = await API.post('/tasks', newTask);
      setTasks([...tasks, data]);
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError('');
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    
    // Filter by priority
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm && !task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !task.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-indigo-600 text-white p-4 rounded-lg mb-6 shadow-lg">
        <h2 className="text-xl font-bold">Welcome to the new TaskFlow Dashboard!</h2>
        <p>We've made significant improvements to help you manage your tasks more efficiently.</p>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your tasks efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <FiList className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <FiPieChart className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <FiGrid className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
              <FiList className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.highPriority}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Filters */}
      <TaskFilters filters={filters} setFilters={setFilters} />

      {/* New Task Form */}
      <NewTaskForm onSubmit={handleCreateTask} />

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-800 dark:text-red-300" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* View Mode Selector */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Your Tasks {filteredTasks.length > 0 && `(${filteredTasks.length})`}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 sm:p-3 min-h-[40px] sm:min-h-[44px] rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}
            title="List view"
          >
            <FiList className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 sm:p-3 min-h-[40px] sm:min-h-[44px] rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}
            title="Grid view"
          >
            <FiGrid className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* Tasks Display */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No tasks found. Create one!</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          ))}
        </div>
      )}
    </Layout>
  );
} 
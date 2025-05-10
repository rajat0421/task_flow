import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  FiPlus, FiFilter, FiCheckCircle, FiClock, 
  FiClipboard, FiCalendar, FiX, FiArrowUp, 
  FiArrowDown, FiEdit, FiTrash2, FiAlertCircle
} from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/tasks';
import { toast } from 'react-toastify';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: null
  });
  
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTasks();
      setTasks(data);
      console.log('Tasks loaded successfully:', data.length);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // More detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error details:', error.message);
      }
      setError('Failed to load tasks. Please try again.');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    // Find the moved task
    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;
    
    // Update task status based on destination column
    const newStatus = destination.droppableId;
    if (newStatus !== task.status) {
      try {
        await updateTask(task._id, { ...task, status: newStatus });
        
        // Update local state
        setTasks(tasks.map(t => 
          t._id === task._id ? { ...t, status: newStatus } : t
        ));
        
        toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
      } catch (error) {
        console.error('Error updating task status:', error);
        toast.error('Failed to update task status');
      }
    }
  };
  
  const handleCreateTask = async () => {
    try {
      if (!newTask.title.trim()) {
        toast.error('Task title is required');
        return;
      }
      
      // Convert date to ISO string only if a date exists
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate instanceof Date ? newTask.dueDate.toISOString() : null
      };
      
      const createdTask = await createTask(taskData);
      setTasks([...tasks, createdTask]);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: null
      });
      
      setIsModalOpen(false);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };
  
  const handleUpdateTask = async () => {
    try {
      if (!editingTask._id || !editingTask.title.trim()) {
        toast.error('Task title is required');
        return;
      }
      
      // Properly handle the date
      const taskData = {
        ...editingTask,
        dueDate: editingTask.dueDate instanceof Date ? editingTask.dueDate.toISOString() : editingTask.dueDate
      };
      
      const updatedTask = await updateTask(editingTask._id, taskData);
      
      setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
      setEditingTask(null);
      setIsModalOpen(false);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };
  
  const openEditModal = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    });
    setIsModalOpen(true);
  };
  
  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };
  
  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditingTask(prev => ({ ...prev, [name]: value }));
    } else {
      setNewTask(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleDateChange = (date, isEdit = false) => {
    if (isEdit) {
      setEditingTask(prev => ({ ...prev, dueDate: date }));
    } else {
      setNewTask(prev => ({ ...prev, dueDate: date }));
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
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
    
    // Filter by search text
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !task.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Group tasks by status
  const tasksByStatus = {
    'pending': filteredTasks.filter(task => task.status === 'pending'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    'completed': filteredTasks.filter(task => task.status === 'completed')
  };
  
  const getTaskBgColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 dark:bg-green-600';
      case 'in-progress':
        return 'bg-blue-500 dark:bg-blue-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 dark:text-red-400';
      case 'medium':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'low':
        return 'text-green-500 dark:text-green-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };
  
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FiArrowUp className="h-4 w-4" />;
      case 'low':
        return <FiArrowDown className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
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
      className="space-y-6"
    >      
      {/* Show error toast with retry button */}
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
      
      {/* Header with filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Task Board</h1>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Add Task
            </button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="col-span-1 sm:col-span-2">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search tasks..."
                className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full py-2 pl-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full py-2 pl-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Task Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="col-span-1">
              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden h-full flex flex-col`}>
                <div className={`p-4 flex items-center ${getTaskBgColor(status)} text-white`}>
                  <span className="font-medium">
                    {status === 'pending' && 'To Do'}
                    {status === 'in-progress' && 'In Progress'}
                    {status === 'completed' && 'Completed'}
                  </span>
                  <span className="ml-2 bg-white bg-opacity-30 text-white text-xs font-medium rounded-full px-2 py-0.5">
                    {statusTasks.length}
                  </span>
                </div>
                
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className="flex-1 p-4 overflow-y-auto min-h-[300px]"
                    >
                      {statusTasks.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                          No tasks in this column
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {statusTasks.map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 border-l-4 ${
                                    task.priority === 'high' 
                                      ? 'border-red-500' 
                                      : task.priority === 'medium' 
                                      ? 'border-yellow-500' 
                                      : 'border-green-500'
                                  } ${
                                    snapshot.isDragging 
                                      ? 'shadow-lg dark:shadow-xl' 
                                      : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                      {task.title}
                                    </h3>
                                    <div className="flex space-x-2">
                                      <button 
                                        onClick={() => openEditModal(task)}
                                        className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                                      >
                                        <FiEdit className="h-4 w-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteTask(task._id)}
                                        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                      >
                                        <FiTrash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {task.description && (
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                  
                                  <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className={`flex items-center ${getPriorityColor(task.priority)}`}>
                                        {getPriorityIcon(task.priority)}
                                        <span className="text-xs ml-1">
                                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </span>
                                      </div>
                                      
                                      {task.dueDate && (
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                          <FiCalendar className="h-3 w-3 mr-1" />
                                          <span className="text-xs">
                                            {new Date(task.dueDate).toLocaleDateString()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </DragDropContext>
      </div>
      
      {/* Create/Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50"
            >
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {editingTask ? 'Edit Task' : 'Create New Task'}
                    </h3>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title*
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={editingTask ? editingTask.title : newTask.title}
                          onChange={(e) => handleInputChange(e, !!editingTask)}
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="Task Title"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          rows="3"
                          value={editingTask ? editingTask.description : newTask.description}
                          onChange={(e) => handleInputChange(e, !!editingTask)}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="Task Description"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Status
                        </label>
                        <select
                          name="status"
                          id="status"
                          value={editingTask ? editingTask.status : newTask.status}
                          onChange={(e) => handleInputChange(e, !!editingTask)}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                        >
                          <option value="pending">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Priority
                        </label>
                        <select
                          name="priority"
                          id="priority"
                          value={editingTask ? editingTask.priority : newTask.priority}
                          onChange={(e) => handleInputChange(e, !!editingTask)}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Due Date
                        </label>
                        <div className="datepicker-container">
                          <DatePicker
                            selected={editingTask ? editingTask.dueDate : newTask.dueDate}
                            onChange={(date) => handleDateChange(date, !!editingTask)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                            placeholderText="Select due date"
                            dateFormat="MM/dd/yyyy"
                            minDate={new Date()}
                            isClearable
                            popperClassName="dark:bg-gray-800 dark:text-white z-50"
                            wrapperClassName="datepicker-wrapper w-full"
                            popperPlacement="bottom-start"
                            popperModifiers={[
                              {
                                name: 'offset',
                                options: {
                                  offset: [0, 8],
                                },
                              },
                              {
                                name: 'preventOverflow',
                                options: {
                                  rootBoundary: 'viewport',
                                  tether: false,
                                  altAxis: true,
                                },
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={editingTask ? handleUpdateTask : handleCreateTask}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskBoard; 
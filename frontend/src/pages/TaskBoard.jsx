import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus, FiMoreVertical, FiClock, FiFlag, FiCalendar } from 'react-icons/fi';
import Layout from '../components/Layout';
import DashboardHeader from '../components/DashboardHeader';
import API from '../services/api';

export default function TaskBoard() {
  const [columns, setColumns] = useState({
    pending: {
      id: 'pending',
      title: 'To Do',
      taskIds: []
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: []
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      taskIds: []
    }
  });
  
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await API.get('/tasks');
      
      // Initialize tasks object with tasks fetched from API
      const tasksObj = {};
      data.forEach(task => {
        tasksObj[task._id] = task;
      });
      setTasks(tasksObj);
      
      // Group tasks by status
      const columnsClone = { ...columns };
      data.forEach(task => {
        if (!columnsClone[task.status].taskIds.includes(task._id)) {
          columnsClone[task.status].taskIds.push(task._id);
        }
      });
      setColumns(columnsClone);
      
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or if the item was dropped back into the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Create a new array of task IDs for the source column
    const sourceColumn = columns[source.droppableId];
    const sourceTaskIds = [...sourceColumn.taskIds];
    sourceTaskIds.splice(source.index, 1);
    
    // Create a new array of task IDs for the destination column
    const destinationColumn = columns[destination.droppableId];
    const destinationTaskIds = [...destinationColumn.taskIds];
    destinationTaskIds.splice(destination.index, 0, draggableId);
    
    // Create new columns state
    const newColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        taskIds: sourceTaskIds
      },
      [destination.droppableId]: {
        ...destinationColumn,
        taskIds: destinationTaskIds
      }
    };
    
    // Update the state with the new columns
    setColumns(newColumns);
    
    // If the task was moved to a different column, update its status in the database
    if (source.droppableId !== destination.droppableId) {
      try {
        const updatedTask = { 
          ...tasks[draggableId], 
          status: destination.droppableId 
        };
        
        const { data } = await API.put(`/tasks/${draggableId}`, updatedTask);
        
        // Update the task in the tasks state
        setTasks({
          ...tasks,
          [draggableId]: data
        });
      } catch (error) {
        console.error('Error updating task status:', error);
        // Revert to the previous state if the update fails
        setColumns({
          ...columns
        });
      }
    }
  };
  
  const getColumnBackgroundColor = (columnId) => {
    switch (columnId) {
      case 'pending':
        return 'bg-amber-50 dark:bg-amber-900/20';
      case 'in-progress':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-orange-500 dark:text-orange-400';
      default:
        return 'text-green-500 dark:text-green-400';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Board</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Drag and drop tasks to update their status
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              Filter
            </button>
            <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none">
              <FiPlus className="h-5 w-5 sm:h-6 sm:w-6 inline-block mr-1" /> New Task
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-800 dark:text-red-300" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Object.values(columns).map(column => (
              <div 
                key={column.id} 
                className={`rounded-lg overflow-hidden shadow ${getColumnBackgroundColor(column.id)}`}
              >
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                    {column.title}
                    <span className="ml-2 bg-white dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
                      {column.taskIds.length}
                    </span>
                  </h3>
                  <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <FiMoreVertical />
                  </button>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] p-3 ${snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                      style={{ height: 'calc(100vh - 350px)', overflowY: 'auto' }}
                    >
                      {column.taskIds.map((taskId, index) => {
                        const task = tasks[taskId];
                        if (!task) return null;
                        
                        return (
                          <Draggable key={taskId} draggableId={taskId} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-200 dark:border-gray-700 ${snapshot.isDragging ? 'shadow-md opacity-80' : ''}`}
                              >
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</h4>
                                  <div className={`text-xs ${getPriorityColor(task.priority)}`}>
                                    <FiFlag className="inline-block" />
                                  </div>
                                </div>
                                
                                {task.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                                  {task.dueDate && (
                                    <div className="flex items-center mr-3">
                                      <FiCalendar className="mr-1" /> {formatDate(task.dueDate)}
                                    </div>
                                  )}
                                  
                                  <div className="flex-grow"></div>
                                  
                                  <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                                    JD
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      
                      {column.taskIds.length === 0 && (
                        <div className="text-center py-5 text-gray-400 dark:text-gray-500 text-sm">
                          No tasks here yet
                        </div>
                      )}
                      
                      <button className="w-full mt-2 p-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 rounded-md border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <FiPlus className="h-5 w-5 sm:h-6 sm:w-6 mr-1" /> Add task
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
} 
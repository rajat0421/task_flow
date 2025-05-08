import { useState } from 'react';
import { FiTrash2, FiEdit, FiClock, FiFlag } from 'react-icons/fi';
import API from '../services/api';

export default function TaskCard({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/tasks/${task._id}`, editedTask);
      onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { data } = await API.put(`/tasks/${task._id}`, { ...task, status: newStatus });
      onUpdate(data);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="p-4">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="3"
          />
          <div className="flex mb-2">
            <div className="mr-2 w-1/2">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Status</label>
              <select
                value={editedTask.status}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Priority</label>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{task.title}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  title="Edit task"
                >
                  <FiEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => onDelete(task._id)}
                  className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  title="Delete task"
                >
                  <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{task.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
              
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 ${getPriorityColor(task.priority)}`}>
                <FiFlag className="h-3 w-3 sm:h-4 sm:w-4" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
              
              {task.dueDate && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  <FiClock className="h-3 w-3 sm:h-4 sm:w-4" />
                  Due: {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
          
          {task.status !== 'completed' && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Update Status:</div>
              <div className="flex space-x-2">
                {task.status !== 'in-progress' && (
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    In Progress
                  </button>
                )}
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 
import api from './api';

// Debug function to check authentication
export const checkAuth = async () => {
  try {
    const response = await api.get('/tasks/debug');
    return response.data;
  } catch (error) {
    console.error('Auth check failed:', error);
    throw error;
  }
};

// Get all tasks
export const getAllTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    throw error;
  }
};

// Get a task by ID
export const getTaskById = async (id) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getTaskById(${id}):`, error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error(`Error in updateTask(${id}):`, error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in deleteTask(${id}):`, error);
    throw error;
  }
}; 
import express from 'express';
import { getTasks, createTask, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Task routes
router.route('/')
  .get(getTasks)
  .post(createTask);

// Debug route for checking auth - placed AFTER / route but BEFORE /:id routes
router.get('/debug', (req, res) => {
  res.json({
    message: 'Authentication successful',
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    }
  });
});

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;
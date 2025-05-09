import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile routes - protected
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);

export default router;
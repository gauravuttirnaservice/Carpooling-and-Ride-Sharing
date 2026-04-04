import express from 'express';
import { register, login, getMe, updateProfile, getLoginUserDetails, checkEmail, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProfilePhoto } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', uploadProfilePhoto, register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', protect, getMe);

// GET /api/auth/user-details - Stricter version without driver fallback
router.get('/user-details', protect, getLoginUserDetails);

// PUT /api/auth/profile
router.put('/profile', protect, uploadProfilePhoto, updateProfile);

// POST /api/auth/check-email
router.post('/check-email', checkEmail);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

export default router;

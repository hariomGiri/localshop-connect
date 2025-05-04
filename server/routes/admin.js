import express from 'express';
import {
  getAdminStats,
  getPendingShops,
  getRecentUsers,
  testEmailConfig
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Admin dashboard routes
router.get('/stats', getAdminStats);
router.get('/shops/pending', getPendingShops);
router.get('/users/recent', getRecentUsers);

// Email configuration test route
router.post('/test-email', testEmailConfig);

export default router;
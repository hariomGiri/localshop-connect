import express from 'express';
import {
  registerShop,
  getShops,
  getShop,
  getMyShop,
  updateShop,
  approveShop,
  getNearbyShops
} from '../controllers/shopController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getShops);
router.get('/nearby', getNearbyShops);
router.get('/:id', getShop);

// Protected routes - any authenticated user
router.use(protect);
router.get('/user/myshop', getMyShop);

// Protected routes - only shopkeepers and admins
router.post(
  '/register',
  upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'businessDocument', maxCount: 1 }
  ]),
  registerShop
);

router.put(
  '/:id',
  upload.fields([
    { name: 'shopImage', maxCount: 1 },
    { name: 'businessDocument', maxCount: 1 }
  ]),
  updateShop
);

// Admin only routes
router.put('/:id/approve', authorize('admin'), approveShop);

export default router;
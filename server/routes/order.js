import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getShopOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Customer routes
router.post('/', createOrder);
router.get('/me', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Shopkeeper routes
router.get('/shop', authorize('shopkeeper', 'admin'), getShopOrders);
router.put('/:id/status', authorize('shopkeeper', 'admin'), updateOrderStatus);

export default router;

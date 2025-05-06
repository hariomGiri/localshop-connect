import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  getShopProducts,
  getMyProducts,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/shop/:shopId', getShopProducts);

// Protected routes - shopkeepers and admins
router.use(protect);
router.get('/my/products', authorize('shopkeeper', 'admin'), getMyProducts);
router.post(
  '/',
  authorize('shopkeeper', 'admin'),
  ...upload.single('image'),
  createProduct
);
router.put(
  '/:id',
  authorize('shopkeeper', 'admin'),
  ...upload.single('image'),
  updateProduct
);
router.delete('/:id', authorize('shopkeeper', 'admin'), deleteProduct);

export default router;

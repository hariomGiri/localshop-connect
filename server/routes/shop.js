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
  (req, res, next) => {
    // Wrap the multer middleware in a try-catch block
    try {
      upload.fields([
        { name: 'shopImage', maxCount: 1 },
        { name: 'businessDocument', maxCount: 1 }
      ])(req, res, (err) => {
        if (err) {
          console.error('File upload error:', err);
          return res.status(400).json({
            success: false,
            message: `File upload error: ${err.message}`
          });
        }
        next();
      });
    } catch (error) {
      console.error('Unexpected error in file upload middleware:', error);
      return res.status(500).json({
        success: false,
        message: `Unexpected error in file upload: ${error.message}`
      });
    }
  },
  updateShop
);

// Admin only routes
router.put('/:id/approve', authorize('admin'), approveShop);

export default router;
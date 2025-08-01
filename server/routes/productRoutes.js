// // FILE: server/routes/productRoutes.js (Final Corrected Version)

// import express from 'express';
// const router = express.Router();
// import {
//   getProducts, getAdminProducts, getProductById,
//   createProduct, deleteProduct, updateProduct,
//   createProductReview, updateProductReview
// } from '../controllers/productController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

// // Public and Admin routes
// router.get('/', getProducts);
// router.post('/', protect, admin, createProduct);
// router.get('/admin', protect, admin, getAdminProducts);

// // Review routes
// router.post('/:id/reviews', protect, createProductReview);
// router.put('/:id/reviews', protect, updateProductReview);

// // Routes for a specific product ID
// router.get('/:id', getProductById);
// router.delete('/:id', protect, admin, deleteProduct);
// router.put('/:id', protect, admin, updateProduct);

// export default router;


import express from 'express';
const router = express.Router();
import {
  getProducts, getAdminProducts, getProductById,
  createProduct, deleteProduct, updateProduct,
  createProductReview, updateProductReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// PUBLIC ROUTES
router.get('/', getProducts);
router.get('/:id', getProductById);

// PROTECTED USER ROUTES
router.post('/:id/reviews', protect, createProductReview);
router.put('/:id/reviews', protect, updateProductReview);

// ADMIN ONLY ROUTES
router.get('/admin/all', protect, admin, getAdminProducts); // Changed route for clarity
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
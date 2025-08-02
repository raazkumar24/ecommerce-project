// // FILE: server/routes/productRoutes.js (Final Corrected Version)

// import express from 'express';
// const router = express.Router();
// import {
//   getProducts, getAdminProducts, getProductById,
//   createProduct, deleteProduct, updateProduct,
//   createProductReview, updateProductReview
// } from '../controllers/productController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

// // Public routes
// router.get('/', getProducts);
// router.get('/admin', protect, admin, getAdminProducts);

// //Admin-only routes
// router.delete('/:id', protect, admin, deleteProduct);
// router.put('/:id', protect, admin, updateProduct);

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

// PUBLIC & ADMIN ROUTES for the base '/' endpoint
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// ADMIN ONLY ROUTE for getting all products without pagination
router.get('/admin', protect, admin, getAdminProducts);

// ROUTES for a specific product ID
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// ROUTES for product reviews
router.route('/:id/reviews')
  .post(protect, createProductReview)
  .put(protect, updateProductReview);

export default router;
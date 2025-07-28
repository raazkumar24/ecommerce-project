// // FILE: server/routes/productRoutes.js (Corrected Route Order)

// import express from 'express';
// const router = express.Router();

// // --- Controllers ---
// import {
//   getProducts,
//   getAdminProducts,
//   getProductById,
//   createProduct,
//   deleteProduct,
//   updateProduct,
//   createProductReview,
//   updateProductReview,
// } from '../controllers/productController.js';

// // --- Middleware ---
// import { protect, admin } from '../middleware/authMiddleware.js';

// // --- Route Definitions ---

// // @route   GET /api/products (Public) & POST /api/products (Admin)
// router.route('/')
//   .get(getProducts)
//   .post(protect, admin, createProduct);

// // --- THIS IS THE FIX ---
// // The specific '/admin' route is placed BEFORE the general '/:id' route.
// // This ensures that a request to '/api/products/admin' is handled correctly.
// // @route   GET /api/products/admin (Admin)
// router.route('/admin').get(protect, admin, getAdminProducts);


// // @route   GET /api/products/:id/reviews (User) & PUT /api/products/:id/reviews (User)
// router.route('/:id/reviews')
//   .post(protect, createProductReview)
//   .put(protect, updateProductReview);

// // @route   GET /api/products/:id (Public), DELETE /api/products/:id (Admin), PUT /api/products/:id (Admin)
// // This route is now last, so it acts as a catch-all for any valid product ID.
// router.route('/:id')
//   .get(getProductById)
//   .delete(protect, admin, deleteProduct)
//   .put(protect, admin, updateProduct);

// export default router;



import express from 'express';
const router = express.Router();
import {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
  createProductReview,
  updateProductReview,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/admin').get(protect, admin, getAdminProducts);

router.route('/:id/reviews')
  .post(protect, createProductReview)
  .put(protect, updateProductReview);

router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;

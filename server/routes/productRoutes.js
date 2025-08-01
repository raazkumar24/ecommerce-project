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
const router_product = express.Router(); // Use a unique variable name
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

// --- PUBLIC & ADMIN ROUTES for '/' ---
// GET /api/products -> Get all paginated products (Public)
// POST /api/products -> Create a new product (Admin)
router_product.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// --- THIS IS THE FIX ---
// The route has been changed back from '/admin/all' to '/admin' to match
// what the frontend `ProductListPage` is requesting.
// GET /api/products/admin -> Get all products without pagination (Admin)
router_product.get('/admin', protect, admin, getAdminProducts);


// --- ROUTES for a specific product ID '/:id' ---
// GET /api/products/:id -> Get a single product (Public)
// PUT /api/products/:id -> Update a product (Admin)
// DELETE /api/products/:id -> Delete a product (Admin)
router_product.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
  

// --- ROUTES for product reviews '/:id/reviews' ---
// POST /api/products/:id/reviews -> Create a new review (Protected)
// PUT /api/products/:id/reviews -> Update an existing review (Protected)
router_product.route('/:id/reviews')
  .post(protect, createProductReview)
  .put(protect, updateProductReview);


export default router_product;

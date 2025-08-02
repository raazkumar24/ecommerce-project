// // FILE: server/routes/orderRoutes.js (Final Corrected Version)

// import express from 'express';
// const router = express.Router();
// import {
//   addOrderItems, getOrderById, getMyOrders,
//   getOrders, updateOrderToDelivered
// } from '../controllers/orderController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

// // User and Admin routes
// router.post('/', protect, addOrderItems);
// router.get('/', protect, admin, getOrders);
// router.get('/myorders', protect, getMyOrders);

// // Admin-only route
// router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

// // User route for a specific order
// router.get('/:id', protect, getOrderById);

// export default router;



import express from 'express';
const router = express.Router();
import {
  addOrderItems, getOrderById, getMyOrders,
  getOrders, updateOrderToDelivered
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// USER AND ADMIN ROUTES for the base '/' endpoint
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// PROTECTED USER ROUTES
router.get('/myorders', protect, getMyOrders);

// ROUTES FOR A SPECIFIC ORDER ID
router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, admin, updateOrderToDelivered); // Note: Changed to PUT for consistency

export default router;
// // FILE: server/routes/orderRoutes.js

// import express from 'express';
// const router = express.Router();

// // Import controller functions
// import {
//   addOrderItems,
//   getOrderById,
//   getMyOrders,
//   getOrders,                // 1. Admin: Get all orders
//   updateOrderToDelivered,   // 2. Admin: Mark order as delivered
// } from '../controllers/orderController.js';

// // Import middleware
// import { protect, admin } from '../middleware/authMiddleware.js';


// // ---------------------------------------------------
// // Routes for authenticated users (customers)
// // ---------------------------------------------------

// // @route   POST /api/orders
// // @desc    Create a new order
// // @access  Private
// router.route('/').post(protect, addOrderItems);

// // @route   GET /api/orders/myorders
// // @desc    Get orders for the logged-in user
// // @access  Private
// router.route('/myorders').get(protect, getMyOrders);

// // @route   GET /api/orders/:id
// // @desc    Get a specific order by ID
// // @access  Private
// router.route('/:id').get(protect, getOrderById);


// // ---------------------------------------------------
// // Admin-only routes
// // ---------------------------------------------------

// // @route   GET /api/orders
// // @desc    Get all orders (admin only)
// // @access  Private/Admin
// router.route('/').get(protect, admin, getOrders);

// // @route   PUT /api/orders/:id/deliver
// // @desc    Update order to delivered
// // @access  Private/Admin
// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

// export default router;
import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

router.route('/:id').get(protect, getOrderById);

export default router;
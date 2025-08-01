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
const router_order = express.Router(); // Use a unique variable name
import {
  addOrderItems, getOrderById, getMyOrders,
  getOrders, updateOrderToDelivered
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// PROTECTED USER ROUTES
router_order.post('/', protect, addOrderItems);
router_order.get('/myorders', protect, getMyOrders);
router_order.get('/:id', protect, getOrderById);

// ADMIN ONLY ROUTES
router_order.get('/', protect, admin, getOrders);
router_order.put('/:id/deliver', protect, admin, updateOrderToDelivered);

export default router_order;
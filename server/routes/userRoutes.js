// // FILE: server/routes/userRoutes.js (Final Corrected Version)

// import express from 'express';
// const router = express.Router();
// import {
//   authUser, registerUser, updateUserProfile,
//   getUserCart, addToUserCart, updateCartItemQuantity, removeFromUserCart,
//   checkUserCanReview, getUsers, deleteUser, getUserById, updateUser
// } from '../controllers/userController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

// // Public routes
// router.post('/login', authUser);
// router.post('/', registerUser);

// // Protected user routes
// router.put('/profile', protect, updateUserProfile);
// router.get('/cart', protect, getUserCart);
// router.post('/cart', protect, addToUserCart);
// router.put('/cart', protect, updateCartItemQuantity);
// router.delete('/cart/:productId', protect, removeFromUserCart);
// router.get('/can-review/:productId', protect, checkUserCanReview);

// // Admin routes
// router.get('/', protect, admin, getUsers);
// router.delete('/:id', protect, admin, deleteUser);
// router.get('/:id', protect, admin, getUserById);
// router.put('/:id', protect, admin, updateUser);

// export default router;


// =======================================================================
// FILE 1 of 4: server/routes/userRoutes.js (Final Corrected Version)
// =======================================================================

import express from 'express';
const router = express.Router();
import {
  authUser, registerUser, updateUserProfile,
  getUserCart, addToUserCart, updateCartItemQuantity, removeFromUserCart,
  checkUserCanReview, getUsers, deleteUser, getUserById, updateUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// PUBLIC ROUTES
router.post('/login', authUser);
router.post('/', registerUser);

// PROTECTED USER ROUTES
router.get('/profile', protect, (req, res) => res.json(req.user)); // Example, can be expanded
router.put('/profile', protect, updateUserProfile);
router.get('/cart', protect, getUserCart);
router.post('/cart', protect, addToUserCart);
router.put('/cart', protect, updateCartItemQuantity);
router.delete('/cart/:productId', protect, removeFromUserCart);
router.get('/can-review/:productId', protect, checkUserCanReview);

// ADMIN ONLY ROUTES
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;

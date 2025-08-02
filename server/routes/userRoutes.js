// // FILE: server/routes/userRoutes.js (Final Corrected Version)

import express from 'express';
const router = express.Router();
import {
  authUser, registerUser, updateUserProfile,
  getUserCart, addToUserCart, updateCartItemQuantity, removeFromUserCart,
  checkUserCanReview, getUsers, deleteUser, getUserById, updateUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Public routes
router.post('/login', authUser);
router.post('/', registerUser);

// Protected user routes
router.put('/profile', protect, updateUserProfile);
router.get('/cart', protect, getUserCart);
router.post('/cart', protect, addToUserCart);
router.put('/cart', protect, updateCartItemQuantity);
router.delete('/cart/:productId', protect, removeFromUserCart);
router.get('/can-review/:productId', protect, checkUserCanReview);

// Admin routes
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);

export default router;



// import express from 'express';
// const userRouter = express.Router(); // Use a unique variable name
// import {
//   authUser, registerUser, updateUserProfile,
//   getUserCart, addToUserCart, updateCartItemQuantity, removeFromUserCart,
//   checkUserCanReview, getUsers, deleteUser, getUserById, updateUser
// } from '../controllers/userController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

// // PUBLIC ROUTES
// userRouter.post('/login', authUser);
// userRouter.post('/', registerUser);

// // PROTECTED USER ROUTES
// userRouter.put('/profile', protect, updateUserProfile);
// userRouter.get('/cart', protect, getUserCart);
// userRouter.post('/cart', protect, addToUserCart);
// userRouter.put('/cart', protect, updateCartItemQuantity);
// userRouter.delete('/cart/:productId', protect, removeFromUserCart);
// userRouter.get('/can-review/:productId', protect, checkUserCanReview);

// // ADMIN ONLY ROUTES
// userRouter.get('/', protect, admin, getUsers);
// userRouter.get('/:id', protect, admin, getUserById);
// userRouter.put('/:id', protect, admin, updateUser);
// userRouter.delete('/:id', protect, admin, deleteUser);

// export default userRouter;

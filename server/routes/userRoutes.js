// FILE: server/routes/userRoutes.js (Cleaned and Organized)

import express from 'express';
const router = express.Router();

// --- Controllers ---
import {
  authUser,
  registerUser,
  updateUserProfile,
  getUserCart,
  addToUserCart,
  updateCartItemQuantity,
  removeFromUserCart,
  checkUserCanReview,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
} from '../controllers/userController.js';

// --- Middleware ---
import { protect, admin } from '../middleware/authMiddleware.js';

// --- Public & Admin Routes for '/' ---
router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

// --- Public Route for '/login' ---
router.post('/login', authUser);

// --- Protected User Profile Route ---
router.route('/profile').put(protect, updateUserProfile);

// --- Protected User Cart Routes ---
router.route('/cart')
  .get(protect, getUserCart)
  .post(protect, addToUserCart)
  .put(protect, updateCartItemQuantity);

router.delete('/cart/:productId', protect, removeFromUserCart);

// --- Protected User Review Eligibility Route ---
router.get('/can-review/:productId', protect, checkUserCanReview);

// --- Protected Admin Routes for '/:id' ---
router.route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;

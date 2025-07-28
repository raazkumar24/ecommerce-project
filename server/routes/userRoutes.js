// FILE: server/routes/userRoutes.js (Cleaned and Organized)

import express from 'express';
const router = express.Router();

// --- Controllers ---
import {
  authUser,
  registerUser,
  getUserCart,
  addToUserCart,
  updateCartItemQuantity,
  removeFromUserCart,
  checkUserCanReview,
   updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
} from '../controllers/userController.js';

// --- Middleware ---
import { protect, admin } from '../middleware/authMiddleware.js';

// --- Public & Admin Routes for '/' ---
// We chain the POST (public) and GET (admin) methods for the root path.
router.route('/')
  .post(registerUser)            // Anyone can register
  .get(protect, admin, getUsers); // Only admins can get all users

// --- Public Route for '/login' ---
router.post('/login', authUser);

router.route('/profile')
  .put(protect, updateUserProfile);

// --- Protected User Cart Routes ---
router.route('/cart')
  .get(protect, getUserCart)
  .post(protect, addToUserCart)
  .put(protect, updateCartItemQuantity);

router.delete('/cart/:productId', protect, removeFromUserCart);

// --- Protected User Review Eligibility Route ---
router.get('/can-review/:productId', protect, checkUserCanReview);


// --- Protected Admin Routes for '/:id' ---
// All routes related to a specific user ID are chained here.
router.route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);
  

export default router;

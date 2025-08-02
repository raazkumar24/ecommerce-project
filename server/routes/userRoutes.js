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
router.route('/').post(registerUser).get(protect, admin, getUsers);

// PROTECTED USER ROUTES
router.route('/profile')
  .get(protect, (req, res) => res.json(req.user))
  .put(protect, updateUserProfile);

router.route('/cart')
  .get(protect, getUserCart)
  .post(protect, addToUserCart)
  .put(protect, updateCartItemQuantity);

router.delete('/cart/:productId', protect, removeFromUserCart);
router.get('/can-review/:productId', protect, checkUserCanReview);

// ADMIN ONLY ROUTES
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
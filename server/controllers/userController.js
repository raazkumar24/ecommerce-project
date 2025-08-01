// FILE: server/controllers/userController.js (Final Corrected and Complete Version)

import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import generateToken from '../utils/generateToken.js';

// ------------------------------------
// AUTHENTICATION & REGISTRATION
// ------------------------------------

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// ------------------------------------
// USER PROFILE & CART FUNCTIONS
// ------------------------------------

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
const getUserCart = async (req, res) => {
  // --- THIS IS THE FIX ---
  // The populate method now fetches the `images` array in addition to the other fields.
  const user = await User.findById(req.user._id).populate('cart.product', 'name price image images');
  if (user) {
    res.json(user.cart);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Add item to cart
// @route   POST /api/users/cart
// @access  Private
const addToUserCart = async (req, res) => {
  const { productId, qty } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const existingItem = user.cart.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.qty += qty;
    } else {
      user.cart.push({ product: productId, qty });
    }
    await user.save();
    // --- THIS IS THE FIX ---
    const updatedUser = await User.findById(req.user._id).populate('cart.product', 'name price image images');
    res.status(201).json(updatedUser.cart);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/users/cart
// @access  Private
const updateCartItemQuantity = async (req, res) => {
  const { productId, qty } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const item = user.cart.find(item => item.product.toString() === productId);
    if (item) {
      if (qty > 0) {
        item.qty = qty;
      } else {
        user.cart = user.cart.filter(cartItem => cartItem.product.toString() !== productId);
      }
      await user.save();
      // --- THIS IS THE FIX ---
      const updatedUser = await User.findById(req.user._id).populate('cart.product', 'name price image images');
      res.json(updatedUser.cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/users/cart/:productId
// @access  Private
const removeFromUserCart = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  if (user) {
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    // --- THIS IS THE FIX ---
    const updatedUser = await User.findById(req.user._id).populate('cart.product', 'name price image images');
    res.json(updatedUser.cart);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// ------------------------------------
// USER REVIEW FUNCTIONS
// ------------------------------------

// @desc    Check if a user can review a product and get existing review
// @route   GET /api/users/can-review/:productId
// @access  Private
const checkUserCanReview = async (req, res) => {
  const { productId } = req.params;
  
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Check for an existing review FIRST.
  const existingReview = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    // If found, tell the frontend it can't create a *new* one,
    // but provide the existing one so it can switch to "edit mode".
    return res.json({ 
      canReview: false, 
      message: 'You have already reviewed this product.', 
      existingReview: existingReview 
    });
  }

  // If no existing review, THEN check if they have a delivered order.
  const deliveredOrder = await Order.findOne({
    user: req.user._id,
    'orderItems.product': productId,
    isDelivered: true,
  });

  if (!deliveredOrder) {
    return res.json({ canReview: false, message: 'You must purchase this product to write a review.' });
  }

  // If they have purchased and not reviewed, they are eligible to create a new review.
  res.json({ canReview: true });
};


// ------------------------------------
// ADMIN FUNCTIONS
// ------------------------------------

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // Use `??` to allow setting isAdmin to `false`
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// ------------------------------------
// FINAL EXPORT
// ------------------------------------
export {
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
  updateUser,
};

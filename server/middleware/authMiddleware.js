// FILE: server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// --- Middleware to protect routes (only for authenticated users) ---
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from the "Bearer <token>" format
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the decoded token and attach it to the request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      // Continue to the next middleware or route
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- Middleware to restrict access to admin-only routes ---
const admin = (req, res, next) => {
  // Check if the user is authenticated and has admin privileges
  if (req.user && req.user.isAdmin) {
    next(); // Proceed if admin
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };

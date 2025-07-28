// FILE: server/routes/uploadRoutes.js (Final Corrected Version with Timeout)

import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// This middleware function handles the entire upload process in the correct order.
const uploadToCloudinary = (req, res, next) => {
  // 1. First, check for and configure Cloudinary credentials.
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: 'Cloudinary credentials are not configured on the server.' });
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // 2. Second, create the CloudinaryStorage instance.
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'E-Shop',
      allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp'],
    },
  });

  // 3. Third, create the multer upload instance.
  const upload = multer({ 
    storage: storage,
    // --- THIS IS THE FIX ---
    // We add a limit to prevent extremely large files from being uploaded.
    // 5 * 1024 * 1024 equals 5 Megabytes.
    limits: { fileSize: 5 * 1024 * 1024 } 
  }).single('image');

  // 4. Finally, execute the multer upload middleware.
  upload(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      // Provide a more specific error message if the file is too large.
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
      }
      return res.status(500).json({ message: 'Image upload failed.', error: err.message });
    }
    next();
  });
};


// --- API Endpoint Definition ---
router.post('/', protect, admin, uploadToCloudinary, (req, res) => {
  if (req.file && req.file.path) {
    res.status(200).send({
      message: 'Image Uploaded Successfully',
      image: req.file.path,
    });
  } else {
    res.status(400).send({ message: 'No image file provided or upload failed' });
  }
});

export default router;

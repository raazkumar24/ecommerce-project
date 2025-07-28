// FILE: server/routes/uploadRoutes.js (Final Corrected Version)

import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Multer Storage Configuration ---
// This configures how files will be stored in Cloudinary.
// It relies on the CLOUDINARY_URL in your .env file being loaded correctly by server.js.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'E-Shop',
    allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp'],
  },
});

// Create the multer upload instance
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// --- API Endpoint Definition ---
// @route   POST /api/upload
// @desc    Upload an image
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
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

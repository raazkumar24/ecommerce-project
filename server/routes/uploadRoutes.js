// // FILE: server/routes/uploadRoutes.js (Final Corrected Version)

// import express from 'express';
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { protect, admin } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // --- THIS IS THE DEFINITIVE FIX ---
// // We create a single middleware function that handles the entire upload process.
// // This ensures that the configuration happens dynamically for each request,
// // guaranteeing that the .env variables are already loaded.
// const uploadToCloudinary = (req, res, next) => {
//   // 1. First, check for and configure Cloudinary credentials.
//   if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//     return res.status(500).json({ message: 'Cloudinary credentials are not configured on the server.' });
//   }
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });

//   // 2. Second, create the CloudinaryStorage instance *after* configuration.
//   const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'E-Shop',
//       allowed_formats: ['jpeg', 'png', 'jpg'],
//     },
//   });

//   // 3. Third, create the multer upload instance using the fresh storage configuration.
//   const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
//   }).single('image');

//   // 4. Finally, execute the multer upload middleware.
//   upload(req, res, (err) => {
//     if (err) {
//       // If multer or cloudinary throws an error, catch it here.
//       console.error("Upload Error:", err);
//       if (err.code === 'LIMIT_FILE_SIZE') {
//         return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
//       }
//       return res.status(500).json({ message: 'Image upload failed.', error: err.message });
//     }
//     // If successful, proceed to the final route handler.
//     next();
//   });
// };


// // --- API Endpoint Definition ---
// // The middleware chain is now simpler and more robust.
// // It runs in this order: 1. protect, 2. admin, 3. our new uploadToCloudinary middleware.
// router.post('/', protect, admin, uploadToCloudinary, (req, res) => {
//   // By the time we get here, the file has already been successfully uploaded.
//   if (req.file && req.file.path) {
//     res.status(200).send({
//       message: 'Image Uploaded Successfully',
//       image: req.file.path, // Send back the secure URL of the image
//     });
//   } else {
//     res.status(400).send({ message: 'No image file provided or upload failed' });
//   }
// });

// export default router;



// FILE: server/routes/uploadRoutes.js (Final Corrected Version)

// import express from 'express';
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { protect, admin } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // This middleware function handles the entire upload process in the correct order.
// const uploadToCloudinary = (req, res, next) => {
//   // 1. Configure Cloudinary credentials.
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });

//   // 2. Create the CloudinaryStorage instance.
//   const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'E-Shop',
//       allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp'], // Added 'gif' and 'webp' for more flexibility],
//     },
//   });

//   // --- THIS IS THE FIX ---
//   // 3. Create the multer upload instance. We now use `.array('images', 5)`
//   // to accept multiple files (up to 5) from a field named "images".
//   const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
//   }).array('images', 5); // Changed from .single('image')

//   // 4. Execute the multer upload middleware.
//   upload(req, res, (err) => {
//     if (err) {
//       console.error("Upload Error:", err);
//       if (err.code === 'LIMIT_FILE_SIZE') {
//         return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
//       }
//       return res.status(500).json({ message: 'Image upload failed.', error: err.message });
//     }
//     next();
//   });
// };

// // --- API Endpoint Definition ---
// router.post('/', protect, admin, uploadToCloudinary, (req, res) => {
//   // After a successful multi-file upload, `req.files` will be an array.
//   if (req.files && req.files.length > 0) {
//     // We map over the array to get the URL of each uploaded image.
//     const imageUrls = req.files.map(file => file.path);
//     res.status(200).send({
//       message: 'Images Uploaded Successfully',
//       images: imageUrls, // Send back the array of URLs
//     });
//   } else {
//     res.status(400).send({ message: 'No image files provided or upload failed' });
//   }
// });

// export default router;



import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'E-Shop',
    allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp'], // Added 'gif' and 'webp' for more flexibility
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', protect, admin, upload.array('images', 5), (req, res) => {
  if (req.files && req.files.length > 0) {
    const imageUrls = req.files.map(file => file.path);
    res.status(200).send({
      message: 'Images Uploaded Successfully',
      images: imageUrls,
    });
  } else {
    res.status(400).send({ message: 'No image files provided or upload failed' });
  }
});

export default router;

// FILE: server/server.js (Final Corrected Version with Explicit Path and Logging)

// import dotenv from 'dotenv';
// import path from 'path'; // Import the 'path' module to handle file paths
// import { fileURLToPath } from 'url'; // Helper to work with file paths in ES modules

// // --- THIS IS THE DEFINITIVE FIX ---
// // 1. We determine the directory name of the current module.
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 2. We explicitly define the path to the .env file, ensuring it looks in the correct 'server' directory.
// // This removes any ambiguity and forces dotenv to load the correct file.
// const envPath = path.resolve(__dirname, '.env');

// // 3. We load the environment variables from that specific path.
// dotenv.config({ path: envPath });

// // 4. We add console logs to VERIFY that the keys are being loaded.
// //    When you restart your server, you should see your keys printed in the terminal.
// //    If you see 'undefined', the problem is with the .env file itself (name, location, or formatting).
// console.log('--- Verifying Environment Variables ---');
// console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
// console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
// console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'NOT LOADED');
// console.log('Mongo URI:', process.env.MONGO_URI ? 'Loaded' : 'NOT LOADED');
// console.log('------------------------------------');


// import express from 'express';
// import cors from 'cors';
// import connectDB from './config/db.js';

// // --- Route Imports ---
// import productRoutes from './routes/productRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import uploadRoutes from './routes/uploadRoutes.js';

// const PORT = process.env.PORT || 5000;
// const app = express();

// // --- Middleware ---
// app.use(express.json());
// app.use(cors());

// // --- API Routes ---
// app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/upload', uploadRoutes);

// // --- DEPLOYMENT CONFIGURATION ---
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/dist')));
//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'))
//   );
// } else {
//   app.get('/', (req, res) => {
//     res.send('API is running in development mode...');
//   });
// }

// // --- Server Startup ---
// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`✅ Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error(`❌ Failed to start server:`, error);
//     process.exit(1);
//   }
// };

// startServer();



import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');

dotenv.config({ path: envPath });

// Verify environment variables
console.log('--- Verifying Environment Variables ---');
console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'NOT LOADED');
console.log('Mongo URI:', process.env.MONGO_URI ? 'Loaded' : 'NOT LOADED');
console.log('Node Environment:', process.env.NODE_ENV || 'development');
console.log('------------------------------------');

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - adjust as needed
app.use(cors({
  origin: '*', // Allow all origins (adjust for production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'E-Commerce API',
    endpoints: {
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders',
      uploads: '/api/upload'
    },
    status: 'running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server startup
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`🔗 Access the API at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
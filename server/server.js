// // FILE: server/server.js

// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import connectDB from './config/db.js';
// import productRoutes from './routes/productRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import cors from 'cors';
// import orderRoutes from './routes/orderRoutes.js';
// import uploadRoutes from './routes/uploadRoutes.js'; // 1. Import the new upload routes



// connectDB();

// const app = express();

// // --- THIS IS THE IMPORTANT LINE TO ADD ---
// // It allows the server to accept JSON data in the body of a request
// app.use(express.json()); 
// // -----------------------------------------

// app.use(cors()); 

// const PORT = process.env.PORT || 5000;

// app.get('/api', (req, res) => {
//   res.json({ message: 'Hello from the E-Shop API! 👋' });
// });

// app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/upload', uploadRoutes); // 2. Tell the app to use the upload routes for any request to '/api/upload'



// app.listen(PORT, () => {
//   console.log(`✅ Server is running on port ${PORT}`);
// });


// startServer();
// async function startServer() {
//   try {
//     await connectDB();
//     console.log('✅ Database connected successfully');
//   } catch (error) {
//     console.error('❌ Database connection failed:', error.message);
//     process.exit(1); // Exit the process with failure
//   }
// }


// FILE: server/server.js (Corrected with dotenv at the top)

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
// // console.log('--- Verifying Environment Variables ---');
// // console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
// // console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
// // console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'NOT LOADED');
// // console.log('Mongo URI:', process.env.MONGO_URI ? 'Loaded' : 'NOT LOADED');
// // console.log('------------------------------------');


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



// FILE: server/server.js (Corrected and Final Deployment Version)

// --- IMPORTS ---
// All imports are grouped at the top for clarity.
// We ensure `path` and `dotenv` are only imported once.
// import path from 'path';
// import { fileURLToPath } from 'url';
// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDB from './config/db.js';

// // Route Imports
// import productRoutes from './routes/productRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import uploadRoutes from './routes/uploadRoutes.js';

// // --- CONFIGURATION ---
// // Load environment variables from the .env file
// dotenv.config();

// const PORT = process.env.PORT || 5000;
// const app = express();

// // --- MIDDLEWARE ---
// // This allows the server to accept JSON data in request bodies.
// app.use(express.json());
// // This enables Cross-Origin Resource Sharing, allowing your frontend to talk to your backend.
// app.use(cors());

// // --- API ROUTES ---
// // This section tells the Express app which route file to use for which base URL.
// app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/upload', uploadRoutes);


// // --- DEPLOYMENT CONFIGURATION ---
// // This block of code is crucial for serving your built React app in production.

// // Get the directory name of the current module (ES module equivalent of __dirname)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Check if the server is running in the 'production' environment
// if (process.env.NODE_ENV === 'production') {
//   // 1. Statically serve the frontend's 'dist' folder.
//   // This tells Express to treat the `client/dist` folder as a static file server.
//   app.use(express.static(path.join(__dirname, '../client/dist')));

//   // 2. For any route that is not an API route, serve the main index.html file from the dist folder.
//   // This is the catch-all that allows React Router to handle all the frontend navigation.
//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'))
//   );
// } else {
//   // If not in production, have a simple test route for the root URL.
//   app.get('/', (req, res) => {
//     res.send('API is running in development mode...');
//   });
// }


// // --- SERVER STARTUP ---
// const startServer = async () => {
//   try {
//     // Connect to the database first
//     await connectDB();
//     // Then, start the Express server
//     app.listen(PORT, () => {
//       console.log(`✅ Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error(`❌ Failed to start server:`, error);
//     process.exit(1); // Exit the process with a failure code
//   }
// };

//  console.log('--- Verifying Environment Variables ---');
// console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
// console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
// console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'NOT LOADED');
// console.log('Mongo URI:', process.env.MONGO_URI ? 'Loaded' : 'NOT LOADED');
// console.log('------------------------------------');

// startServer();
// FILE: server/server.js (Final Corrected Version for Deployment)

import dotenv from 'dotenv';
// This line MUST be at the absolute top to load your secret keys.
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// --- Route Imports ---
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const PORT = process.env.PORT || 5000;
const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- API Routes ---
// All requests to these URLs will be handled by your API.
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);


// --- DEPLOYMENT CONFIGURATION ---
// This is the crucial block for making your frontend work on the live server.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This check ensures this code only runs on the live Render server
if (process.env.NODE_ENV === 'production') {
  // 1. Statically serve the frontend's 'dist' folder.
  // This tells Express to treat the `client/dist` folder as a static file server.
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // 2. For any request that doesn't match an API route above, serve the main index.html file.
  // This is the catch-all that allows React Router to handle all the frontend navigation.
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'))
  );
} else {
  // If not in production, have a simple test route for the root URL.
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}

// --- Server Startup ---
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Failed to start server:`, error);
    process.exit(1);
  }
};

startServer();
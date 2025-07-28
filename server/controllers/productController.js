// // FILE: server/controllers/productController.js (Final Updated Version with Case-Insensitive Filtering)

// import mongoose from 'mongoose';
// import Product from '../models/productModel.js';
// import Order from '../models/orderModel.js';

// // -------------------------------------------------------------
// // @desc    Fetch products for CUSTOMERS (with pagination, search, filter, and sort)
// // @route   GET /api/products?keyword=...&category=...&brand=...&sort=...&pageNumber=...
// // @access  Public
// // -------------------------------------------------------------
// const getProducts = async (req, res) => {
//   const pageSize = 8;
//   const page = Number(req.query.pageNumber) || 1;

//   // Keyword filter (already case-insensitive)
//   const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
  
//   // --- THIS IS THE FIX ---
//   // The category and brand filters are now updated to use a case-insensitive regex search.
//   // This ensures that a search for "fashion" will correctly match "Fashion" in the database.
//   const category = req.query.category ? { category: { $regex: `^${req.query.category}$`, $options: 'i' } } : {};
//   const brand = req.query.brand ? { brand: { $regex: `^${req.query.brand}$`, $options: 'i' } } : {};

//   // Combine all filters into a single object for the database query
//   const filter = { ...keyword, ...category, ...brand };

//   // Determine the sort order
//   const sortOrder = req.query.sort === 'price' ? { price: 1 }
//                   : req.query.sort === '-price' ? { price: -1 }
//                   : { rating: -1 };

//   try {
//     const count = await Product.countDocuments(filter);
//     const products = await Product.find(filter)
//       .sort(sortOrder)
//       .limit(pageSize)
//       .skip(pageSize * (page - 1));

//     res.json({ products, page, pages: Math.ceil(count / pageSize) });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // -------------------------------------------------------------
// // @desc    Get all products for ADMINS (no pagination)
// // @route   GET /api/products/admin
// // @access  Private/Admin
// // -------------------------------------------------------------
// const getAdminProducts = async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error fetching admin products' });
//   }
// };

// // -------------------------------------------------------------
// // @desc    Fetch a single product by ID
// // @route   GET /api/products/:id
// // @access  Public
// // -------------------------------------------------------------
// const getProductById = async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(404).json({ message: 'Product not found' });
//   }
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     res.json(product);
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// };

// // -------------------------------------------------------------
// // @desc    Create a new sample product (Admin)
// // @route   POST /api/products
// // @access  Private/Admin
// // -------------------------------------------------------------
// const createProduct = async (req, res) => {
//   const product = new Product({
//     name: 'Sample name',
//     price: 0,
//     user: req.user._id,
//     image: '/images/sample.jpg',
//     brand: 'Sample brand',
//     category: 'Sample category',
//     countInStock: 0,
//     numReviews: 0,
//     description: 'Sample description',
//   });
//   const createdProduct = await product.save();
//   res.status(201).json(createdProduct);
// };

// // -------------------------------------------------------------
// // @desc    Update a product by ID (Admin)
// // @route   PUT /api/products/:id
// // @access  Private/Admin
// // -------------------------------------------------------------
// const updateProduct = async (req, res) => {
//   const { name, price, description, image, brand, category, countInStock } = req.body;
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     product.name = name;
//     product.price = price;
//     product.description = description;
//     product.image = image;
//     product.brand = brand;
//     product.category = category;
//     product.countInStock = countInStock;
//     const updatedProduct = await product.save();
//     res.json(updatedProduct);
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// };

// // -------------------------------------------------------------
// // @desc    Delete a product by ID (Admin)
// // @route   DELETE /api/products/:id
// // @access  Private/Admin
// // -------------------------------------------------------------
// const deleteProduct = async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     await Product.deleteOne({ _id: product._id });
//     res.json({ message: 'Product removed' });
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// };

// // -------------------------------------------------------------
// // @desc    Create a review for a product
// // @route   POST /api/products/:id/reviews
// // @access  Private
// // -------------------------------------------------------------
// const createProductReview = async (req, res) => {
//   const { rating, comment } = req.body;
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     const deliveredOrder = await Order.findOne({ user: req.user._id, 'orderItems.product': product._id, isDelivered: true });
//     if (!deliveredOrder) {
//       return res.status(400).json({ message: 'You can only review products you have purchased.' });
//     }
//     const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
//     if (alreadyReviewed) {
//       return res.status(400).json({ message: 'Product already reviewed' });
//     }
//     const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
//     product.reviews.push(review);
//     product.numReviews = product.reviews.length;
//     product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
//     await product.save();
//     res.status(201).json({ message: 'Review added' });
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// };

// // -------------------------------------------------------------
// // @desc    Update an existing review
// // @route   PUT /api/products/:id/reviews
// // @access  Private
// // -------------------------------------------------------------
// const updateProductReview = async (req, res) => {
//   const { rating, comment } = req.body;
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     const review = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
//     if (review) {
//       review.rating = Number(rating);
//       review.comment = comment;
//       product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
//       await product.save();
//       res.status(200).json({ message: 'Review updated' });
//     } else {
//       res.status(404).json({ message: 'Review not found' });
//     }
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// };

// // --- FINAL EXPORT STATEMENT ---
// export {
//   getProducts,
//   getAdminProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   createProductReview,
//   updateProductReview,
// };



// FILE: server/controllers/productController.js (Updated with Stable Sorting)

// import mongoose from 'mongoose';
// import Product from '../models/productModel.js';
// import Order from '../models/orderModel.js';

// // @desc    Fetch products for CUSTOMERS (with pagination, search, filter, and sort)
// const getProducts = async (req, res) => {
//   const pageSize = 8;
//   const page = Number(req.query.pageNumber) || 1;

//   const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
//   const category = req.query.category ? { category: { $regex: `^${req.query.category}$`, $options: 'i' } } : {};
//   const brand = req.query.brand ? { brand: { $regex: `^${req.query.brand}$`, $options: 'i' } } : {};
  
//   const filter = { ...keyword, ...category, ...brand };

//   // --- THIS IS THE FIX ---
//   // We now define a more robust sorting object.
//   // It will sort by the user's choice, but always use the product name as a
//   // secondary tie-breaker to ensure the order is always the same.
//   let sortOrder = {};
//   if (req.query.sort === 'price') {
//     sortOrder = { price: 1, name: 1 }; // Price: Low to High, then alphabetically
//   } else if (req.query.sort === '-price') {
//     sortOrder = { price: -1, name: 1 }; // Price: High to Low, then alphabetically
//   } else {
//     sortOrder = { rating: -1, name: 1 }; // Default: Best Rating, then alphabetically
//   }

//   try {
//     const count = await Product.countDocuments(filter);
//     const products = await Product.find(filter)
//       .sort(sortOrder) // Apply the new, stable sorting
//       .limit(pageSize)
//       .skip(pageSize * (page - 1));

//     res.json({ products, page, pages: Math.ceil(count / pageSize) });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // ... (The rest of the functions in this file remain the same)
// const getAdminProducts = async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error fetching admin products' });
//   }
// };

// const getProductById = async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(404).json({ message: 'Product not found' });
//   }
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     res.json(product);
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// };

// const createProduct = async (req, res) => {
//   const product = new Product({
//     name: 'Sample name', price: 0, user: req.user._id, image: '/images/sample.jpg',
//     brand: 'Sample brand', category: 'Sample category', countInStock: 0,
//     numReviews: 0, description: 'Sample description',
//   });
//   const createdProduct = await product.save();
//   res.status(201).json(createdProduct);
// };

// const updateProduct = async (req, res) => {
//   const { name, price, description, image, brand, category, countInStock } = req.body;
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     product.name = name; product.price = price; product.description = description;
//     product.image = image; product.brand = brand; product.category = category;
//     product.countInStock = countInStock;
//     const updatedProduct = await product.save();
//     res.json(updatedProduct);
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// };

// const deleteProduct = async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     await Product.deleteOne({ _id: product._id });
//     res.json({ message: 'Product removed' });
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// };

// const createProductReview = async (req, res) => {
//   const { rating, comment } = req.body;
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     const deliveredOrder = await Order.findOne({ user: req.user._id, 'orderItems.product': product._id, isDelivered: true });
//     if (!deliveredOrder) {
//       return res.status(400).json({ message: 'You can only review products you have purchased.' });
//     }
//     const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
//     if (alreadyReviewed) {
//       return res.status(400).json({ message: 'Product already reviewed' });
//     }
//     const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
//     product.reviews.push(review);
//     product.numReviews = product.reviews.length;
//     product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
//     await product.save();
//     res.status(201).json({ message: 'Review added' });
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// };

// const updateProductReview = async (req, res) => {
//   const { rating, comment } = req.body;
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     const review = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
//     if (review) {
//       review.rating = Number(rating);
//       review.comment = comment;
//       product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
//       await product.save();
//       res.status(200).json({ message: 'Review updated' });
//     } else {
//       res.status(404).json({ message: 'Review not found' });
//     }
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// };

// export {
//   getProducts,
//   getAdminProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   createProductReview,
//   updateProductReview,
// };



// FILE: server/controllers/productController.js (Updated for Pagination)

import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// @desc    Fetch products for CUSTOMERS (with pagination, search, filter, and sort)
const getProducts = async (req, res) => {
  // --- PAGINATION ---
  const pageSize = 8; // Number of products to show per page
  const page = Number(req.query.pageNumber) || 1; // Get the page number from the URL, default to 1

  // --- FILTERING ---
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
  const category = req.query.category ? { category: { $regex: `^${req.query.category}$`, $options: 'i' } } : {};
  const brand = req.query.brand ? { brand: { $regex: `^${req.query.brand}$`, $options: 'i' } } : {};
  
  const filter = { ...keyword, ...category, ...brand };

  // --- SORTING ---
  let sortOrder = {};
  if (req.query.sort === 'price') {
    sortOrder = { price: 1, name: 1 };
  } else if (req.query.sort === '-price') {
    sortOrder = { price: -1, name: 1 };
  } else {
    sortOrder = { rating: -1, name: 1 };
  }

  try {
    // Get the total count of products that match the filter
    const count = await Product.countDocuments(filter);
    
    // Find the products for the current page
    const products = await Product.find(filter)
      .sort(sortOrder)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Send back the products, the current page, and the total number of pages
    res.json({ products, page, pages: Math.ceil(count / pageSize) });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- ALL OTHER CONTROLLER FUNCTIONS REMAIN THE SAME ---

const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching admin products' });
  }
};

const getProductById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProduct = async (req, res) => {
  const product = new Product({
    name: 'Sample name', price: 0, user: req.user._id, image: '/images/sample.jpg',
    brand: 'Sample brand', category: 'Sample category', countInStock: 0,
    numReviews: 0, description: 'Sample description',
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name; product.price = price; product.description = description;
    product.image = image; product.brand = brand; product.category = category;
    product.countInStock = countInStock;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const deliveredOrder = await Order.findOne({ user: req.user._id, 'orderItems.product': product._id, isDelivered: true });
    if (!deliveredOrder) {
      return res.status(400).json({ message: 'You can only review products you have purchased.' });
    }
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const updateProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const review = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (review) {
      review.rating = Number(rating);
      review.comment = comment;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
      await product.save();
      res.status(200).json({ message: 'Review updated' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  updateProductReview,
};

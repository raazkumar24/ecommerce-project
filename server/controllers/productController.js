// FILE: server/controllers/productController.js (Updated with Tags Logic)

import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// @desc    Fetch products for CUSTOMERS (with pagination, search, filter, and sort)
const getProducts = async (req, res) => {
  const pageSize = 9;
  const page = Number(req.query.pageNumber) || 1;

  // --- THIS IS THE FIX (1/3) ---
  // The keyword search is now much more powerful.
  const keyword = req.query.keyword
    ? {
        // We use the `$or` operator to search across multiple fields.
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          // This new condition checks if the keyword exists in the `tags` array.
          { tags: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const category = req.query.category ? { category: { $regex: `^${req.query.category}$`, $options: 'i' } } : {};
  const brand = req.query.brand ? { brand: { $regex: `^${req.query.brand}$`, $options: 'i' } } : {};
  
  // The final filter combines the keyword search with any category/brand filters.
  const filter = { ...keyword, ...category, ...brand };

  let sortOrder = {};
  if (req.query.sort === 'price') {
    sortOrder = { price: 1, name: 1 };
  } else if (req.query.sort === '-price') {
    sortOrder = { price: -1, name: 1 };
  } else {
    sortOrder = { rating: -1, name: 1 };
  }

  try {
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOrder)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ... (getAdminProducts and getProductById functions remain the same)
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

// @desc    Create a new sample product (Admin)
const createProduct = async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    images: ['/images/sample.jpg'], 
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    // --- THIS IS THE FIX (2/3) ---
    // The new sample product now includes an empty `tags` array.
    tags: [],
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product by ID (Admin)
const updateProduct = async (req, res) => {
  // --- THIS IS THE FIX (3/3) ---
  // We now destructure `tags` from the request body.
  const { name, price, description, images, brand, category, countInStock, tags } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.images = images;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.tags = tags; // The product's tags are updated with the new array.
    
    if (!product.user) {
        product.user = req.user._id;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// ... (deleteProduct and review functions remain the same)
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

// --- FINAL EXPORT STATEMENT ---
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

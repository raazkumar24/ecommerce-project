// FILE: server/models/productModel.js (Corrected)

import mongoose from 'mongoose';

// --------------------------
// Review Subdocument Schema
// --------------------------
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// --------------------------
// Product Main Schema
// --------------------------
const productSchema = new mongoose.Schema(
  {
    // This is the user who created the product (the admin)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // <-- THE FIX: Ensures old products don't cause errors
      ref: 'User',
    },
 images: {
      type: [String],
      required: true,
      default: [], // It defaults to an empty array.
    },    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

// FILE: server/models/productModel.js (Updated for Multiple Images)

// FILE: server/models/productModel.js (Final Corrected Version)

// import mongoose from "mongoose";

// const reviewSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     rating: { type: Number, required: true },
//     comment: { type: String, required: true },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const productSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true, // This is correct, every product must have a user (the admin who created it)
//       ref: "User",
//     },
//     name: { type: String, required: true },

//     // The 'images' field is an array of strings to support multiple images.
//     images: {
//       type: [String],
//       required: true,
//       default: [],
//     },

//     tags: {
//       type: [String],
//       required: false, // Not required, so older products won't cause errors
//       default: [],
//     },

//     brand: { type: String, required: true },
//     category: { type: String, required: true },
//     description: { type: String, required: true },
//     reviews: [reviewSchema],
//     rating: {
//       type: Number,
//       required: true,
//       default: 0,
//     },

//     numReviews: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     price: { type: Number, required: true, default: 0 },
//     countInStock: { type: Number, required: true, default: 0 },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Product = mongoose.model("Product", productSchema);

// export default Product;

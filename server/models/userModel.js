// FILE: server/models/userModel.js (Updated)

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the schema for an item within the cart
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product', // Creates a reference to the 'Product' model
  },
  qty: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  // Add the cart field, which is an array of cartItemSchema
  cart: [cartItemSchema],
}, {
  timestamps: true,
});

// ... (keep the existing matchPassword and pre-save middleware functions)
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model('User', userSchema);
export default User;

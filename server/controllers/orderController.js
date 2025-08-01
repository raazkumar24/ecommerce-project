// FILE: server/controllers/orderController.js (Final Corrected Version)

import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    // --- THIS IS THE FIX ---
    // Instead of spreading the entire cart item, we now create a new object for each
    // order item, carefully selecting only the fields that our Order model expects.
    // This prevents validation errors and ensures data consistency.
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        name: x.name,
        qty: x.qty,
        // We also add robust logic to get the primary image, whether it's from
        // the new `images` array or the old `image` field.
        image: (x.images && x.images[0]) || x.image,
        price: x.price,
        product: x._id, // This links back to the original Product document
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    
    // After the order is successfully created, find the user and clear their cart.
    const user = await User.findById(req.user._id);
    if (user) {
        user.cart = []; // Set the cart array to be empty
        await user.save(); // Save the change to the database
    }

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

// @desc    Update order to delivered (Admin only)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// Export all controller functions
export {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered
};

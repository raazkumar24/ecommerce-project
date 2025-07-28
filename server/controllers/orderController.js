// FILE: server/controllers/orderController.js (Corrected with Clear Cart Logic)

import Order from '../models/orderModel.js';
import User from '../models/userModel.js'; // 1. Import the User model to modify the user's cart

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
    const order = new Order({
      orderItems: orderItems.map((x) => ({ ...x, product: x._id })),
      user: req.user._id, // Retrieved from the protected route middleware
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Save the newly created order to the database
    const createdOrder = await order.save();
    
    // --- THIS IS THE FIX ---
    // 2. After the order is successfully created, find the user...
    const user = await User.findById(req.user._id);
    if (user) {
        // ...and set their cart array to be empty.
        user.cart = [];
        // 3. Save this change back to the database.
        await user.save();
    }
    // ----------------------

    // Respond with the created order details
    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  // Populate user name and email with the order
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
  // Find all orders and populate user's id and name
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

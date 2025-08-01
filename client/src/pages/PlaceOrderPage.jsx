// FILE: client/src/pages/PlaceOrderPage.jsx (Completely Redesigned)

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import CheckoutSteps from '../components/common/CheckoutSteps';

const PlaceOrderPage = ({ navigate }) => {
  // --- CONTEXT & STATE ---
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- REDIRECT LOGIC ---
  // This effect ensures that the user has completed the previous checkout steps.
  // If not, it redirects them to the appropriate page.
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  // --- CALCULATIONS ---
  // These calculations determine the final prices for the order summary.
  const itemsPrice = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example: Free shipping over $100
  const taxPrice = 0.15 * itemsPrice; // Example: 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // --- HANDLERS ---
  // This function handles the final submission of the order to the backend.
  const placeOrderHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice: itemsPrice.toFixed(2),
          shippingPrice: shippingPrice.toFixed(2),
          taxPrice: taxPrice.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
        }),
      });

      const createdOrder = await res.json();

      if (!res.ok) {
        throw new Error(createdOrder.message || 'Could not place order');
      }
      
      clearCart(); // Clear the cart from context and localStorage
      showNotification('Order placed successfully!', 'success');
      navigate(`/order/${createdOrder._id}`); // Redirect to the order confirmation page
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
      setLoading(false);
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto"
    >
      <CheckoutSteps step1 step2 step3 step4 navigate={navigate} />
      
      <div className="w-full grid lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Shipping, Payment, and Item Details */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          {/* Shipping Details Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[#D98A7E] mb-3">Shipping</h2>
            <p className="text-gray-600"><strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}</p>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[#D98A7E] mb-3">Payment Method</h2>
            <p className="text-gray-600"><strong>Method:</strong> {paymentMethod}</p>
          </div>

          {/* Order Items Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[#D98A7E] mb-4">Order Items</h2>
            {cartItems.length === 0 ? <p>Your cart is empty</p> : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center gap-4">
                      <img src={(item.images && item.images[0])} alt={item.name} className="w-16 h-16 rounded-lg object-contain bg-gray-50" />
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </div>
                    <span className="text-gray-600">{item.qty} x ${item.price.toFixed(2)} = <span className="font-semibold text-gray-800">${(item.qty * item.price).toFixed(2)}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column: Order Summary */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
            <h2 className="text-2xl font-serif font-bold mb-4 text-center text-[#D98A7E]">Order Summary</h2>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between"><span>Items</span><span className="font-medium text-gray-800">${itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-gray-800">${shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span className="font-medium text-gray-800">${taxPrice.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 text-gray-900"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
            </div>
            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">{error}</div>}
            <motion.button
              type="button"
              className="w-full mt-6 py-3 bg-[#D4A28E] text-white font-semibold rounded-lg hover:bg-[#C8907A] disabled:bg-gray-400 transition-colors shadow-md"
              disabled={cartItems.length === 0 || loading}
              onClick={placeOrderHandler}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlaceOrderPage;

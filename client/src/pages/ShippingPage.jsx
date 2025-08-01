// FILE: client/src/pages/ShippingPage.jsx (Completely Redesigned)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/common/CheckoutSteps';

const ShippingPage = ({ navigate }) => {
  // --- CONTEXT & STATE ---
  // Get shipping address data and the save function from the CartContext
  const { cartItems, shippingAddress, saveShippingAddress } = useCart();

  // Initialize state with data from context/localStorage or with empty strings
  // This ensures the form is pre-filled if the user navigates back to this page.
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  // --- CALCULATIONS ---
  // The subtotal is calculated here to be displayed in the live order summary.
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * (item.price || 0), 0);

  // --- HANDLERS ---
  // This function runs when the user submits the form.
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the address to context and localStorage
    saveShippingAddress({ address, city, postalCode, country });
    // Navigate to the next step in the checkout process
    navigate('/payment');
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
      {/* Checkout progress bar */}
      <CheckoutSteps step1 step2 navigate={navigate} />
      
      <div className="w-full grid lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Shipping Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-3xl font-serif font-bold text-[#D98A7E] mb-6">Shipping Address</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
              <input
                id="address"
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-600 mb-1">City</label>
              <input
                id="city"
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-600 mb-1">Postal Code</label>
              <input
                id="postalCode"
                type="text"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-600 mb-1">Country</label>
              <input
                id="country"
                type="text"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"
              />
            </div>
            <motion.button 
              type="submit" 
              className="w-full py-3 mt-4 bg-[#D4A28E] text-white font-semibold rounded-lg hover:bg-[#C8907A] transition-colors shadow-md"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue to Payment
            </motion.button>
          </form>
        </motion.div>

        {/* Right Column: Order Summary */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
            <h2 className="text-2xl font-serif font-bold mb-4 text-center text-[#D98A7E]">Order Summary</h2>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 text-gray-900">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ShippingPage;

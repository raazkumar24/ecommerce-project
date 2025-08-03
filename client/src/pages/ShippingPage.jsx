// FILE: client/src/pages/ShippingPage.jsx (Responsive Redesign)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/common/CheckoutSteps';

const ShippingPage = ({ navigate }) => {
  const { cartItems, shippingAddress, saveShippingAddress } = useCart();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * (item.price || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

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
      className="px-4 sm:px-6 lg:px-8"
    >
      {/* Checkout progress bar - full width on mobile */}
      <div className="px-4 sm:px-0">
        <CheckoutSteps step1 step2 navigate={navigate} />
      </div>
      
      <div className="w-full grid lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8">
        {/* Left Column: Shipping Form - full width on mobile, 2/3 on desktop */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2 bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#D98A7E] mb-4 sm:mb-6">Shipping Address</h1>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
              <input
                id="address"
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-600 mb-1">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"
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
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"
                />
              </div>
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
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"
              />
            </div>
            <motion.button 
              type="submit" 
              className="w-full py-2 sm:py-3 mt-2 sm:mt-4 bg-[#D4A28E] text-white font-semibold rounded-lg hover:bg-[#C8907A] transition-colors shadow-md"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue to Payment
            </motion.button>
          </form>
        </motion.div>

        {/* Right Column: Order Summary - full width on mobile, appears below form */}
        <motion.div variants={itemVariants} className="lg:col-span-1 order-first lg:order-last">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-[#D98A7E]">Order Summary</h2>
            <div className="space-y-2 text-sm sm:text-base text-gray-600">
              <div className="flex justify-between">
                <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2 mt-2 text-gray-900">
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
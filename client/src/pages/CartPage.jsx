// FILE: client/src/pages/CartPage.jsx (Completely Redesigned)

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

const CartPage = ({ navigate }) => {
  // --- CONTEXT & STATE ---
  // Get all the data and functions from our cart context
  const { cartItems, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const { showNotification } = useNotification();

  // --- CALCULATIONS ---
  // The subtotal calculation now checks if `item.price` exists.
  // If it doesn't (e.g., for a deleted product), it defaults to 0 for that item.
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * (item.price || 0), 0);

  // --- HANDLERS ---
  // Handles the checkout process, first checking for any invalid items in the cart.
  const handleCheckout = () => {
    if (cartItems.some(item => !item.price)) {
        showNotification('Your cart contains an invalid item. Please remove it to proceed.', 'error');
        return;
    }
    navigate('/shipping');
  }

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h1 className="text-5xl font-serif font-bold text-[#D98A7E] mb-2">Your Shopping Cart</h1>
        <p className="text-gray-500">Review your items and proceed to checkout.</p>
      </motion.div>
      
      {cartItems.length === 0 ? (
        // If the cart is empty, show this message
        <motion.div 
          variants={itemVariants}
          className="text-center py-20 bg-white rounded-xl shadow-sm"
        >
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
          <motion.button 
            onClick={() => navigate('/products')}
            className="mt-6 bg-[#D4A28E] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#C8907A] transition-colors shadow-md"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      ) : (
        // If the cart has items, show the list and summary
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <motion.div variants={containerVariants} className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.div 
                  key={item._id} 
                  variants={itemVariants}
                  exit="exit"
                  layout
                  className={`flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-xl shadow-sm ${!item.price ? 'bg-red-50 border-red-200' : ''}`}
                >
                  <div className="flex items-center mb-4 sm:mb-0">
                    <img 
                      src={(item.images && item.images[0]) || item.image || `https://placehold.co/100x100/e2e8f0/333?text=Invalid`} 
                      alt={item.name || 'Invalid Product'}
                      className="w-20 h-20 object-contain rounded-lg mr-4 bg-gray-50"
                    />
                    <div>
                      <h2 className="font-semibold text-lg text-gray-800">{item.name || 'Product No Longer Available'}</h2>
                      <p className="text-gray-600">{item.price ? `$${item.price.toFixed(2)}` : <span className="text-red-500 font-medium">Price Unavailable</span>}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button onClick={() => item.price && decreaseQuantity(item._id)} disabled={!item.price} className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"><FiMinus /></button>
                      <span className="font-bold text-lg w-8 text-center">{item.qty}</span>
                      <button onClick={() => item.price && addToCart(item)} disabled={!item.price} className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"><FiPlus /></button>
                    </div>
                    {/* Remove Button */}
                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Order Summary */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h2 className="text-2xl font-serif font-bold mb-4 text-center text-[#D98A7E]">Order Summary</h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 text-gray-900"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
              </div>
              <motion.button 
                onClick={handleCheckout}
                className="w-full mt-6 py-3 bg-[#D4A28E] text-white font-semibold rounded-lg hover:bg-[#C8907A] disabled:bg-gray-400 transition-colors shadow-md"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </motion.div>

        </div>
      )}
    </motion.div>
  );
};

export default CartPage;

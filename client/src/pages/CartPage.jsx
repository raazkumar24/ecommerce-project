import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { FiPlus, FiMinus, FiTrash2, FiArrowLeft } from 'react-icons/fi';

const CartPage = ({ navigate }) => {
  // --- CONTEXT & STATE ---
  const { cartItems, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const { showNotification } = useNotification();

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * (item.price || 0), 0);
  const shippingFee = subtotal > 0 ? 0 : 0; // Free shipping for demo
  const total = subtotal + shippingFee;

  // --- HANDLERS ---
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotification('Your cart is empty. Add items to proceed.', 'error');
      return;
    }
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
      className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      {/* Mobile Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="lg:hidden flex items-center text-[#D98A7E] mb-4"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>

      {/* Page Header */}
      <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#D98A7E] mb-2">
          Your Shopping Cart
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          {cartItems.length > 0 
            ? `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in your cart` 
            : 'Review your items and proceed to checkout.'}
        </p>
      </motion.div>
      
      {cartItems.length === 0 ? (
        // Empty Cart State
        <motion.div 
          variants={itemVariants}
          className="text-center py-12 sm:py-20 bg-white rounded-xl shadow-sm"
        >
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Your cart is currently empty.
          </p>
          <motion.button 
            onClick={() => navigate('/products')}
            className="bg-[#D4A28E] text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg sm:rounded-xl hover:bg-[#C8907A] transition-colors shadow-md text-sm sm:text-base"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      ) : (
        // Cart with Items
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Cart Items List */}
          <motion.div 
            variants={containerVariants} 
            className="lg:col-span-2 space-y-3 sm:space-y-4"
          >
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.div 
                  key={item._id} 
                  variants={itemVariants}
                  exit="exit"
                  layout
                  className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm ${
                    !item.price ? 'bg-red-50 border border-red-200' : ''
                  }`}
                >
                  <div className="flex items-center mb-3 sm:mb-0 flex-1">
                    <img 
                      src={(item.images && item.images[0]) || item.image || `https://placehold.co/100x100/e2e8f0/333?text=Invalid`} 
                      alt={item.name || 'Invalid Product'}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg mr-3 sm:mr-4 bg-gray-50 cursor-pointer transition-transform hover:scale-105"
                      onClick={() => item._id && navigate(`/products/${item._id}`)}
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-base sm:text-lg text-gray-800 truncate">
                        {item.name || 'Product No Longer Available'}
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {item.price ? `$${item.price.toFixed(2)}` : (
                          <span className="text-red-500 font-medium">Price Unavailable</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button 
                        onClick={() => item.price && decreaseQuantity(item._id)} 
                        disabled={!item.price} 
                        className="bg-gray-200 text-gray-700 w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center text-xs sm:text-base"
                      >
                        <FiMinus />
                      </button>
                      <span className="font-bold text-sm sm:text-lg w-6 sm:w-8 text-center">
                        {item.qty}
                      </span>
                      <button 
                        onClick={() => item.price && addToCart(item)} 
                        disabled={!item.price} 
                        className="bg-gray-200 text-gray-700 w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center text-xs sm:text-base"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      className="text-red-500 hover:text-red-700 ml-2 sm:ml-0"
                    >
                      <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-1"
          >
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm sticky top-4 sm:top-6 lg:top-24">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-[#D98A7E]">
                Order Summary
              </h2>
              <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2 mt-2 text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <motion.button 
                onClick={handleCheckout}
                className="w-full mt-4 sm:mt-6 py-2 sm:py-3 bg-[#D4A28E] text-white font-semibold rounded-lg hover:bg-[#C8907A] disabled:bg-gray-400 transition-colors shadow-md text-sm sm:text-base"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={cartItems.length === 0 || cartItems.some(item => !item.price)}
              >
                Proceed to Checkout
              </motion.button>
              
              {/* Continue Shopping Button (Mobile) */}
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 py-2 border border-[#D4A28E] text-[#D4A28E] font-medium rounded-lg hover:bg-[#FFF5F0] transition-colors text-sm sm:text-base lg:hidden"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;
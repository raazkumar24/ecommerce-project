// FILE: client/src/pages/PaymentPage.jsx (Completely Redesigned)

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/common/CheckoutSteps';
import { FaPaypal, FaCreditCard } from 'react-icons/fa'; // Icons for payment methods

const PaymentPage = ({ navigate }) => {
  // --- CONTEXT & STATE ---
  // Get necessary data and functions from the CartContext
  const { cartItems, shippingAddress, paymentMethod, savePaymentMethod } = useCart();

  // If the user hasn't entered a shipping address, redirect them back to that step.
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // Initialize state with the saved payment method or default to 'PayPal'
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || 'PayPal');

  // --- CALCULATIONS ---
  // The subtotal is calculated here to be displayed in the live order summary.
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * (item.price || 0), 0);

  // --- HANDLERS ---
  // This function runs when the user submits the form.
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the chosen payment method to context and localStorage
    savePaymentMethod(selectedMethod);
    // Navigate to the final step in the checkout process
    navigate('/placeorder');
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
      {/* Checkout progress bar, now highlighting step 3 */}
      <CheckoutSteps step1 step2 step3 navigate={navigate} />
      
      <div className="w-full grid lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Payment Method Selection */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-3xl font-serif font-bold text-[#D98A7E] mb-6">Payment Method</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset>
              <legend className="text-lg font-semibold text-gray-800 mb-4">Select a Method</legend>
              <div className="space-y-4">
                {/* PayPal Option Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedMethod === 'PayPal' 
                      ? 'border-[#D4A28E] ring-2 ring-[#D4A28E] bg-[#FFF5F0]/50' 
                      : 'border-gray-300 bg-white'
                  }`}
                  onClick={() => setSelectedMethod('PayPal')}
                >
                  <div className="flex items-center">
                    <input
                      id="paypal"
                      name="paymentMethod"
                      type="radio"
                      value="PayPal"
                      checked={selectedMethod === 'PayPal'}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="w-4 h-4 text-[#D4A28E] border-gray-300 focus:ring-[#D98A7E]"
                    />
                    <label htmlFor="paypal" className="ml-3 flex items-center text-sm font-medium text-gray-700">
                      <FaPaypal className="text-2xl text-blue-800 mr-2" />
                      PayPal or Credit Card
                    </label>
                  </div>
                </motion.div>

                {/* Placeholder for another payment method like Stripe */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedMethod === 'Stripe' 
                      ? 'border-[#D4A28E] ring-2 ring-[#D4A28E] bg-[#FFF5F0]/50' 
                      : 'border-gray-300 bg-white'
                  }`}
                  onClick={() => setSelectedMethod('Stripe')}
                >
                   <div className="flex items-center">
                    <input
                      id="stripe"
                      name="paymentMethod"
                      type="radio"
                      value="Stripe"
                      checked={selectedMethod === 'Stripe'}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="w-4 h-4 text-[#D4A28E] border-gray-300 focus:ring-[#D98A7E]"
                    />
                    <label htmlFor="stripe" className="ml-3 flex items-center text-sm font-medium text-gray-700">
                      <FaCreditCard className="text-2xl text-purple-700 mr-2" />
                      Stripe (Credit Card)
                    </label>
                  </div>
                </motion.div>
              </div>
            </fieldset>

            <motion.button 
              type="submit" 
              className="w-full py-3 mt-4 bg-[#D4A28E] text-white font-semibold rounded-lg hover:bg-[#C8907A] transition-colors shadow-md"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue to Place Order
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

export default PaymentPage;

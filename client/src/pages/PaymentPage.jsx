// FILE: client/src/pages/PaymentPage.jsx

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/common/CheckoutSteps';

const PaymentPage = ({ navigate }) => {
  const { shippingAddress, paymentMethod, savePaymentMethod } = useCart();

  // If the user hasn't entered a shipping address, redirect them back
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // Initialize state with the saved payment method or default to 'PayPal'
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || 'PayPal');

  const handleSubmit = (e) => {
    e.preventDefault();
    savePaymentMethod(selectedMethod);
    // Navigate to the final "Place Order" screen
    navigate('/placeorder');
  };

  return (
    <div className="flex flex-col items-center">
      <CheckoutSteps step1 step2 step3 navigate={navigate} />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Payment Method</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset>
            <legend className="text-lg font-medium">Select Method</legend>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  id="paypal"
                  name="paymentMethod"
                  type="radio"
                  value="PayPal"
                  checked={selectedMethod === 'PayPal'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                  PayPal or Credit Card
                </label>
              </div>
              {/* You could add other payment methods here later */}
            </div>
          </fieldset>

          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;

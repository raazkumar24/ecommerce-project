// FILE: client/src/pages/CartPage.jsx (Corrected and Enhanced)

import React from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

const CartPage = ({ navigate }) => {
  // Get all the data and functions from our cart context
  const { cartItems, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const { showNotification } = useNotification();

  // --- THIS IS THE FIX (Part 1) ---
  // The subtotal calculation now checks if `item.price` exists.
  // If it doesn't (e.g., for a deleted product), it defaults to 0 for that item.
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * (item.price || 0), 0);

  const handleCheckout = () => {
    if (cartItems.some(item => !item.price)) {
        showNotification('Your cart contains an invalid item. Please remove it to proceed.', 'error');
        return;
    }
    navigate('/shipping');
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        // If the cart is empty, show this message
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
          <button 
            onClick={() => navigate('/products')}
            className="mt-4 bg-blue-600 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        // If the cart has items, show the list and summary
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className={`flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg ${!item.price ? 'bg-red-50 border-red-200' : ''}`}>
                <div className="flex items-center mb-4 sm:mb-0">
                  <img 
                    src={item.image || `https://placehold.co/100x100/e2e8f0/333?text=Invalid`} 
                    alt={item.name || 'Invalid Product'}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{item.name || 'Product No Longer Available'}</h2>
                    {/* --- THIS IS THE FIX (Part 2) --- */}
                    {/* We check if price exists before calling .toFixed() */}
                    <p className="text-gray-600">{item.price ? `$${item.price.toFixed(2)}` : <span className="text-red-500 font-medium">Price Unavailable</span>}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Quantity Controls (disabled for invalid items) */}
                  <div className="flex items-center space-x-3">
                    <button onClick={() => item.price && decreaseQuantity(item._id)} disabled={!item.price} className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-gray-300 disabled:opacity-50">-</button>
                    <span className="font-bold text-lg">{item.qty}</span>
                    <button onClick={() => item.price && addToCart(item)} disabled={!item.price} className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-gray-300 disabled:opacity-50">+</button>
                  </div>
                  {/* Remove Button */}
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;

// FILE: client/src/pages/PlaceOrderPage.jsx (Corrected with Relative API Path)

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext'; // Import for better error messages
import CheckoutSteps from '../components/common/CheckoutSteps';

const PlaceOrderPage = ({ navigate }) => {
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
  const { userInfo } = useAuth();
  const { showNotification } = useNotification(); // Use the notification system

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if essential information is missing
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  // --- Calculations ---
  const itemsPrice = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example shipping logic
  const taxPrice = 0.15 * itemsPrice; // Example 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      // --- THIS IS THE FIX ---
      // The URL now uses a relative path, which will be handled by the Vite proxy.
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
      showNotification(err.message, 'error'); // Show error notification
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <CheckoutSteps step1 step2 step3 step4 navigate={navigate} />
      <div className="w-full lg:w-4/5 grid lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold mb-2">Shipping</h2>
            <p><strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}</p>
          </div>
          <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold mb-2">Payment Method</h2>
            <p><strong>Method:</strong> {paymentMethod}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Order Items</h2>
            {cartItems.length === 0 ? <p>Your cart is empty</p> : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                    <div className="flex items-center">
                      <img src={item.image || `https://placehold.co/100x100/e2e8f0/333?text=${encodeURIComponent(item.name)}`} alt={item.name} className="w-16 h-16 rounded mr-4" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-gray-600">{item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="border p-6 rounded-lg bg-white shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Items</span><span>${itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${taxPrice.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
            </div>
            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">{error}</div>}
            <button
              type="button"
              className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors shadow-md"
              disabled={cartItems.length === 0 || loading}
              onClick={placeOrderHandler}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;

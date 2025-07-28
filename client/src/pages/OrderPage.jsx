// FILE: client/src/pages/OrderPage.jsx (Corrected with Relative API Paths)

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Rating from '../components/common/Rating'; // Assuming Rating component is used for display

const OrderPage = ({ id, navigate }) => {
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  // Using useCallback to memoize the fetch function for performance
  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      // --- THIS IS THE FIX (Part 1) ---
      // The URL now starts with a `/` to make it an absolute path from the domain root.
      const res = await fetch(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch order');
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (userInfo) {
      fetchOrder();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate, fetchOrder]);

  const deliverHandler = async () => {
    setLoadingDeliver(true);
    try {
      // --- THIS IS THE FIX (Part 2) ---
      // This URL also now starts with a `/`.
      const res = await fetch(`/api/orders/${id}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to mark as delivered');
      
      showNotification('Order marked as delivered!', 'success');
      fetchOrder(); // Re-fetch the order to get the updated status

    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoadingDeliver(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column: Order Details */}
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Order #{order._id}</h1>
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Shipping</h2>
          <p><strong>Name:</strong> {order.user.name}</p>
          <p><strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-blue-600">{order.user.email}</a></p>
          <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
          <div className={`mt-2 p-2 rounded text-center font-medium ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
          </div>
        </div>
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
          <p><strong>Method:</strong> {order.paymentMethod}</p>
          <div className={`mt-2 p-2 rounded text-center font-medium ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {order.isPaid ? 'Paid' : 'Not Paid'}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems.map(item => (
              <div key={item.product} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <img src={item.image || `https://placehold.co/100x100/e2e8f0/333?text=${encodeURIComponent(item.name)}`} alt={item.name} className="w-16 h-16 rounded mr-4" />
                  <span>{item.name}</span>
                </div>
                <span>{item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-1">
        <div className="border p-4 rounded-lg bg-white shadow">
          <h2 className="text-xl font-bold mb-4 text-center">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
          </div>
          
          {/* Admin-only "Mark as Delivered" button */}
          {userInfo && userInfo.isAdmin && !order.isDelivered && (
            <div className="mt-6">
              <button
                type="button"
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                onClick={deliverHandler}
                disabled={loadingDeliver}
              >
                {loadingDeliver ? 'Marking...' : 'Mark as Delivered'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;

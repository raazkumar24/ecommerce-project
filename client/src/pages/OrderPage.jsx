// FILE: client/src/pages/OrderPage.jsx (Completely Redesigned)

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FiCheckCircle, FiTruck, FiArrowLeft } from 'react-icons/fi'; // Added FiArrowLeft

const OrderPage = ({ id, navigate }) => {
  // --- STATE MANAGEMENT ---
  // Context hooks for user info and notifications
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  
  // State for the order data, loading UI, and any errors
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  // --- DATA FETCHING ---
  // Using useCallback to memoize the fetch function for performance.
  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
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

  // This effect runs when the component mounts or when the user or order ID changes.
  useEffect(() => {
    if (userInfo) {
      fetchOrder();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate, fetchOrder]);

  // --- HANDLERS ---
  // This handler is for admins to mark an order as delivered.
  const deliverHandler = async () => {
    setLoadingDeliver(true);
    try {
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

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  // --- RENDER LOGIC ---
  if (loading) return <div className="text-center py-20">Loading order details...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto"
    >
      {/* --- NEW: Back Button for Admins --- */}
      {userInfo && userInfo.isAdmin && (
        <motion.button 
          onClick={() => navigate('/admin/orderlist')} 
          className="mb-8 flex items-center text-gray-600 hover:text-[#D98A7E] transition-colors group"
          variants={itemVariants}
        >
          <FiArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to All Orders
        </motion.button>
      )}

      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-serif font-bold text-[#D98A7E]">Order Details</h1>
        <p className="text-gray-500 mt-1">Order ID: {order._id}</p>
      </motion.div>
      
      <div className="w-full grid lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Shipping, Payment, and Item Details */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          {/* Shipping Details Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[#D98A7E] mb-3">Shipping</h2>
            <p className="text-gray-600"><strong>Name:</strong> {order.user.name}</p>
            <p className="text-gray-600"><strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-[#D4A28E] hover:underline">{order.user.email}</a></p>
            <p className="text-gray-600"><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            <div className={`mt-4 p-3 rounded-lg text-center font-medium text-sm ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[#D98A7E] mb-3">Payment Method</h2>
            <p className="text-gray-600"><strong>Method:</strong> {order.paymentMethod}</p>
            <div className={`mt-4 p-3 rounded-lg text-center font-medium text-sm ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {order.isPaid ? 'Paid' : 'Not Paid'}
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[#D98A7E] mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map(item => (
                <div key={item.product} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <img src={item.image || `https://placehold.co/100x100/e2e8f0/333?text=Image`} alt={item.name} className="w-16 h-16 rounded-lg object-contain bg-gray-50" />
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-gray-600">{item.qty} x ${item.price.toFixed(2)} = <span className="font-semibold text-gray-800">${(item.qty * item.price).toFixed(2)}</span></span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Order Summary */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
            <h2 className="text-2xl font-serif font-bold mb-4 text-center text-[#D98A7E]">Order Summary</h2>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between"><span>Items</span><span className="font-medium text-gray-800">${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-gray-800">${order.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span className="font-medium text-gray-800">${order.taxPrice.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 text-gray-900"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
            </div>
            
            {/* Admin-only "Mark as Delivered" button */}
            {userInfo && userInfo.isAdmin && !order.isDelivered && (
              <div className="mt-6">
                <motion.button
                  type="button"
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-md flex items-center justify-center gap-2"
                  onClick={deliverHandler}
                  disabled={loadingDeliver}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiTruck />
                  {loadingDeliver ? 'Marking...' : 'Mark as Delivered'}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderPage;

// FILE: client/src/pages/OrderPage.jsx (Responsive Redesign)

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FiCheckCircle, FiTruck, FiArrowLeft } from 'react-icons/fi';

const OrderPage = ({ id, navigate }) => {
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

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
      const res = await fetch(`/api/orders/${id}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to mark as delivered');
      
      showNotification('Order marked as delivered!', 'success');
      fetchOrder();
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoadingDeliver(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  if (loading) return <div className="text-center py-12 sm:py-20">Loading order details...</div>;
  if (error) return <div className="text-center py-12 sm:py-20 text-red-500">Error: {error}</div>;
  if (!order) return <div className="text-center py-12 sm:py-20">Order not found.</div>;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className=" px-4 sm:px-6 lg:px-8"
    >
      {/* Back Button */}
      {userInfo && userInfo.isAdmin && (
        <motion.button 
          onClick={() => navigate('/admin/orderlist')} 
          className="mb-6 sm:mb-8 flex items-center text-sm sm:text-base text-gray-600 hover:text-[#D98A7E] transition-colors group"
          variants={itemVariants}
        >
          <FiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to All Orders
        </motion.button>
      )}

      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#D98A7E]">Order Details</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Order ID: {order._id}</p>
      </motion.div>
      
      <div className="w-full grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8">
        {/* Left Column - full width on mobile */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Shipping Details Card */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#D98A7E] mb-2 sm:mb-3">Shipping</h2>
            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
              <p><strong>Name:</strong> {order.user.name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-[#D4A28E] hover:underline">{order.user.email}</a></p>
              <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            </div>
            <div className={`mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg text-center text-xs sm:text-sm font-medium ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#D98A7E] mb-2 sm:mb-3">Payment Method</h2>
            <p className="text-sm sm:text-base text-gray-600"><strong>Method:</strong> {order.paymentMethod}</p>
            <div className={`mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg text-center text-xs sm:text-sm font-medium ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {order.isPaid ? 'Paid' : 'Not Paid'}
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#D98A7E] mb-3 sm:mb-4">Order Items</h2>
            <div className="space-y-3 sm:space-y-4">
              {order.orderItems.map(item => (
                <div key={item.product} className="flex justify-between items-center border-b border-gray-100 pb-3 sm:pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <img 
                      src={item.image || `https://placehold.co/100x100/e2e8f0/333?text=Image`} 
                      alt={item.name} 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-contain bg-gray-50" 
                    />
                    <span className="text-sm sm:text-base font-medium text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {item.qty} x ${item.price.toFixed(2)} = <span className="font-semibold text-gray-800">${(item.qty * item.price).toFixed(2)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - appears first on mobile */}
        <motion.div variants={itemVariants} className="lg:col-span-1 order-first lg:order-last">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-[#D98A7E]">Order Summary</h2>
            <div className="space-y-2 text-sm sm:text-base text-gray-600">
              <div className="flex justify-between"><span>Items</span><span className="font-medium text-gray-800">${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-gray-800">${order.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span className="font-medium text-gray-800">${order.taxPrice.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2 mt-2 text-gray-900">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Admin Delivery Button */}
            {userInfo && userInfo.isAdmin && !order.isDelivered && (
              <div className="mt-4 sm:mt-6">
                <motion.button
                  type="button"
                  className="w-full py-2 sm:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-md flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                  onClick={deliverHandler}
                  disabled={loadingDeliver}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiTruck className="h-4 w-4" />
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
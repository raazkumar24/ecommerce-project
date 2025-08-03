// FILE: client/src/pages/adminpages/OrderListPage.jsx (Completely Redesigned)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../../context/AuthContext";
// --- THIS IS THE FIX ---
// The FiTruck icon was missing from the import statement.
import { FiEye, FiCheckCircle, FiTruck } from 'react-icons/fi'; // Icons for a polished look

const OrderListPage = ({ navigate }) => {
  // --- STATE MANAGEMENT ---
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA FETCHING ---
  // This effect fetches all orders from the API when the component mounts.
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // --- RENDER LOGIC ---
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#D98A7E]">Order Management</h1>
          <p className="text-gray-500 mt-1">View and manage all customer orders.</p>
        </motion.div>

        {/* Loading & Error States */}
        {loading && <p className="text-center py-12">Loading orders...</p>}
        {error && <p className="text-center py-12 text-red-500">{error}</p>}

        {/* Orders Grid */}
        {!loading && !error && (
          <AnimatePresence>
            {orders.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    variants={itemVariants}
                    layout
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col"
                  >
                    <div className="flex justify-between items-start border-b pb-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">ORDER ID</p>
                        <p className="font-mono text-sm text-gray-800">{order._id}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {order.isPaid ? 'PAID' : 'NOT PAID'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm flex-grow">
                      <p><strong>User:</strong> {order.user ? order.user.name : 'N/A'}</p>
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p><strong>Total:</strong> <span className="font-bold text-lg text-[#5C3A2E]">${order.totalPrice.toFixed(2)}</span></p>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {order.isDelivered ? (
                          <span className="flex items-center text-sm text-green-600"><FiCheckCircle className="mr-1"/> Delivered</span>
                        ) : (
                          <span className="flex items-center text-sm text-amber-600"><FiTruck className="mr-1"/> Pending</span>
                        )}
                      </div>
                      <button 
                        onClick={() => navigate(`/order/${order._id}`)} 
                        className="flex items-center gap-1 text-sm font-semibold text-[#D98A7E] hover:text-[#C8907A] transition-colors"
                      >
                        View Details <FiEye />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-gray-500">There are currently no orders to display.</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default OrderListPage;

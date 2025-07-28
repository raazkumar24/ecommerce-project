// FILE: client/src/pages/ProfilePage.jsx (Enhanced and Redesigned with Review Button)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ProfilePage = ({ navigate }) => {
  // --- HOOKS ---
  const { userInfo, updateUserInfo } = useAuth();
  const { showNotification } = useNotification();

  // --- STATE MANAGEMENT ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoadingOrders(true);
      setError(null);
      try {
        const res = await fetch('api/orders/myorders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not fetch orders.');
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      fetchMyOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // --- HANDLERS ---
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    setLoadingUpdate(true);
    try {
      const res = await fetch('api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      
      updateUserInfo(data);
      showNotification('Profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
      setIsEditModalOpen(false);
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoadingUpdate(false);
    }
  };

  // --- ANIMATION VARIANTS ---
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: User Profile Card */}
        <div className="md:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-md text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
              {userInfo?.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{userInfo?.name}</h2>
            <p className="text-gray-500">{userInfo?.email}</p>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="mt-6 w-full py-2 px-4 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition"
            >
              Edit Profile
            </button>
          </motion.div>
        </div>

        {/* Right Column: Order History */}
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>
            {loadingOrders ? <p>Loading orders...</p> : error ? (
              <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
            ) : (
              <div className="space-y-6">
                {orders.length === 0 ? <p className="text-gray-500">You have no past orders.</p> :
                  orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Order ID: <span className="font-normal text-gray-600">{order._id}</span></p>
                          <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <button onClick={() => navigate(`/order/${order._id}`)} className="bg-gray-100 text-gray-700 text-xs font-semibold py-1 px-3 rounded-full hover:bg-gray-200 transition">
                            View Details
                          </button>
                        </div>
                      </div>
                      
                      {/* --- THIS IS THE FIX --- */}
                      {/* List of items within the order, with the conditional "Write a Review" button */}
                      <div className="space-y-2">
                        {order.orderItems.map(item => (
                          <div key={item.product} className="flex justify-between items-center">
                            <span className="text-gray-700">{item.name}</span>
                            {/* Only show the button if the order has been delivered */}
                            {order.isDelivered && (
                              <button 
                                onClick={() => navigate(`/products/${item.product}`)}
                                className="text-indigo-600 hover:underline text-sm font-medium"
                              >
                                Write a Review
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label className="font-medium text-gray-700">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">New Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep the same" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={loadingUpdate} className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition">
                    {loadingUpdate ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfilePage;

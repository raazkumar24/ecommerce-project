// FILE: client/src/pages/ProfilePage.jsx (Responsive Enhanced)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FiEdit2, FiPackage, FiCheckCircle, FiChevronRight } from 'react-icons/fi';

const ProfilePage = ({ navigate }) => {
  // Context hooks
  const { userInfo, updateUserInfo } = useAuth();
  const { showNotification } = useNotification();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Order history state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch orders on mount
  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoadingOrders(true);
      setError(null);
      try {
        const res = await fetch('/api/orders/myorders', {
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

  // Handle profile update
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    setLoadingUpdate(true);
    try {
      const res = await fetch('/api/users/profile', {
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* Mobile Header */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-[#D98A7E]">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: User Profile Card */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#FADCD9] to-[#D4A28E] flex items-center justify-center text-white font-bold text-3xl sm:text-4xl mb-3 sm:mb-4 shadow-inner">
                  {userInfo?.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">{userInfo?.name}</h2>
                <p className="text-gray-500 text-sm sm:text-base text-center">{userInfo?.email}</p>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="mt-4 sm:mt-6 w-full py-2 px-4 bg-[#FFF5F0] text-[#D98A7E] font-semibold rounded-lg hover:bg-[#FADCD9] transition flex items-center justify-center gap-2"
                >
                  <FiEdit2 size={16} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Order History */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#D98A7E] mb-4 sm:mb-6">My Orders</h2>
              
              {loadingOrders ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex flex-col items-center">
                    <FiPackage className="text-gray-300" size={48} />
                    <p className="mt-2 text-gray-500">Loading your orders...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="p-3 bg-red-100 text-red-700 rounded text-sm sm:text-base">{error}</div>
              ) : (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 sm:py-10">
                      <FiPackage className="mx-auto text-gray-300" size={48} />
                      <p className="mt-2 text-gray-500">You have no past orders.</p>
                      <button 
                        onClick={() => navigate('/')}
                        className="mt-4 text-[#D98A7E] font-medium hover:underline"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 sm:pb-3 mb-2 sm:mb-3">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                              Order ID: <span className="font-mono font-normal text-gray-600 text-xs sm:text-sm">{order._id}</span>
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="mt-1 sm:mt-0">
                            <button 
                              onClick={() => navigate(`/order/${order._id}`)}
                              className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold py-1 px-2 sm:px-3 rounded-full hover:bg-gray-200 transition"
                            >
                              <span>Details</span>
                              <FiChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          {order.orderItems.slice(0, 3).map(item => (
                            <div key={item.product} className="flex justify-between items-center text-sm sm:text-base">
                              <span className="text-gray-700 truncate max-w-[160px] sm:max-w-none">{item.name}</span>
                              {order.isDelivered && (
                                <button 
                                  onClick={() => navigate(`/products/${item.product}`)}
                                  className="text-[#D98A7E] hover:underline text-xs sm:text-sm font-medium whitespace-nowrap"
                                >
                                  Write Review
                                </button>
                              )}
                            </div>
                          ))}
                          {order.orderItems.length > 3 && (
                            <p className="text-xs text-gray-500 mt-1">
                              +{order.orderItems.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

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
              className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">Update Profile</h2>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={submitHandler} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 text-sm sm:text-base">Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition text-sm sm:text-base" 
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 text-sm sm:text-base">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition text-sm sm:text-base" 
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 text-sm sm:text-base">New Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Leave blank to keep the same" 
                    className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition text-sm sm:text-base" 
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 text-sm sm:text-base">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition text-sm sm:text-base" 
                  />
                </div>
                <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)} 
                    className="w-full py-2 sm:py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loadingUpdate} 
                    className="w-full py-2 sm:py-3 px-4 bg-[#D4A28E] text-white font-semibold rounded-lg hover:bg-[#C8907A] disabled:bg-gray-400 transition text-sm sm:text-base flex items-center justify-center gap-2"
                  >
                    {loadingUpdate ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
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
// FILE: client/src/pages/adminpages/UserEditPage.jsx (Completely Redesigned)

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { FiArrowLeft } from 'react-icons/fi';

const UserEditPage = ({ id, navigate }) => {
  // --- STATE MANAGEMENT ---
  // Context hooks for user info and notifications
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();

  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // State for UI status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // --- DATA FETCHING ---
  // This effect fetches the specific user's details when the component mounts.
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
        
        // Pre-fill the form with the fetched user data
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo && userInfo.isAdmin) {
      fetchUserDetails();
    } else {
      navigate('/login');
    }
  }, [id, userInfo, navigate]);

  // --- HANDLERS ---
  // Handles the form submission to update the user's details.
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ name, email, isAdmin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update user');
      
      showNotification('User updated successfully!', 'success');
      navigate('/admin/userlist');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoadingUpdate(false);
    }
  };

  // --- RENDER LOGIC ---
  if (loading) return <p className="text-center py-12">Loading user data...</p>;
  if (error) return <p className="text-center py-12 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back Button */}
          <button 
            onClick={() => navigate('/admin/userlist')} 
            className="mb-8 flex items-center text-gray-600 hover:text-[#D98A7E] transition-colors group"
          >
            <FiArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to User List
          </button>
          
          {/* Page Header */}
          <h1 className="text-4xl font-serif font-bold text-[#D98A7E]">Edit User</h1>
          <p className="text-gray-500 mt-1 mb-8">Update the user's details and permissions.</p>
        </motion.div>
        
        {/* Main Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-2xl shadow-sm"
        >
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
              <input 
                id="name" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
              <input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition" 
              />
            </div>
            <div className="flex items-center pt-2">
              <input 
                type="checkbox" 
                id="isAdmin" 
                checked={isAdmin} 
                onChange={(e) => setIsAdmin(e.target.checked)} 
                className="h-4 w-4 text-[#D4A28E] border-gray-300 rounded focus:ring-[#D98A7E]" 
              />
              <label htmlFor="isAdmin" className="ml-3 block text-sm font-medium text-gray-800">
                Is Admin
              </label>
            </div>
            <div className="pt-4">
              <motion.button 
                type="submit" 
                disabled={loadingUpdate} 
                className="w-full py-3 bg-[#D4A28E] text-white font-semibold rounded-lg hover:bg-[#C8907A] transition-colors shadow-md disabled:bg-gray-400"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {loadingUpdate ? 'Updating...' : 'Update User'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UserEditPage;

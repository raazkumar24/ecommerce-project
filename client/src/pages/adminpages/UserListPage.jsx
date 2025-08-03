// FILE: client/src/pages/adminpages/UserListPage.jsx (Completely Redesigned)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
// Import icons for a more polished UI
import { FiSearch, FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const UserListPage = ({ navigate }) => {
  // --- STATE MANAGEMENT ---
  // Context hooks for user info and notifications
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  
  // State for user data and UI status
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for client-side search functionality
  const [searchTerm, setSearchTerm] = useState('');

  // --- DATA FETCHING ---
  // This function fetches all users from the API. It's wrapped in a state
  // variable to be easily callable for refreshing the list after a deletion.
  const [fetchUsers, setFetchUsers] = useState(() => async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  });

  // This effect fetches the initial list of users when the component mounts.
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate, fetchUsers]);

  // --- HANDLERS ---
  // Handles the deletion of a user.
  const deleteHandler = async (id) => {
    // Prevent admins from deleting themselves
    if (id === userInfo._id) {
      showNotification('You cannot delete your own admin account.', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not delete user');
        showNotification('User deleted successfully', 'success');
        fetchUsers(); // Refresh the list after deletion
      } catch (err) {
        showNotification(err.message, 'error');
      }
    }
  };

  // --- DERIVED STATE (FILTERING) ---
  // This logic filters the user list on the client-side based on the search term.
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

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
          <h1 className="text-4xl font-bold text-[#D98A7E]">User Management</h1>
          <p className="text-gray-500 mt-1">View, edit, and manage all registered users.</p>
        </motion.div>

        {/* Search Controls */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-[#D4A28E] focus:outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Loading & Error States */}
        {loading && <p className="text-center py-12">Loading users...</p>}
        {error && <p className="text-center py-12 text-red-500">{error}</p>}

        {/* Users Table */}
        {!loading && !error && (
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Status</th>
                    <th className="py-3 px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user._id}</div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <a href={`mailto:${user.email}`} className="text-gray-600 hover:text-[#D98A7E]">{user.email}</a>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          {user.isAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                              <FiCheckCircle /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                              <FiXCircle /> User
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button onClick={() => navigate(`/admin/user/${user._id}/edit`)} className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"><FiEdit /></button>
                            <button onClick={() => deleteHandler(user._id)} className="p-2 rounded-md hover:bg-red-50 text-red-500 transition-colors"><FiTrash2 /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UserListPage;

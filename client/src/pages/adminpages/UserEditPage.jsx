// FILE: client/src/pages/UserEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const UserEditPage = ({ id, navigate }) => {
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`api/users/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
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

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      const res = await fetch(`api/users/${id}`, {
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

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">Is Admin</label>
          </div>
          <button type="submit" disabled={loadingUpdate} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {loadingUpdate ? 'Updating...' : 'Update User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;

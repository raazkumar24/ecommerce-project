// FILE: client/src/pages/UserListPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const UserListPage = ({ navigate }) => {
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('api/users', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
      setUsers(data);
    } catch (err)      {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`api/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not delete user');
        showNotification('User deleted successfully', 'success');
        fetchUsers(); // Refresh the list
      } catch (err) {
        showNotification(err.message, 'error');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">NAME</th>
                <th className="py-2 px-4 text-left">EMAIL</th>
                <th className="py-2 px-4 text-left">ADMIN</th>
                <th className="py-2 px-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="py-2 px-4 text-sm">{user._id}</td>
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4"><a href={`mailto:${user.email}`} className="text-blue-600">{user.email}</a></td>
                  <td className="py-2 px-4">
                    {user.isAdmin ? (
                      <i className="fas fa-check text-green-500"></i>
                    ) : (
                      <i className="fas fa-times text-red-500"></i>
                    )}
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button onClick={() => navigate(`/admin/user/${user._id}/edit`)} className="text-blue-500 hover:text-blue-700">Edit</button>
                    <button onClick={() => deleteHandler(user._id)} className="text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;

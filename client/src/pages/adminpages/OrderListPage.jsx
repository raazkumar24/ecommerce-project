// FILE: client/src/pages/OrderListPage.jsx (Corrected with Relative API Path)

import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";

const OrderListPage = ({ navigate }) => {
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // --- THIS IS THE FIX ---
        // The URL now uses a relative path, which will be handled by the Vite proxy.
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">USER</th>
                <th className="py-2 px-4 text-left">DATE</th>
                <th className="py-2 px-4 text-left">TOTAL</th>
                <th className="py-2 px-4 text-left">PAID</th>
                <th className="py-2 px-4 text-left">DELIVERED</th>
                <th className="py-2 px-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 px-4 text-sm">{order._id}</td>
                  <td className="py-2 px-4">{order.user && order.user.name}</td>
                  <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    {order.isPaid ? (
                      <span className="text-green-600">Paid</span>
                    ) : (
                      <span className="text-red-600">Not Paid</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {order.isDelivered ? (
                      <span className="text-green-600">{new Date(order.deliveredAt).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button onClick={() => navigate(`/order/${order._id}`)} className="bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600">
                      Details
                    </button>
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

export default OrderListPage;

// // FILE: client/src/pages/ProductListPage.jsx (Updated with Notifications)

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// // 1. Import the useNotification hook
// import { useNotification } from '../context/NotificationContext';

// const ProductListPage = ({ navigate }) => {
//   const { userInfo } = useAuth();
//   // 2. Get the showNotification function
//   const { showNotification } = useNotification();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('http://localhost:5000/api/products');
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
//       setProducts(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userInfo && userInfo.isAdmin) {
//       fetchProducts();
//     } else {
//       navigate('/login');
//     }
//   }, [userInfo, navigate]);

//   const createProductHandler = async () => {
//     if (window.confirm('Are you sure you want to create a new product?')) {
//         try {
//             const res = await fetch('http://localhost:5000/api/products', {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `Bearer ${userInfo.token}`,
//                 },
//             });
//             const createdProduct = await res.json();
//             if (!res.ok) throw new Error(createdProduct.message || 'Could not create product');
//             // 3. Replace alert with showNotification
//             showNotification('Sample product created successfully!', 'success');
//             navigate(`/admin/product/${createdProduct._id}/edit`);
//         } catch (err) {
//             // 3. Replace alert with showNotification
//             showNotification(`Error: ${err.message}`, 'error');
//         }
//     }
//   };

//   const deleteHandler = async (id) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         const res = await fetch(`http://localhost:5000/api/products/${id}`, {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Bearer ${userInfo.token}`,
//           },
//         });

//         const data = await res.json();
//         if (!res.ok) {
//           throw new Error(data.message || 'Could not delete product');
//         }
//         // 3. Replace alert with showNotification
//         showNotification('Product deleted successfully!', 'success');
//         fetchProducts();

//       } catch (err) {
//         // 3. Replace alert with showNotification
//         showNotification(`Error: ${err.message}`, 'error');
//       }
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Products</h1>
//         <button onClick={createProductHandler} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
//           + Create Product
//         </button>
//       </div>
//       {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-4 text-left">ID</th>
//                 <th className="py-2 px-4 text-left">NAME</th>
//                 <th className="py-2 px-4 text-left">PRICE</th>
//                 <th className="py-2 px-4 text-left">CATEGORY</th>
//                 <th className="py-2 px-4 text-left">BRAND</th>
//                 <th className="py-2 px-4 text-left"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product) => (
//                 <tr key={product._id} className="border-b">
//                   <td className="py-2 px-4 text-sm">{product._id}</td>
//                   <td className="py-2 px-4">{product.name}</td>
//                   <td className="py-2 px-4">${product.price}</td>
//                   <td className="py-2 px-4">{product.category}</td>
//                   <td className="py-2 px-4">{product.brand}</td>
//                   <td className="py-2 px-4 flex space-x-2">
//                     <button 
//                       onClick={() => navigate(`/admin/product/${product._id}/edit`)} 
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       Edit
//                     </button>
//                     <button onClick={() => deleteHandler(product._id)} className="text-red-500 hover:red-700">Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductListPage;



// FILE: client/src/pages/ProductListPage.jsx (Redesigned and Fixed)

// FILE: client/src/pages/ProductListPage.jsx (Complete without Pagination)

// FILE: client/src/pages/ProductListPage.jsx (Corrected and More Robust)

// FILE: client/src/pages/ProductListPage.jsx

// FILE: client/src/pages/ProductListPage.jsx (Corrected with Relative API Paths)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const ProductListPage = ({ navigate, keyword: urlKeyword = '' }) => {
  // --- STATE MANAGEMENT ---
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  
  const [products, setProducts] = useState([]); // Will hold all products from the API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(urlKeyword); // For the search input
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' }); // For table sorting

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchAllProductsForAdmin = async () => {
      try {
        setLoading(true);
        // --- THIS IS THE FIX (1/3) ---
        // The URL now uses a relative path, which will be handled by the Vite proxy.
        const res = await fetch(`/api/products/admin`, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
        
        setProducts(data); // The response is a simple array
      } catch (err) {
        setError(err.message);
        showNotification(`Error: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    // Ensure user is an admin before fetching data
    if (userInfo && userInfo.isAdmin) {
      fetchAllProductsForAdmin();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate, showNotification]); // Dependencies simplified

  // --- HANDLERS ---
  const createProductHandler = async () => {
    if (window.confirm('Create a new sample product?')) {
      try {
        // --- THIS IS THE FIX (2/3) ---
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const createdProduct = await res.json();
        if (!res.ok) throw new Error(createdProduct.message);
        
        showNotification('Sample product created!', 'success');
        navigate(`/admin/product/${createdProduct._id}/edit`);
      } catch (err) {
        showNotification(`Error: ${err.message}`, 'error');
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Permanently delete this product?')) {
      try {
        // --- THIS IS THE FIX (3/3) ---
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message);
        }
        
        showNotification('Product deleted!', 'success');
        // Refresh the product list after deletion by removing the item from local state
        const updatedProducts = products.filter(p => p._id !== id);
        setProducts(updatedProducts);
      } catch (err) {
        showNotification(`Error: ${err.message}`, 'error');
      }
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const searchHandler = (e) => {
      e.preventDefault();
      // Since we have all products, search is now client-side and doesn't need to navigate
  }

  // --- DERIVED STATE (FILTERING & SORTING) ---
  // This logic now runs on the full list of products on the client-side
  const filteredAndSortedProducts = [...products]
    .filter(p => 
        p && p.name && p.brand && p.category &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const tableRowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, x: 50 }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
              <p className="text-gray-500">Manage your product inventory</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={searchHandler} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              
              <button 
                onClick={createProductHandler}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Product
              </button>
            </div>
          </div>
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error State Message */}
        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['name', 'price', 'category', 'brand'].map((header) => (
                    <th 
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => requestSort(header)}
                    >
                      <div className="flex items-center">
                        {header.charAt(0).toUpperCase() + header.slice(1)}
                        {sortConfig.key === header && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredAndSortedProducts.filter(product => product && product._id).map((product) => (
                    <motion.tr
                      key={product._id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={product.image || `https://placehold.co/100x100/e2e8f0/333?text=${product.name.charAt(0)}`} 
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">ID: {product._id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">${(product.price || 0).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">
                          {product.countInStock > 0 ? (
                            <span className="text-green-600">In Stock ({product.countInStock})</span>
                          ) : (
                            <span className="text-red-600">Out of Stock</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{product.brand}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                            className="text-blue-600 hover:text-blue-900 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edit
                          </button>
                          <button
                            onClick={() => deleteHandler(product._id)}
                            className="text-red-600 hover:text-red-900 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductListPage;

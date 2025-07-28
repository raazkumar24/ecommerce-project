// FILE: client/src/pages/CategoryPage.jsx (Corrected with Relative API Path)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Paginate from '../components/common/Paginate';
import Rating from '../components/common/Rating';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

// This component is dynamic. It receives the `category` name from the URL via the App.jsx router.
const CategoryPage = ({ navigate, category, pageNumber = 1 }) => {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // --- HOOKS ---
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();

  // --- DATA FETCHING ---
  // This effect runs whenever the category or page number in the URL changes.
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        // We build the API URL with the specific category and page number.
        const params = new URLSearchParams();
        params.append('category', category);
        params.append('pageNumber', pageNumber);
        
        // --- THIS IS THE FIX ---
        // The URL now uses a relative path, which will be handled by the Vite proxy.
        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) throw new Error(`Could not find products for this category.`);
        
        const { products, page, pages } = await response.json();
        
        // Add a small delay for a smoother loading animation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setProducts(products);
        setPage(page);
        setPages(pages);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProductsByCategory();
  }, [category, pageNumber]); // Re-run if category or pageNumber changes

  // --- HANDLERS ---
  const handleAddToCart = (product) => {
    if (!userInfo) {
      showNotification('Please log in to add items to your cart', 'error');
      navigate('/login');
      return;
    }
    addToCart(product);
    showNotification(`${product.name} added to cart!`, 'success');
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
    hover: { y: -5, scale: 1.02, transition: { duration: 0.2 } }
  };

  // --- RENDER LOGIC ---
  return (
    <div className="px-4 py-8 container mx-auto">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        {/* The category name is capitalized and displayed dynamically */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
          {category}
        </h1>
        <p className="text-gray-500">
          Discover our premium selection in the {category} category.
        </p>
      </motion.div>

      {/* Loading State Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-4"><div className="animate-pulse flex flex-col space-y-4"><div className="bg-gray-200 rounded-lg h-52 w-full"></div><div className="space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div></div></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <h3 className="mt-2 text-lg font-medium text-gray-900">Something went wrong</h3>
          <p className="mt-1 text-gray-500">{error}</p>
        </motion.div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          <AnimatePresence>
            {products.length === 0 ? (
              <motion.div key="no-products-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500">There are currently no products in this category.</p>
              </motion.div>
            ) : (
              <motion.div
                key="products-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              >
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    whileHover="hover"
                    onHoverStart={() => setHoveredProduct(product._id)}
                    onHoverEnd={() => setHoveredProduct(null)}
                    className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group flex flex-col"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <div className="relative overflow-hidden h-60">
                      <motion.img src={product.image || `...`} alt={product.name} className="w-full h-full object-contain" transition={{ duration: 0.3 }} />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg text-gray-800 truncate">{product.name}</h3>
                      <div className="my-2"><Rating value={product.rating} text={`${product.numReviews} reviews`} /></div>
                      <div className="mt-auto flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        <motion.button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="p-2 rounded-full bg-indigo-100 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" whileTap={{ scale: 0.9 }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12">
            {/* This Paginate component will now need to know it's on a category page */}
            <Paginate pages={pages} page={page} category={category} navigate={navigate} />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;

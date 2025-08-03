import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Paginate from '../components/common/Paginate';
import Rating from '../components/common/Rating';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const CategoryPage = ({ navigate, category, pageNumber = 1 }) => {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- HOOKS ---
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        params.append('category', category);
        params.append('pageNumber', pageNumber);
        
        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) throw new Error(`Could not find products for this category.`);
        
        const { products, page, pages } = await response.json();
        
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
  }, [category, pageNumber]);

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
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 120,
        damping: 12
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 container mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#D98A7E] mb-2 capitalize">
          {category}
        </h1>
        <p className="text-sm sm:text-base text-gray-500">Discover our premium {category} collection</p>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
              <div className="animate-pulse flex flex-col space-y-3 sm:space-y-4">
                <div className="bg-gray-200 rounded-lg aspect-square w-full"></div>
                <div className="space-y-2">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          <AnimatePresence>
            {products.length === 0 ? (
              <motion.div
                key="no-products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-20"
              >
                <h3 className="mt-2 text-lg sm:text-xl font-medium text-gray-900">
                  No products found in this category
                </h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Try checking back later or browse other categories.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="products-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
              >
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    whileHover="hover"
                    className="relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg overflow-hidden cursor-pointer group flex flex-col border border-gray-100 hover:border-[#FADCD9] transition-all duration-300"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
                      <motion.img
                        src={product.images[0] || `...`}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        whileHover={{ scale: 1.05 }}
                        loading="lazy"
                      />
                      {/* Quick Add to Cart Button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2 sm:p-3 rounded-full bg-[#FADCD9] text-[#D98A7E] shadow-md hover:bg-[#D98A7E] hover:text-white transition-colors flex items-center justify-center"
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                      </motion.button>
                      {/* Category Badge */}
                      {product.category && (
                        <span className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-white/90 text-xs font-medium px-2 sm:px-3 py-1 rounded-full shadow-sm text-[#D98A7E]">
                          {product.category}
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-800 line-clamp-2 mb-1 sm:mb-2 leading-tight">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <span className="text-xs sm:text-sm text-gray-500 font-medium">
                            {product.brand}
                          </span>
                        )}
                      </div>
                      
                      <div className="my-1 sm:my-2">
                        <Rating
                          value={product.rating}
                          text={`${product.numReviews}`}
                          starSize={14}
                          animateOnHover
                          className="text-xs sm:text-sm"
                        />
                      </div>
                      
                      <div className="mt-auto flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Price</span>
                          <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#D98A7E]">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-[#FADCD9] text-[#D98A7E] font-medium hover:bg-[#D98A7E] hover:text-white transition-colors duration-300 flex items-center text-xs sm:text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="mr-1 sm:mr-2">Add</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 sm:h-4 sm:w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 sm:mt-10 md:mt-12"
          >
            <Paginate
              pages={pages}
              page={page}
              category={category}
              navigate={navigate}
            />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
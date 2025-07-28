// =======================================================================
// FILE: client/src/pages/ProductsPage.jsx (Enhanced and Redesigned)
// =======================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Paginate from '../components/common/Paginate';
import Rating from '../components/common/Rating';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ProductsPage = ({ navigate, keyword = '', pageNumber = 1 }) => {
  // --- STATE MANAGEMENT ---
  // State for the products themselves and pagination data from the API
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  // State for loading and error UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for the interactive filters and sorting
  const [filters, setFilters] = useState({ category: 'All', brand: 'All', sort: '-rating' });
  // State to manage the visibility of the filter drawer on mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- HOOKS ---
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();

  // --- DATA FETCHING ---
  // This effect re-fetches products whenever the search keyword, page number, or filters change.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Construct the API URL with all query parameters for search, pagination, and filtering.
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (filters.category !== 'All') params.append('category', filters.category);
        if (filters.brand !== 'All') params.append('brand', filters.brand);
        params.append('sort', filters.sort);
        params.append('pageNumber', pageNumber);
        
        // Use the correct relative path for the API call
        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        
        const { products, page, pages } = await response.json();
        
        // A short delay to make the loading animation feel smoother
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
    fetchProducts();
  }, [keyword, pageNumber, filters]);

  // --- HANDLERS ---
  // Handles adding an item to the cart
  const handleAddToCart = (product) => {
    if (!userInfo) {
      showNotification('Please log in to add items to your cart', 'error');
      navigate('/login');
      return;
    }
    addToCart(product);
    showNotification(`${product.name} added to cart!`, 'success');
  };
  
  // Handles changes in the filter or sort inputs
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value }));
    // When a filter changes, we want to go back to page 1 of the new results.
    // We achieve this by navigating, which will trigger the useEffect to re-fetch.
    navigate(keyword ? `/search/${keyword}/page/1` : '/products/page/1');
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  // --- STATIC DATA FOR FILTERS ---
  const categories = ['All', 'Electronics', 'Fashion', 'Home Goods', 'Sports'];
  const brands = ['All', 'Apple', 'Sony', 'Nike', 'Generic'];
  const sortOptions = [
    { label: 'Best Rating', value: '-rating' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
  ];

  // --- RENDER LOGIC ---
  // This function renders the filter sidebar, used for both desktop and the mobile drawer.
  const renderFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">Sort By</h3>
        <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
          {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">Category</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => handleFilterChange('category', cat)} className={`w-full text-left p-2 rounded-md transition ${filters.category === cat ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-gray-100'}`}>{cat}</button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">Brand</h3>
        <div className="space-y-2">
          {brands.map(brand => (
            <button key={brand} onClick={() => handleFilterChange('brand', brand)} className={`w-full text-left p-2 rounded-md transition ${filters.brand === brand ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-gray-100'}`}>{brand}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-8 container mx-auto">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {keyword ? (
            <>Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">"{keyword}"</span></>
          ) : (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Our Collection</span>
          )}
        </h1>
        <p className="text-gray-500">{keyword ? 'Search results' : 'Discover our premium selection'}</p>
      </motion.div>

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-xl shadow-sm h-fit">
          {renderFilters()}
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button onClick={() => setIsFilterOpen(true)} className="w-full p-3 bg-white rounded-lg shadow-sm flex items-center justify-center font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
              Filters & Sort
            </button>
          </div>

          {/* Loading State Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4"><div className="animate-pulse flex flex-col space-y-4"><div className="bg-gray-200 rounded-lg h-52 w-full"></div><div className="space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div></div></div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0"><svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></div>
                <div className="ml-3"><p className="text-sm text-red-700">{error}</p></div>
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              <AnimatePresence>
                {products.length === 0 ? (
                  <motion.div key="no-products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
                  </motion.div>
                ) : (
                  <motion.div key="products-grid" variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                        className="relative bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer group flex flex-col border border-gray-100 hover:border-indigo-50 transition-all"
                        onClick={() => navigate(`/products/${product._id}`)}
                      >
                        <div className="relative overflow-hidden h-60 bg-gray-50 flex items-center justify-center p-4">
                          <motion.img src={product.image || `...`} alt={product.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="p-5 flex flex-col flex-grow space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-1 leading-tight">{product.name}</h3>
                            {product.category && (<span className="text-xs text-gray-500">{product.category}</span>)}
                          </div>
                          <div className="my-1"><Rating value={product.rating} text={`${product.numReviews} reviews`} /></div>
                          <div className="mt-auto flex justify-between items-center">
                            <div><span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span></div>
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
                <Paginate pages={pages} page={page} keyword={keyword} navigate={navigate} />
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white p-6 z-50">
              <h2 className="text-xl font-bold mb-6">Filters & Sort</h2>
              {renderFilters()}
              <button onClick={() => setIsFilterOpen(false)} className="mt-6 w-full p-3 bg-indigo-600 text-white rounded-lg font-semibold">Apply</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
// =======================================================================
// FILE: client/src/components/common/Paginate.jsx (Redesigned)
// =======================================================================

import React from 'react';
import { motion } from 'framer-motion';

// This component is designed to be highly reusable. It accepts several props
// to determine the correct URL structure for different contexts.
const Paginate = ({ pages, page, keyword = '', category = '', isAdmin = false, navigate }) => {
  // Don't show the component if there's only one page or no pages.
  if (pages <= 1) {
    return null;
  }

  // This function runs when a user clicks on a page number or control.
  const onPageClick = (e, pageNum) => {
    e.preventDefault();
    
    // Ensure the page number stays within the valid range
    if (pageNum < 1 || pageNum > pages) {
      return;
    }
    
    let basePath = '';
    
    // The logic correctly checks the context to build the right URL.
    if (isAdmin) {
        basePath = keyword ? `/admin/productlist/search/${keyword}` : '/admin/productlist';
    } else if (category) {
        basePath = `/category/${category}`;
    } else if (keyword) {
        basePath = `/search/${keyword}`;
    } else {
        basePath = '/products';
    }
    
    // Navigate to the new URL with the correct page number.
    navigate(`${basePath}/page/${pageNum}`);
  };

  const currentPage = Number(page);

  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      {/* Previous Button */}
      <motion.button
        onClick={(e) => onPageClick(e, currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 disabled:opacity-50"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </motion.button>

      {/* Page Number Buttons */}
      {[...Array(pages).keys()].map((x) => (
        <motion.button
          key={x + 1}
          onClick={(e) => onPageClick(e, x + 1)}
          // Dynamically apply styling to highlight the currently active page.
          className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
            currentPage === x + 1
              ? 'bg-[#D98A7E] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {x + 1}
        </motion.button>
      ))}

      {/* Next Button */}
       <motion.button
        onClick={(e) => onPageClick(e, currentPage + 1)}
        disabled={currentPage === pages}
        className="px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 disabled:opacity-50"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </motion.button>
    </div>
  );
};

export default Paginate;

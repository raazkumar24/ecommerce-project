// FILE: client/src/components/common/Paginate.jsx (New File)

import React from 'react';

// This component is designed to be highly reusable. It accepts several props
// to determine the correct URL structure for different contexts (admin, search, category).
const Paginate = ({ pages, page, keyword = '', category = '', isAdmin = false, navigate }) => {
  // Don't show the component if there's only one page or no pages.
  if (pages <= 1) {
    return null;
  }

  // This function runs when a user clicks on a page number.
  const onPageClick = (e, pageNum) => {
    e.preventDefault();
    
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

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* Create an array from the total number of pages and map over it to create a link for each page. */}
      {[...Array(pages).keys()].map((x) => (
        <a
          key={x + 1}
          href="#"
          onClick={(e) => onPageClick(e, x + 1)}
          // Dynamically apply styling to highlight the currently active page.
          className={`px-4 py-2 border rounded-lg transition-colors ${
            // Note: `page` can be a string from the URL, so we convert it to a number for a reliable comparison.
            Number(page) === x + 1
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {x + 1}
        </a>
      ))}
    </div>
  );
};

export default Paginate;

// FILE: client/src/components/common/Rating.jsx

import React from 'react';

const Rating = ({ value, text }) => {
  // This component renders 5 stars, filling them based on the 'value' prop
  return (
    <div className="flex items-center">
      <span>
        {/* Full Star */}
        <i className={value >= 1 ? 'fas fa-star text-yellow-500' : value >= 0.5 ? 'fas fa-star-half-alt text-yellow-500' : 'far fa-star text-yellow-500'}></i>
      </span>
      <span>
        {/* Full Star */}
        <i className={value >= 2 ? 'fas fa-star text-yellow-500' : value >= 1.5 ? 'fas fa-star-half-alt text-yellow-500' : 'far fa-star text-yellow-500'}></i>
      </span>
      <span>
        {/* Full Star */}
        <i className={value >= 3 ? 'fas fa-star text-yellow-500' : value >= 2.5 ? 'fas fa-star-half-alt text-yellow-500' : 'far fa-star text-yellow-500'}></i>
      </span>
      <span>
        {/* Full Star */}
        <i className={value >= 4 ? 'fas fa-star text-yellow-500' : value >= 3.5 ? 'fas fa-star-half-alt text-yellow-500' : 'far fa-star text-yellow-500'}></i>
      </span>
      <span>
        {/* Full Star */}
        <i className={value >= 5 ? 'fas fa-star text-yellow-500' : value >= 4.5 ? 'fas fa-star-half-alt text-yellow-500' : 'far fa-star text-yellow-500'}></i>
      </span>
      {/* Optionally display text next to the stars, like the number of reviews */}
      {text && <span className="ml-2 text-gray-600">{text}</span>}
    </div>
  );
};

// You'll need to add the Font Awesome CDN link to your `client/index.html` file's <head> section
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

export default Rating;

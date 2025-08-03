// FILE: client/src/components/common/Rating.jsx

import React from 'react';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center flex-wrap gap-x-1 gap-y-1 sm:gap-x-2 sm:gap-y-0">
      <span>
        <i className={value >= 1 ? 'fas fa-star text-yellow-500 text-base sm:text-lg' : value >= 0.5 ? 'fas fa-star-half-alt text-yellow-500 text-base sm:text-lg' : 'far fa-star text-yellow-500 text-base sm:text-lg'}></i>
      </span>
      <span>
        <i className={value >= 2 ? 'fas fa-star text-yellow-500 text-base sm:text-lg' : value >= 1.5 ? 'fas fa-star-half-alt text-yellow-500 text-base sm:text-lg' : 'far fa-star text-yellow-500 text-base sm:text-lg'}></i>
      </span>
      <span>
        <i className={value >= 3 ? 'fas fa-star text-yellow-500 text-base sm:text-lg' : value >= 2.5 ? 'fas fa-star-half-alt text-yellow-500 text-base sm:text-lg' : 'far fa-star text-yellow-500 text-base sm:text-lg'}></i>
      </span>
      <span>
        <i className={value >= 4 ? 'fas fa-star text-yellow-500 text-base sm:text-lg' : value >= 3.5 ? 'fas fa-star-half-alt text-yellow-500 text-base sm:text-lg' : 'far fa-star text-yellow-500 text-base sm:text-lg'}></i>
      </span>
      <span>
        <i className={value >= 5 ? 'fas fa-star text-yellow-500 text-base sm:text-lg' : value >= 4.5 ? 'fas fa-star-half-alt text-yellow-500 text-base sm:text-lg' : 'far fa-star text-yellow-500 text-base sm:text-lg'}></i>
      </span>
      {text && <span className="ml-2 text-xs sm:text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating;

import React, { useState } from 'react';

const SearchBox = ({ navigate, onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
    // Call the onSearch callback to close mobile menu
    if (onSearch) onSearch();
  };

  return (
    <form 
      onSubmit={submitHandler} 
      className={`relative transition-all duration-300 w-full max-w-xs sm:max-w-sm md:max-w-md ${isFocused ? 'lg:max-w-lg' : 'lg:max-w-md'}`}
    >
      <div className={`relative flex items-center bg-[#FFF5F0] rounded-full border-2 ${isFocused ? 'border-[#D98A7E] shadow-md' : 'border-[#FADCD9]'} transition-all duration-300`}>
        {/* Search Icon */}
        <svg
          className="absolute left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 text-[#D98A7E]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        {/* Search Input */}
        <input
          type="text"
          name="q"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full pl-8 sm:pl-12 pr-6 py-1 sm:py-2 bg-transparent text-[#5C3A2E] placeholder-[#D98A7E]/70 focus:outline-none text-sm sm:text-base"
          aria-label="Search products"
        />

        {/* Search Button */}
        <button
          type="submit"
          className={`absolute right-1 sm:right-2 bg-gradient-to-r from-[#D98A7E] to-[#D4A28E] text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full hover:opacity-90 transition-all ${keyword.trim() ? 'opacity-100' : 'opacity-0'} text-xs sm:text-sm`}
          disabled={!keyword.trim()}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
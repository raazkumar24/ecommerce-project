import React, { useState } from 'react';

const SearchBox = ({ navigate }) => {
  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form 
      onSubmit={submitHandler} 
      className={`relative transition-all duration-300 ${isFocused ? 'w-96' : 'w-80'}`}
    >
      <div className={`relative flex items-center bg-gray-100 rounded-full border ${isFocused ? 'border-cyan-400 shadow-sm' : 'border-gray-200'} transition-all duration-300`}>
        <svg
          className="absolute left-4 h-5 w-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        <input
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full pl-12 pr-6 py-2 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
          aria-label="Search products"
        />
        
        <button
          type="submit"
          className={`absolute right-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-4 py-1 rounded-full hover:opacity-90 transition-all ${isFocused ? 'opacity-100' : 'opacity-0'}`}
        >
          Go
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
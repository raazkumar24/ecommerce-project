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
       <div className={`relative flex items-center bg-[#FFF5F0] rounded-full border-2 ${isFocused ? 'border-[#D98A7E] shadow-md' : 'border-[#FADCD9]'} transition-all duration-300`}>
        {/* Search Icon */}
        <svg
          className="absolute left-4 h-5 w-5 text-[#D98A7E]"
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
          className="w-full pl-12 pr-6 py-2 bg-transparent text-[#5C3A2E] placeholder-[#D98A7E]/70 focus:outline-none"
          aria-label="Search products"
        />

        {/* Search Button */}
        <button
          type="submit"
          className={`absolute right-2 bg-gradient-to-r from-[#D98A7E] to-[#D4A28E] text-white px-4 py-1 rounded-full hover:opacity-90 transition-all ${keyword.trim() ? 'opacity-100' : 'opacity-0'}`}
          disabled={!keyword.trim()}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
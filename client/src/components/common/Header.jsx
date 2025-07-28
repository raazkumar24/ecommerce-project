// FILE: client/src/components/common/Header.jsx (Corrected Cart Count Logic)

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchBox from "./SearchBox";

const Header = ({ navigate }) => {
  // --- STATE MANAGEMENT ---
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- DERIVED STATE (THE FIX) ---
  // The cart count is now calculated by the number of unique items (the length of the array),
  // not by summing the quantities of each item. This is the correct logic.
  const cartItemCount = cartItems.length;

  // --- SIDE EFFECTS ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HANDLERS ---
  const onNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    setIsMenuOpen(false);
  };
  
  // --- ANIMATION VARIANTS ---
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } },
  };

  // --- STATIC DATA ---
  const categories = [
    { name: "Electronics", icon: "💻" },
    { name: "Fashion", icon: "👕" },
    { name: "Home Goods", icon: "🛋️" },
    { name: "Sports", icon: "⚽️" },
  ];

  return (
    <>
      {/* Main Header Element */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/80 backdrop-blur-md shadow-md py-1 sm:py-2" 
            : "bg-white/50 py-2 sm:py-3"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => onNavClick(e, "/")}
              className="group relative text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 text-transparent bg-clip-text hover:from-violet-500 hover:to-indigo-600 transition-all duration-500"
            >
              E-Shop
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 group-hover:w-full transition-all duration-300"></span>
            </a>

            {/* Desktop Menu (hidden on small screens) */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Navigation Links */}
              <nav className="flex space-x-6">
                <a href="/" onClick={(e) => onNavClick(e, "/")} className="relative group text-gray-700 hover:text-indigo-600 transition font-medium">Home<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span></a>
                <a href="/products" onClick={(e) => onNavClick(e, "/products")} className="relative group text-gray-700 hover:text-indigo-600 transition font-medium">Products<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span></a>
                
                {/* Categories Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition font-medium">
                    <span>Categories</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    whileInView="visible"
                    className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-1 z-50 hidden group-hover:block border border-gray-100"
                  >
                    {categories.map((cat) => (
                      <a key={cat.name} href={`/category/${cat.name.toLowerCase()}`} onClick={(e) => onNavClick(e, `/category/${cat.name.toLowerCase()}`)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                        <span className="mr-3 text-lg">{cat.icon}</span>
                        {cat.name}
                      </a>
                    ))}
                  </motion.div>
                </div>
              </nav>

              {/* Right-Side Actions: Cart, Admin, and User/Auth */}
              <div className="flex items-center space-x-6 border-l border-gray-200 pl-6">
                <SearchBox navigate={navigate} />
                <a href="/cart" onClick={(e) => onNavClick(e, "/cart")} className="relative text-gray-600 hover:text-indigo-600 transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <AnimatePresence>
                    {cartItemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                      >
                        {cartItemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>

                {/* Admin Dropdown */}
                {userInfo?.isAdmin && (
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-purple-600 font-semibold">
                      <span>Admin</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      whileInView="visible"
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-1 z-50 hidden group-hover:block border border-gray-100"
                    >
                      {["Product", "Order", "User"].map((type) => (
                        <a key={type} href={`/admin/${type.toLowerCase()}list`} onClick={(e) => onNavClick(e, `/admin/${type.toLowerCase()}list`)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                          {type} Management
                        </a>
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* User Dropdown or Login Button */}
                {userInfo ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </div>
                    </button>
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      whileInView="visible"
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 hidden group-hover:block border border-gray-100"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-gray-800 font-medium">{userInfo.name}</p>
                        <p className="text-gray-500 text-sm truncate">{userInfo.email}</p>
                      </div>
                      <a href="/profile" onClick={(e) => onNavClick(e, "/profile")} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">My Profile</a>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">Sign Out</button>
                    </motion.div>
                  </div>
                ) : (
                  <a href="/login" onClick={(e) => onNavClick(e, "/login")} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors shadow">Sign In</a>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              aria-label="Toggle menu"
              className="lg:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <AnimatePresence initial={false}>
                  {isMenuOpen ? (
                    <motion.path key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <motion.path key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </AnimatePresence>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white/95 backdrop-blur-md shadow-lg"
            >
              <div className="container mx-auto px-6 py-4">
                <div className="mb-6"><SearchBox navigate={navigate} /></div>
                <nav className="flex flex-col space-y-2">
                  {["Home", "Products", "Cart"].map((item) => (
                    <a key={item} href={`/${item === "Home" ? "" : item.toLowerCase()}`} onClick={(e) => onNavClick(e, `/${item === "Home" ? "" : item.toLowerCase()}`)} className="text-gray-700 hover:text-indigo-600 py-2 px-4 rounded-lg hover:bg-gray-50">{item}</a>
                  ))}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="px-4 pt-2 text-sm font-semibold text-gray-500">Categories</p>
                    {categories.map((cat) => (
                      <a key={cat.name} href={`/category/${cat.name.toLowerCase()}`} onClick={(e) => onNavClick(e, `/category/${cat.name.toLowerCase()}`)} className="flex items-center text-gray-700 hover:text-indigo-600 py-2 px-4 rounded-lg hover:bg-gray-50">
                        <span className="mr-3 text-lg">{cat.icon}</span>
                        {cat.name}
                      </a>
                    ))}
                  </div>
                  {/* Admin and User/Auth links for mobile */}
                  {userInfo?.isAdmin && ["Product", "Order", "User"].map((type) => (
                    <a key={type} href={`/admin/${type.toLowerCase()}list`} onClick={(e) => onNavClick(e, `/admin/${type.toLowerCase()}list`)} className="text-gray-700 hover:text-purple-500 py-2 px-4 rounded-lg hover:bg-gray-50">Admin - {type}s</a>
                  ))}
                  {userInfo ? (
                    <>
                      <a href="/profile" onClick={(e) => onNavClick(e, "/profile")} className="text-gray-700 hover:text-indigo-600 py-2 px-4 rounded-lg hover:bg-gray-50">My Profile</a>
                      <button onClick={logout} className="text-left w-full text-gray-700 hover:text-red-500 py-2 px-4 rounded-lg hover:bg-gray-50">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <a href="/login" onClick={(e) => onNavClick(e, "/login")} className="text-gray-700 hover:text-indigo-600 py-2 px-4 rounded-lg hover:bg-gray-50">Sign In</a>
                      <a href="/register" onClick={(e) => onNavClick(e, "/register")} className="text-white bg-indigo-600 font-medium py-2 px-4 rounded-full text-center hover:bg-indigo-700 shadow">Join Free</a>
                    </>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer to prevent content from being hidden behind the fixed header */}
      <div className="h-20 sm:h-24"></div>
    </>
  );
};

export default Header;

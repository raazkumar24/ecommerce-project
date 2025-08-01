// =======================================================================
// FILE: client/src/components/common/Header.jsx (Final Responsive Version)
// =======================================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchBox from "./SearchBox";

const Header = ({ navigate }) => {
  // --- STATE MANAGEMENT ---
  // State for the scroll effect on the header
  const [scrolled, setScrolled] = useState(false);
  // State for toggling the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- CONTEXT HOOKS ---
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();

  // --- DERIVED STATE ---
  // --- THIS IS THE FIX ---
  // The cart count is now calculated by the number of unique items in the cart
  // (the length of the cartItems array), not by summing the quantities.
  // This ensures that adding more of an existing item does not increase the badge count.
  const cartItemCount = cartItems.length;

  // --- SIDE EFFECTS ---
  // Adds a scroll listener to apply a subtle shadow and background effect to the header.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HANDLERS ---
  // Handles all navigation clicks and closes the mobile menu.
  const onNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    setIsMenuOpen(false);
  };
  
  // --- ANIMATION VARIANTS ---
  // Defines the animation for dropdown menus for a smooth appearance
  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  };

  // --- STATIC DATA ---
  // Category data for the dropdown menu.
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
            ? "bg-[#FFF5F0]/80 backdrop-blur-md shadow-sm" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" onClick={(e) => onNavClick(e, "/")} className="flex items-center justify-center w-12 h-12 border-2 border-[#D4A28E] rounded-full transition-transform hover:scale-105">
              <span className="text-2xl text-[#D4A28E]">♡</span>
            </a>

            {/* Desktop Menu (hidden on small screens) */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Main Navigation Links */}
              <nav className="flex items-center gap-6">
                <a href="/" onClick={(e) => onNavClick(e, "/")} className="text-gray-600 hover:text-[#D98A7E] font-medium transition-colors">Home</a>
                <a href="/products" onClick={(e) => onNavClick(e, "/products")} className="relative text-gray-600 hover:text-[#D98A7E] font-medium transition-colors">
                  Product
                  <span className="absolute -top-2 -right-4 text-xs bg-[#FADCD9] text-[#D98A7E] font-semibold px-2 py-0.5 rounded-full">New</span>
                </a>
                
                {/* Categories Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-[#D98A7E] font-medium transition-colors">
                    Categories
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 hidden group-hover:block border border-gray-100">
                    {categories.map((cat) => (
                      <a key={cat.name} href={`/category/${cat.name.toLowerCase()}`} onClick={(e) => onNavClick(e, `/category/${cat.name.toLowerCase()}`)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                        <span className="mr-3 text-lg">{cat.icon}</span>
                        {cat.name}
                      </a>
                    ))}
                  </motion.div>
                </div>
              </nav>

              {/* Right-Side Actions: Search, Cart, and User/Auth */}
              <div className="flex items-center gap-6">
                <SearchBox navigate={navigate} />
                <a href="/cart" onClick={(e) => onNavClick(e, "/cart")} className="relative text-gray-500 hover:text-[#D98A7E] transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <AnimatePresence>
                    {cartItemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-[#D98A7E] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {cartItemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>

                {/* Admin Dropdown */}
                {userInfo?.isAdmin && (
                  <div className="relative group">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-[#D98A7E] font-medium transition-colors">
                      Admin
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <motion.div variants={dropdownVariants} initial="hidden" animate="visible" className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 hidden group-hover:block border border-gray-100">
                      <a href="/admin/productlist" onClick={(e) => onNavClick(e, "/admin/productlist")} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Product Management</a>
                      <a href="/admin/orderlist" onClick={(e) => onNavClick(e, "/admin/orderlist")} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Order Management</a>
                      <a href="/admin/userlist" onClick={(e) => onNavClick(e, "/admin/userlist")} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">User Management</a>
                    </motion.div>
                  </div>
                )}

                {/* User Icon/Dropdown */}
                {userInfo ? (
                  <div className="relative group">
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FADCD9] to-[#D4A28E] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </button>
                    <motion.div variants={dropdownVariants} initial="hidden" animate="visible" className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 hidden group-hover:block border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{userInfo.name}</p>
                        <p className="text-sm text-gray-500 truncate">{userInfo.email}</p>
                      </div>
                      <a href="/profile" onClick={(e) => onNavClick(e, "/profile")} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">My Profile</a>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Sign Out</button>
                    </motion.div>
                  </div>
                ) : (
                  <a href="/login" onClick={(e) => onNavClick(e, "/login")} className="text-gray-500 hover:text-[#D98A7E] transition-colors">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </a>
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
              className="lg:hidden bg-white/95 backdrop-blur-md shadow-lg"
            >
              <nav className="container mx-auto px-6 py-4 flex flex-col">
                <div className="mb-4"><SearchBox navigate={navigate} /></div>
                <a href="/" onClick={(e) => onNavClick(e, "/")} className="py-2 px-4 rounded-lg hover:bg-gray-50">Home</a>
                <a href="/products" onClick={(e) => onNavClick(e, "/products")} className="py-2 px-4 rounded-lg hover:bg-gray-50">Products</a>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <p className="px-4 pt-2 text-sm font-semibold text-gray-500">Categories</p>
                  {categories.map((cat) => (
                    <a key={cat.name} href={`/category/${cat.name.toLowerCase()}`} onClick={(e) => onNavClick(e, `/category/${cat.name.toLowerCase()}`)} className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-50">
                      <span className="mr-3 text-lg">{cat.icon}</span>
                      {cat.name}
                    </a>
                  ))}
                </div>
                {/* All user and admin links are now correctly included in the mobile menu */}
                <div className="pt-2 border-t border-gray-200 mt-2">
                  {userInfo ? (
                    <>
                      <a href="/profile" onClick={(e) => onNavClick(e, "/profile")} className="py-2 px-4 rounded-lg hover:bg-gray-50">My Profile</a>
                      {userInfo.isAdmin && (
                        <>
                          <p className="px-4 pt-2 text-sm font-semibold text-gray-500">Admin</p>
                          <a href="/admin/productlist" onClick={(e) => onNavClick(e, "/admin/productlist")} className="py-2 px-4 rounded-lg hover:bg-gray-50">Product Management</a>
                          <a href="/admin/orderlist" onClick={(e) => onNavClick(e, "/admin/orderlist")} className="py-2 px-4 rounded-lg hover:bg-gray-50">Order Management</a>
                          <a href="/admin/userlist" onClick={(e) => onNavClick(e, "/admin/userlist")} className="py-2 px-4 rounded-lg hover:bg-gray-50">User Management</a>
                        </>
                      )}
                      <button onClick={logout} className="text-left w-full text-red-500 py-2 px-4 rounded-lg hover:bg-red-50">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <a href="/login" onClick={(e) => onNavClick(e, "/login")} className="py-2 px-4 rounded-lg hover:bg-gray-50">Sign In</a>
                      <a href="/register" onClick={(e) => onNavClick(e, "/register")} className="mt-2 text-white bg-[#D4A28E] font-medium py-2 px-4 rounded-full text-center hover:bg-[#C8907A] shadow">Join Free</a>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer to prevent content from being hidden behind the fixed header */}
      <div className="h-20"></div>
    </>
  );
};


export default Header;

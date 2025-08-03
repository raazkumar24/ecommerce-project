import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchBox from "./SearchBox";

const Header = ({ navigate }) => {
  // --- STATE MANAGEMENT ---
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState({
    categories: false,
    admin: false,
  });

  // --- CONTEXT HOOKS ---
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();

  // --- DERIVED STATE ---
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

  const toggleMobileSubmenu = (menu) => {
    setMobileSubmenuOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // --- ANIMATION VARIANTS ---
  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  // --- STATIC DATA ---
  const categories = [
    { name: "Electronics", icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )},
    { name: "Fashion", icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { name: "Home Goods", icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { name: "Sports", icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )},
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
          <div className="flex items-center justify-between h-15 sm:h-16 lg:h-20">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => onNavClick(e, "/")}
              className="flex items-center justify-center w-12 h-12 border-2 border-[#D4A28E] rounded-full transition-transform hover:scale-105"
            >
              <span className="text-2xl text-[#D4A28E]">♡</span>
            </a>

            {/* Desktop Menu (hidden on small screens) */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Main Navigation Links */}
              <nav className="flex items-center gap-6">
                <a
                  href="/"
                  onClick={(e) => onNavClick(e, "/")}
                  className="text-gray-600 hover:text-[#D98A7E] font-medium transition-colors"
                >
                  Home
                </a>
                <a
                  href="/products"
                  onClick={(e) => onNavClick(e, "/products")}
                  className="relative text-gray-600 hover:text-[#D98A7E] font-medium transition-colors"
                >
                  Product
                  <span className="absolute -top-2 -right-4 text-xs bg-[#FADCD9] text-[#D98A7E] font-semibold px-2 py-0.5 rounded-full">
                    New
                  </span>
                </a>

                {/* Categories Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-[#D98A7E] font-medium transition-colors">
                    Categories
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 hidden group-hover:block border border-gray-100"
                  >
                    {categories.map((cat) => (
                      <a
                        key={cat.name}
                        href={`/category/${cat.name.toLowerCase()}`}
                        onClick={(e) =>
                          onNavClick(e, `/category/${cat.name.toLowerCase()}`)
                        }
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        {cat.icon}
                        {cat.name}
                      </a>
                    ))}
                  </motion.div>
                </div>
              </nav>

              {/* Right-Side Actions: Search, Cart, and User/Auth */}
              <div className="flex items-center gap-6">
                <SearchBox navigate={navigate} />
                <a
                  href="/cart"
                  onClick={(e) => onNavClick(e, "/cart")}
                  className="relative text-gray-500 hover:text-[#D98A7E] transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <AnimatePresence>
                    {cartItemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-[#D98A7E] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {cartItemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>

                {/* Admin Dropdown - Responsive */}
                {userInfo?.isAdmin && (
                  <div className="relative group">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-[#D98A7E] font-medium transition-colors">
                      Admin
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 hidden group-hover:block border border-gray-100"
                    >
                      <a
                        href="/admin/productlist"
                        onClick={(e) => onNavClick(e, "/admin/productlist")}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Product Management
                      </a>
                      <a
                        href="/admin/orderlist"
                        onClick={(e) => onNavClick(e, "/admin/orderlist")}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Order Management
                      </a>
                      <a
                        href="/admin/userlist"
                        onClick={(e) => onNavClick(e, "/admin/userlist")}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        User Management
                      </a>
                    </motion.div>
                  </div>
                )}

                {/* User Icon/Dropdown */}
                {userInfo ? (
                  <div className="relative group">
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FADCD9] to-[#D4A28E] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </button>
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 hidden group-hover:block border border-gray-100"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">
                          {userInfo.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {userInfo.email}
                        </p>
                      </div>
                      <a
                        href="/profile"
                        onClick={(e) => onNavClick(e, "/profile")}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </a>
                      <button
                        onClick={logout}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </motion.div>
                  </div>
                ) : (
                  <a
                    href="/login"
                    onClick={(e) => onNavClick(e, "/login")}
                    className="text-gray-500 hover:text-[#D98A7E] transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Mobile Actions (always visible) */}
            <div className="flex lg:hidden items-center gap-4">
              {/* Cart Icon (always visible on mobile) */}
              <a
                href="/cart"
                onClick={(e) => onNavClick(e, "/cart")}
                className="relative text-gray-500 hover:text-[#D98A7E] transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-[#D98A7E] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </a>

              {/* Mobile Menu Toggle Button */}
              <button
                aria-label="Toggle menu"
                className="text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-md shadow-lg overflow-hidden"
            >
              <nav className="container mx-auto px-6 py-4 flex flex-col">
                <div className="mb-4">
                  <SearchBox
                    navigate={navigate}
                    onSearch={() => setIsMenuOpen(false)}
                  />
                </div>
                <a
                  href="/"
                  onClick={(e) => onNavClick(e, "/")}
                  className="py-3 px-4 rounded-lg hover:bg-gray-50"
                >
                  Home
                </a>
                <a
                  href="/products"
                  onClick={(e) => onNavClick(e, "/products")}
                  className="py-3 px-4 rounded-lg hover:bg-gray-50"
                >
                  Products
                </a>

                {/* Mobile Categories Submenu */}
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <button
                    onClick={() => toggleMobileSubmenu("categories")}
                    className="w-full flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50"
                  >
                    <span>Categories</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${
                        mobileSubmenuOpen.categories ? "rotate-180" : ""
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileSubmenuOpen.categories && (
                    <div className="pl-6">
                      {categories.map((cat) => (
                        <a
                          key={cat.name}
                          href={`/category/${cat.name.toLowerCase()}`}
                          onClick={(e) =>
                            onNavClick(e, `/category/${cat.name.toLowerCase()}`)
                          }
                          className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-50"
                        >
                          {cat.icon}
                          {cat.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Admin Submenu */}
                {userInfo?.isAdmin && (
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <button
                      onClick={() => toggleMobileSubmenu("admin")}
                      className="w-full flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50"
                    >
                      <span>Admin</span>
                      <svg 
                        className={`w-4 h-4 transition-transform ${
                          mobileSubmenuOpen.admin ? "rotate-180" : ""
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileSubmenuOpen.admin && (
                      <div className="pl-6">
                        <a
                          href="/admin/productlist"
                          onClick={(e) => onNavClick(e, "/admin/productlist")}
                          className="block py-2 px-4 rounded-lg hover:bg-gray-50"
                        >
                          Product Management
                        </a>
                        <a
                          href="/admin/orderlist"
                          onClick={(e) => onNavClick(e, "/admin/orderlist")}
                          className="block py-2 px-4 rounded-lg hover:bg-gray-50"
                        >
                          Order Management
                        </a>
                        <a
                          href="/admin/userlist"
                          onClick={(e) => onNavClick(e, "/admin/userlist")}
                          className="block py-2 px-4 rounded-lg hover:bg-gray-50"
                        >
                          User Management
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile User Menu */}
                <div className="pt-2 border-t border-gray-200 mt-2">
                  {userInfo ? (
                    <>
                      <a
                        href="/profile"
                        onClick={(e) => onNavClick(e, "/profile")}
                        className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </a>
                      <button
                        onClick={logout}
                        className="flex items-center w-full text-left text-red-500 py-3 px-4 rounded-lg hover:bg-red-50"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href="/login"
                        onClick={(e) => onNavClick(e, "/login")}
                        className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Sign In
                      </a>
                      <a
                        href="/register"
                        onClick={(e) => onNavClick(e, "/register")}
                        className="flex items-center justify-center mt-2 text-white bg-[#D4A28E] font-medium py-2 px-4 rounded-full hover:bg-[#C8907A] shadow"
                      >
                        Join Free
                      </a>
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
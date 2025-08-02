// FILE: client/src/pages/HomePage.jsx (Completely Redesigned & Fully Responsive)

import React, { useState, useEffect, useCallback } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Tilt from "react-parallax-tilt"; // For the 3D hover effect
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Rating from "../components/common/Rating"; // Import the Rating component

const HomePage = ({ navigate }) => {
  // --- STATE MANAGEMENT ---
  // Holds the list of products for the interactive hero showcase
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // Tracks the index of the currently displayed product in the showcase
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  // Manages the loading UI while fetching data
  const [loading, setLoading] = useState(true);
  // State for the quantity selector
  const [quantity, setQuantity] = useState(1);

  // --- HOOKS ---
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  const heroControls = useAnimation();
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.3, // Trigger when 30% of the element is visible
  });

  // --- DATA FETCHING ---
  // Fetch first 4 products to feature in the hero showcase
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products?pageNumber=1");
        if (!res.ok) throw new Error("Could not fetch products");
        const data = await res.json();

        if (data.products?.length > 0) {
          setFeaturedProducts(data.products.slice(0, 4)); // Get first 4 products
        }
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // --- ANIMATION TRIGGERS ---
  // Start hero animation when section comes into view
  useEffect(() => {
    if (heroInView) heroControls.start("visible");
  }, [heroInView, heroControls]);

  // --- HANDLERS ---
  // Handle "Buy Now" button click
  const handleBuyNow = () => {
    if (!userInfo) {
      showNotification("Please log in to make a purchase", "error");
      navigate("/login");
      return;
    }
    const productToAdd = featuredProducts[currentProductIndex];
    if (productToAdd) {
      const productWithQty = { ...productToAdd, qty: quantity };
      addToCart(productWithQty);
      showNotification(`${productToAdd.name} added to cart!`, "success");
      navigate("/cart");
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger child animations
        delayChildren: 0.3, // Delay before starting
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100, // Spring animation stiffness
      },
    },
  };

  // Get current product for display
  const currentProduct = featuredProducts[currentProductIndex];

  return (
    <div className="bg-[#FFF5F0] text-[#5C3A2E] min-h-screen font-sans">
      {/* Main Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroControls}
        variants={containerVariants}
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Content Container - Responsive grid layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-0 max-w-7xl mx-auto w-full">
          {/* Left Column: Text Content and Actions */}
          <motion.div
            variants={containerVariants}
            className="lg:col-span-1 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Main Headline - Responsive font sizes */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#D98A7E] leading-tight"
            >
              Welcome to Our Cozy Shop
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-500 uppercase tracking-widest"
            >
              Support Local Everything
            </motion.p>

            {/* Quantity Selector - Responsive sizing */}
            <motion.div
              variants={itemVariants}
              className="mt-6 sm:mt-8 md:mt-10 w-full max-w-xs"
            >
              <div className="bg-white/50 p-2 sm:p-4 rounded-xl shadow-sm border border-white">
                <label className="font-semibold text-gray-600 text-sm sm:text-base">
                  Choose your quantity
                </label>
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white text-lg font-bold shadow transition-transform hover:scale-110 active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="text-lg sm:text-xl font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white text-lg font-bold shadow transition-transform hover:scale-110 active:scale-95"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Buy Now Button - Responsive sizing */}
            <motion.button
              variants={itemVariants}
              onClick={handleBuyNow}
              className="mt-4 sm:mt-6 bg-[#D4A28E] text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl text-base sm:text-lg shadow-lg hover:bg-[#C8907A] transition-all duration-300 flex items-center gap-2 sm:gap-3"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Buy now"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Buy Now
            </motion.button>
          </motion.div>

          {/* Right Column: Product Showcase */}
          <div className="lg:col-span-1 relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center mt-8 lg:mt-0">
            {/* Background decorative circle - Responsive sizing */}
            <motion.div
              variants={itemVariants}
              className="absolute w-[80%] sm:w-[70%] md:w-[100%] h-[80%] sm:h-[70%] md:h-[100%] bg-[#FADCD9] rounded-full"
            />

            {/* Product Image with Loading State */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="w-full h-full bg-gray-200/50 rounded-3xl animate-pulse" />
              ) : (
                <motion.div
                  key={currentProduct?._id || "loading-image"}
                  className="absolute w-full h-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* 3D Tilt Effect on Product Image */}
                  <Tilt
                    tiltMaxAngleX={10}
                    tiltMaxAngleY={10}
                    className="w-full h-full"
                    glareEnable={true}
                    glareMaxOpacity={0.1}
                    glarePosition="all"
                  >
                    <div
                      className="w-full h-full flex items-center justify-center p-15 sm:p-8 cursor-pointer"
                      onClick={() =>
                        navigate(`/products/${currentProduct?._id}`)
                      }
                      aria-label={`View ${currentProduct?.name}`}
                    >
                      <img
                        src={currentProduct?.images[0]}
                        alt={currentProduct?.name}
                        className="w-full h-full object-contain drop-shadow-xl sm:drop-shadow-2xl"
                        loading="lazy"
                      />
                    </div>
                  </Tilt>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decorative Tags - Responsive positioning */}
            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.4 }}
              className="absolute top-10 sm:top-20 left-0 sm:-left-10 bg-white/80 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg text-xs sm:text-sm"
            >
              Minimalistic
            </motion.div>
            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.6 }}
              className="absolute bottom-10 sm:bottom-15 right-0 sm:-right-10 bg-white/80 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg text-xs sm:text-sm"
            >
              Super cozy!
            </motion.div>

            {/* Product Thumbnail Selector - Responsive layout (vertical on desktop, horizontal on mobile) */}
            <div className="absolute bottom-0 sm:bottom-auto sm:right-0 sm:top-1/2 sm:-translate-y-1/2 h-auto sm:h-full w-full sm:w-auto flex sm:flex-col justify-center gap-2 sm:gap-3 p-2 sm:p-3 overflow-x-auto">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl border-2 cursor-pointer overflow-hidden shadow-md sm:shadow-lg transition-all duration-300 flex-shrink-0 ${currentProductIndex === index
                      ? "border-white scale-110"
                      : "border-transparent hover:border-white/50"
                    }`}
                  onClick={() => setCurrentProductIndex(index)}
                  whileHover={{ scale: 1.1 }}
                  aria-label={`View ${product.name}`}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Shopping Link - Responsive positioning */}
        <a
          href="#deals"
          onClick={(e) => {
            e.preventDefault();
            navigate("/products");
          }}
          className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 text-gray-600 hover:text-gray-900 font-medium sm:font-semibold flex items-center gap-1 sm:gap-2 transition text-sm sm:text-base"
          aria-label="Continue shopping"
        >
          Continue shopping
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </motion.section>
    </div>
  );
};

export default HomePage;

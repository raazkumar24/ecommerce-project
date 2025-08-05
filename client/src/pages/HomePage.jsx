// // FILE: client/src/pages/HomePage.jsx (Completely Redesigned & Fully Responsive)



import React, { useState, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Rating from "../components/common/Rating";

const HomePage = ({ navigate }) => {
  // State
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  // Context/Hooks
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Derived state
  const currentProduct = featuredProducts[currentProductIndex] || null;

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1); // Reset to default quantity when product changes
  }, [currentProductIndex]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/products?limit=4");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setFeaturedProducts(data.products?.slice(0, 4) || []);
    } catch (err) {
      setError(err.message);
      showNotification("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Animation trigger
  useEffect(() => {
    if (inView && !loading) {
      controls.start("visible");
    }
  }, [inView, controls, loading]);

  // Handle product image change
  const handleProductChange = (index) => {
    setCurrentProductIndex(index);
    // Quantity will be reset by the useEffect above
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!userInfo) {
      showNotification("Please login to make a purchase", "error");
      navigate("/login");
      return;
    }
    if (!currentProduct) {
      showNotification("No product selected", "error");
      return;
    }
    try {
      addToCart({ ...currentProduct, qty: quantity });
      showNotification(`${currentProduct.name} added to cart!`, "success");
      navigate("/cart");
    } catch (err) {
      showNotification("Failed to add to cart", "error");
    }
  };

  // Navigate to product detail page
const goToDetail = (products) => {
  if (!products?._id) return;
  navigate(`/products/${products._id}`);
};


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF5F0] to-[#FADCD9]/30">
        <div className="text-center p-8 bg-white/80 rounded-xl shadow-sm max-w-md">
          <h2 className="text-2xl font-bold text-[#5C3A2E] mb-4">Error Loading Products</h2>
          <button
            onClick={fetchProducts}
            className="bg-gradient-to-r from-[#D98A7E] to-[#D4A28E] text-white font-bold py-2 px-6 rounded-lg shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <motion.section
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative min-h-[90vh] flex items-center px-6 py-16 sm:px-8 lg:px-12"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <motion.div variants={containerVariants} className="text-center lg:text-left">
            <motion.div variants={itemVariants}>
              <span className="inline-block bg-white/80 px-4 py-2 rounded-full text-sm font-medium text-[#D98A7E] shadow-sm">
                Premium Collection
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-[#5C3A2E] leading-tight"
            >
              Elevate Your <span className="text-[#D98A7E]">Everyday</span> Essentials
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0"
            >
              Handcrafted with care, designed for your comfort and style.
            </motion.p>

            {loading ? (
              <motion.div
                variants={itemVariants}
                className="mt-8 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm max-w-md mx-auto lg:mx-0"
              >
                <div className="h-64 animate-pulse rounded-lg"></div>
              </motion.div>
            ) : currentProduct ? (
              <motion.div
                variants={itemVariants}
                className="mt-8 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm max-w-md mx-auto lg:mx-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl text-[#5C3A2E]">{currentProduct.name}</h3>
                    <Rating
                      value={currentProduct.rating}
                      text={`${currentProduct.numReviews} reviews`}
                      color="#D98A7E"
                    />
                  </div>
                  <span className="text-2xl font-bold text-[#D98A7E]">
                    ${currentProduct.price.toFixed(2)}
                  </span>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg font-bold shadow"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold min-w-[2rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg font-bold shadow"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="mt-6 w-full bg-gradient-to-r from-[#D98A7E] to-[#D4A28E] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:opacity-90 transition-opacity"
                >
                  Add to Cart - ${(currentProduct.price * quantity).toFixed(2)}
                </button>
            
              </motion.div>
            ) : null}
          </motion.div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] flex items-center justify-center">
            <div className="absolute w-full h-full max-w-[500px] max-h-[500px] bg-[#FADCD9] rounded-full shadow-xl"></div>

            {currentProduct && (
              <motion.div
                key={currentProductIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: isHoveringImage ? [0, -2, 2, 0] : 0,
                }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  rotate: {
                    duration: 0.8,
                    repeat: isHoveringImage ? Infinity : 0,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }}
                className="absolute w-full h-full flex items-center justify-center p-8"
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
              >
                <motion.img
                  src={currentProduct.images?.[0]}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                />

                {/* Floating View Details Button */}
       <button
      onClick={() => goToDetail(currentProduct)}
      className="absolute top-8 right-8 z-30 bg-gradient-to-r from-[#D98A7E] via-[#FADCD9] to-[#D4A28E] text-white font-bold py-2 px-7 rounded-full shadow-2xl hover:scale-105 hover:bg-[#D98A7E] transition-all duration-300 flex items-center gap-2 border-2 border-white/80"
      style={{
        letterSpacing: "0.07em",
        fontSize: "1.15rem",
        boxShadow: "0 8px 32px 0 rgba(217, 138, 126, 0.25)",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      View Details
    </button>
              </motion.div>
            )}

            {/* PRODUCT SELECTORS */}
            {featuredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-0 right-0 flex justify-center"
              >
                <div className="flex gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  {featuredProducts.map((product, index) => (
                    <button
                      key={index}
                      onClick={() => handleProductChange(index)}
                      className={`w-12 h-12 rounded-full p-1 border-2 overflow-hidden transition-all ${
                        currentProductIndex === index
                          ? "border-white scale-110 shadow-md"
                          : "border-transparent"
                      }`}
                      aria-label={`View ${product.name}`}
                    >
                      {product?.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-full h-full object-contain"
                        loading="lazy"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;



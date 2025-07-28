import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Rating from "../common/Rating";

const FeaturedSection = ({ featuredProducts = [], navigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const featuredRef = useRef(null);
  const featuredControls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) featuredControls.start("visible");
  }, [inView, featuredControls]);

  useEffect(() => {
    if (featuredProducts.length) {
      setLoading(false);
    }
  }, [featuredProducts]);

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredProducts.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === featuredProducts.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <motion.section
      ref={featuredRef}
      initial="hidden"
      animate={featuredControls}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { type: "spring", stiffness: 100 },
            },
          }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Featured Collection
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Discover our handpicked selection of premium products
          </p>
        </motion.div>

        {loading ? (
          <div className="h-[400px] sm:h-[500px] flex flex-col items-center justify-center gap-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center"
            >
              <svg
                className="h-8 w-8 sm:h-10 sm:w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </motion.div>
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-indigo-600 font-medium text-base"
            >
              Curating the best for you...
            </motion.p>
          </div>
        ) : (
          <div className="relative h-[440px] sm:h-[500px] w-full overflow-hidden">
            {/* Nav Arrows */}
            {featuredProducts.length > 1 && (
              <>
                <motion.button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white shadow-lg hover:bg-indigo-50 transition backdrop-blur-sm border border-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white shadow-lg hover:bg-indigo-50 transition backdrop-blur-sm border border-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </>
            )}

            <AnimatePresence initial={false}>
              {featuredProducts.map((product, index) => {
                const offset = index - currentSlide;
                const isVisible = Math.abs(offset) <= 1;

                return (
                  isVisible && (
                    <motion.div
                      key={product._id}
                      className="absolute w-full h-full flex items-center justify-center px-2 sm:px-4"
                      initial={{
                        scale: 0.9,
                        opacity: 0,
                        x: offset * 500,
                        filter: "blur(4px)",
                      }}
                      animate={{
                        scale: offset === 0 ? 1 : 0.85,
                        opacity: offset === 0 ? 1 : 0.5,
                        x: offset * 350,
                        zIndex: 20 - Math.abs(offset),
                        filter: offset === 0 ? "blur(0px)" : "blur(2px)",
                      }}
                      exit={{
                        scale: 0.9,
                        opacity: 0,
                        x: offset * 500,
                        filter: "blur(4px)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div
                        onClick={() =>
                          offset === 0 && navigate(`/products/${product._id}`)
                        }
                        className={`w-full max-w-4xl min-h-[420px] sm:min-h-[460px] flex flex-col lg:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-3xl shadow-xl transition-all ${
                          offset === 0
                            ? "ring-1 ring-gray-200 cursor-pointer hover:shadow-2xl"
                            : "opacity-80"
                        }`}
                        style={{ pointerEvents: offset === 0 ? "auto" : "none" }}
                      >
                        {/* Product Image */}
                        <div className="w-full lg:w-1/2 h-44 sm:h-64 md:h-72 lg:h-full flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
                          <motion.img
                            src={
                              product.image ||
                              "https://placehold.co/600x400?text=Product"
                            }
                            alt={product.name}
                            className="w-full h-full object-contain transition-transform duration-300"
                            whileHover={offset === 0 ? { scale: 1.07 } : {}}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="w-full lg:w-1/2 flex flex-col gap-3 sm:gap-4 h-full justify-center">
                          <div>
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                                ${product.price.toFixed(2)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm sm:text-base text-gray-400 line-through">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Rating
                              value={product.rating}
                              text={`${product.numReviews} reviews`}
                              color="text-amber-400"
                            />
                            {product.rating >= 4.5 && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Top Rated
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 text-sm sm:text-base line-clamp-3">
                            {product.description?.substring(0, 150)}...
                          </p>

                          <motion.button
                            className={`mt-2 sm:mt-4 px-6 py-2 sm:px-8 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all ${
                              offset === 0
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                            whileHover={offset === 0 ? { scale: 1.03, y: -2 } : {}}
                            whileTap={{ scale: 0.98 }}
                          >
                            {offset === 0 ? "Shop Now" : "Coming Up"}
                            <span className="ml-2">→</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                );
              })}
            </AnimatePresence>

            {/* Slide Indicators */}
            {featuredProducts.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                {featuredProducts.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === idx
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 w-8"
                        : "bg-gray-200 w-3"
                    }`}
                    whileHover={{ scaleY: 1.5 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default FeaturedSection;

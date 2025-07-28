// // FILE: client/src/pages/HomePage.jsx (Enhanced and Redesigned)

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Rating from '../components/common/Rating';

const HomePage = ({ navigate }) => {
  // --- STATE MANAGEMENT ---
  // State to hold the products fetched for the slider and deal poster
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // State for the single product to be featured in the "Deal of the Day" poster
  const [dealProduct, setDealProduct] = useState(null);
  // State to manage the loading UI
  const [loading, setLoading] = useState(true);
  // State to track the current slide in the featured product carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  // State for the countdown timer
  const [timeLeft, setTimeLeft] = useState({});

  // --- HOOKS FOR ANIMATIONS ---
  // These hooks from react-intersection-observer and framer-motion work together
  // to trigger animations only when a section scrolls into the user's view.
  const heroControls = useAnimation();
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const dealControls = useAnimation();
  const [dealRef, dealInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const featuresControls = useAnimation();
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const categoryControls = useAnimation();
  const [categoryRef, categoryInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // --- DATA FETCHING ---
  // Fetches the first page of products to use for the featured slider and deal poster.
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('api/products?pageNumber=1');
        const data = await res.json();
        if (!res.ok) throw new Error('Could not fetch products');
        
        // Use the first product as the "Deal of the Day"
        if (data.products.length > 0) {
          setDealProduct(data.products[0]);
        }
        // Use the next 5 products for the carousel for a better sliding experience
        setFeaturedProducts(data.products.slice(1, 6));

      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // --- ANIMATION TRIGGERS ---
  // This effect starts the animation for each section when it becomes visible on screen.
  useEffect(() => {
    if (heroInView) heroControls.start('visible');
    if (dealInView) dealControls.start('visible');
    if (featuresInView) featuresControls.start('visible');
    if (categoryInView) categoryControls.start('visible');
  }, [heroControls, heroInView, dealControls, dealInView, featuresControls, featuresInView, categoryControls, categoryInView]);
  
  // --- SLIDER & COUNTDOWN LOGIC ---
  // Memoized function to advance to the next slide, wrapped in useCallback for performance.
  const nextSlide = useCallback(() => {
    if (featuredProducts.length > 0) {
      setCurrentSlide((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
    }
  }, [featuredProducts.length]);

  // This effect sets up the auto-sliding interval for the carousel.
  useEffect(() => {
    if (featuredProducts.length > 1) {
      const slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
      return () => clearInterval(slideInterval); // Cleanup interval on component unmount
    }
  }, [featuredProducts.length, nextSlide]);

  // This effect runs the countdown timer for the "Deal of the Day"
  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date().setHours(24, 0, 0, 0) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- ANIMATION VARIANTS ---
  // Defines reusable animation properties for Framer Motion.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  // --- STATIC DATA FOR UI ---
  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=2564&auto=format&fit=crop' }, 
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2671&auto=format&fit=crop' },
    { name: 'Home Goods', image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=2574&auto=format&fit=crop' }, 
    { name: 'Sports', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2370&auto=format&fit=crop' },
  ];
  const features = [
    { icon: '🚚', title: 'Fast Shipping', text: 'Get your orders delivered to your doorstep in record time.' },
    { icon: '💎', title: 'Premium Quality', text: 'We only source the best products from trusted suppliers.' },
    { icon: '📞', title: '24/7 Support', text: 'Our team is always here to help you with any questions.' },
  ];

  return (
    <div className="bg-gradient-to-b from-[#8d8daa] via-[#dfdfde] to-[#f7f5f2] text-gray-800">
      {/* Hero Section: The main welcome area with a dynamic product carousel. */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroControls}
        variants={containerVariants}
        className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#dbeafe_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 max-w-6xl mx-auto">
          <div className="text-center lg:text-left">
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Style Meets
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Innovation.
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-6 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
              Discover a curated selection of high-quality products designed to enhance your lifestyle.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-10">
              <motion.button
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                Explore Collection
              </motion.button>
            </motion.div>
          </div>
          <div className=" lg:flex w-full h-96 items-center justify-center">
           
            {loading ? <div className="w-full h-full bg-gray-200 rounded-2xl animate-pulse"></div> : (
              <div className="relative w-full h-full">
                <AnimatePresence>
                  <motion.div
                    key={currentSlide}
                    className="absolute w-full h-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => featuredProducts.length > 0 && navigate(`/products/${featuredProducts[currentSlide]._id}`)}
                  >
                    <img src={featuredProducts[currentSlide]?.image} alt={featuredProducts[currentSlide]?.name} className="w-full h-full object-contain drop-shadow-2xl"/>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Features Section: "Why Choose Us?" to build trust. */}
      <motion.section 
        ref={featuresRef}
        initial="hidden"
        animate={featuresControls}
        variants={containerVariants}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants} className="text-center p-6">
              <div className="text-5xl mb-4 inline-block p-4 bg-indigo-100 text-indigo-600 rounded-full">{feature.icon}</div>
              <h3 className="font-bold text-lg text-gray-800">{feature.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Deal Poster Section: An eye-catching promotional block with a countdown. */}
      {dealProduct && (
        <motion.section
          ref={dealRef}
          initial="hidden"
          animate={dealControls}
          variants={containerVariants}
          className="py-20 px-4 bg-gray-900"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div variants={itemVariants} className="h-80 w-full">
              <img src={dealProduct.image || 'https://placehold.co/600x600/e2e8f0/333?text=Deal'} alt={dealProduct.name} className="w-full h-full object-contain"/>
            </motion.div>
            <motion.div variants={itemVariants} className="p-8 text-center md:text-left">
              <h2 className="text-sm font-bold uppercase text-indigo-400 tracking-wider">Deal of the Day</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white mt-2">{dealProduct.name}</h3>
              <div className="mt-4 flex justify-center md:justify-start">
                <Rating value={dealProduct.rating} text={`${dealProduct.numReviews} reviews`} />
              </div>
              <div className="mt-6 flex justify-center md:justify-start items-center gap-4">
                <span className="text-4xl font-bold text-white">${dealProduct.price.toFixed(2)}</span>
                <span className="text-xl text-gray-400 line-through">${(dealProduct.price * 1.3).toFixed(2)}</span>
              </div>
              <div className="mt-6 flex justify-center md:justify-start gap-4">
                <div className="text-center"><div className="text-2xl font-bold text-white">{String(timeLeft.hours || '00').padStart(2, '0')}</div><div className="text-xs text-gray-400">Hours</div></div>
                <div className="text-2xl font-bold text-white">:</div>
                <div className="text-center"><div className="text-2xl font-bold text-white">{String(timeLeft.minutes || '00').padStart(2, '0')}</div><div className="text-xs text-gray-400">Minutes</div></div>
                <div className="text-2xl font-bold text-white">:</div>
                <div className="text-center"><div className="text-2xl font-bold text-white">{String(timeLeft.seconds || '00').padStart(2, '0')}</div><div className="text-xs text-gray-400">Seconds</div></div>
              </div>
              <motion.button
                onClick={() => navigate(`/products/${dealProduct._id}`)}
                className="mt-8 bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-base shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Deal
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Shop by Category Section: Redesigned with images for better visual impact. */}
      <motion.section 
        ref={categoryRef}
        initial="hidden"
        animate={categoryControls}
        variants={containerVariants}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-4">Shop by Category</motion.h2>
          <motion.p variants={itemVariants} className="text-center text-gray-500 mb-12">Find exactly what you're looking for by browsing our curated categories.</motion.p>
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <motion.div 
                key={cat.name}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0,0,0,0.08)' }}
                className="relative bg-white rounded-xl shadow-md text-center cursor-pointer h-64 overflow-hidden group"
                onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="font-bold text-2xl text-white drop-shadow-md">{cat.name}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;


// // FILE: client/src/pages/HomePage.jsx

// import React, { useState, useEffect, useCallback } from 'react';
// import { motion, useAnimation, AnimatePresence } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import Rating from '../components/common/Rating';

// const HomePage = ({ navigate }) => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [dealProduct, setDealProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isHovering, setIsHovering] = useState(false);
//   const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

//   const heroControls = useAnimation();
//   const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
//   const dealControls = useAnimation();
//   const [dealRef, dealInView] = useInView({ triggerOnce: true, threshold: 0.1 });
//   const featuresControls = useAnimation();
//   const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
//   const categoryControls = useAnimation();
//   const [categoryRef, categoryInView] = useInView({ triggerOnce: true, threshold: 0.1 });

//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch('http://localhost:5000/api/products?pageNumber=1');
//         const data = await res.json();

//         if (!res.ok) throw new Error('Failed to fetch products');

//         if (data.products.length > 0) {
//           const originalPrice = data.products[0].originalPrice ||
//             parseFloat((data.products[0].price * 1.3).toFixed(2));

//           setDealProduct({
//             ...data.products[0],
//             price: parseFloat(data.products[0].price.toFixed(2)),
//             originalPrice: parseFloat(originalPrice)
//           });
//         }

//         setFeaturedProducts(data.products.slice(1, 6).map(product => ({
//           ...product,
//           price: parseFloat(product.price.toFixed(2))
//         })));
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
//   }, []);

//   useEffect(() => {
//     if (heroInView) heroControls.start('visible');
//     if (dealInView) dealControls.start('visible');
//     if (featuresInView) featuresControls.start('visible');
//     if (categoryInView) categoryControls.start('visible');
//   }, [heroInView, dealInView, featuresInView, categoryInView]);

//   const nextSlide = useCallback(() => {
//     if (featuredProducts.length > 0) {
//       setCurrentSlide(prev => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
//     }
//   }, [featuredProducts.length]);

//   useEffect(() => {
//     if (featuredProducts.length > 1 && !isHovering) {
//       const slideInterval = setInterval(nextSlide, 5000);
//       return () => clearInterval(slideInterval);
//     }
//   }, [featuredProducts.length, nextSlide, isHovering]);

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const now = new Date();
//       const endOfDay = new Date();
//       endOfDay.setHours(24, 0, 0, 0);
//       const difference = endOfDay - now;
//       return {
//         hours: Math.floor(difference / (1000 * 60 * 60)),
//         minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
//         seconds: Math.floor((difference % (1000 * 60)) / 1000)
//       };
//     };

//     setTimeLeft(calculateTimeLeft());
//     const timer = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const calculateDiscountPercentage = (salePrice, originalPrice) => {
//     const discount = ((originalPrice - salePrice) / originalPrice) * 100;
//     return Math.round(discount);
//   };

//   const fadeInUp = {
//     hidden: { opacity: 0, y: 40 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
//     }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         delayChildren: 0.3
//       }
//     }
//   };

//   const scaleUp = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: {
//         duration: 0.6,
//         ease: [0.6, -0.05, 0.01, 0.99]
//       }
//     }
//   };

//   const categories = [
//     {
//       name: 'Electronics',
//       image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop',
//       path: 'electronics'
//     },
//     {
//       name: 'Fashion',
//       image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop',
//       path: 'fashion'
//     },
//     {
//       name: 'Home & Living',
//       image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2668&auto=format&fit=crop',
//       path: 'home-living'
//     },
//     {
//       name: 'Beauty',
//       image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2670&auto=format&fit=crop',
//       path: 'beauty'
//     },
//   ];

//   const features = [
//     { icon: '🚀', title: 'Fast Delivery', text: 'Get your orders delivered in 24-48 hours' },
//     { icon: '💎', title: 'Premium Quality', text: 'Curated selection of high-end products' },
//     { icon: '🔄', title: 'Easy Returns', text: '30-day hassle-free return policy' },
//     { icon: '🔒', title: 'Secure Payment', text: '100% secure checkout process' },
//   ];

//   return (
//     <div className="bg-white text-gray-900">
//       {/* HERO SECTION */}
//       <motion.section
//         ref={heroRef}
//         initial="hidden"
//         animate={heroControls}
//         variants={fadeInUp}
//         className="py-16 px-4 text-center"
//       >
//         <h1 className="text-4xl md:text-5xl font-extrabold mb-4">GlowShop: Find Your Spark ✨</h1>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
//           Discover top deals, unique fashion, and high-quality products for every lifestyle.
//         </p>
//         <button
//           onClick={() => navigate('/products')}
//           className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
//         >
//           Start Shopping
//         </button>
//       </motion.section>

//       {/* DEAL OF THE DAY */}
//       {dealProduct && (
//         <motion.section
//           ref={dealRef}
//           initial="hidden"
//           animate={dealControls}
//           variants={scaleUp}
//           className="bg-gradient-to-r from-purple-100 to-pink-100 py-12 px-4"
//         >
//           <div className="max-w-4xl mx-auto text-center">
//             <h2 className="text-3xl font-bold mb-4">🔥 Deal of the Day</h2>
//             <p className="mb-2 text-gray-700">
//               {dealProduct.name} — Now just ₹{dealProduct.price}{' '}
//               <span className="line-through text-red-500 text-sm ml-2">₹{dealProduct.originalPrice}</span>{' '}
//               <span className="ml-1 text-green-600 font-semibold">
//                 ({calculateDiscountPercentage(dealProduct.price, dealProduct.originalPrice)}% OFF)
//               </span>
//             </p>
//             <Rating value={dealProduct.rating} />
//             <div className="text-xl mt-4">
//               Time left: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
//             </div>
//           </div>
//         </motion.section>
//       )}

//       {/* FEATURED PRODUCTS SLIDER */}
//       <motion.section
//         ref={featuresRef}
//         initial="hidden"
//         animate={featuresControls}
//         variants={staggerContainer}
//         className="py-16 px-4"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-10">
//             🌟 Featured Products
//           </motion.h2>

//           <div
//             onMouseEnter={() => setIsHovering(true)}
//             onMouseLeave={() => setIsHovering(false)}
//             className="relative w-full max-w-4xl mx-auto overflow-hidden"
//           >
//             <AnimatePresence mode="wait">
//               {featuredProducts.length > 0 && (
//                 <motion.div
//                   key={currentSlide}
//                   initial={{ opacity: 0, x: 100 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -100 }}
//                   transition={{ duration: 0.5 }}
//                   className="bg-white shadow-md rounded-lg p-6"
//                 >
//                   <h3 className="text-xl font-semibold mb-2">{featuredProducts[currentSlide].name}</h3>
//                   <p className="text-gray-600 mb-2">{featuredProducts[currentSlide].description}</p>
//                   <Rating value={featuredProducts[currentSlide].rating} />
//                   <p className="text-indigo-600 font-bold mt-2">₹{featuredProducts[currentSlide].price}</p>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </motion.section>

//       {/* SHOP BY CATEGORY */}
//       <motion.section
//         ref={categoryRef}
//         initial="hidden"
//         animate={categoryControls}
//         variants={staggerContainer}
//         className="py-16 px-4 bg-gray-100"
//       >
//         <h2 className="text-3xl font-bold text-center mb-10">🛍️ Shop by Category</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
//           {categories.map((category, index) => (
//             <motion.div
//               key={index}
//               variants={fadeInUp}
//               className="cursor-pointer bg-white shadow hover:shadow-xl transition rounded-lg overflow-hidden"
//               onClick={() => navigate(`/products/${category.path}`)}
//             >
//               <img src={category.image} alt={category.name} className="w-full h-48 object-cover" />
//               <div className="p-4 text-center font-semibold">{category.name}</div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.section>

//       {/* FEATURES SECTION */}
//       <section className="py-12 bg-white">
//         <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//           {features.map((feature, index) => (
//             <div key={index}>
//               <div className="text-4xl">{feature.icon}</div>
//               <h3 className="mt-2 font-semibold">{feature.title}</h3>
//               <p className="text-gray-600 text-sm">{feature.text}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;

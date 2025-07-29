// // FILE: client/src/pages/HomePage.jsx (Enhanced and Redesigned)

// import React, { useState, useEffect, useCallback } from 'react';
// import { motion, useAnimation, AnimatePresence } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import Rating from '../components/common/Rating';

// const HomePage = ({ navigate }) => {
//   // --- STATE MANAGEMENT ---
//   // State to hold the products fetched for the slider and deal poster
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   // State for the single product to be featured in the "Deal of the Day" poster
//   const [dealProduct, setDealProduct] = useState(null);
//   // State to manage the loading UI
//   const [loading, setLoading] = useState(true);
//   // State to track the current slide in the featured product carousel
//   const [currentSlide, setCurrentSlide] = useState(0);
//   // State for the countdown timer
//   const [timeLeft, setTimeLeft] = useState({});

//   // --- HOOKS FOR ANIMATIONS ---
//   // These hooks from react-intersection-observer and framer-motion work together
//   // to trigger animations only when a section scrolls into the user's view.
//   const heroControls = useAnimation();
//   const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });

//   const dealControls = useAnimation();
//   const [dealRef, dealInView] = useInView({ triggerOnce: true, threshold: 0.2 });

//   const featuresControls = useAnimation();
//   const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.2 });

//   const categoryControls = useAnimation();
//   const [categoryRef, categoryInView] = useInView({ triggerOnce: true, threshold: 0.2 });

//   // --- DATA FETCHING ---
//   // Fetches the first page of products to use for the featured slider and deal poster.
//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch('api/products?pageNumber=1');
//         const data = await res.json();
//         if (!res.ok) throw new Error('Could not fetch products');
        
//         // Use the first product as the "Deal of the Day"
//         if (data.products.length > 0) {
//           setDealProduct(data.products[0]);
//         }
//         // Use the next 5 products for the carousel for a better sliding experience
//         setFeaturedProducts(data.products.slice(1, 6));

//       } catch (err) {
//         console.error("Failed to fetch featured products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeaturedProducts();
//   }, []);

//   // --- ANIMATION TRIGGERS ---
//   // This effect starts the animation for each section when it becomes visible on screen.
//   useEffect(() => {
//     if (heroInView) heroControls.start('visible');
//     if (dealInView) dealControls.start('visible');
//     if (featuresInView) featuresControls.start('visible');
//     if (categoryInView) categoryControls.start('visible');
//   }, [heroControls, heroInView, dealControls, dealInView, featuresControls, featuresInView, categoryControls, categoryInView]);
  
//   // --- SLIDER & COUNTDOWN LOGIC ---
//   // Memoized function to advance to the next slide, wrapped in useCallback for performance.
//   const nextSlide = useCallback(() => {
//     if (featuredProducts.length > 0) {
//       setCurrentSlide((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
//     }
//   }, [featuredProducts.length]);

//   // This effect sets up the auto-sliding interval for the carousel.
//   useEffect(() => {
//     if (featuredProducts.length > 1) {
//       const slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
//       return () => clearInterval(slideInterval); // Cleanup interval on component unmount
//     }
//   }, [featuredProducts.length, nextSlide]);

//   // This effect runs the countdown timer for the "Deal of the Day"
//   useEffect(() => {
//     const timer = setInterval(() => {
//       const difference = +new Date().setHours(24, 0, 0, 0) - +new Date();
//       if (difference > 0) {
//         setTimeLeft({
//           hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//           minutes: Math.floor((difference / 1000 / 60) % 60),
//           seconds: Math.floor((difference / 1000) % 60),
//         });
//       }
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // --- ANIMATION VARIANTS ---
//   // Defines reusable animation properties for Framer Motion.
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
//   };

//   // --- STATIC DATA FOR UI ---
//   const categories = [
//     { name: 'Electronics', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=2564&auto=format&fit=crop' }, 
//     { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2671&auto=format&fit=crop' },
//     { name: 'Home Goods', image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=2574&auto=format&fit=crop' }, 
//     { name: 'Sports', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2370&auto=format&fit=crop' },
//   ];
//   const features = [
//     { icon: '🚚', title: 'Fast Shipping', text: 'Get your orders delivered to your doorstep in record time.' },
//     { icon: '💎', title: 'Premium Quality', text: 'We only source the best products from trusted suppliers.' },
//     { icon: '📞', title: '24/7 Support', text: 'Our team is always here to help you with any questions.' },
//   ];

//   return (
//     <div className="bg-gradient-to-bl from-[#ffe4e6]  to-[#ccfbf1] text-gray-800">
//       {/* Hero Section: The main welcome area with a dynamic product carousel. */}
//       <motion.section
//         ref={heroRef}
//         initial="hidden"
//         animate={heroControls}
//         variants={containerVariants}
//         className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden"
//       >
//         <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#dbeafe_1px,transparent_1px)] [background-size:24px_24px]"></div>
//         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 max-w-6xl mx-auto">
//           <div className="text-center lg:text-left">
//             <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
//               Style Meets
//               <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
//                 Innovation.
//               </span>
//             </motion.h1>
//             <motion.p variants={itemVariants} className="mt-6 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
//               Discover a curated selection of high-quality products designed to enhance your lifestyle.
//             </motion.p>
//             <motion.div variants={itemVariants} className="mt-10">
//               <motion.button
//                 onClick={() => navigate('/products')}
//                 className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg"
//                 whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: 'spring', stiffness: 400, damping: 15 }}
//               >
//                 Explore Collection
//               </motion.button>
//             </motion.div>
//           </div>
//           <div className=" lg:flex w-full h-96 items-center justify-center">
           
//             {loading ? <div className="w-full h-full bg-gray-200 rounded-2xl animate-pulse"></div> : (
//               <div className="relative w-full h-full">
//                 <AnimatePresence>
//                   <motion.div
//                     key={currentSlide}
//                     className="absolute w-full h-full"
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     transition={{ duration: 0.5 }}
//                     onClick={() => featuredProducts.length > 0 && navigate(`/products/${featuredProducts[currentSlide]._id}`)}
//                   >
//                     <img src={featuredProducts[currentSlide]?.image} alt={featuredProducts[currentSlide]?.name} className="w-full h-full object-contain drop-shadow-2xl"/>
//                   </motion.div>
//                 </AnimatePresence>
//               </div>
//             )}
//           </div>
//         </div>
//       </motion.section>

//       {/* Deal Poster Section: An eye-catching promotional block with a countdown. */}
//       {dealProduct && (
//         <motion.section
//           ref={dealRef}
//           initial="hidden"
//           animate={dealControls}
//           variants={containerVariants}
//           className="py-20 px-4 bg-gray-900"
//         >
//           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//             <motion.div variants={itemVariants} className="h-80 w-full">
//               <img src={dealProduct.image || 'https://placehold.co/600x600/e2e8f0/333?text=Deal'} alt={dealProduct.name} className="w-full h-full object-contain"/>
//             </motion.div>
//             <motion.div variants={itemVariants} className="p-8 text-center md:text-left">
//               <h2 className="text-sm font-bold uppercase text-indigo-400 tracking-wider">Deal of the Day</h2>
//               <h3 className="text-3xl md:text-4xl font-bold text-white mt-2">{dealProduct.name}</h3>
//               <div className="mt-4 flex justify-center md:justify-start">
//                 <Rating value={dealProduct.rating} text={`${dealProduct.numReviews} reviews`} />
//               </div>
//               <div className="mt-6 flex justify-center md:justify-start items-center gap-4">
//                 <span className="text-4xl font-bold text-white">${dealProduct.price.toFixed(2)}</span>
//                 <span className="text-xl text-gray-400 line-through">${(dealProduct.price * 1.3).toFixed(2)}</span>
//               </div>
//               <div className="mt-6 flex justify-center md:justify-start gap-4">
//                 <div className="text-center"><div className="text-2xl font-bold text-white">{String(timeLeft.hours || '00').padStart(2, '0')}</div><div className="text-xs text-gray-400">Hours</div></div>
//                 <div className="text-2xl font-bold text-white">:</div>
//                 <div className="text-center"><div className="text-2xl font-bold text-white">{String(timeLeft.minutes || '00').padStart(2, '0')}</div><div className="text-xs text-gray-400">Minutes</div></div>
//                 <div className="text-2xl font-bold text-white">:</div>
//                 <div className="text-center"><div className="text-2xl font-bold text-white">{String(timeLeft.seconds || '00').padStart(2, '0')}</div><div className="text-xs text-gray-400">Seconds</div></div>
//               </div>
//               <motion.button
//                 onClick={() => navigate(`/products/${dealProduct._id}`)}
//                 className="mt-8 bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-base shadow-lg"
//                 whileHover={{ scale: 1.05, y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 View Deal
//               </motion.button>
//             </motion.div>
//           </div>
//         </motion.section>
//       )}

//       {/* Shop by Category Section: Redesigned with images for better visual impact. */}
//       <motion.section 
//         ref={categoryRef}
//         initial="hidden"
//         animate={categoryControls}
//         variants={containerVariants}
//         className="py-20 px-4"
//       >
//         <div className="max-w-6xl mx-auto">
//           <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-4">Shop by Category</motion.h2>
//           <motion.p variants={itemVariants} className="text-center text-gray-500 mb-12">Find exactly what you're looking for by browsing our curated categories.</motion.p>
//           <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {categories.map((cat) => (
//               <motion.div 
//                 key={cat.name}
//                 variants={itemVariants}
//                 whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0,0,0,0.08)' }}
//                 className="relative bg-white rounded-xl shadow-md text-center cursor-pointer h-64 overflow-hidden group"
//                 onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
//               >
//                 <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
//                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                   <h3 className="font-bold text-2xl text-white drop-shadow-md">{cat.name}</h3>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* Features Section: "Why Choose Us?" to build trust. */}
//       <motion.section 
//         ref={featuresRef}
//         initial="hidden"
//         animate={featuresControls}
//         variants={containerVariants}
//         className="py-20 px-4"
//       >
//         <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
//           {features.map((feature) => (
//             <motion.div key={feature.title} variants={itemVariants} className="text-center p-6">
//               <div className="text-5xl mb-4 inline-block p-4 bg-indigo-100 text-indigo-600 rounded-full">{feature.icon}</div>
//               <h3 className="font-bold text-lg text-gray-800">{feature.title}</h3>
//               <p className="text-gray-500 text-sm mt-1">{feature.text}</p>
//             </motion.div>
//           ))}
//         </div>
//       </motion.section>
//     </div>
//   );
// };

// export default HomePage;


import React, { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Rating from '../components/common/Rating';

const HomePage = ({ navigate }) => {
  // State management
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealProduct, setDealProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Animation hooks
  const heroControls = useAnimation();
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const dealControls = useAnimation();
  const [dealRef, dealInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const featuresControls = useAnimation();
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const categoryControls = useAnimation();
  const [categoryRef, categoryInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Fetch products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('api/products?pageNumber=1');
        const data = await res.json();
        if (!res.ok) throw new Error('Could not fetch products');
        
        if (data.products.length > 0) {
          setDealProduct(data.products[0]);
        }
        setFeaturedProducts(data.products.slice(1, 6));

      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Animation triggers
  useEffect(() => {
    if (heroInView) heroControls.start('visible');
    if (dealInView) dealControls.start('visible');
    if (featuresInView) featuresControls.start('visible');
    if (categoryInView) categoryControls.start('visible');
  }, [heroControls, heroInView, dealControls, dealInView, featuresControls, featuresInView, categoryControls, categoryInView]);
  
  // Slider logic
  const nextSlide = useCallback(() => {
    if (featuredProducts.length > 0) {
      setCurrentSlide((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
    }
  }, [featuredProducts.length]);

  useEffect(() => {
    if (featuredProducts.length > 1) {
      const slideInterval = setInterval(nextSlide, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [featuredProducts.length, nextSlide]);

  // Fixed Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); // Set to end of day
      
      const difference = endOfDay - now;
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Then update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15,
        when: "beforeChildren"
      } 
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 10
      } 
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  // Static data
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
    <div className="bg-gradient-to-br from-[#f0f4ff] via-[#f9f9f9] to-[#f0f4ff] text-gray-800">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroControls}
        variants={containerVariants}
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-20"
      >
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-100 to-rose-100 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-tl from-blue-100 to-cyan-100 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 max-w-7xl mx-auto">
          <div className="text-center lg:text-left space-y-6">
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
            >
              Elevate Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Lifestyle
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0"
            >
              Discover curated products that blend innovation with exceptional design for your modern life.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                onClick={() => navigate('/products')}
                className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Shop Now</span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/deals')}
                className="relative overflow-hidden bg-white text-gray-800 font-bold py-4 px-8 rounded-xl text-lg shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-200"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">View Deals</span>
                <span className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>
            </motion.div>
          </div>
          
          {/* Improved Image Showcase */}
          <div className="relative w-full h-96 lg:h-[500px] flex items-center justify-center">
            {loading ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl animate-pulse"></div>
            ) : (
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    className="absolute w-full h-full cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    onClick={() => featuredProducts.length > 0 && navigate(`/products/${featuredProducts[currentSlide]._id}`)}
                  >
                    {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/20"></div> */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                      {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10"></div> */}
                      <img 
                        src={featuredProducts[currentSlide]?.image} 
                        alt={featuredProducts[currentSlide]?.name} 
                        className="w-full h-full object-contain p-8 transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                      {featuredProducts.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlide(index);
                          }}
                          className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-indigo-600 w-6' : 'bg-gray-300'}`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div> */}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Deal of the Day Section */}
      {dealProduct && (
        <motion.section
          ref={dealRef}
          initial="hidden"
          animate={dealControls}
          variants={containerVariants}
          className="py-16 px-4 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div 
              variants={itemVariants}
              className="relative h-80 md:h-96 w-full group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 rounded-3xl blur-md group-hover:blur-lg transition-all duration-500"></div>
              <img 
                src={dealProduct.image || 'https://placehold.co/600x600/e2e8f0/333?text=Deal'} 
                alt={dealProduct.name} 
                className="relative w-full h-full object-contain p-8 z-10 transform group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="p-6 md:p-8 text-center md:text-left space-y-6"
            >
              <div className="inline-block px-4 py-2 bg-indigo-600/20 rounded-full backdrop-blur-sm">
                <span className="text-sm font-bold uppercase text-indigo-300 tracking-wider">Deal of the Day</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white">{dealProduct.name}</h3>
              
              <div className="flex justify-center md:justify-start">
                <Rating 
                  value={dealProduct.rating} 
                  text={`${dealProduct.numReviews} reviews`} 
                  color="text-amber-400"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4">
                <span className="text-4xl font-bold text-white bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  ${dealProduct.price.toFixed(2)}
                </span>
                <span className="text-xl text-gray-400 line-through">${(dealProduct.price * 1.3).toFixed(2)}</span>
                <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-sm font-medium">
                  {Math.round((1 - dealProduct.price / (dealProduct.price * 1.3)) * 100)}% OFF
                </span>
              </div>
              
              <div className="flex justify-center md:justify-start gap-3">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="text-center">
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                      <span className="text-2xl font-bold text-white">
                        {String(value).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 uppercase tracking-wider">
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
              
              <motion.button
                onClick={() => navigate(`/products/${dealProduct._id}`)}
                className="mt-6 relative overflow-hidden bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl text-base shadow-lg hover:shadow-xl group"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Grab This Deal</span>
                <span className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      )}


      {/* Categories Section */}
      <motion.section 
        ref={categoryRef}
        initial="hidden"
        animate={categoryControls}
        variants={containerVariants}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Explore our carefully curated collections tailored to your lifestyle needs
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((cat) => (
              <motion.div 
                key={cat.name}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="relative group cursor-pointer rounded-2xl overflow-hidden h-64 shadow-lg"
                onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end p-6">
                  <h3 className="font-bold text-2xl text-white transition-transform duration-300 group-hover:translate-y-1">
                    {cat.name}
                  </h3>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-all duration-500 rounded-2xl"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        initial="hidden"
        animate={featuresControls}
        variants={containerVariants}
        className="py-20 px-4 bg-gradient-to-br from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Us?</h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              We're committed to providing an exceptional shopping experience
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature) => (
              <motion.div 
                key={feature.title} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-5xl mb-6 w-20 h-20 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-500">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        animate={featuresControls}
        variants={fadeIn}
        className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-violet-600"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Shopping Experience?
          </h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who shop with us every day
          </p>
          <motion.button
            onClick={() => navigate('/products')}
            className="relative overflow-hidden bg-white text-indigo-600 font-bold py-4 px-10 rounded-xl text-lg shadow-2xl hover:shadow-3xl group"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Start Shopping Now</span>
            <span className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
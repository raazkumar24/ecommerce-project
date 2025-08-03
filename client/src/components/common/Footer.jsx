import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiSend } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  // Twitter X SVG Icon Component
  const TwitterXIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  return (
    <motion.footer
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className="bg-white border-t border-gray-200 mt-12"
    >
      <div className="container mx-auto px-4 sm:px-6 py-12">
        {/* Main Footer Content - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          
          {/* Brand & Newsletter (Full width on mobile, spans 2 columns on larger screens) */}
          <motion.div 
            variants={itemVariants} 
            className="sm:col-span-2 lg:col-span-2 xl:col-span-2"
          >
            <div className="flex flex-col h-full">
              <a href="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-[#D98A7E] mb-4">
                <svg className="w-8 h-8 text-[#D4A28E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7V21H22V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                E-Shop
              </a>
              <p className="text-gray-500 mb-6 max-w-sm">
                Curated excellence and an effortless shopping experience, delivered to your door.
              </p>
              <form className="flex mt-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"
                />
                <button 
                  type="submit" 
                  className="bg-[#D4A28E] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-r-lg hover:bg-[#C8907A] transition-colors flex items-center justify-center"
                  aria-label="Subscribe to newsletter"
                >
                  <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Shop</h3>
            <ul className="space-y-2 sm:space-y-3 text-gray-600">
              <li><a href="/products" className="hover:text-[#D98A7E] transition-colors text-sm sm:text-base">All Products</a></li>
              <li><a href="/category/electronics" className="hover:text-[#D98A7E] transition-colors text-sm sm:text-base">Electronics</a></li>
              <li><a href="/category/fashion" className="hover:text-[#D98A7E] transition-colors text-sm sm:text-base">Fashion</a></li>
              <li><a href="/category/home%20goods" className="hover:text-[#D98A7E] transition-colors text-sm sm:text-base">Home Goods</a></li>
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2 sm:space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors text-sm sm:text-base">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors text-sm sm:text-base">FAQ</a></li>
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors text-sm sm:text-base">Shipping & Returns</a></li>
            </ul>
          </motion.div>

          {/* Company Links (Hidden on small mobile, shown from sm breakpoint) */}
          <motion.div variants={itemVariants} className="hidden sm:block">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2 sm:space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors text-sm sm:text-base">About Us</a></li>
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors text-sm sm:text-base">Careers</a></li>
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors text-sm sm:text-base">Press</a></li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar - Responsive Layout */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} E-Shop. All Rights Reserved.
          </p>
          
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-gray-500 hover:text-[#D98A7E] transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Twitter (X)"
            >
              <TwitterXIcon />
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-[#D98A7E] transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-[#D98A7E] transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-[#D98A7E] transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Pinterest"
            >
              <FaPinterest className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
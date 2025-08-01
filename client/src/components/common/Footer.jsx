// FILE: client/src/components/common/Footer.jsx (Completely Redesigned)

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// Import icons for a more polished UI
import { FiSend } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  // --- HOOKS FOR ANIMATIONS ---
  // This hook triggers the animation when the footer scrolls into view.
  const { ref, inView } = useInView({
    triggerOnce: true, // Only animate once
    threshold: 0.1,    // Trigger when 10% of the element is visible
  });

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

  return (
    <motion.footer
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className="bg-white border-t border-gray-200 mt-12"
    >
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand & Newsletter */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
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
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"
              />
              <button 
                type="submit" 
                className="bg-[#D4A28E] text-white px-4 py-3 rounded-r-lg hover:bg-[#C8907A] transition-colors"
                aria-label="Subscribe to newsletter"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </form>
          </motion.div>

          {/* Column 2: Shop Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Shop</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="/products" className="hover:text-[#D98A7E] transition-colors">All Products</a></li>
              <li><a href="/category/electronics" className="hover:text-[#D98A7E] transition-colors">Electronics</a></li>
              <li><a href="/category/fashion" className="hover:text-[#D98A7E] transition-colors">Fashion</a></li>
              <li><a href="/category/home%20goods" className="hover:text-[#D98A7E] transition-colors">Home Goods</a></li>
            </ul>
          </motion.div>

          {/* Column 3: Support Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Support</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors">Shipping & Returns</a></li>
            </ul>
          </motion.div>

          {/* Column 4: Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Company</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#D98A7E] transition-colors">Press</a></li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar: Copyright and Social Media */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} E-Shop. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-gray-500 hover:text-[#D98A7E] transition-colors"><FaTwitter /></a>
            <a href="#" className="text-gray-500 hover:text-[#D98A7E] transition-colors"><FaFacebookF /></a>
            <a href="#" className="text-gray-500 hover:text-[#D98A7E] transition-colors"><FaInstagram /></a>
            <a href="#" className="text-gray-500 hover:text-[#D98A7E] transition-colors"><FaPinterest /></a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

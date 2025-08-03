import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'; // Icons for a polished look

const LoginPage = ({ navigate }) => {
  // --- STATE MANAGEMENT ---
  // State for form inputs, errors, and loading status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- CONTEXT HOOKS ---
  const { login, userInfo } = useAuth();

  // --- SIDE EFFECTS ---
  // If the user is already logged in, redirect them to the homepage.
  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  // --- HANDLERS ---
  // Handles the form submission for logging in.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/'); // Redirect on successful login
    } catch (err) {
      setError(err.message || 'Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full max-w-4xl shadow-2xl rounded-2xl bg-white/80 backdrop-blur-lg overflow-hidden"
      >
        {/* Left Column: Illustration & Welcome Message */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-10 bg-gradient-to-br from-[#FFF5F0] to-[#FADCD9] border-r border-gray-100">
          <motion.div variants={itemVariants}>
            <svg className="w-24 h-24 text-[#D98A7E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V21H22V7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
              <path d="M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </motion.div>
          <motion.h2 variants={itemVariants} className="mt-6 text-3xl font-bold text-[#5C3A2E]">Welcome Back!</motion.h2>
          <motion.p variants={itemVariants} className="mt-2 text-gray-500 text-center">
            Sign in to continue to your account.
          </motion.p>
        </div>

        {/* Right Column: Login Form */}
        <div className="flex-1 flex flex-col justify-center p-10">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-[#D98A7E] mb-6 text-center">Sign In</motion.h2>
          {error && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4 text-center text-red-600 bg-red-100 px-3 py-2 rounded text-sm shadow">
              {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="relative">
              <FiMail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={loading} autoComplete="email"
                className="w-full py-3 pl-12 pr-4 rounded-lg border border-gray-200 bg-white focus:border-[#D4A28E] focus:ring-2 focus:ring-[#FADCD9] shadow-sm transition"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <FiLock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                disabled={loading} autoComplete="current-password"
                className="w-full py-3 pl-12 pr-4 rounded-lg border border-gray-200 bg-white focus:border-[#D4A28E] focus:ring-2 focus:ring-[#FADCD9] shadow-sm transition"
              />
            </motion.div>
            <motion.button
              type="submit" disabled={loading}
              className="w-full py-3 bg-[#D4A28E] text-white font-bold rounded-lg shadow-lg hover:bg-[#C8907A] transition duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
              whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            >
              <FiLogIn />
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>
          <motion.div variants={itemVariants} className="text-center mt-6 text-gray-700 text-sm">
            New to our store?{' '}
            <button
              type="button" onClick={() => navigate('/register')}
              className="font-semibold text-[#D98A7E] hover:underline"
              disabled={loading}
            >
              Create an Account
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};


export default LoginPage;

// // FILE: client/src/pages/LoginPage.jsx

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';

// const LoginPage = ({ navigate }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const { login, userInfo } = useAuth();

//   // If user is already logged in, redirect them from the login page
//   useEffect(() => {
//     if (userInfo) {
//       navigate('/'); // Redirect to home page
//     }
//   }, [userInfo, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       await login(email, password);
//       navigate('/'); // Redirect on successful login
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-center">Login</h1>
//         {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium">Email Address</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-3 py-2 mt-1 border rounded-md"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-3 py-2 mt-1 border rounded-md"
//             />
//           </div>
//           <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//         <div className="text-center">
//           New Customer?{' '}
//           <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="text-blue-600 hover:underline">
//             Register
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;




import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const LoginPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, userInfo } = useAuth();

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50 to-white">
      <div className="flex w-full max-w-3xl shadow-2xl rounded-2xl bg-white/80 backdrop-blur-lg">
        {/* Brand illustration */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 px-10 py-16 bg-gradient-to-br from-indigo-100 via-white to-blue-100 rounded-l-2xl border-r border-gray-100">
          <ShoppingBagIcon className="w-20 h-20 text-indigo-400 mb-6" />
          <h2 className="text-3xl font-extrabold text-indigo-700">Welcome Back!</h2>
          <p className="mt-4 text-lg text-indigo-400 text-center max-w-xs">
            Experience fast, secure shopping. Exclusive offers await you.
          </p>
        </div>
        {/* Login Form */}
        <div className="flex-1 flex flex-col justify-center p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In to Shop</h2>
          {error && (
            <div className="mb-4 text-center text-red-600 bg-red-100 px-3 py-2 rounded text-sm shadow">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                className="w-full py-3 pl-10 pr-3 rounded-lg border border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 shadow transition"
              />
            </div>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                className="w-full py-3 pl-10 pr-10 rounded-lg border border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 shadow transition"
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-600 transition duration-200 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <div className="text-center mt-6 text-gray-700 text-sm">
            New to our store?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-semibold text-indigo-600 hover:underline"
              disabled={loading}
            >
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

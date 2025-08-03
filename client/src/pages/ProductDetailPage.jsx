// // FILE: client/src/pages/ProductDetailPage.jsx (Final Corrected Version with Relative API Paths)

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import { useNotification } from '../context/NotificationContext';
// import Rating from '../components/common/Rating';

// const ProductDetailPage = ({ id, navigate }) => {
//   // --- STATE MANAGEMENT ---
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [loadingReview, setLoadingReview] = useState(false);

//   const [reviewEligibility, setReviewEligibility] = useState({ canReview: false, message: '', existingReview: null });
//   const [isEditing, setIsEditing] = useState(false);

//   // --- HOOKS & REFS ---
//   const { cartItems, addToCart, decreaseQuantity } = useCart();
//   const { userInfo } = useAuth();
//   const { showNotification } = useNotification();
//   const reviewFormRef = useRef(null);

//   // --- DATA FETCHING ---
//   const fetchProduct = useCallback(async () => {
//     try {
//       // --- THIS IS THE FIX ---
//       // The URL now uses a relative path, which will be handled by the Vite proxy.
//       const res = await fetch(`/api/products/${id}`);
//       if (!res.ok) throw new Error('Product not found');
//       const data = await res.json();
//       setProduct(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   }, [id]);

//   useEffect(() => {
//     const checkReviewEligibility = async () => {
//       if (userInfo) {
//         try {
//           // --- THIS IS THE FIX ---
//           // The URL now uses a relative path.
//           const res = await fetch(`/api/users/can-review/${id}`, {
//             headers: { Authorization: `Bearer ${userInfo.token}` },
//           });
//           const data = await res.json();
//           setReviewEligibility(data);
//           if (data.existingReview) {
//             setRating(data.existingReview.rating);
//             setComment(data.existingReview.comment);
//           } else {
//             setRating(0);
//             setComment('');
//           }
//         } catch (err) {
//           setReviewEligibility({ canReview: false, message: 'Could not verify eligibility.' });
//         }
//       }
//     };

//     const loadData = async () => {
//         setLoading(true);
//         await fetchProduct();
//         await checkReviewEligibility();
//         setLoading(false);
//     }
//     loadData();
//   }, [id, fetchProduct, userInfo]);

//   // --- HANDLERS ---
//   const handleAddToCart = () => {
//     if (!userInfo) {
//       showNotification('Please log in to add items to your cart', 'error');
//       navigate('/login');
//       return;
//     }
//     if (product) {
//       addToCart(product);
//       showNotification(`${product.name} added to cart!`, 'success');
//     }
//   };

//   const submitReviewHandler = useCallback(async (e) => {
//     e.preventDefault();
//     if (rating === 0) {
//         showNotification('Please select a rating.', 'error');
//         return;
//     }
//     setLoadingReview(true);
    
//     const isUpdating = !!reviewEligibility.existingReview;
//     const method = isUpdating ? 'PUT' : 'POST';
//     const successMessage = isUpdating ? 'Review updated successfully!' : 'Review submitted successfully!';

//     try {
//       // --- THIS IS THE FIX ---
//       // The URL now uses a relative path.
//       const res = await fetch(`/api/products/${id}/reviews`, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//         body: JSON.stringify({ rating, comment }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      
//       showNotification(successMessage, 'success');
//       setIsEditing(false);
      
//       await fetchProduct();
//       // --- THIS IS THE FIX ---
//       // The URL now uses a relative path.
//       const eligibilityRes = await fetch(`/api/users/can-review/${id}`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
//       const eligibilityData = await eligibilityRes.json();
//       setReviewEligibility(eligibilityData);

//     } catch (err) {
//       showNotification(err.message, 'error');
//     } finally {
//       setLoadingReview(false);
//     }
//   }, [id, rating, comment, reviewEligibility, userInfo, showNotification, fetchProduct]);
  
//   const handleEditClick = () => {
//     setIsEditing(true);
//     reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   // --- RENDER LOGIC ---
//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="mb-8 h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
//         <div className="grid md:grid-cols-2 gap-12 mb-16">
//           <div className="bg-gray-200 w-full h-96 rounded-xl animate-pulse"></div>
//           <div className="space-y-4">
//             <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
//             <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
//             <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
//             <div className="space-y-2">
//               <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//               <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//               <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
//   if (!product) return <div className="text-center mt-20">Product not found.</div>;

//   const itemInCart = cartItems.find(item => item._id === product._id);

//   const renderReviewForm = () => {
//     if (!userInfo) {
//       return <p className="text-gray-600">Please <a href="/login" onClick={(e) => {e.preventDefault(); navigate('/login')}} className="text-blue-600 hover:underline font-semibold">sign in</a> to write a review.</p>;
//     }
    
//     const showForm = reviewEligibility.canReview || isEditing;

//     if (showForm) {
//       return (
//         <form onSubmit={submitReviewHandler} className="space-y-4">
//           <div>
//             <label className="font-medium text-gray-700">Your Rating</label>
//             <div className="flex items-center space-x-1 mt-2" onMouseLeave={() => setHoverRating(0)}>
//               {[...Array(5)].map((_, index) => {
//                 const starValue = index + 1;
//                 return (
//                   <motion.button type="button" key={starValue} onClick={() => setRating(starValue)} onMouseEnter={() => setHoverRating(starValue)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="focus:outline-none">
//                     <i className={`fas fa-star text-2xl transition-colors ${starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
//                   </motion.button>
//                 );
//               })}
//             </div>
//           </div>
//           <div>
//             <label className="font-medium text-gray-700">Your Comment</label>
//             <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"></textarea>
//           </div>
//           <div className="flex items-center gap-4">
//             <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loadingReview} className="flex-grow py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500">
//               {loadingReview ? 'Submitting...' : (reviewEligibility.existingReview ? 'Update Review' : 'Submit Review')}
//             </motion.button>
//             {isEditing && (
//               <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setIsEditing(false)} className="py-3 px-4 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">
//                 Cancel
//               </motion.button>
//             )}
//           </div>
//         </form>
//       );
//     } else {
//       return <p className="text-gray-600 font-medium p-4 bg-gray-100 rounded-lg">{reviewEligibility.message || 'You are not eligible to review this product.'}</p>;
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//         <button onClick={() => navigate('/products')} className="mb-8 flex items-center text-gray-600 hover:text-blue-600 transition-colors">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//           </svg>
//           Back to Products
//         </button>
//       </motion.div>
      
//       <div className="grid md:grid-cols-2 gap-12 mb-16">
//         <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white p-6 rounded-xl shadow-lg">
//           <img src={product.image || `https://placehold.co/600x600/e2e8f0/333?text=${encodeURIComponent(product.name)}`} alt={product.name} className="w-full h-full object-contain" />
//         </motion.div>

//         <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
//           <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
//           <div className="mb-4">
//             <Rating value={product.rating} text={`${product.numReviews} reviews`} />
//           </div>
//           <p className="text-3xl font-bold text-gray-800 mb-6">${product.price.toFixed(2)}</p>
//           <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          
//           <div className="bg-white p-6 rounded-xl shadow-lg">
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="font-medium text-gray-600">Status:</span>
//                 <span className={`font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span>
//               </div>
//                <div className="flex justify-between items-center">
//                 <span className="font-medium text-gray-600">Brand:</span>
//                 <span className="font-bold text-gray-800">{product.brand}</span>
//               </div>
//             </div>
//             <div className="mt-6">
//               {itemInCart ? (
//                 <div>
//                   <p className="text-center font-semibold text-green-600 mb-3">Added to cart!</p>
//                   <div className="flex items-center justify-center space-x-4">
//                     <button onClick={() => decreaseQuantity(product._id)} className="bg-gray-200 text-gray-800 font-bold w-10 h-10 rounded-full hover:bg-gray-300 transition-colors">-</button>
//                     <span className="text-2xl font-bold">{itemInCart.qty}</span>
//                     <button onClick={handleAddToCart} className="bg-gray-200 text-gray-800 font-bold w-10 h-10 rounded-full hover:bg-gray-300 transition-colors">+</button>
//                   </div>
//                 </div>
//               ) : (
//                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} disabled={product.countInStock === 0} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed">
//                   Add to Cart
//                 </motion.button>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="grid md:grid-cols-2 gap-12">
//         <div className="bg-white p-6 rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
//           {product.reviews.length === 0 && <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>}
//           <div className="space-y-6">
//             {product.reviews.map(review => (
//               <div key={review._id} className="border-b pb-4 last:border-b-0">
//                 <div className="flex items-center mb-2">
//                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-4">
//                      {review.name.charAt(0)}
//                    </div>
//                    <div>
//                      <strong className="text-gray-800">{review.name}</strong>
//                      <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
//                    </div>
//                    <div className="ml-auto flex items-center">
//                      <Rating value={review.rating} />
//                      {userInfo && userInfo._id === review.user && (
//                        <button onClick={handleEditClick} className="ml-4 text-blue-600 hover:underline text-sm font-medium">Edit</button>
//                      )}
//                    </div>
//                 </div>
//                 <p className="mt-2 text-gray-700 pl-14">{review.comment}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div ref={reviewFormRef} className="bg-white p-6 rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold mb-6">
//             {isEditing ? 'Edit Your Review' : 'Write a Customer Review'}
//           </h2>
//           {renderReviewForm()}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default ProductDetailPage;


// FILE: client/src/pages/ProductDetailPage.jsx (Final Corrected and Complete Version)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Rating from '../components/common/Rating';
import { FiArrowLeft, FiShoppingCart, FiPlus, FiMinus, FiEdit2 } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ProductDetailPage = ({ id, navigate }) => {
  // --- STATE MANAGEMENT ---
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviewEligibility, setReviewEligibility] = useState({ canReview: false, message: '', existingReview: null });
  const [isEditing, setIsEditing] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // --- HOOKS & REFS ---
  const { cartItems, addToCart, decreaseQuantity } = useCart();
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  const reviewFormRef = useRef(null);

  // --- DATA FETCHING ---
  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const productData = await fetchProduct();
        
        if (!productData) return;
        
        setProduct(productData);

        // New logic to fetch related products based on tags first, then category.
        let relatedQuery = '';
        if (productData.tags && productData.tags.length > 0) {
          relatedQuery = `keyword=${productData.tags[0]}`;
        } else if (productData.category) {
          relatedQuery = `category=${productData.category}`;
        }

        if (relatedQuery) {
          const relatedRes = await fetch(`/api/products?${relatedQuery}&limit=4`);
          const { products } = await relatedRes.json();
          setRelatedProducts(products.filter(p => p._id !== productData._id));
        }

        // Check if user can review this product
        if (userInfo) {
          const eligibilityRes = await fetch(`/api/users/can-review/${id}`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
          const eligibilityData = await eligibilityRes.json();
          setReviewEligibility(eligibilityData);
          
          if (eligibilityData.existingReview) {
            setRating(eligibilityData.existingReview.rating);
            setComment(eligibilityData.existingReview.comment);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, userInfo, fetchProduct]);

  // --- HANDLERS ---
  const handleAddToCart = () => {
    if (!userInfo) {
      showNotification('Please log in to add items to your cart', 'error');
      navigate('/login');
      return;
    }
    if (product) {
      addToCart(product);
      showNotification(`${product.name} added to cart!`, 'success');
    }
  };

  const submitReviewHandler = useCallback(async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showNotification('Please select a rating.', 'error');
      return;
    }
    setLoadingReview(true);
    
    const isUpdating = !!reviewEligibility.existingReview;
    const method = isUpdating ? 'PUT' : 'POST';
    const successMessage = isUpdating ? 'Review updated successfully!' : 'Review submitted successfully!';

    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${userInfo.token}` 
        },
        body: JSON.stringify({ rating, comment }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit review');
      }

      showNotification(successMessage, 'success');
      setIsEditing(false);
      
      const updatedProduct = await fetchProduct();
      setProduct(updatedProduct);

      const eligibilityRes = await fetch(`/api/users/can-review/${id}`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      const eligibilityData = await eligibilityRes.json();
      setReviewEligibility(eligibilityData);

    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoadingReview(false);
    }
  }, [id, rating, comment, reviewEligibility, userInfo, showNotification, fetchProduct]);
  
  const handleEditClick = () => {
    setIsEditing(true);
    reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- ANIMATION VARIANTS ---
  const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };
  const slideUp = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } } };
  const staggerItem = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } } };

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="mb-8 h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-200 w-full h-[500px] rounded-2xl animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="space-y-2">{[...Array(4)].map((_, i) => (<div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>))}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 text-red-500"
      >
        Error: {error}
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        Product not found.
      </motion.div>
    );
  }

  const getProductImages = () => {
    if (!product) return ['https://placehold.co/800x800/e2e8f0/333?text=No+Image'];
    let images = [];
    if (Array.isArray(product.images)) {
      images = product.images.filter(img => img);
    }
    if (images.length === 0 && product.image) {
      images = [product.image];
    }
    if (images.length === 0) {
      images = ['https://placehold.co/800x800/e2e8f0/333?text=No+Image'];
    }
    return images;
  };

  const productImages = getProductImages();
  const itemInCart = cartItems.find(item => item._id === product?._id);

  const renderReviewForm = () => {
    if (!userInfo) {
      return (
        <p className="text-gray-600 text-sm sm:text-base">
          Please{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-[#D98A7E] hover:underline font-semibold"
          >
            sign in
          </button>{' '}
          to write a review.
        </p>
      );
    }
    
    const showForm = reviewEligibility.canReview || isEditing;

    if (showForm) {
      return (
        <form onSubmit={submitReviewHandler} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2 text-sm sm:text-base">
              Your Rating
            </label>
            <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  className="focus:outline-none"
                >
                  <FaStar className={`text-3xl transition-colors ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2 text-sm sm:text-base">
              Your Review
            </label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A28E] text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loadingReview}
              className="flex-grow py-2 sm:py-3 bg-[#D4A28E] text-white font-bold rounded-lg shadow-md hover:bg-[#C8907A] transition-all disabled:bg-gray-400 text-sm sm:text-base"
            >
              {loadingReview ? 'Submitting...' : (reviewEligibility.existingReview ? 'Update Review' : 'Submit Review')}
            </motion.button>
            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-2 sm:py-3 px-4 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </form>
      );
    }
    
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600 font-medium text-center text-sm sm:text-base">
          {reviewEligibility.message || 'You are not eligible to review this product.'}
        </p>
      </div>
    );
  };

  return (
    <motion.div initial="hidden" animate="visible" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <motion.button onClick={() => navigate('/products')} className="mb-4 sm:mb-6 md:mb-8 flex items-center text-gray-600 hover:text-[#D98A7E] transition-colors group text-sm sm:text-base" variants={fadeIn}>
        <FiArrowLeft className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Collection
      </motion.button>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16">
        <motion.div variants={slideUp} className="w-full lg:w-1/2 space-y-3 sm:space-y-4">
          <div className="relative bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md border border-gray-100 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img 
                key={selectedImage}
                src={productImages[selectedImage]} 
                alt={`${product.name} - view ${selectedImage + 1}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-contain"
              />
            </AnimatePresence>
            {product.countInStock <= 0 && (<div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold">Out of Stock</div>)}
          </div>
          <div className="flex space-x-2 sm:space-x-3 overflow-x-auto py-1 px-1 sm:py-2 sm:px-2 scrollbar-hide">
            {productImages.map((img, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedImage(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-[#D98A7E]' : 'border-transparent'}`}
              >
                <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={slideUp} transition={{ delay: 0.2 }} className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{product.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-4">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} starSize="sm:!text-base md:!text-lg" />
              <span className="hidden sm:inline text-gray-500">|</span>
              <span className="text-sm sm:text-base text-gray-600">{product.brand}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#D98A7E] mb-4 sm:mb-6">${product.price.toFixed(2)}</p>
            <motion.div layout className="text-gray-600 leading-relaxed text-sm sm:text-base">
              <AnimatePresence mode="wait">
                <motion.p
                  key={isDescriptionExpanded ? 'full' : 'short'}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDescriptionExpanded ? product.description : `${product.description.substring(0, 150)}...`}
                </motion.p>
              </AnimatePresence>
            </motion.div>
            {product.description.length > 150 && (
              <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-[#D98A7E] font-semibold hover:underline mt-1 text-sm sm:text-base">
                {isDescriptionExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 border-b border-gray-100">
              <span className="font-medium text-gray-600 text-sm sm:text-base">Category:</span>
              <span className="font-semibold text-gray-800 capitalize text-sm sm:text-base">{product.category}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 border-b border-gray-100">
              <span className="font-medium text-gray-600 text-sm sm:text-base">Availability:</span>
              <span className={`font-semibold text-sm sm:text-base ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}</span>
            </div>
          </div>
          <div className="pt-3 sm:pt-4">
            {itemInCart ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                <p className="text-center font-semibold text-green-600 mb-2 sm:mb-3 text-sm sm:text-base">Added to your cart</p>
                <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                  <motion.button onClick={() => decreaseQuantity(product._id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white text-gray-800 font-bold w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm hover:bg-gray-100 transition-all flex items-center justify-center"><FiMinus className="h-3 w-3 sm:h-4 sm:w-4" /></motion.button>
                  <span className="text-lg sm:text-xl font-bold min-w-[20px] sm:min-w-[30px] text-center">{itemInCart.qty}</span>
                  <motion.button onClick={handleAddToCart} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={product.countInStock === 0} className="bg-white text-gray-800 font-bold w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm hover:bg-gray-100 transition-all flex items-center justify-center disabled:opacity-50"><FiPlus className="h-3 w-3 sm:h-4 sm:w-4" /></motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} disabled={product.countInStock === 0} className="w-full flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-[#D98A7E] to-[#C8907A] text-white font-medium sm:font-bold py-2 sm:py-3 md:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-sm sm:hover:shadow-xl transition-all disabled:opacity-70 text-sm sm:text-base">
                <FiShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Add to Cart</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16">
        <motion.div variants={staggerItem} className="w-full lg:w-1/2 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">Customer Reviews</h2>
          {product.reviews.length === 0 ? (<div className="text-center py-6 sm:py-8"><p className="text-gray-500 text-sm sm:text-base">No reviews yet. Be the first to review!</p></div>) : (
            <div className="space-y-4 sm:space-y-6">
              {product.reviews.map(review => (
                <motion.div key={review._id} variants={staggerItem} className="pb-4 sm:pb-6 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#FADCD9] to-[#D98A7E] flex items-center justify-center font-bold text-white text-lg sm:text-xl mr-3 sm:mr-4">{review.name.charAt(0).toUpperCase()}</div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">{review.name}</h4>
                          <p className="text-gray-500 text-xs sm:text-sm">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                        <Rating value={review.rating} compact starSize="!text-sm sm:!text-base" />
                      </div>
                      <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base">{review.comment}</p>
                      {userInfo && userInfo._id === review.user && (
                        // --- THIS IS THE FIX ---
                        // The component name has been corrected from `EditIcon` to the imported `FiEdit2`.
                        <button onClick={handleEditClick} className="mt-2 sm:mt-3 flex items-center text-[#D98A7E] hover:text-[#C8907A] transition-colors text-xs sm:text-sm font-medium"><FiEdit2 className="mr-1" /> Edit Review</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        <motion.div ref={reviewFormRef} variants={staggerItem} className="w-full lg:w-1/2 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">{isEditing ? 'Edit Your Review' : 'Write a Review'}</h2>
          {renderReviewForm()}
        </motion.div>
      </motion.div>

      <motion.div variants={slideUp} transition={{ delay: 0.4 }} className="mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((p) => (
              <motion.div
                key={p._id}
                whileHover={{ y: -5 }}
                className="bg-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm border border-gray-100 cursor-pointer"
                onClick={() => navigate(`/products/${p._id}`)}
              >
                <div className="bg-gray-100 h-24 sm:h-32 md:h-40 rounded-lg sm:rounded-xl mb-2 sm:mb-3 overflow-hidden">
                  <img src={(p.images && p.images[0]) || p.image || 'https://placehold.co/400x400/e2e8f0/333?text=Image'} alt={p.name} className="w-full h-full object-contain"/>
                </div>
                <h3 className="font-medium text-gray-800 mb-1 text-xs sm:text-sm md:text-base line-clamp-1 sm:line-clamp-2">{p.name}</h3>
                <p className="text-[#D98A7E] font-bold text-sm sm:text-base">${p.price.toFixed(2)}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 col-span-2 sm:col-span-3 lg:col-span-4 text-sm sm:text-base">No related products found.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetailPage;

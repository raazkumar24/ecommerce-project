// FILE: client/src/pages/ProductDetailPage.jsx (Final Corrected Version with Relative API Paths)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Rating from '../components/common/Rating';

const ProductDetailPage = ({ id, navigate }) => {
  // --- STATE MANAGEMENT ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);

  const [reviewEligibility, setReviewEligibility] = useState({ canReview: false, message: '', existingReview: null });
  const [isEditing, setIsEditing] = useState(false);

  // --- HOOKS & REFS ---
  const { cartItems, addToCart, decreaseQuantity } = useCart();
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  const reviewFormRef = useRef(null);

  // --- DATA FETCHING ---
  const fetchProduct = useCallback(async () => {
    try {
      // --- THIS IS THE FIX ---
      // The URL now uses a relative path, which will be handled by the Vite proxy.
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (userInfo) {
        try {
          // --- THIS IS THE FIX ---
          // The URL now uses a relative path.
          const res = await fetch(`/api/users/can-review/${id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          const data = await res.json();
          setReviewEligibility(data);
          if (data.existingReview) {
            setRating(data.existingReview.rating);
            setComment(data.existingReview.comment);
          } else {
            setRating(0);
            setComment('');
          }
        } catch (err) {
          setReviewEligibility({ canReview: false, message: 'Could not verify eligibility.' });
        }
      }
    };

    const loadData = async () => {
        setLoading(true);
        await fetchProduct();
        await checkReviewEligibility();
        setLoading(false);
    }
    loadData();
  }, [id, fetchProduct, userInfo]);

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
      // --- THIS IS THE FIX ---
      // The URL now uses a relative path.
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      
      showNotification(successMessage, 'success');
      setIsEditing(false);
      
      await fetchProduct();
      // --- THIS IS THE FIX ---
      // The URL now uses a relative path.
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

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-200 w-full h-96 rounded-xl animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center mt-20">Product not found.</div>;

  const itemInCart = cartItems.find(item => item._id === product._id);

  const renderReviewForm = () => {
    if (!userInfo) {
      return <p className="text-gray-600">Please <a href="/login" onClick={(e) => {e.preventDefault(); navigate('/login')}} className="text-blue-600 hover:underline font-semibold">sign in</a> to write a review.</p>;
    }
    
    const showForm = reviewEligibility.canReview || isEditing;

    if (showForm) {
      return (
        <form onSubmit={submitReviewHandler} className="space-y-4">
          <div>
            <label className="font-medium text-gray-700">Your Rating</label>
            <div className="flex items-center space-x-1 mt-2" onMouseLeave={() => setHoverRating(0)}>
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <motion.button type="button" key={starValue} onClick={() => setRating(starValue)} onMouseEnter={() => setHoverRating(starValue)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="focus:outline-none">
                    <i className={`fas fa-star text-2xl transition-colors ${starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                  </motion.button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="font-medium text-gray-700">Your Comment</label>
            <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"></textarea>
          </div>
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loadingReview} className="flex-grow py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500">
              {loadingReview ? 'Submitting...' : (reviewEligibility.existingReview ? 'Update Review' : 'Submit Review')}
            </motion.button>
            {isEditing && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setIsEditing(false)} className="py-3 px-4 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </motion.button>
            )}
          </div>
        </form>
      );
    } else {
      return <p className="text-gray-600 font-medium p-4 bg-gray-100 rounded-lg">{reviewEligibility.message || 'You are not eligible to review this product.'}</p>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => navigate('/products')} className="mb-8 flex items-center text-gray-600 hover:text-blue-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Products
        </button>
      </motion.div>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white p-6 rounded-xl shadow-lg">
          <img src={product.image || `https://placehold.co/600x600/e2e8f0/333?text=${encodeURIComponent(product.name)}`} alt={product.name} className="w-full h-full object-contain" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <div className="mb-4">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-6">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Status:</span>
                <span className={`font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Brand:</span>
                <span className="font-bold text-gray-800">{product.brand}</span>
              </div>
            </div>
            <div className="mt-6">
              {itemInCart ? (
                <div>
                  <p className="text-center font-semibold text-green-600 mb-3">Added to cart!</p>
                  <div className="flex items-center justify-center space-x-4">
                    <button onClick={() => decreaseQuantity(product._id)} className="bg-gray-200 text-gray-800 font-bold w-10 h-10 rounded-full hover:bg-gray-300 transition-colors">-</button>
                    <span className="text-2xl font-bold">{itemInCart.qty}</span>
                    <button onClick={handleAddToCart} className="bg-gray-200 text-gray-800 font-bold w-10 h-10 rounded-full hover:bg-gray-300 transition-colors">+</button>
                  </div>
                </div>
              ) : (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} disabled={product.countInStock === 0} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed">
                  Add to Cart
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          {product.reviews.length === 0 && <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>}
          <div className="space-y-6">
            {product.reviews.map(review => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center mb-2">
                   <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-4">
                     {review.name.charAt(0)}
                   </div>
                   <div>
                     <strong className="text-gray-800">{review.name}</strong>
                     <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                   </div>
                   <div className="ml-auto flex items-center">
                     <Rating value={review.rating} />
                     {userInfo && userInfo._id === review.user && (
                       <button onClick={handleEditClick} className="ml-4 text-blue-600 hover:underline text-sm font-medium">Edit</button>
                     )}
                   </div>
                </div>
                <p className="mt-2 text-gray-700 pl-14">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <div ref={reviewFormRef} className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            {isEditing ? 'Edit Your Review' : 'Write a Customer Review'}
          </h2>
          {renderReviewForm()}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetailPage;

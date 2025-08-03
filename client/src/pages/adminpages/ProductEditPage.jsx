// FILE: client/src/pages/adminpages/ProductEditPage.jsx (Corrected with Tags Pre-fill)

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { FiUploadCloud, FiTrash2, FiX } from 'react-icons/fi';

const ProductEditPage = ({ id, navigate }) => {
  // --- STATE MANAGEMENT ---
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();

  // Form fields state.
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  // State for the product tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // UI states for loading, errors, and uploads
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- DATA FETCHING ---
  // Fetches the product details when the component mounts.
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch product");

        // Pre-fill the form fields with the fetched product data.
        setName(data.name);
        setPrice(data.price);
        setImages(data.images || []);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        
        // --- THIS IS THE FIX ---
        // We now correctly set the `tags` state with the data fetched from the server.
        // The `|| []` ensures that if a product has no tags, it defaults to an empty array.
        setTags(data.tags || []);

      } catch (err) {
        setError(err.message);
        showNotification(`Error: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchProductDetails();
    } else {
      navigate("/login");
    }
  }, [id, userInfo, navigate, showNotification]);

  // --- HANDLERS ---
  // Handles the main form submission to update the product.
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        // The body now sends the `tags` array to the backend.
        body: JSON.stringify({
          name, price: Number(price), images, brand, category,
          countInStock: Number(countInStock), description, tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");
      showNotification("Product updated successfully!", "success");
      window.location.href = '/admin/productlist';
    } catch (err) {
      showNotification(`Error: ${err.message}`, "error");
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Handles the file upload process for multiple images.
  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    setUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${userInfo.token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image upload failed");

      setImages(prevImages => [...prevImages, ...data.images]);
      showNotification("Images uploaded successfully!", "success");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (imageUrlToRemove) => {
    setImages(prevImages => prevImages.filter(url => url !== imageUrlToRemove));
  };
  
  // --- TAG HANDLERS ---
  // Handles adding a new tag when the user presses Enter or Comma.
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  // Handles removing a tag when the 'x' is clicked.
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


  // --- RENDER LOGIC ---
  if (loading) return <p className="text-center py-12">Loading product data...</p>;
  if (error) return <p className="text-center py-12 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-serif font-bold text-[#D98A7E] mb-2">Edit Product</h1>
          <p className="text-gray-500 mb-8">Update the details for your product below.</p>
        </motion.div>
        
        <form onSubmit={submitHandler} className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Core Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name, Price, Brand, Category, etc. fields remain the same */}
              <div>
                <label htmlFor="name" className="block font-semibold text-gray-700 mb-1">Name</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition" />
              </div>
              <div>
                <label htmlFor="price" className="block font-semibold text-gray-700 mb-1">Price ($)</label>
                <input id="price" type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition" />
              </div>
              <div>
                <label htmlFor="brand" className="block font-semibold text-gray-700 mb-1">Brand</label>
                <input id="brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition" />
              </div>
              <div>
                <label htmlFor="category" className="block font-semibold text-gray-700 mb-1">Category</label>
                <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="countInStock" className="block font-semibold text-gray-700 mb-1">Count In Stock</label>
                <input id="countInStock" type="number" min={0} value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-[#D4A28E] transition"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Product Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((imgUrl, index) => (
                <div key={index} className="relative group">
                  <img src={imgUrl} alt={`Product image ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                  <button type="button" onClick={() => handleRemoveImage(imgUrl)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label htmlFor="image-file" className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-[#D4A28E] cursor-pointer transition-colors">
                <FiUploadCloud className="w-8 h-8 mb-2" />
                <span className="text-sm font-semibold">Upload Images</span>
                <input id="image-file" type="file" multiple onChange={uploadFileHandler} className="hidden" />
              </label>
            </div>
            {uploading && <div className="mt-4 text-center text-gray-600">Uploading...</div>}
          </div>

          {/* --- TAGS INPUT SECTION --- */}
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Search Tags</h2>
            <p className="text-sm text-gray-500 mb-4">Add keywords to improve search results. Press Enter or comma to add a tag.</p>
            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#D4A28E] transition">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 bg-[#FADCD9] text-[#D98A7E] font-semibold px-3 py-1 rounded-full">
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                    <FiX size={14} />
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "Add tags..." : ""}
                className="flex-grow bg-transparent p-1 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <motion.button
              type="submit"
              disabled={loadingUpdate || uploading}
              className="bg-[#D4A28E] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-[#C8907A] transition-all disabled:opacity-50"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {loadingUpdate ? "Updating..." : "Update Product"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;

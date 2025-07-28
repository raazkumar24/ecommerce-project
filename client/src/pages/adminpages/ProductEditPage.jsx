// // FILE: client/src/pages/ProductEditPage.jsx

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useNotification } from "../../context/NotificationContext";

// /**
//  * ProductEditPage - Admin interface to edit an existing product.
//  *
//  * Props:
//  * - id: Product ID to edit (string).
//  * - navigate: Navigation function to redirect after update.
//  */
// const ProductEditPage = ({ id, navigate }) => {
//   const { userInfo } = useAuth();
//   const { showNotification } = useNotification();

//   // --- Form fields states ---
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState(0);
//   const [image, setImage] = useState("");
//   const [brand, setBrand] = useState("");
//   const [category, setCategory] = useState("");
//   const [countInStock, setCountInStock] = useState(0);
//   const [description, setDescription] = useState("");

//   // --- UI states ---
//   const [loading, setLoading] = useState(true);           // Loading product details
//   const [error, setError] = useState(null);               // Error fetching details
//   const [loadingUpdate, setLoadingUpdate] = useState(false);  // Loading during update
//   const [errorUpdate, setErrorUpdate] = useState(null);       // Error during update

//   // Fetch product details when component mounts or id changes
//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`http://localhost:5000/api/products/${id}`);
//         const data = await res.json();

//         if (!res.ok) throw new Error(data.message || "Failed to fetch product");

//         // Pre-fill the form fields
//         setName(data.name);
//         setPrice(data.price);
//         setImage(data.image);
//         setBrand(data.brand);
//         setCategory(data.category);
//         setCountInStock(data.countInStock);
//         setDescription(data.description);

//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userInfo && userInfo.isAdmin) {
//       fetchProductDetails();
//     } else {
//       navigate("/login");
//     }
//   }, [id, userInfo, navigate]);

//   // Handle form submission to update the product
//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setLoadingUpdate(true);
//     setErrorUpdate(null);

//     try {
//       const res = await fetch(`http://localhost:5000/api/products/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//         body: JSON.stringify({
//           name,
//           price: Number(price),
//           image,
//           brand,
//           category,
//           countInStock: Number(countInStock),
//           description,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to update product");

//       showNotification("Product updated successfully!", "success");
//       navigate("/admin/productlist");
//     } catch (err) {
//       setErrorUpdate(err.message);
//       showNotification(`Error: ${err.message}`, "error");
//     } finally {
//       setLoadingUpdate(false);
//     }
//   };

//   // --- LOADING & ERROR UI ---
//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-gray-600 text-lg">Loading product data...</p>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-red-600 text-lg">{error}</p>
//       </div>
//     );

//   // --- MAIN FORM UI ---
//   return (
//     <div className="flex justify-center py-12 px-4 bg-gray-50 min-h-screen">
//       <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-10">
//         <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Edit Product</h1>

//         {/* Update error message */}
//         {errorUpdate && (
//           <p className="bg-red-100 text-red-700 px-4 py-2 mb-6 rounded-md border border-red-300 text-center">
//             {errorUpdate}
//           </p>
//         )}

//         <form onSubmit={submitHandler} className="space-y-6">
//           <div>
//             <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
//               Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="Product name"
//             />
//           </div>

//           <div>
//             <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
//               Price ($)
//             </label>
//             <input
//               id="price"
//               type="number"
//               min={0}
//               step="0.01"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="0.00"
//             />
//           </div>

//           <div>
//             <label htmlFor="image" className="block text-gray-700 font-medium mb-1">
//               Image URL or Path
//             </label>
//             <input
//               id="image"
//               type="text"
//               value={image}
//               onChange={(e) => setImage(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="https://example.com/image.jpg"
//             />
//           </div>

//           <div>
//             <label htmlFor="brand" className="block text-gray-700 font-medium mb-1">
//               Brand
//             </label>
//             <input
//               id="brand"
//               type="text"
//               value={brand}
//               onChange={(e) => setBrand(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="Brand name"
//             />
//           </div>

//           <div>
//             <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
//               Category
//             </label>
//             <input
//               id="category"
//               type="text"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="Category"
//             />
//           </div>

//           <div>
//             <label htmlFor="countInStock" className="block text-gray-700 font-medium mb-1">
//               Count In Stock
//             </label>
//             <input
//               id="countInStock"
//               type="number"
//               min={0}
//               value={countInStock}
//               onChange={(e) => setCountInStock(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="0"
//             />
//           </div>

//           <div>
//             <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
//               Description
//             </label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows="4"
//               required
//               className="w-full border border-gray-300 rounded-md px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="Product description"
//             ></textarea>
//           </div>

//           <button
//             type="submit"
//             disabled={loadingUpdate}
//             className={`w-full py-3 text-white rounded-md font-semibold transition ${
//               loadingUpdate
//                 ? "bg-blue-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loadingUpdate ? "Updating..." : "Update Product"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Export the component as default export
// export default ProductEditPage;

// FILE: client/src/pages/ProductEditPage.jsx (Updated with Image Upload)

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

const ProductEditPage = ({ id, navigate }) => {
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();

  // --- Form fields states ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  // --- UI states ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  // NEW: State to track the image upload process
  const [uploading, setUploading] = useState(false);

  // Fetch product details when component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch product");

        // Pre-fill the form fields with existing product data
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchProductDetails();
    } else {
      navigate("/login");
    }
  }, [id, userInfo, navigate]);

  // --- HANDLERS ---

  // Handle form submission to update the product details
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setErrorUpdate(null);
    try {
      const res = await fetch(`api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          image,
          brand,
          category,
          countInStock: Number(countInStock),
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");
      showNotification("Product updated successfully!", "success");
      navigate("/admin/productlist");
    } catch (err) {
      setErrorUpdate(err.message);
      showNotification(`Error: ${err.message}`, "error");
    } finally {
      setLoadingUpdate(false);
    }
  };

  // NEW: Handle the file upload process
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    const formData = new FormData();
    formData.append("image", file); // 'image' must match the field name in our backend route
    setUploading(true);

    try {
      const res = await fetch("api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image upload failed");

      // If upload is successful, set the image state with the URL from Cloudinary
      setImage(data.image);
      showNotification("Image uploaded successfully!", "success");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setUploading(false);
    }
  };

  // --- LOADING & ERROR UI ---
  if (loading) return <p>Loading product data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // --- MAIN FORM UI ---
  return (
    <div className="flex justify-center py-12 px-4 bg-gray-50 min-h-screen">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Edit Product
        </h1>

        {errorUpdate && (
          <p className="bg-red-100 text-red-700 p-3 mb-6 rounded-md text-center">
            {errorUpdate}
          </p>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          {/* ... (Name, Price fields remain the same) ... */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Product name"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-1"
            >
              Price ($)
            </label>
            <input
              id="price"
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="0.00"
            />
          </div>

          {/* --- NEW: IMAGE UPLOAD FIELD --- */}
          <div>
            <label
              htmlFor="image"
              className="block text-gray-700 font-medium mb-1"
            >
              Image
            </label>
            <input
              id="image-url"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter image URL or upload"
            />
            <input
              id="image-file"
              type="file"
              onChange={uploadFileHandler}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {/* Show a spinner while uploading */}
            {uploading && <div className="mt-2 text-center">Uploading...</div>}
          </div>

          {/* ... (Brand, Category, Count In Stock, Description fields remain the same) ... */}
          <div>
            <label
              htmlFor="brand"
              className="block text-gray-700 font-medium mb-1"
            >
              Brand
            </label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Brand name"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium mb-1"
            >
              Category
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Category"
            />
          </div>

          <div>
            <label
              htmlFor="countInStock"
              className="block text-gray-700 font-medium mb-1"
            >
              Count In Stock
            </label>
            <input
              id="countInStock"
              type="number"
              min={0}
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="0"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Product description"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loadingUpdate}
            className={`w-full py-3 text-white rounded-md font-semibold transition ${
              loadingUpdate
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loadingUpdate ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;

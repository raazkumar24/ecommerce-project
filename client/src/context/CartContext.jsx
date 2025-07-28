// FILE: client/src/context/CartContext.jsx (Final API-Driven Version with Payment Method and Clear Cart)

// ----------------------------------
// Imports
// ----------------------------------
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext"; // We need to know who the user is

// ----------------------------------
// Context creation
// ----------------------------------
const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  return useContext(CartContext);
};

// ----------------------------------
// Local Storage Setup
// ----------------------------------

// Get shipping address from localStorage if it exists
const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

// Get payment method from localStorage if it exists
const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : "";

// ----------------------------------
// CartProvider Component
// ----------------------------------
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth(); // Get user info, including the token

  const [shippingAddress, setShippingAddress] = useState(
    shippingAddressFromStorage
  );
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodFromStorage);

  // ----------------------------------
  // Fetch cart from backend
  // ----------------------------------
  const fetchCart = useCallback(async () => {
    if (!userInfo) {
      setCartItems([]); // Clear cart if no user
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/cart", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch cart.");
      const data = await response.json();
      const formattedCart = data.map((item) => ({
        ...item.product,
        qty: item.qty,
      }));
      setCartItems(formattedCart);
    } catch (err) {
      setError(err.message);
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  // Load cart when user logs in/out
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ----------------------------------
  // Add to cart via API
  // ----------------------------------
  const addToCart = async (product) => {
    if (!userInfo) {
      alert("Please log in to add items to your cart.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/users/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ productId: product._id, qty: 1 }),
      });
      if (!response.ok) throw new Error("Failed to add item.");
      const data = await response.json();
      const formattedCart = data.map((item) => ({
        ...item.product,
        qty: item.qty,
      }));
      setCartItems(formattedCart);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  // ----------------------------------
  // Decrease item quantity via API
  // ----------------------------------
  const decreaseQuantity = async (productId) => {
    const item = cartItems.find((i) => i._id === productId);
    if (!item) return;

    const newQty = item.qty - 1;

    try {
      const response = await fetch("http://localhost:5000/api/users/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ productId, qty: newQty }),
      });
      if (!response.ok) throw new Error("Failed to update quantity.");
      const data = await response.json();
      const formattedCart = data.map((item) => ({
        ...item.product,
        qty: item.qty,
      }));
      setCartItems(formattedCart);
    } catch (err) {
      console.error("Decrease quantity error:", err);
    }
  };

  // ----------------------------------
  // Remove item from cart via API
  // ----------------------------------
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to remove item.");
      const data = await response.json();
      const formattedCart = data.map((item) => ({
        ...item.product,
        qty: item.qty,
      }));
      setCartItems(formattedCart);
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  // ----------------------------------
  // Save shipping address to localStorage
  // ----------------------------------
  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem("shippingAddress", JSON.stringify(data));
  };

  // ----------------------------------
  // Save payment method to localStorage
  // ----------------------------------
  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
    localStorage.setItem("paymentMethod", JSON.stringify(data));
  };

  // ----------------------------------
  // NEW: Clear all cart-related data (used after placing an order)
  // ----------------------------------
  const clearCart = () => {
    setCartItems([]);
    setShippingAddress({});
    setPaymentMethod("");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");

    // Optional: You could clear local cart cache if you implement that
    // Note: Backend should clear user cart during order placement
  };

  // ----------------------------------
  // Provide context to children
  // ----------------------------------
  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    shippingAddress,
    saveShippingAddress,
    paymentMethod,
    savePaymentMethod,
    clearCart, // <- NEW: Included in context
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

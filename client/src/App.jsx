// FILE: client/src/App.jsx (Final Corrected Version with Conditional Layout)

import React, { useState, useEffect } from 'react';

// Import all components and pages
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import Notification from './components/common/Notification.jsx';

import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ShippingPage from './pages/ShippingPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import PlaceOrderPage from './pages/PlaceOrderPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Admin Pages
import ProductListPage from './pages/adminpages/ProductListPage.jsx';
import ProductEditPage from './pages/adminpages/ProductEditPage.jsx';
import OrderListPage from './pages/adminpages/OrderListPage.jsx';
import UserListPage from './pages/adminpages/UserListPage.jsx';
import UserEditPage from './pages/adminpages/UserEditPage.jsx';

// Import the authentication context hook
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const { userInfo } = useAuth(); // Get user info to protect routes

  // Effect to handle browser back/forward navigation
  useEffect(() => {
    const onLocationChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  // Function to navigate programmatically
  const navigate = (to) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };

  // --- Main Application Router ---
  // The order of these checks is critical! More specific routes must come first.
  let content;

  if (path === '/') {
    content = <HomePage navigate={navigate} />;
  }
  // --- CATEGORY ROUTES (Most Specific First) ---
  else if (path.startsWith('/category/') && path.includes('/page/')) {
    const parts = path.split('/');
    const category = parts[2];
    const pageNumber = parts[4];
    content = <CategoryPage navigate={navigate} category={category} pageNumber={pageNumber} />;
  }
  else if (path.startsWith('/category/')) {
    const category = path.split('/')[2];
    content = <CategoryPage navigate={navigate} category={category} />;
  }
  // --- SEARCH ROUTES ---
  else if (path.startsWith('/search/') && path.includes('/page/')) {
    const parts = path.split('/');
    const keyword = parts[2];
    const pageNumber = parts[4];
    content = <ProductsPage navigate={navigate} keyword={keyword} pageNumber={pageNumber} />;
  }
  else if (path.startsWith('/search/')) {
    const keyword = path.split('/')[2];
    content = <ProductsPage navigate={navigate} keyword={keyword} />;
  }
  // --- GENERAL PRODUCT ROUTES (Less Specific) ---
  else if (path.startsWith('/products/page/')) {
    const pageNumber = path.split('/')[3];
    content = <ProductsPage navigate={navigate} pageNumber={pageNumber} />;
  }
  else if (path === '/products') {
    content = <ProductsPage navigate={navigate} />;
  }
  // This is the most general product route, so it must come last in this group.
  else if (path.startsWith('/products/')) {
    const id = path.split('/')[2];
    content = <ProductDetailPage id={id} navigate={navigate} />;
  }
  // --- CART & AUTH ROUTES ---
  else if (path === '/cart') {
    content = <CartPage navigate={navigate} />;
  }
  else if (path === '/login') {
    content = <LoginPage navigate={navigate} />;
  }
  else if (path === '/register') {
    content = <RegisterPage navigate={navigate} />;
  }
  // --- PROTECTED USER ROUTES ---
  else if (path === '/shipping') {
    content = userInfo ? <ShippingPage navigate={navigate} /> : <LoginPage navigate={navigate} />;
  }
  else if (path === '/payment') {
    content = userInfo ? <PaymentPage navigate={navigate} /> : <LoginPage navigate={navigate} />;
  }
  else if (path === '/placeorder') {
    content = userInfo ? <PlaceOrderPage navigate={navigate} /> : <LoginPage navigate={navigate} />;
  }
  else if (path.startsWith('/order/')) {
    const orderId = path.split('/')[2];
    content = userInfo ? <OrderPage id={orderId} navigate={navigate} /> : <LoginPage navigate={navigate} />;
  }
  else if (path === '/profile') {
    content = userInfo ? <ProfilePage navigate={navigate} /> : <LoginPage navigate={navigate} />;
  }
  // --- PROTECTED ADMIN ROUTES ---
  else if (path.startsWith('/admin/productlist')) {
    const parts = path.split('/');
    const pageNumber = path.includes('/page/') ? parts[parts.length - 1] : '1';
    const keyword = path.includes('/search/') ? parts[3] : '';
    content = userInfo && userInfo.isAdmin ? <ProductListPage navigate={navigate} keyword={keyword} pageNumber={pageNumber} /> : <LoginPage navigate={navigate} />;
  }
  else if (path.startsWith('/admin/product/')) {
    const id = path.split('/')[3];
    content = userInfo && userInfo.isAdmin ? <ProductEditPage id={id} navigate={navigate} /> : <LoginPage navigate={navigate} />;
  }
  else if (path === '/admin/orderlist') {
    content = userInfo && userInfo.isAdmin ? <OrderListPage navigate={navigate} /> : <LoginPage navigate={navigate} />;
  }
  else if (path === '/admin/userlist') {
    content = userInfo && userInfo.isAdmin ? <UserListPage navigate={navigate} /> : <LoginPage navigate={navigate} />;
  }
  else if (path.startsWith('/admin/user/')) {
    const id = path.split('/')[3];
    content = userInfo && userInfo.isAdmin ? <UserEditPage id={id} navigate={navigate} /> : <LoginPage navigate={navigate} />;
  }
  // --- FALLBACK ROUTE ---
  else {
    content = <NotFoundPage navigate={navigate} />;
  }

  // --- THIS IS THE FIX ---
  // We determine which pages should have the constrained container style.
  // The HomePage should be full-width, so we exclude it.
  const useContainer = path !== '/';

  return (
    <div className=" bg-[#FFF5F0] min-h-screen flex flex-col font-sans">
      <Notification />
      <Header navigate={navigate} />
      
      {/* The main content area where the current page is displayed. */}
      {/* We conditionally apply the container and padding classes based on the `useContainer` variable. */}
      <main className={`flex-grow ${useContainer ? 'container mx-auto px-0 sm:px-6 lg:px-8 py-8' : ''}`}>
        {content}
      </main>
      
      <Footer />
    </div>
  );
}

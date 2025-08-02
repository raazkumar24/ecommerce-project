/* eslint-disable no-unused-vars */
// FILE: client/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

// Get user info from localStorage if it exists
const userInfoFromStorage = localStorage.getItem('userInfo') 
  ? JSON.parse(localStorage.getItem('userInfo')) 
  : null;

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(userInfoFromStorage);

  const login = async (email, password) => {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    // Set user info in state and local storage
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const register = async (name, email, password) => {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    // After successful registration, automatically log the user in
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    // Optional: redirect to login page or home page after logout
    window.location.href = '/login';
  };

   // This function will be called from the ProfilePage after a successful update.
  const updateUserInfo = (data) => {
    // Update the user info in the component's state
    setUserInfo(data);
    // Update the user info in local storage to persist the changes
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const value = {
    userInfo,
    login,
    register,
    logout,
     updateUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// FILE: client/src/context/NotificationContext.jsx

import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  // useCallback ensures the function isn't recreated on every render
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    // Automatically hide the notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  const value = {
    notification,
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

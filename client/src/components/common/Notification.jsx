// FILE: client/src/components/common/Notification.jsx (Redesigned & Responsive)

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
// Import icons for a more polished UI
import { FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

/**
 * Notification component to display success or error messages, redesigned to match the
 * "soft & minimal" theme of the application.
 * Features:
 * - Fully responsive: Appears as a banner on mobile and a toast on desktop.
 * - Smooth slide-in and fade-out animations with Framer Motion.
 * - Auto-dismisses after 4 seconds.
 * - Manual dismiss with a close button.
 * - Accessible with ARIA roles for screen readers.
 */
const Notification = () => {
 // Extract notification data and the clearing function from the context
 const { notification, clearNotification } = useNotification();

 // This effect sets up a timer to automatically dismiss the notification after 4 seconds.
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 4000);
      // Cleanup function to clear the timer if the component unmounts or notification changes
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  // Animation variants for the notification's entrance and exit
  const notificationVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.2 } },
  };

  // Determine the correct styling and icon based on the notification type
  const isSuccess = notification?.type === 'success';
  const typeClasses = isSuccess
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : 'bg-[#FADCD9] text-[#D98A7E] border-[#D98A7E]';
  const Icon = isSuccess ? FiCheckCircle : FiAlertCircle;

  return (
    // AnimatePresence is a Framer Motion component that handles animations for
    // components that are added to or removed from the React tree.
    <AnimatePresence>
      {notification && (
        <motion.div
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          // --- THIS IS THE RESPONSIVE FIX ---
          // On mobile (default), it's a banner fixed to the top.
          // On small screens and up (`sm:`), it moves to the top-right corner.
          className={`fixed top-10 left-5 right-5 sm:left-auto sm:top-24 sm:right-5 w-auto sm:w-full max-w-none sm:max-w-sm rounded-xl shadow-lg flex items-start space-x-3 p-4 border z-[9999] ${typeClasses}`}
        >
          {/* Icon container */}
          <div className={`flex-shrink-0 text-xl ${isSuccess ? 'text-emerald-600' : 'text-[#D98A7E]'}`}>
            <Icon />
          </div>
          
          {/* Notification message */}
          <div className="flex-grow font-semibold pt-0.5">{notification.message}</div>

          {/* Close button to dismiss notification */}
          <button
            onClick={clearNotification}
            className="flex-none -mr-1 -mt-1 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200/50 transition-colors"
            aria-label="Dismiss notification"
          >
            <FiX className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;

// FILE: client/src/components/common/Notification.jsx

import React, { useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { XMarkIcon } from '@heroicons/react/24/solid';

/**
 * Notification component to display success or error messages.
 * Features:
 * - Fixed position on top-right with high z-index to appear above header
 * - Auto-dismiss after 4 seconds (can be disabled by removing useEffect)
 * - Manual dismiss with a close "X" icon button
 * - Accessible with ARIA roles for screen readers
 */
const Notification = () => {
  // Extract notification data and clearing function from context
  const { notification, clearNotification } = useNotification();

  // Auto dismiss notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  // If no notification to show, render nothing
  if (!notification) return null;

  // Base classes for positioning, visibility, and styling
  const baseClasses =
    "fixed top-25 right-5 max-w-sm w-full rounded-lg shadow-lg flex items-center space-x-3 px-4 py-3 " +
    "text-white text-sm font-medium pointer-events-auto transition-all duration-300 ease-in-out z-[9999]";

  // Background colors depend on notification type
  const typeClasses =
    notification.type === 'success'
      ? 'bg-green-600 ring-1 ring-green-500/40'
      : 'bg-red-600 ring-1 ring-red-500/40';

  return (
    <div
      role="alert"            // Accessibility role for live region
      aria-live="assertive"    // Immediate announcement for screen readers
      aria-atomic="true"       // Whole region is presented as one unit
      className={`${baseClasses} ${typeClasses}`}
    >
      {/* Notification message */}
      <div className="flex-grow">{notification.message}</div>

      {/* Close button to dismiss notification */}
      <button
        onClick={clearNotification}                 // Calls function to clear notification
        className="flex-none ml-2 text-white hover:text-white/75 focus:outline-none focus:ring-2 focus:ring-white rounded"
        aria-label="Dismiss notification"           // Screen reader text
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Notification;

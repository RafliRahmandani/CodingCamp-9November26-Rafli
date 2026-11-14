/**
 * notification-manager.js - Notification Manager module
 * 
 * This module provides user feedback through toast notifications:
 * - show(message, type, duration) - show notification with specified type
 * - success(message) - show success notification
 * - error(message) - show error notification
 * - warning(message) - show warning notification
 * - info(message) - show info notification
 * 
 * Features:
 * - Toast notification component
 * - Support for 4 types: success, error, warning, info
 * - All messages in Indonesian
 * - Auto-dismiss after 3-5 seconds (configurable per notification)
 * - Manual close button
 * - Stack multiple notifications
 * - Accessible with aria-live regions
 * 
 * Performance: Form submission feedback within 500ms
 * Uses IIFE module pattern for encapsulation.
 * Implemented in Task 14.1
 */

const NotificationManager = (function() {
  'use strict';
  
  // ========================================
  // CONFIGURATION
  // ========================================
  
  const CONFIG = {
    CONTAINER_ID: 'notification-container',
    DEFAULT_DURATION: 5000,
    ANIMATION_DURATION: 300,
    TYPES: {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning',
      INFO: 'info'
    },
    TYPE_ICONS: {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    },
    TOAST_CLASS_PREFIX: 'toast-'
  };
  
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const state = {
    activeNotifications: [],
    containerElement: null
  };
  
  // ========================================
  // PRIVATE FUNCTIONS
  // ========================================
  
  /**
   * Initialize notification container if not already present
   */
  function initializeContainer() {
    if (state.containerElement) {
      return;
    }
    
    let container = document.getElementById(CONFIG.CONTAINER_ID);
    
    if (!container) {
      container = document.createElement('div');
      container.id = CONFIG.CONTAINER_ID;
      container.className = 'notification-container';
      container.setAttribute('role', 'region');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    
    state.containerElement = container;
  }
  
  /**
   * Create toast element with the given configuration
   * @param {string} message - The notification message
   * @param {string} type - The notification type (success, error, warning, info)
   * @returns {HTMLElement} The toast element
   */
  function createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${CONFIG.TOAST_CLASS_PREFIX}${type}`;
    toast.setAttribute('role', 'alert');
    
    // Message span
    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast-message';
    messageSpan.textContent = message;
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.setAttribute('aria-label', 'Tutup notifikasi');
    closeButton.setAttribute('type', 'button');
    closeButton.textContent = '×';
    
    // Append elements
    toast.appendChild(messageSpan);
    toast.appendChild(closeButton);
    
    return toast;
  }
  
  /**
   * Add animation class to trigger entry animation
   * @param {HTMLElement} toastElement - The toast element
   */
  function animateIn(toastElement) {
    // Force reflow to trigger animation
    // eslint-disable-next-line no-unused-expressions
    toastElement.offsetHeight;
    toastElement.classList.add('toast-show');
  }
  
  /**
   * Remove animation class to trigger exit animation
   * @param {HTMLElement} toastElement - The toast element
   * @returns {Promise} Resolves when animation completes
   */
  function animateOut(toastElement) {
    return new Promise((resolve) => {
      toastElement.classList.remove('toast-show');
      
      const handleTransitionEnd = () => {
        toastElement.removeEventListener('transitionend', handleTransitionEnd);
        resolve();
      };
      
      toastElement.addEventListener('transitionend', handleTransitionEnd);
      
      // Fallback timeout in case transitionend doesn't fire
      setTimeout(resolve, CONFIG.ANIMATION_DURATION + 100);
    });
  }
  
  /**
   * Remove toast from DOM and state
   * @param {HTMLElement} toastElement - The toast element
   * @param {string} notificationId - The notification ID
   */
  async function removeToast(toastElement, notificationId) {
    await animateOut(toastElement);
    
    if (toastElement.parentNode) {
      toastElement.parentNode.removeChild(toastElement);
    }
    
    // Remove from active notifications
    state.activeNotifications = state.activeNotifications.filter(
      (n) => n.id !== notificationId
    );
  }
  
  /**
   * Schedule auto-dismiss for a notification
   * @param {string} notificationId - The notification ID
   * @param {HTMLElement} toastElement - The toast element
   * @param {number} duration - Duration in milliseconds
   */
  function scheduleAutoDismiss(notificationId, toastElement, duration) {
    const timeoutId = setTimeout(() => {
      removeToast(toastElement, notificationId);
    }, duration);
    
    // Store timeout ID for potential cancellation
    const notification = state.activeNotifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.timeoutId = timeoutId;
    }
  }
  
  /**
   * Handle close button click
   * @param {Event} event - The click event
   * @param {string} notificationId - The notification ID
   * @param {HTMLElement} toastElement - The toast element
   */
  function handleCloseClick(event, notificationId, toastElement) {
    event.preventDefault();
    event.stopPropagation();
    
    // Cancel auto-dismiss timeout
    const notification = state.activeNotifications.find(
      (n) => n.id === notificationId
    );
    if (notification && notification.timeoutId) {
      clearTimeout(notification.timeoutId);
    }
    
    removeToast(toastElement, notificationId);
  }
  
  /**
   * Generate unique notification ID
   * @returns {string} Unique ID
   */
  function generateNotificationId() {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // ========================================
  // PUBLIC API
  // ========================================
  
  /**
   * Show a notification with specified type
   * @param {string} message - The notification message
   * @param {string} type - The notification type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  function show(message, type = CONFIG.TYPES.INFO, duration = CONFIG.DEFAULT_DURATION) {
    // Initialize container if needed
    initializeContainer();
    
    // Validate type
    if (!Object.values(CONFIG.TYPES).includes(type)) {
      console.warn(`Invalid notification type: ${type}`);
      type = CONFIG.TYPES.INFO;
    }
    
    // Create notification ID
    const notificationId = generateNotificationId();
    
    // Create toast element
    const toastElement = createToastElement(message, type);
    
    // Add to container
    state.containerElement.appendChild(toastElement);
    
    // Add to active notifications
    state.activeNotifications.push({
      id: notificationId,
      element: toastElement,
      type: type,
      timeoutId: null
    });
    
    // Trigger animation
    animateIn(toastElement);
    
    // Attach close button handler
    const closeButton = toastElement.querySelector('.toast-close');
    if (closeButton) {
      closeButton.addEventListener('click', (event) => {
        handleCloseClick(event, notificationId, toastElement);
      });
    }
    
    // Schedule auto-dismiss
    scheduleAutoDismiss(notificationId, toastElement, duration);
    
    // Return notification object for potential control
    return {
      id: notificationId,
      dismiss() {
        removeToast(toastElement, notificationId);
      }
    };
  }
  
  /**
   * Show a success notification
   * @param {string} message - The notification message
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  function success(message, duration = CONFIG.DEFAULT_DURATION) {
    return show(message, CONFIG.TYPES.SUCCESS, duration);
  }
  
  /**
   * Show an error notification
   * @param {string} message - The notification message
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  function error(message, duration = CONFIG.DEFAULT_DURATION) {
    return show(message, CONFIG.TYPES.ERROR, duration);
  }
  
  /**
   * Show a warning notification
   * @param {string} message - The notification message
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  function warning(message, duration = CONFIG.DEFAULT_DURATION) {
    return show(message, CONFIG.TYPES.WARNING, duration);
  }
  
  /**
   * Show an info notification
   * @param {string} message - The notification message
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  function info(message, duration = CONFIG.DEFAULT_DURATION) {
    return show(message, CONFIG.TYPES.INFO, duration);
  }
  
  /**
   * Clear all active notifications
   */
  function clearAll() {
    state.activeNotifications.forEach((notification) => {
      clearTimeout(notification.timeoutId);
      if (notification.element.parentNode) {
        notification.element.parentNode.removeChild(notification.element);
      }
    });
    state.activeNotifications = [];
  }
  
  /**
   * Get count of active notifications
   * @returns {number} Number of active notifications
   */
  function getActiveCount() {
    return state.activeNotifications.length;
  }
  
  // ========================================
  // PUBLIC API EXPORT
  // ========================================
  
  return {
    show,
    success,
    error,
    warning,
    info,
    clearAll,
    getActiveCount
  };
  
})();

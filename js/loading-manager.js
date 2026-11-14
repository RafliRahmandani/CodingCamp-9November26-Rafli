/**
 * loading-manager.js - Loading State Manager module
 * 
 * This module manages loading states for async operations:
 * - Show/hide loading spinners during operations
 * - Disable form buttons during submission
 * - Display "Memproses..." status messages
 * - Handle timeout scenarios (max 30 seconds)
 * - Auto-clear loading states on completion/error
 * 
 * Features:
 * - Global loading overlay for long operations
 * - Button-level loading states with spinners
 * - Loading indicators for search operations
 * - Loading states for chart data fetching
 * - Automatic timeout handling (30s max)
 * - Accessible loading state indicators
 * 
 * Performance: Provides visual feedback within 100ms
 * Uses IIFE module pattern for encapsulation.
 * Implemented in Task 14.3
 */

const LoadingManager = (function() {
  'use strict';
  
  // ========================================
  // CONFIGURATION
  // ========================================
  
  const CONFIG = {
    LOADING_CLASS: 'loading',
    LOADING_OVERLAY_ID: 'loading-overlay',
    DEFAULT_TIMEOUT: 30000, // 30 seconds max
    OVERLAY_MESSAGE: 'Memproses...',
    BUTTON_DISABLED_DURATION: 500 // Min duration to prevent double-clicks
  };
  
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const state = {
    activeLoading: new Map(), // Map of operation ID -> {element, type, timeout}
    overlayVisible: false,
    disabledButtons: new Set()
  };
  
  // ========================================
  // PRIVATE FUNCTIONS
  // ========================================
  
  /**
   * Create or get the global loading overlay element
   * @returns {HTMLElement} The overlay element
   */
  function getOrCreateOverlay() {
    let overlay = document.getElementById(CONFIG.LOADING_OVERLAY_ID);
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = CONFIG.LOADING_OVERLAY_ID;
      overlay.className = 'loading-overlay';
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-live', 'polite');
      overlay.setAttribute('aria-label', 'Indikator pemrosesan');
      
      // Create spinner
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      spinner.setAttribute('aria-hidden', 'true');
      
      // Create message
      const message = document.createElement('p');
      message.className = 'overlay-message';
      message.textContent = CONFIG.OVERLAY_MESSAGE;
      
      overlay.appendChild(spinner);
      overlay.appendChild(message);
      
      document.body.appendChild(overlay);
    }
    
    return overlay;
  }
  
  /**
   * Generate unique operation ID
   * @returns {string} Unique ID
   */
  function generateOperationId() {
    return `loading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Clear timeout for an operation
   * @param {string} operationId - The operation ID
   */
  function clearOperationTimeout(operationId) {
    const operation = state.activeLoading.get(operationId);
    if (operation && operation.timeout) {
      clearTimeout(operation.timeout);
    }
  }
  
  /**
   * Remove operation from tracking
   * @param {string} operationId - The operation ID
   */
  function removeOperation(operationId) {
    clearOperationTimeout(operationId);
    state.activeLoading.delete(operationId);
  }
  
  /**
   * Schedule timeout for an operation
   * @param {string} operationId - The operation ID
   * @param {Function} callback - Callback to execute on timeout
   * @param {number} duration - Duration in milliseconds
   */
  function scheduleTimeout(operationId, callback, duration = CONFIG.DEFAULT_TIMEOUT) {
    clearOperationTimeout(operationId);
    
    const timeout = setTimeout(() => {
      console.warn(`Loading operation ${operationId} exceeded timeout (${duration}ms)`);
      if (callback) {
        callback();
      }
      hideLoadingForOperation(operationId);
    }, duration);
    
    const operation = state.activeLoading.get(operationId);
    if (operation) {
      operation.timeout = timeout;
    }
  }
  
  /**
   * Hide loading state for a specific operation
   * @param {string} operationId - The operation ID
   */
  function hideLoadingForOperation(operationId) {
    const operation = state.activeLoading.get(operationId);
    
    if (!operation) {
      return;
    }
    
    if (operation.type === 'overlay') {
      // Hide overlay if no other operations are active
      if (state.activeLoading.size === 1) {
        const overlay = document.getElementById(CONFIG.LOADING_OVERLAY_ID);
        if (overlay) {
          overlay.classList.remove('active');
          state.overlayVisible = false;
        }
      }
    } else if (operation.type === 'button') {
      // Remove loading class from button
      const button = operation.element;
      if (button) {
        button.classList.remove(CONFIG.LOADING_CLASS);
        button.disabled = false;
        button.setAttribute('aria-busy', 'false');
      }
      state.disabledButtons.delete(operation.element);
    } else if (operation.type === 'element') {
      // Remove loading class from element
      const element = operation.element;
      if (element) {
        element.classList.remove(CONFIG.LOADING_CLASS);
        element.setAttribute('aria-busy', 'false');
      }
    }
    
    removeOperation(operationId);
  }
  
  // ========================================
  // PUBLIC API
  // ========================================
  
  /**
   * Show loading overlay (full-screen blocking operation)
   * Use for critical operations like form submission
   * @param {string} message - Optional custom message
   * @param {number} timeout - Timeout in milliseconds (default: 30s)
   * @returns {string} Operation ID for later reference
   */
  function showOverlay(message = CONFIG.OVERLAY_MESSAGE, timeout = CONFIG.DEFAULT_TIMEOUT) {
    const overlay = getOrCreateOverlay();
    const operationId = generateOperationId();
    
    // Update message if provided
    if (message) {
      const messageElement = overlay.querySelector('.overlay-message');
      if (messageElement) {
        messageElement.textContent = message;
      }
    }
    
    // Show overlay
    overlay.classList.add('active');
    state.overlayVisible = true;
    
    // Track operation
    state.activeLoading.set(operationId, {
      element: overlay,
      type: 'overlay',
      timeout: null
    });
    
    // Schedule timeout
    scheduleTimeout(operationId, null, timeout);
    
    return operationId;
  }
  
  /**
   * Hide loading overlay
   * @param {string} operationId - The operation ID returned from showOverlay()
   */
  function hideOverlay(operationId) {
    if (operationId && state.activeLoading.has(operationId)) {
      hideLoadingForOperation(operationId);
    } else if (!operationId && state.overlayVisible) {
      // Hide all active overlays if no operation ID provided
      const overlayOperation = Array.from(state.activeLoading.values())
        .find(op => op.type === 'overlay');
      
      if (overlayOperation) {
        const overlay = document.getElementById(CONFIG.LOADING_OVERLAY_ID);
        if (overlay) {
          overlay.classList.remove('active');
          state.overlayVisible = false;
        }
      }
    }
  }
  
  /**
   * Show loading state on a button (adds spinner, disables button)
   * Use for form submission buttons
   * @param {HTMLElement|string} buttonOrSelector - Button element or CSS selector
   * @param {number} timeout - Timeout in milliseconds (default: 30s)
   * @returns {string} Operation ID for later reference
   */
  function showButtonLoading(buttonOrSelector, timeout = CONFIG.DEFAULT_TIMEOUT) {
    let button = buttonOrSelector;
    
    // Handle selector string
    if (typeof buttonOrSelector === 'string') {
      button = document.querySelector(buttonOrSelector);
    }
    
    if (!button) {
      console.warn('Button element not found for loading state');
      return null;
    }
    
    const operationId = generateOperationId();
    
    // Add loading class
    button.classList.add(CONFIG.LOADING_CLASS);
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.setAttribute('aria-label', `${button.textContent} - Memproses`);
    
    // Store original text for later restoration
    button.dataset.originalText = button.textContent;
    button.textContent = 'Memproses...';
    
    // Track operation
    state.activeLoading.set(operationId, {
      element: button,
      type: 'button',
      timeout: null
    });
    
    state.disabledButtons.add(button);
    
    // Schedule timeout
    scheduleTimeout(operationId, null, timeout);
    
    return operationId;
  }
  
  /**
   * Hide loading state on a button
   * @param {string} operationId - The operation ID returned from showButtonLoading()
   */
  function hideButtonLoading(operationId) {
    if (operationId && state.activeLoading.has(operationId)) {
      const operation = state.activeLoading.get(operationId);
      const button = operation.element;
      
      if (button && button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        delete button.dataset.originalText;
      }
      
      hideLoadingForOperation(operationId);
    }
  }
  
  /**
   * Show loading state on an element (e.g., search results container)
   * Use for search operations
   * @param {HTMLElement|string} elementOrSelector - Element or CSS selector
   * @param {string} message - Optional message to display
   * @param {number} timeout - Timeout in milliseconds (default: 30s)
   * @returns {string} Operation ID for later reference
   */
  function showElementLoading(elementOrSelector, message = '', timeout = CONFIG.DEFAULT_TIMEOUT) {
    let element = elementOrSelector;
    
    // Handle selector string
    if (typeof elementOrSelector === 'string') {
      element = document.querySelector(elementOrSelector);
    }
    
    if (!element) {
      console.warn('Element not found for loading state');
      return null;
    }
    
    const operationId = generateOperationId();
    
    // Store original content
    element.dataset.originalContent = element.innerHTML;
    
    // Create loading content
    const loadingContent = document.createElement('div');
    loadingContent.className = 'loading-content';
    loadingContent.setAttribute('aria-live', 'polite');
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner spinner-small';
    spinner.setAttribute('aria-hidden', 'true');
    
    loadingContent.appendChild(spinner);
    
    if (message) {
      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      loadingContent.appendChild(messageElement);
    }
    
    // Clear and show loading content
    element.innerHTML = '';
    element.appendChild(loadingContent);
    element.classList.add(CONFIG.LOADING_CLASS);
    element.setAttribute('aria-busy', 'true');
    
    // Track operation
    state.activeLoading.set(operationId, {
      element: element,
      type: 'element',
      timeout: null
    });
    
    // Schedule timeout
    scheduleTimeout(operationId, null, timeout);
    
    return operationId;
  }
  
  /**
   * Hide loading state on an element and restore original content
   * @param {string} operationId - The operation ID returned from showElementLoading()
   */
  function hideElementLoading(operationId) {
    if (operationId && state.activeLoading.has(operationId)) {
      const operation = state.activeLoading.get(operationId);
      const element = operation.element;
      
      if (element && element.dataset.originalContent) {
        element.innerHTML = element.dataset.originalContent;
        delete element.dataset.originalContent;
      }
      
      hideLoadingForOperation(operationId);
    }
  }
  
  /**
   * Quick method to disable all form buttons
   * Useful before form submission
   * @param {HTMLElement|string} formOrSelector - Form element or CSS selector
   * @param {number} duration - Duration in milliseconds (auto-enable after this)
   */
  function disableFormButtons(formOrSelector, duration = CONFIG.BUTTON_DISABLED_DURATION) {
    let form = formOrSelector;
    
    if (typeof formOrSelector === 'string') {
      form = document.querySelector(formOrSelector);
    }
    
    if (!form) {
      console.warn('Form element not found');
      return;
    }
    
    const buttons = form.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      state.disabledButtons.add(button);
    });
    
    // Auto-enable after duration
    setTimeout(() => {
      buttons.forEach(button => {
        button.disabled = false;
        button.setAttribute('aria-busy', 'false');
        state.disabledButtons.delete(button);
      });
    }, duration);
  }
  
  /**
   * Quick method to enable all form buttons
   * @param {HTMLElement|string} formOrSelector - Form element or CSS selector
   */
  function enableFormButtons(formOrSelector) {
    let form = formOrSelector;
    
    if (typeof formOrSelector === 'string') {
      form = document.querySelector(formOrSelector);
    }
    
    if (!form) {
      console.warn('Form element not found');
      return;
    }
    
    const buttons = form.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = false;
      button.setAttribute('aria-busy', 'false');
      state.disabledButtons.delete(button);
    });
  }
  
  /**
   * Clear all active loading states
   * Useful for cleanup on page navigation
   */
  function clearAll() {
    // Hide all active operations
    Array.from(state.activeLoading.keys()).forEach(operationId => {
      hideLoadingForOperation(operationId);
    });
    
    // Clear disabled buttons
    state.disabledButtons.forEach(button => {
      button.disabled = false;
      button.setAttribute('aria-busy', 'false');
    });
    
    state.disabledButtons.clear();
    state.activeLoading.clear();
    state.overlayVisible = false;
  }
  
  /**
   * Get count of active loading operations
   * @returns {number} Number of active loading operations
   */
  function getActiveCount() {
    return state.activeLoading.size;
  }
  
  /**
   * Check if overlay is currently visible
   * @returns {boolean} True if overlay is visible
   */
  function isOverlayVisible() {
    return state.overlayVisible;
  }
  
  // ========================================
  // PUBLIC API EXPORT
  // ========================================
  
  return {
    showOverlay,
    hideOverlay,
    showButtonLoading,
    hideButtonLoading,
    showElementLoading,
    hideElementLoading,
    disableFormButtons,
    enableFormButtons,
    clearAll,
    getActiveCount,
    isOverlayVisible
  };
  
})();

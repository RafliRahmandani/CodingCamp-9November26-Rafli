/**
 * navigation-manager.js - Navigation Manager module for SPA routing
 * 
 * This module provides SPA routing functionality:
 * - navigateTo(route) - navigate to a route
 * - getCurrentRoute() - get current route
 * - init() - initialize routing
 * 
 * Uses hash-based routing (#/dashboard, #/form, etc.)
 * Uses IIFE module pattern for encapsulation.
 * Implemented in Task 4.1
 */

const NavigationManager = (function() {
    'use strict';
    
    // Private constants
    const ROUTE_REGISTRY = {
        '/': 'dashboard',
        '/form': 'transaksi',
        '/search': 'pencarian',
        '/analytics': 'analitik'
    };
    
    const DEFAULT_ROUTE = '/';
    
    // Private state
    let currentRoute = DEFAULT_ROUTE;
    let isInitialized = false;
    
    /**
     * Private helper: Normalize route hash
     * @param {string} hash - Raw hash value (e.g., "#/dashboard")
     * @returns {string} Normalized route (e.g., "/dashboard")
     */
    function normalizeHash(hash) {
        // Remove leading '#' if present
        let route = hash.startsWith('#') ? hash.substring(1) : hash;
        
        // Ensure route starts with '/'
        if (!route.startsWith('/')) {
            route = '/' + route;
        }
        
        return route;
    }
    
    /**
     * Private helper: Get section element ID from route
     * @param {string} route - Route path (e.g., "/dashboard")
     * @returns {string|null} Section ID or null if route not found
     */
    function getSectionId(route) {
        if (ROUTE_REGISTRY.hasOwnProperty(route)) {
            return ROUTE_REGISTRY[route];
        }
        return null;
    }
    
    /**
     * Private helper: Hide all sections
     */
    function hideAllSections() {
        const allSections = document.querySelectorAll('[id="dashboard"], [id="transaksi"], [id="pencarian"], [id="analitik"]');
        allSections.forEach(section => {
            if (section) {
                section.style.display = 'none';
            }
        });
    }
    
    /**
     * Private helper: Show section for given route
     * @param {string} route - Route path
     */
    function showSectionForRoute(route) {
        hideAllSections();
        
        const sectionId = getSectionId(route);
        if (sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'block';
            }
        }
    }
    
    /**
     * Private helper: Update navigation active states
     * @param {string} route - Current route path
     */
    function updateNavigationStates(route) {
        // Find all navigation links/buttons and update their active state
        const navLinks = document.querySelectorAll('[data-route]');
        navLinks.forEach(link => {
            const linkRoute = link.getAttribute('data-route');
            if (linkRoute === route) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Close mobile menu after navigation
        closeMobileMenu();
    }
    
    /**
     * Private helper: Close mobile menu
     */
    function closeMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    /**
     * Private helper: Toggle mobile menu
     */
    function toggleMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        }
    }
    
    /**
     * Private helper: Attach navigation link click handlers
     */
    function attachNavLinkHandlers() {
        const navLinks = document.querySelectorAll('[data-route]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const route = this.getAttribute('data-route');
                NavigationManager.navigateTo(route);
            });
        });
    }
    
    /**
     * Private helper: Attach hamburger menu toggle handler
     */
    function attachMenuToggleHandler() {
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
            // Update aria-expanded attribute
            navToggle.addEventListener('click', function() {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
            });
        }
    }
    
    /**
     * Private helper: Handle keyboard navigation in menu
     */
    function attachKeyboardHandlers() {
        // Handle Escape key to close mobile menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                    const navToggle = document.getElementById('nav-toggle');
                    if (navToggle) {
                        navToggle.focus();
                        navToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
        
        // Handle arrow keys for navigation within menu (desktop only)
        const navLinks = document.querySelectorAll('[data-route]');
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % navLinks.length;
                    navLinks[nextIndex].focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
                    navLinks[prevIndex].focus();
                }
            });
        });
    }
    
    /**
     * Private helper: Handle hash change event
     */
    function handleHashChange() {
        const hash = window.location.hash;
        const route = normalizeHash(hash) || DEFAULT_ROUTE;
        
        // Validate route
        if (!ROUTE_REGISTRY.hasOwnProperty(route)) {
            // Invalid route, fallback to default
            window.location.hash = DEFAULT_ROUTE;
            return;
        }
        
        currentRoute = route;
        
        // Update UI
        showSectionForRoute(currentRoute);
        updateNavigationStates(currentRoute);
        
        // Dispatch custom event for other modules
        const event = new CustomEvent('navigationChanged', {
            detail: { route: currentRoute, sectionId: getSectionId(currentRoute) }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Private helper: Initialize hash state
     */
    function initializeHashState() {
        const hash = window.location.hash;
        const route = normalizeHash(hash) || DEFAULT_ROUTE;
        
        // Validate and set route
        if (ROUTE_REGISTRY.hasOwnProperty(route)) {
            currentRoute = route;
        } else {
            // Invalid route, redirect to default
            window.location.hash = DEFAULT_ROUTE;
            currentRoute = DEFAULT_ROUTE;
        }
        
        // Show initial section and update nav states
        showSectionForRoute(currentRoute);
        updateNavigationStates(currentRoute);
    }
    
    // Public API
    return {
        /**
         * Navigate to a specific route
         * @param {string} route - Route path (e.g., "/dashboard", "/form", "/search", "/analytics")
         * @returns {boolean} True if navigation was successful, false if route is invalid
         */
        navigateTo: function(route) {
            // Normalize the route
            const normalizedRoute = normalizeHash(route);
            
            // Validate route
            if (!ROUTE_REGISTRY.hasOwnProperty(normalizedRoute)) {
                console.warn(`[NavigationManager] Invalid route: ${normalizedRoute}`);
                return false;
            }
            
            // Update hash (this triggers hashchange event)
            window.location.hash = normalizedRoute;
            return true;
        },
        
        /**
         * Get the current active route
         * @returns {string} Current route path (e.g., "/dashboard")
         */
        getCurrentRoute: function() {
            return currentRoute;
        },
        
        /**
         * Initialize the navigation system
         * Registers hashchange event listener and sets up initial routing
         * @returns {void}
         */
        init: function() {
            if (isInitialized) {
                console.warn('[NavigationManager] Already initialized');
                return;
            }
            
            // Set up initial hash state
            initializeHashState();
            
            // Attach click handlers to navigation links
            attachNavLinkHandlers();
            
            // Attach hamburger menu toggle handler
            attachMenuToggleHandler();
            
            // Attach keyboard navigation handlers
            attachKeyboardHandlers();
            
            // Register hashchange event listener
            window.addEventListener('hashchange', handleHashChange);
            
            isInitialized = true;
            
            console.log('[NavigationManager] Initialized successfully');
        },
        
        /**
         * Show the navigation menu (called after login)
         * @returns {void}
         */
        showNavigation: function() {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.style.display = 'block';
            }
        },
        
        /**
         * Hide the navigation menu (called after logout)
         * @returns {void}
         */
        hideNavigation: function() {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.style.display = 'none';
            }
            // Also close mobile menu
            closeMobileMenu();
        }
    };
})();


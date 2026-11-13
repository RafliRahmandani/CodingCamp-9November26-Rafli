/**
 * auth-manager.js - Authentication Manager module
 * 
 * This module provides authentication functionality:
 * - login(username, password) - authenticate user
 * - logout() - clear session
 * - isAuthenticated() - check auth state
 * - getCurrentUser() - get current user info
 * - hasRole(role) - check user role/permissions
 * 
 * Uses IIFE module pattern for encapsulation.
 * Stores auth state in sessionStorage for security.
 * Implemented in Task 3.1
 */

const AuthManager = (function() {
    // Private constants
    const SESSION_KEY = 'marketplace_session';
    
    // Hardcoded users for demo
    const USERS = {
        admin: {
            username: 'admin',
            password: '123456',
            role: 'admin',
            displayName: 'Administrator'
        },
        staff: {
            username: 'staff',
            password: 'staff123',
            role: 'staff',
            displayName: 'Staf Marketplace'
        }
    };
    
    /**
     * Private helper: Get current timestamp
     * @returns {string} ISO timestamp
     */
    function getCurrentTimestamp() {
        return new Date().toISOString();
    }
    
    /**
     * Private helper: Create session object from user
     * @param {object} user - User object
     * @returns {object} Session object
     */
    function createSession(user) {
        return {
            username: user.username,
            role: user.role,
            displayName: user.displayName,
            loginTime: getCurrentTimestamp()
        };
    }
    
    /**
     * Private helper: Save session to sessionStorage
     * @param {object} session - Session object to save
     */
    function saveSession(session) {
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } catch (error) {
            console.error('Error saving session:', error);
        }
    }
    
    /**
     * Private helper: Load session from sessionStorage
     * @returns {object|null} Session object or null
     */
    function loadSession() {
        try {
            const sessionData = sessionStorage.getItem(SESSION_KEY);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (error) {
            console.error('Error loading session:', error);
            return null;
        }
    }
    
    /**
     * Private helper: Clear session from sessionStorage
     */
    function clearSession() {
        try {
            sessionStorage.removeItem(SESSION_KEY);
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    }
    
    // Public API
    return {
        /**
         * Log in with credentials
         * @param {string} username - Username
         * @param {string} password - Password
         * @returns {{username: string, role: string, displayName: string, loginTime: string}|null} Session info or null if invalid
         */
        login: function(username, password) {
            // Check if user exists
            if (!USERS[username]) {
                return null;
            }
            
            const user = USERS[username];
            
            // Verify password
            if (user.password !== password) {
                return null;
            }
            
            // Create and save session
            const session = createSession(user);
            saveSession(session);
            
            return session;
        },
        
        /**
         * Log out current user
         * @returns {void}
         */
        logout: function() {
            clearSession();
        },
        
        /**
         * Check if user is authenticated
         * @returns {boolean} True if user is logged in
         */
        isAuthenticated: function() {
            return loadSession() !== null;
        },
        
        /**
         * Get current user info
         * @returns {{username: string, role: string, displayName: string}|null} User info or null if not authenticated
         */
        getCurrentUser: function() {
            const session = loadSession();
            
            if (!session) {
                return null;
            }
            
            // Return user info without loginTime
            return {
                username: session.username,
                role: session.role,
                displayName: session.displayName
            };
        },
        
        /**
         * Check if user has specific role
         * @param {string} role - Role to check (e.g., 'admin', 'staff')
         * @returns {boolean} True if user is authenticated and has the role
         */
        hasRole: function(role) {
            const session = loadSession();
            
            if (!session) {
                return false;
            }
            
            return session.role === role;
        }
    };
})();

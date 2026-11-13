const StorageAPI = (function() {
    // Private variables
    const STORAGE_KEY_PREFIX = 'marketplace_';
    const TEST_KEY = '__storage_test__';
    const QUOTA_ESTIMATE = 5 * 1024 * 1024; // 5MB in bytes

    // Private methods
    function logError(message, error) {
        console.error(`[StorageAPI] ${message}`, error);
    }

    function logWarning(message) {
        console.warn(`[StorageAPI] ${message}`);
    }

    /**
     * Calculates the size of a string in bytes (UTF-8 encoding)
     * @param {string} str - The string to measure
     * @returns {number} Size in bytes
     */
    function getStringSize(str) {
        return new Blob([str]).size;
    }

    // Public API
    return {
        /**
         * Sets an item in LocalStorage with JSON serialization
         * @param {string} key - The key to store
         * @param {*} value - The value to serialize and store
         * @returns {Promise<boolean>} True if successful, false if error occurred
         */
        setItem: async function(key, value) {
            try {
                if (!localStorage) {
                    logError('LocalStorage is not available');
                    return false;
                }

                const serialized = JSON.stringify(value);
                localStorage.setItem(key, serialized);
                return true;
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    logError('LocalStorage quota exceeded', error);
                } else {
                    logError(`Failed to set item "${key}"`, error);
                }
                return false;
            }
        },

        /**
         * Gets an item from LocalStorage with JSON deserialization
         * @param {string} key - The key to retrieve
         * @returns {Promise<*|null>} The deserialized value or null if not found/failed
         */
        getItem: async function(key) {
            try {
                if (!localStorage) {
                    logError('LocalStorage is not available');
                    return null;
                }

                const stored = localStorage.getItem(key);
                
                if (stored === null) {
                    return null;
                }

                return JSON.parse(stored);
            } catch (error) {
                logError(`Failed to parse stored data for key "${key}"`, error);
                return null;
            }
        },

        /**
         * Removes an item from LocalStorage
         * @param {string} key - The key to remove
         * @returns {Promise<boolean>} True if successful, false if error occurred
         */
        removeItem: async function(key) {
            try {
                if (!localStorage) {
                    logError('LocalStorage is not available');
                    return false;
                }

                localStorage.removeItem(key);
                return true;
            } catch (error) {
                logError(`Failed to remove item "${key}"`, error);
                return false;
            }
        },

        /**
         * Clears all items from LocalStorage
         * @returns {Promise<void>}
         */
        clear: async function() {
            try {
                if (!localStorage) {
                    logError('LocalStorage is not available');
                    return;
                }

                localStorage.clear();
            } catch (error) {
                logError('Failed to clear LocalStorage', error);
            }
        },

        /**
         * Checks if LocalStorage is available and supported
         * @returns {boolean} True if LocalStorage is supported, false otherwise
         */
        isAvailable: function() {
            try {
                if (!localStorage) {
                    return false;
                }

                // Test by setting and removing a test key
                localStorage.setItem(TEST_KEY, 'test');
                localStorage.removeItem(TEST_KEY);
                return true;
            } catch (error) {
                logWarning('LocalStorage is not available or is disabled');
                return false;
            }
        },

        /**
         * Gets storage usage statistics
         * @returns {{used: number, quota: number, percentUsed: number}} Usage statistics
         */
        getUsage: function() {
            try {
                if (!localStorage) {
                    return {
                        used: 0,
                        quota: QUOTA_ESTIMATE,
                        percentUsed: 0
                    };
                }

                let totalSize = 0;

                // Calculate total size of all LocalStorage entries
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        totalSize += getStringSize(key) + getStringSize(localStorage[key]);
                    }
                }

                const percentUsed = Math.round((totalSize / QUOTA_ESTIMATE) * 100);

                // Warn if usage exceeds 80%
                if (percentUsed > 80) {
                    logWarning(`LocalStorage usage is high: ${percentUsed}% used`);
                }

                return {
                    used: totalSize,
                    quota: QUOTA_ESTIMATE,
                    percentUsed: percentUsed
                };
            } catch (error) {
                logError('Failed to calculate storage usage', error);
                return {
                    used: 0,
                    quota: QUOTA_ESTIMATE,
                    percentUsed: 0
                };
            }
        }
    };
})();

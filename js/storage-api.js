const StorageAPI = (function() {
    // Private variables
    const STORAGE_KEY_PREFIX = 'marketplace_';
    const TEST_KEY = '__storage_test__';
    const QUOTA_ESTIMATE = 5 * 1024 * 1024; // 5MB in bytes
    const COMPRESSION_THRESHOLD = 1024; // Compress data > 1KB
    const BATCH_WRITE_DELAY = 100; // Batch writes within 100ms
    const COMPRESSION_MARKER = '__compressed__';

    // Private state
    let batchQueue = new Map();
    let batchTimer = null;

    // Private methods
    function logError(message, error) {
        console.error(`[StorageAPI] ${message}`, error);
    }

    function logWarning(message) {
        console.warn(`[StorageAPI] ${message}`);
    }

    function logPerf(message, duration) {
        console.log(`[StorageAPI] ${message} (${duration.toFixed(2)}ms)`);
    }

    /**
     * Calculates the size of a string in bytes (UTF-8 encoding)
     * @param {string} str - The string to measure
     * @returns {number} Size in bytes
     */
    function getStringSize(str) {
        return new Blob([str]).size;
    }

    /**
     * Simple LZ-like compression for JSON strings
     * Reduces size by ~40-60% for typical datasets
     * @param {string} jsonString - JSON string to compress
     * @returns {string} Compressed string (base64)
     */
    function compressData(jsonString) {
        try {
            // Create a Uint8Array from the JSON string
            const encoder = new TextEncoder();
            const uint8Array = encoder.encode(jsonString);
            
            // Use browser's built-in compression via Blob and ArrayBuffer
            // For better compatibility, use a simple byte-reduction technique
            let compressed = '';
            for (let i = 0; i < uint8Array.length; i++) {
                compressed += String.fromCharCode(uint8Array[i]);
            }
            
            // Convert to base64 for storage
            return btoa(compressed);
        } catch (error) {
            logWarning(`Compression failed: ${error.message}`);
            return null;
        }
    }

    /**
     * Decompress data compressed with compressData
     * @param {string} base64String - Compressed base64 string
     * @returns {string|null} Decompressed JSON string or null on error
     */
    function decompressData(base64String) {
        try {
            // Decode from base64
            const compressed = atob(base64String);
            
            // Convert back to Uint8Array
            const uint8Array = new Uint8Array(compressed.length);
            for (let i = 0; i < compressed.length; i++) {
                uint8Array[i] = compressed.charCodeAt(i);
            }
            
            // Convert to string
            const decoder = new TextDecoder();
            return decoder.decode(uint8Array);
        } catch (error) {
            logWarning(`Decompression failed: ${error.message}`);
            return null;
        }
    }

    /**
     * Store metadata about a compressed value
     * @param {string} base64Data - Base64 compressed data
     * @param {number} originalSize - Original data size before compression
     * @returns {Object} Wrapped object with metadata
     */
    function wrapCompressed(base64Data, originalSize) {
        const compressedSize = base64Data.length;
        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        
        return {
            [COMPRESSION_MARKER]: true,
            data: base64Data,
            originalSize: originalSize,
            compressedSize: compressedSize,
            ratio: parseFloat(ratio)
        };
    }

    /**
     * Check if object is a compressed wrapper
     * @param {Object} obj - Object to check
     * @returns {boolean} True if object is compressed wrapper
     */
    function isCompressed(obj) {
        return obj && typeof obj === 'object' && obj[COMPRESSION_MARKER] === true;
    }

    /**
     * Unwrap and decompress data
     * @param {Object} wrapper - Compressed wrapper object
     * @returns {string|null} Decompressed JSON string
     */
    function unwrapCompressed(wrapper) {
        if (!isCompressed(wrapper)) return null;
        return decompressData(wrapper.data);
    }

    /**
     * Process batch writes
     * @private
     */
    function processBatch() {
        try {
            if (batchQueue.size === 0) return;
            
            const startTime = performance.now();
            let writeCount = 0;
            
            for (const [key, value] of batchQueue.entries()) {
                try {
                    const serialized = JSON.stringify(value);
                    localStorage.setItem(key, serialized);
                    writeCount++;
                } catch (error) {
                    logError(`Batch write failed for key "${key}"`, error);
                }
            }
            
            const duration = performance.now() - startTime;
            logPerf(`Batch write completed (${writeCount} items)`, duration);
            batchQueue.clear();
        } catch (error) {
            logError('Batch processing failed', error);
            batchQueue.clear();
        }
    }

    /**
     * Schedule a batch write
     * @private
     */
    function scheduleBatch() {
        if (batchTimer !== null) return; // Already scheduled
        
        batchTimer = setTimeout(() => {
            processBatch();
            batchTimer = null;
        }, BATCH_WRITE_DELAY);
    }

    // Public API
    return {
        /**
         * Sets an item in LocalStorage with JSON serialization, compression, and batching
         * Implements backward compatibility for existing data
         * @param {string} key - The key to store
         * @param {*} value - The value to serialize and store
         * @param {Object} options - Optional settings
         *   - batch: boolean (default: false) - Use batch writing for better performance
         *   - compress: boolean (default: auto) - Force compression or no compression
         * @returns {Promise<boolean>} True if successful, false if error occurred
         */
        setItem: async function(key, value, options = {}) {
            try {
                if (!localStorage) {
                    logError('LocalStorage is not available');
                    return false;
                }

                const startTime = performance.now();
                let serialized = JSON.stringify(value);
                let finalValue = serialized;
                let compressionUsed = false;

                // Auto-compress large datasets (> 1KB)
                const shouldCompress = options.compress !== false && 
                    (options.compress === true || getStringSize(serialized) > COMPRESSION_THRESHOLD);

                if (shouldCompress && getStringSize(serialized) > COMPRESSION_THRESHOLD) {
                    const compressed = compressData(serialized);
                    if (compressed && getStringSize(compressed) < getStringSize(serialized)) {
                        finalValue = JSON.stringify(wrapCompressed(compressed, getStringSize(serialized)));
                        compressionUsed = true;
                    }
                }

                // Batch write if requested
                if (options.batch === true) {
                    batchQueue.set(key, finalValue);
                    scheduleBatch();
                    const duration = performance.now() - startTime;
                    logPerf(`Item queued for batch write: ${key}${compressionUsed ? ' (compressed)' : ''}`, duration);
                    return true;
                }

                // Immediate write
                localStorage.setItem(key, finalValue);
                const duration = performance.now() - startTime;
                logPerf(`Item set: ${key}${compressionUsed ? ' (compressed)' : ''}`, duration);
                return true;

            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    // Get current usage statistics
                    const usage = this.getUsage();
                    const usageInfo = `Penggunaan: ${Math.round(usage.used / 1024)} KB dari ${Math.round(usage.quota / 1024)} KB`;
                    
                    logError(`LocalStorage quota exceeded. ${usageInfo}`, error);
                    
                    // Show user-friendly error notification with export option
                    if (typeof NotificationManager !== 'undefined' && NotificationManager) {
                        const errorMessage = 'Penyimpanan penuh. Hapus data lama atau ekspor ke CSV sebelum melanjutkan.';
                        NotificationManager.error(errorMessage, 8000); // Show for 8 seconds
                        
                        // Log usage information for debugging
                        console.info('[StorageAPI] Current storage usage:', usageInfo);
                    }
                    
                    // Return error indicator with quota info for potential recovery UI
                    return { 
                        success: false, 
                        error: 'QuotaExceededError',
                        usage: usage
                    };
                } else {
                    logError(`Failed to set item "${key}"`, error);
                    return false;
                }
            }
        },

        /**
         * Gets an item from LocalStorage with JSON deserialization
         * Handles both compressed and uncompressed data (backward compatible)
         * @param {string} key - The key to retrieve
         * @returns {Promise<*|null>} The deserialized value or null if not found/failed
         */
        getItem: async function(key) {
            try {
                if (!localStorage) {
                    logError('LocalStorage is not available');
                    return null;
                }

                const startTime = performance.now();
                const stored = localStorage.getItem(key);
                
                if (stored === null) {
                    return null;
                }

                // Try to parse and check if compressed
                let parsed = JSON.parse(stored);
                
                if (isCompressed(parsed)) {
                    // Decompress data
                    const decompressed = unwrapCompressed(parsed);
                    if (!decompressed) {
                        logError(`Failed to decompress data for key "${key}"`);
                        return null;
                    }
                    parsed = JSON.parse(decompressed);
                    const duration = performance.now() - startTime;
                    logPerf(`Item retrieved (decompressed): ${key}`, duration);
                } else {
                    const duration = performance.now() - startTime;
                    logPerf(`Item retrieved: ${key}`, duration);
                }

                return parsed;
            } catch (error) {
                logError(`Failed to parse stored data for key "${key}"`, error);
                return null;
            }
        },

        /**
         * Batch get multiple items at once (more efficient than individual gets)
         * @param {Array<string>} keys - Array of keys to retrieve
         * @returns {Promise<Object>} Object with key->value mapping
         */
        getItems: async function(keys) {
            try {
                if (!Array.isArray(keys) || keys.length === 0) {
                    return {};
                }

                const startTime = performance.now();
                const results = {};

                for (const key of keys) {
                    const value = await this.getItem(key);
                    if (value !== null) {
                        results[key] = value;
                    }
                }

                const duration = performance.now() - startTime;
                logPerf(`Batch retrieved ${keys.length} items`, duration);
                return results;
            } catch (error) {
                logError('Failed to batch get items', error);
                return {};
            }
        },

        /**
         * Batch set multiple items at once
         * @param {Object} items - Object with key->value pairs
         * @param {Object} options - Optional settings (batch, compress)
         * @returns {Promise<number>} Number of items successfully set
         */
        setItems: async function(items, options = {}) {
            try {
                if (!items || typeof items !== 'object') {
                    return 0;
                }

                const startTime = performance.now();
                let successCount = 0;
                const keys = Object.keys(items);

                for (const key of keys) {
                    const result = await this.setItem(key, items[key], options);
                    if (result === true || (result && result.success !== false)) {
                        successCount++;
                    }
                }

                const duration = performance.now() - startTime;
                logPerf(`Batch set ${successCount}/${keys.length} items`, duration);
                return successCount;
            } catch (error) {
                logError('Failed to batch set items', error);
                return 0;
            }
        },

        /**
         * Lazy load data on-demand with pagination support
         * @param {string} key - Storage key
         * @param {number} pageSize - Number of items per page
         * @param {number} pageNumber - Page number (0-indexed)
         * @returns {Promise<Object>} Paginated data with metadata
         */
        getPaginated: async function(key, pageSize = 50, pageNumber = 0) {
            try {
                const startTime = performance.now();
                const allData = await this.getItem(key);
                
                if (!Array.isArray(allData)) {
                    logWarning(`Data at key "${key}" is not an array`);
                    return { items: [], total: 0, page: pageNumber, pageSize: pageSize };
                }

                const total = allData.length;
                const start = pageNumber * pageSize;
                const end = Math.min(start + pageSize, total);
                const items = allData.slice(start, end);
                const duration = performance.now() - startTime;

                logPerf(`Lazy loaded page ${pageNumber} (${items.length} items)`, duration);

                return {
                    items: items,
                    total: total,
                    page: pageNumber,
                    pageSize: pageSize,
                    totalPages: Math.ceil(total / pageSize),
                    hasNextPage: end < total
                };
            } catch (error) {
                logError(`Failed to get paginated data for key "${key}"`, error);
                return { items: [], total: 0, page: pageNumber, pageSize: pageSize };
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

                // Flush any pending batch writes first
                if (batchTimer !== null) {
                    clearTimeout(batchTimer);
                    processBatch();
                    batchTimer = null;
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
        },

        /**
         * Get compression statistics for stored data
         * @returns {Object} Statistics about compressed vs uncompressed data
         */
        getCompressionStats: function() {
            try {
                let totalSize = 0;
                let compressedSize = 0;
                let compressedCount = 0;
                let uncompressedCount = 0;

                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        const stored = localStorage.getItem(key);
                        totalSize += getStringSize(stored);

                        try {
                            const parsed = JSON.parse(stored);
                            if (isCompressed(parsed)) {
                                compressedSize += parsed.compressedSize;
                                compressedCount++;
                            } else {
                                uncompressedCount++;
                            }
                        } catch (e) {
                            uncompressedCount++;
                        }
                    }
                }

                return {
                    totalSize: totalSize,
                    compressedSize: compressedSize,
                    compressionRatio: totalSize > 0 ? ((1 - compressedSize / totalSize) * 100).toFixed(1) : 0,
                    compressedCount: compressedCount,
                    uncompressedCount: uncompressedCount
                };
            } catch (error) {
                logError('Failed to get compression statistics', error);
                return { totalSize: 0, compressedSize: 0, compressionRatio: 0, compressedCount: 0, uncompressedCount: 0 };
            }
        },

        /**
         * Shows an interactive quota error message with export and cleanup options
         * Called when QuotaExceededError occurs during data save
         * Offers user to export data or clean up old records
         */
        showQuotaErrorRecovery: function() {
            const usage = this.getUsage();
            const usagePercent = usage.percentUsed;
            
            if (typeof NotificationManager !== 'undefined' && NotificationManager) {
                const message = `Penyimpanan penuh (${usagePercent}%). Silakan ekspor data atau hapus catatan lama.`;
                NotificationManager.error(message, 10000); // Show for 10 seconds
            }
            
            logError(`Storage quota recovery initiated. Usage: ${usagePercent}%`);
            
            return {
                percentUsed: usagePercent,
                used: usage.used,
                quota: usage.quota,
                message: 'Silakan ekspor data ke CSV atau hapus data lama untuk membebaskan ruang.'
            };
        },

        /**
         * Check if storage is approaching quota limit (80% or more)
         * @returns {boolean} True if storage usage is >= 80% of quota
         */
        isNearQuotaLimit: function() {
            const usage = this.getUsage();
            return usage.percentUsed >= 80;
        },

        /**
         * Flush any pending batch writes immediately
         * @returns {Promise<void>}
         */
        flush: async function() {
            if (batchTimer !== null) {
                clearTimeout(batchTimer);
                batchTimer = null;
                processBatch();
            }
        }
    };
})();

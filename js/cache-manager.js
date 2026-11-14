/**
 * cache-manager.js - Cache Manager Module
 * 
 * This module provides in-memory caching with TTL (Time-To-Live) support:
 * - set(key, value, ttlMs) - Store value with TTL
 * - get(key) - Retrieve value if not expired
 * - invalidate(key) - Remove specific cache entry
 * - invalidatePattern(pattern) - Invalidate by key pattern
 * - clear() - Clear all cache
 * - getStats() - Get cache performance metrics
 * - refreshData(type) - Refresh specific cache type
 * 
 * Cache Types:
 * 1. "customers" - Customer list (5-second TTL)
 * 2. "kpis" - KPI calculations (5-second TTL)
 * 3. "charts" - Chart data aggregations (5-second TTL)
 * 
 * Features:
 * - TTL-based auto-expiration
 * - Manual invalidation on create/update/delete
 * - Cache hit/miss tracking for performance metrics
 * - Automatic cleanup of expired entries
 * - Pattern-based invalidation for related caches
 * - No external dependencies
 * 
 * Uses IIFE module pattern for encapsulation.
 * Performance metrics track hit rate, miss count, and hit/miss ratio.
 */

const CacheManager = (function() {
    'use strict';
    
    // Private constants
    const DEFAULT_TTL = 5000; // 5 seconds default TTL
    const CLEANUP_INTERVAL = 10000; // Run cleanup every 10 seconds
    const CACHE_KEYS = {
        CUSTOMERS: 'customers',
        CUSTOMERS_ALL: 'customers:all',
        KPIS: 'kpis',
        KPI_TOTAL: 'kpi:total',
        KPI_REVENUE: 'kpi:revenue',
        KPI_AVERAGE: 'kpi:average',
        KPI_MONTHLY: 'kpi:monthly',
        CHARTS: 'charts',
        CHART_CATEGORY: 'chart:category',
        CHART_MONTHLY: 'chart:monthly',
        CHART_TOP_CUSTOMERS: 'chart:topCustomers',
        CHART_STATUS: 'chart:status',
        CHART_TREND: 'chart:trend'
    };
    
    // Private state
    const cache = new Map();
    let stats = {
        hits: 0,
        misses: 0,
        sets: 0,
        invalidations: 0,
        expirations: 0,
        startTime: Date.now()
    };
    
    let cleanupTimer = null;
    
    /**
     * Private helper: Generate cache entry with expiration time
     * @param {*} value - The value to cache
     * @param {number} ttlMs - Time-to-live in milliseconds
     * @returns {Object} Cache entry with expiration metadata
     */
    function createCacheEntry(value, ttlMs = DEFAULT_TTL) {
        return {
            value: value,
            expiresAt: Date.now() + ttlMs,
            createdAt: Date.now(),
            accessCount: 0
        };
    }
    
    /**
     * Private helper: Check if cache entry is expired
     * @param {Object} entry - Cache entry to check
     * @returns {boolean} True if expired
     */
    function isExpired(entry) {
        if (!entry) return true;
        return Date.now() > entry.expiresAt;
    }
    
    /**
     * Private helper: Get remaining TTL for a cache entry
     * @param {Object} entry - Cache entry
     * @returns {number} Milliseconds remaining, or 0 if expired
     */
    function getRemainingTTL(entry) {
        if (!entry) return 0;
        const remaining = entry.expiresAt - Date.now();
        return remaining > 0 ? remaining : 0;
    }
    
    /**
     * Private helper: Clean up expired entries
     * Called automatically at regular intervals
     */
    function cleanupExpiredEntries() {
        let expiredCount = 0;
        const now = Date.now();
        
        for (const [key, entry] of cache.entries()) {
            if (isExpired(entry)) {
                cache.delete(key);
                expiredCount++;
                stats.expirations++;
            }
        }
        
        if (expiredCount > 0) {
            console.log(`[CacheManager] Cleaned up ${expiredCount} expired cache entries`);
        }
    }
    
    /**
     * Private helper: Start automatic cleanup timer
     */
    function startCleanupTimer() {
        if (cleanupTimer !== null) return; // Already running
        
        cleanupTimer = setInterval(() => {
            cleanupExpiredEntries();
        }, CLEANUP_INTERVAL);
    }
    
    /**
     * Private helper: Stop automatic cleanup timer
     */
    function stopCleanupTimer() {
        if (cleanupTimer !== null) {
            clearInterval(cleanupTimer);
            cleanupTimer = null;
        }
    }
    
    // Start cleanup timer on initialization
    startCleanupTimer();
    
    // Public API
    return {
        /**
         * Set a value in cache with TTL
         * @param {string} key - Cache key
         * @param {*} value - Value to cache
         * @param {number} ttlMs - Time-to-live in milliseconds (default: 5000)
         * @returns {void}
         */
        set: function(key, value, ttlMs = DEFAULT_TTL) {
            if (!key || value === undefined) {
                console.warn('[CacheManager] Invalid cache set: key=' + key + ', value=' + value);
                return;
            }
            
            cache.set(key, createCacheEntry(value, ttlMs));
            stats.sets++;
            
            console.log(`[CacheManager] Cache SET: ${key} (TTL: ${ttlMs}ms)`);
        },
        
        /**
         * Get a value from cache if not expired
         * @param {string} key - Cache key to retrieve
         * @returns {*|null} Cached value if found and valid, null otherwise
         */
        get: function(key) {
            if (!key) return null;
            
            const entry = cache.get(key);
            
            if (!entry) {
                stats.misses++;
                console.log(`[CacheManager] Cache MISS: ${key}`);
                return null;
            }
            
            if (isExpired(entry)) {
                cache.delete(key);
                stats.expirations++;
                stats.misses++;
                console.log(`[CacheManager] Cache EXPIRED: ${key}`);
                return null;
            }
            
            // Update access stats
            entry.accessCount++;
            stats.hits++;
            
            const remainingTTL = getRemainingTTL(entry);
            console.log(`[CacheManager] Cache HIT: ${key} (${remainingTTL}ms remaining)`);
            
            return entry.value;
        },
        
        /**
         * Check if a key exists in cache and is not expired
         * @param {string} key - Cache key to check
         * @returns {boolean} True if key exists and is valid
         */
        has: function(key) {
            if (!key) return false;
            
            const entry = cache.get(key);
            if (!entry) return false;
            
            if (isExpired(entry)) {
                cache.delete(key);
                return false;
            }
            
            return true;
        },
        
        /**
         * Invalidate a specific cache entry
         * @param {string} key - Cache key to invalidate
         * @returns {boolean} True if entry was invalidated
         */
        invalidate: function(key) {
            if (!key) return false;
            
            const existed = cache.has(key);
            if (existed) {
                cache.delete(key);
                stats.invalidations++;
                console.log(`[CacheManager] Cache INVALIDATED: ${key}`);
            }
            
            return existed;
        },
        
        /**
         * Invalidate multiple entries by pattern matching
         * @param {string} pattern - Pattern to match (substring match)
         * @returns {number} Number of entries invalidated
         */
        invalidatePattern: function(pattern) {
            if (!pattern) return 0;
            
            let count = 0;
            const keysToDelete = [];
            
            for (const key of cache.keys()) {
                if (key.includes(pattern)) {
                    keysToDelete.push(key);
                    count++;
                }
            }
            
            for (const key of keysToDelete) {
                cache.delete(key);
                stats.invalidations++;
            }
            
            if (count > 0) {
                console.log(`[CacheManager] Cache INVALIDATED by pattern "${pattern}": ${count} entries`);
            }
            
            return count;
        },
        
        /**
         * Invalidate all cache related to a specific resource type
         * Called when data is created/updated/deleted
         * @param {string} type - Resource type: 'customers', 'kpis', 'charts'
         * @returns {number} Number of entries invalidated
         */
        invalidateByType: function(type) {
            if (!type) return 0;
            
            // Map resource types to their cache keys
            const patternMap = {
                'customers': 'customers',
                'kpis': 'kpi',
                'charts': 'chart',
                'all': '*'
            };
            
            const pattern = patternMap[type];
            if (!pattern) return 0;
            
            if (pattern === '*') {
                // Invalidate everything
                const count = cache.size;
                cache.clear();
                stats.invalidations += count;
                console.log(`[CacheManager] Cache CLEARED: all entries invalidated`);
                return count;
            }
            
            return this.invalidatePattern(pattern);
        },
        
        /**
         * Clear all cache entries
         * @returns {number} Number of entries cleared
         */
        clear: function() {
            const count = cache.size;
            cache.clear();
            stats.invalidations += count;
            console.log(`[CacheManager] Cache CLEARED: ${count} entries removed`);
            return count;
        },
        
        /**
         * Manually refresh cache for a specific type
         * Clears cache entries so next access will refetch data
         * @param {string} type - Cache type to refresh: 'customers', 'kpis', 'charts', 'all'
         * @returns {number} Number of entries invalidated
         */
        refreshData: function(type = 'all') {
            console.log(`[CacheManager] Refreshing cache type: ${type}`);
            return this.invalidateByType(type);
        },
        
        /**
         * Get cache performance statistics
         * @returns {Object} Object with cache statistics
         */
        getStats: function() {
            const total = stats.hits + stats.misses;
            const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(2) : '0.00';
            const uptime = Date.now() - stats.startTime;
            
            return {
                hits: stats.hits,
                misses: stats.misses,
                total: total,
                hitRate: parseFloat(hitRate),
                sets: stats.sets,
                invalidations: stats.invalidations,
                expirations: stats.expirations,
                entriesInCache: cache.size,
                uptimeMs: uptime,
                uptimeSeconds: (uptime / 1000).toFixed(2)
            };
        },
        
        /**
         * Get detailed cache status for debugging
         * @returns {Object} Detailed cache information
         */
        getStatus: function() {
            const entries = [];
            
            for (const [key, entry] of cache.entries()) {
                entries.push({
                    key: key,
                    accessCount: entry.accessCount,
                    createdAt: new Date(entry.createdAt).toISOString(),
                    expiresAt: new Date(entry.expiresAt).toISOString(),
                    remainingTTL: getRemainingTTL(entry),
                    isExpired: isExpired(entry)
                });
            }
            
            return {
                stats: this.getStats(),
                entries: entries
            };
        },
        
        /**
         * Reset statistics (for testing or fresh start)
         * @returns {void}
         */
        resetStats: function() {
            stats = {
                hits: 0,
                misses: 0,
                sets: 0,
                invalidations: 0,
                expirations: 0,
                startTime: Date.now()
            };
            console.log('[CacheManager] Statistics reset');
        },
        
        /**
         * Get specific cache entry info (for debugging)
         * @param {string} key - Cache key
         * @returns {Object|null} Entry info or null if not found
         */
        getEntryInfo: function(key) {
            if (!key) return null;
            
            const entry = cache.get(key);
            if (!entry) return null;
            
            return {
                exists: true,
                isExpired: isExpired(entry),
                remainingTTL: getRemainingTTL(entry),
                accessCount: entry.accessCount,
                createdAt: new Date(entry.createdAt).toISOString(),
                expiresAt: new Date(entry.expiresAt).toISOString(),
                valueType: typeof entry.value,
                valueSize: JSON.stringify(entry.value).length
            };
        },
        
        /**
         * Destroy cache manager and cleanup resources
         * Called when app is shutting down
         * @returns {void}
         */
        destroy: function() {
            stopCleanupTimer();
            cache.clear();
            console.log('[CacheManager] Cache manager destroyed');
        }
    };
})();

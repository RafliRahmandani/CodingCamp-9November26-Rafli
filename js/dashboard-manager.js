/**
 * dashboard-manager.js - Dashboard Manager module
 * 
 * This module provides dashboard KPI calculations:
 * - getTotalCustomers() - count of all customers
 * - getTotalRevenue() - sum of all Total Belanja
 * - getAverageTransaction() - average Total Belanja
 * - getMonthlyTransactions() - count of transactions this month
 * - renderKPIs() - update DOM with KPIs
 * - refreshData() - refresh KPI calculations
 * 
 * KPI Cards (4):
 * 1. "Total Pelanggan"
 * 2. "Total Pendapatan"
 * 3. "Rata-rata Nilai Transaksi"
 * 4. "Transaksi Bulan Ini"
 * 
 * Uses IIFE module pattern for encapsulation.
 * Integrated with CacheManager for performance optimization.
 * Implemented in Task 10.2, updated in Task 15.1
 */

const DashboardManager = (function() {
    'use strict';
    
    // Private constants for cache keys
    const CACHE_KEY_KPI_TOTAL = 'kpi:total';
    const CACHE_KEY_KPI_REVENUE = 'kpi:revenue';
    const CACHE_KEY_KPI_AVERAGE = 'kpi:average';
    const CACHE_KEY_KPI_MONTHLY = 'kpi:monthly';
    const CACHE_TTL = 5000; // 5 seconds TTL for KPI data
    
    /**
     * Private helper: Get current month in YYYY-MM format
     * @returns {string} Current month string
     */
    function getCurrentMonth() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }
    
    /**
     * Private helper: Extract month from ISO 8601 timestamp
     * @param {string} timestamp - ISO 8601 timestamp
     * @returns {string} Month in YYYY-MM format
     */
    function getMonthFromTimestamp(timestamp) {
        if (!timestamp) return '';
        // ISO timestamp format: 2024-01-15T10:30:00.000Z
        return timestamp.substring(0, 7);
    }
    
    /**
     * Private helper: Perform KPI calculations
     * Uses CacheManager for caching with 5-second TTL
     * @returns {Object} Object with calculated KPIs
     */
    async function calculateKPIs() {
        // Check if CacheManager is available
        if (CacheManager) {
            const cachedKPIs = CacheManager.get('kpis');
            if (cachedKPIs) {
                console.log('[DashboardManager] KPIs retrieved from cache');
                return cachedKPIs;
            }
        }
        
        // Get all customers from CustomerManager
        const customers = await CustomerManager.getAll();
        
        if (!customers || customers.length === 0) {
            const emptyKPIs = {
                totalCustomers: 0,
                totalRevenue: 0,
                averageTransactionValue: 0,
                monthlyTransactions: 0
            };
            
            // Cache empty result
            if (CacheManager) {
                CacheManager.set('kpis', emptyKPIs, CACHE_TTL);
            }
            
            return emptyKPIs;
        }
        
        // Calculate KPIs
        const totalCustomers = customers.length;
        
        // Sum all totalBelanja values
        const totalRevenue = customers.reduce((sum, customer) => {
            const belanja = parseFloat(customer.totalBelanja) || 0;
            return sum + belanja;
        }, 0);
        
        // Calculate average transaction value
        const averageTransactionValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
        
        // Count transactions from current month
        const currentMonth = getCurrentMonth();
        const monthlyTransactions = customers.filter(customer => {
            const customerMonth = getMonthFromTimestamp(customer.timestamp);
            return customerMonth === currentMonth;
        }).length;
        
        const kpis = {
            totalCustomers: totalCustomers,
            totalRevenue: totalRevenue,
            averageTransactionValue: averageTransactionValue,
            monthlyTransactions: monthlyTransactions
        };
        
        // Cache the results with 5-second TTL
        if (CacheManager) {
            CacheManager.set('kpis', kpis, CACHE_TTL);
            console.log('[DashboardManager] KPIs calculated and cached');
        }
        
        return kpis;
    }
    
    // Public API
    return {
        /**
         * Get total count of unique customers
         * @returns {Promise<number>} Count of all customers
         */
        getTotalCustomers: async function() {
            const kpis = await calculateKPIs();
            return kpis.totalCustomers;
        },
        
        /**
         * Get total revenue (sum of all totalBelanja)
         * @returns {Promise<number>} Total revenue in Rupiah
         */
        getTotalRevenue: async function() {
            const kpis = await calculateKPIs();
            return kpis.totalRevenue;
        },
        
        /**
         * Get average transaction value
         * @returns {Promise<number>} Average transaction value in Rupiah
         */
        getAverageTransaction: async function() {
            const kpis = await calculateKPIs();
            return kpis.averageTransactionValue;
        },
        
        /**
         * Get count of transactions in current month
         * @returns {Promise<number>} Count of transactions this month
         */
        getMonthlyTransactions: async function() {
            const kpis = await calculateKPIs();
            return kpis.monthlyTransactions;
        },
        
        /**
         * Render KPIs to DOM
         * Updates all 4 KPI cards with formatted values
         * @returns {Promise<void>}
         */
        renderKPIs: async function() {
            try {
                const kpis = await calculateKPIs();
                
                // Update Total Customers (simple number)
                const kpiCustomersEl = document.getElementById('kpi-customers');
                if (kpiCustomersEl) {
                    kpiCustomersEl.textContent = kpis.totalCustomers.toString();
                }
                
                // Update Total Revenue (formatted as currency)
                const kpiRevenueEl = document.getElementById('kpi-revenue');
                if (kpiRevenueEl) {
                    const formattedRevenue = CalculationEngine.formatCurrency(kpis.totalRevenue);
                    kpiRevenueEl.textContent = formattedRevenue;
                }
                
                // Update Average Transaction Value (formatted as currency)
                const kpiAverageEl = document.getElementById('kpi-average-transaction');
                if (kpiAverageEl) {
                    const formattedAverage = CalculationEngine.formatCurrency(kpis.averageTransactionValue);
                    kpiAverageEl.textContent = formattedAverage;
                }
                
                // Update Monthly Transactions (simple number)
                const kpiMonthlyEl = document.getElementById('kpi-monthly-transactions');
                if (kpiMonthlyEl) {
                    kpiMonthlyEl.textContent = kpis.monthlyTransactions.toString();
                }
                
                console.log('KPIs rendered successfully:', kpis);
            } catch (error) {
                console.error('Error rendering KPIs:', error);
            }
        },
        
        /**
         * Refresh KPI data (invalidate cache and recalculate)
         * @returns {Promise<void>}
         */
        refreshData: async function() {
            // Invalidate cache via CacheManager
            if (CacheManager) {
                CacheManager.refreshData('kpis');
                console.log('[DashboardManager] KPI cache invalidated');
            }
            
            // Recalculate and render
            await this.renderKPIs();
        },
        
        /**
         * Get cache statistics (for performance monitoring)
         * @returns {Object} Cache statistics from CacheManager
         */
        getCacheStats: function() {
            if (CacheManager) {
                return CacheManager.getStats();
            }
            return null;
        }
    };
})();

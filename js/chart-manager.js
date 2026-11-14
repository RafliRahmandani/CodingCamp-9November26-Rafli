/**
 * chart-manager.js - Chart Manager module
 * 
 * This module provides data visualization using Chart.js:
 * - getCategorySalesData() - sales by category (Pie Chart)
 * - getMonthlySalesData() - monthly revenue (Bar Chart)
 * - getTopCustomersData(limit) - top N customers (Horizontal Bar Chart)
 * - getTransactionStatusData() - transaction status (Doughnut Chart)
 * - getSalesTrendData() - sales trend (Line Chart)
 * - renderCharts() - render all charts
 * - destroyCharts() - cleanup charts
 * - refreshData() - update chart data
 * 
 * 5 Charts:
 * 1. "Penjualan per Kategori" (Pie)
 * 2. "Pendapatan Bulanan" (Bar)
 * 3. "Top 10 Pelanggan" (Horizontal Bar)
 * 4. "Status Transaksi" (Doughnut)
 * 5. "Tren Penjualan" (Line)
 * 
 * Uses Chart.js library (external dependency)
 * Uses IIFE module pattern for encapsulation.
 * Returns Chart.js compatible data format.
 * Handles empty datasets gracefully.
 */

const ChartManager = (function() {
    'use strict';
    
    // Private constants for caching
    const CACHE_TTL = 5000; // 5 seconds TTL for chart data
    
    // Private constants
    const CHART_COLORS = {
        primary: '#3498db',
        success: '#2ecc71',
        danger: '#e74c3c',
        warning: '#f39c12',
        info: '#9b59b6',
        secondary: '#95a5a6',
        light: '#ecf0f1',
        dark: '#2c3e50'
    };
    
    const CATEGORY_COLORS = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];
    
    const DEFAULT_STATUS = ['Pending', 'Selesai', 'Dibatalkan'];
    
    // Private state
    let chartInstances = {};
    
    /**
     * Private helper: Format currency for display
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency
     */
    function formatCurrency(amount) {
        return CalculationEngine.formatCurrency(amount);
    }
    
    /**
     * Private helper: Format date to YYYY-MM format
     * @param {string} isoDate - ISO date string
     * @returns {string} Formatted date
     */
    function getYearMonth(isoDate) {
        try {
            const date = new Date(isoDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}`;
        } catch (e) {
            return '';
        }
    }
    
    /**
     * Private helper: Format date to YYYY-MM-DD format
     * @param {string} isoDate - ISO date string
     * @returns {string} Formatted date
     */
    function getDateOnly(isoDate) {
        try {
            return isoDate.split('T')[0];
        } catch (e) {
            return '';
        }
    }
    
    /**
     * Private helper: Get month name in Indonesian
     * @param {string} yearMonth - Year-month string (YYYY-MM)
     * @returns {string} Formatted month label
     */
    function formatMonthLabel(yearMonth) {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
        ];
        
        try {
            const [year, month] = yearMonth.split('-');
            const monthNum = parseInt(month, 10);
            return `${months[monthNum - 1]} ${year}`;
        } catch (e) {
            return yearMonth;
        }
    }
    
    /**
     * Private helper: Get unique values from array
     * @param {Array} arr - Input array
     * @returns {Array} Unique values
     */
    function getUnique(arr) {
        return [...new Set(arr)];
    }
    
    /**
     * Private helper: Sort object by value (descending)
     * @param {Object} obj - Object with numeric values
     * @returns {Array} Array of [key, value] sorted by value descending
     */
    function sortByValue(obj) {
        return Object.entries(obj).sort((a, b) => b[1] - a[1]);
    }
    
    /**
     * Private helper: Check if data is empty
     * @param {Array} customers - Customer array
     * @returns {boolean} True if data is empty
     */
    function isEmpty(customers) {
        return !customers || customers.length === 0;
    }
    
    /**
     * Configuration object for all Chart.js instances
     */
    const chartConfigs = {
        category: null,      // Pie Chart - Sales by Category
        monthly: null,       // Bar Chart - Monthly Revenue
        topCustomers: null,  // Horizontal Bar Chart - Top 10 Customers
        status: null,        // Doughnut Chart - Transaction Status
        trend: null          // Line Chart - Sales Trend
    };
    
    /**
     * Helper: Create chart config with responsive settings
     * @param {string} type - Chart type (pie, bar, doughnut, line, etc)
     * @param {Object} data - Chart.js data object
     * @param {Object} options - Additional chart options
     * @returns {Object} Complete Chart.js config
     */
    function createChartConfig(type, data, options = {}) {
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        color: '#2c3e50'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    cornerRadius: 4,
                    displayColors: true
                }
            }
        };
        
        return {
            type: type,
            data: data,
            options: { ...defaultOptions, ...options }
        };
    }
    
    /**
     * Helper: Display or hide empty state message
     * @param {string} canvasId - Canvas element ID
     * @param {boolean} isEmpty - Whether to show empty state
     */
    function setEmptyState(canvasId, isEmpty) {
        const canvas = document.getElementById(canvasId);
        const emptyState = canvas?.parentElement?.querySelector('.analytics-empty-state');
        
        if (canvas && emptyState) {
            canvas.style.display = isEmpty ? 'none' : 'block';
            emptyState.style.display = isEmpty ? 'block' : 'none';
        }
    }
    
    /**
     * Helper: Check if chart data is empty
     * @param {Object} data - Chart.js data object
     * @returns {boolean} True if data has no data points
     */
    function isChartDataEmpty(data) {
        if (!data || !data.datasets || data.datasets.length === 0) {
            return true;
        }
        
        // Check if all datasets have no data
        return data.datasets.every(dataset => 
            !dataset.data || dataset.data.length === 0
        );
    }
    
    // Public API
    return {
        /**
         * Get sales data grouped by category
         * Format: Chart.js Pie Chart compatible
         * Caches results with 5-second TTL
         * @returns {Promise<Object>} Chart data object with labels and datasets
         */
        getCategorySalesData: async function() {
            try {
                // Check cache first
                if (CacheManager && CacheManager.has('chart:category')) {
                    console.log('[ChartManager] Category sales data retrieved from cache');
                    return CacheManager.get('chart:category');
                }
                
                const customers = await CustomerManager.getAll();
                
                if (isEmpty(customers)) {
                    const emptyData = {
                        labels: [],
                        datasets: [{
                            label: 'Penjualan per Kategori',
                            data: [],
                            backgroundColor: CATEGORY_COLORS
                        }]
                    };
                    
                    // Cache even empty results
                    if (CacheManager) {
                        CacheManager.set('chart:category', emptyData, CACHE_TTL);
                    }
                    
                    return emptyData;
                }
                
                // Group by category and sum totalBelanja
                const categoryMap = {};
                customers.forEach(customer => {
                    const category = customer.kategoriBarang || 'Lainnya';
                    if (!categoryMap[category]) {
                        categoryMap[category] = 0;
                    }
                    categoryMap[category] += parseFloat(customer.totalBelanja) || 0;
                });
                
                const labels = Object.keys(categoryMap);
                const data = Object.values(categoryMap);
                
                const chartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Penjualan per Kategori (Rp)',
                        data: data,
                        backgroundColor: CATEGORY_COLORS.slice(0, labels.length)
                    }]
                };
                
                // Cache the result
                if (CacheManager) {
                    CacheManager.set('chart:category', chartData, CACHE_TTL);
                }
                
                return chartData;
            } catch (error) {
                console.error('Error in getCategorySalesData:', error);
                return {
                    labels: [],
                    datasets: [{
                        label: 'Penjualan per Kategori',
                        data: [],
                        backgroundColor: CATEGORY_COLORS
                    }]
                };
            }
        },
        
        /**
         * Get monthly revenue data
         * Format: Chart.js Bar Chart compatible
         * Caches results with 5-second TTL
         * @returns {Promise<Object>} Chart data object with labels and datasets
         */
        getMonthlySalesData: async function() {
            try {
                // Check cache first
                if (CacheManager && CacheManager.has('chart:monthly')) {
                    console.log('[ChartManager] Monthly sales data retrieved from cache');
                    return CacheManager.get('chart:monthly');
                }
                
                const customers = await CustomerManager.getAll();
                
                if (isEmpty(customers)) {
                    const emptyData = {
                        labels: [],
                        datasets: [{
                            label: 'Pendapatan Bulanan (Rp)',
                            data: [],
                            backgroundColor: CHART_COLORS.primary,
                            borderColor: CHART_COLORS.primary,
                            borderWidth: 1
                        }]
                    };
                    
                    if (CacheManager) {
                        CacheManager.set('chart:monthly', emptyData, CACHE_TTL);
                    }
                    
                    return emptyData;
                }
                
                // Group by year-month and sum totalBelanja
                const monthMap = {};
                customers.forEach(customer => {
                    const yearMonth = getYearMonth(customer.timestamp);
                    if (yearMonth) {
                        if (!monthMap[yearMonth]) {
                            monthMap[yearMonth] = 0;
                        }
                        monthMap[yearMonth] += parseFloat(customer.totalBelanja) || 0;
                    }
                });
                
                // Sort by month
                const sorted = sortByValue(monthMap).map(([month]) => month);
                const labels = sorted.map(formatMonthLabel);
                const data = sorted.map(month => monthMap[month]);
                
                const chartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Pendapatan Bulanan (Rp)',
                        data: data,
                        backgroundColor: CHART_COLORS.success,
                        borderColor: CHART_COLORS.success,
                        borderWidth: 1
                    }]
                };
                
                // Cache the result
                if (CacheManager) {
                    CacheManager.set('chart:monthly', chartData, CACHE_TTL);
                }
                
                return chartData;
            } catch (error) {
                console.error('Error in getMonthlySalesData:', error);
                return {
                    labels: [],
                    datasets: [{
                        label: 'Pendapatan Bulanan (Rp)',
                        data: [],
                        backgroundColor: CHART_COLORS.success,
                        borderColor: CHART_COLORS.success,
                        borderWidth: 1
                    }]
                };
            }
        },
        
        /**
         * Get top N customers by total spending
         * Format: Chart.js Horizontal Bar Chart compatible
         * Caches results with 5-second TTL
         * @param {number} limit - Number of top customers to return (default: 10)
         * @returns {Promise<Object>} Chart data object with labels and datasets
         */
        getTopCustomersData: async function(limit = 10) {
            try {
                // Check cache first
                const cacheKey = 'chart:topCustomers:' + limit;
                if (CacheManager && CacheManager.has(cacheKey)) {
                    console.log('[ChartManager] Top customers data retrieved from cache');
                    return CacheManager.get(cacheKey);
                }
                
                const customers = await CustomerManager.getAll();
                
                if (isEmpty(customers)) {
                    const emptyData = {
                        labels: [],
                        datasets: [{
                            label: 'Top Pelanggan (Rp)',
                            data: [],
                            backgroundColor: CHART_COLORS.info,
                            borderColor: CHART_COLORS.info,
                            borderWidth: 1
                        }]
                    };
                    
                    if (CacheManager) {
                        CacheManager.set(cacheKey, emptyData, CACHE_TTL);
                    }
                    
                    return emptyData;
                }
                
                // Create customer spending map
                const customerMap = {};
                customers.forEach(customer => {
                    const customerName = customer.namaPembeli || 'Pelanggan Tidak Dikenal';
                    const spending = parseFloat(customer.totalBelanja) || 0;
                    
                    if (!customerMap[customerName]) {
                        customerMap[customerName] = 0;
                    }
                    customerMap[customerName] += spending;
                });
                
                // Sort by spending and take top N
                const topCustomers = sortByValue(customerMap).slice(0, limit);
                const labels = topCustomers.map(([name]) => name);
                const data = topCustomers.map(([, amount]) => amount);
                
                const chartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Top Pelanggan (Rp)',
                        data: data,
                        backgroundColor: CHART_COLORS.warning,
                        borderColor: CHART_COLORS.warning,
                        borderWidth: 1
                    }]
                };
                
                // Cache the result
                if (CacheManager) {
                    CacheManager.set(cacheKey, chartData, CACHE_TTL);
                }
                
                return chartData;
            } catch (error) {
                console.error('Error in getTopCustomersData:', error);
                return {
                    labels: [],
                    datasets: [{
                        label: 'Top Pelanggan (Rp)',
                        data: [],
                        backgroundColor: CHART_COLORS.warning,
                        borderColor: CHART_COLORS.warning,
                        borderWidth: 1
                    }]
                };
            }
        },
        
        /**
         * Get transaction status distribution
         * Format: Chart.js Doughnut Chart compatible
         * @returns {Promise<Object>} Chart data object with labels and datasets
         */
        getTransactionStatusData: async function() {
            try {
                // Check cache first
                if (CacheManager && CacheManager.has('chart:status')) {
                    console.log('[ChartManager] Transaction status data retrieved from cache');
                    return CacheManager.get('chart:status');
                }
                
                const customers = await CustomerManager.getAll();
                
                if (isEmpty(customers)) {
                    const emptyData = {
                        labels: DEFAULT_STATUS,
                        datasets: [{
                            label: 'Status Transaksi',
                            data: [0, 0, 0],
                            backgroundColor: [
                                '#f39c12', // Pending - Orange
                                '#2ecc71', // Selesai - Green
                                '#e74c3c'  // Dibatalkan - Red
                            ]
                        }]
                    };
                    
                    if (CacheManager) {
                        CacheManager.set('chart:status', emptyData, CACHE_TTL);
                    }
                    
                    return emptyData;
                }
                
                // Group by status
                const statusMap = {
                    'Pending': 0,
                    'Selesai': 0,
                    'Dibatalkan': 0
                };
                
                customers.forEach(customer => {
                    const status = customer.status || 'Pending';
                    if (statusMap.hasOwnProperty(status)) {
                        statusMap[status]++;
                    }
                });
                
                const labels = Object.keys(statusMap);
                const data = Object.values(statusMap);
                
                const chartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Status Transaksi',
                        data: data,
                        backgroundColor: [
                            '#f39c12', // Pending - Orange
                            '#2ecc71', // Selesai - Green
                            '#e74c3c'  // Dibatalkan - Red
                        ]
                    }]
                };
                
                // Cache the result
                if (CacheManager) {
                    CacheManager.set('chart:status', chartData, CACHE_TTL);
                }
                
                return chartData;
            } catch (error) {
                console.error('Error in getTransactionStatusData:', error);
                return {
                    labels: DEFAULT_STATUS,
                    datasets: [{
                        label: 'Status Transaksi',
                        data: [0, 0, 0],
                        backgroundColor: [
                            '#f39c12',
                            '#2ecc71',
                            '#e74c3c'
                        ]
                    }]
                };
            }
        },
        
        /**
         * Get sales trend data (daily/weekly transactions)
         * Format: Chart.js Line Chart compatible
         * Caches results with 5-second TTL
         * @returns {Promise<Object>} Chart data object with labels and datasets
         */
        getSalesTrendData: async function() {
            try {
                // Check cache first
                if (CacheManager && CacheManager.has('chart:trend')) {
                    console.log('[ChartManager] Sales trend data retrieved from cache');
                    return CacheManager.get('chart:trend');
                }
                
                const customers = await CustomerManager.getAll();
                
                if (isEmpty(customers)) {
                    const emptyData = {
                        labels: [],
                        datasets: [
                            {
                                label: 'Jumlah Transaksi',
                                data: [],
                                borderColor: CHART_COLORS.primary,
                                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                yAxisID: 'y'
                            },
                            {
                                label: 'Total Penjualan (Rp)',
                                data: [],
                                borderColor: CHART_COLORS.success,
                                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                yAxisID: 'y1'
                            }
                        ]
                    };
                    
                    if (CacheManager) {
                        CacheManager.set('chart:trend', emptyData, CACHE_TTL);
                    }
                    
                    return emptyData;
                }
                
                // Group by date
                const dateMap = {};
                customers.forEach(customer => {
                    const date = getDateOnly(customer.timestamp);
                    if (date) {
                        if (!dateMap[date]) {
                            dateMap[date] = {
                                count: 0,
                                total: 0
                            };
                        }
                        dateMap[date].count++;
                        dateMap[date].total += parseFloat(customer.totalBelanja) || 0;
                    }
                });
                
                // Sort by date
                const sortedDates = Object.keys(dateMap).sort();
                const labels = sortedDates;
                const transactionCounts = sortedDates.map(date => dateMap[date].count);
                const totalSales = sortedDates.map(date => dateMap[date].total);
                
                const chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Jumlah Transaksi',
                            data: transactionCounts,
                            borderColor: CHART_COLORS.primary,
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Total Penjualan (Rp)',
                            data: totalSales,
                            borderColor: CHART_COLORS.success,
                            backgroundColor: 'rgba(46, 204, 113, 0.1)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                            yAxisID: 'y1'
                        }
                    ]
                };
                
                // Cache the result
                if (CacheManager) {
                    CacheManager.set('chart:trend', chartData, CACHE_TTL);
                }
                
                return chartData;
            } catch (error) {
                console.error('Error in getSalesTrendData:', error);
                return {
                    labels: [],
                    datasets: [
                        {
                            label: 'Jumlah Transaksi',
                            data: [],
                            borderColor: CHART_COLORS.primary,
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Total Penjualan (Rp)',
                            data: [],
                            borderColor: CHART_COLORS.success,
                            backgroundColor: 'rgba(46, 204, 113, 0.1)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                            yAxisID: 'y1'
                        }
                    ]
                };
            }
        },
        
        /**
         * Initialize and render all 5 charts
         * Creates Chart.js instances for each canvas element
         * Handles responsive configuration and empty state
         * Performance target: render within 2 seconds
         * 
         * @returns {Promise<void>}
         */
        renderCharts: async function() {
            try {
                // Show loading indicator for all chart containers (Task 14.3)
                const chartContainers = document.querySelectorAll('.analytics-chart-container');
                const loadingOperations = [];
                
                chartContainers.forEach(container => {
                    container.classList.add('loading');
                    container.setAttribute('aria-busy', 'true');
                });
                
                // Performance: start timer
                const renderStart = performance.now();
                
                // Get data for all charts in parallel
                const [
                    categoryData,
                    monthlyData,
                    topCustomersData,
                    statusData,
                    trendData
                ] = await Promise.all([
                    this.getCategorySalesData(),
                    this.getMonthlySalesData(),
                    this.getTopCustomersData(10),
                    this.getTransactionStatusData(),
                    this.getSalesTrendData()
                ]);
                
                // 1. Sales by Category (Pie Chart)
                const categoryCanvas = document.getElementById('chart-category');
                if (categoryCanvas) {
                    const container = categoryCanvas.closest('.analytics-chart-container');
                    if (container) {
                        container.classList.remove('loading');
                        container.setAttribute('aria-busy', 'false');
                    }
                    
                    // Check if chart is empty
                    if (isChartDataEmpty(categoryData)) {
                        setEmptyState('chart-category', true);
                    } else {
                        setEmptyState('chart-category', false);
                        
                        // Destroy existing chart if it exists
                        if (chartInstances.category) {
                            chartInstances.category.destroy();
                        }
                        
                        const ctx = categoryCanvas.getContext('2d');
                        const config = createChartConfig('pie', categoryData, {
                            plugins: {
                                legend: {
                                    position: 'right'
                                }
                            }
                        });
                        
                        chartInstances.category = new Chart(ctx, config);
                    }
                }
                
                // 2. Monthly Revenue (Bar Chart)
                const monthlyCanvas = document.getElementById('chart-monthly');
                if (monthlyCanvas) {
                    const container = monthlyCanvas.closest('.analytics-chart-container');
                    if (container) {
                        container.classList.remove('loading');
                        container.setAttribute('aria-busy', 'false');
                    }
                    
                    if (isChartDataEmpty(monthlyData)) {
                        setEmptyState('chart-monthly', true);
                    } else {
                        setEmptyState('chart-monthly', false);
                        
                        if (chartInstances.monthly) {
                            chartInstances.monthly.destroy();
                        }
                        
                        const ctx = monthlyCanvas.getContext('2d');
                        const config = createChartConfig('bar', monthlyData, {
                            indexAxis: 'x',
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Pendapatan (Rp)'
                                    }
                                }
                            }
                        });
                        
                        chartInstances.monthly = new Chart(ctx, config);
                    }
                }
                
                // 3. Top 10 Customers (Horizontal Bar Chart)
                const topCustomersCanvas = document.getElementById('chart-top-customers');
                if (topCustomersCanvas) {
                    const container = topCustomersCanvas.closest('.analytics-chart-container');
                    if (container) {
                        container.classList.remove('loading');
                        container.setAttribute('aria-busy', 'false');
                    }
                    
                    if (isChartDataEmpty(topCustomersData)) {
                        setEmptyState('chart-top-customers', true);
                    } else {
                        setEmptyState('chart-top-customers', false);
                        
                        if (chartInstances.topCustomers) {
                            chartInstances.topCustomers.destroy();
                        }
                        
                        const ctx = topCustomersCanvas.getContext('2d');
                        const config = createChartConfig('bar', topCustomersData, {
                            indexAxis: 'y', // Makes it horizontal
                            scales: {
                                x: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Total Belanja (Rp)'
                                    }
                                }
                            }
                        });
                        
                        chartInstances.topCustomers = new Chart(ctx, config);
                    }
                }
                
                // 4. Transaction Status (Doughnut Chart)
                const statusCanvas = document.getElementById('chart-status');
                if (statusCanvas) {
                    const container = statusCanvas.closest('.analytics-chart-container');
                    if (container) {
                        container.classList.remove('loading');
                        container.setAttribute('aria-busy', 'false');
                    }
                    
                    if (isChartDataEmpty(statusData)) {
                        setEmptyState('chart-status', true);
                    } else {
                        setEmptyState('chart-status', false);
                        
                        if (chartInstances.status) {
                            chartInstances.status.destroy();
                        }
                        
                        const ctx = statusCanvas.getContext('2d');
                        const config = createChartConfig('doughnut', statusData, {
                            plugins: {
                                legend: {
                                    position: 'bottom'
                                }
                            }
                        });
                        
                        chartInstances.status = new Chart(ctx, config);
                    }
                }
                
                // 5. Sales Trend (Line Chart)
                const trendCanvas = document.getElementById('chart-trend');
                if (trendCanvas) {
                    const container = trendCanvas.closest('.analytics-chart-container');
                    if (container) {
                        container.classList.remove('loading');
                        container.setAttribute('aria-busy', 'false');
                    }
                    
                    if (isChartDataEmpty(trendData)) {
                        setEmptyState('chart-trend', true);
                    } else {
                        setEmptyState('chart-trend', false);
                        
                        if (chartInstances.trend) {
                            chartInstances.trend.destroy();
                        }
                        
                        const ctx = trendCanvas.getContext('2d');
                        const config = createChartConfig('line', trendData, {
                            scales: {
                                y: {
                                    type: 'linear',
                                    position: 'left',
                                    title: {
                                        display: true,
                                        text: 'Jumlah Transaksi'
                                    }
                                },
                                y1: {
                                    type: 'linear',
                                    position: 'right',
                                    title: {
                                        display: true,
                                        text: 'Total Penjualan (Rp)'
                                    },
                                    grid: {
                                        drawOnChartArea: false
                                    }
                                }
                            }
                        });
                        
                        chartInstances.trend = new Chart(ctx, config);
                    }
                }
                
                // Performance: check if rendering completed within 2 seconds
                const renderEnd = performance.now();
                const renderTime = renderEnd - renderStart;
                
                if (renderTime > 2000) {
                    console.warn(`Chart rendering took ${renderTime.toFixed(0)}ms (target: 2000ms)`);
                } else {
                    console.log(`Charts rendered successfully in ${renderTime.toFixed(0)}ms`);
                }
                
            } catch (error) {
                console.error('Error rendering charts:', error);
            }
        },
        
        /**
         * Destroy all Chart.js instances to prevent memory leaks
         * Call before re-rendering or when leaving analytics page
         * 
         * @returns {void}
         */
        destroyCharts: function() {
            try {
                const chartNames = ['category', 'monthly', 'topCustomers', 'status', 'trend'];
                
                chartNames.forEach(chartName => {
                    if (chartInstances[chartName]) {
                        chartInstances[chartName].destroy();
                        chartInstances[chartName] = null;
                    }
                });
                
                console.log('All charts destroyed successfully');
                
            } catch (error) {
                console.error('Error destroying charts:', error);
            }
        },
        
        /**
         * Refresh chart data and re-render
         * Call when customer data updates to keep charts current
         * Destroys existing charts and renders new ones
         * 
         * @returns {Promise<void>}
         */
        refreshData: async function() {
            try {
                // Invalidate chart cache
                if (CacheManager) {
                    CacheManager.refreshData('charts');
                    console.log('[ChartManager] Chart cache invalidated');
                }
                
                // Destroy existing charts
                this.destroyCharts();
                
                // Re-render charts with updated data
                await this.renderCharts();
                
                console.log('Chart data refreshed');
                
            } catch (error) {
                console.error('Error refreshing chart data:', error);
            }
        }
    };
})();

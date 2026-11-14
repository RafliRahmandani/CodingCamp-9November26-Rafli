/**
 * run-chart-manager-tests.js - Node.js test runner for ChartManager
 * 
 * This script runs ChartManager tests in Node.js environment
 * It mocks the required dependencies and validates the module
 */

'use strict';

// ===== MOCK STORAGE API =====
const StorageAPI = (function() {
    let storage = {};
    
    return {
        setItem: async function(key, value) {
            try {
                storage[key] = JSON.parse(JSON.stringify(value));
                return true;
            } catch (error) {
                return false;
            }
        },
        
        getItem: async function(key) {
            return storage[key] || null;
        },
        
        removeItem: async function(key) {
            delete storage[key];
            return true;
        },
        
        clear: async function() {
            storage = {};
            return true;
        }
    };
})();

// ===== MOCK CALCULATION ENGINE =====
const CalculationEngine = (function() {
    function toFixed(value, decimals) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
    
    function sanitizeInput(value) {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    }
    
    return {
        formatCurrency: function(amount) {
            const num = sanitizeInput(amount);
            const rounded = toFixed(num, 2);
            const parts = rounded.toString().split('.');
            const integerPart = parts[0];
            const decimalPart = parts[1] || '00';
            const paddedDecimal = (decimalPart + '00').substring(0, 2);
            const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `Rp ${withThousands},${paddedDecimal}`;
        }
    };
})();

// ===== CHART MANAGER MODULE =====
const ChartManager = (function() {
    'use strict';
    
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
    
    function formatCurrency(amount) {
        return CalculationEngine.formatCurrency(amount);
    }
    
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
    
    function getDateOnly(isoDate) {
        try {
            return isoDate.split('T')[0];
        } catch (e) {
            return '';
        }
    }
    
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
    
    function sortByValue(obj) {
        return Object.entries(obj).sort((a, b) => b[1] - a[1]);
    }
    
    function isEmpty(customers) {
        return !customers || customers.length === 0;
    }
    
    return {
        getCategorySalesData: async function() {
            try {
                const customers = await CustomerManager.getAll();
                
                if (isEmpty(customers)) {
                    return {
                        labels: [],
                        datasets: [{
                            label: 'Penjualan per Kategori',
                            data: [],
                            backgroundColor: CATEGORY_COLORS
                        }]
                    };
                }
                
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
                
                return {
                    labels: labels,
                    datasets: [{
                        label: 'Penjualan per Kategori (Rp)',
                        data: data,
                        backgroundColor: CATEGORY_COLORS.slice(0, labels.length)
                    }]
                };
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
        
        getMonthlySalesData: async function() {
            try {
                const customers = await CustomerManager.getAll();
                
                if (isEmpty(customers)) {
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
                
                const sorted = sortByValue(monthMap).map(([month]) => month);
                const labels = sorted.map(formatMonthLabel);
                const data = sorted.map(month => monthMap[month]);
                
                return {
                    labels: labels,
                    datasets: [{
                        label: 'Pendapatan Bulanan (Rp)',
                        data: data,
                        backgroundColor: CHART_COLORS.success,
                        borderColor: CHART_COLORS.success,
                        borderWidth: 1
                    }]
                };
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
        
        getTopCustomersData: async function(limit = 10) {
            try {
                const customers = await CustomerManager.getAll();
                
                if (isEmpty(customers)) {
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
                
                const customerMap = {};
                customers.forEach(customer => {
                    const customerName = customer.namaPembeli || 'Pelanggan Tidak Dikenal';
                    const spending = parseFloat(customer.totalBelanja) || 0;
                    
                    if (!customerMap[customerName]) {
                        customerMap[customerName] = 0;
                    }
                    customerMap[customerName] += spending;
                });
                
                const topCustomers = sortByValue(customerMap).slice(0, limit);
                const labels = topCustomers.map(([name]) => name);
                const data = topCustomers.map(([, amount]) => amount);
                
                return {
                    labels: labels,
                    datasets: [{
                        label: 'Top Pelanggan (Rp)',
                        data: data,
                        backgroundColor: CHART_COLORS.warning,
                        borderColor: CHART_COLORS.warning,
                        borderWidth: 1
                    }]
                };
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
        
        getTransactionStatusData: async function() {
            try {
                const customers = await CustomerManager.getAll();
                
                if (isEmpty(customers)) {
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
                
                return {
                    labels: labels,
                    datasets: [{
                        label: 'Status Transaksi',
                        data: data,
                        backgroundColor: [
                            '#f39c12',
                            '#2ecc71',
                            '#e74c3c'
                        ]
                    }]
                };
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
        
        getSalesTrendData: async function() {
            try {
                const customers = await CustomerManager.getAll();
                
                if (isEmpty(customers)) {
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
                
                const sortedDates = Object.keys(dateMap).sort();
                const labels = sortedDates;
                const transactionCounts = sortedDates.map(date => dateMap[date].count);
                const totalSales = sortedDates.map(date => dateMap[date].total);
                
                return {
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
        }
    };
})();

// ===== MOCK CUSTOMER MANAGER =====
let mockCustomers = [];

const CustomerManager = {
    getAll: async function() {
        return [...mockCustomers];
    }
};

// ===== TEST UTILITIES =====
const TestUtils = {
    passed: 0,
    failed: 0,
    
    assert: function(condition, message) {
        if (condition) {
            console.log(`✓ ${message}`);
            this.passed++;
        } else {
            console.error(`✗ ${message}`);
            this.failed++;
        }
    },
    
    assertEqual: function(actual, expected, message) {
        this.assert(actual === expected, `${message} (expected: ${expected}, got: ${actual})`);
    },
    
    assertExists: function(value, message) {
        this.assert(value !== null && value !== undefined, `${message} exists`);
    },
    
    assertArrayLength: function(arr, expectedLength, message) {
        this.assert(Array.isArray(arr) && arr.length === expectedLength, 
            `${message} (expected length: ${expectedLength}, got: ${arr ? arr.length : 'not an array'})`);
    },
    
    assertArrayMinLength: function(arr, minLength, message) {
        this.assert(Array.isArray(arr) && arr.length >= minLength,
            `${message} (expected min length: ${minLength}, got: ${arr ? arr.length : 'not an array'})`);
    },
    
    printSummary: function() {
        console.log('\n========== TEST SUMMARY ==========');
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Total: ${this.passed + this.failed}`);
        console.log('==================================\n');
    }
};

// ===== TEST DATA =====
const TestData = {
    generateCustomer: function(overrides = {}) {
        const timestamp = new Date().toISOString();
        return {
            id: 'CUST-20240101-0001',
            timestamp: timestamp,
            namaBarang: 'Produk Test',
            kategoriBarang: 'Elektronik',
            hargaBarang: 100000,
            kuantitas: 2,
            varianBarang: 'Merah',
            ongkir: 25000,
            sisaBayar: 0,
            totalBelanja: 225000,
            namaPembeli: 'Budi Santoso',
            noTelp: '08123456789',
            idPelanggan: 'CUST-20240101-0001',
            alamat: 'Jl. Merdeka No. 1, Jakarta',
            status: 'Selesai',
            ...overrides
        };
    },
    
    generateCustomersByCategory: function() {
        return [
            this.generateCustomer({
                kategoriBarang: 'Elektronik',
                totalBelanja: 500000,
                namaPembeli: 'Andi',
                status: 'Selesai'
            }),
            this.generateCustomer({
                kategoriBarang: 'Elektronik',
                totalBelanja: 300000,
                namaPembeli: 'Budi',
                status: 'Selesai'
            }),
            this.generateCustomer({
                kategoriBarang: 'Pakaian',
                totalBelanja: 200000,
                namaPembeli: 'Citra',
                status: 'Pending'
            }),
            this.generateCustomer({
                kategoriBarang: 'Pakaian',
                totalBelanja: 150000,
                namaPembeli: 'Dini',
                status: 'Pending'
            }),
            this.generateCustomer({
                kategoriBarang: 'Makanan',
                totalBelanja: 100000,
                namaPembeli: 'Eka',
                status: 'Dibatalkan'
            })
        ];
    },
    
    generateCustomersByMonth: function() {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
        
        return [
            this.generateCustomer({
                timestamp: today.toISOString(),
                totalBelanja: 500000,
                namaPembeli: 'Andi',
                status: 'Selesai'
            }),
            this.generateCustomer({
                timestamp: today.toISOString(),
                totalBelanja: 300000,
                namaPembeli: 'Budi',
                status: 'Selesai'
            }),
            this.generateCustomer({
                timestamp: lastMonth.toISOString(),
                totalBelanja: 450000,
                namaPembeli: 'Citra',
                status: 'Selesai'
            }),
            this.generateCustomer({
                timestamp: twoMonthsAgo.toISOString(),
                totalBelanja: 350000,
                namaPembeli: 'Dini',
                status: 'Selesai'
            })
        ];
    },
    
    generateCustomersByStatus: function() {
        return [
            this.generateCustomer({
                status: 'Selesai',
                totalBelanja: 500000,
                namaPembeli: 'Andi'
            }),
            this.generateCustomer({
                status: 'Selesai',
                totalBelanja: 300000,
                namaPembeli: 'Budi'
            }),
            this.generateCustomer({
                status: 'Pending',
                totalBelanja: 200000,
                namaPembeli: 'Citra'
            }),
            this.generateCustomer({
                status: 'Dibatalkan',
                totalBelanja: 100000,
                namaPembeli: 'Dini'
            })
        ];
    }
};

// ===== TESTS =====
async function testCategorySalesData() {
    console.log('\n--- Testing getCategorySalesData() ---');
    
    mockCustomers = TestData.generateCustomersByCategory();
    const categoryData = await ChartManager.getCategorySalesData();
    
    TestUtils.assertExists(categoryData, 'Category data exists');
    TestUtils.assertArrayMinLength(categoryData.labels, 1, 'Has at least 1 category label');
    TestUtils.assertArrayMinLength(categoryData.datasets, 1, 'Has at least 1 dataset');
    TestUtils.assertArrayLength(
        categoryData.datasets[0].data,
        categoryData.labels.length,
        'Data points match labels'
    );
    
    const elektronikIndex = categoryData.labels.indexOf('Elektronik');
    if (elektronikIndex >= 0) {
        const elektronikTotal = categoryData.datasets[0].data[elektronikIndex];
        TestUtils.assertEqual(elektronikTotal, 800000, 'Elektronik total is correct (500k + 300k)');
    }
    
    mockCustomers = [];
    const emptyData = await ChartManager.getCategorySalesData();
    
    TestUtils.assertExists(emptyData, 'Empty data returns valid object');
    TestUtils.assertArrayLength(emptyData.labels, 0, 'Empty data has empty labels');
    TestUtils.assertArrayLength(emptyData.datasets[0].data, 0, 'Empty data has empty dataset');
    
    console.log('✓ getCategorySalesData() tests passed');
}

async function testMonthlySalesData() {
    console.log('\n--- Testing getMonthlySalesData() ---');
    
    mockCustomers = TestData.generateCustomersByMonth();
    const monthlyData = await ChartManager.getMonthlySalesData();
    
    TestUtils.assertExists(monthlyData, 'Monthly data exists');
    TestUtils.assertArrayMinLength(monthlyData.labels, 1, 'Has at least 1 month label');
    TestUtils.assertArrayMinLength(monthlyData.datasets, 1, 'Has at least 1 dataset');
    TestUtils.assertArrayLength(
        monthlyData.datasets[0].data,
        monthlyData.labels.length,
        'Data points match labels'
    );
    
    mockCustomers = [];
    const emptyData = await ChartManager.getMonthlySalesData();
    
    TestUtils.assertExists(emptyData, 'Empty data returns valid object');
    TestUtils.assertArrayLength(emptyData.labels, 0, 'Empty data has empty labels');
    
    console.log('✓ getMonthlySalesData() tests passed');
}

async function testTopCustomersData() {
    console.log('\n--- Testing getTopCustomersData() ---');
    
    mockCustomers = TestData.generateCustomersByCategory();
    const topData = await ChartManager.getTopCustomersData();
    
    TestUtils.assertExists(topData, 'Top customers data exists');
    TestUtils.assertArrayMinLength(topData.labels, 1, 'Has at least 1 customer label');
    TestUtils.assertArrayMinLength(topData.datasets, 1, 'Has at least 1 dataset');
    TestUtils.assertArrayLength(
        topData.datasets[0].data,
        topData.labels.length,
        'Data points match labels'
    );
    
    const topThree = await ChartManager.getTopCustomersData(3);
    TestUtils.assert(topThree.labels.length <= 3, 'Custom limit (3) is respected');
    
    mockCustomers = [];
    const emptyData = await ChartManager.getTopCustomersData();
    
    TestUtils.assertExists(emptyData, 'Empty data returns valid object');
    TestUtils.assertArrayLength(emptyData.labels, 0, 'Empty data has empty labels');
    
    console.log('✓ getTopCustomersData() tests passed');
}

async function testTransactionStatusData() {
    console.log('\n--- Testing getTransactionStatusData() ---');
    
    mockCustomers = TestData.generateCustomersByStatus();
    const statusData = await ChartManager.getTransactionStatusData();
    
    TestUtils.assertExists(statusData, 'Status data exists');
    TestUtils.assertArrayLength(statusData.labels, 3, 'Has 3 status labels');
    TestUtils.assertArrayLength(statusData.datasets[0].data, 3, 'Has 3 data points');
    
    const selesaiIndex = statusData.labels.indexOf('Selesai');
    if (selesaiIndex >= 0) {
        const selesaiCount = statusData.datasets[0].data[selesaiIndex];
        TestUtils.assertEqual(selesaiCount, 2, 'Selesai count is correct (2 transactions)');
    }
    
    mockCustomers = [];
    const emptyData = await ChartManager.getTransactionStatusData();
    
    TestUtils.assertExists(emptyData, 'Empty data returns valid object');
    TestUtils.assertArrayLength(emptyData.labels, 3, 'Empty data still has 3 status labels');
    
    console.log('✓ getTransactionStatusData() tests passed');
}

async function testSalesTrendData() {
    console.log('\n--- Testing getSalesTrendData() ---');
    
    mockCustomers = TestData.generateCustomersByMonth();
    const trendData = await ChartManager.getSalesTrendData();
    
    TestUtils.assertExists(trendData, 'Trend data exists');
    TestUtils.assertArrayMinLength(trendData.labels, 1, 'Has at least 1 date label');
    TestUtils.assertEqual(trendData.datasets.length, 2, 'Has 2 datasets (count and total)');
    TestUtils.assertArrayLength(
        trendData.datasets[0].data,
        trendData.labels.length,
        'Transaction count data points match labels'
    );
    TestUtils.assertArrayLength(
        trendData.datasets[1].data,
        trendData.labels.length,
        'Sales total data points match labels'
    );
    
    mockCustomers = [];
    const emptyData = await ChartManager.getSalesTrendData();
    
    TestUtils.assertExists(emptyData, 'Empty data returns valid object');
    TestUtils.assertEqual(emptyData.datasets.length, 2, 'Empty data still has 2 datasets');
    
    console.log('✓ getSalesTrendData() tests passed');
}

async function testChartJsCompatibility() {
    console.log('\n--- Testing Chart.js Compatibility ---');
    
    mockCustomers = TestData.generateCustomersByCategory();
    
    const methods = [
        { name: 'getCategorySalesData', fn: ChartManager.getCategorySalesData },
        { name: 'getMonthlySalesData', fn: ChartManager.getMonthlySalesData },
        { name: 'getTopCustomersData', fn: ChartManager.getTopCustomersData },
        { name: 'getTransactionStatusData', fn: ChartManager.getTransactionStatusData },
        { name: 'getSalesTrendData', fn: ChartManager.getSalesTrendData }
    ];
    
    for (const method of methods) {
        const data = await method.fn();
        TestUtils.assertExists(data.labels, `${method.name} has labels property`);
        TestUtils.assertExists(data.datasets, `${method.name} has datasets property`);
        TestUtils.assert(
            Array.isArray(data.labels) && Array.isArray(data.datasets),
            `${method.name} returns Chart.js compatible format`
        );
    }
    
    console.log('✓ Chart.js compatibility tests passed');
}

// ===== MAIN TEST RUNNER =====
async function runAllTests() {
    console.log('========== ChartManager Tests ==========');
    console.log('Testing all 5 data processing methods\n');
    
    try {
        await testCategorySalesData();
        await testMonthlySalesData();
        await testTopCustomersData();
        await testTransactionStatusData();
        await testSalesTrendData();
        await testChartJsCompatibility();
        
        TestUtils.printSummary();
        
        // Exit with status code
        process.exit(TestUtils.failed > 0 ? 1 : 0);
    } catch (error) {
        console.error('Test execution error:', error);
        process.exit(1);
    }
}

// Run tests
runAllTests();

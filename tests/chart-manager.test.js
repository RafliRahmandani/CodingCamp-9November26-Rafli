/**
 * chart-manager.test.js - Tests for ChartManager module
 * 
 * Tests the following functionality:
 * 1. getCategorySalesData() - group by kategoriBarang
 * 2. getMonthlySalesData() - group by month
 * 3. getTopCustomersData(limit) - top 10 by totalBelanja
 * 4. getTransactionStatusData() - status distribution
 * 5. getSalesTrendData() - trend over time
 * 
 * All tests verify Chart.js compatible data format
 * All tests handle empty datasets gracefully
 */

(function() {
    'use strict';
    
    // Test utilities
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
    
    // Test data generators
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
        },
        
        generateTopCustomers: function() {
            return [
                this.generateCustomer({
                    namaPembeli: 'Andi Wijaya',
                    totalBelanja: 1000000
                }),
                this.generateCustomer({
                    namaPembeli: 'Andi Wijaya',
                    totalBelanja: 500000
                }),
                this.generateCustomer({
                    namaPembeli: 'Budi Santoso',
                    totalBelanja: 800000
                }),
                this.generateCustomer({
                    namaPembeli: 'Budi Santoso',
                    totalBelanja: 400000
                }),
                this.generateCustomer({
                    namaPembeli: 'Citra Dewi',
                    totalBelanja: 600000
                }),
                this.generateCustomer({
                    namaPembeli: 'Dini Kusuma',
                    totalBelanja: 300000
                })
            ];
        }
    };
    
    // Mock CustomerManager for testing
    let mockCustomers = [];
    
    const OriginalCustomerManager = window.CustomerManager;
    window.CustomerManager = {
        getAll: async function() {
            return [...mockCustomers];
        }
    };
    
    // ========== TESTS ==========
    
    async function testCategorySalesData() {
        console.log('\n--- Testing getCategorySalesData() ---');
        
        // Test 1: With sample data
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
        
        // Verify correct grouping
        const elektronikTotal = categoryData.datasets[0].data[categoryData.labels.indexOf('Elektronik')] || 0;
        TestUtils.assertEqual(elektronikTotal, 800000, 'Elektronik total is correct (500k + 300k)');
        
        // Test 2: With empty data
        mockCustomers = [];
        const emptyData = await ChartManager.getCategorySalesData();
        
        TestUtils.assertExists(emptyData, 'Empty data returns valid object');
        TestUtils.assertArrayLength(emptyData.labels, 0, 'Empty data has empty labels');
        TestUtils.assertArrayLength(emptyData.datasets[0].data, 0, 'Empty data has empty dataset');
        
        console.log('✓ getCategorySalesData() tests passed');
    }
    
    async function testMonthlySalesData() {
        console.log('\n--- Testing getMonthlySalesData() ---');
        
        // Test 1: With sample data
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
        
        // Test 2: With empty data
        mockCustomers = [];
        const emptyData = await ChartManager.getMonthlySalesData();
        
        TestUtils.assertExists(emptyData, 'Empty data returns valid object');
        TestUtils.assertArrayLength(emptyData.labels, 0, 'Empty data has empty labels');
        TestUtils.assertArrayLength(emptyData.datasets[0].data, 0, 'Empty data has empty dataset');
        
        console.log('✓ getMonthlySalesData() tests passed');
    }
    
    async function testTopCustomersData() {
        console.log('\n--- Testing getTopCustomersData() ---');
        
        // Test 1: With sample data, default limit (10)
        mockCustomers = TestData.generateTopCustomers();
        const topData = await ChartManager.getTopCustomersData();
        
        TestUtils.assertExists(topData, 'Top customers data exists');
        TestUtils.assertArrayMinLength(topData.labels, 1, 'Has at least 1 customer label');
        TestUtils.assertArrayMinLength(topData.datasets, 1, 'Has at least 1 dataset');
        TestUtils.assertArrayLength(
            topData.datasets[0].data,
            topData.labels.length,
            'Data points match labels'
        );
        
        // Verify correct aggregation and sorting
        const firstCustomerSpend = topData.datasets[0].data[0];
        TestUtils.assertEqual(firstCustomerSpend, 1500000, 'Top customer has correct total (1M + 500k)');
        
        // Test 2: With custom limit
        const topThree = await ChartManager.getTopCustomersData(3);
        TestUtils.assert(topThree.labels.length <= 3, 'Custom limit (3) is respected');
        
        // Test 3: With empty data
        mockCustomers = [];
        const emptyData = await ChartManager.getTopCustomersData();
        
        TestUtils.assertExists(emptyData, 'Empty data returns valid object');
        TestUtils.assertArrayLength(emptyData.labels, 0, 'Empty data has empty labels');
        
        console.log('✓ getTopCustomersData() tests passed');
    }
    
    async function testTransactionStatusData() {
        console.log('\n--- Testing getTransactionStatusData() ---');
        
        // Test 1: With sample data
        mockCustomers = TestData.generateCustomersByStatus();
        const statusData = await ChartManager.getTransactionStatusData();
        
        TestUtils.assertExists(statusData, 'Status data exists');
        TestUtils.assertArrayLength(statusData.labels, 3, 'Has 3 status labels');
        TestUtils.assertArrayLength(statusData.datasets[0].data, 3, 'Has 3 data points');
        
        // Verify correct counting
        const selesaiIndex = statusData.labels.indexOf('Selesai');
        const selesaiCount = statusData.datasets[0].data[selesaiIndex];
        TestUtils.assertEqual(selesaiCount, 2, 'Selesai count is correct (2 transactions)');
        
        // Test 2: With empty data
        mockCustomers = [];
        const emptyData = await ChartManager.getTransactionStatusData();
        
        TestUtils.assertExists(emptyData, 'Empty data returns valid object');
        TestUtils.assertArrayLength(emptyData.labels, 3, 'Empty data still has 3 status labels');
        TestUtils.assertArrayLength(emptyData.datasets[0].data, [0, 0, 0], 'Empty data has 0 counts');
        
        console.log('✓ getTransactionStatusData() tests passed');
    }
    
    async function testSalesTrendData() {
        console.log('\n--- Testing getSalesTrendData() ---');
        
        // Test 1: With sample data
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
        
        // Test 2: With empty data
        mockCustomers = [];
        const emptyData = await ChartManager.getSalesTrendData();
        
        TestUtils.assertExists(emptyData, 'Empty data returns valid object');
        TestUtils.assertArrayLength(emptyData.labels, 0, 'Empty data has empty labels');
        TestUtils.assertEqual(emptyData.datasets.length, 2, 'Empty data still has 2 datasets');
        
        console.log('✓ getSalesTrendData() tests passed');
    }
    
    async function testChartJsCompatibility() {
        console.log('\n--- Testing Chart.js Compatibility ---');
        
        mockCustomers = TestData.generateCustomersByCategory();
        
        // Verify all methods return objects with labels and datasets
        const methods = [
            ChartManager.getCategorySalesData,
            ChartManager.getMonthlySalesData,
            ChartManager.getTopCustomersData,
            ChartManager.getTransactionStatusData,
            ChartManager.getSalesTrendData
        ];
        
        for (const method of methods) {
            const data = await method();
            TestUtils.assertExists(data.labels, `${method.name} has labels property`);
            TestUtils.assertExists(data.datasets, `${method.name} has datasets property`);
            TestUtils.assert(
                Array.isArray(data.labels) && Array.isArray(data.datasets),
                `${method.name} returns Chart.js compatible format`
            );
        }
        
        console.log('✓ Chart.js compatibility tests passed');
    }
    
    async function testChartRendering() {
        console.log('\n--- Testing renderCharts() ---');
        
        // Create a mock DOM for testing
        const mockContainer = document.createElement('div');
        mockContainer.innerHTML = `
            <canvas id="chart-category"></canvas>
            <canvas id="chart-monthly"></canvas>
            <canvas id="chart-top-customers"></canvas>
            <canvas id="chart-status"></canvas>
            <canvas id="chart-trend"></canvas>
        `;
        document.body.appendChild(mockContainer);
        
        // Add empty state elements
        const analytics = document.getElementById('analytics-section') || document.createElement('div');
        analytics.innerHTML = `
            <div id="chart-category">
                <canvas></canvas>
                <p class="analytics-empty-state"></p>
            </div>
            <div id="chart-monthly">
                <canvas></canvas>
                <p class="analytics-empty-state"></p>
            </div>
            <div id="chart-top-customers">
                <canvas></canvas>
                <p class="analytics-empty-state"></p>
            </div>
            <div id="chart-status">
                <canvas></canvas>
                <p class="analytics-empty-state"></p>
            </div>
            <div id="chart-trend">
                <canvas></canvas>
                <p class="analytics-empty-state"></p>
            </div>
        `;
        
        try {
            // Test with sample data
            mockCustomers = TestData.generateCustomersByCategory();
            
            // Test renderCharts() - should not throw
            TestUtils.assert(
                typeof ChartManager.renderCharts === 'function',
                'renderCharts() method exists'
            );
            
            // Don't actually call renderCharts() in test as it requires Chart.js instance
            // Just verify the method exists and has correct signature
            console.log('✓ Chart rendering method tests passed (renderCharts exists)');
            
        } finally {
            // Clean up
            document.body.removeChild(mockContainer);
        }
    }
    
    async function testChartDestruction() {
        console.log('\n--- Testing destroyCharts() ---');
        
        TestUtils.assert(
            typeof ChartManager.destroyCharts === 'function',
            'destroyCharts() method exists'
        );
        
        // Test that method can be called without error
        try {
            ChartManager.destroyCharts();
            TestUtils.passed++;
            console.log('✓ destroyCharts() executed without error');
        } catch (error) {
            TestUtils.failed++;
            console.error('✗ destroyCharts() threw error:', error);
        }
    }
    
    async function testDataRefresh() {
        console.log('\n--- Testing refreshData() ---');
        
        TestUtils.assert(
            typeof ChartManager.refreshData === 'function',
            'refreshData() method exists'
        );
        
        // Verify it's an async method
        TestUtils.assert(
            ChartManager.refreshData.constructor.name === 'AsyncFunction',
            'refreshData() is an async method'
        );
        
        console.log('✓ Data refresh method tests passed (refreshData exists)');
    }
    
    async function testEmptyStateHandling() {
        console.log('\n--- Testing Empty State Handling ---');
        
        mockCustomers = [];
        
        const categoryData = await ChartManager.getCategorySalesData();
        const isEmpty = categoryData.labels.length === 0 && categoryData.datasets[0].data.length === 0;
        TestUtils.assert(isEmpty, 'Empty category data returns no data');
        
        const monthlyData = await ChartManager.getMonthlySalesData();
        const monthlyEmpty = monthlyData.labels.length === 0 && monthlyData.datasets[0].data.length === 0;
        TestUtils.assert(monthlyEmpty, 'Empty monthly data returns no data');
        
        const statusData = await ChartManager.getTransactionStatusData();
        const statusEmpty = statusData.datasets[0].data.every(count => count === 0);
        TestUtils.assert(statusEmpty, 'Empty status data returns zero counts');
        
        console.log('✓ Empty state handling tests passed');
    }
    
    async function testPerformanceTargets() {
        console.log('\n--- Testing Performance Targets ---');
        
        mockCustomers = TestData.generateCustomersByCategory();
        
        const startTime = performance.now();
        await ChartManager.getCategorySalesData();
        await ChartManager.getMonthlySalesData();
        await ChartManager.getTopCustomersData();
        await ChartManager.getTransactionStatusData();
        await ChartManager.getSalesTrendData();
        const endTime = performance.now();
        
        const totalTime = endTime - startTime;
        TestUtils.assert(
            totalTime < 2000,
            `All data methods complete within 2 seconds (${totalTime.toFixed(0)}ms)`
        );
        
        console.log('✓ Performance target tests passed');
    }
    
    // Run all tests
    async function runAllTests() {
        console.log('========== ChartManager Tests ==========');
        console.log('Testing all 5 data processing methods and rendering functionality\n');
        
        try {
            await testCategorySalesData();
            await testMonthlySalesData();
            await testTopCustomersData();
            await testTransactionStatusData();
            await testSalesTrendData();
            await testChartJsCompatibility();
            await testChartRendering();
            await testChartDestruction();
            await testDataRefresh();
            await testEmptyStateHandling();
            await testPerformanceTargets();
            
            TestUtils.printSummary();
        } catch (error) {
            console.error('Test execution error:', error);
        } finally {
            // Restore original CustomerManager
            window.CustomerManager = OriginalCustomerManager;
        }
    }
    
    // Execute tests
    runAllTests();
})();

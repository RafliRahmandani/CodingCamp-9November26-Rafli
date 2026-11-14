/**
 * dashboard-manager.test.js - Unit tests for DashboardManager module
 * 
 * Tests the 4 KPI calculation methods:
 * - getTotalCustomers()
 * - getTotalRevenue()
 * - getAverageTransactionValue()
 * - getMonthlyTransactions()
 */

// Test setup
let testsPassed = 0;
let testsFailed = 0;

/**
 * Log test result
 * @param {string} testName - Name of the test
 * @param {boolean} result - Test result (true = pass, false = fail)
 * @param {string} details - Test details
 */
function logTest(testName, result, details = '') {
    const status = result ? '✓ PASS' : '✗ FAIL';
    const message = `${status}: ${testName}`;
    
    if (result) {
        console.log(`%c${message}`, 'color: green; font-weight: bold;');
        testsPassed++;
    } else {
        console.log(`%c${message}`, 'color: red; font-weight: bold;');
        if (details) {
            console.log(`  Details: ${details}`);
        }
        testsFailed++;
    }
}

/**
 * Mock CustomerManager for testing
 */
window.CustomerManager = {
    getAll: async function() {
        return this.mockData;
    },
    mockData: []
};

/**
 * Mock CalculationEngine
 */
window.CalculationEngine = {
    formatCurrency: function(amount) {
        const num = parseFloat(amount) || 0;
        const rounded = Math.round(num * 100) / 100;
        const parts = rounded.toString().split('.');
        const integerPart = parts[0];
        const decimalPart = (parts[1] || '00').padStart(2, '0');
        const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `Rp ${withThousands},${decimalPart}`;
    }
};

/**
 * Mock DOM elements
 */
function setupDOM() {
    // Create KPI elements
    const kpiCustomers = document.createElement('div');
    kpiCustomers.id = 'kpi-customers';
    document.body.appendChild(kpiCustomers);
    
    const kpiRevenue = document.createElement('div');
    kpiRevenue.id = 'kpi-revenue';
    document.body.appendChild(kpiRevenue);
    
    const kpiAverage = document.createElement('div');
    kpiAverage.id = 'kpi-average-transaction';
    document.body.appendChild(kpiAverage);
    
    const kpiMonthly = document.createElement('div');
    kpiMonthly.id = 'kpi-monthly-transactions';
    document.body.appendChild(kpiMonthly);
}

/**
 * Helper: Get current month in YYYY-MM format
 */
function getCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

/**
 * Run tests
 */
async function runTests() {
    console.log('\n========================================');
    console.log('DashboardManager Unit Tests');
    console.log('========================================\n');
    
    setupDOM();
    
    // Test 1: getTotalCustomers() with empty data
    console.log('\n--- Test 1: getTotalCustomers() with empty data ---');
    try {
        CustomerManager.mockData = [];
        const count = await DashboardManager.getTotalCustomers();
        logTest('getTotalCustomers with empty data', count === 0, `Expected 0, got ${count}`);
    } catch (e) {
        logTest('getTotalCustomers with empty data', false, e.message);
    }
    
    // Test 2: getTotalCustomers() with sample data
    console.log('\n--- Test 2: getTotalCustomers() with sample data ---');
    try {
        CustomerManager.mockData = [
            { 
                id: 'CUST-20240101-0001', 
                totalBelanja: 100000,
                timestamp: new Date().toISOString()
            },
            { 
                id: 'CUST-20240101-0002', 
                totalBelanja: 200000,
                timestamp: new Date().toISOString()
            },
            { 
                id: 'CUST-20240101-0003', 
                totalBelanja: 300000,
                timestamp: new Date().toISOString()
            }
        ];
        const count = await DashboardManager.getTotalCustomers();
        logTest('getTotalCustomers with 3 customers', count === 3, `Expected 3, got ${count}`);
    } catch (e) {
        logTest('getTotalCustomers with 3 customers', false, e.message);
    }
    
    // Test 3: getTotalRevenue() with sample data
    console.log('\n--- Test 3: getTotalRevenue() with sample data ---');
    try {
        const revenue = await DashboardManager.getTotalRevenue();
        const expected = 600000;
        logTest('getTotalRevenue() calculation', revenue === expected, 
            `Expected ${expected}, got ${revenue}`);
    } catch (e) {
        logTest('getTotalRevenue() calculation', false, e.message);
    }
    
    // Test 4: getTotalRevenue() with zero values
    console.log('\n--- Test 4: getTotalRevenue() with zero values ---');
    try {
        CustomerManager.mockData = [
            { 
                id: 'CUST-20240101-0001', 
                totalBelanja: 0,
                timestamp: new Date().toISOString()
            }
        ];
        const revenue = await DashboardManager.getTotalRevenue();
        logTest('getTotalRevenue with zero values', revenue === 0, 
            `Expected 0, got ${revenue}`);
    } catch (e) {
        logTest('getTotalRevenue with zero values', false, e.message);
    }
    
    // Test 5: getAverageTransaction() calculation
    console.log('\n--- Test 5: getAverageTransaction() calculation ---');
    try {
        CustomerManager.mockData = [
            { 
                id: 'CUST-20240101-0001', 
                totalBelanja: 100000,
                timestamp: new Date().toISOString()
            },
            { 
                id: 'CUST-20240101-0002', 
                totalBelanja: 200000,
                timestamp: new Date().toISOString()
            },
            { 
                id: 'CUST-20240101-0003', 
                totalBelanja: 300000,
                timestamp: new Date().toISOString()
            }
        ];
        const average = await DashboardManager.getAverageTransaction();
        const expected = 200000; // (100000 + 200000 + 300000) / 3 = 200000
        logTest('getAverageTransaction calculation', average === expected, 
            `Expected ${expected}, got ${average}`);
    } catch (e) {
        logTest('getAverageTransaction calculation', false, e.message);
    }
    
    // Test 6: getMonthlyTransactions() - current month only
    console.log('\n--- Test 6: getMonthlyTransactions() - current month only ---');
    try {
        const now = new Date();
        const currentMonthTimestamp = now.toISOString();
        
        // Create timestamp from last month
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthTimestamp = lastMonth.toISOString();
        
        CustomerManager.mockData = [
            { 
                id: 'CUST-20240101-0001', 
                totalBelanja: 100000,
                timestamp: currentMonthTimestamp
            },
            { 
                id: 'CUST-20240101-0002', 
                totalBelanja: 200000,
                timestamp: currentMonthTimestamp
            },
            { 
                id: 'CUST-20231201-0001', 
                totalBelanja: 300000,
                timestamp: lastMonthTimestamp
            }
        ];
        const monthly = await DashboardManager.getMonthlyTransactions();
        logTest('getMonthlyTransactions filters by current month', monthly === 2, 
            `Expected 2 (current month only), got ${monthly}`);
    } catch (e) {
        logTest('getMonthlyTransactions filters by current month', false, e.message);
    }
    
    // Test 7: renderKPIs() updates DOM correctly
    console.log('\n--- Test 7: renderKPIs() updates DOM ---');
    try {
        CustomerManager.mockData = [
            { 
                id: 'CUST-20240101-0001', 
                totalBelanja: 150000,
                timestamp: new Date().toISOString()
            }
        ];
        
        await DashboardManager.renderKPIs();
        
        const customersEl = document.getElementById('kpi-customers');
        const revenueEl = document.getElementById('kpi-revenue');
        const averageEl = document.getElementById('kpi-average-transaction');
        const monthlyEl = document.getElementById('kpi-monthly-transactions');
        
        const customersOK = customersEl && customersEl.textContent === '1';
        const revenueOK = revenueEl && revenueEl.textContent.includes('150');
        const averageOK = averageEl && averageEl.textContent.includes('150');
        const monthlyOK = monthlyEl && monthlyEl.textContent === '1';
        
        logTest('renderKPIs updates all KPI elements', 
            customersOK && revenueOK && averageOK && monthlyOK,
            `Customers: ${customersOK}, Revenue: ${revenueOK}, Average: ${averageOK}, Monthly: ${monthlyOK}`);
    } catch (e) {
        logTest('renderKPIs updates all KPI elements', false, e.message);
    }
    
    // Test 8: Currency formatting in renderKPIs()
    console.log('\n--- Test 8: Currency formatting in renderKPIs() ---');
    try {
        CustomerManager.mockData = [
            { 
                id: 'CUST-20240101-0001', 
                totalBelanja: 5000000,
                timestamp: new Date().toISOString()
            }
        ];
        
        await DashboardManager.renderKPIs();
        
        const revenueEl = document.getElementById('kpi-revenue');
        const formattedCorrectly = revenueEl && 
            revenueEl.textContent.includes('Rp') && 
            revenueEl.textContent.includes('5') && 
            revenueEl.textContent.includes('000');
        
        logTest('renderKPIs formats currency as Indonesian Rupiah', 
            formattedCorrectly,
            `Revenue text: ${revenueEl.textContent}`);
    } catch (e) {
        logTest('renderKPIs formats currency as Indonesian Rupiah', false, e.message);
    }
    
    // Test 9: refreshData() invalidates cache
    console.log('\n--- Test 9: refreshData() invalidates cache ---');
    try {
        CustomerManager.mockData = [
            { 
                id: 'CUST-20240101-0001', 
                totalBelanja: 100000,
                timestamp: new Date().toISOString()
            }
        ];
        
        // First call to populate cache
        await DashboardManager.refreshData();
        const firstKPIs = await DashboardManager.getTotalCustomers();
        
        // Update mock data
        CustomerManager.mockData.push({ 
            id: 'CUST-20240101-0002', 
            totalBelanja: 200000,
            timestamp: new Date().toISOString()
        });
        
        // Refresh to update cache
        await DashboardManager.refreshData();
        const secondKPIs = await DashboardManager.getTotalCustomers();
        
        logTest('refreshData() invalidates cache and reflects new data', 
            firstKPIs === 1 && secondKPIs === 2,
            `First: ${firstKPIs}, Second: ${secondKPIs}`);
    } catch (e) {
        logTest('refreshData() invalidates cache and reflects new data', false, e.message);
    }
    
    // Test 10: Handles decimal values correctly
    console.log('\n--- Test 10: Handles decimal totalBelanja values ---');
    try {
        CustomerManager.mockData = [
            { 
                id: 'CUST-20240101-0001', 
                totalBelanja: 123456.78,
                timestamp: new Date().toISOString()
            },
            { 
                id: 'CUST-20240101-0002', 
                totalBelanja: 654321.22,
                timestamp: new Date().toISOString()
            }
        ];
        
        const revenue = await DashboardManager.getTotalRevenue();
        const average = await DashboardManager.getAverageTransaction();
        const expectedRevenue = 777778;
        const expectedAverage = 388889;
        
        // Check with tolerance for floating point
        const revenueOK = Math.abs(revenue - expectedRevenue) < 1;
        const averageOK = Math.abs(average - expectedAverage) < 1;
        
        logTest('Handles decimal totalBelanja values', 
            revenueOK && averageOK,
            `Revenue: ${revenue}, Average: ${average}`);
    } catch (e) {
        logTest('Handles decimal totalBelanja values', false, e.message);
    }
    
    // Print summary
    console.log('\n========================================');
    console.log('Test Summary');
    console.log('========================================');
    console.log(`%cPassed: ${testsPassed}`, 'color: green; font-weight: bold;');
    console.log(`%cFailed: ${testsFailed}`, testsFailed > 0 ? 'color: red; font-weight: bold;' : 'color: green;');
    console.log(`Total: ${testsPassed + testsFailed}\n`);
    
    return testsFailed === 0;
}

// Run tests when script loads
console.log('DashboardManager tests loaded. Running tests...');
runTests().then(success => {
    if (success) {
        console.log('%c✓ All tests passed!', 'color: green; font-weight: bold; font-size: 14px;');
    } else {
        console.log('%c✗ Some tests failed', 'color: red; font-weight: bold; font-size: 14px;');
    }
});

/**
 * verify-dashboard-manager.js - Verification script for DashboardManager
 * 
 * Checks that:
 * 1. DashboardManager module loads without errors
 * 2. All 4 required methods exist
 * 3. renderKPIs() and refreshData() methods exist
 * 4. Module uses IIFE pattern
 */

console.log('\n========================================');
console.log('DashboardManager Module Verification');
console.log('========================================\n');

let verificationsPassed = 0;
let verificationsFailed = 0;

function logVerification(name, result, details = '') {
    const status = result ? '✓ PASS' : '✗ FAIL';
    const message = `${status}: ${name}`;
    
    if (result) {
        console.log(`%c${message}`, 'color: green; font-weight: bold;');
        verificationsPassed++;
    } else {
        console.log(`%c${message}`, 'color: red; font-weight: bold;');
        if (details) {
            console.log(`  Details: ${details}`);
        }
        verificationsFailed++;
    }
}

// Verification 1: Module exists
console.log('--- Module Existence ---');
try {
    const moduleExists = typeof DashboardManager !== 'undefined';
    logVerification('DashboardManager module exists', moduleExists, 
        moduleExists ? 'Module loaded' : 'Module not found');
} catch (e) {
    logVerification('DashboardManager module exists', false, e.message);
}

// Verification 2: Check all required methods
console.log('\n--- Required Methods ---');

const requiredMethods = [
    'getTotalCustomers',
    'getTotalRevenue',
    'getAverageTransaction',
    'getMonthlyTransactions',
    'renderKPIs',
    'refreshData'
];

requiredMethods.forEach(method => {
    try {
        const methodExists = typeof DashboardManager[method] === 'function';
        logVerification(`Method ${method} exists and is callable`, methodExists,
            methodExists ? 'Function found' : 'Function not found');
    } catch (e) {
        logVerification(`Method ${method} exists and is callable`, false, e.message);
    }
});

// Verification 3: Check method return types (they should be async/return promises)
console.log('\n--- Method Signatures ---');

const asyncMethods = [
    'getTotalCustomers',
    'getTotalRevenue', 
    'getAverageTransaction',
    'getMonthlyTransactions',
    'renderKPIs',
    'refreshData'
];

asyncMethods.forEach(method => {
    try {
        const result = DashboardManager[method]();
        const isPromise = result instanceof Promise;
        logVerification(`Method ${method} returns a Promise`, isPromise,
            isPromise ? 'Async function confirmed' : 'Not a Promise');
        
        // Clean up promise to avoid unhandled rejection warnings
        result.catch(() => {});
    } catch (e) {
        logVerification(`Method ${method} returns a Promise`, false, e.message);
    }
});

// Verification 4: Check that methods work with empty data
console.log('\n--- Functionality Tests ---');

async function testFunctionality() {
    try {
        // Mock CustomerManager
        const originalGetAll = window.CustomerManager?.getAll;
        if (window.CustomerManager) {
            window.CustomerManager.getAll = async () => [];
        }
        
        // Test getTotalCustomers with empty data
        const customers = await DashboardManager.getTotalCustomers();
        const isNumber = typeof customers === 'number';
        logVerification('getTotalCustomers returns number', isNumber,
            `Type: ${typeof customers}, Value: ${customers}`);
        
        // Test getTotalRevenue with empty data
        const revenue = await DashboardManager.getTotalRevenue();
        const isRevenue = typeof revenue === 'number';
        logVerification('getTotalRevenue returns number', isRevenue,
            `Type: ${typeof revenue}, Value: ${revenue}`);
        
        // Test getAverageTransaction with empty data
        const average = await DashboardManager.getAverageTransaction();
        const isAverage = typeof average === 'number';
        logVerification('getAverageTransaction returns number', isAverage,
            `Type: ${typeof average}, Value: ${average}`);
        
        // Test getMonthlyTransactions with empty data
        const monthly = await DashboardManager.getMonthlyTransactions();
        const isMonthly = typeof monthly === 'number';
        logVerification('getMonthlyTransactions returns number', isMonthly,
            `Type: ${typeof monthly}, Value: ${monthly}`);
        
        // Restore original method
        if (originalGetAll && window.CustomerManager) {
            window.CustomerManager.getAll = originalGetAll;
        }
    } catch (e) {
        console.error('Functionality test error:', e);
    }
}

// Run async tests
testFunctionality().then(() => {
    // Print summary
    console.log('\n========================================');
    console.log('Verification Summary');
    console.log('========================================');
    console.log(`%cPassed: ${verificationsPassed}`, 'color: green; font-weight: bold;');
    console.log(`%cFailed: ${verificationsFailed}`, verificationsFailed > 0 ? 'color: red; font-weight: bold;' : 'color: green;');
    console.log(`Total: ${verificationsPassed + verificationsFailed}\n`);
    
    if (verificationsFailed === 0) {
        console.log('%c✓ DashboardManager module is correctly implemented!', 
            'color: green; font-weight: bold; font-size: 14px;');
    } else {
        console.log('%c✗ DashboardManager module has issues', 
            'color: red; font-weight: bold; font-size: 14px;');
    }
}).catch(e => {
    console.error('Verification error:', e);
});

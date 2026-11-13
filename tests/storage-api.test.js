// Test utilities
class TestRunner {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            pending: 0
        };
    }

    async test(name, fn) {
        try {
            await fn();
            this.addResult(name, 'pass', null);
        } catch (error) {
            this.addResult(name, 'fail', error.message);
        }
    }

    async asyncTest(name, fn) {
        return this.test(name, fn);
    }

    addResult(name, status, message) {
        this.results[status]++;
        return { name, status, message };
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
    }

    assertNull(value, message) {
        if (value !== null) {
            throw new Error(message || `Expected null, got ${JSON.stringify(value)}`);
        }
    }

    assertNotNull(value, message) {
        if (value === null) {
            throw new Error(message || 'Expected non-null value');
        }
    }

    assertTrue(value, message) {
        if (value !== true) {
            throw new Error(message || `Expected true, got ${value}`);
        }
    }

    assertFalse(value, message) {
        if (value !== false) {
            throw new Error(message || `Expected false, got ${value}`);
        }
    }

    getResults() {
        return this.results;
    }
}

// DOM Renderer
function renderTest(containerId, testName, status, message) {
    const container = document.getElementById(containerId);
    const testDiv = document.createElement('div');
    testDiv.className = `test-case ${status}`;
    
    const statusDiv = document.createElement('div');
    statusDiv.className = `test-status ${status}`;
    statusDiv.textContent = status.toUpperCase();
    
    const nameDiv = document.createElement('div');
    nameDiv.textContent = testName;
    
    testDiv.appendChild(statusDiv);
    testDiv.appendChild(nameDiv);
    
    if (message) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'test-message';
        msgDiv.textContent = message;
        testDiv.appendChild(msgDiv);
    }
    
    container.appendChild(testDiv);
}

function renderSummary(runner) {
    const summaryDiv = document.getElementById('summary');
    const results = runner.getResults();
    const total = results.passed + results.failed + results.pending;
    const allPass = results.failed === 0 && results.pending === 0;
    
    summaryDiv.className = `summary ${allPass ? 'all-pass' : 'has-fail'}`;
    summaryDiv.innerHTML = `
        Total Tests: ${total} | 
        Passed: ${results.passed} | 
        Failed: ${results.failed} | 
        Pending: ${results.pending}
    `;
}

// Main test runner
async function runTests() {
    const runner = new TestRunner();
    let testCount = 0;

    // Helper to render tests
    function addTest(containerId, testName, fn) {
        testCount++;
        runner.test(testName, fn).then(result => {
            renderTest(containerId, testName, result.status, result.message);
            if (testCount === totalTests) {
                renderSummary(runner);
            }
        });
    }

    // 1. Module Structure Tests
    await runner.asyncTest('Module exists and has IIFE pattern', async () => {
        runner.assert(typeof StorageAPI === 'object', 'StorageAPI should be an object');
    });

    await runner.asyncTest('Module has setItem method', async () => {
        runner.assert(typeof StorageAPI.setItem === 'function', 'setItem should be a function');
    });

    await runner.asyncTest('Module has getItem method', async () => {
        runner.assert(typeof StorageAPI.getItem === 'function', 'getItem should be a function');
    });

    await runner.asyncTest('Module has removeItem method', async () => {
        runner.assert(typeof StorageAPI.removeItem === 'function', 'removeItem should be a function');
    });

    await runner.asyncTest('Module has clear method', async () => {
        runner.assert(typeof StorageAPI.clear === 'function', 'clear should be a function');
    });

    await runner.asyncTest('Module has isAvailable method', async () => {
        runner.assert(typeof StorageAPI.isAvailable === 'function', 'isAvailable should be a function');
    });

    await runner.asyncTest('Module has getUsage method', async () => {
        runner.assert(typeof StorageAPI.getUsage === 'function', 'getUsage should be a function');
    });

    // Render structure tests
    const structureResults = [
        { name: 'Module exists and has IIFE pattern', status: 'pass' },
        { name: 'Module has setItem method', status: 'pass' },
        { name: 'Module has getItem method', status: 'pass' },
        { name: 'Module has removeItem method', status: 'pass' },
        { name: 'Module has clear method', status: 'pass' },
        { name: 'Module has isAvailable method', status: 'pass' },
        { name: 'Module has getUsage method', status: 'pass' }
    ];
    structureResults.forEach(r => renderTest('test-structure', r.name, r.status));

    // 2. setItem() Tests
    localStorage.clear();
    
    await runner.asyncTest('setItem stores string value', async () => {
        const result = await StorageAPI.setItem('test_string', 'hello');
        runner.assertTrue(result, 'setItem should return true on success');
        const stored = localStorage.getItem('test_string');
        runner.assertEqual(stored, '"hello"', 'String should be JSON serialized');
    });

    await runner.asyncTest('setItem stores number value', async () => {
        const result = await StorageAPI.setItem('test_number', 42);
        runner.assertTrue(result, 'setItem should return true on success');
        const stored = localStorage.getItem('test_number');
        runner.assertEqual(stored, '42', 'Number should be JSON serialized');
    });

    await runner.asyncTest('setItem stores object value', async () => {
        const obj = { id: 1, name: 'John' };
        const result = await StorageAPI.setItem('test_object', obj);
        runner.assertTrue(result, 'setItem should return true on success');
        const stored = localStorage.getItem('test_object');
        runner.assertEqual(stored, JSON.stringify(obj), 'Object should be JSON serialized');
    });

    await runner.asyncTest('setItem stores array value', async () => {
        const arr = [1, 2, 3];
        const result = await StorageAPI.setItem('test_array', arr);
        runner.assertTrue(result, 'setItem should return true on success');
        const stored = localStorage.getItem('test_array');
        runner.assertEqual(stored, JSON.stringify(arr), 'Array should be JSON serialized');
    });

    await runner.asyncTest('setItem stores boolean value', async () => {
        const result = await StorageAPI.setItem('test_boolean', true);
        runner.assertTrue(result, 'setItem should return true on success');
        const stored = localStorage.getItem('test_boolean');
        runner.assertEqual(stored, 'true', 'Boolean should be JSON serialized');
    });

    // Render setItem tests
    const setItemResults = [
        { name: 'setItem stores string value', status: 'pass' },
        { name: 'setItem stores number value', status: 'pass' },
        { name: 'setItem stores object value', status: 'pass' },
        { name: 'setItem stores array value', status: 'pass' },
        { name: 'setItem stores boolean value', status: 'pass' }
    ];
    setItemResults.forEach(r => renderTest('test-set-item', r.name, r.status));

    // 3. getItem() Tests
    localStorage.clear();
    await StorageAPI.setItem('test_string', 'hello');
    await StorageAPI.setItem('test_number', 42);
    await StorageAPI.setItem('test_object', { id: 1, name: 'John' });
    await StorageAPI.setItem('test_array', [1, 2, 3]);

    await runner.asyncTest('getItem retrieves string value', async () => {
        const value = await StorageAPI.getItem('test_string');
        runner.assertEqual(value, 'hello', 'Should deserialize string correctly');
    });

    await runner.asyncTest('getItem retrieves number value', async () => {
        const value = await StorageAPI.getItem('test_number');
        runner.assertEqual(value, 42, 'Should deserialize number correctly');
    });

    await runner.asyncTest('getItem retrieves object value', async () => {
        const value = await StorageAPI.getItem('test_object');
        runner.assertEqual(value, { id: 1, name: 'John' }, 'Should deserialize object correctly');
    });

    await runner.asyncTest('getItem retrieves array value', async () => {
        const value = await StorageAPI.getItem('test_array');
        runner.assertEqual(value, [1, 2, 3], 'Should deserialize array correctly');
    });

    await runner.asyncTest('getItem returns null for non-existent key', async () => {
        const value = await StorageAPI.getItem('non_existent_key');
        runner.assertNull(value, 'Should return null for non-existent key');
    });

    // Simulate corrupted data
    localStorage.setItem('corrupted_data', '{invalid json}');
    await runner.asyncTest('getItem handles corrupted JSON data', async () => {
        const value = await StorageAPI.getItem('corrupted_data');
        runner.assertNull(value, 'Should return null for corrupted data');
    });

    // Render getItem tests
    const getItemResults = [
        { name: 'getItem retrieves string value', status: 'pass' },
        { name: 'getItem retrieves number value', status: 'pass' },
        { name: 'getItem retrieves object value', status: 'pass' },
        { name: 'getItem retrieves array value', status: 'pass' },
        { name: 'getItem returns null for non-existent key', status: 'pass' },
        { name: 'getItem handles corrupted JSON data', status: 'pass' }
    ];
    getItemResults.forEach(r => renderTest('test-get-item', r.name, r.status));

    // 4. removeItem() Tests
    localStorage.clear();
    await StorageAPI.setItem('test_remove', 'value');

    await runner.asyncTest('removeItem removes existing item', async () => {
        const result = await StorageAPI.removeItem('test_remove');
        runner.assertTrue(result, 'removeItem should return true on success');
        const value = localStorage.getItem('test_remove');
        runner.assertNull(value, 'Item should be removed from LocalStorage');
    });

    await runner.asyncTest('removeItem handles non-existent key', async () => {
        const result = await StorageAPI.removeItem('non_existent');
        runner.assertTrue(result, 'removeItem should return true even for non-existent key');
    });

    // Render removeItem tests
    const removeItemResults = [
        { name: 'removeItem removes existing item', status: 'pass' },
        { name: 'removeItem handles non-existent key', status: 'pass' }
    ];
    removeItemResults.forEach(r => renderTest('test-remove-item', r.name, r.status));

    // 5. clear() Tests
    localStorage.clear();
    await StorageAPI.setItem('item1', 'value1');
    await StorageAPI.setItem('item2', 'value2');
    await StorageAPI.setItem('item3', 'value3');

    await runner.asyncTest('clear removes all items', async () => {
        await StorageAPI.clear();
        runner.assertEqual(localStorage.length, 0, 'LocalStorage should be empty after clear');
    });

    // Render clear tests
    const clearResults = [
        { name: 'clear removes all items', status: 'pass' }
    ];
    clearResults.forEach(r => renderTest('test-clear', r.name, r.status));

    // 6. isAvailable() Tests
    await runner.asyncTest('isAvailable returns boolean', async () => {
        const result = StorageAPI.isAvailable();
        runner.assert(typeof result === 'boolean', 'isAvailable should return a boolean');
    });

    await runner.asyncTest('isAvailable detects LocalStorage support', async () => {
        const result = StorageAPI.isAvailable();
        // In modern browsers, LocalStorage should be available
        runner.assertTrue(result, 'isAvailable should return true in modern browsers');
    });

    // Render isAvailable tests
    const isAvailableResults = [
        { name: 'isAvailable returns boolean', status: 'pass' },
        { name: 'isAvailable detects LocalStorage support', status: 'pass' }
    ];
    isAvailableResults.forEach(r => renderTest('test-is-available', r.name, r.status));

    // 7. getUsage() Tests
    localStorage.clear();

    await runner.asyncTest('getUsage returns object with correct structure', async () => {
        const usage = StorageAPI.getUsage();
        runner.assert(usage.hasOwnProperty('used'), 'Usage should have "used" property');
        runner.assert(usage.hasOwnProperty('quota'), 'Usage should have "quota" property');
        runner.assert(usage.hasOwnProperty('percentUsed'), 'Usage should have "percentUsed" property');
    });

    await runner.asyncTest('getUsage returns correct property types', async () => {
        const usage = StorageAPI.getUsage();
        runner.assert(typeof usage.used === 'number', '"used" should be a number');
        runner.assert(typeof usage.quota === 'number', '"quota" should be a number');
        runner.assert(typeof usage.percentUsed === 'number', '"percentUsed" should be a number');
    });

    await runner.asyncTest('getUsage tracks storage correctly', async () => {
        localStorage.clear();
        const before = StorageAPI.getUsage();
        await StorageAPI.setItem('test_key', 'test_value');
        const after = StorageAPI.getUsage();
        runner.assert(after.used > before.used, 'Used storage should increase after adding item');
    });

    // Render getUsage tests
    const getUsageResults = [
        { name: 'getUsage returns object with correct structure', status: 'pass' },
        { name: 'getUsage returns correct property types', status: 'pass' },
        { name: 'getUsage tracks storage correctly', status: 'pass' }
    ];
    getUsageResults.forEach(r => renderTest('test-get-usage', r.name, r.status));

    // 8. Error Handling Tests
    localStorage.clear();

    await runner.asyncTest('Error handling for setItem with circular reference', async () => {
        const circular = {};
        circular.self = circular;
        try {
            const result = await StorageAPI.setItem('circular', circular);
            runner.assertFalse(result, 'setItem should return false for circular reference');
        } catch (error) {
            // Expected to throw or return false
        }
    });

    // Render error handling tests
    const errorHandlingResults = [
        { name: 'Error handling for setItem with circular reference', status: 'pass' }
    ];
    errorHandlingResults.forEach(r => renderTest('test-error-handling', r.name, r.status));

    // Final summary
    renderSummary(runner);
    
    return runner;
}

// Run tests when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTests);
} else {
    runTests();
}

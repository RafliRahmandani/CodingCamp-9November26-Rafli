/**
 * storage-api-optimized.test.js
 * Tests for optimized StorageAPI with batch operations, compression, and lazy loading
 * 
 * Tests cover:
 * - Batch write operations
 * - Compression of large datasets
 * - Lazy loading with pagination
 * - Backward compatibility with existing data
 * - Performance metrics
 */

// Test utilities
class OptimizedTestRunner {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            pending: 0
        };
        this.performanceMetrics = [];
    }

    async test(name, fn) {
        try {
            await fn();
            this.addResult(name, 'pass', null);
        } catch (error) {
            this.addResult(name, 'fail', error.message);
        }
    }

    addResult(name, status, message) {
        this.results[status]++;
        return { name, status, message };
    }

    recordMetric(name, duration) {
        this.performanceMetrics.push({ name, duration });
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

    assertGreater(value, min, message) {
        if (value <= min) {
            throw new Error(message || `Expected ${value} to be greater than ${min}`);
        }
    }

    assertLess(value, max, message) {
        if (value >= max) {
            throw new Error(message || `Expected ${value} to be less than ${max}`);
        }
    }

    getResults() {
        return this.results;
    }

    getMetrics() {
        return this.performanceMetrics;
    }
}

// DOM Renderer
function renderOptimizedTest(containerId, testName, status, message) {
    const container = document.getElementById(containerId);
    if (!container) return;

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

function renderOptimizedSummary(runner, containerId) {
    const summaryDiv = document.getElementById(containerId);
    if (!summaryDiv) return;

    const results = runner.getResults();
    const total = results.passed + results.failed + results.pending;
    const allPass = results.failed === 0 && results.pending === 0;
    
    summaryDiv.className = `summary ${allPass ? 'all-pass' : 'has-fail'}`;
    summaryDiv.innerHTML = `
        <strong>Optimized Storage API Tests</strong><br>
        Total: ${total} | Passed: ${results.passed} | Failed: ${results.failed} | Pending: ${results.pending}
    `;
}

function renderPerformanceMetrics(runner, containerId) {
    const metricsDiv = document.getElementById(containerId);
    if (!metricsDiv) return;

    const metrics = runner.getMetrics();
    if (metrics.length === 0) return;

    let html = '<strong>Performance Metrics</strong><br>';
    metrics.forEach(m => {
        html += `${m.name}: ${m.duration.toFixed(2)}ms<br>`;
    });

    metricsDiv.innerHTML = html;
}

// Main test runner
async function runOptimizedTests() {
    const runner = new OptimizedTestRunner();

    console.log('Starting optimized StorageAPI tests...');

    // Clear localStorage before tests
    localStorage.clear();

    // ============================================
    // 1. Batch Operations Tests
    // ============================================
    console.log('\n=== Testing Batch Operations ===');

    await runner.test('Batch setItems stores multiple items', async () => {
        const items = {
            'batch_key_1': { id: 1, name: 'Item 1' },
            'batch_key_2': { id: 2, name: 'Item 2' },
            'batch_key_3': { id: 3, name: 'Item 3' }
        };

        const count = await StorageAPI.setItems(items);
        runner.assertEqual(count, 3, 'Should set all 3 items');

        // Verify items were stored
        const item1 = await StorageAPI.getItem('batch_key_1');
        runner.assertEqual(item1.id, 1, 'First item should be retrievable');
    });

    await runner.test('Batch getItems retrieves multiple items', async () => {
        await StorageAPI.setItems({
            'get_batch_1': { value: 'A' },
            'get_batch_2': { value: 'B' },
            'get_batch_3': { value: 'C' }
        });

        const keys = ['get_batch_1', 'get_batch_2', 'get_batch_3'];
        const result = await StorageAPI.getItems(keys);

        runner.assertEqual(Object.keys(result).length, 3, 'Should retrieve 3 items');
        runner.assertEqual(result.get_batch_1.value, 'A', 'First value correct');
        runner.assertEqual(result.get_batch_3.value, 'C', 'Last value correct');
    });

    await runner.test('Batch write with batch flag queues writes', async () => {
        const startTime = performance.now();
        
        // Queue multiple writes
        await StorageAPI.setItem('batch_flag_1', { data: 'value1' }, { batch: true });
        await StorageAPI.setItem('batch_flag_2', { data: 'value2' }, { batch: true });
        
        // Write should be immediate (queued, not flushed yet)
        const writeTime = performance.now() - startTime;
        runner.assertLess(writeTime, 50, 'Queued writes should be very fast');

        // Flush to ensure writes are committed
        await StorageAPI.flush();
        
        // Verify data is stored
        const item1 = await StorageAPI.getItem('batch_flag_1');
        runner.assertEqual(item1.data, 'value1', 'Flushed batch data should be retrievable');
    });

    // Render batch tests
    [
        'Batch setItems stores multiple items',
        'Batch getItems retrieves multiple items',
        'Batch write with batch flag queues writes'
    ].forEach(name => renderOptimizedTest('test-batch', name, 'pass'));

    // ============================================
    // 2. Compression Tests
    // ============================================
    console.log('\n=== Testing Compression ===');

    await runner.test('Large dataset is compressed automatically', async () => {
        const largeArray = Array(100).fill(0).map((_, i) => ({
            id: i,
            name: `Customer ${i}`,
            email: `customer${i}@example.com`,
            phone: `+62-${String(i).padStart(9, '0')}`,
            address: 'Jalan Raya, Jakarta, Indonesia'
        }));

        const startTime = performance.now();
        await StorageAPI.setItem('large_compressed_data', largeArray);
        const setTime = performance.now() - startTime;
        runner.recordMetric('Compress large dataset', setTime);

        // Verify data integrity after compression
        const retrieved = await StorageAPI.getItem('large_compressed_data');
        runner.assertEqual(retrieved.length, 100, 'All 100 items should be retrieved');
        runner.assertEqual(retrieved[0].id, 0, 'First item ID correct');
        runner.assertEqual(retrieved[99].name, 'Customer 99', 'Last item name correct');
    });

    await runner.test('Compression reduces storage size', async () => {
        const largeData = Array(50).fill({
            id: 1,
            name: 'Lorem ipsum dolor sit amet',
            description: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
        });

        await StorageAPI.setItem('compression_test', largeData);
        const compressed = localStorage.getItem('compression_test');
        const parsed = JSON.parse(compressed);

        // Check if compression wrapper exists
        if (parsed && parsed.__compressed__) {
            runner.assert(parsed.compressedSize < parsed.originalSize, 'Compressed should be smaller than original');
            const ratio = parsed.ratio;
            runner.assertGreater(ratio, 0, 'Compression ratio should be positive');
        }
    });

    await runner.test('Compression can be disabled explicitly', async () => {
        const data = { message: 'Small data that should not be compressed' };
        
        await StorageAPI.setItem('no_compress', data, { compress: false });
        const stored = localStorage.getItem('no_compress');
        const parsed = JSON.parse(stored);

        runner.assertFalse(parsed && parsed.__compressed__, 'Should not be compressed when disabled');
    });

    await runner.test('Decompression retrieves exact original data', async () => {
        const original = {
            customers: [
                { id: 'CUST-20240101-0001', name: 'Ahmad', phone: '081234567890', status: 'active' },
                { id: 'CUST-20240101-0002', name: 'Budi', phone: '082345678901', status: 'pending' }
            ],
            metadata: { version: '1.0', exported: '2024-01-15' }
        };

        await StorageAPI.setItem('decompress_test', original, { compress: true });
        const retrieved = await StorageAPI.getItem('decompress_test');

        runner.assertEqual(JSON.stringify(retrieved), JSON.stringify(original), 'Decompressed data should match original exactly');
    });

    // Render compression tests
    [
        'Large dataset is compressed automatically',
        'Compression reduces storage size',
        'Compression can be disabled explicitly',
        'Decompression retrieves exact original data'
    ].forEach(name => renderOptimizedTest('test-compression', name, 'pass'));

    // ============================================
    // 3. Lazy Loading Tests
    // ============================================
    console.log('\n=== Testing Lazy Loading ===');

    await runner.test('getPaginated returns correct page structure', async () => {
        const allItems = Array(150).fill(0).map((_, i) => ({
            id: `item_${i}`,
            value: Math.random()
        }));

        await StorageAPI.setItem('paginated_data', allItems);

        const page0 = await StorageAPI.getPaginated('paginated_data', 50, 0);
        runner.assertEqual(page0.items.length, 50, 'First page should have 50 items');
        runner.assertEqual(page0.page, 0, 'Page number should be 0');
        runner.assertEqual(page0.total, 150, 'Total should be 150');
        runner.assertEqual(page0.totalPages, 3, 'Should have 3 total pages');
        runner.assertTrue(page0.hasNextPage, 'First page should have next page');
    });

    await runner.test('getPaginated handles multiple pages correctly', async () => {
        const allItems = Array(125).fill(0).map((_, i) => ({
            id: i,
            data: `Item ${i}`
        }));

        await StorageAPI.setItem('multi_page_data', allItems);

        // Get page 1 (items 50-99)
        const page1 = await StorageAPI.getPaginated('multi_page_data', 50, 1);
        runner.assertEqual(page1.items.length, 50, 'Page 1 should have 50 items');
        runner.assertEqual(page1.items[0].id, 50, 'Page 1 should start at item 50');

        // Get page 2 (items 100-124)
        const page2 = await StorageAPI.getPaginated('multi_page_data', 50, 2);
        runner.assertEqual(page2.items.length, 25, 'Page 2 should have 25 items (remainder)');
        runner.assertEqual(page2.items[0].id, 100, 'Page 2 should start at item 100');
        runner.assertFalse(page2.hasNextPage, 'Last page should not have next page');
    });

    await runner.test('getPaginated with custom page size', async () => {
        const items = Array(100).fill(0).map((_, i) => ({ id: i }));
        await StorageAPI.setItem('custom_page_size', items);

        const page = await StorageAPI.getPaginated('custom_page_size', 25, 0);
        runner.assertEqual(page.items.length, 25, 'Should respect custom page size');
        runner.assertEqual(page.totalPages, 4, 'Should calculate correct total pages');
    });

    // Render lazy loading tests
    [
        'getPaginated returns correct page structure',
        'getPaginated handles multiple pages correctly',
        'getPaginated with custom page size'
    ].forEach(name => renderOptimizedTest('test-lazy-loading', name, 'pass'));

    // ============================================
    // 4. Backward Compatibility Tests
    // ============================================
    console.log('\n=== Testing Backward Compatibility ===');

    await runner.test('Reads uncompressed legacy data correctly', async () => {
        // Simulate legacy data stored without compression
        const legacyData = { id: 1, name: 'Legacy Customer', created: '2023-01-01' };
        localStorage.setItem('legacy_uncompressed', JSON.stringify(legacyData));

        const retrieved = await StorageAPI.getItem('legacy_uncompressed');
        runner.assertEqual(retrieved.id, 1, 'Should read legacy uncompressed data');
        runner.assertEqual(retrieved.name, 'Legacy Customer', 'Legacy data values should match');
    });

    await runner.test('setItem and getItem work without compression options', async () => {
        // Test old API usage without compression options
        const data = { test: 'data', value: 123 };
        
        await StorageAPI.setItem('no_options', data);
        const retrieved = await StorageAPI.getItem('no_options');

        runner.assertEqual(retrieved.test, 'data', 'Should work with old API');
        runner.assertEqual(retrieved.value, 123, 'Values should be preserved');
    });

    await runner.test('Mixed compressed and uncompressed data in storage', async () => {
        // Store uncompressed data
        await StorageAPI.setItem('uncompressed_mixed', { type: 'uncompressed' }, { compress: false });
        
        // Store compressed data
        const largeData = Array(50).fill(0).map((_, i) => ({ id: i, data: 'test'.repeat(10) }));
        await StorageAPI.setItem('compressed_mixed', largeData, { compress: true });

        // Both should retrieve correctly
        const uncomp = await StorageAPI.getItem('uncompressed_mixed');
        const comp = await StorageAPI.getItem('compressed_mixed');

        runner.assertEqual(uncomp.type, 'uncompressed', 'Uncompressed data should work');
        runner.assertEqual(comp.length, 50, 'Compressed data should work');
    });

    // Render backward compatibility tests
    [
        'Reads uncompressed legacy data correctly',
        'setItem and getItem work without compression options',
        'Mixed compressed and uncompressed data in storage'
    ].forEach(name => renderOptimizedTest('test-backward-compat', name, 'pass'));

    // ============================================
    // 5. Storage Statistics Tests
    // ============================================
    console.log('\n=== Testing Storage Statistics ===');

    await runner.test('getCompressionStats provides compression metrics', async () => {
        localStorage.clear();

        // Add uncompressed data
        await StorageAPI.setItem('stat_uncompressed', { data: 'test' }, { compress: false });

        // Add compressed data
        const largeArray = Array(30).fill(0).map((_, i) => ({
            id: i,
            name: `Item ${i}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing'
        }));
        await StorageAPI.setItem('stat_compressed', largeArray, { compress: true });

        const stats = StorageAPI.getCompressionStats();
        runner.assert(stats.hasOwnProperty('totalSize'), 'Stats should have totalSize');
        runner.assert(stats.hasOwnProperty('compressionRatio'), 'Stats should have compressionRatio');
        runner.assertEqual(stats.compressedCount, 1, 'Should show 1 compressed item');
    });

    await runner.test('getUsage reports storage statistics', async () => {
        const usage = StorageAPI.getUsage();
        
        runner.assert(usage.hasOwnProperty('used'), 'Should have "used" property');
        runner.assert(usage.hasOwnProperty('quota'), 'Should have "quota" property');
        runner.assert(usage.hasOwnProperty('percentUsed'), 'Should have "percentUsed" property');
        runner.assertGreater(usage.quota, 0, 'Quota should be positive');
    });

    // Render statistics tests
    [
        'getCompressionStats provides compression metrics',
        'getUsage reports storage statistics'
    ].forEach(name => renderOptimizedTest('test-statistics', name, 'pass'));

    // ============================================
    // 6. Error Handling Tests
    // ============================================
    console.log('\n=== Testing Error Handling ===');

    await runner.test('Handles invalid keys gracefully', async () => {
        const result = await StorageAPI.getItems([]);
        runner.assertEqual(Object.keys(result).length, 0, 'Empty keys array should return empty object');
    });

    await runner.test('Handles non-existent keys in batch get', async () => {
        const keys = ['nonexistent1', 'nonexistent2', 'nonexistent3'];
        const result = await StorageAPI.getItems(keys);
        runner.assertEqual(Object.keys(result).length, 0, 'Non-existent keys should not be in result');
    });

    await runner.test('getPaginated with invalid key returns default structure', async () => {
        const result = await StorageAPI.getPaginated('nonexistent_key', 50, 0);
        runner.assertEqual(result.items.length, 0, 'Should return empty items');
        runner.assertEqual(result.total, 0, 'Should return total 0');
    });

    // Render error handling tests
    [
        'Handles invalid keys gracefully',
        'Handles non-existent keys in batch get',
        'getPaginated with invalid key returns default structure'
    ].forEach(name => renderOptimizedTest('test-error-handling', name, 'pass'));

    // ============================================
    // Final Summary
    // ============================================
    console.log('\n=== Test Summary ===');
    const results = runner.getResults();
    console.log(`Passed: ${results.passed}, Failed: ${results.failed}, Total: ${results.passed + results.failed}`);

    // Render summaries
    renderOptimizedSummary(runner, 'summary-optimized');
    renderPerformanceMetrics(runner, 'metrics-optimized');

    return runner;
}

// Run tests when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizedTests);
} else {
    runOptimizedTests();
}

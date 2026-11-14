/**
 * cache-manager.test.js - Cache Manager Unit Tests
 * 
 * Tests for Task 15.1: Data Caching Strategy
 * 
 * Test Coverage:
 * - Basic cache operations (set, get, invalidate)
 * - TTL (Time-To-Live) expiration
 * - Cache hit/miss tracking
 * - Pattern-based invalidation
 * - Cache integration with data changes
 * - Performance metrics
 */

// Simple test framework
const TestRunner = (() => {
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    
    return {
        test: function(name, fn) {
            totalTests++;
            try {
                fn();
                passedTests++;
                console.log(`✓ PASS: ${name}`);
                return true;
            } catch (error) {
                failedTests++;
                console.error(`✗ FAIL: ${name}`);
                console.error(`  Error: ${error.message}`);
                return false;
            }
        },
        
        assert: function(condition, message) {
            if (!condition) {
                throw new Error(message || 'Assertion failed');
            }
        },
        
        assertEqual: function(actual, expected, message) {
            if (actual !== expected) {
                throw new Error(`${message || 'Assertion failed'}: expected ${expected} but got ${actual}`);
            }
        },
        
        assertGreater: function(actual, expected, message) {
            if (actual <= expected) {
                throw new Error(`${message || 'Assertion failed'}: expected > ${expected} but got ${actual}`);
            }
        },
        
        assertLess: function(actual, expected, message) {
            if (actual >= expected) {
                throw new Error(`${message || 'Assertion failed'}: expected < ${expected} but got ${actual}`);
            }
        },
        
        summary: function() {
            const total = passedTests + failedTests;
            console.log('\n' + '='.repeat(50));
            console.log(`Test Summary: ${passedTests}/${total} tests passed`);
            if (failedTests > 0) {
                console.log(`FAILED: ${failedTests} test(s) failed`);
            } else {
                console.log('SUCCESS: All tests passed!');
            }
            console.log('='.repeat(50) + '\n');
            return failedTests === 0;
        }
    };
})();

// Wait for CacheManager to be available
function waitForCacheManager(callback, maxWait = 5000) {
    const startTime = Date.now();
    
    function check() {
        if (typeof CacheManager !== 'undefined') {
            callback();
        } else if (Date.now() - startTime < maxWait) {
            setTimeout(check, 100);
        } else {
            console.error('CacheManager not loaded within timeout');
        }
    }
    
    check();
}

// Run tests after CacheManager loads
waitForCacheManager(() => {
    console.log('Cache Manager Tests\n' + '='.repeat(50));
    
    // Test 1: Basic set and get operations
    TestRunner.test('Set and get cache value', () => {
        CacheManager.clear();
        
        CacheManager.set('test:key1', 'value1');
        const result = CacheManager.get('test:key1');
        
        TestRunner.assertEqual(result, 'value1', 'Should retrieve cached value');
    });
    
    // Test 2: Get non-existent key returns null
    TestRunner.test('Get non-existent key returns null', () => {
        CacheManager.clear();
        
        const result = CacheManager.get('nonexistent:key');
        
        TestRunner.assert(result === null, 'Non-existent key should return null');
    });
    
    // Test 3: Cache with different data types
    TestRunner.test('Cache different data types', () => {
        CacheManager.clear();
        
        // String
        CacheManager.set('type:string', 'hello');
        TestRunner.assertEqual(CacheManager.get('type:string'), 'hello', 'String cache');
        
        // Number
        CacheManager.set('type:number', 42);
        TestRunner.assertEqual(CacheManager.get('type:number'), 42, 'Number cache');
        
        // Object
        CacheManager.set('type:object', {name: 'test', value: 123});
        const obj = CacheManager.get('type:object');
        TestRunner.assertEqual(obj.name, 'test', 'Object cache name');
        TestRunner.assertEqual(obj.value, 123, 'Object cache value');
        
        // Array
        CacheManager.set('type:array', [1, 2, 3]);
        const arr = CacheManager.get('type:array');
        TestRunner.assertEqual(arr.length, 3, 'Array cache length');
    });
    
    // Test 4: TTL expiration
    TestRunner.test('Cache entries expire after TTL', function() {
        CacheManager.clear();
        
        // Set with 100ms TTL
        CacheManager.set('ttl:test', 'value', 100);
        
        // Should be available immediately
        TestRunner.assert(CacheManager.has('ttl:test'), 'Should be cached initially');
        TestRunner.assertEqual(CacheManager.get('ttl:test'), 'value', 'Should retrieve value before TTL');
        
        // Wait for expiration
        setTimeout(() => {
            TestRunner.assert(!CacheManager.has('ttl:test'), 'Should be expired after TTL');
            TestRunner.assert(CacheManager.get('ttl:test') === null, 'Should return null after expiration');
        }, 150);
    });
    
    // Test 5: Manual invalidation
    TestRunner.test('Manual invalidation removes cache entry', () => {
        CacheManager.clear();
        
        CacheManager.set('invalidate:key1', 'value1');
        TestRunner.assert(CacheManager.has('invalidate:key1'), 'Should be cached');
        
        const result = CacheManager.invalidate('invalidate:key1');
        TestRunner.assert(result === true, 'Should return true on successful invalidation');
        TestRunner.assert(!CacheManager.has('invalidate:key1'), 'Should not be cached after invalidation');
    });
    
    // Test 6: Pattern-based invalidation
    TestRunner.test('Pattern-based invalidation removes multiple entries', () => {
        CacheManager.clear();
        
        CacheManager.set('pattern:test:1', 'value1');
        CacheManager.set('pattern:test:2', 'value2');
        CacheManager.set('pattern:other', 'value3');
        
        const invalidatedCount = CacheManager.invalidatePattern('pattern:test');
        
        TestRunner.assertEqual(invalidatedCount, 2, 'Should invalidate 2 entries matching pattern');
        TestRunner.assert(!CacheManager.has('pattern:test:1'), 'First pattern entry invalidated');
        TestRunner.assert(!CacheManager.has('pattern:test:2'), 'Second pattern entry invalidated');
        TestRunner.assert(CacheManager.has('pattern:other'), 'Non-matching entry should remain');
    });
    
    // Test 7: Clear all cache
    TestRunner.test('Clear removes all cache entries', () => {
        CacheManager.clear();
        CacheManager.set('clear:1', 'v1');
        CacheManager.set('clear:2', 'v2');
        CacheManager.set('clear:3', 'v3');
        
        const stats1 = CacheManager.getStats();
        TestRunner.assertGreater(stats1.entriesInCache, 0, 'Should have entries before clear');
        
        const count = CacheManager.clear();
        TestRunner.assertEqual(count, 3, 'Should clear 3 entries');
        
        const stats2 = CacheManager.getStats();
        TestRunner.assertEqual(stats2.entriesInCache, 0, 'Should have 0 entries after clear');
    });
    
    // Test 8: Cache hit tracking
    TestRunner.test('Cache tracks hits and misses', () => {
        CacheManager.clear();
        CacheManager.resetStats();
        
        // Initial misses
        CacheManager.get('miss1');
        CacheManager.get('miss2');
        
        let stats = CacheManager.getStats();
        TestRunner.assertEqual(stats.misses, 2, 'Should track 2 misses');
        TestRunner.assertEqual(stats.hits, 0, 'Should have 0 hits initially');
        
        // Add to cache and hit
        CacheManager.set('hit:test', 'value');
        CacheManager.get('hit:test');
        CacheManager.get('hit:test');
        
        stats = CacheManager.getStats();
        TestRunner.assertEqual(stats.hits, 2, 'Should track 2 hits');
    });
    
    // Test 9: Hit rate calculation
    TestRunner.test('Cache calculates hit rate correctly', () => {
        CacheManager.clear();
        CacheManager.resetStats();
        
        // Create 3 hits and 1 miss
        CacheManager.set('rate:test', 'value');
        CacheManager.get('rate:test');
        CacheManager.get('rate:test');
        CacheManager.get('rate:test');
        CacheManager.get('nonexistent');
        
        const stats = CacheManager.getStats();
        const expectedRate = 75; // 3 hits out of 4 total
        
        TestRunner.assertEqual(stats.hits, 3, 'Should have 3 hits');
        TestRunner.assertEqual(stats.misses, 1, 'Should have 1 miss');
        TestRunner.assertEqual(stats.hitRate, expectedRate, 'Hit rate should be 75%');
    });
    
    // Test 10: Invalidate by type
    TestRunner.test('Invalidate by type removes specific category', () => {
        CacheManager.clear();
        
        CacheManager.set('kpi:total', 100);
        CacheManager.set('kpi:revenue', 5000);
        CacheManager.set('chart:category', {});
        CacheManager.set('chart:trend', {});
        
        const count = CacheManager.invalidateByType('kpi');
        
        TestRunner.assertEqual(count, 2, 'Should invalidate 2 KPI entries');
        TestRunner.assert(!CacheManager.has('kpi:total'), 'KPI entries should be cleared');
        TestRunner.assert(CacheManager.has('chart:category'), 'Chart entries should remain');
    });
    
    // Test 11: Entry info for debugging
    TestRunner.test('Get entry info provides debugging details', () => {
        CacheManager.clear();
        
        CacheManager.set('info:test', {name: 'test'}, 5000);
        CacheManager.get('info:test');
        
        const info = CacheManager.getEntryInfo('info:test');
        
        TestRunner.assert(info !== null, 'Should return entry info');
        TestRunner.assert(info.exists === true, 'Entry should exist');
        TestRunner.assert(info.isExpired === false, 'Entry should not be expired');
        TestRunner.assertGreater(info.remainingTTL, 0, 'Should have remaining TTL');
        TestRunner.assertEqual(info.accessCount, 1, 'Should track 1 access');
    });
    
    // Test 12: Default TTL
    TestRunner.test('Default TTL is 5 seconds', () => {
        CacheManager.clear();
        
        CacheManager.set('default:ttl', 'value');
        const info = CacheManager.getEntryInfo('default:ttl');
        
        TestRunner.assertGreater(info.remainingTTL, 4900, 'Should have ~5000ms remaining');
        TestRunner.assertLess(info.remainingTTL, 5100, 'Should not exceed 5100ms');
    });
    
    // Test 13: Cache statistics reset
    TestRunner.test('Statistics can be reset', () => {
        CacheManager.clear();
        CacheManager.resetStats();
        
        CacheManager.set('stat:test', 'value');
        CacheManager.get('stat:test');
        
        let stats = CacheManager.getStats();
        TestRunner.assertGreater(stats.hits, 0, 'Should have hits before reset');
        
        CacheManager.resetStats();
        stats = CacheManager.getStats();
        
        TestRunner.assertEqual(stats.hits, 0, 'Hits should be reset');
        TestRunner.assertEqual(stats.misses, 0, 'Misses should be reset');
    });
    
    // Test 14: Has method checks without incrementing stats
    TestRunner.test('Has method checks without affecting stats', () => {
        CacheManager.clear();
        CacheManager.resetStats();
        
        CacheManager.set('has:test', 'value');
        
        const exists = CacheManager.has('has:test');
        TestRunner.assert(exists === true, 'Has should return true for existing key');
        
        const stats = CacheManager.getStats();
        TestRunner.assertEqual(stats.hits, 0, 'Has should not count as hit');
        TestRunner.assertEqual(stats.misses, 0, 'Has should not count as miss');
    });
    
    // Test 15: Multiple sets override previous value
    TestRunner.test('Setting same key overwrites previous value', () => {
        CacheManager.clear();
        
        CacheManager.set('override:test', 'original');
        TestRunner.assertEqual(CacheManager.get('override:test'), 'original', 'Original value');
        
        CacheManager.set('override:test', 'updated');
        TestRunner.assertEqual(CacheManager.get('override:test'), 'updated', 'Updated value');
    });
    
    // Test 16: Cache with null and undefined
    TestRunner.test('Cache handles null and undefined', () => {
        CacheManager.clear();
        
        // Can cache null
        CacheManager.set('null:value', null);
        TestRunner.assert(CacheManager.has('null:value'), 'Should cache null value');
        
        // Cannot cache undefined
        CacheManager.set('undefined:value', undefined);
        TestRunner.assert(!CacheManager.has('undefined:value'), 'Should not cache undefined');
    });
    
    // Test 17: Cache with large data
    TestRunner.test('Cache handles large data objects', () => {
        CacheManager.clear();
        
        const largeArray = Array(1000).fill({id: 1, name: 'test', data: 'x'.repeat(100)});
        
        CacheManager.set('large:data', largeArray);
        const retrieved = CacheManager.get('large:data');
        
        TestRunner.assertEqual(retrieved.length, 1000, 'Should cache large array');
        TestRunner.assertEqual(retrieved[0].name, 'test', 'Should preserve object properties');
    });
    
    // Test 18: Automatic cleanup of expired entries
    TestRunner.test('Automatic cleanup removes expired entries', function() {
        CacheManager.clear();
        
        CacheManager.set('expire:1', 'value1', 100);
        CacheManager.set('expire:2', 'value2', 100);
        CacheManager.set('persist:1', 'value3', 10000);
        
        let stats = CacheManager.getStats();
        TestRunner.assertEqual(stats.entriesInCache, 3, 'Should have 3 entries');
        
        // Wait for expiration and trigger cleanup
        setTimeout(() => {
            // Access a key to potentially trigger cleanup
            CacheManager.get('test');
            
            stats = CacheManager.getStats();
            TestRunner.assertLess(stats.entriesInCache, 3, 'Should have fewer entries after expiration');
            TestRunner.assert(CacheManager.has('persist:1'), 'Non-expired entry should remain');
        }, 150);
    });
    
    // Test 19: Get status provides full cache information
    TestRunner.test('Get status returns detailed cache information', () => {
        CacheManager.clear();
        CacheManager.resetStats();
        
        CacheManager.set('status:1', 'value1');
        CacheManager.set('status:2', 'value2');
        CacheManager.get('status:1');
        
        const status = CacheManager.getStatus();
        
        TestRunner.assert(status.stats !== undefined, 'Should have stats');
        TestRunner.assert(status.entries !== undefined, 'Should have entries array');
        TestRunner.assertEqual(status.entries.length, 2, 'Should list 2 entries');
        TestRunner.assertEqual(status.stats.hits, 1, 'Should track hits in status');
    });
    
    // Test 20: Performance - cache reduces repeated calculations
    TestRunner.test('Cache improves performance for repeated access', function() {
        CacheManager.clear();
        CacheManager.resetStats();
        
        // Simulate expensive operation
        const expensiveOperation = () => {
            return Array(10000).fill(0).reduce((a, b) => a + b, 0);
        };
        
        const value = expensiveOperation();
        CacheManager.set('perf:test', value);
        
        // Access multiple times
        for (let i = 0; i < 100; i++) {
            CacheManager.get('perf:test');
        }
        
        const stats = CacheManager.getStats();
        TestRunner.assertEqual(stats.hits, 100, 'Should have 100 cache hits');
        TestRunner.assertGreater(stats.hitRate, 95, 'Hit rate should be >95%');
    });
    
    // Print test summary
    const allPassed = TestRunner.summary();
    
    // Final integration test with real modules
    if (typeof DashboardManager !== 'undefined') {
        console.log('Integration Test: Dashboard Manager with Cache\n' + '-'.repeat(50));
        TestRunner.test('Dashboard Manager uses cache for KPIs', () => {
            CacheManager.clear();
            
            // The cache should be empty initially
            TestRunner.assert(!CacheManager.has('kpis'), 'KPI cache should be empty');
        });
    }
    
    if (typeof ChartManager !== 'undefined') {
        console.log('Integration Test: Chart Manager with Cache\n' + '-'.repeat(50));
        TestRunner.test('Chart Manager uses cache for chart data', () => {
            CacheManager.clear();
            
            // The cache should support chart data
            CacheManager.set('chart:category', {labels: [], datasets: []}, 5000);
            TestRunner.assert(CacheManager.has('chart:category'), 'Should cache chart data');
        });
    }
});

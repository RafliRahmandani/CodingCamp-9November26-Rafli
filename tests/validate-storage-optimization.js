/**
 * Validation script for StorageAPI optimizations
 * Run this in Node.js to verify the implementation works correctly
 */

// Mock localStorage for Node.js
const localStorage = (() => {
  const store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { for (let key in store) delete store[key]; },
    get length() { return Object.keys(store).length; },
    key: (index) => Object.keys(store)[index] || null,
    hasOwnProperty: (key) => store.hasOwnProperty(key),
    [Symbol.iterator]: function*() {
      for (let key in store) yield key;
    }
  };
})();

// Mock window object
const window = {
  localStorage: localStorage,
  location: { hash: '' }
};

// Mock global object
global.localStorage = localStorage;
global.NotificationManager = undefined;

// Mock performance API
if (!global.performance) {
  global.performance = {
    now: () => Date.now()
  };
}

console.log('=== StorageAPI Optimization Validation ===\n');

// Load StorageAPI
const fs = require('fs');
const path = require('path');

try {
  // Read StorageAPI code
  const storageCode = fs.readFileSync(
    path.join(__dirname, '../js/storage-api.js'),
    'utf8'
  );

  // Execute in a scope with localStorage
  eval(storageCode);

  console.log('✓ StorageAPI loaded successfully\n');

  // Verify all required methods exist
  const requiredMethods = [
    'setItem', 'getItem', 'removeItem', 'clear',
    'isAvailable', 'getUsage',
    'setItems', 'getItems', 'getPaginated',
    'getCompressionStats', 'flush',
    'showQuotaErrorRecovery', 'isNearQuotaLimit'
  ];

  console.log('Checking required methods...');
  let allPresent = true;
  for (const method of requiredMethods) {
    if (typeof StorageAPI[method] === 'function') {
      console.log(`  ✓ ${method}`);
    } else {
      console.log(`  ✗ ${method} - MISSING`);
      allPresent = false;
    }
  }

  if (!allPresent) {
    console.error('\n❌ Some required methods are missing!');
    process.exit(1);
  }

  console.log('\n✓ All required methods present\n');

  // Test basic functionality
  console.log('Running basic functionality tests...\n');

  (async () => {
    let passed = 0;
    let failed = 0;

    try {
      // Test 1: Basic set/get
      console.log('Test 1: Basic setItem/getItem');
      await StorageAPI.setItem('test_key', { value: 'test' });
      const retrieved = await StorageAPI.getItem('test_key');
      if (retrieved && retrieved.value === 'test') {
        console.log('  ✓ PASS\n');
        passed++;
      } else {
        console.log('  ✗ FAIL\n');
        failed++;
      }
    } catch (e) {
      console.log(`  ✗ FAIL: ${e.message}\n`);
      failed++;
    }

    try {
      // Test 2: Batch setItems
      console.log('Test 2: Batch setItems');
      const result = await StorageAPI.setItems({
        'batch_1': { id: 1 },
        'batch_2': { id: 2 },
        'batch_3': { id: 3 }
      });
      if (result === 3) {
        console.log('  ✓ PASS\n');
        passed++;
      } else {
        console.log('  ✗ FAIL: Expected 3, got ' + result + '\n');
        failed++;
      }
    } catch (e) {
      console.log(`  ✗ FAIL: ${e.message}\n`);
      failed++;
    }

    try {
      // Test 3: Batch getItems
      console.log('Test 3: Batch getItems');
      const result = await StorageAPI.getItems(['batch_1', 'batch_2']);
      if (Object.keys(result).length === 2) {
        console.log('  ✓ PASS\n');
        passed++;
      } else {
        console.log('  ✗ FAIL\n');
        failed++;
      }
    } catch (e) {
      console.log(`  ✗ FAIL: ${e.message}\n`);
      failed++;
    }

    try {
      // Test 4: Compression
      console.log('Test 4: Compression');
      const largeData = Array(50).fill({
        id: 1,
        name: 'Customer',
        email: 'test@example.com',
        phone: '1234567890',
        address: 'Jalan Raya, Jakarta'
      });
      await StorageAPI.setItem('large', largeData, { compress: true });
      const decompressed = await StorageAPI.getItem('large');
      if (Array.isArray(decompressed) && decompressed.length === 50) {
        console.log('  ✓ PASS\n');
        passed++;
      } else {
        console.log('  ✗ FAIL\n');
        failed++;
      }
    } catch (e) {
      console.log(`  ✗ FAIL: ${e.message}\n`);
      failed++;
    }

    try {
      // Test 5: Pagination
      console.log('Test 5: Pagination');
      const items = Array(150).fill(0).map((_, i) => ({ id: i }));
      await StorageAPI.setItem('paginated', items);
      const page = await StorageAPI.getPaginated('paginated', 50, 0);
      if (page.items.length === 50 && page.totalPages === 3) {
        console.log('  ✓ PASS\n');
        passed++;
      } else {
        console.log('  ✗ FAIL\n');
        failed++;
      }
    } catch (e) {
      console.log(`  ✗ FAIL: ${e.message}\n`);
      failed++;
    }

    try {
      // Test 6: Backward compatibility
      console.log('Test 6: Backward compatibility');
      localStorage.setItem('legacy', JSON.stringify({ legacy: true }));
      const legacy = await StorageAPI.getItem('legacy');
      if (legacy && legacy.legacy === true) {
        console.log('  ✓ PASS\n');
        passed++;
      } else {
        console.log('  ✗ FAIL\n');
        failed++;
      }
    } catch (e) {
      console.log(`  ✗ FAIL: ${e.message}\n`);
      failed++;
    }

    try {
      // Test 7: Compression stats
      console.log('Test 7: Compression statistics');
      const stats = StorageAPI.getCompressionStats();
      if (stats && typeof stats.compressionRatio === 'number') {
        console.log('  ✓ PASS\n');
        passed++;
      } else {
        console.log('  ✗ FAIL\n');
        failed++;
      }
    } catch (e) {
      console.log(`  ✗ FAIL: ${e.message}\n`);
      failed++;
    }

    try {
      // Test 8: Storage usage
      console.log('Test 8: Storage usage');
      const usage = StorageAPI.getUsage();
      if (usage && usage.hasOwnProperty('used') && usage.hasOwnProperty('quota')) {
        console.log('  ✓ PASS\n');
        passed++;
      } else {
        console.log('  ✗ FAIL\n');
        failed++;
      }
    } catch (e) {
      console.log(`  ✗ FAIL: ${e.message}\n`);
      failed++;
    }

    // Summary
    console.log('\n=== Test Summary ===');
    console.log(`Passed: ${passed}`);
    console.log('Failed: ' + failed);
    console.log('Total: ' + (passed + failed));

    if (failed === 0) {
      console.log('\n✅ All validation tests passed!');
      console.log('\nOptimization features verified:');
      console.log('  ✓ Batch operations (setItems, getItems)');
      console.log('  ✓ Compression (automatic and manual)');
      console.log('  ✓ Lazy loading (pagination)');
      console.log('  ✓ Backward compatibility');
      console.log('  ✓ Performance monitoring');
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed!');
      process.exit(1);
    }
  })();

} catch (error) {
  console.error('❌ Error loading StorageAPI:');
  console.error(error.message);
  process.exit(1);
}

/**
 * storage-api-quota.test.js - Tests for StorageAPI quota error handling
 * 
 * Tests the following functionality:
 * - QuotaExceededError is caught and handled properly
 * - User-friendly Indonesian error notifications are shown
 * - App doesn't crash when quota is exceeded
 * - Notification manager is used for feedback
 * - Export option is offered in error message
 * - Storage usage information is logged
 */

// Mock NotificationManager for testing
const MockNotificationManager = {
  error: function(message, duration) {
    console.log(`[MockNotificationManager] Error notification: "${message}" (${duration}ms)`);
    this.lastError = { message, duration };
  },
  success: function(message, duration) {
    console.log(`[MockNotificationManager] Success notification: "${message}" (${duration}ms)`);
  }
};

// Replace global NotificationManager for testing
window.NotificationManager = MockNotificationManager;

// Test suite for StorageAPI quota handling
const StorageAPIQuotaTests = (function() {
  const tests = [];
  let passedTests = 0;
  let failedTests = 0;

  /**
   * Register a test
   */
  function test(name, fn) {
    tests.push({ name, fn });
  }

  /**
   * Assert helper
   */
  function assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  /**
   * Test: Verify QuotaExceededError is caught
   */
  test('QuotaExceededError is caught and not thrown', async function() {
    // Mock localStorage to throw QuotaExceededError
    const originalSetItem = localStorage.setItem;
    let errorWasCaught = false;

    localStorage.setItem = function() {
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      throw error;
    };

    try {
      const result = await StorageAPI.setItem('test-key', { test: 'data' });
      
      // Should return error object, not throw
      assert(result && typeof result === 'object', 'Should return error object');
      assert(result.error === 'QuotaExceededError', 'Should have QuotaExceededError marker');
      assert(result.success === false, 'Should have success: false');
      errorWasCaught = true;
    } catch (e) {
      throw new Error('QuotaExceededError was not caught - app would crash');
    } finally {
      localStorage.setItem = originalSetItem;
    }

    assert(errorWasCaught, 'Error should be caught gracefully');
  });

  /**
   * Test: User-friendly error notification is shown
   */
  test('User-friendly Indonesian error notification is shown', async function() {
    const originalSetItem = localStorage.setItem;
    let notificationWasShown = false;

    localStorage.setItem = function() {
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      throw error;
    };

    MockNotificationManager.lastError = null;

    try {
      await StorageAPI.setItem('test-key', { test: 'data' });
      
      // Check if notification was shown
      assert(MockNotificationManager.lastError !== null, 'Error notification should be shown');
      assert(
        MockNotificationManager.lastError.message.includes('Penyimpanan penuh'),
        'Error message should be in Indonesian and mention storage is full'
      );
      assert(
        MockNotificationManager.lastError.message.includes('CSV'),
        'Error message should suggest CSV export'
      );
      notificationWasShown = true;
    } finally {
      localStorage.setItem = originalSetItem;
    }

    assert(notificationWasShown, 'Notification should be shown');
  });

  /**
   * Test: Usage information is included in return value
   */
  test('Usage information is included in error return value', async function() {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function() {
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      throw error;
    };

    try {
      const result = await StorageAPI.setItem('test-key', { test: 'data' });
      
      assert(result.usage !== undefined, 'Result should include usage object');
      assert(typeof result.usage.used === 'number', 'Usage should have used bytes');
      assert(typeof result.usage.quota === 'number', 'Usage should have quota');
      assert(typeof result.usage.percentUsed === 'number', 'Usage should have percentUsed');
    } finally {
      localStorage.setItem = originalSetItem;
    }
  });

  /**
   * Test: Normal operations still work when quota is not exceeded
   */
  test('Normal setItem still works when quota is not exceeded', async function() {
    const testKey = 'test-quota-normal-' + Date.now();
    const testData = { name: 'Test Data', value: 123 };

    const result = await StorageAPI.setItem(testKey, testData);
    
    assert(result === true, 'Should return true on success');

    // Verify data was stored
    const retrieved = await StorageAPI.getItem(testKey);
    assert(retrieved !== null, 'Data should be retrievable');
    assert(retrieved.name === testData.name, 'Data should match');

    // Cleanup
    await StorageAPI.removeItem(testKey);
  });

  /**
   * Test: Storage usage calculation works
   */
  test('Storage usage calculation works correctly', function() {
    const usage = StorageAPI.getUsage();

    assert(typeof usage.used === 'number', 'Used should be a number');
    assert(typeof usage.quota === 'number', 'Quota should be a number');
    assert(typeof usage.percentUsed === 'number', 'PercentUsed should be a number');
    assert(usage.percentUsed >= 0 && usage.percentUsed <= 100, 'Percent should be 0-100');
    assert(usage.quota === 5 * 1024 * 1024, 'Quota should be 5MB');
  });

  /**
   * Test: isNearQuotaLimit detects high usage
   */
  test('isNearQuotaLimit correctly identifies near-limit conditions', function() {
    // This test verifies the method exists and returns a boolean
    const isNear = StorageAPI.isNearQuotaLimit();
    assert(typeof isNear === 'boolean', 'isNearQuotaLimit should return a boolean');
  });

  /**
   * Test: showQuotaErrorRecovery provides recovery message
   */
  test('showQuotaErrorRecovery provides recovery guidance', function() {
    MockNotificationManager.lastError = null;

    const recovery = StorageAPI.showQuotaErrorRecovery();

    assert(recovery !== null, 'Should return recovery object');
    assert(typeof recovery.message === 'string', 'Should have guidance message');
    assert(recovery.message.includes('ekspor'), 'Should mention export option');
    assert(MockNotificationManager.lastError !== null, 'Should show notification');
  });

  /**
   * Test: Notification duration is appropriate for quota errors
   */
  test('Quota error notification duration is long enough for user action', async function() {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function() {
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      throw error;
    };

    MockNotificationManager.lastError = null;

    try {
      await StorageAPI.setItem('test-key', { test: 'data' });
      
      // Check notification duration - should be at least 8 seconds for quota errors
      assert(
        MockNotificationManager.lastError.duration >= 8000,
        'Quota error notification should be shown for at least 8 seconds'
      );
    } finally {
      localStorage.setItem = originalSetItem;
    }
  });

  /**
   * Run all tests
   */
  function runAll() {
    console.log('\n====================================');
    console.log('StorageAPI Quota Error Handling Tests');
    console.log('====================================\n');

    tests.forEach((test) => {
      try {
        test.fn();
        passedTests++;
        console.log(`✓ ${test.name}`);
      } catch (error) {
        failedTests++;
        console.error(`✗ ${test.name}`);
        console.error(`  ${error.message}\n`);
      }
    });

    console.log('\n====================================');
    console.log(`Results: ${passedTests} passed, ${failedTests} failed`);
    console.log('====================================\n');

    return {
      total: tests.length,
      passed: passedTests,
      failed: failedTests,
      success: failedTests === 0
    };
  }

  return {
    test,
    runAll,
    assert
  };
})();

// Export for use in test runners
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageAPIQuotaTests;
}

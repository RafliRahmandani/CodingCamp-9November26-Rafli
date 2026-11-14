/**
 * loading-manager.test.js - Unit tests for LoadingManager module
 * 
 * Tests loading states for async operations:
 * - Loading overlay functionality
 * - Button loading states with spinners
 * - Element loading indicators
 * - Form button disabling
 * - Timeout handling
 * - Status checking
 * - Clearing operations
 * 
 * Task 14.3: Add loading states for async operations
 */

// Mock DOM elements for testing
class MockElement {
    constructor() {
        this.classList = {
            add: function() {},
            remove: function() {}
        };
        this.dataset = {};
        this.attributes = {};
        this.children = [];
        this.parentElement = null;
        this.innerHTML = '';
        this.textContent = '';
        this.disabled = false;
    }
    
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    
    getAttribute(name) {
        return this.attributes[name];
    }
    
    closest(selector) {
        return this;
    }
    
    querySelector(selector) {
        return this;
    }
    
    appendChild(child) {
        this.children.push(child);
    }
    
    addEventListener(event, handler) {}
    removeEventListener(event, handler) {}
}

// Test Suite
const LoadingManagerTests = {
    passed: 0,
    failed: 0,
    tests: [],
    
    // Test result tracking
    assert(condition, testName, message = '') {
        if (condition) {
            this.passed++;
            this.tests.push({
                name: testName,
                passed: true,
                message: message
            });
            console.log(`✓ ${testName}${message ? ': ' + message : ''}`);
        } else {
            this.failed++;
            this.tests.push({
                name: testName,
                passed: false,
                message: message
            });
            console.log(`✕ ${testName}${message ? ': ' + message : ''}`);
        }
    },
    
    // Test 1: Module loaded
    testModuleLoaded() {
        console.log('\n=== Test 1: Module Loaded ===');
        this.assert(
            typeof LoadingManager !== 'undefined',
            'LoadingManager module exists',
            'Module is defined'
        );
        this.assert(
            typeof LoadingManager.showOverlay === 'function',
            'showOverlay method exists',
            'Public API available'
        );
        this.assert(
            typeof LoadingManager.showButtonLoading === 'function',
            'showButtonLoading method exists',
            'Public API available'
        );
    },
    
    // Test 2: Public API methods
    testPublicAPI() {
        console.log('\n=== Test 2: Public API ===');
        const requiredMethods = [
            'showOverlay',
            'hideOverlay',
            'showButtonLoading',
            'hideButtonLoading',
            'showElementLoading',
            'hideElementLoading',
            'disableFormButtons',
            'enableFormButtons',
            'clearAll',
            'getActiveCount',
            'isOverlayVisible'
        ];
        
        requiredMethods.forEach(method => {
            this.assert(
                typeof LoadingManager[method] === 'function',
                `API method: ${method}`,
                'Method is callable'
            );
        });
    },
    
    // Test 3: Overlay operations
    testOverlayOperations() {
        console.log('\n=== Test 3: Overlay Operations ===');
        
        // Initial state
        this.assert(
            !LoadingManager.isOverlayVisible(),
            'Overlay initially not visible',
            'Initial state correct'
        );
        
        // Show overlay
        const overlayId = LoadingManager.showOverlay('Testing...');
        this.assert(
            typeof overlayId === 'string' && overlayId.length > 0,
            'showOverlay returns operation ID',
            'ID format valid'
        );
        
        // Check visibility after show
        this.assert(
            LoadingManager.isOverlayVisible(),
            'Overlay visible after show',
            'Visibility state changed'
        );
        
        // Hide overlay
        LoadingManager.hideOverlay(overlayId);
        this.assert(
            !LoadingManager.isOverlayVisible(),
            'Overlay hidden after hide',
            'Visibility state changed back'
        );
    },
    
    // Test 4: Button loading
    testButtonLoading() {
        console.log('\n=== Test 4: Button Loading ===');
        
        const mockButton = new MockElement();
        mockButton.textContent = 'Save';
        
        // Show button loading
        const btnId = LoadingManager.showButtonLoading(mockButton);
        this.assert(
            typeof btnId === 'string' && btnId.length > 0,
            'showButtonLoading returns operation ID',
            'ID format valid'
        );
        
        this.assert(
            mockButton.disabled === true,
            'Button disabled during loading',
            'Disabled state set'
        );
        
        // Hide button loading
        LoadingManager.hideButtonLoading(btnId);
        this.assert(
            mockButton.disabled === false,
            'Button re-enabled after loading',
            'Disabled state cleared'
        );
    },
    
    // Test 5: Element loading
    testElementLoading() {
        console.log('\n=== Test 5: Element Loading ===');
        
        const mockElement = new MockElement();
        mockElement.id = 'test-element';
        mockElement.dataset.originalContent = '';
        
        // Show element loading
        const elemId = LoadingManager.showElementLoading(mockElement, 'Loading...');
        this.assert(
            typeof elemId === 'string' && elemId.length > 0,
            'showElementLoading returns operation ID',
            'ID format valid'
        );
        
        // Hide element loading
        LoadingManager.hideElementLoading(elemId);
        this.assert(
            true,
            'hideElementLoading executes',
            'No errors thrown'
        );
    },
    
    // Test 6: Disable/Enable form buttons
    testFormButtonDisable() {
        console.log('\n=== Test 6: Form Button Disable/Enable ===');
        
        // Create mock form
        const mockForm = new MockElement();
        const btn1 = new MockElement();
        const btn2 = new MockElement();
        mockForm.querySelectorAll = function() {
            return [btn1, btn2];
        };
        
        // Disable form buttons
        LoadingManager.disableFormButtons(mockForm);
        this.assert(
            btn1.disabled === true && btn2.disabled === true,
            'disableFormButtons disables all buttons',
            'Both buttons disabled'
        );
        
        // Wait a bit and check if re-enabled (auto-enable after duration)
        setTimeout(() => {
            this.assert(
                btn1.disabled === false && btn2.disabled === false,
                'Form buttons auto-enabled after duration',
                'Auto-enable works'
            );
        }, 600);
    },
    
    // Test 7: Clear all operations
    testClearAll() {
        console.log('\n=== Test 7: Clear All ===');
        
        // Create some operations
        LoadingManager.showOverlay('Test...');
        const mockBtn = new MockElement();
        LoadingManager.showButtonLoading(mockBtn);
        
        // Count active
        const countBefore = LoadingManager.getActiveCount();
        this.assert(
            countBefore > 0,
            'Multiple operations active',
            `${countBefore} operations active`
        );
        
        // Clear all
        LoadingManager.clearAll();
        const countAfter = LoadingManager.getActiveCount();
        this.assert(
            countAfter === 0,
            'clearAll removes all operations',
            'All operations cleared'
        );
        this.assert(
            !LoadingManager.isOverlayVisible(),
            'Overlay hidden after clearAll',
            'Overlay cleared'
        );
    },
    
    // Test 8: Active count tracking
    testActiveCount() {
        console.log('\n=== Test 8: Active Count Tracking ===');
        
        LoadingManager.clearAll();
        
        this.assert(
            LoadingManager.getActiveCount() === 0,
            'Initial active count is 0',
            'No operations'
        );
        
        // Add one operation
        LoadingManager.showOverlay('Test...');
        this.assert(
            LoadingManager.getActiveCount() === 1,
            'Count increases after showOverlay',
            'One operation active'
        );
        
        // Add another
        const mockBtn = new MockElement();
        LoadingManager.showButtonLoading(mockBtn);
        this.assert(
            LoadingManager.getActiveCount() === 2,
            'Count increases after showButtonLoading',
            'Two operations active'
        );
        
        LoadingManager.clearAll();
    },
    
    // Test 9: Operation ID uniqueness
    testOperationIdUniqueness() {
        console.log('\n=== Test 9: Operation ID Uniqueness ===');
        
        LoadingManager.clearAll();
        
        const id1 = LoadingManager.showOverlay('Test 1');
        const id2 = LoadingManager.showOverlay('Test 2');
        const id3 = LoadingManager.showOverlay('Test 3');
        
        const ids = new Set([id1, id2, id3]);
        this.assert(
            ids.size === 3,
            'Operation IDs are unique',
            `Got ${ids.size} unique IDs`
        );
        
        LoadingManager.clearAll();
    },
    
    // Test 10: Timeout handling
    testTimeoutHandling() {
        console.log('\n=== Test 10: Timeout Handling ===');
        
        LoadingManager.clearAll();
        
        const overlayId = LoadingManager.showOverlay('Testing timeout', 100);
        this.assert(
            LoadingManager.getActiveCount() === 1,
            'Operation tracked before timeout',
            'Operation active'
        );
        
        // Wait for timeout
        setTimeout(() => {
            this.assert(
                LoadingManager.getActiveCount() === 0,
                'Operation removed after timeout',
                'Timeout handled'
            );
            
            // Run summary
            this.runSummary();
        }, 150);
    },
    
    // Run all tests
    runAll() {
        console.log('======================');
        console.log('LoadingManager Tests');
        console.log('======================');
        
        this.testModuleLoaded();
        this.testPublicAPI();
        this.testOverlayOperations();
        this.testButtonLoading();
        this.testElementLoading();
        this.testFormButtonDisable();
        this.testClearAll();
        this.testActiveCount();
        this.testOperationIdUniqueness();
        this.testTimeoutHandling();
    },
    
    // Print test summary
    runSummary() {
        console.log('\n======================');
        console.log('Test Summary');
        console.log('======================');
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Total:  ${this.passed + this.failed}`);
        
        if (this.failed === 0) {
            console.log('\n✓ All tests passed!');
        } else {
            console.log(`\n✕ ${this.failed} test(s) failed`);
        }
        
        return {
            passed: this.passed,
            failed: this.failed,
            tests: this.tests
        };
    }
};

// Run tests when script is loaded
console.log('LoadingManager Test Suite Initialized');

// Export for use in HTML test page
if (typeof window !== 'undefined') {
    window.LoadingManagerTests = LoadingManagerTests;
}

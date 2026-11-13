/**
 * Test runner for AuthManager module
 * Run with: node tests/run-auth-manager-tests.js
 */

const fs = require('fs');
const path = require('path');

// Mock sessionStorage for Node.js environment
const sessionStorage = {
    data: {},
    setItem: function(key, value) {
        this.data[key] = value;
    },
    getItem: function(key) {
        return this.data[key] || null;
    },
    removeItem: function(key) {
        delete this.data[key];
    },
    clear: function() {
        this.data = {};
    }
};

// Make sessionStorage global
global.sessionStorage = sessionStorage;

// Load AuthManager module
const authManagerPath = path.join(__dirname, '../js/auth-manager.js');
const authManagerCode = fs.readFileSync(authManagerPath, 'utf8');
eval(authManagerCode);

// Test results tracker
const TestResults = {
    passed: 0,
    failed: 0,
    tests: []
};

/**
 * Helper: Assert function
 */
function assert(condition, testName, message) {
    if (condition) {
        TestResults.passed++;
        TestResults.tests.push({ 
            name: testName, 
            status: 'PASSED',
            message: ''
        });
        console.log(`✓ PASSED: ${testName}`);
    } else {
        TestResults.failed++;
        TestResults.tests.push({ 
            name: testName, 
            status: 'FAILED',
            message: message
        });
        console.error(`✗ FAILED: ${testName}`);
        console.error(`  ${message}`);
    }
}

/**
 * Helper: Assert equal
 */
function assertEqual(actual, expected, testName) {
    const passed = JSON.stringify(actual) === JSON.stringify(expected);
    assert(passed, testName, `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

/**
 * Helper: Assert null
 */
function assertNull(value, testName) {
    assert(value === null, testName, `Expected null, got ${JSON.stringify(value)}`);
}

/**
 * Helper: Assert not null
 */
function assertNotNull(value, testName) {
    assert(value !== null, testName, `Expected not null, got ${value}`);
}

/**
 * Test Suite: AuthManager Module
 */
console.log('=== AuthManager Module Tests ===\n');

// Cleanup before tests
sessionStorage.clear();

// TEST 1: Valid admin login
console.log('TEST 1: Valid admin login');
const adminSession = AuthManager.login('admin', '123456');
assertNotNull(adminSession, 'Admin login returns session object');
assertEqual(adminSession.username, 'admin', 'Session contains correct username');
assertEqual(adminSession.role, 'admin', 'Session contains correct role');
assertEqual(adminSession.displayName, 'Administrator', 'Session contains correct displayName');
console.log('');

// TEST 2: Valid staff login
console.log('TEST 2: Valid staff login');
sessionStorage.clear();
const staffSession = AuthManager.login('staff', 'staff123');
assertNotNull(staffSession, 'Staff login returns session object');
assertEqual(staffSession.username, 'staff', 'Session contains correct username');
assertEqual(staffSession.role, 'staff', 'Session contains correct role');
assertEqual(staffSession.displayName, 'Staf Marketplace', 'Session contains correct displayName');
console.log('');

// TEST 3: Invalid username
console.log('TEST 3: Invalid username');
sessionStorage.clear();
const invalidUserResult = AuthManager.login('invalid', '123456');
assertNull(invalidUserResult, 'Invalid username returns null');
console.log('');

// TEST 4: Invalid password
console.log('TEST 4: Invalid password');
sessionStorage.clear();
const invalidPwdResult = AuthManager.login('admin', 'wrongpassword');
assertNull(invalidPwdResult, 'Invalid password returns null');
console.log('');

// TEST 5: isAuthenticated() when logged in
console.log('TEST 5: isAuthenticated() when logged in');
sessionStorage.clear();
AuthManager.login('admin', '123456');
assert(AuthManager.isAuthenticated() === true, 'isAuthenticated returns true when logged in', 
    'Expected true');
console.log('');

// TEST 6: isAuthenticated() when logged out
console.log('TEST 6: isAuthenticated() when logged out');
sessionStorage.clear();
assert(AuthManager.isAuthenticated() === false, 'isAuthenticated returns false when not logged in', 
    'Expected false');
console.log('');

// TEST 7: getCurrentUser() when authenticated
console.log('TEST 7: getCurrentUser() when authenticated');
sessionStorage.clear();
AuthManager.login('admin', '123456');
const currentUser = AuthManager.getCurrentUser();
assertNotNull(currentUser, 'getCurrentUser returns user object');
assertEqual(currentUser.username, 'admin', 'getCurrentUser returns correct username');
assertEqual(currentUser.role, 'admin', 'getCurrentUser returns correct role');
assertEqual(currentUser.displayName, 'Administrator', 'getCurrentUser returns correct displayName');
assert(!currentUser.loginTime, 'getCurrentUser does not include loginTime');
console.log('');

// TEST 8: getCurrentUser() when not authenticated
console.log('TEST 8: getCurrentUser() when not authenticated');
sessionStorage.clear();
const noUser = AuthManager.getCurrentUser();
assertNull(noUser, 'getCurrentUser returns null when not authenticated');
console.log('');

// TEST 9: logout() clears session
console.log('TEST 9: logout() clears session');
sessionStorage.clear();
AuthManager.login('admin', '123456');
AuthManager.logout();
assert(AuthManager.isAuthenticated() === false, 'logout() clears session', 
    'Expected isAuthenticated to return false after logout');
console.log('');

// TEST 10: hasRole() with correct role
console.log('TEST 10: hasRole() with correct role');
sessionStorage.clear();
AuthManager.login('admin', '123456');
assert(AuthManager.hasRole('admin') === true, 'hasRole returns true for correct role', 
    'Expected true');
console.log('');

// TEST 11: hasRole() with incorrect role
console.log('TEST 11: hasRole() with incorrect role');
// Session already has admin role from previous test
assert(AuthManager.hasRole('staff') === false, 'hasRole returns false for incorrect role', 
    'Expected false');
console.log('');

// TEST 12: hasRole() when not authenticated
console.log('TEST 12: hasRole() when not authenticated');
sessionStorage.clear();
assert(AuthManager.hasRole('admin') === false, 'hasRole returns false when not authenticated', 
    'Expected false');
console.log('');

// TEST 13: Session persists in sessionStorage
console.log('TEST 13: Session persists in sessionStorage');
sessionStorage.clear();
AuthManager.login('staff', 'staff123');
const storedSession = JSON.parse(sessionStorage.getItem('marketplace_session'));
assertNotNull(storedSession, 'Session stored in sessionStorage');
assertEqual(storedSession.username, 'staff', 'Stored session has correct username');
console.log('');

// TEST 14: Login overwrites previous session
console.log('TEST 14: Login overwrites previous session');
sessionStorage.clear();
AuthManager.login('admin', '123456');
AuthManager.login('staff', 'staff123');
const currentUser2 = AuthManager.getCurrentUser();
assertEqual(currentUser2.username, 'staff', 'New login overwrites previous session');
console.log('');

// TEST 15: IIFE encapsulation - private members not accessible
console.log('TEST 15: IIFE encapsulation');
assert(typeof AuthManager.USERS === 'undefined', 'USERS constant is private', 
    'USERS should not be accessible');
assert(typeof AuthManager.SESSION_KEY === 'undefined', 'SESSION_KEY constant is private', 
    'SESSION_KEY should not be accessible');
console.log('');

// Print summary
console.log('\n=== TEST SUMMARY ===');
console.log(`Total Tests: ${TestResults.passed + TestResults.failed}`);
console.log(`Passed: ${TestResults.passed}`);
console.log(`Failed: ${TestResults.failed}`);

if (TestResults.failed === 0) {
    console.log('\n✓ ALL TESTS PASSED!');
    process.exit(0);
} else {
    console.log('\n✗ SOME TESTS FAILED');
    TestResults.tests.filter(t => t.status === 'FAILED').forEach(t => {
        console.error(`  - ${t.name}: ${t.message}`);
    });
    process.exit(1);
}

# StorageAPI Module - Quick Reference

## Module: `js/storage-api.js`

The StorageAPI module provides a robust, error-handling wrapper around the browser's LocalStorage with JSON serialization and quota management.

---

## Public Methods

### 1. `setItem(key, value)` → Promise<boolean>

Stores a value in LocalStorage with automatic JSON serialization.

```javascript
// Store an object
const success = await StorageAPI.setItem('customer', { 
  id: 'C001', 
  name: 'John' 
});

if (!success) {
  console.log('Storage failed - may be full');
}
```

**Parameters:**
- `key` (string): Storage key
- `value` (any): Value to store (object, array, string, number, boolean, etc.)

**Returns:** 
- `true` - Successfully stored
- `false` - Failed (quota exceeded, not available, serialization error)

**Error Handling:**
- Catches `QuotaExceededError` when storage is full
- Returns false on any error
- Logs all errors to console

---

### 2. `getItem(key)` → Promise<any|null>

Retrieves a value from LocalStorage with automatic JSON deserialization.

```javascript
const customer = await StorageAPI.getItem('customer');

if (customer) {
  console.log('Customer:', customer.name);
} else {
  console.log('Not found or data corrupted');
}
```

**Parameters:**
- `key` (string): Storage key

**Returns:**
- The deserialized value (object, array, string, number, boolean, etc.)
- `null` - Key doesn't exist or JSON parsing failed

**Error Handling:**
- Returns null if key doesn't exist
- Returns null if JSON is corrupted (logs error)
- Never throws

---

### 3. `removeItem(key)` → Promise<boolean>

Removes an item from LocalStorage.

```javascript
const success = await StorageAPI.removeItem('temp_data');
console.log(success ? 'Removed' : 'Error');
```

**Parameters:**
- `key` (string): Storage key to remove

**Returns:**
- `true` - Successfully removed or key didn't exist
- `false` - Error occurred

---

### 4. `clear()` → Promise<void>

Clears all items from LocalStorage. Use for logout or reset operations.

```javascript
// Clear all data on logout
await StorageAPI.clear();
```

---

### 5. `isAvailable()` → boolean

Checks if LocalStorage is supported (synchronous, no await needed).

```javascript
if (!StorageAPI.isAvailable()) {
  showError('LocalStorage not supported in this browser');
  return;
}
```

**Returns:**
- `true` - LocalStorage is available and working
- `false` - LocalStorage disabled, private mode, or old browser

**Note:** Synchronous method, doesn't use async/await

---

### 6. `getUsage()` → {used, quota, percentUsed}

Gets storage usage statistics (synchronous, no await needed).

```javascript
const usage = StorageAPI.getUsage();

console.log(`Using ${usage.used} / ${usage.quota} bytes`);
console.log(`${usage.percentUsed}% of storage used`);

if (usage.percentUsed > 80) {
  console.warn('Storage almost full!');
}
```

**Returns:** Object with:
- `used` (number): Bytes currently used
- `quota` (number): Total quota (5MB = 5,242,880 bytes)
- `percentUsed` (number): Percentage (0-100)

**Note:** Synchronous method, doesn't use async/await

---

## Usage Examples

### Store and Retrieve Customer List

```javascript
// Store
const customers = [
  { id: 'C001', name: 'John', email: 'john@example.com' },
  { id: 'C002', name: 'Jane', email: 'jane@example.com' }
];
await StorageAPI.setItem('customers', customers);

// Retrieve
const savedCustomers = await StorageAPI.getItem('customers');
if (savedCustomers && savedCustomers.length > 0) {
  console.log(`Loaded ${savedCustomers.length} customers`);
}
```

### Handle Login/Logout

```javascript
// On login - store user session
const user = { id: 'USER-123', name: 'John', role: 'admin' };
await StorageAPI.setItem('currentUser', user);

// On logout - clear all data
await StorageAPI.clear();
```

### Graceful Degradation

```javascript
// Check availability early
if (!StorageAPI.isAvailable()) {
  console.log('Operating in offline mode - no persistent storage');
  // Use in-memory storage instead
}

// Check quota before storing large data
const usage = StorageAPI.getUsage();
if (usage.percentUsed > 90) {
  console.log('Storage is full - clearing old data');
  await StorageAPI.removeItem('old_cache');
}

const success = await StorageAPI.setItem('large_data', bigObject);
if (!success) {
  console.log('Failed to store - storage may be full');
}
```

### Bulk Operations

```javascript
// Store multiple items
await StorageAPI.setItem('user_profile', userProfile);
await StorageAPI.setItem('user_settings', userSettings);
await StorageAPI.setItem('user_transactions', transactions);

// Retrieve multiple items
const profile = await StorageAPI.getItem('user_profile');
const settings = await StorageAPI.getItem('user_settings');
const transactions = await StorageAPI.getItem('user_transactions');
```

---

## Data Types Supported

✅ **All JavaScript types work correctly:**
- Objects: `{id: 1, name: 'John'}`
- Arrays: `[1, 2, 3]` or `[{...}, {...}]`
- Strings: `'hello'`
- Numbers: `42`, `3.14`, `-5`, `0`
- Booleans: `true`, `false`
- Null/Undefined: `null`, `undefined`
- Nested structures: `{users: [{...}, {...}], count: 5}`

---

## Error Scenarios

### Scenario: Storage Quota Exceeded

```javascript
const success = await StorageAPI.setItem('large_data', hugeObject);

if (!success) {
  // Check usage
  const usage = StorageAPI.getUsage();
  
  if (usage.percentUsed >= 100) {
    console.log('Storage is full!');
    
    // Clear old data to make space
    await StorageAPI.removeItem('old_cache');
    
    // Retry
    const retry = await StorageAPI.setItem('large_data', hugeObject);
  }
}
```

### Scenario: Corrupted Data

```javascript
const data = await StorageAPI.getItem('settings');

if (data === null) {
  console.log('Settings not found or corrupted');
  
  // Use defaults
  const defaults = { theme: 'light', language: 'en' };
  await StorageAPI.setItem('settings', defaults);
}
```

### Scenario: Browser Doesn't Support LocalStorage

```javascript
if (!StorageAPI.isAvailable()) {
  console.log('LocalStorage not available');
  
  // Use alternative storage (in-memory, IndexedDB, etc.)
  // Or show message to user
  alert('Your browser does not support local storage');
}
```

---

## Browser Support

✅ Works in all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Opera

⚠️ Gracefully handles:
- Private browsing mode
- Storage disabled in settings
- Old browsers
- Quota exceeded errors

---

## Testing

Test file: `tests/storage-api.test.html`

Open in a browser to run the test suite. Results show:
- ✅ PASS (green)
- ❌ FAIL (red)
- ⏳ PENDING (orange)

Check browser console for detailed error messages.

---

## Notes

- All methods return promises (use `await` or `.then()`)
- `isAvailable()` and `getUsage()` are synchronous (no await needed)
- All errors are logged to console - check browser DevTools
- No external dependencies required
- Safe to call multiple times
- JSON serialization handles circular references with errors

---

## Implementation Details

**IIFE Pattern:**
```javascript
const StorageAPI = (function() {
    // Private scope - prevents global pollution
    
    return {
        // Public API
    };
})();
```

**Private Functions:**
- `logError()` - Consistent error logging
- `logWarning()` - Warning logging  
- `getStringSize()` - Accurate size calculation

**No globals exposed** - Only `StorageAPI` object added to global scope

// Node.js test runner for ValidationModule and TransactionManager
// This simulates the browser tests without needing LocalStorage

console.log('='.repeat(60));
console.log('Running Data Layer Tests');
console.log('='.repeat(60));

// Mock LocalStorage for Node.js environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  
  getItem(key) {
    return this.store[key] || null;
  }
  
  setItem(key, value) {
    this.store[key] = value.toString();
  }
  
  removeItem(key) {
    delete this.store[key];
  }
  
  clear() {
    this.store = {};
  }
}

global.localStorage = new LocalStorageMock();

// ========================================
// UTILITY FUNCTIONS
// ========================================

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function createTransactionObject(itemName, amount, category) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    itemName: itemName.trim(),
    amount: parseFloat(amount),
    category: category,
    timestamp: new Date().toISOString()
  };
}

// ========================================
// VALIDATION MODULE
// ========================================

const ValidationModule = {
  validateItemName(value) {
    if (value === null || value === undefined || value === '') {
      return { valid: false, message: 'Item Name is required' };
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      return { 
        valid: false, 
        message: 'Item Name must contain non-whitespace characters' 
      };
    }
    
    if (value.length > 100) {
      return { 
        valid: false, 
        message: 'Item Name must not exceed 100 characters' 
      };
    }
    
    return { valid: true, message: '' };
  },
  
  validateAmount(value) {
    if (value === null || value === undefined || value === '') {
      return { valid: false, message: 'Amount is required' };
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return { valid: false, message: 'Amount must be a number' };
    }
    
    if (numValue < 0.01) {
      return { 
        valid: false, 
        message: 'Amount must be at least 0.01' 
      };
    }
    
    if (numValue > 999999.99) {
      return { 
        valid: false, 
        message: 'Amount must not exceed 999999.99' 
      };
    }
    
    return { valid: true, message: '' };
  },
  
  validateCategory(value) {
    const validCategories = ['Food', 'Transport', 'Fun'];
    
    if (value === null || value === undefined || value === '') {
      return { valid: false, message: 'Category is required' };
    }
    
    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    if (trimmedValue === '') {
      return { valid: false, message: 'Category is required' };
    }
    
    if (!validCategories.includes(value)) {
      return { 
        valid: false, 
        message: 'Category must be Food, Transport, or Fun' 
      };
    }
    
    return { valid: true, message: '' };
  },
  
  validateForm(formData) {
    const errors = {};
    
    const itemNameResult = this.validateItemName(formData.itemName);
    if (!itemNameResult.valid) {
      errors.itemName = itemNameResult.message;
    }
    
    const amountResult = this.validateAmount(formData.amount);
    if (!amountResult.valid) {
      errors.amount = amountResult.message;
    }
    
    const categoryResult = this.validateCategory(formData.category);
    if (!categoryResult.valid) {
      errors.category = categoryResult.message;
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors: errors
    };
  }
};

// ========================================
// TRANSACTION MANAGER MODULE
// ========================================

const TransactionManager = {
  STORAGE_KEY: 'expense_tracker_transactions',
  transactions: [],
  
  isStorageAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },
  
  loadFromStorage() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      
      if (!data) {
        this.transactions = [];
        return [];
      }
      
      const parsed = JSON.parse(data);
      this.transactions = Array.isArray(parsed) ? parsed : [];
      return this.transactions;
      
    } catch (error) {
      console.error('Failed to load transactions from LocalStorage:', error);
      this.transactions = [];
      return [];
    }
  },
  
  saveToStorage() {
    try {
      const data = JSON.stringify(this.transactions);
      localStorage.setItem(this.STORAGE_KEY, data);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded:', error);
      } else {
        console.error('Failed to save transactions to LocalStorage:', error);
      }
      return false;
    }
  },
  
  createTransaction(itemName, amount, category) {
    try {
      const transaction = createTransactionObject(itemName, amount, category);
      this.transactions.push(transaction);
      
      const saved = this.saveToStorage();
      return saved ? transaction : null;
      
    } catch (error) {
      console.error('Failed to create transaction:', error);
      return null;
    }
  },
  
  deleteTransaction(transactionId) {
    try {
      const initialLength = this.transactions.length;
      this.transactions = this.transactions.filter(t => t.id !== transactionId);
      
      if (this.transactions.length === initialLength) {
        return false;
      }
      
      return this.saveToStorage();
      
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      return false;
    }
  },
  
  getAllTransactions() {
    return [...this.transactions];
  }
};

// ========================================
// TEST FRAMEWORK
// ========================================

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, expected, actual) {
  totalTests++;
  
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${testName}`);
  } else {
    failedTests++;
    console.log(`  ✗ ${testName}`);
    if (expected !== undefined && actual !== undefined) {
      console.log(`    Expected: ${JSON.stringify(expected)}`);
      console.log(`    Got: ${JSON.stringify(actual)}`);
    }
  }
}

function testGroup(title) {
  console.log(`\n${title}`);
  console.log('-'.repeat(title.length));
}

// ========================================
// UTILITY FUNCTION TESTS
// ========================================

testGroup('Utility Function Tests');

// Test escapeHtml
const escaped = escapeHtml('<script>alert("XSS")</script>');
assert(!escaped.includes('<script>'), 
       'escapeHtml should escape HTML tags');

// Test createTransactionObject
const txn = createTransactionObject('  Test Item  ', '10.50', 'Food');
assert(txn.itemName === 'Test Item', 
       'createTransactionObject should trim itemName',
       'Test Item', txn.itemName);
assert(txn.amount === 10.50, 
       'createTransactionObject should parse amount',
       10.50, txn.amount);
assert(txn.category === 'Food', 
       'createTransactionObject should set category',
       'Food', txn.category);
assert(typeof txn.id === 'string' && txn.id.length > 0, 
       'createTransactionObject should generate ID');
assert(typeof txn.timestamp === 'string', 
       'createTransactionObject should generate timestamp');

// ========================================
// VALIDATION MODULE TESTS
// ========================================

testGroup('ValidationModule - validateItemName Tests');

let result = ValidationModule.validateItemName(null);
assert(!result.valid && result.message === 'Item Name is required', 
       'should reject null value');

result = ValidationModule.validateItemName('');
assert(!result.valid && result.message === 'Item Name is required', 
       'should reject empty string');

result = ValidationModule.validateItemName('   ');
assert(!result.valid && result.message === 'Item Name must contain non-whitespace characters', 
       'should reject whitespace-only string');

result = ValidationModule.validateItemName('a'.repeat(101));
assert(!result.valid && result.message === 'Item Name must not exceed 100 characters', 
       'should reject strings longer than 100 characters');

result = ValidationModule.validateItemName('Groceries');
assert(result.valid && result.message === '', 
       'should accept valid item name');

testGroup('ValidationModule - validateAmount Tests');

result = ValidationModule.validateAmount(null);
assert(!result.valid && result.message === 'Amount is required', 
       'should reject null value');

result = ValidationModule.validateAmount('');
assert(!result.valid && result.message === 'Amount is required', 
       'should reject empty string');

result = ValidationModule.validateAmount('abc');
assert(!result.valid && result.message === 'Amount must be a number', 
       'should reject non-numeric string');

result = ValidationModule.validateAmount(0);
assert(!result.valid && result.message === 'Amount must be at least 0.01', 
       'should reject zero');

result = ValidationModule.validateAmount(1000000);
assert(!result.valid && result.message === 'Amount must not exceed 999999.99', 
       'should reject values greater than 999999.99');

result = ValidationModule.validateAmount(0.01);
assert(result.valid && result.message === '', 
       'should accept minimum valid value 0.01');

result = ValidationModule.validateAmount(999999.99);
assert(result.valid && result.message === '', 
       'should accept maximum valid value 999999.99');

result = ValidationModule.validateAmount(50);
assert(result.valid && result.message === '', 
       'should accept valid amount');

testGroup('ValidationModule - validateCategory Tests');

result = ValidationModule.validateCategory(null);
assert(!result.valid && result.message === 'Category is required', 
       'should reject null value');

result = ValidationModule.validateCategory('');
assert(!result.valid && result.message === 'Category is required', 
       'should reject empty string');

result = ValidationModule.validateCategory('Shopping');
assert(!result.valid && result.message === 'Category must be Food, Transport, or Fun', 
       'should reject invalid category');

result = ValidationModule.validateCategory('Food');
assert(result.valid && result.message === '', 
       'should accept Food category');

result = ValidationModule.validateCategory('Transport');
assert(result.valid && result.message === '', 
       'should accept Transport category');

result = ValidationModule.validateCategory('Fun');
assert(result.valid && result.message === '', 
       'should accept Fun category');

testGroup('ValidationModule - validateForm Tests');

result = ValidationModule.validateForm({
  itemName: 'Groceries',
  amount: 45.67,
  category: 'Food'
});
assert(result.valid && Object.keys(result.errors).length === 0, 
       'should return valid for all valid fields');

result = ValidationModule.validateForm({
  itemName: '',
  amount: '',
  category: ''
});
assert(!result.valid && Object.keys(result.errors).length === 3, 
       'should return errors for all invalid fields');

// ========================================
// TRANSACTION MANAGER TESTS
// ========================================

testGroup('TransactionManager - isStorageAvailable Tests');

assert(TransactionManager.isStorageAvailable() === true, 
       'should return true when LocalStorage is available');

testGroup('TransactionManager - Storage Tests');

localStorage.removeItem(TransactionManager.STORAGE_KEY);
TransactionManager.transactions = [];

let loaded = TransactionManager.loadFromStorage();
assert(Array.isArray(loaded) && loaded.length === 0, 
       'should return empty array when no data exists');

const testData = [
  { id: '1', itemName: 'Test', amount: 10, category: 'Food', timestamp: new Date().toISOString() }
];
localStorage.setItem(TransactionManager.STORAGE_KEY, JSON.stringify(testData));
loaded = TransactionManager.loadFromStorage();
assert(Array.isArray(loaded) && loaded.length === 1 && loaded[0].itemName === 'Test', 
       'should load and parse valid JSON data');

localStorage.removeItem(TransactionManager.STORAGE_KEY);
TransactionManager.transactions = [];

testGroup('TransactionManager - createTransaction Tests');

const transaction1 = TransactionManager.createTransaction('Coffee', 5.50, 'Food');
assert(transaction1 !== null, 
       'should return transaction object on success');
assert(transaction1.itemName === 'Coffee', 
       'should set correct itemName');
assert(transaction1.amount === 5.50, 
       'should set correct amount');
assert(transaction1.category === 'Food', 
       'should set correct category');

const allTransactions = TransactionManager.getAllTransactions();
assert(allTransactions.length === 1, 
       'should add transaction to internal array');

const transaction2 = TransactionManager.createTransaction('Bus Fare', 2.75, 'Transport');
assert(TransactionManager.getAllTransactions().length === 2, 
       'should have 2 transactions after adding second');

testGroup('TransactionManager - deleteTransaction Tests');

const idToDelete = transaction1.id;
const deleteResult = TransactionManager.deleteTransaction(idToDelete);
assert(deleteResult === true, 
       'should return true on successful delete');

const remainingTransactions = TransactionManager.getAllTransactions();
assert(remainingTransactions.length === 1, 
       'should have 1 transaction after deletion');
assert(remainingTransactions[0].id === transaction2.id, 
       'should keep the correct transaction');

const nonExistentDelete = TransactionManager.deleteTransaction('non-existent-id');
assert(nonExistentDelete === false, 
       'should return false when deleting non-existent transaction');

testGroup('TransactionManager - getAllTransactions Tests');

const allTrans = TransactionManager.getAllTransactions();
assert(Array.isArray(allTrans), 
       'should return an array');
assert(allTrans !== TransactionManager.transactions, 
       'should return a copy, not the original array');

testGroup('TransactionManager - Data Persistence Tests');

localStorage.removeItem(TransactionManager.STORAGE_KEY);
TransactionManager.transactions = [];

TransactionManager.createTransaction('Lunch', 12.50, 'Food');
TransactionManager.createTransaction('Movie', 15.00, 'Fun');

const TransactionManager2 = Object.create(TransactionManager);
TransactionManager2.transactions = [];

const loadedAfterReload = TransactionManager2.loadFromStorage();
assert(loadedAfterReload.length === 2, 
       'should load all transactions after reload');

const hasLunch = loadedAfterReload.some(t => t.itemName === 'Lunch' && t.amount === 12.50);
const hasMovie = loadedAfterReload.some(t => t.itemName === 'Movie' && t.amount === 15.00);
assert(hasLunch && hasMovie, 
       'should preserve all transaction data correctly');

// ========================================
// TEST SUMMARY
// ========================================

console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✓`);
console.log(`Failed: ${failedTests} ✗`);
console.log('='.repeat(60));

if (failedTests === 0) {
  console.log('\n✓ ALL TESTS PASSED!');
  process.exit(0);
} else {
  console.log(`\n✗ ${failedTests} TEST(S) FAILED`);
  process.exit(1);
}

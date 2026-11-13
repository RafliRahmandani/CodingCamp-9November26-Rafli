// Standalone verification script for ValidationModule
// This script can be run with Node.js to verify all validation functions

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

// Test suite
let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  ${error.message}`);
    failed++;
  }
}

function assertEquals(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`${message}\n  Expected: ${expectedStr}\n  Actual: ${actualStr}`);
  }
}

console.log('\n=== ValidationModule Tests ===\n');

console.log('--- validateItemName Tests ---');

test('rejects null value', () => {
  const result = ValidationModule.validateItemName(null);
  assertEquals(result, { valid: false, message: 'Item Name is required' });
});

test('rejects undefined value', () => {
  const result = ValidationModule.validateItemName(undefined);
  assertEquals(result, { valid: false, message: 'Item Name is required' });
});

test('rejects empty string', () => {
  const result = ValidationModule.validateItemName('');
  assertEquals(result, { valid: false, message: 'Item Name is required' });
});

test('rejects whitespace-only string', () => {
  const result = ValidationModule.validateItemName('   ');
  assertEquals(result, { valid: false, message: 'Item Name must contain non-whitespace characters' });
});

test('rejects string exceeding 100 characters', () => {
  const result = ValidationModule.validateItemName('a'.repeat(101));
  assertEquals(result, { valid: false, message: 'Item Name must not exceed 100 characters' });
});

test('accepts string with exactly 100 characters', () => {
  const result = ValidationModule.validateItemName('a'.repeat(100));
  assertEquals(result, { valid: true, message: '' });
});

test('accepts valid item name', () => {
  const result = ValidationModule.validateItemName('Groceries');
  assertEquals(result, { valid: true, message: '' });
});

console.log('\n--- validateAmount Tests ---');

test('rejects null value', () => {
  const result = ValidationModule.validateAmount(null);
  assertEquals(result, { valid: false, message: 'Amount is required' });
});

test('rejects undefined value', () => {
  const result = ValidationModule.validateAmount(undefined);
  assertEquals(result, { valid: false, message: 'Amount is required' });
});

test('rejects empty string', () => {
  const result = ValidationModule.validateAmount('');
  assertEquals(result, { valid: false, message: 'Amount is required' });
});

test('rejects non-numeric string', () => {
  const result = ValidationModule.validateAmount('abc');
  assertEquals(result, { valid: false, message: 'Amount must be a number' });
});

test('rejects zero', () => {
  const result = ValidationModule.validateAmount(0);
  assertEquals(result, { valid: false, message: 'Amount must be at least 0.01' });
});

test('rejects negative value', () => {
  const result = ValidationModule.validateAmount(-5);
  assertEquals(result, { valid: false, message: 'Amount must be at least 0.01' });
});

test('rejects value less than 0.01', () => {
  const result = ValidationModule.validateAmount(0.001);
  assertEquals(result, { valid: false, message: 'Amount must be at least 0.01' });
});

test('accepts minimum valid value 0.01', () => {
  const result = ValidationModule.validateAmount(0.01);
  assertEquals(result, { valid: true, message: '' });
});

test('rejects value exceeding 999999.99', () => {
  const result = ValidationModule.validateAmount(1000000);
  assertEquals(result, { valid: false, message: 'Amount must not exceed 999999.99' });
});

test('accepts maximum valid value 999999.99', () => {
  const result = ValidationModule.validateAmount(999999.99);
  assertEquals(result, { valid: true, message: '' });
});

test('accepts valid amount', () => {
  const result = ValidationModule.validateAmount(45.67);
  assertEquals(result, { valid: true, message: '' });
});

console.log('\n--- validateCategory Tests ---');

test('rejects null value', () => {
  const result = ValidationModule.validateCategory(null);
  assertEquals(result, { valid: false, message: 'Category is required' });
});

test('rejects undefined value', () => {
  const result = ValidationModule.validateCategory(undefined);
  assertEquals(result, { valid: false, message: 'Category is required' });
});

test('rejects empty string', () => {
  const result = ValidationModule.validateCategory('');
  assertEquals(result, { valid: false, message: 'Category is required' });
});

test('rejects whitespace-only string', () => {
  const result = ValidationModule.validateCategory('   ');
  assertEquals(result, { valid: false, message: 'Category is required' });
});

test('rejects invalid category', () => {
  const result = ValidationModule.validateCategory('Shopping');
  assertEquals(result, { valid: false, message: 'Category must be Food, Transport, or Fun' });
});

test('is case-sensitive (rejects lowercase)', () => {
  const result = ValidationModule.validateCategory('food');
  assertEquals(result, { valid: false, message: 'Category must be Food, Transport, or Fun' });
});

test('accepts Food category', () => {
  const result = ValidationModule.validateCategory('Food');
  assertEquals(result, { valid: true, message: '' });
});

test('accepts Transport category', () => {
  const result = ValidationModule.validateCategory('Transport');
  assertEquals(result, { valid: true, message: '' });
});

test('accepts Fun category', () => {
  const result = ValidationModule.validateCategory('Fun');
  assertEquals(result, { valid: true, message: '' });
});

console.log('\n--- validateForm Tests ---');

test('accepts all valid fields', () => {
  const result = ValidationModule.validateForm({
    itemName: 'Groceries',
    amount: 45.67,
    category: 'Food'
  });
  assertEquals(result, { valid: true, errors: {} });
});

test('rejects all empty fields', () => {
  const result = ValidationModule.validateForm({
    itemName: '',
    amount: '',
    category: ''
  });
  assertEquals(result.valid, false);
  assertEquals(result.errors.itemName, 'Item Name is required');
  assertEquals(result.errors.amount, 'Amount is required');
  assertEquals(result.errors.category, 'Category is required');
});

test('returns error for invalid amount only', () => {
  const result = ValidationModule.validateForm({
    itemName: 'Valid Name',
    amount: -5,
    category: 'Food'
  });
  assertEquals(result.valid, false);
  assertEquals(result.errors.amount, 'Amount must be at least 0.01');
  if (result.errors.itemName || result.errors.category) {
    throw new Error('Should not have errors for itemName or category');
  }
});

test('returns errors for multiple invalid fields', () => {
  const result = ValidationModule.validateForm({
    itemName: '   ',
    amount: 50,
    category: 'InvalidCategory'
  });
  assertEquals(result.valid, false);
  assertEquals(result.errors.itemName, 'Item Name must contain non-whitespace characters');
  assertEquals(result.errors.category, 'Category must be Food, Transport, or Fun');
  if (result.errors.amount) {
    throw new Error('Should not have error for amount');
  }
});

console.log('\n=== Test Summary ===');
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log('\n✗ Some tests failed');
  process.exit(1);
}

// Quick verification script for CalculationEngine
// This can be run in Node.js or in a browser console

// Load the module (in Node.js, you would use require)
// In browser, the module is loaded via <script> tag

const tests = {
    passed: 0,
    failed: 0,
    
    assert(condition, message) {
        if (condition) {
            this.passed++;
            console.log(`✓ ${message}`);
        } else {
            this.failed++;
            console.log(`✗ ${message}`);
        }
    },
    
    assertClose(actual, expected, tolerance = 0.01, message = '') {
        const close = Math.abs(actual - expected) < tolerance;
        if (close) {
            this.passed++;
            console.log(`✓ ${message} (expected: ${expected}, got: ${actual})`);
        } else {
            this.failed++;
            console.log(`✗ ${message} (expected: ${expected}, got: ${actual})`);
        }
    },
    
    assertString(actual, expected, message = '') {
        if (actual === expected) {
            this.passed++;
            console.log(`✓ ${message}`);
        } else {
            this.failed++;
            console.log(`✗ ${message}`);
            console.log(`  Expected: "${expected}"`);
            console.log(`  Got: "${actual}"`);
        }
    },
    
    report() {
        console.log('\n='.repeat(50));
        console.log(`Tests passed: ${this.passed}`);
        console.log(`Tests failed: ${this.failed}`);
        console.log(`Total: ${this.passed + this.failed}`);
        if (this.failed === 0) {
            console.log('✓ ALL TESTS PASSED');
        } else {
            console.log(`✗ ${this.failed} TESTS FAILED`);
        }
    }
};

console.log('Testing CalculationEngine Module');
console.log('='.repeat(50));

// Test 1: calculateTotalBelanja - Basic calculation
console.log('\n--- Test Group 1: calculateTotalBelanja ---');
tests.assertClose(
    CalculationEngine.calculateTotalBelanja(2, 5000000, 100000),
    9900000,
    0.01,
    'calculateTotalBelanja(2, 5000000, 100000) = 9900000'
);

// Test 2: calculateTotalBelanja - No discount
tests.assertClose(
    CalculationEngine.calculateTotalBelanja(2, 5000000, 0),
    10000000,
    0.01,
    'calculateTotalBelanja(2, 5000000, 0) = 10000000'
);

// Test 3: calculateTotalBelanja - Negative result becomes 0
tests.assertClose(
    CalculationEngine.calculateTotalBelanja(1, 1000, 2000),
    0,
    0.01,
    'calculateTotalBelanja(1, 1000, 2000) = 0 (negative becomes 0)'
);

// Test 4: calculateTotalBelanja - String inputs
tests.assertClose(
    CalculationEngine.calculateTotalBelanja('2', '5000000', '100000'),
    9900000,
    0.01,
    'calculateTotalBelanja with string inputs = 9900000'
);

// Test 5: calculateTotalBelanja - Decimal values
tests.assertClose(
    CalculationEngine.calculateTotalBelanja(2.5, 5000.50, 500.25),
    12000,
    0.01,
    'calculateTotalBelanja with decimals ≈ 12000'
);

// Test 6: formatCurrency - Basic formatting
console.log('\n--- Test Group 2: formatCurrency ---');
tests.assertString(
    CalculationEngine.formatCurrency(9900000),
    'Rp 9.900.000,00',
    'formatCurrency(9900000) = "Rp 9.900.000,00"'
);

// Test 7: formatCurrency - Thousand format
tests.assertString(
    CalculationEngine.formatCurrency(1000),
    'Rp 1.000,00',
    'formatCurrency(1000) = "Rp 1.000,00"'
);

// Test 8: formatCurrency - Decimal values
tests.assertString(
    CalculationEngine.formatCurrency(1000.50),
    'Rp 1.000,50',
    'formatCurrency(1000.50) = "Rp 1.000,50"'
);

// Test 9: formatCurrency - Large number
tests.assertString(
    CalculationEngine.formatCurrency(5000000),
    'Rp 5.000.000,00',
    'formatCurrency(5000000) = "Rp 5.000.000,00"'
);

// Test 10: formatCurrency - With cents
tests.assertString(
    CalculationEngine.formatCurrency(12345.67),
    'Rp 12.345,67',
    'formatCurrency(12345.67) = "Rp 12.345,67"'
);

// Test 11: parseCurrency - Basic parsing
console.log('\n--- Test Group 3: parseCurrency ---');
tests.assertClose(
    CalculationEngine.parseCurrency('Rp 9.900.000,00'),
    9900000,
    0.01,
    'parseCurrency("Rp 9.900.000,00") = 9900000'
);

// Test 12: parseCurrency - Thousand parsing
tests.assertClose(
    CalculationEngine.parseCurrency('Rp 1.000,00'),
    1000,
    0.01,
    'parseCurrency("Rp 1.000,00") = 1000'
);

// Test 13: parseCurrency - With cents
tests.assertClose(
    CalculationEngine.parseCurrency('Rp 1.000,50'),
    1000.50,
    0.01,
    'parseCurrency("Rp 1.000,50") = 1000.50'
);

// Test 14: parseCurrency - Large number
tests.assertClose(
    CalculationEngine.parseCurrency('Rp 5.000.000,00'),
    5000000,
    0.01,
    'parseCurrency("Rp 5.000.000,00") = 5000000'
);

// Test 15: formatLocaleNumber - Basic formatting
console.log('\n--- Test Group 4: formatLocaleNumber ---');
tests.assertString(
    CalculationEngine.formatLocaleNumber(5000000),
    '5.000.000,00',
    'formatLocaleNumber(5000000) = "5.000.000,00"'
);

// Test 16: formatLocaleNumber - Decimal
tests.assertString(
    CalculationEngine.formatLocaleNumber(1234.56),
    '1.234,56',
    'formatLocaleNumber(1234.56) = "1.234,56"'
);

// Test 17: formatLocaleNumber - Thousand
tests.assertString(
    CalculationEngine.formatLocaleNumber(1000),
    '1.000,00',
    'formatLocaleNumber(1000) = "1.000,00"'
);

// Test 18: Round-trip test
console.log('\n--- Test Group 5: Round-trip (format + parse) ---');
const roundTripValues = [1000, 5000000, 12345.67, 999999.99];
roundTripValues.forEach(value => {
    const formatted = CalculationEngine.formatCurrency(value);
    const parsed = CalculationEngine.parseCurrency(formatted);
    tests.assertClose(
        parsed,
        value,
        0.01,
        `Round-trip for ${value}: format → parse`
    );
});

// Final report
tests.report();

/**
 * calculation-engine.test.js - Tests for CalculationEngine module
 * 
 * Tests the following functions:
 * - calculateTotalBelanja(quantity, unitPrice, discount)
 * - formatCurrency(amount)
 * - parseCurrency(formatted)
 * - formatLocaleNumber(number)
 */

// Import or load CalculationEngine (assuming it's available in the global scope)
// In a browser environment, this would be loaded via <script> tag

console.log('='.repeat(60));
console.log('CALCULATION ENGINE TESTS');
console.log('='.repeat(60));

// Test suite for calculateTotalBelanja
console.log('\n--- Testing calculateTotalBelanja() ---\n');

function testCalculateTotalBelanja() {
    const tests = [
        {
            name: 'Basic calculation: (2 × 5000000) - 100000 = 9900000',
            inputs: { qty: 2, price: 5000000, discount: 100000 },
            expected: 9900000
        },
        {
            name: 'No discount: (2 × 5000000) - 0 = 10000000',
            inputs: { qty: 2, price: 5000000, discount: 0 },
            expected: 10000000
        },
        {
            name: 'Zero quantity: (0 × 5000000) - 100000 = 0 (negative becomes 0)',
            inputs: { qty: 0, price: 5000000, discount: 100000 },
            expected: 0
        },
        {
            name: 'Discount exceeds total: (1 × 1000) - 2000 = 0 (negative becomes 0)',
            inputs: { qty: 1, price: 1000, discount: 2000 },
            expected: 0
        },
        {
            name: 'String inputs: ("2", "5000000", "100000")',
            inputs: { qty: '2', price: '5000000', discount: '100000' },
            expected: 9900000
        },
        {
            name: 'Decimal values: (2.5 × 5000.50) - 500.25',
            inputs: { qty: 2.5, price: 5000.50, discount: 500.25 },
            expected: 12000.0  // (2.5 × 5000.50) - 500.25 = 12500.25 - 500.25 = 12000
        },
        {
            name: 'Floating-point precision: (0.1 + 0.2) type calculation',
            inputs: { qty: 1, price: 0.3, discount: 0 },
            expected: 0.3
        },
        {
            name: 'Large amounts: (100 × 999999.99)',
            inputs: { qty: 100, price: 999999.99, discount: 0 },
            expected: 99999999.0
        },
        {
            name: 'Small amounts: (1 × 1) - 0 = 1',
            inputs: { qty: 1, price: 1, discount: 0 },
            expected: 1
        },
        {
            name: 'Default discount (omitted): (2 × 5000000)',
            inputs: { qty: 2, price: 5000000, discount: undefined },
            expected: 10000000
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach((test, index) => {
        try {
            const result = CalculationEngine.calculateTotalBelanja(
                test.inputs.qty,
                test.inputs.price,
                test.inputs.discount
            );
            
            const precision = 0.01; // Allow small floating-point differences
            const isCorrect = Math.abs(result - test.expected) < precision;
            
            if (isCorrect) {
                console.log(`✓ Test ${index + 1}: ${test.name}`);
                console.log(`  Result: ${result}`);
                passed++;
            } else {
                console.log(`✗ Test ${index + 1}: ${test.name}`);
                console.log(`  Expected: ${test.expected}, Got: ${result}`);
                failed++;
            }
        } catch (error) {
            console.log(`✗ Test ${index + 1}: ${test.name}`);
            console.log(`  Error: ${error.message}`);
            failed++;
        }
    });
    
    console.log(`\nResult: ${passed} passed, ${failed} failed out of ${tests.length}`);
    return failed === 0;
}

// Test suite for formatCurrency
console.log('\n--- Testing formatCurrency() ---\n');

function testFormatCurrency() {
    const tests = [
        {
            name: 'Format 9900000 → "Rp 9.900.000,00"',
            input: 9900000,
            expected: 'Rp 9.900.000,00'
        },
        {
            name: 'Format 1000 → "Rp 1.000,00"',
            input: 1000,
            expected: 'Rp 1.000,00'
        },
        {
            name: 'Format 1000.50 → "Rp 1.000,50"',
            input: 1000.50,
            expected: 'Rp 1.000,50'
        },
        {
            name: 'Format 5000000 → "Rp 5.000.000,00"',
            input: 5000000,
            expected: 'Rp 5.000.000,00'
        },
        {
            name: 'Format 12345.67 → "Rp 12.345,67"',
            input: 12345.67,
            expected: 'Rp 12.345,67'
        },
        {
            name: 'Format 0 → "Rp 0,00"',
            input: 0,
            expected: 'Rp 0,00'
        },
        {
            name: 'Format 999999.99 → "Rp 999.999,99"',
            input: 999999.99,
            expected: 'Rp 999.999,99'
        },
        {
            name: 'Format 100 → "Rp 100,00"',
            input: 100,
            expected: 'Rp 100,00'
        },
        {
            name: 'Format string "1000" → "Rp 1.000,00"',
            input: '1000',
            expected: 'Rp 1.000,00'
        },
        {
            name: 'Format negative (converted to positive) -5000 → "Rp 5.000,00"',
            input: -5000,
            expected: 'Rp 5.000,00'
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach((test, index) => {
        try {
            const result = CalculationEngine.formatCurrency(test.input);
            
            if (result === test.expected) {
                console.log(`✓ Test ${index + 1}: ${test.name}`);
                console.log(`  Result: "${result}"`);
                passed++;
            } else {
                console.log(`✗ Test ${index + 1}: ${test.name}`);
                console.log(`  Expected: "${test.expected}"`);
                console.log(`  Got: "${result}"`);
                failed++;
            }
        } catch (error) {
            console.log(`✗ Test ${index + 1}: ${test.name}`);
            console.log(`  Error: ${error.message}`);
            failed++;
        }
    });
    
    console.log(`\nResult: ${passed} passed, ${failed} failed out of ${tests.length}`);
    return failed === 0;
}

// Test suite for parseCurrency
console.log('\n--- Testing parseCurrency() ---\n');

function testParseCurrency() {
    const tests = [
        {
            name: 'Parse "Rp 9.900.000,00" → 9900000',
            input: 'Rp 9.900.000,00',
            expected: 9900000
        },
        {
            name: 'Parse "Rp 1.000,00" → 1000',
            input: 'Rp 1.000,00',
            expected: 1000
        },
        {
            name: 'Parse "Rp 1.000,50" → 1000.50',
            input: 'Rp 1.000,50',
            expected: 1000.50
        },
        {
            name: 'Parse "Rp 5.000.000,00" → 5000000',
            input: 'Rp 5.000.000,00',
            expected: 5000000
        },
        {
            name: 'Parse "Rp 12.345,67" → 12345.67',
            input: 'Rp 12.345,67',
            expected: 12345.67
        },
        {
            name: 'Parse "Rp 0,00" → 0',
            input: 'Rp 0,00',
            expected: 0
        },
        {
            name: 'Parse "Rp 999.999,99" → 999999.99',
            input: 'Rp 999.999,99',
            expected: 999999.99
        },
        {
            name: 'Parse "Rp 100,00" → 100',
            input: 'Rp 100,00',
            expected: 100
        },
        {
            name: 'Parse without Rp prefix "9.900.000,00" → 9900000',
            input: '9.900.000,00',
            expected: 9900000
        },
        {
            name: 'Parse invalid string "" → 0',
            input: '',
            expected: 0
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach((test, index) => {
        try {
            const result = CalculationEngine.parseCurrency(test.input);
            
            // Allow small floating-point differences
            const precision = 0.01;
            const isCorrect = Math.abs(result - test.expected) < precision;
            
            if (isCorrect) {
                console.log(`✓ Test ${index + 1}: ${test.name}`);
                console.log(`  Result: ${result}`);
                passed++;
            } else {
                console.log(`✗ Test ${index + 1}: ${test.name}`);
                console.log(`  Expected: ${test.expected}`);
                console.log(`  Got: ${result}`);
                failed++;
            }
        } catch (error) {
            console.log(`✗ Test ${index + 1}: ${test.name}`);
            console.log(`  Error: ${error.message}`);
            failed++;
        }
    });
    
    console.log(`\nResult: ${passed} passed, ${failed} failed out of ${tests.length}`);
    return failed === 0;
}

// Test suite for formatLocaleNumber
console.log('\n--- Testing formatLocaleNumber() ---\n');

function testFormatLocaleNumber() {
    const tests = [
        {
            name: 'Format 5000000 → "5.000.000,00"',
            input: 5000000,
            expected: '5.000.000,00'
        },
        {
            name: 'Format 1234.56 → "1.234,56"',
            input: 1234.56,
            expected: '1.234,56'
        },
        {
            name: 'Format 1000 → "1.000,00"',
            input: 1000,
            expected: '1.000,00'
        },
        {
            name: 'Format 0 → "0,00"',
            input: 0,
            expected: '0,00'
        },
        {
            name: 'Format 100 → "100,00"',
            input: 100,
            expected: '100,00'
        },
        {
            name: 'Format 999999.99 → "999.999,99"',
            input: 999999.99,
            expected: '999.999,99'
        },
        {
            name: 'Format string "1234" → "1.234,00"',
            input: '1234',
            expected: '1.234,00'
        },
        {
            name: 'Format 9900000 → "9.900.000,00"',
            input: 9900000,
            expected: '9.900.000,00'
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach((test, index) => {
        try {
            const result = CalculationEngine.formatLocaleNumber(test.input);
            
            if (result === test.expected) {
                console.log(`✓ Test ${index + 1}: ${test.name}`);
                console.log(`  Result: "${result}"`);
                passed++;
            } else {
                console.log(`✗ Test ${index + 1}: ${test.name}`);
                console.log(`  Expected: "${test.expected}"`);
                console.log(`  Got: "${result}"`);
                failed++;
            }
        } catch (error) {
            console.log(`✗ Test ${index + 1}: ${test.name}`);
            console.log(`  Error: ${error.message}`);
            failed++;
        }
    });
    
    console.log(`\nResult: ${passed} passed, ${failed} failed out of ${tests.length}`);
    return failed === 0;
}

// Test round-trip: formatCurrency → parseCurrency
console.log('\n--- Testing Round-Trip: formatCurrency → parseCurrency ---\n');

function testRoundTrip() {
    const testValues = [1000, 5000000, 12345.67, 999999.99, 100.50, 0];
    
    let passed = 0;
    let failed = 0;
    
    testValues.forEach((value, index) => {
        try {
            const formatted = CalculationEngine.formatCurrency(value);
            const parsed = CalculationEngine.parseCurrency(formatted);
            
            // Allow small floating-point differences
            const precision = 0.01;
            const isCorrect = Math.abs(parsed - value) < precision;
            
            if (isCorrect) {
                console.log(`✓ Test ${index + 1}: ${value} → "${formatted}" → ${parsed}`);
                passed++;
            } else {
                console.log(`✗ Test ${index + 1}: ${value} → "${formatted}" → ${parsed}`);
                console.log(`  Difference: ${Math.abs(parsed - value)}`);
                failed++;
            }
        } catch (error) {
            console.log(`✗ Test ${index + 1}: Value ${value}`);
            console.log(`  Error: ${error.message}`);
            failed++;
        }
    });
    
    console.log(`\nResult: ${passed} passed, ${failed} failed out of ${testValues.length}`);
    return failed === 0;
}

// Run all tests
function runAllTests() {
    const results = [];
    
    results.push(testCalculateTotalBelanja());
    results.push(testFormatCurrency());
    results.push(testParseCurrency());
    results.push(testFormatLocaleNumber());
    results.push(testRoundTrip());
    
    console.log('\n' + '='.repeat(60));
    console.log('OVERALL RESULTS');
    console.log('='.repeat(60));
    
    const allPassed = results.every(r => r === true);
    if (allPassed) {
        console.log('✓ ALL TESTS PASSED');
    } else {
        console.log('✗ SOME TESTS FAILED');
    }
    
    return allPassed;
}

// Run tests if this file is executed directly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests };
}

// Note: In a Node.js environment with the module loaded, run:
// node tests/calculation-engine.test.js
// Or in browser console, load both files and call runAllTests()

/**
 * CalculationEngine - Calculation module for Total Belanja computation
 * 
 * This module provides calculation and formatting functionality:
 * - calculateTotalBelanja(quantity, unitPrice, discount) - calculate total purchase amount
 * - formatCurrency(amount) - format as Indonesian Rupiah "Rp X.XXX.XXX,YY"
 * - parseCurrency(formatted) - parse formatted currency back to number
 * - formatLocaleNumber(number) - format number with Indonesian thousands separator
 * 
 * Formula: Total Belanja = (Quantity × Unit Price) - Discount
 * All amounts in Indonesian Rupiah (Rp)
 * Uses IIFE module pattern for encapsulation.
 */

const CalculationEngine = (function() {
    'use strict';
    
    // Private constants
    const CURRENCY_CODE = 'IDR';
    const DECIMAL_PLACES = 2;
    const THOUSANDS_SEPARATOR = '.';
    const DECIMAL_SEPARATOR = ',';
    
    // Private helper functions
    
    /**
     * Precise rounding to avoid floating-point errors
     * @param {number} value - Value to round
     * @param {number} decimals - Number of decimal places
     * @returns {number} Rounded value
     */
    function toFixed(value, decimals) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
    
    /**
     * Convert value to number safely
     * @param {number|string} value - Value to convert
     * @returns {number} Converted number, or 0 if invalid
     */
    function sanitizeInput(value) {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    }
    
    // Public API
    return {
        /**
         * Calculate Total Belanja (Total Purchase Amount)
         * Formula: (Quantity × Unit Price) - Discount
         * @param {number|string} quantity - Jumlah barang
         * @param {number|string} unitPrice - Harga satuan (Rp)
         * @param {number|string} discount - Diskon (Rp), default 0
         * @returns {number} Total Belanja in Rp, minimum 0
         */
        calculateTotalBelanja: function(quantity, unitPrice, discount) {
            // Sanitize all inputs
            const qty = sanitizeInput(quantity);
            const price = sanitizeInput(unitPrice);
            const disc = sanitizeInput(discount || 0);
            
            // Calculate: (qty × price) - discount
            const subtotal = qty * price;
            const total = subtotal - disc;
            
            // Round to 2 decimal places with precision handling
            const rounded = toFixed(total, DECIMAL_PLACES);
            
            // Return 0 for negative results (customer doesn't owe money back)
            return Math.max(0, rounded);
        },
        
        /**
         * Format number as Indonesian Rupiah
         * Example: 5000000 → "Rp 5.000.000,00"
         * @param {number} amount - Amount to format
         * @returns {string} Formatted currency string
         */
        formatCurrency: function(amount) {
            // Sanitize input
            const num = sanitizeInput(amount);
            
            // Round to 2 decimal places
            const rounded = toFixed(num, DECIMAL_PLACES);
            
            // Split into integer and decimal parts
            const parts = rounded.toString().split('.');
            const integerPart = parts[0];
            const decimalPart = parts[1] || '00';
            
            // Pad decimal part to ensure 2 digits
            const paddedDecimal = (decimalPart + '00').substring(0, 2);
            
            // Add thousands separators to integer part
            const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
            
            // Combine: Rp [integer],[decimal]
            return `Rp ${withThousands}${DECIMAL_SEPARATOR}${paddedDecimal}`;
        },
        
        /**
         * Parse formatted currency back to number
         * Example: "Rp 5.000.000,00" → 5000000
         * @param {string} formatted - Formatted currency string
         * @returns {number} Parsed amount
         */
        parseCurrency: function(formatted) {
            if (typeof formatted !== 'string') {
                return 0;
            }
            
            // Remove "Rp " prefix if present
            let cleaned = formatted.replace(/^Rp\s*/, '').trim();
            
            // Replace thousands separators (.) with empty string
            // But preserve the decimal separator (,) which we'll convert to .
            cleaned = cleaned.replace(/\./g, '');
            
            // Replace comma (decimal separator) with dot for parsing
            cleaned = cleaned.replace(DECIMAL_SEPARATOR, '.');
            
            // Parse to number
            const num = parseFloat(cleaned);
            
            // Return 0 if invalid, otherwise return the parsed number
            return isNaN(num) ? 0 : num;
        },
        
        /**
         * Format number with Indonesian thousands separator
         * Example: 5000000 → "5.000.000"
         * Example: 1234.56 → "1.234,56"
         * @param {number} number - Number to format
         * @returns {string} Formatted number string
         */
        formatLocaleNumber: function(number) {
            // Sanitize input
            const num = sanitizeInput(number);
            
            // Round to 2 decimal places
            const rounded = toFixed(num, DECIMAL_PLACES);
            
            // Split into integer and decimal parts
            const parts = rounded.toString().split('.');
            const integerPart = parts[0];
            const decimalPart = parts[1] || '00';
            
            // Pad decimal part to ensure 2 digits
            const paddedDecimal = (decimalPart + '00').substring(0, 2);
            
            // Add thousands separators to integer part
            const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
            
            // Combine: [integer],[decimal]
            return `${withThousands}${DECIMAL_SEPARATOR}${paddedDecimal}`;
        }
    };
})();

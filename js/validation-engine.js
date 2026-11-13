/**
 * ValidationEngine Module
 * Provides comprehensive form field validation with Indonesian error messages
 * 
 * Module Pattern: IIFE (Immediately Invoked Function Expression)
 * Usage: ValidationEngine.validate(fieldName, value, rules)
 * 
 * @module ValidationEngine
 */

const ValidationEngine = (function() {
  'use strict';

  // ========================================
  // ERROR MESSAGES IN INDONESIAN
  // ========================================
  
  const messages = {
    required: (field) => `${field} harus diisi`,
    minLength: (field, min) => `${field} minimal ${min} karakter`,
    maxLength: (field, max) => `${field} maksimal ${max} karakter`,
    numeric: (field) => `${field} harus berupa angka`,
    positiveNumber: (field) => `${field} harus berupa angka positif`,
    positiveInteger: (field) => `${field} harus berupa angka bulat positif`,
    min: (field, min) => `${field} minimal ${min}`,
    max: (field, max) => `${field} maksimal ${max}`,
    phone: (field) => `${field} harus terdiri dari 10-13 digit angka`,
    email: (field) => `Format ${field} tidak valid`,
    alphanumeric: (field) => `${field} hanya boleh huruf dan angka`,
    format: (field) => `Format ${field} tidak valid`
  };

  // ========================================
  // VALIDATION RULES FOR ALL 14 FORM FIELDS
  // ========================================
  
  const fieldRules = {
    // 1. Timestamp - Auto-generated (read-only) - no validation needed
    timestamp: {
      fieldName: 'Timestamp',
      required: false,
      readonly: true
    },
    
    // 2. Nama Barang - Text, required, max 100 chars
    namaBarang: {
      fieldName: 'Nama Barang',
      required: true,
      maxLength: 100
    },
    
    // 3. Kategori Barang - Text, required, max 50 chars
    kategoriBarang: {
      fieldName: 'Kategori Barang',
      required: true,
      maxLength: 50
    },
    
    // 4. Harga Barang - Number, required, positive, min 0
    hargaBarang: {
      fieldName: 'Harga Barang',
      required: true,
      numeric: true,
      min: 0
    },
    
    // 5. Kuantitas - Number, required, positive integer, min 1
    kuantitas: {
      fieldName: 'Kuantitas',
      required: true,
      numeric: true,
      integer: true,
      min: 1
    },
    
    // 6. Varian Barang - Text, optional
    varianBarang: {
      fieldName: 'Varian Barang',
      required: false,
      maxLength: 100
    },
    
    // 7. Ongkir - Number, required, positive, min 0
    ongkir: {
      fieldName: 'Ongkir',
      required: true,
      numeric: true,
      min: 0
    },
    
    // 8. Sisa Bayar - Number, required, positive, min 0
    sisaBayar: {
      fieldName: 'Sisa Bayar',
      required: true,
      numeric: true,
      min: 0
    },
    
    // 9. Total Belanja - Calculated field (read-only) - no validation needed
    totalBelanja: {
      fieldName: 'Total Belanja',
      required: false,
      readonly: true
    },
    
    // 10. Nama Pembeli - Text, required, max 100 chars
    namaPembeli: {
      fieldName: 'Nama Pembeli',
      required: true,
      maxLength: 100
    },
    
    // 11. No Telp - Phone, required, numeric, 10-13 digits
    noTelp: {
      fieldName: 'No Telp',
      required: true,
      phone: true,
      minLength: 10,
      maxLength: 13
    },
    
    // 12. ID Pelanggan - Auto-generated (read-only) - no validation needed
    idPelanggan: {
      fieldName: 'ID Pelanggan',
      required: false,
      readonly: true
    },
    
    // 13. Alamat - Text, required
    alamat: {
      fieldName: 'Alamat',
      required: true,
      maxLength: 500
    },
    
    // 14. Status - Select, optional
    status: {
      fieldName: 'Status',
      required: false
    }
  };

  // ========================================
  // PRIVATE VALIDATION FUNCTIONS
  // ========================================
  
  /**
   * Check if value is empty or null/undefined
   * @private
   * @param {*} value
   * @returns {boolean} true if value is empty
   */
  function isEmpty(value) {
    if (value === null || value === undefined) {
      return true;
    }
    if (typeof value === 'string') {
      return value.trim().length === 0;
    }
    return false;
  }

  /**
   * Validate required field
   * @private
   * @param {*} value
   * @returns {boolean}
   */
  function validateRequired(value) {
    return !isEmpty(value);
  }

  /**
   * Validate minimum length
   * @private
   * @param {string} value
   * @param {number} min
   * @returns {boolean}
   */
  function validateMinLength(value, min) {
    if (isEmpty(value)) return true; // Only check if value is provided
    return String(value).trim().length >= min;
  }

  /**
   * Validate maximum length
   * @private
   * @param {string} value
   * @param {number} max
   * @returns {boolean}
   */
  function validateMaxLength(value, max) {
    if (isEmpty(value)) return true; // Only check if value is provided
    return String(value).trim().length <= max;
  }

  /**
   * Validate numeric value
   * @private
   * @param {*} value
   * @returns {boolean}
   */
  function validateNumeric(value) {
    if (isEmpty(value)) return true; // Only check if value is provided
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  }

  /**
   * Validate integer value
   * @private
   * @param {*} value
   * @returns {boolean}
   */
  function validateInteger(value) {
    if (isEmpty(value)) return true; // Only check if value is provided
    return Number.isInteger(Number(value));
  }

  /**
   * Validate minimum value
   * @private
   * @param {*} value
   * @param {number} min
   * @returns {boolean}
   */
  function validateMin(value, min) {
    if (isEmpty(value)) return true; // Only check if value is provided
    const num = parseFloat(value);
    return !isNaN(num) && num >= min;
  }

  /**
   * Validate maximum value
   * @private
   * @param {*} value
   * @param {number} max
   * @returns {boolean}
   */
  function validateMax(value, max) {
    if (isEmpty(value)) return true; // Only check if value is provided
    const num = parseFloat(value);
    return !isNaN(num) && num <= max;
  }

  /**
   * Validate phone number (10-13 digits)
   * @private
   * @param {string} value
   * @returns {boolean}
   */
  function validatePhone(value) {
    if (isEmpty(value)) return true; // Only check if value is provided
    // Remove all non-digit characters
    const phone = String(value).replace(/\D/g, '');
    return phone.length >= 10 && phone.length <= 13;
  }

  /**
   * Validate email format
   * @private
   * @param {string} value
   * @returns {boolean}
   */
  function validateEmail(value) {
    if (isEmpty(value)) return true; // Only check if value is provided
    // Simple email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(value));
  }

  /**
   * Validate alphanumeric only (letters and numbers, no special chars)
   * @private
   * @param {string} value
   * @returns {boolean}
   */
  function validateAlphanumeric(value) {
    if (isEmpty(value)) return true; // Only check if value is provided
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(String(value));
  }

  // ========================================
  // PUBLIC API
  // ========================================

  return {
    /**
     * Validate a single field with multiple rules
     * @param {string} fieldName - Name of the field to validate
     * @param {*} value - Value to validate
     * @param {Object} [customRules] - Optional custom rules (overrides field definition)
     * @returns {{valid: boolean, errors: string[]}} Validation result with error messages
     */
    validate: function(fieldName, value, customRules) {
      const errors = [];
      const rules = customRules || fieldRules[fieldName];

      // If no rules defined for this field, it's valid
      if (!rules) {
        return { valid: true, errors: [] };
      }

      // Skip validation for readonly fields
      if (rules.readonly) {
        return { valid: true, errors: [] };
      }

      // Check required
      if (rules.required && !validateRequired(value)) {
        errors.push(messages.required(rules.fieldName));
        return { valid: false, errors };
      }

      // Skip further validation if optional and empty
      if (!rules.required && isEmpty(value)) {
        return { valid: true, errors: [] };
      }

      // Check minimum length
      if (rules.minLength && !validateMinLength(value, rules.minLength)) {
        errors.push(messages.minLength(rules.fieldName, rules.minLength));
      }

      // Check maximum length
      if (rules.maxLength && !validateMaxLength(value, rules.maxLength)) {
        errors.push(messages.maxLength(rules.fieldName, rules.maxLength));
      }

      // Check numeric
      if (rules.numeric && !validateNumeric(value)) {
        errors.push(messages.numeric(rules.fieldName));
        return { valid: false, errors };
      }

      // Check integer
      if (rules.integer && !validateInteger(value)) {
        errors.push(messages.positiveInteger(rules.fieldName));
        return { valid: false, errors };
      }

      // Check minimum value
      if (rules.min !== undefined && !validateMin(value, rules.min)) {
        if (rules.integer) {
          errors.push(messages.min(rules.fieldName, rules.min));
        } else {
          errors.push(messages.min(rules.fieldName, rules.min));
        }
      }

      // Check maximum value
      if (rules.max !== undefined && !validateMax(value, rules.max)) {
        errors.push(messages.max(rules.fieldName, rules.max));
      }

      // Check phone format
      if (rules.phone && !validatePhone(value)) {
        errors.push(messages.phone(rules.fieldName));
      }

      // Check email format
      if (rules.email && !validateEmail(value)) {
        errors.push(messages.email(rules.fieldName));
      }

      // Check alphanumeric format
      if (rules.alphanumeric && !validateAlphanumeric(value)) {
        errors.push(messages.alphanumeric(rules.fieldName));
      }

      return {
        valid: errors.length === 0,
        errors: errors
      };
    },

    /**
     * Validate entire form with all 14 fields
     * @param {Object} formData - Object with field names as keys and values
     * @returns {{valid: boolean, errors: Object}} errors maps fieldName to array of error messages
     */
    validateForm: function(formData) {
      const errors = {};
      let isValid = true;

      // Validate each field in the form
      for (const fieldName in fieldRules) {
        const result = this.validate(fieldName, formData[fieldName]);
        if (!result.valid) {
          errors[fieldName] = result.errors;
          isValid = false;
        }
      }

      return {
        valid: isValid,
        errors: errors
      };
    },

    /**
     * Validate a single field with default rules
     * @param {string} fieldName - Name of the field
     * @param {*} value - Value to validate
     * @returns {{valid: boolean, message: string}} Result with single error message (first error if multiple)
     */
    validateField: function(fieldName, value) {
      const result = this.validate(fieldName, value);
      return {
        valid: result.valid,
        message: result.errors.length > 0 ? result.errors[0] : ''
      };
    },

    /**
     * Get validation rules for a specific field
     * @param {string} fieldName - Name of the field
     * @returns {Object|undefined} Validation rules or undefined if not found
     */
    getFieldRules: function(fieldName) {
      return fieldRules[fieldName];
    },

    /**
     * Get all validation rules
     * @returns {Object} All field validation rules
     */
    getAllRules: function() {
      return fieldRules;
    },

    /**
     * Get Indonesian error message template
     * @param {string} type - Type of validation (required, minLength, etc.)
     * @param {string} fieldName - Name of the field
     * @param {...any} args - Additional arguments for the message
     * @returns {string} Formatted error message in Indonesian
     */
    getMessage: function(type, fieldName, ...args) {
      const messageFunc = messages[type];
      if (messageFunc) {
        return messageFunc(fieldName, ...args);
      }
      return 'Format tidak valid';
    }
  };
})();

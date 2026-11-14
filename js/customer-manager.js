/**
 * customer-manager.js - Customer Management Module
 * 
 * This module provides customer management functionality:
 * - create(data) - Add new customer with auto-generated ID
 * - read(id) - Retrieve single customer by ID
 * - update(id, data) - Update customer record
 * - delete(id) - Remove customer record
 * - getAll() - Retrieve all customers
 * - search(criteria) - Search customers by multiple fields
 * 
 * Features:
 * - Auto-ID generation in CUST-YYYYMMDD-XXXX format
 * - ISO 8601 timestamps for all records
 * - Data validation via ValidationEngine
 * - Persistent storage via StorageAPI
 * - IIFE module pattern for encapsulation
 * 
 * Data Structure (14 fields):
 * - id: Auto-generated customer ID (CUST-YYYYMMDD-XXXX)
 * - timestamp: ISO 8601 timestamp (auto-generated)
 * - namaBarang: Item name (required)
 * - kategoriBarang: Item category (required)
 * - hargaBarang: Item price (required)
 * - kuantitas: Quantity (required)
 * - varianBarang: Item variant (optional)
 * - ongkir: Shipping cost (required)
 * - sisaBayar: Remaining payment (required)
 * - totalBelanja: Total purchase (calculated/read-only)
 * - namaPembeli: Customer name (required)
 * - noTelp: Phone number (required)
 * - idPelanggan: Customer ID (read-only, same as id)
 * - alamat: Address (required)
 */

const CustomerManager = (function() {
    'use strict';
    
    // Private constants
    const STORAGE_KEY = 'marketplace_customers';
    const ID_PREFIX = 'CUST';
    const ID_SEPARATOR = '-';
    const COUNTER_KEY = 'marketplace_customer_counter';
    
    // Private state
    let customerCounter = 0;
    
    /**
     * Private helper: Get current date in YYYYMMDD format
     * @returns {string} Date string in YYYYMMDD format
     */
    function getDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    
    /**
     * Private helper: Get current ISO 8601 timestamp
     * @returns {string} ISO 8601 timestamp
     */
    function getCurrentTimestamp() {
        return new Date().toISOString();
    }
    
    /**
     * Private helper: Get next counter value and increment
     * @returns {number} Next counter value
     */
    function getNextCounter() {
        customerCounter++;
        return customerCounter;
    }
    
    /**
     * Private helper: Generate unique customer ID
     * Format: CUST-YYYYMMDD-XXXX (where XXXX is padded counter)
     * @returns {string} Generated customer ID
     */
    function generateCustomerId() {
        const dateStr = getDateString();
        const counter = getNextCounter();
        const counterStr = String(counter).padStart(4, '0');
        return `${ID_PREFIX}${ID_SEPARATOR}${dateStr}${ID_SEPARATOR}${counterStr}`;
    }
    
    /**
     * Private helper: Load all customers from storage
     * @returns {Array} Array of customer objects
     */
    async function loadCustomers() {
        try {
            const data = await StorageAPI.getItem(STORAGE_KEY);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error loading customers:', error);
            return [];
        }
    }
    
    /**
     * Private helper: Save customers to storage
     * @param {Array} customers - Array of customer objects
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    async function saveCustomers(customers) {
        try {
            const success = await StorageAPI.setItem(STORAGE_KEY, customers);
            if (!success) {
                console.warn('Failed to save customers - storage may be full or unavailable');
            }
            return success;
        } catch (error) {
            console.error('Error saving customers:', error);
            return false;
        }
    }
    
    /**
     * Private helper: Load counter from storage
     * @returns {Promise<void>}
     */
    async function loadCounter() {
        try {
            const stored = await StorageAPI.getItem(COUNTER_KEY);
            customerCounter = (stored && typeof stored === 'number') ? stored : 0;
        } catch (error) {
            console.error('Error loading counter:', error);
            customerCounter = 0;
        }
    }
    
    /**
     * Private helper: Save counter to storage
     * @returns {Promise<void>}
     */
    async function saveCounter() {
        try {
            await StorageAPI.setItem(COUNTER_KEY, customerCounter);
        } catch (error) {
            console.error('Error saving counter:', error);
        }
    }
    
    /**
     * Private helper: Validate required fields
     * @param {Object} data - Customer data object
     * @returns {{valid: boolean, errors: Array}} Validation result
     */
    function validateData(data) {
        const errors = [];
        
        // Define required fields (excluding auto-generated and calculated fields)
        const requiredFields = [
            'namaBarang', 'kategoriBarang', 'hargaBarang', 'kuantitas',
            'ongkir', 'sisaBayar', 'namaPembeli', 'noTelp', 'alamat'
        ];
        
        // Check each required field
        for (const field of requiredFields) {
            if (!data[field] && data[field] !== 0) {
                errors.push(`${field} harus diisi`);
            }
        }
        
        // Validate numeric fields
        const numericFields = ['hargaBarang', 'kuantitas', 'ongkir', 'sisaBayar'];
        for (const field of numericFields) {
            if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
                const value = parseFloat(data[field]);
                if (isNaN(value)) {
                    errors.push(`${field} harus berupa angka`);
                }
            }
        }
        
        // Validate kuantitas as positive integer
        if (data.kuantitas !== undefined && data.kuantitas !== null && data.kuantitas !== '') {
            const value = parseFloat(data.kuantitas);
            if (!Number.isInteger(value) || value < 1) {
                errors.push('Kuantitas harus berupa angka bulat positif');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Private helper: Prepare customer data with all 14 fields
     * @param {Object} data - Input customer data
     * @param {string} id - Customer ID (auto-generated)
     * @returns {Object} Complete customer object with all 14 fields
     */
    function prepareCustomerData(data, id) {
        return {
            // Auto-generated fields
            id: id,
            idPelanggan: id,
            timestamp: getCurrentTimestamp(),
            
            // User-provided fields
            namaBarang: data.namaBarang || '',
            kategoriBarang: data.kategoriBarang || '',
            hargaBarang: parseFloat(data.hargaBarang) || 0,
            kuantitas: parseInt(data.kuantitas) || 0,
            varianBarang: data.varianBarang || '',
            ongkir: parseFloat(data.ongkir) || 0,
            sisaBayar: parseFloat(data.sisaBayar) || 0,
            totalBelanja: parseFloat(data.totalBelanja) || 0,
            namaPembeli: data.namaPembeli || '',
            noTelp: data.noTelp || '',
            alamat: data.alamat || ''
        };
    }
    
    /**
     * Private helper: Find customer index by ID
     * @param {Array} customers - Array of customers
     * @param {string} id - Customer ID to find
     * @returns {number} Index of customer or -1 if not found
     */
    function findCustomerIndex(customers, id) {
        return customers.findIndex(customer => customer.id === id);
    }
    
    // Initialize counter on module load
    loadCounter();
    
    // Public API
    return {
        /**
         * Create new customer with auto-generated ID
         * @param {Object} data - Customer data (namaBarang, kategoriBarang, etc.)
         * @returns {Promise<Object|null>} Created customer object or null on error
         */
        create: async function(data) {
            try {
                // Validate input data
                const validation = validateData(data);
                if (!validation.valid) {
                    console.error('Validasi data gagal:', validation.errors.join(', '));
                    return null;
                }
                
                // Load existing customers
                const customers = await loadCustomers();
                
                // Generate new ID
                const customerId = generateCustomerId();
                
                // Prepare complete customer object
                const newCustomer = prepareCustomerData(data, customerId);
                
                // Add to array
                customers.push(newCustomer);
                
                // Save to storage
                const saved = await saveCustomers(customers);
                if (!saved) {
                    console.warn('Pelanggan dibuat tetapi gagal disimpan ke penyimpanan');
                }
                
                // Save counter
                await saveCounter();
                
                // Invalidate caches on create
                if (typeof CacheManager !== 'undefined' && CacheManager) {
                    CacheManager.invalidateByType('all');
                    console.log('[CustomerManager] Caches invalidated on customer create');
                }
                
                console.log('Pelanggan berhasil dibuat:', customerId);
                return newCustomer;
            } catch (error) {
                console.error('Error creating customer:', error);
                return null;
            }
        },
        
        /**
         * Read single customer by ID
         * @param {string} id - Customer ID
         * @returns {Promise<Object|null>} Customer object or null if not found
         */
        read: async function(id) {
            try {
                const customers = await loadCustomers();
                const customer = customers.find(c => c.id === id);
                return customer || null;
            } catch (error) {
                console.error('Error reading customer:', error);
                return null;
            }
        },
        
        /**
         * Update existing customer record
         * @param {string} id - Customer ID
         * @param {Object} data - Updated customer data (partial update allowed)
         * @returns {Promise<Object|null>} Updated customer object or null on error
         */
        update: async function(id, data) {
            try {
                // Load existing customers
                const customers = await loadCustomers();
                
                // Find customer
                const index = findCustomerIndex(customers, id);
                if (index === -1) {
                    console.warn(`Pelanggan dengan ID ${id} tidak ditemukan`);
                    return null;
                }
                
                // Merge data (preserve auto-generated fields)
                const existingCustomer = customers[index];
                const updatedData = {
                    ...existingCustomer,
                    ...data,
                    id: existingCustomer.id,
                    idPelanggan: existingCustomer.id,
                    timestamp: existingCustomer.timestamp
                };
                
                // Validate merged data
                const validation = validateData(updatedData);
                if (!validation.valid) {
                    console.error('Validasi data update gagal:', validation.errors.join(', '));
                    return null;
                }
                
                // Update in array
                customers[index] = updatedData;
                
                // Save to storage
                const saved = await saveCustomers(customers);
                if (!saved) {
                    console.warn('Pelanggan diupdate tetapi gagal disimpan ke penyimpanan');
                }
                
                // Invalidate caches on update
                if (typeof CacheManager !== 'undefined' && CacheManager) {
                    CacheManager.invalidateByType('all');
                    console.log('[CustomerManager] Caches invalidated on customer update');
                }
                
                console.log('Pelanggan berhasil diupdate:', id);
                return updatedData;
            } catch (error) {
                console.error('Error updating customer:', error);
                return null;
            }
        },
        
        /**
         * Delete customer record
         * @param {string} id - Customer ID
         * @returns {Promise<boolean>} True if deleted, false otherwise
         */
        delete: async function(id) {
            try {
                // Load existing customers
                const customers = await loadCustomers();
                
                // Find customer
                const index = findCustomerIndex(customers, id);
                if (index === -1) {
                    console.warn(`Pelanggan dengan ID ${id} tidak ditemukan`);
                    return false;
                }
                
                // Remove from array
                customers.splice(index, 1);
                
                // Save to storage
                const saved = await saveCustomers(customers);
                if (!saved) {
                    console.warn('Pelanggan dihapus secara lokal tetapi gagal disimpan ke penyimpanan');
                }
                
                // Invalidate caches on delete
                if (typeof CacheManager !== 'undefined' && CacheManager) {
                    CacheManager.invalidateByType('all');
                    console.log('[CustomerManager] Caches invalidated on customer delete');
                }
                
                console.log('Pelanggan berhasil dihapus:', id);
                return true;
            } catch (error) {
                console.error('Error deleting customer:', error);
                return false;
            }
        },
        
        /**
         * Get all customers
         * @returns {Promise<Array>} Array of all customer records
         */
        getAll: async function() {
            try {
                const customers = await loadCustomers();
                console.log(`Total pelanggan tersimpan: ${customers.length}`);
                return customers;
            } catch (error) {
                console.error('Error getting all customers:', error);
                return [];
            }
        },

        /**
         * Get paginated customers (for lazy loading and efficient rendering)
         * @param {number} pageSize - Number of customers per page (default: 50)
         * @param {number} pageNumber - Page number (0-indexed)
         * @returns {Promise<Object>} Paginated result with items, total, etc.
         */
        getPaginated: async function(pageSize = 50, pageNumber = 0) {
            try {
                const result = await StorageAPI.getPaginated(STORAGE_KEY, pageSize, pageNumber);
                console.log(`Loaded page ${pageNumber} with ${result.items.length} items`);
                return result;
            } catch (error) {
                console.error('Error getting paginated customers:', error);
                return {
                    items: [],
                    total: 0,
                    page: pageNumber,
                    pageSize: pageSize,
                    totalPages: 0,
                    hasNextPage: false
                };
            }
        },
        
        /**
         * Search customers by multiple criteria
         * Searches across: namaBarang, kategoriBarang, namaPembeli, noTelp, alamat, id
         * @param {Object} criteria - Search criteria object
         *   - field: specific field to search (optional, searches all if not specified)
         *   - value: value to search for (required)
         *   - exact: boolean, whether to match exactly (default: false for partial match)
         * @returns {Promise<Array>} Array of matching customer records
         */
        search: async function(criteria) {
            try {
                if (!criteria || !criteria.value) {
                    console.warn('Kriteria pencarian harus memiliki nilai');
                    return [];
                }
                
                const customers = await loadCustomers();
                const searchValue = String(criteria.value).toLowerCase();
                const exact = criteria.exact || false;
                
                // Fields to search if not specified
                const searchFields = [
                    'namaBarang', 'kategoriBarang', 'namaPembeli',
                    'noTelp', 'alamat', 'id'
                ];
                
                // If specific field is provided, search only that field
                const fieldsToSearch = criteria.field ? [criteria.field] : searchFields;
                
                // Filter customers matching criteria
                const results = customers.filter(customer => {
                    return fieldsToSearch.some(field => {
                        const fieldValue = String(customer[field] || '').toLowerCase();
                        
                        if (exact) {
                            return fieldValue === searchValue;
                        } else {
                            return fieldValue.includes(searchValue);
                        }
                    });
                });
                
                console.log(`Ditemukan ${results.length} pelanggan sesuai kriteria pencarian`);
                return results;
            } catch (error) {
                console.error('Error searching customers:', error);
                return [];
            }
        }
    };
})();

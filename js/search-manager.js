/**
 * search-manager.js - Search Manager module
 * 
 * This module provides search functionality:
 * - search(criteria) - search customers by multiple fields
 * - displayResults(results) - render search results in table format
 * - clearResults() - clear search results and show empty state
 * 
 * Features:
 * - Searches by customer ID, name, phone, address, and item name
 * - Partial matching (case-insensitive)
 * - Results display in table format (all 14 fields)
 * - Edit/delete buttons for each result row
 * - "Tidak ada hasil" message if no matches
 * - Empty state display for no search yet performed
 * 
 * Uses IIFE module pattern for encapsulation.
 * Implemented in Task 9.2
 */

const SearchManager = (function() {
    'use strict';
    
    /**
     * Build table HTML for search results
     * @param {Array} results - Array of customer objects
     * @returns {string} HTML string for results table
     */
    function buildResultsTable(results) {
        if (!results || results.length === 0) {
            return '';
        }
        
        // Table headers for all 14 fields
        const headers = [
            'ID Pelanggan',
            'Timestamp',
            'Nama Barang',
            'Kategori',
            'Harga',
            'Qty',
            'Varian',
            'Ongkir',
            'Sisa Bayar',
            'Total Belanja',
            'Nama Pembeli',
            'No Telp',
            'Alamat',
            'Aksi'
        ];
        
        // Build header row
        let html = '<table class="search-results-table" role="grid" aria-label="Hasil pencarian pelanggan">\n';
        html += '  <thead>\n';
        html += '    <tr role="row">\n';
        headers.forEach(header => {
            html += `      <th role="columnheader">${header}</th>\n`;
        });
        html += '    </tr>\n';
        html += '  </thead>\n';
        html += '  <tbody>\n';
        
        // Build data rows
        results.forEach((customer, index) => {
            const displayId = `row-${index}`;
            html += `    <tr role="row" data-customer-id="${customer.id}" id="${displayId}">\n`;
            
            // ID Pelanggan
            html += `      <td role="gridcell" data-header="ID Pelanggan">${escapeHtml(customer.id)}</td>\n`;
            
            // Timestamp (format for display)
            const dateObj = new Date(customer.timestamp);
            const formattedDate = dateObj.toLocaleString('id-ID');
            html += `      <td role="gridcell" data-header="Timestamp">${formattedDate}</td>\n`;
            
            // Nama Barang
            html += `      <td role="gridcell" data-header="Nama Barang">${escapeHtml(customer.namaBarang)}</td>\n`;
            
            // Kategori Barang
            html += `      <td role="gridcell" data-header="Kategori">${escapeHtml(customer.kategoriBarang)}</td>\n`;
            
            // Harga Barang (formatted)
            const hargaFormatted = CalculationEngine.formatCurrency(customer.hargaBarang);
            html += `      <td role="gridcell" data-header="Harga">${hargaFormatted}</td>\n`;
            
            // Kuantitas
            html += `      <td role="gridcell" data-header="Qty">${customer.kuantitas}</td>\n`;
            
            // Varian Barang
            html += `      <td role="gridcell" data-header="Varian">${escapeHtml(customer.varianBarang || '-')}</td>\n`;
            
            // Ongkir (formatted)
            const ongkirFormatted = CalculationEngine.formatCurrency(customer.ongkir);
            html += `      <td role="gridcell" data-header="Ongkir">${ongkirFormatted}</td>\n`;
            
            // Sisa Bayar (formatted)
            const sisaBayarFormatted = CalculationEngine.formatCurrency(customer.sisaBayar);
            html += `      <td role="gridcell" data-header="Sisa Bayar">${sisaBayarFormatted}</td>\n`;
            
            // Total Belanja (formatted)
            const totalFormatted = CalculationEngine.formatCurrency(customer.totalBelanja);
            html += `      <td role="gridcell" data-header="Total Belanja"><strong>${totalFormatted}</strong></td>\n`;
            
            // Nama Pembeli
            html += `      <td role="gridcell" data-header="Nama Pembeli">${escapeHtml(customer.namaPembeli)}</td>\n`;
            
            // No Telp
            html += `      <td role="gridcell" data-header="No Telp">${escapeHtml(customer.noTelp)}</td>\n`;
            
            // Alamat
            html += `      <td role="gridcell" data-header="Alamat">${escapeHtml(customer.alamat)}</td>\n`;
            
            // Action buttons
            html += `      <td role="gridcell" data-header="Aksi" class="action-cell">\n`;
            html += `        <button class="btn btn-sm btn-edit" data-action="edit" data-customer-id="${customer.id}" aria-label="Edit pelanggan ${customer.namaPembeli}">Edit</button>\n`;
            html += `        <button class="btn btn-sm btn-danger" data-action="delete" data-customer-id="${customer.id}" aria-label="Hapus pelanggan ${customer.namaPembeli}">Hapus</button>\n`;
            html += `      </td>\n`;
            html += '    </tr>\n';
        });
        
        html += '  </tbody>\n';
        html += '</table>\n';
        
        return html;
    }
    
    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Attach event listeners to action buttons
     * @param {HTMLElement} container - Container with action buttons
     * @param {Function} onEdit - Callback for edit action
     * @param {Function} onDelete - Callback for delete action
     */
    function attachButtonListeners(container, onEdit, onDelete) {
        if (!container) return;
        
        // Edit buttons
        const editButtons = container.querySelectorAll('[data-action="edit"]');
        editButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const customerId = this.getAttribute('data-customer-id');
                if (onEdit && typeof onEdit === 'function') {
                    onEdit(customerId);
                }
            });
        });
        
        // Delete buttons
        const deleteButtons = container.querySelectorAll('[data-action="delete"]');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const customerId = this.getAttribute('data-customer-id');
                if (onDelete && typeof onDelete === 'function') {
                    onDelete(customerId);
                }
            });
        });
    }
    
    // Public API
    return {
        /**
         * Search for customers by criteria
         * @param {Object} criteria - Search criteria with value property
         * @returns {Promise<Array>} Array of matching customer objects
         */
        search: async function(criteria) {
            try {
                if (!criteria || !criteria.value) {
                    console.warn('Kriteria pencarian harus memiliki nilai');
                    return [];
                }
                
                // Use CustomerManager.search() to perform the search
                const results = await CustomerManager.search(criteria);
                return results || [];
            } catch (error) {
                console.error('Error during search:', error);
                return [];
            }
        },
        
        /**
         * Display search results in the results container
         * @param {Array} results - Array of customer objects to display
         * @param {Object} options - Display options with callbacks
         * @param {Function} options.onEdit - Callback for edit button click
         * @param {Function} options.onDelete - Callback for delete button click
         */
        displayResults: function(results, options = {}) {
            const resultsContainer = document.getElementById('search-results');
            const emptyState = document.getElementById('search-empty-state');
            
            if (!resultsContainer) {
                console.warn('Search results container not found');
                return;
            }
            
            if (!results || results.length === 0) {
                // Show empty state, hide results
                resultsContainer.innerHTML = '';
                if (emptyState) {
                    emptyState.style.display = 'block';
                    emptyState.focus();
                }
                
                // Announce to screen readers
                if (window.announceToScreenReader) {
                    window.announceToScreenReader('Tidak ada hasil pencarian yang cocok', 'polite');
                }
                return;
            }
            
            // Hide empty state, show results
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            
            // Build and display table
            const tableHtml = buildResultsTable(results);
            resultsContainer.innerHTML = tableHtml;
            
            // Attach event listeners to buttons
            const onEdit = options.onEdit;
            const onDelete = options.onDelete;
            attachButtonListeners(resultsContainer, onEdit, onDelete);
            
            // Announce results count to screen readers
            if (window.announceToScreenReader) {
                const count = results.length;
                const message = count === 1 
                    ? 'Ditemukan 1 pelanggan'
                    : `Ditemukan ${count} pelanggan`;
                window.announceToScreenReader(message, 'polite');
            }
            
            // Scroll results into view
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
        
        /**
         * Clear search results and show empty state
         */
        clearResults: function() {
            const resultsContainer = document.getElementById('search-results');
            const emptyState = document.getElementById('search-empty-state');
            
            if (resultsContainer) {
                resultsContainer.innerHTML = '';
            }
            
            if (emptyState) {
                emptyState.style.display = 'none';
            }
        }
    };
})();

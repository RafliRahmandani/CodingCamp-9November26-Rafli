/**
 * export-manager.js - Export/Import Manager module
 * 
 * This module provides CSV export/import functionality:
 * - exportToCSV() - export customers to CSV file
 * - importFromCSV(file) - import customers from CSV file
 * 
 * Export Features:
 * - Get all customers from CustomerManager
 * - Convert to CSV format with Indonesian headers
 * - Use BOM for Excel UTF-8 compatibility
 * - Trigger browser download "marketplace-customers-YYYYMMDD.csv"
 * 
 * Import Features:
 * - Parse CSV file using FileReader API
 * - Validate CSV structure and data
 * - Show preview (first 5 rows)
 * - Add confirmation dialog
 * - Call CustomerManager.addCustomer() for each row
 * - Show import summary
 * 
 * Uses IIFE module pattern for encapsulation.
 * Implemented in Task 12.1
 */

const ExportManager = (function() {
  'use strict';
  
  // ========================================
  // CONFIGURATION
  // ========================================
  
  const CONFIG = {
    // CSV column headers (12 data fields)
    HEADERS: [
      'ID Pelanggan',
      'Waktu Transaksi',
      'Nama Barang',
      'Kategori Barang',
      'Harga Barang (Rp)',
      'Kuantitas',
      'Varian Barang',
      'Ongkir (Rp)',
      'Sisa Bayar (Rp)',
      'Total Belanja (Rp)',
      'Nama Pembeli',
      'No Telepon',
      'Alamat'
    ],
    // Corresponding database field names
    FIELDS: [
      'id',
      'timestamp',
      'namaBarang',
      'kategoriBarang',
      'hargaBarang',
      'kuantitas',
      'varianBarang',
      'ongkir',
      'sisaBayar',
      'totalBelanja',
      'namaPembeli',
      'noTelp',
      'alamat'
    ]
  };
  
  // ========================================
  // PRIVATE FUNCTIONS
  // ========================================
  
  /**
   * Get current date in YYYYMMDD format
   * @returns {string} Date string
   */
  function getDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
  
  /**
   * Escape CSV field value to handle special characters
   * - Wrap in quotes if contains comma, newline, or quote
   * - Escape quotes by doubling them
   * @param {any} value - Value to escape
   * @returns {string} Escaped CSV field
   */
  function escapeCSVField(value) {
    const stringValue = String(value || '').trim();
    
    // If contains comma, newline, or quote, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  }
  
  /**
   * Format timestamp to human-readable format
   * @param {string} isoTimestamp - ISO 8601 timestamp
   * @returns {string} Formatted datetime (DD/MM/YYYY HH:mm:ss)
   */
  function formatTimestamp(isoTimestamp) {
    try {
      const date = new Date(isoTimestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      return isoTimestamp || '';
    }
  }
  
  /**
   * Format numeric currency value for Excel
   * @param {number} value - Numeric value
   * @returns {string} Currency without Rp prefix for Excel compatibility
   */
  function formatCurrencyForCSV(value) {
    const num = parseFloat(value) || 0;
    // Return number without formatting - Excel can parse this
    return num.toString();
  }
  
  /**
   * Convert customer object to CSV row
   * @param {Object} customer - Customer data object
   * @returns {string} CSV-formatted row
   */
  function customerToCSVRow(customer) {
    const values = CONFIG.FIELDS.map(field => {
      let value = customer[field];
      
      // Format specific fields
      if (field === 'timestamp') {
        value = formatTimestamp(value);
      } else if (['hargaBarang', 'ongkir', 'sisaBayar', 'totalBelanja'].includes(field)) {
        value = formatCurrencyForCSV(value);
      }
      
      return escapeCSVField(value);
    });
    
    return values.join(',');
  }
  
  /**
   * Create CSV content with headers and data
   * @param {Array} customers - Array of customer objects
   * @returns {string} CSV content with BOM for Excel compatibility
   */
  function createCSVContent(customers) {
    // UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    
    // Create header row
    const headerRow = CONFIG.HEADERS.map(escapeCSVField).join(',');
    
    // Create data rows
    const dataRows = customers.map(customerToCSVRow).join('\n');
    
    // Combine: BOM + headers + data
    return BOM + headerRow + '\n' + dataRows;
  }
  
  /**
   * Trigger browser download of CSV file
   * @param {string} csvContent - CSV content to download
   * @param {string} filename - Filename for download
   */
  function triggerDownload(csvContent, filename) {
    try {
      // Create blob with CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create temporary URL
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Set download attributes
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error triggering download:', error);
      throw new Error('Gagal mendownload file CSV');
    }
  }
  
  // ========================================
  // PUBLIC API
  // ========================================
  
  /**
   * Export all customers to CSV file
   * @returns {Promise<boolean>} True if export successful
   */
  async function exportToCSV() {
    try {
      // Get all customers
      const customers = await CustomerManager.getAll();
      
      // Handle empty data
      if (!customers || customers.length === 0) {
        NotificationManager.warning('Tidak ada data pelanggan untuk diekspor');
        return false;
      }
      
      // Create CSV content
      const csvContent = createCSVContent(customers);
      
      // Generate filename with date
      const dateString = getDateString();
      const filename = `marketplace-customers-${dateString}.csv`;
      
      // Trigger download
      triggerDownload(csvContent, filename);
      
      // Show success notification
      NotificationManager.success(
        `${customers.length} data pelanggan berhasil diekspor: ${filename}`
      );
      
      console.log(`Export berhasil: ${customers.length} records to ${filename}`);
      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      NotificationManager.error(
        `Gagal mengekspor data: ${error.message}`
      );
      return false;
    }
  }
  
  /**
   * Parse CSV content into rows and values
   * Handles quoted fields and escaped quotes
   * @param {string} csvContent - Raw CSV content
   * @returns {Array<Array>} Array of rows, each containing field values
   */
  function parseCSVContent(csvContent) {
    const lines = csvContent.split('\n');
    const rows = [];
    
    // Skip BOM if present
    let startIndex = 0;
    if (lines[0].charCodeAt(0) === 0xFEFF) {
      lines[0] = lines[0].slice(1);
    }
    
    // Parse each line
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      
      // Skip empty lines
      if (!line.trim()) {
        continue;
      }
      
      // Parse CSV row (handles quoted fields)
      const values = [];
      let currentValue = '';
      let insideQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (insideQuotes && line[i + 1] === '"') {
            // Escaped quote
            currentValue += '"';
            i++;
          } else {
            // Toggle quote state
            insideQuotes = !insideQuotes;
          }
        } else if (char === ',' && !insideQuotes) {
          // Field separator
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add last field
      values.push(currentValue.trim());
      
      // Only add rows with data
      if (values.some(v => v)) {
        rows.push(values);
      }
    }
    
    return rows;
  }
  
  /**
   * Show import preview modal with first 5 rows
   * @param {Array<Array>} dataRows - Parsed CSV rows (excluding header)
   * @returns {Promise<boolean>} True if user confirms import, false if cancelled
   */
  function showImportPreview(dataRows) {
    return new Promise((resolve) => {
      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.className = 'import-preview-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;
      
      // Create modal
      const modal = document.createElement('div');
      modal.className = 'import-preview-modal';
      modal.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 30px;
        max-width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        font-family: Arial, sans-serif;
      `;
      
      // Title
      const title = document.createElement('h2');
      title.style.cssText = 'margin: 0 0 15px 0; color: #333;';
      title.textContent = 'Pratinjau Data Import';
      
      // Preview info
      const info = document.createElement('p');
      info.style.cssText = 'margin: 0 0 15px 0; color: #666; font-size: 14px;';
      info.textContent = `Total ${dataRows.length} baris akan diimpor. Menampilkan 5 baris pertama:`;
      
      // Preview table
      const table = document.createElement('table');
      table.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        font-size: 13px;
      `;
      
      // Table header
      const headerRow = table.insertRow();
      headerRow.style.cssText = 'background: #f0f0f0; font-weight: bold; border-bottom: 2px solid #ddd;';
      CONFIG.HEADERS.forEach(header => {
        const cell = headerRow.insertCell();
        cell.textContent = header;
        cell.style.cssText = 'padding: 10px; border: 1px solid #ddd; overflow: hidden; max-width: 150px; text-overflow: ellipsis;';
      });
      
      // Table data (first 5 rows)
      const previewCount = Math.min(5, dataRows.length);
      for (let i = 0; i < previewCount; i++) {
        const row = table.insertRow();
        const values = dataRows[i];
        
        if (values.length >= 13) {
          CONFIG.HEADERS.forEach((_, index) => {
            const cell = row.insertCell();
            cell.textContent = values[index] || '';
            cell.style.cssText = 'padding: 8px; border: 1px solid #eee; overflow: hidden; max-width: 150px; text-overflow: ellipsis; white-space: nowrap;';
          });
          row.style.cssText = i % 2 === 0 ? 'background: #fff;' : 'background: #f9f9f9;';
        }
      }
      
      // Buttons
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Batal';
      cancelBtn.style.cssText = `
        padding: 10px 20px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      `;
      cancelBtn.addEventListener('click', () => {
        overlay.remove();
        resolve(false);
      });
      
      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = 'Lanjutkan Impor';
      confirmBtn.style.cssText = `
        padding: 10px 20px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      `;
      confirmBtn.addEventListener('click', () => {
        overlay.remove();
        resolve(true);
      });
      
      buttonContainer.appendChild(cancelBtn);
      buttonContainer.appendChild(confirmBtn);
      
      // Assemble modal
      modal.appendChild(title);
      modal.appendChild(info);
      modal.appendChild(table);
      modal.appendChild(buttonContainer);
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
    });
  }
  
  /**
   * Import customers from CSV file
   * @param {File} file - CSV file to import
   * @returns {Promise<Object>} Import summary {success, failed, total, duplicates}
   */
  async function importFromCSV(file) {
    return new Promise((resolve) => {
      try {
        if (!file) {
          NotificationManager.error('Pilih file CSV untuk diimpor');
          resolve({ success: 0, failed: 0, total: 0, duplicates: 0 });
          return;
        }
        
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.csv')) {
          NotificationManager.error('File harus berformat CSV (.csv)');
          resolve({ success: 0, failed: 0, total: 0, duplicates: 0 });
          return;
        }
        
        // Read file
        const reader = new FileReader();
        
        reader.onload = async function(event) {
          try {
            const csv = event.target.result;
            const allRows = parseCSVContent(csv);
            
            // Skip header row (line 0)
            if (allRows.length < 2) {
              NotificationManager.error('File CSV kosong atau hanya berisi header');
              resolve({ success: 0, failed: 0, total: 0, duplicates: 0 });
              return;
            }
            
            // Get data rows (skip header)
            const dataRows = allRows.slice(1);
            
            // Show preview and ask for confirmation
            const userConfirmed = await showImportPreview(dataRows);
            if (!userConfirmed) {
              NotificationManager.info('Import dibatalkan');
              resolve({ success: 0, failed: 0, total: 0, duplicates: 0 });
              return;
            }
            
            // Get existing customers for duplicate detection
            const existingCustomers = await CustomerManager.getAll();
            const existingIds = new Set(existingCustomers.map(c => c.id));
            
            let successCount = 0;
            let failedCount = 0;
            let duplicateCount = 0;
            
            // Show progress notification
            NotificationManager.info(`Memproses ${dataRows.length} baris data...`);
            
            // Import each row
            for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
              try {
                const values = dataRows[rowIndex];
                
                // Require minimum fields (skip incomplete rows)
                if (values.length < 13) {
                  failedCount++;
                  continue;
                }
                
                // Check for duplicate ID (if ID field is not empty)
                const importedId = values[0]; // ID is first field
                if (importedId && existingIds.has(importedId)) {
                  duplicateCount++;
                  failedCount++;
                  continue;
                }
                
                // Map values to customer data
                const customerData = {
                  namaBarang: values[2] || '',
                  kategoriBarang: values[3] || '',
                  hargaBarang: parseFloat(values[4]) || 0,
                  kuantitas: parseInt(values[5]) || 0,
                  varianBarang: values[6] || '',
                  ongkir: parseFloat(values[7]) || 0,
                  sisaBayar: parseFloat(values[8]) || 0,
                  totalBelanja: parseFloat(values[9]) || 0,
                  namaPembeli: values[10] || '',
                  noTelp: values[11] || '',
                  alamat: values[12] || ''
                };
                
                // Add customer
                const result = await CustomerManager.create(customerData);
                if (result) {
                  successCount++;
                  existingIds.add(result.id);
                } else {
                  failedCount++;
                }
              } catch (error) {
                console.error('Error importing row:', error);
                failedCount++;
              }
            }
            
            // Show summary
            let summaryMessage = `${successCount} dari ${dataRows.length} data berhasil diimpor`;
            if (duplicateCount > 0) {
              summaryMessage += ` (${duplicateCount} duplikat dihindari)`;
            }
            
            if (successCount > 0) {
              NotificationManager.success(summaryMessage);
            }
            if (failedCount > 0 && successCount === 0) {
              NotificationManager.error('Semua data gagal diimpor. Periksa format file CSV.');
            } else if (failedCount > 0) {
              NotificationManager.warning(
                `${failedCount} data tidak dapat diimpor (format invalid atau duplikat)`
              );
            }
            
            console.log(`Import complete: ${successCount} success, ${failedCount} failed, ${duplicateCount} duplicates`);
            resolve({ 
              success: successCount, 
              failed: failedCount, 
              total: dataRows.length,
              duplicates: duplicateCount
            });
          } catch (error) {
            console.error('Error processing CSV:', error);
            NotificationManager.error(
              `Gagal memproses file: ${error.message}`
            );
            resolve({ success: 0, failed: 0, total: 0, duplicates: 0 });
          }
        };
        
        reader.onerror = function() {
          NotificationManager.error('Gagal membaca file');
          resolve({ success: 0, failed: 0, total: 0, duplicates: 0 });
        };
        
        reader.readAsText(file, 'UTF-8');
      } catch (error) {
        console.error('Error in importFromCSV:', error);
        NotificationManager.error(`Error: ${error.message}`);
        resolve({ success: 0, failed: 0, total: 0, duplicates: 0 });
      }
    });
  }
  
  // ========================================
  // PUBLIC API EXPORT
  // ========================================
  
  return {
    exportToCSV,
    importFromCSV
  };
  
})();

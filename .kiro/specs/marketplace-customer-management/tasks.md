# Implementation Plan: Sistem Manajemen Pelanggan Marketplace Indonesia

## Overview

This implementation plan breaks down the development of a client-side customer management system for Indonesian marketplace vendors. The system uses vanilla JavaScript, HTML, and CSS with LocalStorage for data persistence and Chart.js for visualizations. The architecture follows the IIFE module pattern for encapsulation, with all UI text in Indonesian.

## Tasks

- [x] 1. Project setup and file structure
  - [x] 1.1 Create project directory structure
    - Create `index.html` as main entry point
    - Create `css/` directory with `styles.css` and `responsive.css`
    - Create `js/` directory for all JavaScript modules
    - Create `assets/` directory for any images/icons
    - Add `.gitignore` for node_modules and IDE files
    - _Requirements: Zero backend dependency, GitHub Pages deployment_
  
  - [x] 1.2 Set up HTML boilerplate with CDN dependencies
    - Add HTML5 doctype and meta tags (charset, viewport)
    - Include Chart.js CDN link (v4.x)
    - Add Indonesian language attribute (`<html lang="id">`)
    - Create basic layout structure (header, main, navigation sections)
    - Link CSS and JS files
    - _Requirements: Single external library (Chart.js), Indonesian-first interface_
  
  - [x] 1.3 Initialize Git repository and GitHub Pages
    - Initialize git repository
    - Create README.md with project description in Indonesian
    - Create initial commit
    - Set up GitHub repository
    - Configure GitHub Pages deployment (main branch)
    - _Requirements: GitHub deployment_

- [x] 2. Implement Storage API wrapper module
  - [x] 2.1 Create StorageAPI module with IIFE pattern
    - Create `js/storage-api.js`
    - Implement IIFE module pattern with private state
    - Add methods: `setItem(key, value)`, `getItem(key)`, `removeItem(key)`, `clear()`
    - Add error handling for LocalStorage quota exceeded
    - Add JSON serialization/deserialization for objects
    - Return public API object
    - _Requirements: Zero backend dependency, data sovereignty, modular architecture_
  
  - [ ]* 2.2 Write unit tests for StorageAPI module
    - Test successful storage and retrieval
    - Test quota exceeded error handling
    - Test JSON serialization edge cases
    - Test null/undefined handling
    - _Requirements: Storage layer reliability_

- [x] 3. Implement Authentication Manager module
  - [x] 3.1 Create AuthManager module with login/logout functionality
    - Create `js/auth-manager.js` with IIFE pattern
    - Implement `login(username, password)` method (hardcoded credentials for demo)
    - Implement `logout()` method to clear session
    - Implement `isAuthenticated()` check using sessionStorage
    - Store auth state in sessionStorage (not localStorage for security)
    - Return public API: `{login, logout, isAuthenticated, getCurrentUser}`
    - _Requirements: Authentication module, modular architecture_
  
  - [x] 3.2 Create login UI component
    - Create login form HTML in `index.html` (hidden by default)
    - Add username and password input fields with Indonesian labels
    - Add "Masuk" button with event listener
    - Add error message display area
    - Implement form submission handler calling AuthManager
    - Show/hide login form based on auth state
    - _Requirements: Indonesian-first interface_
  
  - [x] 3.3 Implement logout functionality in UI
    - Add "Keluar" button in navigation
    - Attach click handler to call `AuthManager.logout()`
    - Redirect to login screen after logout
    - Clear any cached UI state
    - _Requirements: Authentication module_

- [x] 4. Implement Navigation Manager for SPA routing
  - [x] 4.1 Create NavigationManager module
    - Create `js/navigation-manager.js` with IIFE pattern
    - Implement route registry: `{'/': 'dashboard', '/form': 'transaksi', '/search': 'pencarian', '/analytics': 'analitik'}`
    - Implement `navigateTo(route)` method
    - Implement hash-based routing using `window.location.hash`
    - Add event listener for `hashchange` event
    - Hide/show sections based on active route
    - Update navigation active states
    - Return public API: `{navigateTo, getCurrentRoute, init}`
    - _Requirements: SPA routing, modular architecture_
  
  - [x] 4.2 Create navigation UI component
    - Add navigation menu in HTML with Indonesian labels
    - Add menu items: "Dashboard", "Tambah Transaksi", "Cari Pelanggan", "Analitik"
    - Style navigation with CSS (horizontal menu on desktop, hamburger on mobile)
    - Attach click handlers to call `NavigationManager.navigateTo()`
    - Add active state styling for current route
    - _Requirements: Indonesian-first interface, responsive design_

- [x] 5. Implement Validation Engine module
  - [x] 5.1 Create ValidationEngine module with Indonesian error messages
    - Create `js/validation-engine.js` with IIFE pattern
    - Implement validation rules object with methods:
      - `required(value, fieldName)` → "fieldName harus diisi"
      - `minLength(value, min, fieldName)` → "fieldName minimal {min} karakter"
      - `maxLength(value, max, fieldName)` → "fieldName maksimal {max} karakter"
      - `email(value)` → "Format email tidak valid"
      - `phone(value)` → "Nomor telepon tidak valid (min 10 digit)"
      - `positiveNumber(value, fieldName)` → "fieldName harus berupa angka positif"
      - `alphanumeric(value, fieldName)` → "fieldName hanya boleh huruf dan angka"
    - Implement `validate(fieldName, value, rules)` method returning `{valid: boolean, errors: string[]}`
    - Return public API: `{validate, rules}`
    - _Requirements: Validation engine, Indonesian error messages_
  
  - [ ]* 5.2 Write unit tests for ValidationEngine
    - Test each validation rule with valid inputs
    - Test each validation rule with invalid inputs
    - Test error message formatting in Indonesian
    - Test combined validation rules
    - _Requirements: Validation reliability_

- [x] 6. Implement Calculation Engine module
  - [x] 6.1 Create CalculationEngine for Total Belanja computation
    - Create `js/calculation-engine.js` with IIFE pattern
    - Implement `calculateTotalBelanja(ongkir, hargaBarang, sisaBayar)` method
    - Formula: `Total = Ongkir + Harga Barang + Sisa Bayar`
    - Add input validation (all must be non-negative numbers)
    - Add formatting method `formatCurrency(number)` returning "Rp X.XXX.XXX"
    - Return public API: `{calculateTotalBelanja, formatCurrency}`
    - _Requirements: Calculation engine, Indonesian currency format_
  
  - [ ]* 6.2 Write unit tests for CalculationEngine
    - Test calculation with valid inputs
    - Test calculation with zero values
    - Test calculation with decimal values
    - Test currency formatting (thousands separator)
    - Test invalid input handling
    - _Requirements: Calculation accuracy_

- [x] 7. Implement Customer Manager module (core CRUD)
  - [x] 7.1 Create CustomerManager module with auto-ID generation
    - Create `js/customer-manager.js` with IIFE pattern
    - Define customer data structure (14 fields): `{id, timestamp, namaBarang, kategoriBarang, hargaBarang, kuantitas, varianBarang, ongkir, sisaBayar, totalBelanja, namaPembeli, noTelp, idPelanggan, alamat}`
    - Implement auto-ID generation: `generateCustomerId()` → "CUST-YYYYMMDD-XXXX"
    - Implement `addCustomer(customerData)` method with validation
    - Implement `getCustomer(id)` method
    - Implement `updateCustomer(id, customerData)` method
    - Implement `deleteCustomer(id)` method
    - Implement `getAllCustomers()` method
    - Use StorageAPI for persistence (key: 'marketplace_customers')
    - Return public API: `{addCustomer, getCustomer, updateCustomer, deleteCustomer, getAllCustomers, generateCustomerId}`
    - _Requirements: Customer Manager module, CRUD operations, auto-ID generation_
  
  - [ ]* 7.2 Write unit tests for CustomerManager
    - Test customer creation with valid data
    - Test auto-ID generation uniqueness
    - Test customer retrieval by ID
    - Test customer update
    - Test customer deletion
    - Test getAllCustomers with multiple records
    - _Requirements: CRUD reliability_

- [ ] 8. Implement Transaction Form with 14 fields
  - [x] 8.1 Create transaction form HTML structure
    - Create form section with Indonesian labels for 14 fields:
      1. Timestamp (auto-generated, read-only)
      2. Nama Barang (text input, required)
      3. Kategori Barang (select dropdown, required)
      4. Harga Barang (number input, required, min 0)
      5. Kuantitas (number input, required, min 1)
      6. Varian Barang (text input, optional)
      7. Ongkir (number input, required, min 0)
      8. Sisa Bayar (number input, required, min 0)
      9. Total Belanja (calculated field, read-only)
      10. Nama Pembeli (text input, required)
      11. No Telp (text input, required, min 10 digits)
      12. ID Pelanggan (auto-generated, read-only)
      13. Alamat (textarea, required)
      14. Status (select: "Pending", "Selesai", "Dibatalkan")
    - Add error message spans below each field
    - Add "Simpan" and "Reset" buttons
    - _Requirements: Transaction form with 14 fields, Indonesian UI_
  
  - [x] 8.2 Implement real-time field validation
    - Attach blur event listeners to all input fields
    - Call ValidationEngine for each field on blur
    - Display Indonesian error messages inline
    - Add visual indicators (red border for errors, green for valid)
    - Validate phone number format (min 10 digits)
    - Validate required fields
    - _Requirements: Real-time validation, Indonesian error messages_
  
  - [x] 8.3 Implement auto-calculation of Total Belanja
    - Attach input event listeners to Ongkir, Harga Barang, Sisa Bayar fields
    - Call CalculationEngine.calculateTotalBelanja() on any change
    - Update Total Belanja field with formatted currency
    - Recalculate on Kuantitas change (multiply Harga Barang)
    - _Requirements: Calculation engine integration_
  
  - [~] 8.4 Implement form submission handler
    - Validate all fields before submission
    - Show error summary if validation fails
    - Generate timestamp and customer ID
    - Call CustomerManager.addCustomer() with form data
    - Show success message "Data pelanggan berhasil disimpan"
    - Reset form after successful submission
    - Handle LocalStorage quota exceeded errors
    - _Requirements: Form submission, CRUD operations_

- [x] 9. Implement Search module
  - [x] 9.1 Create search UI component
    - Create search section HTML with Indonesian labels
    - Add search input field with placeholder "Cari ID Pelanggan"
    - Add "Cari" button
    - Add results display area (table format)
    - Style search results table with responsive design
    - _Requirements: Search functionality, Indonesian UI_
  
  - [x] 9.2 Implement search functionality
    - Create `js/search-manager.js` with IIFE pattern
    - Implement `searchByCustomerId(query)` method
    - Call CustomerManager.getAllCustomers() and filter by ID
    - Support partial ID matching (case-insensitive)
    - Display results in table format (all 14 fields)
    - Show "Tidak ada hasil" message if no matches
    - Add edit/delete buttons for each result row
    - Return public API: `{searchByCustomerId, displayResults}`
    - _Requirements: Search by customer ID_
  
  - [x] 9.3 Implement edit and delete actions from search results
    - Add edit button handler to populate form with customer data
    - Navigate to transaction form with pre-filled data
    - Add delete button handler with confirmation dialog
    - Show Indonesian confirmation: "Apakah Anda yakin ingin menghapus?"
    - Call CustomerManager.deleteCustomer() on confirm
    - Refresh search results after delete
    - _Requirements: CRUD operations from search interface_

- [x] 10. Implement Dashboard with 4 KPI cards
  - [x] 10.1 Create dashboard HTML structure
    - Create dashboard section with 4 KPI card containers
    - Add Indonesian labels for each KPI:
      1. "Total Pelanggan"
      2. "Total Pendapatan"
      3. "Rata-rata Nilai Transaksi"
      4. "Transaksi Bulan Ini"
    - Style cards with CSS grid/flexbox (responsive 2x2 on desktop, stacked on mobile)
    - Add loading state placeholders
    - _Requirements: Dashboard with 4 KPIs, responsive design_
  
  - [x] 10.2 Create DashboardManager module for KPI calculations
    - Create `js/dashboard-manager.js` with IIFE pattern
    - Implement KPI calculation methods:
      - `getTotalCustomers()` → count of all customers
      - `getTotalRevenue()` → sum of all Total Belanja
      - `getAverageTransactionValue()` → average Total Belanja
      - `getMonthlyTransactions()` → count of transactions this month
    - Implement `renderKPIs()` method to update DOM
    - Use CalculationEngine for currency formatting
    - Add caching to avoid recalculation on every render
    - Return public API: `{renderKPIs, refreshData}`
    - _Requirements: Dashboard KPI calculations, performance (render within 1 second)_
  
  - [ ]* 10.3 Write unit tests for DashboardManager calculations
    - Test KPI calculations with sample data
    - Test monthly transaction filtering
    - Test average calculation with zero transactions
    - Test currency formatting in KPI display
    - _Requirements: KPI calculation accuracy_

- [x] 11. Implement Analytics Dashboard with 5 Chart.js visualizations
  - [x] 11.1 Create analytics HTML structure with 5 canvas elements
    - Create analytics section with 5 chart containers
    - Add canvas elements with IDs: `categoryChart`, `revenueChart`, `customerChart`, `statusChart`, `trendChart`
    - Add Indonesian chart titles:
      1. "Penjualan per Kategori" (Pie Chart)
      2. "Pendapatan Bulanan" (Bar Chart)
      3. "Top 10 Pelanggan" (Horizontal Bar Chart)
      4. "Status Transaksi" (Doughnut Chart)
      5. "Tren Penjualan" (Line Chart)
    - Style chart containers with responsive grid layout
    - _Requirements: Analytics dashboard with 5 Chart.js visualizations_
  
  - [x] 11.2 Create ChartManager module for data processing
    - Create `js/chart-manager.js` with IIFE pattern
    - Implement data aggregation methods:
      - `aggregateByCategory()` → {category: total} for pie chart
      - `aggregateMonthlyRevenue()` → {month: revenue} for bar chart
      - `getTopCustomers(limit)` → top N customers by total spending
      - `aggregateByStatus()` → {status: count} for doughnut chart
      - `getTrendData()` → daily/weekly transaction counts for line chart
    - Implement Chart.js configuration objects for each chart type
    - Add Indonesian labels and formatting
    - Return public API: `{renderCharts, destroyCharts, refreshData}`
    - _Requirements: Chart.js integration, data visualization_
  
  - [x] 11.3 Implement chart rendering with Chart.js
    - Initialize Chart.js instances for all 5 charts
    - Configure responsive: true for all charts
    - Use Indonesian locale for date/number formatting
    - Add color palette (professional, accessible colors)
    - Implement chart destruction before re-rendering (prevent memory leaks)
    - Add error handling for empty datasets
    - Ensure charts render within 2 seconds (performance requirement)
    - _Requirements: Chart rendering performance, responsive design_
  
  - [ ]* 11.4 Write integration tests for chart rendering
    - Test chart initialization with sample data
    - Test chart updates when data changes
    - Test responsive behavior (chart resize)
    - Test error handling with empty data
    - _Requirements: Chart rendering reliability_

- [x] 12. Implement Export/Import CSV functionality
  - [x] 12.1 Create export UI and functionality
    - Add "Ekspor ke CSV" button in dashboard
    - Create `js/export-manager.js` with IIFE pattern
    - Implement `exportToCSV()` method:
      - Get all customers from CustomerManager
      - Convert to CSV format with Indonesian column headers
      - Use BOM for Excel compatibility (UTF-8 with BOM)
      - Trigger browser download with filename "pelanggan-YYYYMMDD.csv"
    - Handle empty data case
    - Return public API: `{exportToCSV, importFromCSV}`
    - _Requirements: Export to CSV functionality_
  
  - [x] 12.2 Create import UI and functionality
    - Add "Impor dari CSV" button with file input
    - Implement `importFromCSV(file)` method:
      - Parse CSV file using FileReader API
      - Validate CSV structure and data
      - Show preview before import (first 5 rows)
      - Add confirmation dialog with Indonesian message
      - Call CustomerManager.addCustomer() for each valid row
      - Show import summary: "X data berhasil diimpor, Y gagal"
    - Handle duplicate ID errors
    - Handle malformed CSV errors
    - _Requirements: Import from CSV functionality_
  
  - [ ]* 12.3 Write unit tests for CSV export/import
    - Test CSV generation with special characters
    - Test CSV parsing with various formats
    - Test import validation logic
    - Test handling of duplicate records
    - _Requirements: CSV functionality reliability_

- [x] 13. Implement responsive CSS with mobile/tablet/desktop breakpoints
  - [x] 13.1 Create base styles in styles.css
    - Define CSS custom properties for colors, fonts, spacing
    - Create typography styles (Indonesian text support)
    - Style form elements with consistent appearance
    - Style buttons with hover/active states
    - Add loading spinner styles
    - Create modal/dialog styles for confirmations
    - _Requirements: Indonesian UI, progressive enhancement_
  
  - [x] 13.2 Create responsive layout in responsive.css
    - Define breakpoints:
      - Mobile: 320px - 767px
      - Tablet: 768px - 1023px
      - Desktop: 1024px+
    - Implement mobile-first approach
    - Make navigation hamburger menu on mobile
    - Stack KPI cards vertically on mobile (2x2 grid on desktop)
    - Make form single column on mobile
    - Make tables horizontally scrollable on mobile
    - Make charts responsive (full width on mobile)
    - Test on viewport sizes 320px - 1920px
    - _Requirements: Responsive design (320px - 1920px)_
  
  - [x] 13.3 Add accessibility features
    - Add ARIA labels for all interactive elements
    - Ensure keyboard navigation works (tab order)
    - Add focus indicators for keyboard users
    - Use semantic HTML elements
    - Ensure color contrast meets WCAG AA standards
    - Add skip-to-content link
    - _Requirements: Progressive enhancement, browser support_

- [ ] 14. Implement error handling and user feedback
  - [x] 14.1 Create notification system
    - Create `js/notification-manager.js` with IIFE pattern
    - Implement toast notification component
    - Support types: success, error, warning, info
    - Add Indonesian messages for all notification types
    - Implement auto-dismiss after 5 seconds
    - Add close button for manual dismiss
    - Position notifications (top-right corner)
    - Return public API: `{showSuccess, showError, showWarning, showInfo}`
    - _Requirements: Form submission feedback (within 500ms)_
  
  - [x] 14.2 Implement LocalStorage quota error handling
    - Detect QuotaExceededError when saving data
    - Show Indonesian error message: "Penyimpanan penuh. Hapus data lama atau ekspor ke CSV."
    - Suggest actions: export old data, delete records
    - Prevent data loss by catching errors before save
    - _Requirements: Data sovereignty, error handling_
  
  - [x] 14.3 Add loading states for async operations
    - Create `js/loading-manager.js` with IIFE pattern
    - Implement showOverlay() for full-screen blocking operations
    - Implement showButtonLoading() for form submission spinners
    - Implement showElementLoading() for container loading indicators
    - Implement disableFormButtons() for bulk button disabling
    - Add .loading CSS class with animated spinner
    - Show "Memproses..." status message
    - Add 30-second timeout for all operations
    - Auto-clear loading state on completion/error
    - Handle timeout scenarios gracefully
    - Return public API: `{showOverlay, hideOverlay, showButtonLoading, hideButtonLoading, showElementLoading, hideElementLoading, disableFormButtons, enableFormButtons, clearAll, getActiveCount, isOverlayVisible}`
    - Add loading states to form submission (Task 8.4)
    - Add loading states to search operations (Task 9.2)
    - Add loading states to chart rendering (Task 11.3)
    - _Requirements: Loading states visible, buttons disabled, timeouts handled, accessibility features_

- [x] 15. Performance optimization
  - [x] 15.1 Implement data caching strategy
    - Cache customer list in memory after first load
    - Invalidate cache on add/update/delete operations
    - Implement debouncing for search input (300ms delay)
    - Implement throttling for window resize events (chart redraw)
    - Lazy load Chart.js library (only on analytics page)
    - _Requirements: Performance (1000+ records without degradation)_
  
  - [x] 15.2 Optimize LocalStorage operations
    - Batch multiple reads into single operation
    - Use compression for large datasets (JSON.stringify optimization)
    - Implement pagination for large customer lists (50 per page)
    - Add virtual scrolling for search results table
    - Monitor and warn when approaching 5MB quota (80% threshold)
    - _Requirements: Storage efficiency, performance_
  
  - [ ]* 15.3 Write performance tests
    - Test page load time with 1000 customers
    - Test dashboard KPI calculation time
    - Test chart rendering time
    - Test form submission response time
    - Verify all operations meet performance criteria
    - _Requirements: Success criteria (load/render times)_

- [x] 16. Browser compatibility testing
  - [x] 16.1 Test on target browsers
    - Test on Chrome 90+ (desktop and mobile)
    - Test on Firefox 88+ (desktop and mobile)
    - Test on Edge 90+
    - Test on Safari 14+ (desktop and iOS)
    - Document any browser-specific issues
    - _Requirements: Browser support (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)_
  
  - [x] 16.2 Add polyfills if needed
    - Check LocalStorage API support
    - Check ES6+ features used (arrow functions, template literals, etc.)
    - Add fallbacks for unsupported features
    - Test with browser developer tools (device emulation)
    - _Requirements: Progressive enhancement_

- [x] 17. Final integration and testing
  - [x] 17.1 End-to-end workflow testing
    - Test complete user journey: login → add transaction → search → view dashboard → view analytics → export → logout
    - Test data persistence across page refreshes
    - Test navigation between all pages
    - Test responsive behavior on different screen sizes
    - Test with 100, 500, 1000 customer records
    - _Requirements: All functional requirements_
  
  - [ ]* 17.2 Write comprehensive integration tests
    - Test module interactions (CustomerManager + StorageAPI)
    - Test UI component integration (Form + ValidationEngine + CustomerManager)
    - Test error scenarios (quota exceeded, invalid data)
    - Test edge cases (empty datasets, special characters)
    - _Requirements: System reliability_
  
  - [x] 17.3 User acceptance testing preparation
    - Create test data set (50+ sample customers)
    - Create user guide in Indonesian (README.md section)
    - Document known limitations
    - Create troubleshooting guide for common issues
    - _Requirements: User documentation_

- [ ] 18. Deployment and documentation
  - [x] 18.1 Prepare for GitHub Pages deployment
    - Verify all file paths are relative (no absolute paths)
    - Test locally with Live Server or Python http.server
    - Optimize file sizes (minify CSS/JS if needed)
    - Add favicon and meta tags for social sharing
    - Create deployment branch if needed
    - _Requirements: GitHub deployment_
  
  - [-] 18.2 Create comprehensive README.md
    - Add project title and description in Indonesian
    - Add features list with screenshots
    - Add installation/setup instructions
    - Add usage guide with examples
    - Add technical architecture overview
    - Add browser compatibility notes
    - Add troubleshooting section
    - Add license information
    - _Requirements: Documentation_
  
  - [-] 18.3 Deploy to GitHub Pages
    - Push code to GitHub repository
    - Enable GitHub Pages in repository settings
    - Configure custom domain if applicable
    - Test deployed site functionality
    - Verify all features work in production
    - Share live URL for user testing
    - _Requirements: GitHub deployment_

- [~] 19. Checkpoint - Final review
  - Ensure all core features are implemented and tested
  - Verify performance meets success criteria (page load < 2s, dashboard KPIs < 1s, charts < 2s)
  - Verify responsive design works on all screen sizes (320px - 1920px)
  - Verify all UI text is in Indonesian
  - Verify data persists in LocalStorage correctly
  - Ask user if any adjustments are needed before deployment

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- All implementation uses vanilla JavaScript (no frameworks) with IIFE module pattern
- Only external dependency is Chart.js CDN for data visualizations
- All UI text, error messages, and labels must be in Indonesian language
- Data stored in browser LocalStorage (5-10MB typical quota)
- Target browsers: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- Deployment target: GitHub Pages static hosting
- Performance targets: page load < 2s, dashboard < 1s, charts < 2s, form feedback < 500ms
- Must handle 1000+ customer records without performance degradation
- Responsive design required for 320px - 1920px screen widths

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1", "5.1", "6.1"] },
    { "id": 2, "tasks": ["2.2", "3.1", "5.2", "6.2"] },
    { "id": 3, "tasks": ["3.2", "4.1", "7.1"] },
    { "id": 4, "tasks": ["3.3", "4.2", "7.2", "13.1"] },
    { "id": 5, "tasks": ["7.3", "7.4", "13.2"] },
    { "id": 6, "tasks": ["8.1", "9.1", "10.1", "11.1", "13.3", "14.1"] },
    { "id": 7, "tasks": ["8.2", "9.2", "10.2", "11.2", "14.2"] },
    { "id": 8, "tasks": ["8.3", "9.3", "10.3", "11.3", "12.1", "14.3"] },
    { "id": 9, "tasks": ["11.4", "12.2", "15.1"] },
    { "id": 10, "tasks": ["12.3", "15.2"] },
    { "id": 11, "tasks": ["15.3", "16.1"] },
    { "id": 12, "tasks": ["16.2", "17.1"] },
    { "id": 13, "tasks": ["17.2", "17.3", "18.1"] },
    { "id": 14, "tasks": ["18.2", "18.3"] }
  ]
}
```

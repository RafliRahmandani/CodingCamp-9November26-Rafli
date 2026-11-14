# UAT Execution Checklist: Sistem Manajemen Pelanggan Marketplace Indonesia

**Document Version:** 1.0  
**Date:** November 2024  
**Purpose:** Step-by-step guide for executing UAT test cases  

---

## PRE-UAT SETUP PHASE

### Environment Preparation

- [ ] **1. Verify Test Environment**
  - Application URL is accessible: ________________
  - Browser is updated to latest version (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
  - JavaScript is enabled in browser
  - Cookies and LocalStorage are enabled
  - No browser extensions interfering: ________________
  - DevTools F12 works properly

- [ ] **2. Load Test Data**
  - 50+ sample customer records loaded (via CSV import or manual entry)
  - Dashboard displays correct customer count
  - Sample data includes various categories, statuses, and dates
  - Edge case data loaded
  - Verified data persistence after page refresh

- [ ] **3. Clear Application State**
  - Logout if previously logged in
  - Clear browser cache (Ctrl+Shift+Delete)
  - Clear LocalStorage (DevTools > Application > LocalStorage > Clear All)
  - Close all browser tabs with application
  - Restart browser
  - Application loads to fresh login screen

- [ ] **4. Set Up Test Environment**
  - Test machine has stable internet connection (minimum 2 Mbps)
  - No VPN or proxy blocking resources
  - Screen resolution set to at least 1024×768
  - Mobile device or emulator ready for responsive testing
  - Screen recording tool ready (optional, for bug documentation)
  - Test data spreadsheet open for reference
  - Bug report template ready

- [ ] **5. Test Team Orientation**
  - All testers understand UAT objectives
  - Testers have access to test plan and test cases
  - Testers understand pass/fail criteria
  - Escalation path is clear
  - Contact information for support documented

**Pre-UAT Setup Date:** ________________  
**Completed By:** ________________  
**Sign-Off:** ________________  

---

## UAT EXECUTION PHASES

## PHASE 1: AUTHENTICATION TESTING (Est. Time: 30 minutes)

### Day 1 - Morning Session

#### TC-001: Login with Valid Credentials
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Open browser
  [ ] Navigate to application URL
  [ ] Verify login form displays

Test Execution:
  [ ] Enter username
  [ ] Enter password
  [ ] Click "Masuk" button
  [ ] Wait for navigation
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________  Signature: ________________
```

#### TC-002: Login with Empty Username
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Leave Username field empty
  [ ] Enter password
  [ ] Click "Masuk"
  
Expected Behavior: Error message appears
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-003: Login with Empty Password
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Enter username
  [ ] Leave Password field empty
  [ ] Click "Masuk"
  
Expected Behavior: Error message appears
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-004: Logout Functionality
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] User must be logged in
  [ ] Dashboard visible
  
Test Execution:
  [ ] Locate "Keluar" button
  [ ] Click "Keluar" button
  [ ] Observe login screen
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-005: Session Persistence After Page Refresh
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] User logged in
  [ ] Dashboard displayed
  
Test Execution:
  [ ] Press F5 to refresh page
  [ ] Wait for page to reload
  [ ] Verify user still logged in
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-006: Session Timeout
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] User logged in
  [ ] Leave application idle
  
Test Execution:
  [ ] Wait 10 minutes idle
  [ ] Return and attempt action
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

**Phase 1 Complete:** ________________  
**All Passed:** [ ] YES  [ ] NO  
**Issues Found:** ___ (count)  

---

## PHASE 2: CUSTOMER MANAGEMENT TESTING (Est. Time: 60 minutes)

### Day 1 - Late Morning / Early Afternoon

#### TC-007: Add New Transaction with All Valid Data
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Navigate to "Tambah Transaksi"
  [ ] Form is empty and ready
  
Test Execution Steps:
  [ ] Step 1: Enter "Laptop Dell XPS 13" in Nama Barang
  [ ] Step 2: Select "Elektronik" from Kategori
  [ ] Step 3: Enter "8500000" in Harga Barang
  [ ] Step 4: Enter "1" in Kuantitas
  [ ] Step 5: Enter "Gaming" in Varian
  [ ] Step 6: Enter "100000" in Ongkir
  [ ] Step 7: Enter "0" in Sisa Bayar
  [ ] Step 8: Verify Total Belanja shows "Rp 8.600.000"
  [ ] Step 9: Enter "Budi Santoso" in Nama Pembeli
  [ ] Step 10: Enter "08123456789" in No Telp
  [ ] Step 11: Enter address in Alamat
  [ ] Step 12: Select "Selesai" from Status
  [ ] Step 13: Click "Simpan"
  [ ] Step 14: Verify success notification
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-008: Add Transaction with Negative Price
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Navigate to "Tambah Transaksi"
  
Test Execution:
  [ ] Fill all required fields except Harga Barang
  [ ] Enter "-5000" in Harga Barang
  [ ] Try to submit form
  
Expected: Error message appears, form not submitted
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-009: Add Transaction with Invalid Phone Number
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Fill all required fields except No Telp
  [ ] Enter "123" in No Telp
  [ ] Click away from field (blur event)
  
Expected: Error message: "Nomor telepon tidak valid (min 10 digit)"
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-010: Auto-Calculation of Total Belanja
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Enter "5000000" in Harga Barang → Verify Total
  [ ] Enter "2" in Kuantitas → Verify Total shows "Rp 10.000.000"
  [ ] Enter "50000" in Ongkir → Verify Total shows "Rp 10.050.000"
  [ ] Enter "100000" in Sisa Bayar → Verify Total shows "Rp 10.150.000"
  
Expected: Total recalculates correctly with each entry
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-011: Form Reset Button
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Fill out all form fields
  [ ] Click "Reset" button
  [ ] Verify all fields cleared
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-012: Add Transaction with Required Field Empty
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Fill all fields except Nama Pembeli
  [ ] Leave Nama Pembeli empty
  [ ] Click "Simpan"
  
Expected: Error message appears, form not submitted
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

**Phase 2 Complete:** ________________  
**All Passed:** [ ] YES  [ ] NO  
**Issues Found:** ___ (count)  

---

## PHASE 3: SEARCH & FILTERING (Est. Time: 45 minutes)

### Day 1 - Afternoon

#### TC-013: Search for Existing Customer by ID
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Navigate to "Cari Pelanggan"
  [ ] Note a Customer ID from earlier transactions
  
Test Execution:
  [ ] Enter Customer ID in search field
  [ ] Click "Cari" button
  [ ] Observe results display
  
Expected: Result table appears with customer data
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-014: Search with Partial ID Matching
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Enter partial Customer ID (e.g., "CUST-20241115")
  [ ] Click "Cari" button
  [ ] Observe if multiple results returned
  
Expected: Multiple matching records returned
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-015: Search with No Results
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Enter non-existent Customer ID (e.g., "CUST-99999999-9999")
  [ ] Click "Cari" button
  
Expected: Message "Tidak ada hasil" appears
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-016: Edit Customer from Search Results
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Search for existing customer
  [ ] Click "Edit" button on result row
  [ ] Verify form pre-populated with data
  [ ] Modify one field (e.g., change quantity)
  [ ] Click "Simpan"
  [ ] Search again to verify update
  
Expected: Customer record updated successfully
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-017: Delete Customer from Search Results
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Search for customer
  [ ] Click "Hapus" (Delete) button
  [ ] Confirm deletion when prompted
  [ ] Verify customer removed from results
  
Expected: Confirmation dialog appears, record deleted
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-018: Cancel Delete Operation
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Search for customer
  [ ] Click "Hapus" button
  [ ] Click "Batal" (Cancel) on confirmation
  [ ] Verify customer still in results
  
Expected: Customer record NOT deleted
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-019: Search Result Table Scrolling (Mobile)
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Switch to mobile view (DevTools > Device Emulation, 375px)
  
Test Execution:
  [ ] Search for customer on mobile view
  [ ] Attempt to scroll horizontally to see all columns
  [ ] Verify all 14 fields accessible
  
Expected: Horizontal scroll works, all data visible
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-020: Search Performance with Large Dataset
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Ensure 1000+ records loaded (if available)
  
Test Execution:
  [ ] Perform search that returns 50+ results
  [ ] Measure/observe time to display results
  [ ] Scroll through results
  
Expected: Results display within 300ms, smooth scrolling
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

**Phase 3 Complete:** ________________  
**All Passed:** [ ] YES  [ ] NO  
**Issues Found:** ___ (count)  

---

## PHASE 4: DASHBOARD & KPIs (Est. Time: 45 minutes)

### Day 2 - Morning

#### TC-021: Dashboard KPI - Total Customers Display
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Navigate to Dashboard
  
Test Execution:
  [ ] Locate "Total Pelanggan" card
  [ ] Count total records added (or check against expected)
  [ ] Verify displayed number matches
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-022: Dashboard KPI - Total Revenue Calculation
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Locate "Total Pendapatan" card
  [ ] Verify value is formatted as Indonesian currency
  [ ] Spot-check calculation (sum of few records manually)
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-023: Dashboard KPI - Average Transaction Value
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Locate "Rata-rata Nilai Transaksi" card
  [ ] Calculate: Total Revenue ÷ Customer Count
  [ ] Compare with displayed value
  
Expected: Average calculated correctly
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-024: Dashboard KPI - Monthly Transactions
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Locate "Transaksi Bulan Ini" card
  [ ] Count transactions from current month in test data
  [ ] Compare with displayed value
  
Expected: Correct count for current month
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-025: Dashboard KPI Cards Layout - Desktop
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Ensure browser at 1024px+ width (desktop view)
  
Test Execution:
  [ ] View Dashboard
  [ ] Observe layout of 4 KPI cards
  [ ] Verify 2×2 grid arrangement
  
Expected: Professional 2×2 grid layout
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-026: Dashboard KPI Cards Layout - Mobile
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Switch to mobile view (375px width)
  
Test Execution:
  [ ] View Dashboard on mobile
  [ ] Verify cards stack vertically
  [ ] Scroll to see all 4 cards
  [ ] Verify readability
  
Expected: Vertical stack, readable on mobile
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-027: Dashboard Refresh Updates KPIs
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Note current KPI values on Dashboard
  
Test Execution:
  [ ] Navigate to "Tambah Transaksi"
  [ ] Add new customer with Rp 2.000.000 Total Belanja
  [ ] Navigate back to Dashboard
  [ ] Verify all KPIs updated
  
Expected: Total Pelanggan +1, Total Pendapatan +Rp 2M, etc.
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-028: Dashboard with No Data
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Clear all data (DevTools > Clear All)
  [ ] Navigate to Dashboard
  
Test Execution:
  [ ] Observe KPI values with zero records
  
Expected: Total Pelanggan: 0, all values show 0 or N/A
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

**Phase 4 Complete:** ________________  
**All Passed:** [ ] YES  [ ] NO  
**Issues Found:** ___ (count)  

---

## PHASE 5: ANALYTICS & CHARTS (Est. Time: 60 minutes)

### Day 2 - Late Morning / Afternoon

#### TC-029: Category Sales Chart (Pie Chart)
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Navigate to "Analitik" (Analytics)
  
Test Execution:
  [ ] Locate "Penjualan per Kategori" pie chart
  [ ] Observe chart rendering
  [ ] Verify categories displayed
  
Expected: Pie chart displays with proper data
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-030: Monthly Revenue Chart (Bar Chart)
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Locate "Pendapatan Bulanan" bar chart
  [ ] Observe data visualization
  [ ] Verify months displayed on X-axis
  
Expected: Bar chart shows monthly revenue data
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-031: Top 10 Customers Chart
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Locate "Top 10 Pelanggan" horizontal bar chart
  [ ] Verify customers ordered by spending
  [ ] Check if top spender is highest bar
  
Expected: Horizontal bar chart with correct ordering
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-032: Transaction Status Chart (Doughnut)
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Locate "Status Transaksi" doughnut chart
  [ ] Observe status segments (Pending, Selesai, Dibatalkan)
  [ ] Verify proportions
  
Expected: Doughnut chart displays all transaction statuses
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-033: Sales Trend Chart (Line Chart)
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Locate "Tren Penjualan" line chart
  [ ] Observe trend line
  [ ] Verify time progression on X-axis
  
Expected: Line chart shows sales trend over time
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-034: Chart Responsiveness on Mobile
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Switch to mobile view (375px)
  
Test Execution:
  [ ] View Analytics page on mobile
  [ ] Scroll through all 5 charts
  [ ] Verify each chart renders properly
  
Expected: All charts responsive, readable on mobile
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

**Phase 5 Complete:** ________________  
**All Passed:** [ ] YES  [ ] NO  
**Issues Found:** ___ (count)  

---

## PHASE 6: CSV EXPORT/IMPORT (Est. Time: 45 minutes)

### Day 2 - Late Afternoon

#### TC-035: Export Data to CSV File
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Navigate to Dashboard
  [ ] Verify customer data exists
  
Test Execution:
  [ ] Click "Ekspor CSV" button
  [ ] Wait for file download
  [ ] Verify filename format: pelanggan-YYYYMMDD.csv
  
Expected: CSV file downloads with current date
Pass/Fail: [ ] PASS  [ ] FAIL

Download File: ________________  
Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-036: Export CSV Content Verification
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Open exported CSV in Excel or LibreOffice Calc
  
Test Execution:
  [ ] Verify headers are in Indonesian
  [ ] Count rows (should match customer count)
  [ ] Spot-check data accuracy
  [ ] Verify special characters preserved
  
Expected: CSV properly formatted with all data
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-037: Import Valid CSV File
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Prepare valid CSV file with test data
  [ ] Clear application data to test fresh import
  
Test Execution:
  [ ] Click "Impor CSV" button
  [ ] Select CSV file
  [ ] Review import preview
  [ ] Confirm import
  [ ] Verify new records appear in application
  
Expected: All records imported successfully
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-038: Import CSV with Duplicate IDs
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Load initial test data
  [ ] Prepare CSV with duplicate IDs
  
Test Execution:
  [ ] Click "Impor CSV"
  [ ] Select CSV with duplicates
  [ ] Observe preview and import handling
  
Expected: Duplicates handled appropriately (skip or warning)
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-039: Import CSV with Invalid Format
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Prepare intentionally malformed CSV
  
Test Execution:
  [ ] Click "Impor CSV"
  [ ] Select invalid CSV
  [ ] Observe error handling
  
Expected: Error message shown, import prevented
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-040: Import CSV with Special Characters
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Pre-Test Actions:
  [ ] Prepare CSV with Indonesian characters and symbols
  
Test Execution:
  [ ] Import CSV with special characters
  [ ] Verify data imported correctly
  [ ] Search for record to verify special chars preserved
  
Expected: Special characters preserved in import
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

**Phase 6 Complete:** ________________  
**All Passed:** [ ] YES  [ ] NO  
**Issues Found:** ___ (count)  

---

## PHASE 7: FORM VALIDATION (Est. Time: 45 minutes)

### Day 3 - Morning

#### TC-041: Real-Time Field Validation - Empty Required Field
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Click "Nama Barang" field
  [ ] Click away without entering text
  [ ] Observe error message
  
Expected: Error "Nama Barang harus diisi" appears
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-042: Field Length Validation
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Enter 2 characters in "Nama Pembeli"
  [ ] Click away from field
  [ ] Observe validation
  
Expected: Error about minimum length appears if applicable
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-043: Invalid Email Format
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] If email field exists, enter "notanemail"
  [ ] Click away from field
  
Expected: Email validation error or N/A if field doesn't exist
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-044: Decimal Values in Currency Fields
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Enter "100.50" in Harga Barang
  [ ] Enter "50.25" in Ongkir
  [ ] Verify Total Belanja calculation
  
Expected: Decimals handled correctly in calculation
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-045: Maximum Field Length
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Enter 500+ characters in Alamat field
  [ ] Try to submit form
  
Expected: Data saved completely or max length enforced gracefully
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-046: Multiple Errors in Form
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Leave Nama Barang empty
  [ ] Enter "123" in No Telp (too short)
  [ ] Enter "-500" in Harga Barang
  [ ] Click Simpan
  
Expected: All three errors displayed, form not submitted
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-047: Validation Error Message Clarity
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Review error messages displayed in forms
  [ ] Verify messages are in Indonesian
  [ ] Check if messages clearly explain what to fix
  
Expected: Clear, actionable Indonesian error messages
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-048: Category Selection from Dropdown
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Click Kategori Barang dropdown
  [ ] Observe available options
  [ ] Select "Elektronik"
  [ ] Submit form with category
  
Expected: Dropdown works, category accepted
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

**Phase 7 Complete:** ________________  
**All Passed:** [ ] YES  [ ] NO  
**Issues Found:** ___ (count)  

---

## PHASE 8: DATA PERSISTENCE & ERROR HANDLING (Est. Time: 30 minutes)

### Day 3 - Late Morning

#### TC-049: Data Persistence Across Page Refresh
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Note current KPI values
  [ ] Add new customer
  [ ] Refresh page (F5)
  [ ] Verify new customer persists
  
Expected: Customer data preserved after refresh
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-050: LocalStorage Quota Error Handling
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Add large records until quota approached
  [ ] Add one more record when approaching limit
  [ ] Observe error handling
  
Expected: Clear error message, graceful handling
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-051: Browser Close/Crash Recovery
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Partially fill form (don't save)
  [ ] Close browser tab
  [ ] Reopen application
  [ ] Verify previous data recovered appropriately
  
Expected: No data loss on application data
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-052: Storage Warning at Threshold
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Continue adding records
  [ ] Reach 80% storage capacity
  [ ] Observe if warning displays
  
Expected: Optional warning displayed near limit
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

**Phase 8 Complete:** ________________  
**All Passed:** [ ] YES  [ ] NO  
**Issues Found:** ___ (count)  

---

## PHASE 9: CROSS-BROWSER & RESPONSIVE (Est. Time: 90 minutes)

### Day 3 - Afternoon & Day 4 - Morning

#### TC-053: Chrome Browser Compatibility
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Browser Version: Chrome ________  
Platform: [ ] Windows  [ ] macOS  [ ] Linux

Test Execution:
  [ ] Complete full workflow in Chrome
  [ ] Check console for errors (F12)
  [ ] Verify all features work
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-054: Firefox Browser Compatibility
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Browser Version: Firefox ________  
Platform: [ ] Windows  [ ] macOS  [ ] Linux

Test Execution:
  [ ] Complete full workflow in Firefox
  [ ] Verify all features work
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-055: Mobile Responsive Design (Portrait)
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Device/Emulation: ________________  
Viewport Width: 375px (portrait)

Test Execution:
  [ ] Complete workflow on mobile
  [ ] Verify all interactive elements accessible
  [ ] Check text readability
  [ ] Verify no horizontal scrolling needed
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-056: Tablet Responsive Design (Landscape)
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Device/Emulation: ________________  
Viewport Width: 768px (landscape)

Test Execution:
  [ ] View Dashboard on tablet
  [ ] Verify layout optimized for tablet
  [ ] Complete transaction workflow
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-057: Desktop Display at Multiple Resolutions
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Test Execution:
  [ ] Test at 1024px (smallest desktop)
  [ ] Test at 1366px (typical laptop)
  [ ] Test at 1920px (full HD monitor)
  [ ] Verify no layout issues at any resolution
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

#### TC-058: Safari Browser Compatibility
```
Execution Status: [ ] Not Started  [ ] In Progress  [ ] Completed  [ ] Blocked

Browser: [ ] Safari macOS  [ ] Safari iOS  [ ] Both
Version: ________

Test Execution:
  [ ] Complete workflow on Safari
  [ ] Verify LocalStorage works
  [ ] Check form submission
  
Pass/Fail: [ ] PASS  [ ] FAIL

Issues/Notes: ________________________________________________________

Tester: ________________  Time: ________
```

**Phase 9 Complete:** ________________  
**All Passed:** [ ] YES  [ ] NO  
**Issues Found:** ___ (count)  

---

## PERFORMANCE VALIDATION CHECKLIST

### Performance Metrics

Measure and document the following performance metrics:

```
Test Conditions: 
- Dataset Size: __________ customers
- Browser: __________________
- Connection Speed: __________ Mbps
- Device: __________________

Metrics Measured:
┌─────────────────────────────┬─────────┬──────────┬──────────┐
│ Metric                      │ Target  │ Actual   │ Pass/Fail│
├─────────────────────────────┼─────────┼──────────┼──────────┤
│ Page Load Time (initial)    │ < 2s    │ ______s  │ [ ] [ ] │
│ Dashboard KPI Render        │ < 1s    │ ______s  │ [ ] [ ] │
│ Chart Rendering             │ < 2s    │ ______s  │ [ ] [ ] │
│ Search Response             │ < 300ms │ ____ms   │ [ ] [ ] │
│ Form Submission             │ < 500ms │ ____ms   │ [ ] [ ] │
│ CSV Export                  │ < 2s    │ ______s  │ [ ] [ ] │
│ CSV Import (100 records)    │ < 5s    │ ______s  │ [ ] [ ] │
└─────────────────────────────┴─────────┴──────────┴──────────┘

Performance Test Notes:
- Any lag observed? ________________________________________________________
- Memory usage acceptable? ________________________________________________________
- CPU usage normal? ________________________________________________________
```

---

## END-TO-END WORKFLOW TEST

### Complete User Journey Verification

```
Execute this complete workflow to verify integration:

Step 1: Login
  [ ] Log in with credentials
  [ ] Dashboard appears with 0 customers initially

Step 2: Add Multiple Transactions
  [ ] Add 5 different customer transactions
  [ ] Vary categories, statuses, and amounts
  [ ] Verify each saves successfully

Step 3: Dashboard Verification
  [ ] Dashboard updates with new data
  [ ] KPI values change appropriately
  [ ] All 4 KPI cards display correct values

Step 4: Search Operations
  [ ] Search for one customer by ID
  [ ] Edit customer data
  [ ] Search again to verify edit persisted
  [ ] Delete one customer
  [ ] Verify deletion removed from search results

Step 5: Analytics Review
  [ ] Navigate to Analytics
  [ ] Verify all 5 charts display data
  [ ] All charts render without errors

Step 6: Export Data
  [ ] Click "Ekspor CSV"
  [ ] File downloads successfully
  [ ] Verify CSV content in spreadsheet

Step 7: Import Data
  [ ] Click "Impor CSV"
  [ ] Import test CSV file
  [ ] Verify new records appear in application

Step 8: Page Refresh
  [ ] Refresh page (F5)
  [ ] All data persists after refresh
  [ ] Dashboard values unchanged

Step 9: Logout
  [ ] Click "Keluar"
  [ ] Login screen appears
  [ ] Session cleared

Result: [ ] PASS - Complete workflow successful
        [ ] FAIL - Issues encountered (document above)
```

---

## ISSUE TRIAGE & DEFECT LOGGING

### Issues Found Summary

**Total Issues Found:** ________  
**Critical:** ________  
**High:** ________  
**Medium:** ________  
**Low:** ________  

### Critical Issues Requiring Immediate Resolution

| ID | Issue | Severity | Status | Resolution |
|-------|---------|----------|--------|-----------|
| |  |  |  |  |
| |  |  |  |  |
| |  |  |  |  |

---

## UAT SIGN-OFF

### UAT Completion Status

```
Overall UAT Status: [ ] PASSED  [ ] PASSED WITH EXCEPTIONS  [ ] FAILED

Test Summary:
- Total Test Cases Executed: 58
- Passed: ____
- Failed: ____
- Pass Rate: ____% (Target: 95%+)

Critical Defects: ____ (Target: 0)
High Defects: ____ (Target: 0)
Medium Defects: ____
Low Defects: ____

Recommendation: [ ] APPROVED FOR PRODUCTION
               [ ] APPROVED WITH EXCEPTIONS
               [ ] REQUIRES ADDITIONAL TESTING
               [ ] NOT APPROVED
```

### UAT Team Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| UAT Lead | _____________ | _____________ | _______ |
| QA Tester 1 | _____________ | _____________ | _______ |
| QA Tester 2 | _____________ | _____________ | _______ |
| Business Owner | _____________ | _____________ | _______ |
| Project Manager | _____________ | _____________ | _______ |

---

**UAT Execution Complete**  
**Date Completed:** ________________  
**Final Approval:** ________________  

---

**End of UAT Execution Checklist**

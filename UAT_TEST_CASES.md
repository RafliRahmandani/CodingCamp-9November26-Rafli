# UAT Test Cases: Sistem Manajemen Pelanggan Marketplace Indonesia

**Document Version:** 1.0  
**Date:** November 2024  
**Total Test Cases:** 58  

---

## How to Use This Document

Each test case follows this format:
- **TC-XXX**: Test Case ID
- **Title**: Brief description
- **Priority**: Critical, High, Medium, Low
- **Pre-Conditions**: Setup required before test
- **Steps**: Numbered action steps
- **Expected Results**: What should happen
- **Pass/Fail**: Result of test execution
- **Notes**: Any observations or issues

---

## SECTION 1: AUTHENTICATION TESTS (TC-001 to TC-006)

### TC-001: Login with Valid Credentials
**Priority:** Critical  
**Pre-Conditions:** 
- Application loaded in browser
- Login page is visible
- User has not logged in

**Steps:**
1. Enter username in "Username" field (default: any username)
2. Enter password in "Password" field (default: any password)
3. Click "Masuk" (Login) button
4. Wait for application to process login

**Expected Results:**
- Login form disappears
- Navigation menu appears with: Dashboard, Tambah Transaksi, Cari Pelanggan, Analitik
- Dashboard section displays with KPI cards visible
- User can see "Keluar" (Logout) button in header
- No error messages shown

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-002: Login with Empty Username
**Priority:** High  
**Pre-Conditions:** 
- Application loaded in browser
- Login page is visible

**Steps:**
1. Leave Username field empty
2. Enter any password in Password field
3. Click "Masuk" (Login) button

**Expected Results:**
- Login is rejected
- Error message displays below login form
- User remains on login screen
- Error message is in Indonesian

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-003: Login with Empty Password
**Priority:** High  
**Pre-Conditions:** 
- Application loaded in browser
- Login page is visible

**Steps:**
1. Enter any username in Username field
2. Leave Password field empty
3. Click "Masuk" (Login) button

**Expected Results:**
- Login is rejected
- Error message displays below login form
- User remains on login screen
- Error message is in Indonesian

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-004: Logout Functionality
**Priority:** Critical  
**Pre-Conditions:** 
- User is logged in
- Dashboard is visible
- "Keluar" button is visible in header

**Steps:**
1. Locate "Keluar" (Logout) button in top-right corner
2. Click "Keluar" button
3. Wait for page to update
4. Observe login screen

**Expected Results:**
- Navigation menu disappears
- Dashboard and all sections hide
- Login form reappears
- Login page is ready for next user
- All session data is cleared
- No user information visible

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-005: Session Persistence After Page Refresh
**Priority:** High  
**Pre-Conditions:** 
- User is logged in
- Dashboard is visible

**Steps:**
1. Press F5 or Ctrl+R to refresh the page
2. Wait for page to reload
3. Verify login status

**Expected Results:**
- User remains logged in after refresh
- Dashboard displays with all data intact
- Navigation menu is visible
- No re-login required
- Customer data is preserved

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-006: Session Timeout (Manual Logout)
**Priority:** Medium  
**Pre-Conditions:** 
- User is logged in and idle
- Multiple application refreshes have occurred

**Steps:**
1. Leave application idle for 10 minutes
2. Return to browser and attempt any action
3. Click on any navigation menu item

**Expected Results:**
- Application still allows user to navigate (no automatic timeout)
- All previous data is preserved
- User can continue working
- Manual logout only via "Keluar" button

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

## SECTION 2: CUSTOMER MANAGEMENT - ADD TRANSACTION (TC-007 to TC-012)

### TC-007: Add New Transaction with All Valid Data
**Priority:** Critical  
**Pre-Conditions:** 
- User is logged in
- "Tambah Transaksi" (Add Transaction) page is open
- No errors in form

**Steps:**
1. Enter "Laptop Dell XPS 13" in "Nama Barang" field
2. Select "Elektronik" from "Kategori Barang" dropdown
3. Enter "8500000" in "Harga Barang" field
4. Enter "1" in "Kuantitas" field
5. Enter "Gaming" in "Varian Barang" field (optional)
6. Enter "100000" in "Ongkir" field
7. Enter "0" in "Sisa Bayar" field
8. Verify "Total Belanja" field shows: Rp 8.600.000
9. Enter "Budi Santoso" in "Nama Pembeli" field
10. Enter "08123456789" in "No Telp" field
11. Enter "Jl. Merdeka No. 123, Jakarta" in "Alamat" field
12. Select "Selesai" from Status dropdown
13. Click "Simpan" (Save) button

**Expected Results:**
- Form validation passes (no red error messages)
- Success notification displays: "Data pelanggan berhasil disimpan"
- Form is cleared/reset after 1 second
- New customer ID is generated (format: CUST-YYYYMMDD-XXXX)
- Data is saved to LocalStorage
- All fields are ready for next entry

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-008: Add Transaction with Negative Price
**Priority:** High  
**Pre-Conditions:** 
- User is on "Tambah Transaksi" page
- Form is ready for input

**Steps:**
1. Fill out all required fields with valid data EXCEPT:
2. Enter "-5000" in "Harga Barang" field
3. Try to click "Simpan" button

**Expected Results:**
- Red error message displays: "Harga Barang harus berupa angka positif"
- Form submission is prevented
- Error field gets red border highlighting
- User can correct the value
- Focus returns to error field

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-009: Add Transaction with Invalid Phone Number
**Priority:** High  
**Pre-Conditions:** 
- User is on "Tambah Transaksi" page
- Form is ready for input

**Steps:**
1. Fill out all required fields with valid data EXCEPT:
2. Enter "123" (only 3 digits) in "No Telp" field
3. Click on another field (blur event)
4. Verify error message

**Expected Results:**
- Error message displays: "Nomor telepon tidak valid (min 10 digit)"
- Phone number field gets red border
- Form cannot be submitted with this error
- Error clears when valid phone is entered

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-010: Auto-Calculation of Total Belanja
**Priority:** High  
**Pre-Conditions:** 
- User is on "Tambah Transaksi" page
- Form is ready for input

**Steps:**
1. Enter "5000000" in "Harga Barang" field
2. Enter "2" in "Kuantitas" field (should multiply price)
3. Enter "50000" in "Ongkir" field
4. Enter "100000" in "Sisa Bayar" field
5. Observe the "Total Belanja" field after each entry

**Expected Results:**
- After Harga Barang: Total shows "Rp 5.000.000"
- After Kuantitas: Total shows "Rp 10.000.000" (5M × 2)
- After Ongkir: Total shows "Rp 10.050.000" (10M + 50K)
- After Sisa Bayar: Total shows "Rp 10.150.000" (10M + 50K + 100K)
- Currency format uses Indonesian format (Rp X.XXX.XXX)
- Calculation updates in real-time

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-011: Form Reset Button
**Priority:** Medium  
**Pre-Conditions:** 
- User is on "Tambah Transaksi" page
- All form fields are filled with data

**Steps:**
1. Fill out all fields with sample data
2. Click "Reset" button (if visible)
3. Verify form state

**Expected Results:**
- All form fields are cleared/emptied
- Any validation error messages disappear
- Form is ready for new entry
- Focus returns to first field

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-012: Add Transaction with Required Field Empty
**Priority:** High  
**Pre-Conditions:** 
- User is on "Tambah Transaksi" page
- Form is ready for input

**Steps:**
1. Fill out most fields with valid data BUT:
2. Leave "Nama Pembeli" (Buyer Name) field empty
3. Click "Simpan" (Save) button

**Expected Results:**
- Form submission is blocked
- Error message displays: "Nama Pembeli harus diisi"
- Field gets red border
- No data is saved
- User can correct and resubmit

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

## SECTION 3: SEARCH & FILTERING (TC-013 to TC-020)

### TC-013: Search for Existing Customer by ID
**Priority:** Critical  
**Pre-Conditions:** 
- User is logged in
- "Cari Pelanggan" (Search Customer) page is open
- At least one customer record exists
- Customer ID format: CUST-YYYYMMDD-XXXX

**Steps:**
1. Note a Customer ID from earlier transactions (e.g., CUST-20241115-0001)
2. Click on "Cari Pelanggan" navigation item
3. Enter the Customer ID in the search field
4. Click "Cari" (Search) button
5. Wait for results to display

**Expected Results:**
- Search results display in a table
- Table shows all 14 fields: timestamp, nama barang, kategori, harga, qty, varian, ongkir, sisa bayar, total, nama pembeli, telp, ID pelanggan, alamat, status
- Correct customer record is highlighted in results
- Result row has "Edit" and "Hapus" (Delete) buttons
- Search completed within 300ms

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-014: Search with Partial ID Matching
**Priority:** High  
**Pre-Conditions:** 
- "Cari Pelanggan" page is open
- Multiple customer records exist

**Steps:**
1. Enter partial Customer ID in search field (e.g., "CUST-20241115" - without serial number)
2. Click "Cari" button
3. Observe search results

**Expected Results:**
- Search matches customers with partial ID
- All customers from that date are displayed
- Results are case-insensitive
- Multiple results shown in table format
- Partial matching works correctly

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-015: Search with No Results
**Priority:** Medium  
**Pre-Conditions:** 
- "Cari Pelanggan" page is open
- Search function is ready

**Steps:**
1. Enter a Customer ID that doesn't exist (e.g., "CUST-99999999-9999")
2. Click "Cari" button
3. Wait for results

**Expected Results:**
- Message displays: "Tidak ada hasil" (No results found)
- Results table is empty or hidden
- Search field remains populated for refinement
- No error messages shown
- User can modify search and retry

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-016: Edit Customer from Search Results
**Priority:** High  
**Pre-Conditions:** 
- "Cari Pelanggan" page has search results displayed
- Edit button is visible for a result row

**Steps:**
1. Search for an existing customer ID
2. In search results table, click "Edit" button for a row
3. Observe form loading

**Expected Results:**
- Page navigates to "Tambah Transaksi" form
- Form fields are pre-populated with customer data
- Page header indicates edit mode or shows customer ID
- All 14 fields contain the customer's data
- User can modify any field
- Save button updates existing record (not creating new)

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-017: Delete Customer from Search Results
**Priority:** High  
**Pre-Conditions:** 
- "Cari Pelanggan" page has search results displayed
- Multiple result rows are visible

**Steps:**
1. Search for an existing customer ID
2. In search results, click "Hapus" (Delete) button on a row
3. Confirmation dialog appears
4. Click "Ya/Iya" to confirm deletion

**Expected Results:**
- Confirmation dialog shows: "Apakah Anda yakin ingin menghapus?" (Are you sure you want to delete?)
- Dialog has "Batal" (Cancel) and "Hapus" (Delete) buttons
- After confirming: Customer is deleted from storage
- Search results refresh automatically
- Deleted record no longer appears in results
- Success notification: "Data pelanggan berhasil dihapus"

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-018: Cancel Delete Operation
**Priority:** Medium  
**Pre-Conditions:** 
- "Cari Pelanggan" page has search results
- Delete confirmation dialog is open

**Steps:**
1. Click "Batal" (Cancel) button on delete confirmation dialog
2. Observe if record is deleted

**Expected Results:**
- Dialog closes without deletion
- Customer record remains unchanged
- Search results still display the customer
- No success or error message shown
- Original search query remains

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-019: Search Result Table Scrolling (Mobile Test)
**Priority:** Medium  
**Pre-Conditions:** 
- Mobile device or mobile emulation is active (320px width)
- "Cari Pelanggan" page has results with many columns

**Steps:**
1. Search for a customer on mobile view
2. Attempt to view all 14 fields in the results table
3. Scroll horizontally on the results table
4. Verify all columns are accessible

**Expected Results:**
- Table is responsive on mobile
- All 14 fields are visible with horizontal scrolling
- Data is readable without distortion
- Edit/Delete buttons remain accessible
- No horizontal page scrolling needed (table scrolls within container)

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-020: Search Performance with Large Dataset
**Priority:** Medium  
**Pre-Conditions:** 
- System has 1000+ customer records loaded
- "Cari Pelanggan" page is open

**Steps:**
1. Enter a search query that returns 50+ results
2. Click "Cari" button
3. Measure/observe how long results take to display
4. Scroll through results

**Expected Results:**
- Search completes within 300ms
- Results display smoothly without lag
- Table scrolling is smooth
- No UI freezing during search
- Performance remains acceptable with large dataset

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

## SECTION 4: DASHBOARD & KPIs (TC-021 to TC-028)

### TC-021: Dashboard KPI - Total Customers Display
**Priority:** Critical  
**Pre-Conditions:** 
- User is logged in
- "Dashboard" page is open
- At least 10 customer records exist

**Steps:**
1. Navigate to Dashboard
2. Locate the "Total Pelanggan" (Total Customers) KPI card
3. Verify the number displayed matches actual customer count

**Expected Results:**
- KPI card displays with label "Total Pelanggan"
- Number shown matches count of all customers in storage
- If 47 customers exist, displays: 47
- Value updates in real-time as customers are added/deleted
- Renders within 1 second of page load
- Styled as a card with clear typography

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-022: Dashboard KPI - Total Revenue Calculation
**Priority:** Critical  
**Pre-Conditions:** 
- User is logged in
- "Dashboard" page is open
- Multiple customers with various "Total Belanja" amounts exist

**Steps:**
1. Navigate to Dashboard
2. Locate "Total Pendapatan" (Total Revenue) KPI card
3. Manually calculate sum of all customer "Total Belanja" values
4. Compare with displayed value

**Expected Results:**
- KPI card displays total sum of all "Total Belanja" values
- Value is formatted as Indonesian currency (Rp X.XXX.XXX)
- Calculation is accurate to the rupiah
- Decimal amounts are properly rounded
- Renders within 1 second

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-023: Dashboard KPI - Average Transaction Value
**Priority:** High  
**Pre-Conditions:** 
- User is logged in
- "Dashboard" page is open
- Customer records with varying transaction amounts exist

**Steps:**
1. Navigate to Dashboard
2. Locate "Rata-rata Nilai Transaksi" (Average Transaction Value) KPI card
3. Manually calculate: Total Revenue ÷ Number of Transactions
4. Compare with displayed value

**Expected Results:**
- Average is correctly calculated as total revenue divided by customer count
- Value is formatted as Indonesian currency (Rp X.XXX.XXX)
- If total is Rp 50,000,000 with 10 customers: shows Rp 5.000.000
- Accurate to nearest rupiah
- Renders within 1 second

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-024: Dashboard KPI - Monthly Transactions
**Priority:** High  
**Pre-Conditions:** 
- User is logged in
- "Dashboard" page is open
- Some customers from current month, some from previous months

**Steps:**
1. Navigate to Dashboard
2. Locate "Transaksi Bulan Ini" (Monthly Transactions) KPI card
3. Manually count customers created in current month
4. Compare count with displayed value

**Expected Results:**
- Shows count of transactions created in current calendar month
- If today is November 15, 2024 and 8 transactions are from November: displays 8
- Transactions from previous months not included
- Accurate count displayed
- Renders within 1 second

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-025: Dashboard KPI Cards Layout - Desktop
**Priority:** Medium  
**Pre-Conditions:** 
- User is on desktop browser (1024px+ width)
- Dashboard is fully loaded

**Steps:**
1. View Dashboard on desktop screen
2. Observe KPI card layout and arrangement
3. Verify visual appearance and spacing

**Expected Results:**
- 4 KPI cards displayed in 2×2 grid layout
- Cards are evenly spaced
- Each card clearly labeled with title
- Values are prominent and readable
- Cards have consistent styling
- Professional appearance maintained

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-026: Dashboard KPI Cards Layout - Mobile
**Priority:** Medium  
**Pre-Conditions:** 
- Mobile device or mobile emulation (320px width)
- Dashboard is fully loaded

**Steps:**
1. View Dashboard on mobile screen
2. Observe KPI card layout
3. Scroll to see all cards
4. Verify readability

**Expected Results:**
- 4 KPI cards displayed in single column (stacked vertically)
- Full width of mobile screen with padding
- Text remains readable (not cramped)
- All values clearly visible
- No horizontal scrolling needed
- Professional appearance on mobile

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-027: Dashboard Refresh Updates KPIs
**Priority:** High  
**Pre-Conditions:** 
- User is on Dashboard with KPI values displayed
- Data is ready to add new customer

**Steps:**
1. Navigate to "Tambah Transaksi" page
2. Add a new customer transaction with Total Belanja: Rp 2.000.000
3. Navigate back to Dashboard
4. Observe KPI changes

**Expected Results:**
- Total Pelanggan increases by 1
- Total Pendapatan increases by Rp 2.000.000
- Average Transaction Value is recalculated
- Monthly Transactions count increases (if same month)
- All updates reflect new data within 1 second

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-028: Dashboard with No Data
**Priority:** Medium  
**Pre-Conditions:** 
- Application is fresh with no customer records
- User is logged in

**Steps:**
1. Navigate to Dashboard without adding any customers
2. Observe KPI values

**Expected Results:**
- Total Pelanggan displays: 0
- Total Pendapatan displays: Rp 0 (or "Rp 0")
- Average Transaction Value displays: Rp 0 (or shows N/A)
- Monthly Transactions displays: 0
- No error messages shown
- Page renders correctly even with zero data

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

## SECTION 5: ANALYTICS & CHARTS (TC-029 to TC-034)

### TC-029: Category Sales Chart (Pie Chart)
**Priority:** High  
**Pre-Conditions:** 
- User is logged in
- "Analitik" (Analytics) page is open
- Multiple customers with various product categories exist (Elektronik, Fashion, Makanan, etc.)

**Steps:**
1. Navigate to Analytics page
2. Locate "Penjualan per Kategori" (Sales by Category) pie chart
3. Observe chart rendering
4. Verify data accuracy

**Expected Results:**
- Pie chart displays with title "Penjualan per Kategori"
- Each category (Elektronik, Fashion, etc.) shown as separate slice
- Slice size represents sales quantity/revenue for that category
- Chart is responsive and visible
- Legend shows category names in Indonesian
- Chart renders within 2 seconds
- No data errors displayed

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-030: Monthly Revenue Chart (Bar Chart)
**Priority:** High  
**Pre-Conditions:** 
- "Analitik" page is open
- Customer records span multiple months

**Steps:**
1. Navigate to Analytics page
2. Locate "Pendapatan Bulanan" (Monthly Revenue) bar chart
3. Observe chart rendering

**Expected Results:**
- Bar chart displays with title "Pendapatan Bulanan"
- X-axis shows months (or weeks)
- Y-axis shows revenue amounts in Rupiah
- Each bar represents a month's total revenue
- Bars are properly scaled and proportional
- Chart is responsive
- Renders within 2 seconds

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-031: Top 10 Customers Chart (Horizontal Bar)
**Priority:** High  
**Pre-Conditions:** 
- "Analitik" page is open
- 10+ customer records exist with varying purchase amounts

**Steps:**
1. Navigate to Analytics page
2. Locate "Top 10 Pelanggan" (Top 10 Customers) horizontal bar chart
3. Observe chart data

**Expected Results:**
- Horizontal bar chart displays
- Y-axis shows customer names or IDs
- X-axis shows total spending amounts
- Bars ordered from highest to lowest spending
- Shows top 10 customers (or fewer if less than 10 exist)
- Chart is readable and well-formatted
- Renders within 2 seconds

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-032: Transaction Status Chart (Doughnut Chart)
**Priority:** Medium  
**Pre-Conditions:** 
- "Analitik" page is open
- Customers have various transaction statuses (Pending, Selesai, Dibatalkan)

**Steps:**
1. Navigate to Analytics page
2. Locate "Status Transaksi" (Transaction Status) doughnut chart
3. Observe chart rendering

**Expected Results:**
- Doughnut chart displays with title "Status Transaksi"
- Each status (Pending, Selesai, Dibatalkan) shown as section
- Section size represents count of transactions with that status
- Legend shows all status labels in Indonesian
- Chart is visually clear
- Renders within 2 seconds

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-033: Sales Trend Chart (Line Chart)
**Priority:** Medium  
**Pre-Conditions:** 
- "Analitik" page is open
- Multiple customer records spanning several days or weeks

**Steps:**
1. Navigate to Analytics page
2. Locate "Tren Penjualan" (Sales Trend) line chart
3. Observe trend visualization

**Expected Results:**
- Line chart displays with title "Tren Penjualan"
- X-axis shows time periods (days or weeks)
- Y-axis shows sales count or revenue
- Line connects points showing trend progression
- Chart clearly shows upward/downward trends
- Chart is smooth and readable
- Renders within 2 seconds

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-034: Chart Responsiveness on Mobile
**Priority:** Medium  
**Pre-Conditions:** 
- Mobile device or mobile emulation (320px width)
- "Analitik" page is open with all 5 charts

**Steps:**
1. View Analytics page on mobile
2. Observe each of 5 charts
3. Scroll through charts vertically
4. Verify readability

**Expected Results:**
- All 5 charts stack vertically on mobile
- Each chart is full width with padding
- Charts are responsive (shrink/resize appropriately)
- Text and labels remain readable
- Charts render correctly without distortion
- No horizontal scrolling needed
- No performance degradation

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

## SECTION 6: CSV EXPORT/IMPORT (TC-035 to TC-040)

### TC-035: Export Data to CSV File
**Priority:** Critical  
**Pre-Conditions:** 
- User is logged in
- 10+ customer records exist
- Export button ("Ekspor CSV") is visible on dashboard

**Steps:**
1. Navigate to Dashboard
2. Click "Ekspor CSV" (Export CSV) button
3. Wait for file download to complete
4. Locate downloaded file

**Expected Results:**
- Browser downloads file named: pelanggan-YYYYMMDD.csv (with current date)
- File is CSV format (comma-separated values)
- All customer records are included in export
- All 14 fields per customer are exported
- Column headers are in Indonesian
- File contains correct data when opened in Excel/Calc
- Download completes within 2 seconds

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-036: Export CSV Content Verification
**Priority:** High  
**Pre-Conditions:** 
- CSV file is downloaded and saved
- Spreadsheet application is available (Excel, Calc)

**Steps:**
1. Open downloaded CSV file in spreadsheet application
2. Verify column headers
3. Spot-check data rows for accuracy
4. Verify special character handling

**Expected Results:**
- First row contains Indonesian column headers:
  - Timestamp, Nama Barang, Kategori Barang, Harga Barang, Kuantitas, Varian Barang, Ongkir, Sisa Bayar, Total Belanja, Nama Pembeli, No Telp, ID Pelanggan, Alamat, Status
- Data rows contain correct values from application
- Special characters (é, ñ, ü, etc.) display correctly with UTF-8 BOM
- Currency values are numeric (not formatted as Rp)
- All 14 fields present for each customer
- Data integrity maintained

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-037: Import Valid CSV File
**Priority:** Critical  
**Pre-Conditions:** 
- User is logged in
- Valid CSV file prepared with proper format
- "Impor CSV" (Import CSV) button is visible

**Steps:**
1. Click "Impor CSV" button on dashboard
2. Select prepared CSV file from computer
3. Review preview of first 5 rows
4. Click confirm/import button
5. Wait for import to complete

**Expected Results:**
- File dialog opens to select CSV file
- Preview displays first 5 rows from CSV
- Preview headers match expected columns
- Preview shows sample data for verification
- Import button becomes enabled after selection
- After import: success message shows "X data berhasil diimpor" (X records imported)
- New customers appear in application
- All 14 fields populated from import
- Import completes within 5 seconds

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-038: Import CSV with Duplicate Customer IDs
**Priority:** High  
**Pre-Conditions:** 
- CSV file contains duplicate customer IDs
- Customers with those IDs already exist in application

**Steps:**
1. Prepare CSV file with existing customer IDs
2. Click "Impor CSV" button
3. Select CSV file with duplicates
4. Review preview
5. Click import

**Expected Results:**
- Import preview identifies duplicate IDs
- Warning message displayed (optional feature)
- Option to skip duplicates or overwrite (implementation dependent)
- After import: only new records are added
- Summary shows: "X data berhasil diimpor, Y data sudah ada" (X imported, Y duplicates)
- No data loss
- Existing records maintain their data

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-039: Import CSV with Invalid Format
**Priority:** High  
**Pre-Conditions:** 
- CSV file has incorrect format or missing columns
- File is prepared intentionally with errors

**Steps:**
1. Prepare CSV file with invalid format (missing columns, wrong delimiter, etc.)
2. Click "Impor CSV" button
3. Select invalid CSV file
4. Observe error handling

**Expected Results:**
- Application detects invalid format
- Clear error message displays in Indonesian: "Format CSV tidak sesuai" or similar
- Provides information about what's wrong
- Import is prevented (no corrupted data added)
- User can correct file and retry
- Application remains stable

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-040: Import CSV with Special Characters
**Priority:** Medium  
**Pre-Conditions:** 
- CSV file contains special characters (Indonesian letters, symbols, emojis)
- File is properly UTF-8 encoded

**Steps:**
1. Prepare CSV with special characters: "Jl. Sudirman No. 123", "Rp. 5.000.000", "Budi Santoso", etc.
2. Click "Impor CSV"
3. Select file and import
4. Verify imported data

**Expected Results:**
- Import succeeds without errors
- Special characters preserved correctly
- Indonesian characters (á, é, í, ó, ú, ñ) display properly
- Currency symbols handled correctly
- Diacritical marks maintained
- Data is searchable and displayable correctly

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

## SECTION 7: FORM VALIDATION (TC-041 to TC-048)

### TC-041: Real-Time Field Validation - Empty Required Field
**Priority:** High  
**Pre-Conditions:** 
- "Tambah Transaksi" form is open
- Form is ready for input

**Steps:**
1. Click on "Nama Barang" field
2. Click away (blur) without entering data
3. Observe error display

**Expected Results:**
- Red error message appears: "Nama Barang harus diisi"
- Field border turns red indicating error
- Error message is in Indonesian
- Error clears when user enters text
- Form prevents submission with this error

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-042: Real-Time Validation - Field Length Validation
**Priority:** Medium  
**Pre-Conditions:** 
- "Tambah Transaksi" form is open
- Focus on "Nama Pembeli" field

**Steps:**
1. Enter only 2 characters in "Nama Pembeli" field
2. Click away (blur)
3. Observe validation

**Expected Results:**
- If minimum length is set (e.g., 3 chars), error displays: "Nama Pembeli minimal 3 karakter"
- Field gets red border
- Error clears when sufficient characters added
- Validation works in real-time as user types

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-043: Validation - Invalid Email Format (if applicable)
**Priority:** Low  
**Pre-Conditions:** 
- If email field exists in form
- Focus on email field

**Steps:**
1. Enter invalid email: "notanemail"
2. Click away (blur)
3. Observe validation

**Expected Results:**
- Error message displays: "Format email tidak valid"
- Field gets red border
- Error clears with valid email format
- Validation correct for email pattern

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-044: Validation - Decimal Values in Currency Fields
**Priority:** Medium  
**Pre-Conditions:** 
- "Tambah Transaksi" form is open
- Focus on "Harga Barang" field

**Steps:**
1. Enter "100.50" in "Harga Barang" field (with decimal)
2. Enter "50.25" in "Ongkir" field
3. Enter "0.99" in "Sisa Bayar" field
4. Observe Total Belanja calculation

**Expected Results:**
- Decimal values are accepted
- Total Belanja calculation includes decimals
- Display format: Rp X.XXX.XXX (decimals handled)
- Calculation is accurate with decimals
- No validation errors for decimal input

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-045: Validation - Maximum Field Length
**Priority:** Medium  
**Pre-Conditions:** 
- "Tambah Transaksi" form is open
- Focus on "Alamat" (Address) textarea

**Steps:**
1. Attempt to enter 500+ characters in Alamat field
2. Observe field behavior
3. Try to submit form

**Expected Results:**
- Field accepts long text (no truncation visible)
- If max length enforced, shows: "Alamat maksimal X karakter"
- Data saved completely if submitted
- Functionality robust with long text

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-046: Validation - Multiple Errors in Form
**Priority:** High  
**Pre-Conditions:** 
- "Tambah Transaksi" form is open
- Form is ready for input

**Steps:**
1. Enter invalid data in multiple fields:
   - Leave "Nama Barang" empty
   - Enter "123" in "No Telp" (too short)
   - Enter "-500" in "Harga Barang" (negative)
2. Click "Simpan" button

**Expected Results:**
- All three errors are displayed with red borders
- Error messages shown for each field in Indonesian
- Form submission is prevented
- Error list clear and actionable
- User can correct all issues

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-047: Validation Error Message Clarity
**Priority:** Medium  
**Pre-Conditions:** 
- Form validation has triggered errors
- Error messages are displayed

**Steps:**
1. Observe error messages displayed
2. Verify they're understandable to non-technical users
3. Check if they indicate what to fix

**Expected Results:**
- All error messages are in clear Indonesian
- Messages indicate what is wrong AND how to fix it
- Example: "Nomor telepon tidak valid (min 10 digit)" shows the requirement
- Messages are not technical jargon
- Non-technical users can understand issues

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-048: Validation - Category Selection from Dropdown
**Priority:** Medium  
**Pre-Conditions:** 
- "Tambah Transaksi" form is open
- "Kategori Barang" dropdown is available

**Steps:**
1. Click "Kategori Barang" dropdown
2. Observe available options
3. Select an option (e.g., "Elektronik")
4. Verify selection

**Expected Results:**
- Dropdown displays predefined categories in Indonesian
- Categories are logical and comprehensive
- Selection is saved in form
- Validation accepts any selected category
- Form can be submitted with category selected

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

## SECTION 8: DATA PERSISTENCE & ERROR HANDLING (TC-049 to TC-052)

### TC-049: Data Persistence Across Page Refresh
**Priority:** Critical  
**Pre-Conditions:** 
- User is logged in
- 5+ customer records exist
- Dashboard displays correct KPI values

**Steps:**
1. Note the KPI values on Dashboard
2. Add a new customer transaction
3. Refresh page (F5 or Ctrl+R)
4. Return to Dashboard
5. Verify KPI values

**Expected Results:**
- New customer persists in LocalStorage
- Dashboard KPI values updated after refresh
- All customer data preserved
- Search results show new customer
- No data loss on page refresh
- Total customer count increased by 1

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-050: LocalStorage Quota Error Handling
**Priority:** High  
**Pre-Conditions:** 
- Application is running
- LocalStorage has limited space remaining (simulated or actual)

**Steps:**
1. Add many large customer records to approach storage quota
2. Continue adding records until quota exceeded
3. Try to add one more large record
4. Observe error handling

**Expected Results:**
- Application detects QuotaExceededError
- Clear error message displays: "Penyimpanan penuh. Hapus data lama atau ekspor ke CSV."
- User is not shocked by technical error message
- Data not in unsaved state
- User can export data before exceeding quota
- Application remains stable

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-051: Browser Close/Crash Recovery
**Priority:** High  
**Pre-Conditions:** 
- User is in the middle of adding a transaction
- Some form fields are filled but not submitted

**Steps:**
1. Fill out several form fields with data
2. Do NOT click Save button
3. Close the browser tab/window
4. Reopen the application URL
5. Log in again

**Expected Results:**
- Unsaved form data is NOT recovered (expected behavior for client-side)
- Previously saved customers ARE recovered from LocalStorage
- Application functions normally after reopening
- No corrupted data state
- User can continue adding transactions

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-052: Storage Warning at Threshold
**Priority:** Medium  
**Pre-Conditions:** 
- Application is running
- Approaching storage quota (at 80% full)

**Steps:**
1. Continue adding large customer records
2. Reach 80% storage utilization
3. Observe any warning or notification

**Expected Results:**
- Warning notification may display: "Penyimpanan hampir penuh" (optional feature)
- Suggests exporting data to free space
- User is alerted before reaching 100% quota
- Application still functions normally at this point
- User has opportunity to export before failure

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

## SECTION 9: CROSS-BROWSER & RESPONSIVE TESTING (TC-053 to TC-058)

### TC-053: Chrome Browser Compatibility
**Priority:** High  
**Pre-Conditions:** 
- Chrome 90+ is installed and updated
- Application is loaded in Chrome

**Steps:**
1. Load application URL in Chrome
2. Complete full workflow: Login → Add Transaction → Search → View Dashboard → View Analytics → Export → Logout
3. Verify all features work

**Expected Results:**
- All features function correctly
- UI renders properly (fonts, colors, layout)
- Charts display correctly
- No console errors
- Performance is smooth
- Application is responsive

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-054: Firefox Browser Compatibility
**Priority:** High  
**Pre-Conditions:** 
- Firefox 88+ is installed and updated
- Application is loaded in Firefox

**Steps:**
1. Load application URL in Firefox
2. Complete full workflow: Login → Add Transaction → Search → View Dashboard → View Analytics → Export → Logout
3. Verify all features work

**Expected Results:**
- All features function correctly in Firefox
- UI renders properly
- Charts render without issues
- LocalStorage works
- Form validation works
- No compatibility issues

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-055: Mobile Responsive Design (Portrait)
**Priority:** High  
**Pre-Conditions:** 
- Mobile device or device emulation at 375px width
- Application is loaded

**Steps:**
1. Load application on mobile device in portrait mode
2. Complete workflow: Login → Add Transaction → Search → Dashboard → Analytics
3. Verify usability on mobile

**Expected Results:**
- Login form is full-width and readable
- Input fields are touch-friendly (min 44px height)
- Navigation menu converts to hamburger menu
- Forms stack in single column
- Tables have horizontal scroll for mobile
- KPI cards stack vertically
- Charts are responsive
- No horizontal page scrolling needed
- Text is readable (no zooming required)

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-056: Tablet Responsive Design (Landscape)
**Priority:** High  
**Pre-Conditions:** 
- Tablet device or emulation at 768px width in landscape
- Application is loaded

**Steps:**
1. Load application on tablet in landscape mode
2. Navigate all sections
3. Verify layout optimization for tablet

**Expected Results:**
- Navigation is horizontal menu (not hamburger)
- KPI cards display in 2×2 grid
- Forms are 2-column layout if space allows
- Tables fully visible without excessive scrolling
- Charts render responsively for tablet width
- Overall layout optimized for tablet screen

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-057: Desktop Display at Multiple Resolutions
**Priority:** Medium  
**Pre-Conditions:** 
- Desktop browser available
- Can adjust window size

**Steps:**
1. Load application at 1024px width (smallest desktop)
2. Test at 1366px (typical desktop)
3. Test at 1920px (full HD)
4. Verify layout at each resolution

**Expected Results:**
- Layout adapts properly at each resolution
- No broken layout at any breakpoint
- Content remains accessible and readable
- Spacing and margins appropriate for screen size
- Charts scale properly
- No horizontal scrolling at any desktop resolution
- Text remains readable at all sizes

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

### TC-058: Safari Browser Compatibility (iOS & Desktop)
**Priority:** Medium  
**Pre-Conditions:** 
- Safari browser (macOS or iOS)
- Application is loaded

**Steps:**
1. Load application in Safari on iOS device
2. Complete workflow: Login → Add Customer → Search → Dashboard
3. Load application in Safari on macOS
4. Complete same workflow

**Expected Results:**
- All features work on both iOS Safari and macOS Safari
- UI renders correctly (fonts, colors, layout)
- Touch interactions work on iOS
- Forms are usable
- Charts render properly
- LocalStorage works (Note: Safari private mode has limitations)
- No browser-specific errors

**Pass:** ☐ | **Fail:** ☐  
**Tester Notes:** ________________

---

## SECTION 10: PERFORMANCE TESTING (Performance expectations)

### Performance Baseline Criteria

These metrics should be verified during UAT:

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Page Load Time (initial) | < 2 seconds | _____ | ☐ |
| Dashboard KPI Render | < 1 second | _____ | ☐ |
| Chart Rendering | < 2 seconds | _____ | ☐ |
| Search Response | < 300ms | _____ | ☐ |
| Form Submission | < 500ms | _____ | ☐ |
| Export CSV | < 2 seconds | _____ | ☐ |
| Import CSV (100 records) | < 5 seconds | _____ | ☐ |

### Performance Test Observations

- Test with dataset of 100 records: ________________
- Test with dataset of 500 records: ________________
- Test with dataset of 1000 records: ________________
- Any lag or stuttering observed? ________________
- Browser memory usage acceptable? ________________

---

## TEST CASE SUMMARY

**Total Test Cases:** 58  
**Critical Priority:** 6 test cases  
**High Priority:** 24 test cases  
**Medium Priority:** 21 test cases  
**Low Priority:** 7 test cases  

---

## Notes for Testers

1. **Default Credentials**: For login, test uses default credentials (typically any username/password in demo mode)

2. **Test Data**: Use provided sample data to ensure consistency across testers

3. **Browser DevTools**: Open DevTools (F12) to check for console errors during testing

4. **Screenshot Documentation**: For failed tests, capture screenshots to attach to bug reports

5. **Data Cleanup**: Between test runs, clear LocalStorage (DevTools > Application > LocalStorage > Clear All) to start fresh

6. **Time Tracking**: Note time taken for performance-related tests

7. **Accessibility**: Note any accessibility issues encountered

8. **User Experience**: Note any confusing or non-intuitive workflows

---

**End of Test Cases Document**

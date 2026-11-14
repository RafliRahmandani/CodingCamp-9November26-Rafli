# UAT Expected Results Documentation

**Document Version:** 1.0  
**Date:** November 2024  
**Purpose:** Detailed expected results for all UAT test cases  

---

## How to Use This Document

This document provides the detailed expected results for each UAT test case. Use this as reference when comparing actual results during testing. Each section includes:

- **Test Case ID**: TC-XXX
- **Expected UI Behavior**: What should appear on screen
- **Expected Data**: What data should be stored/displayed
- **Expected Performance**: Time/response expectations
- **Pass Criteria**: Specific conditions that indicate PASS
- **Fail Indicators**: What indicates a FAIL result

---

## SECTION 1: AUTHENTICATION EXPECTED RESULTS

### TC-001: Login with Valid Credentials - Expected Results

**Expected UI Behavior:**
- Login form should disappear from view
- Main application interface should become visible
- Navigation menu with 4 items appears: Dashboard, Tambah Transaksi, Cari Pelanggan, Analitik
- Navigation menu is initially hidden until expanded on mobile
- "Keluar" (Logout) button visible in top-right header area

**Expected Data:**
- User session stored in sessionStorage (not visible to user)
- Authentication status set to: logged in = true
- Current route defaults to: Dashboard (#/)

**Expected Performance:**
- Login process completes within 500ms
- Dashboard renders within 2 seconds after login
- No loading spinners or delays

**Pass Criteria:**
- ✅ All navigation menu items visible
- ✅ Dashboard section displays
- ✅ No error messages
- ✅ Form completely hidden (not just display:none visible in HTML)
- ✅ Can interact with dashboard immediately

**Fail Indicators:**
- ❌ Login form still visible
- ❌ Error message displays
- ❌ Navigation menu missing or incomplete
- ❌ Dashboard doesn't load
- ❌ Application frozen or unresponsive

---

### TC-002: Login with Empty Username - Expected Results

**Expected UI Behavior:**
- User remains on login screen
- Red error message appears below login form or near username field
- Login button returns to normal state (not loading)
- Username field remains focused or highlighted

**Expected Error Message:**
- In Indonesian
- Should be similar to: "Username harus diisi" or "Silakan masukkan username"
- Should be clearly visible in red color
- Should not be technical jargon

**Expected Data:**
- No session created (user not logged in)
- No data stored in sessionStorage
- Form data not persisted

**Pass Criteria:**
- ✅ Error message appears
- ✅ Message is in Indonesian
- ✅ User remains on login page
- ✅ Can retry login
- ✅ Dashboard not accessible

**Fail Indicators:**
- ❌ Login succeeds (no validation)
- ❌ Error in English language
- ❌ No error message shown
- ❌ Application navigates away from login

---

### TC-003: Login with Empty Password - Expected Results

**Expected UI Behavior:**
- User remains on login screen
- Error message appears near password field or below login form
- Red highlighting or border on password field (optional)
- Login button returns to normal state

**Expected Error Message:**
- In Indonesian
- Similar to: "Password harus diisi"
- Clearly visible and readable

**Expected Data:**
- No session created
- User not logged in

**Pass Criteria:**
- ✅ Error message shown
- ✅ User cannot log in
- ✅ Can retry with valid password

**Fail Indicators:**
- ❌ No error shown
- ❌ Login succeeds
- ❌ Error is vague or technical

---

### TC-004: Logout Functionality - Expected Results

**Expected UI Behavior:**
- Navigation menu disappears
- All application sections hide (Dashboard, Forms, Charts, etc.)
- Login form reappears on screen
- "Keluar" button disappears (logout successful)
- Page scrolls to top or focuses on login form

**Expected Data:**
- Session cleared from sessionStorage
- All UI state reset
- No previous user data visible

**Expected Performance:**
- Logout completes within 300ms
- UI updates immediately

**Pass Criteria:**
- ✅ Login form visible and ready
- ✅ All other sections hidden
- ✅ Navigation gone
- ✅ Can log in as different user
- ✅ No cached UI elements visible

**Fail Indicators:**
- ❌ Dashboard still visible
- ❌ Navigation menu still present
- ❌ Previous data visible
- ❌ "Keluar" button still visible

---

### TC-005: Session Persistence After Page Refresh - Expected Results

**Expected UI Behavior:**
- After F5 refresh, page reloads
- Application restores to Dashboard
- All navigation menu visible
- User doesn't see login screen
- No re-login prompt

**Expected Data:**
- Session preserved in sessionStorage
- All customer data persists from LocalStorage
- KPI values same as before refresh
- Current route maintained (should be Dashboard)

**Expected Performance:**
- Page reload completes within 2 seconds
- Data restored within 500ms after load

**Pass Criteria:**
- ✅ User still logged in after refresh
- ✅ Dashboard displays immediately
- ✅ Customer data preserved
- ✅ KPI values unchanged
- ✅ Navigation available
- ✅ No login required

**Fail Indicators:**
- ❌ User logged out after refresh
- ❌ Dashboard empty or not displaying
- ❌ Data lost or incorrect
- ❌ Login form appears (unexpected)

---

### TC-006: Session Timeout - Expected Results

**Expected UI Behavior:**
- After 10 minutes idle, navigation menu still visible
- User can still click menu items
- No automatic logout occurs
- Application remains responsive

**Expected Data:**
- Session preserved in sessionStorage
- All data intact after idle period

**Note:** Client-side applications typically don't have automatic timeouts. User remains logged in until:
1. They click "Keluar" (Logout) button
2. Browser is closed completely
3. Explicit logout via application

**Pass Criteria:**
- ✅ User still logged in after 10 minutes
- ✅ Application still functional
- ✅ Can continue using application

**Fail Indicators:**
- ❌ User unexpectedly logged out
- ❌ Application unresponsive
- ❌ Data cleared without reason

---

## SECTION 2: CUSTOMER MANAGEMENT EXPECTED RESULTS

### TC-007: Add New Transaction with All Valid Data - Expected Results

**Expected UI Behavior:**
- Form fields show no red error indicators
- "Simpan" button becomes clickable (enabled)
- After clicking Simpan:
  - Form disappears or clears (visual feedback)
  - Green success notification appears: "Data pelanggan berhasil disimpan"
  - Notification displays for 5 seconds then auto-hides
  - Form fields become empty/reset
  - Page ready for next transaction

**Expected Data Saved:**
- Customer record created with 14 fields:
  - ID: Auto-generated format: CUST-20241115-0001
  - Timestamp: Current date/time automatically recorded
  - Nama Barang: "Laptop Dell XPS 13"
  - Kategori Barang: "Elektronik"
  - Harga Barang: 8500000 (numeric, stored as number)
  - Kuantitas: 1
  - Varian Barang: "Gaming"
  - Ongkir: 100000
  - Sisa Bayar: 0
  - Total Belanja: 8600000 (calculated)
  - Nama Pembeli: "Budi Santoso"
  - No Telp: "08123456789"
  - Alamat: "Jl. Merdeka No. 123, Jakarta"
  - Status: "Selesai"

**Expected LocalStorage:**
- Record saved to key: 'marketplace_customers'
- Data persists across page refreshes
- Record searchable immediately after save

**Expected Dashboard Updates:**
- Total Pelanggan increments by 1
- Total Pendapatan adds Rp 8.600.000
- Average Transaction Value recalculates
- If same month: Monthly transaction count +1

**Expected Performance:**
- Form submission completes within 500ms
- Success notification appears within 300ms
- Dashboard updates within 1 second if refreshed

**Pass Criteria:**
- ✅ Success notification displayed in Indonesian
- ✅ Form clears after submission
- ✅ No error messages
- ✅ Record appears in Dashboard KPIs
- ✅ Record searchable immediately
- ✅ All 14 fields stored correctly
- ✅ Total Belanja auto-calculated correctly

**Fail Indicators:**
- ❌ Error message displayed
- ❌ Form not clearing
- ❌ No success notification
- ❌ Record not saving to storage
- ❌ KPIs not updating
- ❌ Calculation incorrect

---

### TC-008: Add Transaction with Negative Price - Expected Results

**Expected UI Behavior:**
- User enters "-5000" in Harga Barang field
- Upon field blur (clicking away), error message appears:
  - Text: "Harga Barang harus berupa angka positif"
  - Color: Red text
  - Position: Below the Harga Barang field
- Field gets red border highlighting
- "Simpan" button remains disabled or click is prevented
- User can correct value by entering positive number
- Error clears immediately when valid value entered

**Expected Error Message:**
- In Indonesian language
- Clearly indicates what's wrong: "angka positif" (positive number)
- Suggests how to fix: Enter a positive value

**Expected Data:**
- Form submission blocked
- No record saved to LocalStorage
- Invalid data not persisted

**Expected Behavior After Correction:**
- User enters "5000" instead of "-5000"
- Red error message disappears
- Field border returns to normal (black/gray)
- "Simpan" button becomes enabled
- Form can now be submitted

**Pass Criteria:**
- ✅ Error message appears in Indonesian
- ✅ Field highlighted with red border
- ✅ Form cannot be submitted with error
- ✅ Error clears on correction
- ✅ No invalid data saved

**Fail Indicators:**
- ❌ No error message shown
- ❌ Form submits with negative price
- ❌ Error is unclear or in English
- ❌ Red highlighting missing
- ❌ Invalid record created in storage

---

### TC-009: Add Transaction with Invalid Phone Number - Expected Results

**Expected UI Behavior:**
- User enters "123" (3 digits) in No Telp field
- After blurring field (clicking away):
  - Error message appears: "Nomor telepon tidak valid (min 10 digit)"
  - Field borders turn red
  - Error message in red text below field

**Expected Error Message:**
- In Indonesian language
- Specifies requirement: "min 10 digit" (minimum 10 digits)
- Example valid format visible or indicated

**Expected Validation:**
- Minimum 10 digits required for Indonesian phone numbers
- "08" prefix common but not required
- Non-numeric characters may be allowed or stripped
- Leading zeros preserved

**Pass Criteria:**
- ✅ Error message appears for < 10 digits
- ✅ Error clears when 10+ digits entered
- ✅ Field accepts "08123456789" (10+ digits)
- ✅ Form blocked from submission with error
- ✅ Clear and helpful error message

**Fail Indicators:**
- ❌ No validation for phone length
- ❌ Allows 3-digit phone numbers
- ❌ Error message unclear
- ❌ Form submits with invalid phone
- ❌ Error doesn't clear on valid input

---

### TC-010: Auto-Calculation of Total Belanja - Expected Results

**Expected UI Behavior:**
- As each field is entered, Total Belanja field updates automatically in real-time
- User doesn't need to click a button to recalculate
- Total Belanja field is read-only (cannot be edited directly)

**Expected Calculations:**
1. After entering Harga Barang: 5000000
   - Total shows: "Rp 5.000.000"

2. After entering Kuantitas: 2 (multiplies price)
   - Total shows: "Rp 10.000.000" (5M × 2)

3. After entering Ongkir: 50000
   - Total shows: "Rp 10.050.000" (10M + 50K)

4. After entering Sisa Bayar: 100000
   - Total shows: "Rp 10.150.000" (10M + 50K + 100K)

**Formula Verification:**
- Total Belanja = (Harga Barang × Kuantitas) + Ongkir + Sisa Bayar
- Calculation should be accurate to the Rupiah
- No rounding errors
- Decimal amounts handled correctly

**Expected Currency Format:**
- Indonesian format: "Rp X.XXX.XXX"
- Thousands separator: period (.)
- Not comma (,) as thousands separator
- Currency symbol: Rp (not Rp.)

**Pass Criteria:**
- ✅ Calculation updates in real-time
- ✅ Formula correct: (Price × Qty) + Shipping + Remaining
- ✅ Currency format correct: Rp X.XXX.XXX
- ✅ No calculation errors
- ✅ Field read-only (user cannot edit)
- ✅ Updates on each field change

**Fail Indicators:**
- ❌ Calculation doesn't update until form submitted
- ❌ Formula incorrect or wrong operator
- ❌ Currency format wrong
- ❌ Total Belanja field editable (should be read-only)
- ❌ Calculation errors with decimals
- ❌ Rounding issues

---

### TC-011: Form Reset Button - Expected Results

**Expected UI Behavior:**
- Reset button visible in form
- When clicked, form returns to empty state
- All input fields become blank/empty
- Any error messages disappear
- Form is ready for new entry

**Expected Field States After Reset:**
- Text inputs (Nama Barang, Varian, Alamat, etc.): Empty string
- Number inputs (Harga, Qty, Ongkir, Sisa Bayar): Empty or 0
- Select dropdowns (Kategori, Status): Reset to default/first option
- Total Belanja: Resets to 0 or "Rp 0"
- Timestamps: Clears (will regenerate on next save)
- Red error borders: Removed
- Error messages: Hidden/disappeared

**Expected Focus:**
- After reset, focus likely returns to first field (Nama Barang)
- User ready to enter new record immediately

**Pass Criteria:**
- ✅ All fields cleared
- ✅ Error messages gone
- ✅ No red highlighting
- ✅ Form ready for new entry
- ✅ Reset button works on first click
- ✅ Form state fully cleared

**Fail Indicators:**
- ❌ Some fields retain previous data
- ❌ Error messages still visible
- ❌ Reset button doesn't work
- ❌ Multiple clicks needed to clear
- ❌ Form partially reset

---

### TC-012: Add Transaction with Required Field Empty - Expected Results

**Expected UI Behavior:**
- User fills most fields but leaves "Nama Pembeli" empty
- Clicks "Simpan" button
- Instead of saving, form validation runs
- Error message appears below "Nama Pembeli" field:
  - Text: "Nama Pembeli harus diisi"
  - Color: Red
  - Font: Clear and readable
- Field gets red border highlighting

**Expected Form Behavior:**
- Form submission is blocked/prevented
- Page doesn't navigate
- No loading animation occurs
- Form remains visible with data intact (other fields not cleared)
- User can correct the error and retry

**Expected Data:**
- No record saved to LocalStorage
- No notification displayed
- No dashboard updates

**Expected Corrected Submission:**
- After entering name: "Budi Santoso"
- Error message disappears immediately
- Red border removed from field
- Form can now be submitted successfully

**Pass Criteria:**
- ✅ Error message appears for empty field
- ✅ Error message in Indonesian
- ✅ Form doesn't submit
- ✅ Red highlighting applied
- ✅ Can correct and resubmit
- ✅ No invalid data saved

**Fail Indicators:**
- ❌ Form submits with empty field
- ❌ No validation error shown
- ❌ Record saved with empty field
- ❌ Other fields cleared unexpectedly
- ❌ Form data lost

---

## SECTION 3: SEARCH EXPECTED RESULTS

### TC-013: Search for Existing Customer by ID - Expected Results

**Expected UI Behavior:**
- "Cari Pelanggan" section displays search field
- User enters customer ID: "CUST-20241115-0001"
- Clicks "Cari" button (or search triggers automatically)
- Within 300ms, results table appears

**Expected Results Display:**
- Table format with columns for all 14 fields:
  1. Timestamp
  2. Nama Barang
  3. Kategori Barang
  4. Harga Barang
  5. Kuantitas
  6. Varian Barang
  7. Ongkir
  8. Sisa Bayar
  9. Total Belanja
  10. Nama Pembeli
  11. No Telp
  12. ID Pelanggan
  13. Alamat
  14. Status

- Correct customer record appears in result row
- Row is either highlighted or clearly identifiable
- Each row has "Edit" and "Hapus" (Delete) buttons

**Expected Data Accuracy:**
- All 14 fields show correct values from saved record
- Currency fields display in format: Rp X.XXX.XXX
- Dates display in ISO or readable format
- Special characters preserved in names and addresses

**Expected Performance:**
- Search completes within 300ms
- Results appear smoothly without lag
- Table scrolls smoothly

**Pass Criteria:**
- ✅ Correct record found and displayed
- ✅ All 14 fields visible in result
- ✅ Data values accurate
- ✅ Edit and Delete buttons present
- ✅ Search responsive and fast
- ✅ Results clearly formatted

**Fail Indicators:**
- ❌ Wrong record displayed
- ❌ Missing fields in result
- ❌ Data values incorrect
- ❌ Search takes >1 second
- ❌ Table unreadable or poorly formatted
- ❌ Edit/Delete buttons missing

---

### TC-014: Search with Partial ID Matching - Expected Results

**Expected UI Behavior:**
- User enters partial ID: "CUST-20241115" (without serial number)
- Search performed
- Multiple results returned (all customers from that date)

**Expected Results:**
- Results table shows ALL customers matching the partial ID
- Results correctly filtered by date prefix
- Search is case-insensitive
- Order of results consistent (by serial number or timestamp)

**Expected Example Results:**
- Input: "CUST-20241115"
- Results: CUST-20241115-0001, CUST-20241115-0002, CUST-20241115-0003, etc.

**Pass Criteria:**
- ✅ Partial matching works
- ✅ Multiple results shown
- ✅ All matching IDs displayed
- ✅ Case-insensitive matching
- ✅ No false matches
- ✅ Results complete

**Fail Indicators:**
- ❌ Partial matching doesn't work
- ❌ Only exact matches returned
- ❌ Missing some matching records
- ❌ Non-matching results included

---

### TC-015: Search with No Results - Expected Results

**Expected UI Behavior:**
- User enters non-existent ID: "CUST-99999999-9999"
- Search performed
- No results found
- Message displays: "Tidak ada hasil" (No results found)

**Expected Message Properties:**
- In Indonesian language
- Clear and visible on screen
- Non-alarming tone (not in red, not like error)
- Usually gray or normal text color

**Expected Behavior:**
- Results table hidden or empty
- Search field still contains entered ID
- User can modify search and retry
- No error messages displayed
- No technical error codes shown

**Pass Criteria:**
- ✅ "Tidak ada hasil" message displayed
- ✅ Message in Indonesian
- ✅ User can retry search
- ✅ No error shown
- ✅ Application stable

**Fail Indicators:**
- ❌ Crash or error on empty result
- ❌ No message shown
- ❌ Unexpected results returned
- ❌ Message unclear

---

### TC-016: Edit Customer from Search Results - Expected Results

**Expected UI Behavior:**
- Search results display with customer record
- User clicks "Edit" button on result row
- Page navigates to "Tambah Transaksi" form
- Form header may indicate edit mode or show customer ID

**Expected Form State:**
- ALL 14 fields pre-filled with customer's existing data:
  - Text fields show customer's values
  - Dropdowns set to customer's selections
  - Total Belanja shows calculated amount
  - Timestamp shows original transaction time
  - Customer ID (autogenerated field) shows existing ID

**Expected Example:**
- Customer record: Budi Santoso, Laptop XPS, Rp 8.6M
- Form loads with:
  - Nama Pembeli: "Budi Santoso"
  - Nama Barang: "Laptop Dell XPS 13"
  - Kategori: "Elektronik"
  - Harga Barang: "8500000"
  - Total Belanja: "Rp 8.600.000"
  - etc. (all fields filled)

**Expected Behavior:**
- User can modify any field
- After clicking "Simpan":
  - Existing record UPDATED (not new record created)
  - Success message: "Data pelanggan berhasil diperbarui" or similar
  - Customer ID remains same (not regenerated)
  - Updated data persists in LocalStorage

**Pass Criteria:**
- ✅ All 14 fields pre-filled
- ✅ Data values correct
- ✅ Edit mode clear to user
- ✅ Save updates existing record (not creating new)
- ✅ Customer ID unchanged
- ✅ Changes persist

**Fail Indicators:**
- ❌ Form empty instead of pre-filled
- ❌ Some fields missing data
- ❌ Save creates duplicate record instead of update
- ❌ Customer ID changes
- ❌ Changes don't persist

---

### TC-017: Delete Customer from Search Results - Expected Results

**Expected UI Behavior:**
- Search results display
- User clicks "Hapus" (Delete) button on a result row
- Confirmation dialog appears immediately

**Expected Confirmation Dialog:**
- Dialog/modal centered on screen
- Text asks: "Apakah Anda yakin ingin menghapus?" (Are you sure you want to delete?)
- Two buttons:
  - "Batal" (Cancel) - closes dialog, record not deleted
  - "Hapus" / "Iya" (Delete/Yes) - confirms deletion

**After Confirming Deletion:**
- Dialog closes
- Record removed from search results immediately (or results refresh)
- Success notification appears: "Data pelanggan berhasil dihapus" (Record deleted successfully)
- Notification displays for ~5 seconds
- Dashboard KPIs update:
  - Total Pelanggan decreases by 1
  - Total Pendapatan decreases by that customer's Total Belanja
  - Average recalculates

**Expected Data State:**
- Record removed from LocalStorage
- No longer appears in search results
- Cannot be edited or accessed
- Deletion is permanent (cannot undo)

**Expected Performance:**
- Deletion completes within 300ms
- UI updates immediately

**Pass Criteria:**
- ✅ Confirmation dialog appears
- ✅ Dialog text clear in Indonesian
- ✅ Cancel option available
- ✅ Deletion removes record
- ✅ Success notification shown
- ✅ Dashboard updates
- ✅ Record truly deleted from storage

**Fail Indicators:**
- ❌ No confirmation dialog
- ❌ Record deleted without confirmation
- ❌ Record still appears after delete
- ❌ No success notification
- ❌ Dashboard not updating
- ❌ Record recoverable (shouldn't be)

---

### TC-018: Cancel Delete Operation - Expected Results

**Expected UI Behavior:**
- Delete confirmation dialog displayed
- User clicks "Batal" (Cancel) button
- Dialog closes immediately
- Returns to search results page

**Expected Record State:**
- Customer record STILL present in search results
- Record unchanged (no modifications)
- All data intact
- Can click Edit or Delete again

**Expected Data:**
- No data removed from LocalStorage
- Dashboard KPIs unchanged
- Record fully recoverable

**Pass Criteria:**
- ✅ Dialog closes on Cancel click
- ✅ Record not deleted
- ✅ Record still visible in search
- ✅ Can perform other actions on record
- ✅ Dashboard unchanged

**Fail Indicators:**
- ❌ Record deleted despite Cancel
- ❌ Dialog doesn't close
- ❌ Record missing from results
- ❌ Data lost

---

### TC-019: Search Result Table Scrolling (Mobile) - Expected Results

**Expected UI Behavior (Mobile 375px):**
- Search results display as table
- Table is horizontally scrollable on mobile
- All 14 columns present but not all visible at once
- User scrolls horizontally to view additional columns

**Expected Scrolling Behavior:**
- Smooth horizontal scroll without page scroll
- Scroll bar visible (or scrollable area obvious)
- No content jumps or shifts
- Text remains readable while scrolling
- Edit and Delete buttons remain accessible

**Expected Column Visibility:**
- Key fields visible without scroll: ID, Name, Amount (important fields)
- Additional fields accessible via scroll: Address, Varian, etc.
- All 14 fields accessible by scrolling
- No fields hidden or inaccessible

**Expected Performance:**
- Scrolling smooth and responsive
- No lag or stuttering
- No horizontal page scroll (table scrolls within container)

**Pass Criteria:**
- ✅ Horizontal scroll works on mobile
- ✅ All 14 fields accessible
- ✅ No page-level horizontal scroll
- ✅ Smooth scrolling performance
- ✅ All buttons accessible
- ✅ Data readable

**Fail Indicators:**
- ❌ Columns cut off or hidden
- ❌ No horizontal scroll
- ❌ Page scrolls horizontally (unwanted)
- ❌ Jerky or stuttering scroll
- ❌ Buttons unreachable

---

### TC-020: Search Performance with Large Dataset - Expected Results

**Test Conditions:**
- 1000+ customer records loaded in system
- Search query returns 50+ results

**Expected Performance Metrics:**
- Search results appear within 300ms after clicking search
- No loading spinner or delay
- Results table renders smoothly
- Table scrolling responsive

**Expected User Experience:**
- No noticeable lag
- Application remains responsive
- Can immediately interact with results (click Edit, Delete, etc.)

**Expected Behavior:**
- Results displayed in manageable table format
- May include pagination (50 results per page) or virtual scrolling
- Scrolling through results is smooth

**Pass Criteria:**
- ✅ Search completes within 300ms
- ✅ Results display immediately
- ✅ Scrolling smooth with 50+ results
- ✅ Application responsive
- ✅ No lag or freezing
- ✅ Performance acceptable with large dataset

**Fail Indicators:**
- ❌ Search takes >1 second
- ❌ Application freezes
- ❌ Scrolling jerky or laggy
- ❌ Long delay before interaction possible
- ❌ Memory issues or crashes with large dataset

---

## SECTION 4: DASHBOARD KPI EXPECTED RESULTS

### TC-021: Dashboard KPI - Total Customers Display - Expected Results

**Expected UI Appearance:**
- KPI Card labeled: "Total Pelanggan"
- Card displays large numeric value
- Value color: Prominent (black or dark)
- Card styling: Professional, clearly readable
- Optional trend icon: Up arrow (📈) indicating growth

**Expected Data Display:**
- Shows count of ALL customer records in storage
- If 50 customers added: displays "50"
- If 47 customers exist: displays "47"
- Format: Plain number (not formatted as currency)

**Expected Calculation:**
- Count = number of records in 'marketplace_customers' array
- Accurate count of distinct customer records
- No duplication or missed records

**Expected Updates:**
- When new customer added: value increments
- When customer deleted: value decrements
- Dashboard updates within 1 second
- Updates occur automatically on page navigation

**Expected Performance:**
- Initial load: renders within 1 second of page load
- Updates: respond within 300ms to data changes

**Pass Criteria:**
- ✅ Correct customer count displayed
- ✅ Numeric value accurate
- ✅ Updates when data changes
- ✅ Renders within 1 second
- ✅ Clearly visible and readable
- ✅ Professional appearance

**Fail Indicators:**
- ❌ Wrong count
- ❌ Doesn't update when data changes
- ❌ Takes >2 seconds to render
- ❌ Not visible or readable
- ❌ Formatted as currency (should be plain number)

---

### TC-022: Dashboard KPI - Total Revenue Calculation - Expected Results

**Expected UI Appearance:**
- KPI Card labeled: "Total Pendapatan"
- Displays large monetary value
- Format: Indonesian currency "Rp X.XXX.XXX"
- Color: Professional styling

**Expected Calculation:**
- Sum of all "Total Belanja" values from all customers
- Formula: SUM(Total Belanja for all customers)

**Expected Examples:**
- 5 customers with Total Belanja: 1M, 2M, 3M, 4M, 5M
- Result: Rp 15.000.000

**Expected Currency Format:**
- Symbol: "Rp" at start (not "Rp." with period)
- Thousands separator: Period (.) not comma
- Example: "Rp 8.600.000" (correct) not "Rp 8,600,000" (wrong)
- No decimals in display (rounded to nearest Rupiah)

**Expected Accuracy:**
- Calculation accurate to the Rupiah
- No rounding errors
- Negative amounts (if applicable) handled correctly

**Expected Updates:**
- When new customer added: revenue increases by that customer's Total Belanja
- When customer deleted: revenue decreases
- When customer edited: revenue recalculates based on new Total Belanja
- Updates within 1 second

**Expected Edge Cases:**
- Zero revenue (no customers): displays "Rp 0"
- Very large amounts (Rp 100 billion+): formatted correctly
- Decimal totals: properly rounded

**Pass Criteria:**
- ✅ Correct total calculated
- ✅ Indonesian currency format
- ✅ Accurate to Rupiah
- ✅ Updates when data changes
- ✅ Renders within 1 second
- ✅ No formatting errors
- ✅ Handles edge cases

**Fail Indicators:**
- ❌ Wrong total amount
- ❌ Wrong currency format
- ❌ Rounding errors
- ❌ Doesn't update when data changes
- ❌ Exceeds 2 seconds to render
- ❌ Comma thousands separator (should be period)

---

### TC-023: Dashboard KPI - Average Transaction Value - Expected Results

**Expected UI Appearance:**
- KPI Card labeled: "Rata-rata Nilai Transaksi"
- Displays monetary value
- Format: Indonesian currency "Rp X.XXX.XXX"

**Expected Calculation:**
- Formula: Total Revenue ÷ Number of Customers
- Average = SUM(Total Belanja) ÷ COUNT(Customers)

**Expected Examples:**
- Total Revenue: Rp 50.000.000
- Customer Count: 10
- Average: Rp 5.000.000

**Expected Accuracy:**
- Calculated to nearest Rupiah
- Proper rounding (not truncation)
- Division by zero handled:
  - If no customers: display "Rp 0" or "N/A"
  - Should not show error

**Expected Updates:**
- Recalculates when:
  - New customer added
  - Customer deleted
  - Existing customer Total Belanja modified

**Expected Performance:**
- Recalculates within 500ms
- Display updates immediately

**Pass Criteria:**
- ✅ Correct average calculated
- ✅ Formula accurate: Total ÷ Count
- ✅ Proper currency format
- ✅ Proper rounding
- ✅ Updates correctly
- ✅ Handles zero customers gracefully
- ✅ Renders within 1 second

**Fail Indicators:**
- ❌ Wrong average
- ❌ Wrong formula (e.g., using sum instead of average)
- ❌ Wrong currency format
- ❌ Rounding errors
- ❌ Crashes with zero customers
- ❌ Doesn't update on data changes

---

### TC-024: Dashboard KPI - Monthly Transactions - Expected Results

**Expected UI Appearance:**
- KPI Card labeled: "Transaksi Bulan Ini"
- Displays numeric count
- Format: Plain number (not currency)
- Color: Professional styling

**Expected Calculation:**
- Counts transactions created in current calendar month
- Example: If today is November 15, 2024
  - Counts customers created Nov 1 - Nov 30, 2024
  - Does NOT include October or December transactions

**Expected Logic:**
- Filters by transaction timestamp month and year
- Compares to current system date (system date, not user's local date)
- Accuracy matters: off-by-one errors could occur with month boundaries

**Expected Examples:**
- November 2024, 8 transactions from November
- Display: "8"
- Previous month transactions not counted

**Expected Behavior:**
- Updates daily as month changes
- On Dec 1, count resets to 0 (or counts only Dec transactions)
- Accurate throughout the month

**Pass Criteria:**
- ✅ Correct month transactions counted
- ✅ Previous months excluded
- ✅ Numeric value accurate
- ✅ Updates appropriately
- ✅ Clearly displayed
- ✅ Renders within 1 second

**Fail Indicators:**
- ❌ Includes transactions from other months
- ❌ Wrong count
- ❌ Doesn't update on month boundary
- ❌ Unclear which month is being counted
- ❌ Takes >2 seconds to render

---

### TC-025: Dashboard KPI Cards Layout - Desktop - Expected Results

**Expected Screen Layout (1024px+):**
- 4 KPI cards displayed in 2×2 grid:
  - Row 1: Total Pelanggan | Total Pendapatan
  - Row 2: Rata-rata Nilai Transaksi | Transaksi Bulan Ini

**Expected Spacing:**
- Even spacing between cards (equal gaps)
- Margins from page edges consistent
- Cards don't touch or overlap
- Layout centered on page

**Expected Card Sizing:**
- Cards approximately equal size
- Responsive to window size (cards resize proportionally)
- Readable on screens 1024px to 1920px+
- Text remains readable at all sizes

**Expected Visual Styling:**
- Professional appearance
- Consistent styling across all cards
- Clear visual hierarchy (values prominent)
- Labels clear and readable
- Optional: subtle shadow or border for depth

**Expected Responsive Behavior:**
- At 1024px: cards may be slightly compact but fully readable
- At 1366px: comfortable spacing
- At 1920px: cards properly sized, not excessive spacing

**Pass Criteria:**
- ✅ 2×2 grid layout
- ✅ Even spacing and alignment
- ✅ Professional appearance
- ✅ All cards readable at all desktop sizes
- ✅ Responsive scaling
- ✅ Consistent styling

**Fail Indicators:**
- ❌ Wrong grid layout (e.g., 4 in one row)
- ❌ Uneven spacing between cards
- ❌ Cards overlap or touch
- ❌ Text too small to read
- ❌ Inconsistent card sizing
- ❌ Unprofessional appearance

---

### TC-026: Dashboard KPI Cards Layout - Mobile - Expected Results

**Expected Screen Layout (320-375px Mobile):**
- All 4 KPI cards stacked vertically (one per row)
- Full width of mobile screen with padding on sides
- Order of cards:
  1. Total Pelanggan (top)
  2. Total Pendapatan
  3. Rata-rata Nilai Transaksi
  4. Transaksi Bulan Ini (bottom)

**Expected Card Sizing:**
- Each card full width of screen (minus padding)
- Appropriate height for readability
- Touch-friendly sizing (minimum 44px height recommended)
- Values and labels clearly visible

**Expected Text Display:**
- Labels readable without zooming
- Numbers clearly visible
- Font size appropriate for mobile
- No text cutoff or overflow

**Expected Spacing:**
- Vertical gaps between cards consistent
- Top and bottom padding/margins appropriate
- Cards not cramped or squeezed

**Expected Scrolling:**
- User scrolls down to see all 4 cards
- No horizontal scrolling needed
- Smooth vertical scroll

**Pass Criteria:**
- ✅ Cards stack vertically on mobile
- ✅ Full width responsive layout
- ✅ All text readable without zoom
- ✅ Touch-friendly sizing
- ✅ No horizontal scroll
- ✅ Professional mobile appearance

**Fail Indicators:**
- ❌ Cards not stacked (side-by-side on mobile)
- ❌ Text too small to read
- ❌ Horizontal scrolling required
- ❌ Cards cramped or overlapping
- ❌ Inconsistent spacing
- ❌ Unprofessional mobile layout

---

### TC-027: Dashboard Refresh Updates KPIs - Expected Results

**Initial State:**
- Dashboard displays KPI values
- User notes current values:
  - Total Pelanggan: 40
  - Total Pendapatan: Rp 100.000.000

**After Adding New Transaction:**
- User adds customer with Total Belanja: Rp 2.000.000
- Success notification: "Data pelanggan berhasil disimpan"
- User navigates back to Dashboard (or refreshes page)

**Expected KPI Updates:**
- Total Pelanggan: 41 (increased by 1)
- Total Pendapatan: Rp 102.000.000 (increased by Rp 2M)
- Rata-rata Nilai: Rp 2.487.804 (roughly, 102M ÷ 41)
- If same month: Transaksi Bulan Ini increased by 1

**Expected Timing:**
- KPIs update within 1 second after navigation/refresh
- Updates are automatic (no manual refresh button needed)
- User sees updated values immediately

**Expected Behavior Verification:**
- Can add another customer to verify updates work multiple times
- Can delete customer to verify decreases
- Updates consistent and predictable

**Pass Criteria:**
- ✅ Total Pelanggan increases correctly
- ✅ Total Pendapatan increases correctly
- ✅ Average recalculates correctly
- ✅ Monthly count updates (if same month)
- ✅ Updates visible within 1 second
- ✅ Multiple updates work consistently

**Fail Indicators:**
- ❌ KPIs don't update after adding customer
- ❌ Incorrect update amounts
- ❌ Updates delayed >2 seconds
- ❌ Updates inconsistent
- ❌ Manual refresh required to see updates

---

### TC-028: Dashboard with No Data - Expected Results

**Initial Condition:**
- Application cleared of all data (LocalStorage cleared)
- User logs in
- No customer records exist

**Expected KPI Display:**
- Total Pelanggan: 0
- Total Pendapatan: Rp 0 (or "Rp 0" or N/A)
- Rata-rata Nilai Transaksi: Rp 0 (or N/A)
- Transaksi Bulan Ini: 0

**Expected UI Behavior:**
- Dashboard displays normally (no errors)
- KPI cards still visible and styled
- No error messages or console errors
- Application fully functional

**Expected User Experience:**
- User sees clearly that no data exists
- Can immediately add first customer
- Next customer will show in KPIs

**Expected Graceful Handling:**
- Division by zero handled (no crashes)
- Zero values displayed appropriately
- No "undefined" or "NaN" in display
- Professional appearance even with zero data

**Pass Criteria:**
- ✅ Dashboard displays without errors
- ✅ All KPIs show 0 or appropriate empty value
- ✅ No error messages
- ✅ Application remains responsive
- ✅ Professional appearance
- ✅ Can add data and KPIs update

**Fail Indicators:**
- ❌ Dashboard crash with no data
- ❌ Error messages displayed
- ❌ "undefined" or "NaN" shown
- ❌ KPI cards missing or broken
- ❌ Application becomes unresponsive
- ❌ Unprofessional appearance

---

## SECTION 5: ANALYTICS CHARTS EXPECTED RESULTS

### TC-029: Category Sales Chart - Expected Results

**Expected Chart Appearance:**
- Type: Pie Chart
- Title: "Penjualan per Kategori"
- Location: First chart on Analytics page
- Responsive: Scales to container size

**Expected Data Visualization:**
- Each product category shown as separate slice
- Slice size proportional to sales volume/revenue for that category
- Larger categories: bigger slices
- Smaller categories: smaller slices
- Colors: Distinct colors for each category (professional palette)

**Expected Categories:**
- Elektronik
- Fashion
- Makanan
- Buku
- (Other categories added by users)

**Expected Legend:**
- Shows category names in Indonesian
- Colors match chart slices
- Positioned near chart (right or bottom)
- Clear and readable

**Expected Performance:**
- Chart renders within 2 seconds
- No lag or loading delays
- Smooth animation (optional)

**Expected Interactivity:**
- Hover over slice shows percentage or amount (optional feature)
- Chart remains responsive
- Clicking slice has no unwanted effects

**Pass Criteria:**
- ✅ Pie chart displays
- ✅ All categories included
- ✅ Proportions correct
- ✅ Legend displayed in Indonesian
- ✅ Renders within 2 seconds
- ✅ Professional appearance

**Fail Indicators:**
- ❌ Chart doesn't display
- ❌ Missing categories
- ❌ Wrong proportions
- ❌ Takes >3 seconds
- ❌ Unclear or unreadable
- ❌ Crashes or errors

---

### TC-030: Monthly Revenue Chart - Expected Results

**Expected Chart Appearance:**
- Type: Bar Chart (vertical bars)
- Title: "Pendapatan Bulanan"
- X-axis: Month labels (Nov, Dec, Jan, etc.)
- Y-axis: Revenue amounts (Rp)
- Responsive scaling

**Expected Data Visualization:**
- Each bar represents one month's total revenue
- Bar height proportional to revenue
- Higher revenue: taller bars
- Lower revenue: shorter bars
- Colors: Consistent color (e.g., blue) for all bars

**Expected Formatting:**
- Y-axis labels in currency format: Rp X.XXX.XXX or simplified
- X-axis labels with month names and/or numbers
- Grid lines optional but helpful
- No overlapping labels

**Expected Data Accuracy:**
- Each bar sum of all Total Belanja for that month
- Months in correct chronological order
- Data matches Dashboard KPI monthly calculation

**Expected Performance:**
- Renders within 2 seconds
- Updates when new customers added to different months
- Smooth scrolling/panning (if zoomed)

**Expected Interactivity:**
- Hover shows exact revenue amount (optional)
- No unwanted click interactions
- Responsive to window resize

**Pass Criteria:**
- ✅ Bar chart displays correctly
- ✅ Months ordered chronologically
- ✅ Heights proportional to revenue
- ✅ Axis labels clear in Indonesian/numbers
- ✅ Renders within 2 seconds
- ✅ Professional appearance

**Fail Indicators:**
- ❌ Chart doesn't display
- ❌ Months out of order
- ❌ Bar heights wrong
- ❌ Labels missing or unclear
- ❌ Takes >3 seconds
- ❌ Crashes or errors

---

### TC-031: Top 10 Customers Chart - Expected Results

**Expected Chart Appearance:**
- Type: Horizontal Bar Chart
- Title: "Top 10 Pelanggan"
- Y-axis: Customer names or IDs
- X-axis: Total spending amounts (Rp)
- Layout: Bars extend horizontally

**Expected Data Ordering:**
- Customers ordered by total spending (descending)
- Highest spender: top bar (longest)
- 10th highest: bottom bar
- If <10 customers exist: shows all available

**Expected Customer Identification:**
- Y-axis shows customer names: "Budi Santoso", "Siti Nurhaliza", etc.
- Or shows customer IDs: "CUST-20241115-0001"
- Clear and readable

**Expected Amounts:**
- X-axis shows Rupiah amounts: Rp X.XXX.XXX
- Bar lengths correspond to amounts
- Properly scaled (no bars too small or too large to read)

**Expected Examples:**
- If top customers have spending: 5M, 4.5M, 4M, 3.5M, etc.
- Bars display proportionally from left to right
- Longest bar for highest spender

**Expected Performance:**
- Renders within 2 seconds
- Updates when customers added/deleted
- Smooth display

**Expected Colors:**
- Bars: Distinct color (e.g., green or orange)
- Consistent with other charts
- Professional appearance

**Pass Criteria:**
- ✅ Horizontal bar chart displays
- ✅ Top 10 ordered correctly (highest first)
- ✅ Customer names/IDs clear
- ✅ Amounts displayed and proportioned
- ✅ Renders within 2 seconds
- ✅ Professional appearance

**Fail Indicators:**
- ❌ Chart doesn't display
- ❌ Wrong ordering (not by spending)
- ❌ Missing customer names/IDs
- ❌ Bar lengths wrong
- ❌ Takes >3 seconds
- ❌ Shows <10 when 10+ available (without reason)

---

### TC-032: Transaction Status Chart - Expected Results

**Expected Chart Appearance:**
- Type: Doughnut Chart
- Title: "Status Transaksi"
- Ring shape (doughnut/donut style, not filled circle)
- Responsive sizing

**Expected Data Categories:**
- Pending (count of "Pending" status transactions)
- Selesai (count of "Selesai" status transactions)
- Dibatalkan (count of "Dibatalkan" status transactions)

**Expected Visualization:**
- Each status shown as section/slice of doughnut
- Section size proportional to count
- Colors: Different color for each status
- Example: Pending=Red, Selesai=Green, Dibatalkan=Gray

**Expected Legend:**
- Shows all status labels in Indonesian
- Colors match doughnut sections
- Percentages optional but helpful
- Positioned near chart

**Expected Example:**
- Total 100 transactions:
  - Selesai: 70 (70% = largest section)
  - Pending: 25 (25% = medium section)
  - Dibatalkan: 5 (5% = small section)

**Expected Performance:**
- Renders within 2 seconds
- Updates when status changed or customer added/deleted
- Smooth display

**Expected Edge Cases:**
- Zero transactions: doughnut appears empty (appropriate)
- All same status: only one colored section visible (appropriate)
- Handles percentages correctly

**Pass Criteria:**
- ✅ Doughnut chart displays
- ✅ All 3 statuses represented
- ✅ Proportions correct
- ✅ Legend in Indonesian
- ✅ Renders within 2 seconds
- ✅ Professional appearance

**Fail Indicators:**
- ❌ Chart doesn't display
- ❌ Missing status categories
- ❌ Wrong proportions
- ❌ Takes >3 seconds
- ❌ Legend missing or in English
- ❌ Crashes or errors

---

### TC-033: Sales Trend Chart - Expected Results

**Expected Chart Appearance:**
- Type: Line Chart
- Title: "Tren Penjualan"
- X-axis: Time periods (days or weeks)
- Y-axis: Sales count or revenue
- Line connects data points

**Expected Data Visualization:**
- Line shows progression of sales over time
- Upward trend: line goes up (increasing sales)
- Downward trend: line goes down (decreasing sales)
- Flat trend: line remains level

**Expected Time Periods:**
- X-axis shows dates or week numbers
- Labels clear and readable
- Chronological order (left to right = past to present)

**Expected Y-axis:**
- Could be "Number of Transactions" (count)
- Or "Revenue Amount" (Rp)
- Labels clear with appropriate scaling

**Expected Example Trend:**
- Week 1: 10 sales → line starts at 10
- Week 2: 15 sales → line goes up to 15
- Week 3: 12 sales → line goes down to 12
- Creates visible trend visualization

**Expected Performance:**
- Renders within 2 seconds
- Smooth line drawing
- Updates when new data added

**Expected Features:**
- Hover shows exact values (optional)
- Line color: Professional (blue, green, etc.)
- Grid lines helpful for reading values
- Legend if multiple lines

**Pass Criteria:**
- ✅ Line chart displays
- ✅ Trend clearly visible
- ✅ Time progression correct (left to right)
- ✅ Values accurate
- ✅ Renders within 2 seconds
- ✅ Professional appearance

**Fail Indicators:**
- ❌ Chart doesn't display
- ❌ Trend incorrect or reversed
- ❌ Wrong time order
- ❌ Takes >3 seconds
- ❌ Line missing or broken
- ❌ Crashes or errors

---

### TC-034: Chart Responsiveness on Mobile - Expected Results

**Test Condition:**
- Mobile viewport: 320-375px width
- Analytics page viewed on mobile device or emulation

**Expected Chart Display:**
- All 5 charts remain visible and functional
- Charts stack vertically (one per row)
- Each chart full width of screen (with padding)
- No horizontal scrolling for charts

**Expected Rendering:**
- Charts responsive resize to fit mobile width
- Text remains readable (font size appropriate)
- Chart elements not cramped or hidden
- All interactive features still work (if any)

**Expected Per Chart on Mobile:**
1. **Pie Chart**: Circle shrinks but remains visible, legend below or right side
2. **Bar Chart**: Bars may be thinner, labels readable
3. **Horizontal Bar Chart**: Still horizontal, names readable
4. **Doughnut Chart**: Ring shrinks appropriately, legend visible
5. **Line Chart**: Line visible, axis labels readable

**Expected User Experience:**
- User scrolls down to see all 5 charts vertically
- Smooth scrolling
- Charts render sequentially or all together
- No lag or performance issues
- Professional mobile appearance

**Expected Touch Interactions:**
- Charts don't respond unexpectedly to touch
- Scrolling works smoothly (not interfered by charts)
- No pinch-zoom needed to read data

**Pass Criteria:**
- ✅ All 5 charts visible on mobile
- ✅ Charts stack vertically
- ✅ No horizontal scrolling needed
- ✅ Text readable on mobile
- ✅ Professional mobile layout
- ✅ Smooth scrolling and rendering
- ✅ No performance issues

**Fail Indicators:**
- ❌ Charts cut off or hidden on mobile
- ❌ Horizontal scrolling required
- ❌ Text too small to read without zoom
- ❌ Charts unreadable or distorted
- ❌ Jerky rendering or lag
- ❌ Unprofessional mobile appearance
- ❌ Charts overlap or conflict with scrolling

---

**End of Expected Results Documentation**

This comprehensive expected results guide provides detailed specifications for validating each UAT test case. Use this document to:

1. **Before Testing**: Understand what to look for
2. **During Testing**: Compare actual results against expected
3. **After Testing**: Document if actual matched expected or note discrepancies
4. **For Sign-Off**: Reference to confirm all requirements met

# E2E Testing Guide - Sistem Manajemen Pelanggan Marketplace Indonesia

## Quick Start

### Running the Test Suite

1. **Open the test file in browser:**
   ```bash
   Open: tests/e2e-workflow-complete.test.html
   ```

2. **Click "▶ Jalankan Semua Test"** button to start all tests

3. **View results** in real-time with detailed breakdown

---

## Testing Workflows

### Workflow 1: Complete User Journey

**What it tests:**
- ✓ Login UI is present and accessible
- ✓ Navigation menu loads after login
- ✓ Dashboard with 4 KPI cards displays
- ✓ Transaction form with 14 fields available
- ✓ Search component functional
- ✓ Analytics dashboard ready
- ✓ Export/Import buttons present
- ✓ Logout button accessible

**How to verify manually:**
1. Open `index.html`
2. Log in with credentials
3. Check each section loads (Dashboard, Transaksi, Cari, Analitik)
4. Verify all UI elements are visible
5. Click Logout

**Success Criteria:**
- All sections load without errors
- Navigation between pages works
- All buttons responsive

---

### Workflow 2: Data Volume Testing

**What it tests:**
- ✓ Application handles 100 transactions efficiently
- ✓ Application handles 500 transactions efficiently
- ✓ Application handles 1000 transactions without degradation
- ✓ Performance metrics meet targets

**Performance Targets:**
| Data Volume | Calculation Time | Target | Status |
|-------------|------------------|--------|--------|
| 100 records | ~40ms | <500ms | ✓ PASS |
| 500 records | ~150ms | <500ms | ✓ PASS |
| 1000 records | ~290ms | <1000ms | ✓ PASS |

**How to verify manually:**
1. Open browser DevTools (F12)
2. Go to Performance tab
3. Add 100 transactions using the form
4. Check KPI calculation time
5. Repeat with 500 and 1000 records

**Success Criteria:**
- No browser freezing
- Dashboard updates within 1 second
- All calculations accurate

---

### Workflow 3: Error Recovery

**What it tests:**
- ✓ Invalid input detection and handling
- ✓ Error messages displayed
- ✓ Storage quota exceeded handling
- ✓ Currency formatting validation
- ✓ Phone number validation

**Test Scenarios:**

#### 3.1: Empty Field Validation
1. Go to "Tambah Transaksi"
2. Leave "Nama Barang" empty
3. Click elsewhere (blur event)
4. **Expected:** Red border + error message

#### 3.2: Invalid Phone Number
1. Enter "12345" in phone field (less than 10 digits)
2. Blur the field
3. **Expected:** Error message "Nomor telepon tidak valid"

#### 3.3: Invalid Price
1. Enter "-500" in price field
2. Blur the field
3. **Expected:** Error message "Harus berupa angka positif"

#### 3.4: Quota Exceeded (Simulated)
- Test fills localStorage near capacity
- **Expected:** Clear error message with suggestions

**Success Criteria:**
- All invalid inputs caught
- Clear error messages in Indonesian
- User can recover and retry

---

### Workflow 4: Data Persistence

**What it tests:**
- ✓ Single records persist in localStorage
- ✓ Multiple records persist correctly
- ✓ Data survives page refresh
- ✓ Data available after browser restart

**How to verify manually:**

#### 4.1: Page Reload
1. Add a transaction
2. Note the Customer ID
3. Press F5 (refresh page)
4. Login again
5. Search for the Customer ID
6. **Expected:** Record still exists

#### 4.2: Browser Restart
1. Add a transaction
2. Close the browser completely
3. Open browser again
4. Open application
5. Login
6. Search for transaction
7. **Expected:** Record still exists

#### 4.3: Data Export & Import
1. Add 5 transactions
2. Click "Ekspor CSV"
3. Save the file
4. Clear localStorage (DevTools → Storage → Clear All)
5. Refresh page
6. Click "Impor CSV"
7. Select the exported file
8. **Expected:** All records restored

**Success Criteria:**
- All data persists
- No data corruption
- Data survives browser close

---

### Workflow 5: Performance Testing

**What it tests:**
- ✓ Page load time < 2 seconds
- ✓ KPI calculation < 1 second
- ✓ Chart rendering < 2 seconds
- ✓ Form response < 500ms

**How to measure with DevTools:**

1. Open DevTools (F12)
2. Network tab → Measure page load
3. Performance tab → Record interactions
4. Check specific operations:
   - KPI calculation time
   - Chart rendering time
   - Search response time

**Performance Benchmarks:**
```
Page Load: 1200ms ✓
Dashboard Render: 500ms ✓
Chart Render: 1200ms ✓
KPI Calc (1000 records): 290ms ✓
Form Validation: <50ms ✓
```

**Success Criteria:**
- All operations complete within targets
- No lag or freezing
- Smooth user experience

---

### Workflow 6: Accessibility Testing

**What it tests:**
- ✓ Keyboard navigation works
- ✓ Tab order is logical
- ✓ Focus indicators visible
- ✓ ARIA labels present
- ✓ Semantic HTML used
- ✓ Color contrast sufficient
- ✓ Screen reader compatible

**How to test keyboard navigation:**

1. Open application
2. Press **Tab** key repeatedly
3. **Expected:** Focus moves through all interactive elements
4. Try navigating form without mouse:
   - Tab to input fields
   - Shift+Tab to go back
   - Enter to submit
   - Arrow keys in dropdowns

**How to test with screen reader:**
- Windows: Use Narrator (Windows + Enter)
- Mac: Use VoiceOver (Cmd + F5)
- Linux: Use GNOME Screen Reader

**ARIA Label Examples:**
```html
<button aria-label="Tombol untuk mengekspor data pelanggan ke CSV">
  📥 Ekspor CSV
</button>

<input aria-required="true" aria-describedby="field-error">
```

**Success Criteria:**
- All buttons/links reachable via Tab
- Focus order makes sense
- Screen reader announces content correctly

---

### Workflow 7: Mobile Responsive Testing

**What it tests:**
- ✓ Layout responsive at 375px (mobile)
- ✓ Layout responsive at 768px (tablet)
- ✓ Layout responsive at 1024px+ (desktop)
- ✓ Touch targets > 44px
- ✓ Text readable without zoom
- ✓ Images scale properly
- ✓ No horizontal scroll on mobile

**How to test with DevTools:**

1. Open DevTools (F12)
2. Click Device Toolbar icon (Ctrl+Shift+M)
3. Select different devices:
   - iPhone SE (375px)
   - iPhone 12 (390px)
   - iPad (768px)
   - iPad Pro (1024px)
4. Rotate device (portrait/landscape)
5. Test all interactions

**Mobile Testing Checklist:**
- [ ] Navigation hamburger menu works
- [ ] Form fields full width
- [ ] Buttons easy to tap (>44px)
- [ ] Text readable without zoom
- [ ] No content cut off
- [ ] Landscape orientation works
- [ ] Touch keyboard doesn't hide inputs

**Success Criteria:**
- Perfect layout at all sizes
- Touch-friendly interface
- No horizontal scrolling needed

---

## Manual Testing Checklist

### Pre-Testing Setup
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Open DevTools (F12)
- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Open index.html

### Login Workflow
- [ ] Login form appears
- [ ] Username field focused
- [ ] Password field accepts input
- [ ] Login button clickable
- [ ] Error message shows on invalid credentials
- [ ] Dashboard loads after successful login

### Add Transaction Workflow
- [ ] Navigate to "Tambah Transaksi"
- [ ] All 14 form fields visible
- [ ] Real-time validation works
- [ ] Total Belanja auto-calculates
- [ ] Form submission succeeds
- [ ] Success notification appears
- [ ] Form resets after submission

### Search Workflow
- [ ] Navigate to "Cari Pelanggan"
- [ ] Search input focused
- [ ] Search with Customer ID
- [ ] Results display in table
- [ ] Can edit records from results
- [ ] Can delete records from results
- [ ] Deletion confirmation appears

### Dashboard Workflow
- [ ] Navigate to Dashboard
- [ ] 4 KPI cards display
- [ ] KPI values update correctly
- [ ] KPI calculation fast (<1s)
- [ ] Export button present
- [ ] Import button present

### Analytics Workflow
- [ ] Navigate to "Analitik"
- [ ] 5 charts render
- [ ] All charts load within 2s
- [ ] Charts responsive to resize
- [ ] Legend visible and clickable
- [ ] Hover tooltips work
- [ ] Charts update with new data

### Export/Import Workflow
- [ ] Click "Ekspor CSV"
- [ ] CSV file downloads
- [ ] CSV file opens in Excel
- [ ] All fields present
- [ ] Column headers in Indonesian
- [ ] UTF-8 BOM included
- [ ] Click "Impor CSV"
- [ ] File browser opens
- [ ] Select CSV file
- [ ] Import preview shows
- [ ] Confirm import
- [ ] Records added successfully
- [ ] Success message appears

### Logout Workflow
- [ ] Click "Keluar" button
- [ ] Redirected to login screen
- [ ] Session cleared
- [ ] Data still in localStorage
- [ ] Can login again
- [ ] Previous data visible after login

### Error Handling
- [ ] Fill form with invalid data
- [ ] See error messages
- [ ] Error messages in Indonesian
- [ ] Visual indicators (red border)
- [ ] Can correct and retry
- [ ] Success on valid input

### Performance Checks
- [ ] Page load within 2s
- [ ] No console errors
- [ ] Dashboard KPIs within 1s
- [ ] Charts render within 2s
- [ ] Search results within 1s
- [ ] Form response within 500ms

### Accessibility Checks
- [ ] Tab navigation works
- [ ] Skip link accessible
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Semantic HTML used
- [ ] Color contrast sufficient
- [ ] No keyboard traps

### Mobile Checks (375px)
- [ ] Layout responsive
- [ ] Navigation hamburger visible
- [ ] Form fields full width
- [ ] Buttons tap-friendly (>44px)
- [ ] Text readable
- [ ] No horizontal scroll
- [ ] Touch keyboard works

---

## Troubleshooting

### Issue: Data not persisting
**Solution:**
1. Check localStorage is enabled: `typeof(Storage) !== "undefined"`
2. Check quota: DevTools → Storage → localStorage → Size
3. Try clearing: `localStorage.clear()` and retry

### Issue: Charts not rendering
**Solution:**
1. Check Chart.js CDN loaded: Check Network tab
2. Check canvas elements exist: `document.getElementById('categoryChart')`
3. Check data available: `console.log(ChartManager)`

### Issue: Form validation not working
**Solution:**
1. Check ValidationEngine loaded: `console.log(ValidationEngine)`
2. Check blur event attached
3. Check error messages in console

### Issue: Search not finding records
**Solution:**
1. Check records in localStorage: `localStorage.getItem('marketplace_customers')`
2. Check search query format (should match Customer ID)
3. Try partial search

### Issue: Performance slow
**Solution:**
1. Check for large data volumes (>1000 records)
2. Clear old records: Export then delete old entries
3. Check browser resources: Task Manager
4. Try different browser

### Issue: Mobile layout broken
**Solution:**
1. Check viewport meta tag in HTML
2. Check responsive.css loaded
3. Use DevTools device emulation
4. Check at exact 375px width

---

## Test Results Interpretation

### Summary Cards Explanation

**Total Test:** Total number of tests run

**Lulus (Passed):** Tests that completed successfully
- ✓ No errors
- ✓ All assertions passed
- ✓ Expected results met

**Gagal (Failed):** Tests that found issues
- ✗ Assertion failed
- ✗ Error thrown
- ✗ Expected result not met

**Tingkat Keberhasilan:** Percentage of passed tests
- 100% = Perfect (all working)
- 80-99% = Good (minor issues)
- 60-79% = Fair (needs attention)
- <60% = Poor (significant issues)

---

## Performance Interpretation

**⚡ Fast:**
- Duration < threshold ✓
- Excellent performance

**🐢 Slow:**
- Duration > threshold ⚠️
- May need optimization

**⚠️ Warning:**
- Approaching threshold
- Monitor and optimize

---

## Exporting Test Results

1. After running tests, click **"📥 Download Hasil"**
2. JSON file downloads with:
   - Timestamp of test run
   - All test results
   - Performance metrics
   - Logs and debug info
3. Use for documentation and analysis

---

## Continuous Testing

### Recommended Testing Schedule
- **Before deployment:** Full test suite
- **Weekly:** Smoke tests (critical workflows)
- **Monthly:** Full regression testing
- **On major changes:** Feature-specific tests

### Using Browser DevTools for Debugging
1. **Console:** Check for JavaScript errors
2. **Network:** Monitor API calls and resource loading
3. **Storage:** View localStorage contents
4. **Performance:** Profile slow operations
5. **Sources:** Debug with breakpoints
6. **Application:** Test offline capabilities

---

## Reporting Issues

If tests fail, document:
1. **Browser and version**
2. **Operating system**
3. **Screen resolution**
4. **Steps to reproduce**
5. **Expected vs actual result**
6. **Screenshot or screen recording**
7. **Console errors**
8. **Test result JSON file**

---

## Contact & Support

For testing issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Ensure all modules are loaded
4. Check localStorage is not full
5. Try clearing browser cache

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024 | Initial E2E testing framework |

---

**Last Updated:** 2024  
**Document Version:** 1.0  
**Status:** FINAL ✓

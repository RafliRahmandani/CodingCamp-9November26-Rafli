# UAT Bug Report Template

**Use this template to document any issues found during UAT testing.**

---

## BUG REPORT #_______

**Report Date:** ________________  
**Reported By:** ________________  
**Report Status:** [ ] NEW  [ ] IN REVIEW  [ ] IN PROGRESS  [ ] RESOLVED  [ ] VERIFIED  [ ] CLOSED  

---

## 1. BUG IDENTIFICATION

### 1.1 Title (Brief Summary)
**What:** [One-line description of the issue]  
Example: "Login form accepts empty username and doesn't show error"

### 1.2 Severity Level (Choose One)
- [ ] **CRITICAL** - Feature completely broken, data loss, security issue
  - *Impact: Application cannot be used*
  - *Response: Immediate - fix required today*
  
- [ ] **HIGH** - Major feature not working, significant workaround needed
  - *Impact: Feature partially unavailable or very difficult to use*
  - *Response: Within 2 hours*
  
- [ ] **MEDIUM** - Feature partially working, minor workaround available
  - *Impact: Feature works but not as intended, minor inconvenience*
  - *Response: Within 8 hours*
  
- [ ] **LOW** - Cosmetic, typos, minor inconvenience
  - *Impact: No functional impact*
  - *Response: Within 24 hours*

### 1.3 Component/Feature Affected
- [ ] Authentication (Login/Logout)
- [ ] Customer Management (Add/Edit/Delete)
- [ ] Search & Filtering
- [ ] Dashboard & KPIs
- [ ] Analytics & Charts
- [ ] CSV Export/Import
- [ ] Form Validation
- [ ] Data Persistence
- [ ] Navigation
- [ ] Mobile Responsiveness
- [ ] Performance
- [ ] Browser Compatibility
- [ ] Other: ____________________

### 1.4 Related Test Case (If Applicable)
**Test Case ID:** TC-_____ (e.g., TC-001, TC-021, etc.)  
**Test Case Name:** _____________________

---

## 2. ISSUE DESCRIPTION

### 2.1 What Is the Issue?
**Description:**  
[Clearly describe what is wrong. Be specific about what the user sees or experiences.]

Example:  
"When user logs in with empty username field, the form submits successfully without showing an error message. User is logged in despite empty username."

### 2.2 What Should Happen Instead? (Expected Behavior)
**Expected:**  
[Describe the correct behavior that should occur according to requirements.]

Example:  
"An error message should appear stating 'Username harus diisi' and the form should not submit until username is entered."

### 2.3 Actual Behavior Observed
**Actual:**  
[Describe exactly what happens instead of the expected behavior.]

Example:  
"Dashboard appears immediately without any error. User can access the application despite not entering username."

---

## 3. REPRODUCIBILITY

### 3.1 Can You Reproduce the Issue?
- [ ] Always (100% - consistently happens)
- [ ] Often (70-90% - happens most times)
- [ ] Sometimes (40-70% - happens occasionally)
- [ ] Rarely (10-40% - rarely happens)
- [ ] Cannot reproduce (tried multiple times, can't make it happen again)

### 3.2 Steps to Reproduce (Detailed Steps)

**Prerequisite Conditions:**  
[What needs to be set up before reproducing? Example: User must be logged out, test data loaded, etc.]

---

**Steps to Reproduce:**

1. [Step 1]
   
2. [Step 2]
   
3. [Step 3]
   
4. [Step 4 - Action that causes the issue]
   
5. [Step 5]

**Example Steps:**
1. Open application URL in Chrome browser
2. Login form displays
3. Leave Username field empty
4. Enter any password
5. Click "Masuk" button → ISSUE OCCURS HERE
6. Dashboard displays (should not happen)

---

**Expected Result After Steps:**
[What should happen if the bug didn't exist?]

**Actual Result After Steps:**
[What actually happens when you perform these steps?]

---

## 4. ENVIRONMENT DETAILS

### 4.1 Browser Information
- **Browser:** [ ] Chrome  [ ] Firefox  [ ] Edge  [ ] Safari  [ ] Other: _______
- **Version:** __________ (e.g., Chrome 130.0.6723.88)
- **Operating System:** [ ] Windows  [ ] macOS  [ ] Linux  [ ] iOS  [ ] Android
- **OS Version:** __________

### 4.2 Device Details
- [ ] Desktop/Laptop
- [ ] Tablet
- [ ] Mobile Phone
  - Screen size: __________

### 4.3 Screen Resolution
- **Viewport Size:** __________ × __________ (e.g., 1920 × 1080)
- [ ] Desktop (1024px+)
- [ ] Tablet (768-1024px)
- [ ] Mobile (320-768px)

### 4.4 Connection
- **Network Speed:** [ ] Fast (10+ Mbps)  [ ] Normal (3-10 Mbps)  [ ] Slow (<3 Mbps)  [ ] Unknown
- **VPN/Proxy:** [ ] Yes  [ ] No
- **CDN Accessible:** [ ] Yes  [ ] No  [ ] Unknown

### 4.5 Test Data Used
- **Dataset Size:** [ ] 10 records  [ ] 50 records  [ ] 100 records  [ ] 500 records  [ ] 1000+ records  [ ] Other: _____
- **Data Type:** [ ] Fresh test data  [ ] Sample data  [ ] Production-like data  [ ] Edge cases

---

## 5. ATTACHMENTS & EVIDENCE

### 5.1 Screenshots
**Include screenshots that show the issue:**

[ ] Screenshot 1 attached: ________________  
[ ] Screenshot 2 attached: ________________  
[ ] Screenshot 3 attached: ________________  

*Description of Screenshot 1:*  
[What does this screenshot show? What is the issue visible in it?]

---

### 5.2 Browser Console Error
**Is there a JavaScript error in DevTools Console (F12)?**
- [ ] Yes - Error logged below
- [ ] No - No console errors
- [ ] Didn't check

**Console Error Message (if any):**
```
[Paste error message from browser console here]

Example:
TypeError: Cannot read property 'total' of undefined
  at calculateTotal (calculation-engine.js:45:23)
  at submitForm (app.js:120:15)
```

---

### 5.3 Network Requests
**Any failed network requests (DevTools Network tab)?**
- [ ] Yes - Describe below
- [ ] No - All requests succeeded
- [ ] Didn't check

**Failed Requests (if any):**
```
[List any failed network requests with status codes]
```

---

### 5.4 Video Recording
[ ] Video recording attached: ________________  

*Description:*  
[Briefly describe what the video shows]

---

## 6. IMPACT ANALYSIS

### 6.1 How Many Users Affected?
- [ ] All users
- [ ] Most users
- [ ] Some users
- [ ] Single user (possibly isolated issue)

### 6.2 Is Data Affected?
- [ ] Yes - Data loss or corruption
- [ ] Yes - Data inconsistency
- [ ] No - No data impact
- [ ] Unknown

**Description:**  
[If data is affected, describe the impact]

---

### 6.3 Workaround Available?
- [ ] Yes - Workaround exists (describe below)
- [ ] No - No workaround
- [ ] Partial workaround

**Workaround (if available):**  
[Describe how user can work around this issue until it's fixed]

Example: "User can use Firefox browser instead of Chrome as a temporary workaround"

---

## 7. ADDITIONAL CONTEXT

### 7.1 Related Issues
- Are there similar issues reported? [ ] Yes  [ ] No
- **Related Bug Reports:** Bug #_____, Bug #_____, Bug #_____

### 7.2 Recent Changes
**Did this issue occur after a recent change?**
- [ ] Yes - Issue started after: __________________
- [ ] No - Issue always existed
- [ ] Unknown

### 7.3 Frequency & Pattern
**When does this occur?**
- [ ] Always
- [ ] On specific days/times
- [ ] After specific action
- [ ] Randomly

**Pattern Description:**  
[Any patterns noticed about when/why this occurs?]

---

## 8. PRIORITY & ASSIGNMENT

### 8.1 Priority Ranking
**Priority:** (1 = Highest, 5 = Lowest)
- [ ] 1 - CRITICAL (Stop work, fix immediately)
- [ ] 2 - HIGH (Fix before deployment)
- [ ] 3 - MEDIUM (Fix soon)
- [ ] 4 - LOW (Fix when time permits)
- [ ] 5 - OPTIONAL (Nice to fix)

### 8.2 Assignment
**Assigned To:** __________________  
**Assigned On:** __________________  
**Target Fix Date:** __________________  

---

## 9. DEVELOPER INVESTIGATION

### 9.1 Root Cause Analysis (Developer completes)
**Root Cause:**  
[After investigation, what is the root cause of this bug?]

Example: "Validation function not called on form submit event. Form submission handler missing validation check."

---

### 9.2 Affected Code/Component
**Files Affected:**
- [ ] app.js
- [ ] auth-manager.js
- [ ] customer-manager.js
- [ ] validation-engine.js
- [ ] calculation-engine.js
- [ ] chart-manager.js
- [ ] search-manager.js
- [ ] dashboard-manager.js
- [ ] export-manager.js
- [ ] Other: ________________

**Specific Code Location:**  
[File name and line numbers, or function names]

Example: "app.js, lines 145-155, submitForm() function"

---

### 9.3 Fix Description
**How Will This Be Fixed?**

[Provide technical description of the fix]

Example:
```javascript
// Before (buggy code):
function submitForm() {
  saveCustomer(data);  // No validation
}

// After (fixed code):
function submitForm() {
  if (!validateForm(data)) {
    showError("Form has errors");
    return;
  }
  saveCustomer(data);
}
```

---

## 10. VERIFICATION & SIGN-OFF

### 10.1 Developer Testing
**Has developer verified the fix?**
- [ ] Yes - Tested and verified working
- [ ] No - Fix not yet tested
- [ ] In Progress

**Developer Test Notes:**  
[What testing did developer perform?]

---

### 10.2 QA Verification
**Original Tester Verifying Fix:**  
**Name:** ________________  
**Date:** ________________  

**Verification Steps:**  
[Repeat the reproduction steps to verify fix]
1. ___________
2. ___________
3. ___________

**Verification Result:**
- [ ] **PASS** - Issue is fixed, works as expected
- [ ] **FAIL** - Issue still exists or partially fixed
- [ ] **INCONCLUSIVE** - Unable to verify

**Verification Notes:**  
[Any observations about the fix?]

---

## 11. SIGN-OFF

### 11.1 UAT Tester Sign-Off
| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Reported By** | __________ | __________ | ______ |
| **Verified By** | __________ | __________ | ______ |

### 11.2 Developer Sign-Off
| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Fixed By** | __________ | __________ | ______ |
| **Tested By** | __________ | __________ | ______ |

### 11.3 Final Approval
| Role | Name | Signature | Date |
|------|------|-----------|------|
| **QA Lead** | __________ | __________ | ______ |
| **Project Manager** | __________ | __________ | ______ |

---

## 12. BUG RESOLUTION TIMELINE

| Status | Date | Notes |
|--------|------|-------|
| NEW | ________ | Reported by tester |
| IN REVIEW | ________ | Assigned to developer |
| IN PROGRESS | ________ | Developer working on fix |
| RESOLVED | ________ | Fix completed, waiting verification |
| VERIFIED | ________ | QA verified fix works |
| CLOSED | ________ | Approved and resolved |

---

## COMMENTS & DISCUSSION

**Add comments as bug progresses through resolution:**

---

**Comment 1 (Date: ________):**  
[Developer/Tester comment about investigation or fix]

---

**Comment 2 (Date: ________):**  
[Follow-up comment]

---

**Comment 3 (Date: ________):**  
[Verification comment]

---

## TEMPLATE COMPLETION TIPS

✅ **Complete All Sections** - More information = faster resolution  
✅ **Be Specific** - Vague reports take longer to fix  
✅ **Include Screenshots** - Visual evidence is very helpful  
✅ **Provide Steps to Reproduce** - Exact reproducibility essential  
✅ **Document Environment** - Browser, OS, screen size matter  
✅ **Clear Severity Level** - Helps with prioritization  
✅ **Note Any Workarounds** - Helps other testers  

---

## EXAMPLE COMPLETE BUG REPORT

**Title:** "Export CSV button doesn't download file when customer names contain special characters"

**Severity:** HIGH

**Reproduction Steps:**
1. Add customer with name: "José María López"
2. Click Dashboard
3. Click "Ekspor CSV" button
4. Browser shows download error or file doesn't appear

**Expected:** CSV file downloads with name "pelanggan-20241115.csv"

**Actual:** No download occurs, no error shown

**Browser:** Chrome 130, Windows 11

**Console Error:** 
```
TypeError: Cannot encode UTF-8 string with special characters
```

**Root Cause:** UTF-8 BOM not added to CSV header

**Fix:** Add UTF-8 BOM marker to CSV export function

**Verification:** Tested with special characters, file now downloads and opens correctly in Excel

---

**End of Bug Report Template**

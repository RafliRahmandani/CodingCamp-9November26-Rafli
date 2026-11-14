# UAT Test Data Preparation Guide

**Document Version:** 1.0  
**Date:** November 2024  
**Purpose:** Guide for preparing and loading sample data for User Acceptance Testing  

---

## 1. Overview

This guide provides instructions for preparing test data for the **Sistem Manajemen Pelanggan Marketplace Indonesia** application. Test data includes:
- Sample customer records
- Various transaction types
- Edge cases for validation testing
- Performance testing datasets

---

## 2. Test Data Requirements

### 2.1 Sample Data Categories

| Category | Records | Purpose |
|----------|---------|---------|
| **Basic Valid Data** | 20 | Normal workflow testing |
| **Edge Cases** | 10 | Boundary value testing |
| **Performance Data** | 500-1000 | Load and performance testing |
| **Special Characters** | 5 | Encoding and display testing |
| **Various Categories** | 15 | Analytics and filtering testing |

**Total: 50+ sample records**

---

## 3. Sample Test Data Set

### 3.1 Basic Valid Customer Records (20 records)

Below are 20 pre-prepared customer records with realistic Indonesian marketplace data:

#### Record 1
```
ID Pelanggan: CUST-20241115-0001
Timestamp: 2024-11-15 09:30:00
Nama Barang: Laptop Dell XPS 13
Kategori Barang: Elektronik
Harga Barang: 8500000
Kuantitas: 1
Varian Barang: i5-12th Gen, 512GB SSD
Ongkir: 100000
Sisa Bayar: 0
Total Belanja: 8600000
Nama Pembeli: Budi Santoso
No Telp: 08123456789
Alamat: Jl. Merdeka No. 123, Jakarta Pusat
Status: Selesai
```

#### Record 2
```
ID Pelanggan: CUST-20241115-0002
Timestamp: 2024-11-15 10:15:00
Nama Barang: iPhone 15 Pro Max
Kategori Barang: Elektronik
Harga Barang: 16999000
Kuantitas: 1
Varian Barang: Titanium Black, 256GB
Ongkir: 50000
Sisa Bayar: 500000
Total Belanja: 17549000
Nama Pembeli: Siti Nurhaliza
No Telp: 08234567890
Alamat: Jl. Sudirman No. 45, Jakarta Selatan
Status: Selesai
```

#### Record 3
```
ID Pelanggan: CUST-20241115-0003
Timestamp: 2024-11-15 11:00:00
Nama Barang: Samsung 55 inch QLED TV
Kategori Barang: Elektronik
Harga Barang: 12500000
Kuantitas: 1
Varian Barang: 4K Ultra HD
Ongkir: 500000
Sisa Bayar: 1000000
Total Belanja: 14000000
Nama Pembeli: Ahmad Wijaya
No Telp: 08345678901
Alamat: Jl. Gatot Subroto No. 789, Bandung
Status: Pending
```

#### Record 4
```
ID Pelanggan: CUST-20241115-0004
Timestamp: 2024-11-15 14:30:00
Nama Barang: Nike Air Jordan 1
Kategori Barang: Fashion
Harga Barang: 2500000
Kuantitas: 2
Varian Barang: Black Red, Size 40 & 42
Ongkir: 50000
Sisa Bayar: 0
Total Belanja: 5050000
Nama Pembeli: Rina Kusuma
No Telp: 08456789012
Alamat: Jl. Ahmad Yani No. 234, Surabaya
Status: Selesai
```

#### Record 5
```
ID Pelanggan: CUST-20241115-0005
Timestamp: 2024-11-15 15:45:00
Nama Barang: Gucci Marmont Bag
Kategori Barang: Fashion
Harga Barang: 18000000
Kuantitas: 1
Varian Barang: White Leather
Ongkir: 100000
Sisa Bayar: 2000000
Total Belanja: 20100000
Nama Pembeli: Diana Santoso
No Telp: 08567890123
Alamat: Jl. Braga No. 567, Bandung
Status: Selesai
```

#### Record 6
```
ID Pelanggan: CUST-20241115-0006
Timestamp: 2024-11-15 16:20:00
Nama Barang: Permen Kopiko
Kategori Barang: Makanan
Harga Barang: 150000
Kuantitas: 10
Varian Barang: Asli
Ongkir: 20000
Sisa Bayar: 0
Total Belanja: 1520000
Nama Pembeli: Eka Suryanto
No Telp: 08678901234
Alamat: Jl. Diponegoro No. 111, Medan
Status: Selesai
```

#### Record 7
```
ID Pelanggan: CUST-20241115-0007
Timestamp: 2024-11-15 17:00:00
Nama Barang: Buku One Piece Vol 100
Kategori Barang: Buku
Harga Barang: 85000
Kuantitas: 3
Varian Barang: Hardcover
Ongkir: 25000
Sisa Bayar: 0
Total Belanja: 280000
Nama Pembeli: Fajar Ramadhan
No Telp: 08789012345
Alamat: Jl. Veteran No. 333, Yogyakarta
Status: Selesai
```

#### Record 8
```
ID Pelanggan: CUST-20241115-0008
Timestamp: 2024-11-15 18:30:00
Nama Barang: Canon EOS R6 Camera
Kategori Barang: Elektronik
Harga Barang: 35000000
Kuantitas: 1
Varian Barang: Body Only
Ongkir: 200000
Sisa Bayar: 5000000
Total Belanja: 40200000
Nama Pembeli: Gunadi Setiawan
No Telp: 08890123456
Alamat: Jl. Pemuda No. 456, Jakarta Timur
Status: Pending
```

#### Record 9
```
ID Pelanggan: CUST-20241115-0009
Timestamp: 2024-11-15 19:15:00
Nama Barang: Apple AirPods Pro
Kategori Barang: Elektronik
Harga Barang: 3500000
Kuantitas: 2
Varian Barang: White
Ongkir: 50000
Sisa Bayar: 0
Total Belanja: 7050000
Nama Pembeli: Hana Wijaya
No Telp: 08901234567
Alamat: Jl. Gajah Mada No. 789, Semarang
Status: Selesai
```

#### Record 10
```
ID Pelanggan: CUST-20241114-0010
Timestamp: 2024-11-14 20:00:00
Nama Barang: Adidas Ultraboost 21
Kategori Barang: Fashion
Harga Barang: 1800000
Kuantitas: 1
Varian Barang: Black
Ongkir: 30000
Sisa Bayar: 0
Total Belanja: 1830000
Nama Pembeli: Ivan Gunadi
No Telp: 09012345678
Alamat: Jl. Hayam Wuruk No. 101, Makassar
Status: Selesai
```

#### Records 11-20
Use similar format to create 10 more records with:
- Different dates (Nov 14, 16, 17)
- Various categories (Elektronik, Fashion, Makanan, Buku, dll)
- Different statuses (Selesai, Pending, Dibatalkan)
- Various price ranges (Rp 100K - Rp 50M)
- Different customer names and phone numbers

---

### 3.2 Edge Case Test Data (10 records)

#### Record: Minimum Values
```
ID Pelanggan: CUST-20241115-9001
Nama Barang: Kertas A4
Harga Barang: 0 (or 1)
Kuantitas: 1
Ongkir: 0
Sisa Bayar: 0
Total Belanja: 0
Nama Pembeli: Minimal Test
No Telp: 1234567890
Status: Pending
```

#### Record: Maximum Values
```
ID Pelanggan: CUST-20241115-9002
Nama Barang: Rumah Mewah 5 Lantai di Area Premium Jakarta
Harga Barang: 10000000000
Kuantitas: 1
Ongkir: 500000
Sisa Bayar: 5000000000
Total Belanja: 15000500000
Nama Pembeli: Buyer Dengan Nama Sangat Panjang Sekali
No Telp: 081234567890
Status: Selesai
```

#### Record: Special Characters
```
ID Pelanggan: CUST-20241115-9003
Nama Barang: Kopi Arabika São José
Kategori Barang: Makanan
Harga Barang: 250000
Kuantitas: 5
Varian Barang: Roasted & Ground
Ongkir: 50000
Sisa Bayar: 0
Total Belanja: 1300000
Nama Pembeli: José María López
No Telp: 08123456789
Alamat: Jl. Café Español No. 123
Status: Selesai
```

#### Record: Decimal Values
```
ID Pelanggan: CUST-20241115-9004
Nama Barang: Item dengan Harga Desimal
Harga Barang: 99999.99
Kuantitas: 2
Ongkir: 50.50
Sisa Bayar: 100.99
Total Belanja: 200250.47
```

#### Record: Cancelled Status
```
ID Pelanggan: CUST-20241115-9005
Nama Barang: Order Yang Dibatalkan
Status: Dibatalkan
(other fields with sample data)
```

#### Records 9006-9010
Additional edge cases:
- Zero quantity (if valid): 0 qty with valid price
- Very long address text (500+ characters)
- Phone number with extension: 08123456789 ext. 123
- Multiple spaces in name: "Ahmad    Wijaya"
- Duplicate customer ID attempt (validation)

---

## 4. Preparing CSV File for Import Testing

### 4.1 CSV Template Format

Create a CSV file with proper Indonesian column headers:

```csv
Timestamp,Nama Barang,Kategori Barang,Harga Barang,Kuantitas,Varian Barang,Ongkir,Sisa Bayar,Total Belanja,Nama Pembeli,No Telp,ID Pelanggan,Alamat,Status
2024-11-15 09:30:00,Laptop Dell XPS 13,Elektronik,8500000,1,i5-12th Gen 512GB SSD,100000,0,8600000,Budi Santoso,08123456789,CUST-20241115-0001,Jl. Merdeka No. 123 Jakarta Pusat,Selesai
2024-11-15 10:15:00,iPhone 15 Pro Max,Elektronik,16999000,1,Titanium Black 256GB,50000,500000,17549000,Siti Nurhaliza,08234567890,CUST-20241115-0002,Jl. Sudirman No. 45 Jakarta Selatan,Selesai
```

### 4.2 CSV File Variations for Testing

Prepare 5 different CSV files:

1. **valid-data.csv** - Properly formatted with 20+ valid records
2. **with-duplicates.csv** - Contains IDs that exist in system already
3. **invalid-format.csv** - Missing columns or wrong delimiter
4. **special-chars.csv** - Contains Indonesian special characters
5. **corrupted.csv** - Malformed data (intentional errors for validation testing)

### 4.3 Using UTF-8 with BOM for Excel Compatibility

When creating CSV files in Excel or Calc:
1. File → Save As
2. Select format: **CSV UTF-8 (.csv)** or **CSV (Comma delimited) (.csv)**
3. When Excel asks about encoding: Select **UTF-8** or use BOM option
4. Ensure commas are proper delimiter (not semicolons)

For command line (Linux/Mac):
```bash
# Create UTF-8 with BOM
echo -e '\xEF\xBB\xBF' > export.csv
cat data.csv >> export.csv
```

---

## 5. Loading Test Data into Application

### 5.1 Manual Data Entry Method

Use this method if CSV import is not ready:

1. Open application in browser
2. Login with any credentials
3. Navigate to "Tambah Transaksi" (Add Transaction)
4. For each sample record, fill in the form fields
5. Click "Simpan" (Save)
6. Repeat for all 20+ records
7. **Time estimate:** 30-45 minutes

### 5.2 CSV Import Method (Preferred)

Use this method if CSV export/import is working:

1. Open application in browser
2. Login
3. Go to Dashboard
4. Click "Impor CSV" button
5. Select prepared CSV file (valid-data.csv)
6. Review preview of first 5 rows
7. Confirm import
8. Verify all records imported successfully
9. **Time estimate:** 2-3 minutes

### 5.3 LocalStorage Direct Loading (Developer Method)

For development/testing purposes, directly set data in LocalStorage:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Execute JavaScript:

```javascript
// Sample data to load
const testData = [
  {
    id: "CUST-20241115-0001",
    timestamp: "2024-11-15 09:30:00",
    namaBarang: "Laptop Dell XPS 13",
    kategoriBarang: "Elektronik",
    hargaBarang: 8500000,
    kuantitas: 1,
    varianBarang: "i5-12th Gen",
    ongkir: 100000,
    sisaBayar: 0,
    totalBelanja: 8600000,
    namaPembeli: "Budi Santoso",
    noTelp: "08123456789",
    idPelanggan: "CUST-20241115-0001",
    alamat: "Jl. Merdeka No. 123, Jakarta Pusat",
    status: "Selesai"
  },
  // ... add more records
];

localStorage.setItem('marketplace_customers', JSON.stringify(testData));
console.log('Test data loaded successfully');
```

4. Refresh page to see data loaded

---

## 6. Test Data Validation Checklist

Before starting UAT, verify test data is properly loaded:

### Pre-UAT Verification

- [ ] **Count Check**: Verify 50+ customer records are loaded
  - Dashboard shows: "Total Pelanggan: 50+" (or expected count)
  
- [ ] **Data Integrity Check**: Search for one customer
  - Result appears in search with all 14 fields visible
  
- [ ] **KPI Calculation Check**: Verify Dashboard KPIs
  - Total Revenue > 0 (sum of all Total Belanja)
  - Average Transaction Value calculated correctly
  - Monthly transaction count > 0 (if records from current month)
  
- [ ] **CSV Export Check**: Export data and verify
  - File downloads as "pelanggan-YYYYMMDD.csv"
  - File opens in Excel/Calc with all data
  - All 14 columns present
  - All 50+ records exported
  
- [ ] **Chart Rendering Check**: View Analytics page
  - All 5 charts display data (not empty)
  - Charts render within 2 seconds
  - Data looks reasonable for sample dataset
  
- [ ] **Search Functionality Check**: Test search
  - Search for known customer ID returns correct result
  - Partial search returns multiple results
  - Search performance is fast (< 300ms)

### Data Quality Metrics

| Metric | Target | Verification |
|--------|--------|-------------|
| Total Records | 50+ | Count via Dashboard |
| Date Range | 3+ days | Verify in search results |
| Category Distribution | 5+ categories | Check analytics charts |
| Status Distribution | Mixed (Selesai/Pending) | Check chart |
| Price Range | Rp 100K - Rp 50M | Verify in search results |
| Special Characters | Present | Check individual records |

---

## 7. Test Data Cleanup Between Test Runs

### Manual Cleanup Option

1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Select **LocalStorage**
4. Select domain/origin of application
5. Right-click: **Clear All** or delete individual keys
6. Refresh page

### Automated Cleanup (Developer)

Add this to Console:

```javascript
// Clear all application data
localStorage.clear();
sessionStorage.clear();
console.log('All storage cleared');
window.location.reload();
```

### Between Test Runs Checklist

- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Clear LocalStorage (DevTools > Application > LocalStorage > Clear All)
- [ ] Clear all notifications
- [ ] Reload page (Ctrl+R or F5)
- [ ] Verify Dashboard shows "0" customers
- [ ] Ready to start fresh test run

---

## 8. Test Data Scenarios

### Scenario 1: Normal Business Day
- 15 transactions of varying sizes
- Mixed statuses (Selesai, Pending)
- Multiple product categories
- Total revenue: Rp 50-100M
- **Use Case**: Basic functionality testing

### Scenario 2: Peak Sales Day
- 50+ transactions
- Mostly "Selesai" status
- Focus on Elektronik category
- Higher average transaction value
- Total revenue: Rp 200M+
- **Use Case**: Performance testing, Dashboard calculations

### Scenario 3: Mixed Operations
- Mix of transaction statuses (Selesai, Pending, Dibatalkan)
- Various customer names (Indonesian, English, special chars)
- Different ongkir and sisaBayar amounts
- Some edits/updates to existing records
- **Use Case**: Comprehensive feature testing

### Scenario 4: Edge Cases
- Zero-value transactions
- Very high transaction values
- Special characters in names and addresses
- Phone numbers with extensions
- Long product descriptions
- **Use Case**: Validation and error handling testing

---

## 9. Sample Data Files Download

The following files are provided in the UAT package:

1. **sample-data-50records.csv** - 50 complete records for import
2. **edge-cases.csv** - Special test cases
3. **csv-with-errors.csv** - Invalid data for error testing
4. **large-dataset-1000records.csv** - Performance testing
5. **special-characters.csv** - Indonesian text test

---

## 10. Troubleshooting Data Loading

### Issue: Data doesn't appear after import
**Solution:**
1. Check browser console for errors (F12)
2. Verify CSV format is correct
3. Try manual entry of one record to test system
4. Clear cache and try import again

### Issue: Import shows "Format CSV tidak sesuai"
**Solution:**
1. Verify CSV has correct column headers in Indonesian
2. Check file is actually .csv (not .xlsx)
3. Check delimiter is comma (,) not semicolon (;)
4. Verify encoding is UTF-8

### Issue: Dashboard KPIs show 0 even with data loaded
**Solution:**
1. Verify data is in LocalStorage (DevTools > Application > LocalStorage)
2. Check if Total Belanja field is properly calculated
3. Refresh page with Ctrl+Shift+R (hard refresh)
4. Clear cache and reload data

### Issue: Search doesn't find records
**Solution:**
1. Verify records are properly loaded
2. Try exact ID match first (not partial)
3. Check if IDs are in format: CUST-YYYYMMDD-XXXX
4. Check browser console for JavaScript errors

---

## Appendix: Sample Customer Names Generator

Use these common Indonesian names for varied test data:

**Male Names:**
- Budi Santoso
- Ahmad Wijaya
- Eka Suryanto
- Fajar Ramadhan
- Gunadi Setiawan

**Female Names:**
- Siti Nurhaliza
- Rina Kusuma
- Diana Santoso
- Hana Wijaya
- Endang Wijaya

**Addresses (Common Areas):**
- Jl. Merdeka No. 123, Jakarta Pusat
- Jl. Sudirman No. 45, Jakarta Selatan
- Jl. Gatot Subroto No. 789, Bandung
- Jl. Ahmad Yani No. 234, Surabaya
- Jl. Pemuda No. 456, Jakarta Timur

---

**End of Test Data Guide**

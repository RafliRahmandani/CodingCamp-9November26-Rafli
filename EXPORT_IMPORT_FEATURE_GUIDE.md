# Export/Import CSV Feature Guide

## Overview

The marketplace customer management system now includes complete export/import functionality for customer data. Users can export all customer records to a CSV file and import records from CSV files.

## Export Feature

### How to Export Data

1. **Navigate to Dashboard**
   - Login to the application
   - You will automatically see the Dashboard

2. **Click Export Button**
   - Look for the "📥 Ekspor CSV" button in the top-left corner of the dashboard header
   - Click the button to export all customer records

3. **Download File**
   - Your browser will automatically download a CSV file
   - Default filename format: `marketplace-customers-YYYYMMDD.csv`
   - Example: `marketplace-customers-20240115.csv` (January 15, 2024)

4. **Success Notification**
   - You will see a success message showing: "X data pelanggan berhasil diekspor: [filename]"
   - Example: "2 data pelanggan berhasil diekspor: marketplace-customers-20240115.csv"

### CSV File Format

The exported CSV file contains the following columns:

| Column # | Column Name | Data Type | Example |
|----------|------------|-----------|---------|
| 1 | ID Pelanggan | Text | CUST-20240115-0001 |
| 2 | Waktu Transaksi | DateTime | 15/01/2024 14:30:00 |
| 3 | Nama Barang | Text | Laptop Dell XPS 13 |
| 4 | Kategori Barang | Text | Elektronik |
| 5 | Harga Barang (Rp) | Number | 12000000 |
| 6 | Kuantitas | Number | 1 |
| 7 | Varian Barang | Text | Silver, 16GB RAM |
| 8 | Ongkir (Rp) | Number | 100000 |
| 9 | Sisa Bayar (Rp) | Number | 0 |
| 10 | Total Belanja (Rp) | Number | 12100000 |
| 11 | Nama Pembeli | Text | Budi Santoso |
| 12 | No Telepon | Text | 081234567890 |
| 13 | Alamat | Text | Jalan Merdeka No. 123, Jakarta |

### Opening CSV in Excel

1. **Open Excel** (Microsoft Excel or LibreOffice Calc)
2. **Select File → Open**
3. **Choose the exported CSV file**
4. **The file will open automatically** with all data properly formatted
   - Currency values are displayed as numbers
   - Dates are properly formatted
   - Special characters are correctly handled

### CSV Features

- **UTF-8 Encoding**: Full support for Indonesian characters (ñ, ə, etc.)
- **Excel Compatible**: Proper formatting for Microsoft Excel and LibreOffice
- **Proper Escaping**: Handles special characters (commas, quotes, newlines)
- **Currency Format**: Numbers without currency symbol for Excel calculations

## Import Feature

### How to Import Data

1. **Prepare CSV File**
   - Use the export feature to get a template
   - Create your own CSV following the format described above
   - Ensure file extension is `.csv`

2. **Click Import Button**
   - Look for the "📤 Impor CSV" button in the top-left corner of the dashboard header
   - Click the button to open the file picker

3. **Select File**
   - A file picker dialog will appear
   - Navigate to your CSV file
   - Select the file and click "Open" (or equivalent)

4. **File Processing**
   - You will see a notification: "Memproses file CSV..."
   - The system validates and imports each record

5. **Import Summary**
   - Success notification: "X dari Y data berhasil diimpor"
   - Example: "5 dari 5 data berhasil diimpor"
   - Warning notification: "Z dari Y data gagal diimpor" (if there were errors)

6. **Dashboard Update**
   - Dashboard KPI cards are automatically updated with new data
   - Charts are refreshed if visible

### CSV Requirements for Import

1. **First Row Must Be Headers**
   - Exact headers (case-sensitive):
     ```
     ID Pelanggan,Waktu Transaksi,Nama Barang,Kategori Barang,Harga Barang (Rp),Kuantitas,Varian Barang,Ongkir (Rp),Sisa Bayar (Rp),Total Belanja (Rp),Nama Pembeli,No Telepon,Alamat
     ```

2. **Data Rows Must Have All Required Fields**
   - Minimum 13 columns (if a field is empty, leave it blank)
   - Example valid row:
     ```
     CUST-20240115-0001,15/01/2024 10:00:00,Mouse Logitech,Elektronik,250000,2,Hitam,15000,0,515000,Siti Nurhaliza,082345678901,Jalan Ahmad Yani No. 45
     ```

3. **CSV Format Rules**
   - Comma (,) as field separator
   - Double quotes ("") for text containing commas or quotes
   - Example: `"Nama dengan, koma","Text dengan ""quotes"""`

4. **Data Validation**
   - ID Pelanggan: Can be any text (usually auto-generated on export)
   - Waktu Transaksi: Date/time format (can be any format)
   - Nama Barang: Any text, max 100 characters
   - Kategori Barang: Any text
   - Harga Barang: Must be a number
   - Kuantitas: Must be a positive whole number
   - Varian Barang: Optional text
   - Ongkir: Must be a number
   - Sisa Bayar: Must be a number
   - Total Belanja: Must be a number
   - Nama Pembeli: Any text
   - No Telepon: At least 10 digits
   - Alamat: Any text

### Import Behavior

- **Valid Records**: Imported and visible in the system
- **Invalid Records**: Skipped with count shown in summary
- **Duplicates**: System handles duplicates based on CustomerManager validation
- **Partial Import**: If some records fail, others are still imported

## Example Workflow

### Export and Backup

1. Open application and login
2. Click "📥 Ekspor CSV" to export current data
3. Save the file to your computer as backup

### Import Backup

1. Later, if you need to restore data:
2. Click "📤 Impor CSV"
3. Select the backup file
4. All records are re-imported into the system

### Data Transfer Between Users

1. **User A**: Exports data → sends CSV file to User B
2. **User B**: Imports the CSV file → gets User A's data in their system

## Troubleshooting

### Export Issues

**Problem**: No download appears after clicking export
- **Solution**: Check browser download settings; the file may be blocked by security settings

**Problem**: Export button is disabled or not visible
- **Solution**: Ensure you are logged in; export is only available after authentication

**Problem**: File has wrong name or format
- **Solution**: Check file extension; it should be `.csv`, not `.txt` or other formats

### Import Issues

**Problem**: "File must be CSV format" error
- **Solution**: Ensure file extension is `.csv` and it's actually a CSV file (try opening in text editor)

**Problem**: "CSV empty or only contains header" error
- **Solution**: Verify the CSV file has data rows; ensure first row is headers and subsequent rows are data

**Problem**: "X dari Y data gagal diimpor" (some records failed)
- **Solution**: 
  - Check that all numeric fields (Harga Barang, Kuantitas, etc.) are actually numbers
  - Verify No Telepon has at least 10 digits
  - Check that all required fields are filled

**Problem**: Imported data doesn't appear in dashboard
- **Solution**: Refresh the page; dashboard should update automatically, but a refresh may be needed

**Problem**: CSV opens in Excel with incorrect formatting
- **Solution**: Use "Data → Text to Columns" in Excel to properly parse the CSV

## Technical Specifications

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### File Size Limits
- CSV files up to browser's available storage limit
- Typically 5-10 MB depending on browser
- For very large files, consider splitting into multiple imports

### Character Support
- Full UTF-8 support
- Indonesian characters: ñ, ə, ç, etc.
- Special characters: @ # $ % & * - _ . , etc.
- Emoji support (if needed in data)

### Performance
- Export: <1 second for typical datasets (1000+ records)
- Import: Depends on file size and network, typically <5 seconds
- Dashboard update: Automatic, <1 second

## Best Practices

1. **Regular Backups**
   - Export your data regularly to CSV as backup
   - Store backups in secure location

2. **Version Control**
   - Use the date in filename to track versions
   - Keep multiple backup dates

3. **Data Integrity**
   - Before importing, verify CSV file in text editor
   - Ensure all required fields are populated
   - Check for special characters handling

4. **Error Handling**
   - Review import summary for any failed records
   - Correct issues and re-import if needed

5. **File Organization**
   - Store CSV files in organized folder
   - Use clear naming convention: `customers-backup-YYYYMMDD.csv`

## FAQ

**Q: Can I edit the CSV file before importing?**
A: Yes, you can edit CSV files in Excel, Google Sheets, or any text editor. Just ensure you maintain the CSV format and don't change the header row.

**Q: What happens if I import the same file twice?**
A: The system will create duplicate records. Check for duplicates before importing.

**Q: Can I export to other formats (PDF, Excel)?**
A: Currently only CSV format is supported. You can import CSV into Excel if needed.

**Q: Is my data secure when exporting?**
A: Yes, export is done locally in your browser. No data is sent to any server.

**Q: Can I schedule automatic exports?**
A: This is not currently supported, but you can manually export at regular intervals.

**Q: What's the maximum number of records I can export?**
A: Limited only by your browser's storage and performance. Typically 10,000+ records work fine.

**Q: Can I merge data from multiple CSV files?**
A: Yes, you can import each file separately. The system will combine all records.

**Q: How do I fix a corrupted CSV file?**
A: Open in Excel, verify data is readable, then save as CSV again.

**Q: Can I import data with different currency values?**
A: Yes, CSV stores numbers. The system will work with any numeric values.

**Q: What timezone is used for the Waktu Transaksi field?**
A: The system uses the browser's local timezone. The time shown is when the record was created/exported.

## Support

For issues with export/import functionality:
1. Check this guide's Troubleshooting section
2. Verify CSV file format matches the requirements
3. Clear browser cache and try again
4. Try with a smaller test file first

---

**Last Updated**: January 2024
**Version**: 1.0
**Language**: Indonesian (Bahasa Indonesia) and English

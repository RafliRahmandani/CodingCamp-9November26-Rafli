# Sistem Manajemen Pelanggan Marketplace Indonesia

Aplikasi web untuk mengelola data pelanggan dan transaksi marketplace Indonesia. Dibangun dengan vanilla JavaScript, HTML, dan CSS tanpa bergantung pada backend server.

## Fitur Utama

- **Manajemen Pelanggan**: Tambah, cari, edit, dan hapus data pelanggan
- **Dashboard KPI**: 4 kartu metrik utama (Total Pelanggan, Total Pendapatan, Rata-rata Transaksi, Transaksi Bulan Ini)
- **Analitik Visual**: 5 grafik berbeda menggunakan Chart.js
- **Pencarian Canggih**: Cari pelanggan berdasarkan ID dengan hasil real-time
- **Export/Import CSV**: Ekspor data ke CSV dan impor dari CSV
- **Validasi Real-time**: Validasi form dengan pesan error dalam bahasa Indonesia
- **Desain Responsif**: Optimal di desktop, tablet, dan mobile (320px - 1920px)
- **Penyimpanan Lokal**: Semua data tersimpan di browser LocalStorage

## Teknologi

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Penyimpanan**: Browser LocalStorage (5-10MB)
- **Visualisasi**: Chart.js v4.x
- **Pola Arsitektur**: IIFE Module Pattern untuk enkapsulasi
- **Bahasa UI**: Bahasa Indonesia

## Struktur Proyek

```
├── index.html                 # Entry point aplikasi
├── css/
│   ├── styles.css            # Base styles dan typography
│   └── responsive.css        # Media queries dan layout responsif
├── js/
│   ├── app.js               # Main application coordinator
│   ├── storage-api.js       # LocalStorage wrapper
│   ├── auth-manager.js      # Authentication & login
│   ├── navigation-manager.js # SPA routing
│   ├── validation-engine.js # Form validation dengan pesan ID
│   ├── calculation-engine.js # Perhitungan Total Belanja & format Rp
│   ├── customer-manager.js  # CRUD pelanggan
│   ├── search-manager.js    # Pencarian pelanggan
│   ├── dashboard-manager.js # KPI calculations
│   ├── chart-manager.js     # Chart.js visualizations
│   ├── export-manager.js    # CSV export/import
│   └── notification-manager.js # Toast notifications
├── assets/                   # Images & icons (placeholder)
└── README.md                # Dokumentasi ini

## Instalasi & Setup

### Persyaratan
- Browser modern (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- Text editor atau IDE (VS Code recommended)
- Git (untuk version control)

### Langkah Instalasi

1. Clone repository
   ```bash
   git clone https://github.com/[username]/[repo-name].git
   cd [repo-name]
   ```

2. Buka `index.html` di browser atau gunakan Live Server
   ```bash
   # Menggunakan Python
   python -m http.server 8000
   
   # Atau menggunakan VS Code Live Server
   # Right-click index.html > Open with Live Server
   ```

3. Aplikasi siap digunakan di `http://localhost:8000`

## Penggunaan

### 1. Login
- Username: `admin`
- Password: `123456`

### 2. Dashboard
Lihat ringkasan bisnis Anda dengan 4 KPI utama:
- Total Pelanggan
- Total Pendapatan
- Rata-rata Nilai Transaksi
- Transaksi Bulan Ini

### 3. Tambah Transaksi
Isi form 14 field untuk menambah data transaksi baru:
- Nama Barang, Kategori, Harga, Kuantitas
- Varian, Ongkir, Sisa Bayar
- Nama Pembeli, No Telp, Alamat
- Total Belanja (otomatis dihitung)

### 4. Cari Pelanggan
Cari pelanggan berdasarkan ID dengan hasil real-time dan opsi edit/hapus.

### 5. Analitik
Lihat 5 grafik visualisasi data:
- Penjualan per Kategori (Pie Chart)
- Pendapatan Bulanan (Bar Chart)
- Top 10 Pelanggan (Horizontal Bar)
- Status Transaksi (Doughnut)
- Tren Penjualan (Line Chart)

### 6. Export/Import
- **Export**: Download semua data ke file CSV
- **Import**: Unggah file CSV untuk menambah data massal

## Struktur Data Pelanggan

Setiap record pelanggan memiliki 14 field:

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| id | String | ID unik (CUST-YYYYMMDD-XXXX) |
| timestamp | String | Waktu pembuatan (ISO 8601) |
| namaBarang | String | Nama produk |
| kategoriBarang | String | Kategori produk |
| hargaBarang | Number | Harga per unit (Rp) |
| kuantitas | Number | Jumlah unit |
| varianBarang | String | Varian/tipe produk |
| ongkir | Number | Biaya pengiriman (Rp) |
| sisaBayar | Number | Sisa pembayaran (Rp) |
| totalBelanja | Number | Total belanja (Rp) |
| namaPembeli | String | Nama pembeli |
| noTelp | String | Nomor telepon (min 10 digit) |
| idPelanggan | String | ID pelanggan (auto-generated) |
| alamat | String | Alamat pengiriman |

## Kriteria Performa

Aplikasi dirancang untuk memenuhi kriteria performa berikut:

- ✅ Page load < 2 detik (koneksi 10 Mbps)
- ✅ Dashboard KPI render < 1 detik
- ✅ Charts render < 2 detik
- ✅ Form submission feedback < 500ms
- ✅ Support 1000+ customer records tanpa degradasi

## Kompatibilitas Browser

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Edge | 90+ | ✅ |
| Safari | 14+ | ✅ |

## Penyimpanan Data

Semua data disimpan di browser LocalStorage dengan kunci: `marketplace_customers`

- **Quota**: 5-10MB (tergantung browser)
- **Persistensi**: Data tetap ada sampai cache browser dihapus
- **Keamanan**: Autentikasi di sessionStorage (hilang saat browser ditutup)

## Troubleshooting

### Penyimpanan Penuh
Jika melihat pesan "Penyimpanan penuh":
1. Export data ke CSV untuk backup
2. Hapus record lama
3. Import kembali data yang diperlukan

### Data Tidak Tersimpan
- Periksa apakah LocalStorage diaktifkan di browser
- Coba gunakan Incognito/Private mode
- Cek konsol browser untuk error messages

### Grafik Tidak Muncul
- Pastikan CDN Chart.js dapat diakses
- Cek internet connection
- Reload halaman

## Deployment ke GitHub Pages

1. Push ke GitHub repository
2. Settings > Pages > Select "main branch"
3. Tunggu deployment selesai
4. Akses aplikasi di `https://[username].github.io/[repo-name]`

## Roadmap

Fitur yang akan ditambahkan:
- [ ] Backup otomatis ke cloud
- [ ] Multi-user authentication dengan hash password
- [ ] Custom export templates
- [ ] Laporan PDF
- [ ] Notifikasi reminder transaksi
- [ ] API integration (opsional)

## Lisensi

MIT License - Gratis untuk penggunaan personal dan komersial

## Support

Untuk pertanyaan atau laporan bug, buat issue di GitHub repository.

---

**Dibuat untuk**: Revou Coding Camp  
**Tanggal**: November 2026  
**Status**: Development

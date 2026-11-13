# GitHub Pages Deployment Guide

## Sistem Manajemen Pelanggan Marketplace Indonesia

Panduan lengkap untuk deploy aplikasi ke GitHub Pages dan mengkonfigurasi repository.

---

## 1. Persiapan Repository GitHub

### Langkah 1.1: Buat Repository di GitHub
1. Buka [github.com](https://github.com) dan login dengan akun Anda
2. Klik tombol **"New"** untuk membuat repository baru
3. Isi detail repository:
   - **Repository name**: `marketplace-customer-management` (atau nama pilihan Anda)
   - **Description**: `Sistem Manajemen Pelanggan Marketplace Indonesia - Web Application`
   - **Visibility**: Public (agar GitHub Pages berfungsi)
   - **Initialize with**: Jangan centang (kita sudah punya git lokal)
4. Klik **"Create repository"**

### Langkah 1.2: Tambahkan Remote Repository
Setelah repository dibuat, GitHub akan menampilkan instruksi. Jalankan perintah di bawah di terminal lokal Anda:

```bash
# Ganti USERNAME dan REPO-NAME dengan nilai Anda
git remote add origin https://github.com/USERNAME/marketplace-customer-management.git
git branch -M main
git push -u origin main
```

Atau jika Anda sudah memiliki remote origin (seperti di project ini):

```bash
# Update remote origin jika berbeda
git remote set-url origin https://github.com/USERNAME/marketplace-customer-management.git

# Push ke main branch
git push -u origin main
```

---

## 2. Konfigurasi GitHub Pages

### Langkah 2.1: Akses Settings Repository
1. Buka repository Anda di GitHub
2. Klik tab **Settings** (gear icon)
3. Di menu sidebar sebelah kiri, scroll ke bawah dan klik **"Pages"**

### Langkah 2.2: Konfigurasi Pages
Di halaman GitHub Pages:

1. **Source**: Pilih **Deploy from a branch**
2. **Branch**: Pilih **main** dari dropdown pertama
3. **Folder**: Pilih **/ (root)** dari dropdown kedua
4. Klik **Save**

### Langkah 2.3: Verifikasi Deployment
- GitHub akan menampilkan status deployment
- Tunggu sampai muncul pesan berwarna hijau: "Your site is live at https://USERNAME.github.io/marketplace-customer-management"
- Klik link tersebut untuk membuka aplikasi

---

## 3. Mengakses Aplikasi

Setelah deployment selesai (biasanya 1-2 menit), aplikasi dapat diakses di:

```
https://USERNAME.github.io/marketplace-customer-management
```

Ganti `USERNAME` dengan username GitHub Anda.

---

## 4. Fitur & Login

### Akun Default
- **Username**: `admin`
- **Password**: `123456`

### Fitur Utama
- ✅ Dashboard dengan 4 KPI metrik
- ✅ 5 grafik analitik menggunakan Chart.js
- ✅ Manajemen pelanggan (CRUD)
- ✅ Pencarian real-time
- ✅ Export/Import CSV
- ✅ Validasi form real-time
- ✅ Desain responsif (mobile-friendly)
- ✅ Data tersimpan di browser LocalStorage

---

## 5. Troubleshooting

### Masalah: Halaman tidak muncul / 404 Error
**Solusi:**
1. Pastikan branch adalah **main** di GitHub Pages settings
2. Pastikan folder adalah **/ (root)**
3. Tunggu 2-3 menit untuk deployment selesai
4. Coba hard refresh di browser: `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)

### Masalah: Styling/CSS tidak tampil
**Solusi:**
- Clear browser cache
- Pastikan koneksi internet stabil
- Coba akses di browser incognito/private

### Masalah: Chart.js tidak muncul
**Solusi:**
- Pastikan CDN Chart.js dapat diakses (membutuhkan internet)
- Cek console browser untuk error messages (F12)
- Pastikan data ada di aplikasi

### Masalah: Data tidak tersimpan
**Solusi:**
- Periksa apakah LocalStorage diaktifkan di browser
- Jika menggunakan mode Incognito, data akan hilang saat browser ditutup
- Coba gunakan browser yang berbeda

---

## 6. Update Aplikasi

Untuk update aplikasi setelah melakukan perubahan:

```bash
# 1. Stage perubahan
git add .

# 2. Commit perubahan
git commit -m "Deskripsi perubahan Anda"

# 3. Push ke GitHub
git push origin main
```

GitHub Pages akan otomatis redeploy dalam 1-2 menit.

---

## 7. Custom Domain (Opsional)

Jika ingin menggunakan domain custom seperti `example.com`:

1. Di GitHub Pages settings, scroll ke "Custom domain"
2. Masukkan domain Anda
3. Konfigurasikan DNS record di provider domain Anda (sesuaikan petunjuk provider)
4. Pilih opsi HTTPS di GitHub Pages settings

---

## 8. Referensi

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Troubleshooting GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
- [Setting up custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## 9. Struktur File Penting

```
repository-root/
├── index.html              # Entry point (diakses pertama)
├── css/
│   ├── styles.css         # Base styles
│   └── responsive.css     # Responsive design
├── js/
│   ├── app.js            # Main application
│   ├── storage-api.js    # LocalStorage wrapper
│   ├── auth-manager.js   # Login & authentication
│   └── ... (modules lainnya)
├── README.md             # Dokumentasi
└── GITHUB_PAGES_SETUP.md # File ini
```

**Catatan penting**: 
- File `index.html` harus di root directory
- Semua paths di HTML harus relative (tidak menggunakan `/`)
- GitHub Pages akan serve file dari root directory

---

## 10. Support & Kontribusi

Jika menemukan bug atau ingin berkontribusi:
1. Buka issue di GitHub
2. Jelaskan deskripsi bug atau fitur yang diinginkan
3. Sertakan screenshot/video jika diperlukan

---

**Dibuat untuk**: Revou Coding Camp  
**Tanggal**: November 2026  
**Tech Stack**: HTML5, CSS3, JavaScript (Vanilla), LocalStorage, Chart.js


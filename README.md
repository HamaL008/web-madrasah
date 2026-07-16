# Website Madrasah Miftahul Ulum

Website profil dan PPDB online Madrasah Miftahul Ulum — dibangun dengan ekosistem modern React 19 dan Laravel 12.

![Screenshot Website](https://via.placeholder.com/1200x600?text=Screenshot+Website+Madrasah) <!-- TODO: Ganti dengan screenshot asli -->

```
frontend/   → React 19 + Vite 8 + Tailwind CSS 4
backend/    → Laravel 12 REST API + MySQL
```

## Daftar Isi
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Panduan Instalasi dan Deployment](#panduan-instalasi-dan-deployment)
- [Akses Aplikasi](#akses-aplikasi)
- [API Endpoints](#api-endpoints)
- [Panduan Kontribusi](#panduan-kontribusi)
- [Lisensi](#lisensi)

---

## Fitur Utama

### 🌐 Halaman Publik (Frontend)
- **Profil Madrasah**: Sejarah, visi, misi, dan kurikulum pendidikan.
- **Direktori Guru & Ustadz**: Profil lengkap staf pengajar.
- **Galeri Kegiatan**: Dokumentasi visual kegiatan santri dan madrasah.
- **PPDB Online**:
  - Informasi rincian biaya pendaftaran.
  - Formulir pendaftaran peserta didik baru (PPDB) online terintegrasi.
- **Pusat Informasi**: Informasi kontak dan legalitas madrasah.

### 🔐 Panel Admin (Backend CMS)
| Modul | Fungsionalitas |
|-------|-------|
| **Dashboard** | Ringkasan statistik pendaftar, jumlah santri, dan guru. |
| **Manajemen PPDB** | Filter pendaftar berdasarkan status, pencarian, verifikasi/penolakan data, dan ekspor ke format Excel (`.xlsx`). |
| **Pengaturan Periode** | Kontrol buka/tutup sistem pendaftaran PPDB. |
| **Manajemen Galeri** | Unggah, sunting, dan hapus foto kegiatan madrasah. |
| **Database Internal** | Pengelolaan data induk santri dan guru. |
| **Manajemen Konten (CMS)** | Penyesuaian teks profil, hero section, kontak, dan biaya tanpa perlu coding. |

---

## Teknologi yang Digunakan

### Frontend (Client-side)
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Export Data:** SheetJS (xlsx)

### Backend (Server-side)
- **Framework:** Laravel 12
- **Bahasa Pemrograman:** PHP 8.3+
- **Database:** MySQL
- **Otentikasi:** Laravel Sanctum (Token-based Auth)

---

## Persyaratan Sistem

Pastikan sistem Anda telah menginstal perangkat lunak berikut sebelum menjalankan aplikasi:
- **PHP** (minimal versi 8.3)
- **Composer** (Dependensi PHP)
- **Node.js** (minimal versi 18.x) dan **npm**
- **MySQL** (atau MariaDB) terinstal dan berjalan

---

## Panduan Instalasi dan Deployment

### 1. Kloning Repositori
```bash
git clone https://github.com/username/web-madrasah.git
cd web-madrasah
```

### 2. Setup Backend (Laravel)

```bash
cd backend

# Salin file environment dan sesuaikan konfigurasi
cp .env.example .env

# Buka .env dan sesuaikan kredensial database Anda
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=madrasah
# DB_USERNAME=root
# DB_PASSWORD=

# Instal dependensi PHP
composer install

# Generate application key
php artisan key:generate

# Jalankan migrasi database beserta seeder (data awal)
php artisan migrate --seed

# Buat symbolic link untuk storage (penting agar gambar galeri dapat diakses publik)
php artisan storage:link

# Jalankan server development Laravel
php artisan serve
```
Backend akan berjalan di `http://localhost:8000`.

### 3. Setup Frontend (React)

Buka terminal baru:
```bash
cd frontend

# Salin file environment (jika diperlukan, sesuaikan dengan URL backend)
# Biasanya variabel seperti VITE_API_BASE_URL=http://localhost:8000/api

# Instal dependensi Node
npm install

# Jalankan server development Vite
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`.

---

## Akses Aplikasi

Setelah kedua server berjalan, Anda dapat mengakses aplikasi melalui URL berikut:

| Akses | URL | Keterangan |
|-----|-----|-----------|
| **Halaman Utama** | `http://localhost:5173` | Tampilan publik website |
| **Login Admin** | `http://localhost:5173/admin/login` | Halaman autentikasi admin |
| **Dashboard Admin** | `http://localhost:5173/admin` | Halaman kontrol panel (CMS) |

### Kredensial Default Admin (Dari Seeder)
- **Username:** `admin`
- **Password:** `admin123`

*(Pastikan untuk mengubah kredensial ini di lingkungan produksi!)*

---

## API Endpoints

### 🟢 Public (Tanpa Autentikasi)
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/content` | Mengambil data konten dinamis website |
| GET | `/api/gallery` | Mengambil daftar galeri kegiatan |
| GET | `/api/teachers` | Mengambil direktori guru |
| GET | `/api/ppdb/status` | Mengecek status buka/tutup PPDB |
| POST | `/api/ppdb` | Submit formulir pendaftaran PPDB online |
| POST | `/api/auth/login` | Autentikasi dan mendapatkan token admin |

### 🔴 Protected (Membutuhkan Bearer Token Admin)
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/admin/me` | Mengambil info profil user yang sedang login |
| POST | `/api/admin/logout` | Revoke token / logout |
| GET | `/api/admin/registrants` | Mengambil daftar seluruh pendaftar PPDB |
| PATCH | `/api/admin/registrants/{id}/status` | Memperbarui status pendaftar (terima/tolak) |
| DELETE | `/api/admin/registrants/{id}` | Menghapus data pendaftar |
| GET/POST | `/api/admin/students` | Mengambil / menambah data santri aktif |
| DELETE | `/api/admin/students/{id}` | Menghapus data santri |
| GET/POST | `/api/admin/teachers` | Mengambil / menambah data guru |
| DELETE | `/api/admin/teachers/{id}` | Menghapus data guru |
| GET/PUT | `/api/admin/ppdb-setting` | Mengambil / memperbarui pengaturan PPDB |
| GET/POST | `/api/admin/gallery` | Mengambil daftar / mengunggah foto galeri |
| POST | `/api/admin/gallery/{id}` | Memperbarui foto galeri |
| DELETE | `/api/admin/gallery/{id}` | Menghapus foto galeri |
| PUT | `/api/admin/content` | Memperbarui teks konten CMS website |

---

## Panduan Kontribusi

Kami menyambut baik setiap kontribusi untuk pengembangan sistem ini! Ikuti langkah-langkah berikut:

1. Lakukan **Fork** pada repositori ini.
2. Buat branch fitur baru (`git checkout -b feature/FiturBaruAnda`).
3. Lakukan **Commit** pada perubahan Anda (`git commit -m 'Menambahkan fitur XYZ'`).
4. **Push** ke branch yang telah dibuat (`git push origin feature/FiturBaruAnda`).
5. Buat **Pull Request**.

Pastikan kode Anda mengikuti standar *style guide* yang telah digunakan dalam proyek ini.

---

## Lisensi

Proyek ini berada di bawah lisensi [MIT License](LICENSE). Anda bebas menggunakan, memodifikasi, dan mendistribusikan sistem ini baik untuk kebutuhan komersial maupun non-komersial, dengan tetap menyertakan atribusi lisensi asli.

---
*Dikembangkan untuk Madrasah Miftahul Ulum.*

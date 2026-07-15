# Website Madrasah Miftahul Ulum

Website profil dan PPDB online Madrasah Miftahul Ulum — dibangun dengan React + Laravel.

```
frontend/   → React 19 + Vite 8 + Tailwind CSS 4
backend/    → Laravel 12 REST API + MySQL
```

## Persyaratan Sistem

Pastikan sistem Anda telah menginstal perangkat lunak berikut sebelum menjalankan aplikasi:
- **PHP** (minimal versi 8.3)
- **Composer**
- **Node.js** dan **npm**
- **MySQL** (atau MariaDB)

## Cara Menjalankan

### Backend (Laravel)

```bash
cd backend

# Copy .env jika belum ada
cp .env.example .env

# Sesuaikan konfigurasi database di .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_DATABASE=madrasah
# DB_USERNAME=root
# DB_PASSWORD=

# Generate key
php artisan key:generate

# Migrasi + seeder
php artisan migrate --seed

# Symlink storage (untuk upload gambar galeri)
php artisan storage:link

# Jalankan server
php artisan serve
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## Akses

| URL | Keterangan |
|-----|-----------|
| `http://localhost:5173` | Halaman utama website |
| `http://localhost:5173/admin/login` | Login admin |
| `http://localhost:5173/admin` | Dashboard admin |

## Kredensial Admin

- **Username:** `admin`
- **Password:** `admin123`

## Fitur

### Halaman Publik
- Profil madrasah (sejarah, visi, misi, kurikulum)
- Profil guru & ustadz
- Galeri kegiatan
- Rincian biaya PPDB
- Formulir pendaftaran PPDB online
- Informasi kontak & legalitas

### Panel Admin
| Panel | Fitur |
|-------|-------|
| Ringkasan Data | Statistik pendaftar, santri, guru |
| Pendaftar PPDB | Filter per status, search, verifikasi/tolak, ekspor Excel |
| Periode PPDB | Buka/tutup pendaftaran |
| Kelola Galeri | Upload, edit, hapus foto kegiatan |
| Database Internal | Manajemen data santri & guru |
| Kelola Konten Web | Edit teks profil, hero, kontak, biaya |

## API Endpoints

### Public
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/content` | Konten website |
| GET | `/api/gallery` | Daftar galeri |
| GET | `/api/teachers` | Daftar guru |
| GET | `/api/ppdb/status` | Status buka/tutup PPDB |
| POST | `/api/ppdb` | Submit formulir PPDB |
| POST | `/api/auth/login` | Login admin |

### Protected (Bearer Token)
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/admin/me` | Info user login |
| POST | `/api/admin/logout` | Logout |
| GET | `/api/admin/registrants` | Daftar pendaftar |
| PATCH | `/api/admin/registrants/{id}/status` | Update status pendaftar |
| DELETE | `/api/admin/registrants/{id}` | Hapus pendaftar |
| GET | `/api/admin/students` | Daftar santri |
| POST | `/api/admin/students` | Tambah santri |
| DELETE | `/api/admin/students/{id}` | Hapus santri |
| GET | `/api/admin/teachers` | Daftar guru (admin) |
| POST | `/api/admin/teachers` | Tambah guru |
| DELETE | `/api/admin/teachers/{id}` | Hapus guru |
| GET | `/api/admin/ppdb-setting` | Setting PPDB |
| PUT | `/api/admin/ppdb-setting` | Update setting PPDB |
| GET | `/api/admin/gallery` | Galeri (admin) |
| POST | `/api/admin/gallery` | Upload foto galeri |
| POST | `/api/admin/gallery/{id}` | Edit foto galeri |
| DELETE | `/api/admin/gallery/{id}` | Hapus foto galeri |
| PUT | `/api/admin/content` | Update konten website |

## Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router, Axios |
| Backend | Laravel 12, Sanctum (token auth) |
| Database | MySQL |
| Export | SheetJS (xlsx) |

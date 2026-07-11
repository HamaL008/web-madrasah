# Website Madrasah Miftahul Ulum

Proyek ini terdiri dari dua folder terpisah:

```
frontend/   → React JS + Vite + Tailwind CSS
backend/    → Laravel 11 REST API
```

## Cara Menjalankan

### Backend (Laravel)

```bash
cd backend

# Copy .env jika belum ada
cp .env.example .env

# Generate key (jika belum)
php artisan key:generate

# Jalankan migrasi + seeder
php artisan migrate --seed

# Buat admin user (jika belum)
php artisan tinker --execute="use App\Models\User; use Illuminate\Support\Facades\Hash; User::firstOrCreate(['email'=>'admin@admin.local'],['name'=>'Administrator','password'=>Hash::make('admin123')]);"

# Jalankan server di port 8000
php artisan serve
```

### Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Jalankan dev server di port 5173
npm run dev
```

## Akses

| URL | Keterangan |
|-----|-----------|
| `http://localhost:5173` | Halaman utama website |
| `http://localhost:5173/admin` | Dashboard admin |
| `http://localhost:5173/admin/login` | Login admin |

## Kredensial Admin

- **Username:** `admin`
- **Password:** `admin123`

## API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/content` | Ambil konten website (public) |
| POST | `/api/ppdb` | Submit formulir PPDB (public) |
| POST | `/api/auth/login` | Login admin |
| GET | `/api/admin/registrants` | Daftar pendaftar PPDB (auth) |
| PATCH | `/api/admin/registrants/{id}/status` | Update status pendaftar (auth) |
| DELETE | `/api/admin/registrants/{id}` | Hapus pendaftar (auth) |
| GET | `/api/admin/students` | Daftar santri aktif (auth) |
| POST | `/api/admin/students` | Tambah santri (auth) |
| DELETE | `/api/admin/students/{id}` | Hapus santri (auth) |
| GET | `/api/admin/teachers` | Daftar pendidik (auth) |
| POST | `/api/admin/teachers` | Tambah pendidik (auth) |
| DELETE | `/api/admin/teachers/{id}` | Hapus pendidik (auth) |
| PUT | `/api/admin/content` | Update konten website (auth) |
| POST | `/api/admin/logout` | Logout (auth) |

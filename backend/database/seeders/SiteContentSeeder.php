<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        SiteContent::firstOrCreate(
            ['id' => 1],
            [
                'logo_name'    => 'Madrasah Miftahul Ulum',
                'announcement' => 'Pendaftaran Santri Baru Madrasah Miftahul Ulum Tahun Ajaran 2026/2027 Telah Resmi Dibuka!',
                'hero_title'   => "Membentuk Generasi Qur'ani, Berakhlak Mulia, dan Unggul",
                'hero_subtitle' => 'Madrasah Miftahul Ulum di bawah naungan Yayasan Pondok Pesantren Hikmatul Furqon. Memadukan kurikulum Kemenag dengan khazanah pesantren salaf.',
                'hero_background' => '',
                'sambutan'     => "Assalamu'alaikum Wr. Wb.\n\nPuji syukur senantiasa kita panjatkan kepada Allah SWT atas segala limpahan rahmat-Nya. Selamat datang di portal resmi Madrasah Miftahul Ulum.\n\nWassalamu'alaikum Wr. Wb.",
                'kepala_nama'  => 'Hj. Maryam, S.Pd.I',
                'kepala_jabatan' => 'Kepala Madrasah Miftahul Ulum',
                'sejarah'      => 'Madrasah Miftahul Ulum didirikan pada tahun 2012 atas inisiasi para tokoh masyarakat dan dipimpin langsung di bawah naungan Yayasan Pondok Pesantren Hikmatul Furqon.',
                'visi'         => "Terwujudnya Generasi Qur'ani yang Berakhlak Mulia, Cerdas, Mandiri, dan Unggul dalam Prestasi.",
                'misi'         => [
                    'Menanamkan kecintaan dan pembiasaan membaca Al-Qur\'an secara tartil sesuai kaidah tajwid.',
                    'Melaksanakan pembelajaran berbasis akhlakul karimah dalam kehidupan sehari-hari.',
                    'Menyelenggarakan pendidikan formal yang kreatif untuk melahirkan santri yang cerdas dan mandiri.',
                    'Mengembangkan potensi minat dan bakat santri melalui ekstrakurikuler kepesantrenan dan umum.',
                ],
                'kurikulum'    => [
                    'Kurikulum Formal Kementerian Agama (Kemenag)',
                    'Program Khusus Tahfidz Al-Qur\'an (Target Lulus Hafal 3 Juz)',
                    'Kajian Kitab Kuning (Fiqih Safinah, Akhlak Taysir, Nahwu Shorof)',
                    'Pembiasaan Ibadah Harian (Sholat Dhuha, Berjamaah & Dzikir)',
                    'Pendidikan Karakter Islami dan Keterampilan Komputer',
                ],
                'biaya'        => [
                    ['id' => '1', 'item' => 'Uang Pendaftaran & Seleksi',          'nominal' => 100000],
                    ['id' => '2', 'item' => 'Seragam Sekolah (4 Pasang + Atribut)', 'nominal' => 650000],
                    ['id' => '3', 'item' => 'Buku Paket Pelajaran & Kitab',         'nominal' => 400000],
                    ['id' => '4', 'item' => 'Sumbangan Pengembangan Gedung',        'nominal' => 500000],
                    ['id' => '5', 'item' => 'SPP Syahriyah Bulan Pertama',          'nominal' => 150000],
                ],
                'drive_legalitas' => 'https://drive.google.com/drive/folders/example',
                'galeri'       => [
                    ['id' => 'g1', 'title' => 'Hafalan Qur\'an Pagi', 'image' => '', 'description' => 'Santri sedang menyetorkan hafalan Qur\'an pagi hari di masjid.'],
                    ['id' => 'g2', 'title' => 'Kegiatan Belajar Mengajar', 'image' => '', 'description' => 'Suasana kelas yang kondusif dengan bimbingan ustadz berpengalaman.'],
                    ['id' => 'g3', 'title' => 'Peringatan Hari Santri', 'image' => '', 'description' => 'Upacara dan perlombaan seni Islami memperingati Hari Santri Nasional.'],
                ],
                'alamat'   => 'Jl. KH. Ahmad Furqon No. 45, Kompleks Ponpes Hikmatul Furqon, Kel. Sumber Jaya, Kec. Wanaasri, Kabupaten Bogor, Jawa Barat',
                'telepon'  => '(021) 8765-4321',
                'email'    => 'info@miftahululum-hf.sch.id',
                'whatsapp' => '6281234567890',
                'instagram' => 'mda_miftahululum',
            ]
        );
    }
}

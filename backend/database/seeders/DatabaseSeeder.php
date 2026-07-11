<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user — login: admin / admin123
        User::firstOrCreate(
            ['email' => 'admin@admin.local'],
            [
                'name'     => 'Administrator',
                'password' => Hash::make('admin123'),
            ]
        );

        $this->call(SiteContentSeeder::class);

        // Default students
        $students = [
            ['nisn' => '3120984532', 'nama' => 'Ahmad Syakir Al-Fatih', 'kelas' => 'VII-A', 'alamat' => 'Sumber Jaya, Wanaasri'],
            ['nisn' => '3120876543', 'nama' => 'Syafira Khaira Wilda',  'kelas' => 'VIII-B', 'alamat' => 'Bojonggede, Bogor'],
            ['nisn' => '3120765432', 'nama' => 'Muhammad Ridwan Hakim', 'kelas' => 'IX-A',  'alamat' => 'Sumber Jaya, Wanaasri'],
            ['nisn' => '3120654321', 'nama' => 'Aisyah Azzahra Putri',  'kelas' => 'VII-B', 'alamat' => 'Cibinong, Bogor'],
            ['nisn' => '3120543210', 'nama' => 'Zikri Ramadhan Al-Ghifari', 'kelas' => 'VIII-A', 'alamat' => 'Wanaasri, Bogor'],
        ];
        foreach ($students as $s) {
            Student::firstOrCreate(['nisn' => $s['nisn']], $s);
        }

        // Default teachers
        $teachers = [
            ['nuptk' => '928374928102', 'nama' => 'Ustadz KH. Ahmad Furqon, S.Pd.I', 'mapel' => 'Tafsir, Fiqih, Aqidah', 'jabatan' => 'Pengasuh Ponpes / Pembina'],
            ['nuptk' => '482910385928', 'nama' => 'Ustadzah Hj. Maryam, S.Pd.I',     'mapel' => 'Akhlak, Hadits',         'jabatan' => 'Kepala Madrasah'],
            ['nuptk' => '182930495810', 'nama' => 'Ustadz H. Abdul Wahab, Lc',        'mapel' => 'Bahasa Arab, Nahwu, Shorof', 'jabatan' => 'Waka Humas & Kesiswaan'],
            ['nuptk' => '572910384729', 'nama' => 'Ustadzah Siti Rahmah, S.Pd',       'mapel' => 'Matematika, IPA',        'jabatan' => 'Waka Kurikulum'],
            ['nuptk' => '381029384719', 'nama' => 'Ustadz Ahmad Fauzi, S.Kom',        'mapel' => 'Sains & Teknologi Komputer', 'jabatan' => 'Operator & Pembina IT'],
        ];
        foreach ($teachers as $t) {
            Teacher::firstOrCreate(['nuptk' => $t['nuptk']], $t);
        }
    }
}

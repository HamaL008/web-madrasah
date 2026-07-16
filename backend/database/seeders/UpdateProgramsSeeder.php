<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

class UpdateProgramsSeeder extends Seeder
{
    public function run(): void
    {
        $p1 = Program::find(1);
        if($p1) {
            $p1->title = 'Kelas 1 (Satu) MDA Miftahul Ulum';
            $p1->description = 'Program pendidikan dasar yang difokuskan pada penanaman fondasi keagamaan, etika, dan pengenalan ilmu alat secara bertahap.';
            $p1->focus_points = [
                'Penguasaan fikih praktis, akidah, tajwid, dan seni menulis Arab (Takhsinul Khot) melalui kitab Al-Furqoni.',
                'Pengenalan awal tata bahasa Arab melalui materi Nahwu (Jurumiyah Awal) dan Shorof (Amsilatul Tashrifiyah Jilid Satu).',
                'Pembentukan karakter islami lewat kitab Akhlaqu Lilbanin serta target hafalan utama Surat Al-Mulk.'
            ];
            $p1->save();
        }

        $p2 = Program::find(2);
        if($p2) {
            $p2->title = 'Kelas 2 (Dua) MDA Miftahul Ulum';
            $p2->description = 'Program penguatan pemahaman syariat, sejarah Islam, serta peningkatan penguasaan kaidah tata bahasa Arab secara bertahap.';
            $p2->focus_points = [
                'Pengkajian fikih sistematis lewat kitab Taqrib, akidah (As-Sya\'adah), sejarah Nabi (Khalasoh Nurul Yaqin), dan hadis (Mulakhos Mukhtarul Ahadist).',
                'Pendalaman ilmu alat (bahasa Arab) melalui materi Nahwu (Jurumiyah Tsani) dan Shorof (Amsilatul Tashrifiyah Jilid Dua).',
                'Target capaian hafalan utama berupa Surat Al-Waqi\'ah.'
            ];
            $p2->save();
        }

        $p3 = Program::find(3);
        if($p3) {
            $p3->title = 'Kelas 3 (Tiga) MDA Miftahul Ulum';
            $p3->description = 'Program pemantapan materi teori keagamaan yang dikombinasikan dengan latihan praktis membaca literatur Islam klasik (kitab gundul) secara mandiri.';
            $p3->focus_points = [
                'Penuntasan kurikulum lanjutan Fiqih (Taqrib), Nahwu (Jurumiyah Tsalis), dan Shorof (Amsilatul Tasrifiyah Jilid Tiga).',
                'Penerapan metode aktif Sorogan Kitab untuk menguji pemahaman nahwu, shorof, fiqih, dan hadis.',
                'Bimbingan langsung praktek membaca kitab gundul serta target penyelesaian hafalan Surat Yasin.'
            ];
            $p3->save();
        }
    }
}

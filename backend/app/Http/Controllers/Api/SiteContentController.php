<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\Request;

class SiteContentController extends Controller
{
    // GET /api/content — public
    public function show()
    {
        $content = SiteContent::first();

        if (!$content) {
            return response()->json(['message' => 'Konten belum tersedia.'], 404);
        }

        return response()->json($content);
    }

    // GET /api/stats — public
    public function stats()
    {
        $studentsCount = \App\Models\Student::count();
        $teachersCount = \App\Models\Teacher::count();

        return response()->json([
            'students' => $studentsCount,
            'teachers' => $teachersCount,
        ]);
    }

    // PUT /api/admin/content — protected
    public function update(Request $request)
    {
        $validated = $request->validate([
            'logo_name'       => 'required|string|max:255',
            'announcement'    => 'nullable|string',
            'hero_title'      => 'required|string|max:255',
            'hero_subtitle'   => 'required|string',
            'hero_background' => 'nullable|string',
            'sambutan'        => 'required|string',
            'sambutan_image'  => 'nullable|string',
            'kepala_nama'     => 'nullable|string|max:255',
            'kepala_jabatan'  => 'nullable|string|max:255',
            'sejarah'         => 'required|string',
            'visi'            => 'required|string',
            'misi'            => 'required|array',
            'kurikulum'       => 'required|array',
            'biaya'           => 'required|array',
            'drive_legalitas' => 'nullable|url',
            'galeri'          => 'nullable|array',
            'alamat'          => 'required|string',
            'telepon'         => 'required|string|max:50',
            'email'           => 'required|email|max:255',
            'whatsapp'        => 'required|string|max:25',
            'instagram'       => 'required|string|max:100',
        ]);

        $content = SiteContent::first();

        if ($content) {
            $content->update($validated);
        } else {
            $content = SiteContent::create($validated);
        }

        return response()->json($content);
    }
}

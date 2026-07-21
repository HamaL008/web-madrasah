<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PendaftaranSetting;
use App\Models\Registrant;
use Illuminate\Http\Request;

class RegistrantController extends Controller
{
    // POST /api/pendaftaran — public form submission
    public function store(Request $request)
    {
        // Cek apakah pendaftaran sedang aktif
        $setting = PendaftaranSetting::first();
        if (!$setting || !$setting->isActive()) {
            $pesan = $setting?->pesan_tutup ?? 'Pendaftaran saat ini sedang ditutup.';
            return response()->json(['message' => $pesan], 403);
        }

        $validated = $request->validate([
            'nama'          => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir'  => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'alamat'        => 'required|string',
            'asal_sekolah'  => 'required|string|max:255',
            'nama_ortu'     => 'required|string|max:255',
            'whatsapp'      => 'required|string|max:25',
            'jenjang'       => 'nullable|string|max:100',
        ]);

        if (empty($validated['jenjang'])) {
            $validated['jenjang'] = 'Kelas 1 MDA';
        }

        // Normalize WhatsApp number
        $wa = preg_replace('/[^0-9]/', '', $validated['whatsapp']);
        if (str_starts_with($wa, '0')) {
            $wa = '62' . substr($wa, 1);
        } elseif (!str_starts_with($wa, '62')) {
            $wa = '62' . $wa;
        }
        $validated['whatsapp'] = $wa;

        $registrant = Registrant::create($validated);

        return response()->json($registrant, 201);
    }

    // GET /api/admin/registrants — protected
    public function index(Request $request)
    {
        $query = Registrant::latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    // PATCH /api/admin/registrants/{id}/status — protected
    public function updateStatus(Request $request, Registrant $registrant)
    {
        $validated = $request->validate([
            'status' => 'required|in:Menunggu,Diverifikasi,Ditolak',
        ]);

        $registrant->update($validated);

        return response()->json($registrant);
    }

    // DELETE /api/admin/registrants/{id} — protected
    public function destroy(Registrant $registrant)
    {
        $registrant->delete();
        return response()->json(['message' => 'Pendaftar berhasil dihapus.']);
    }

    // GET /api/pendaftaran/cek-status — public
    public function cekStatus(Request $request)
    {
        $request->validate(['whatsapp' => 'required|string']);
        
        $wa = preg_replace('/[^0-9]/', '', $request->whatsapp);
        if (str_starts_with($wa, '0')) {
            $wa = '62' . substr($wa, 1);
        } elseif (!str_starts_with($wa, '62')) {
            $wa = '62' . $wa;
        }

        $registrant = Registrant::where('whatsapp', $wa)->latest()->first();

        if (!$registrant) {
            return response()->json(['message' => 'Data pendaftaran tidak ditemukan untuk nomor WhatsApp tersebut.'], 404);
        }

        return response()->json([
            'nama' => $registrant->nama,
            'status' => $registrant->status,
            'created_at' => $registrant->created_at,
            'jenjang' => $registrant->jenjang,
        ]);
    }
}

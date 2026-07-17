<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PendaftaranSetting;
use Illuminate\Http\Request;

class PendaftaranSettingController extends Controller
{
    private function formatSetting(PendaftaranSetting $s): array
    {
        return [
            'id'            => $s->id,
            'force_closed'  => (bool) $s->force_closed,
            'tanggal_buka'  => $s->getRawOriginal('tanggal_buka')
                                ? substr($s->getRawOriginal('tanggal_buka'), 0, 10)
                                : null,
            'tanggal_tutup' => $s->getRawOriginal('tanggal_tutup')
                                ? substr($s->getRawOriginal('tanggal_tutup'), 0, 10)
                                : null,
            'tahun_ajaran'  => $s->tahun_ajaran,
            'pesan_tutup'   => $s->pesan_tutup,
            'is_active'     => $s->isActive(),
        ];
    }

    // GET /api/pendaftaran/status — public
    public function status()
    {
        $setting = PendaftaranSetting::first();

        if (!$setting) {
            return response()->json([
                'is_active'     => false,
                'force_closed'  => false,
                'tanggal_buka'  => null,
                'tanggal_tutup' => null,
                'tahun_ajaran'  => null,
                'pesan_tutup'   => 'Pendaftaran belum dikonfigurasi.',
            ]);
        }

        return response()->json([
            'is_active'     => $setting->isActive(),
            'force_closed'  => (bool) $setting->force_closed,
            'tanggal_buka'  => $setting->getRawOriginal('tanggal_buka')
                                ? substr($setting->getRawOriginal('tanggal_buka'), 0, 10)
                                : null,
            'tanggal_tutup' => $setting->getRawOriginal('tanggal_tutup')
                                ? substr($setting->getRawOriginal('tanggal_tutup'), 0, 10)
                                : null,
            'tahun_ajaran'  => $setting->tahun_ajaran,
            'pesan_tutup'   => $setting->pesan_tutup ?? 'Pendaftaran saat ini sedang ditutup.',
        ]);
    }

    // GET /api/admin/pendaftaran-setting — protected
    public function show()
    {
        $setting = PendaftaranSetting::first();
        return $setting
            ? response()->json($this->formatSetting($setting))
            : response()->json(null);
    }

    // PUT /api/admin/pendaftaran-setting — protected
    public function update(Request $request)
    {
        $validated = $request->validate([
            'force_closed'  => 'required|boolean',
            'tanggal_buka'  => 'nullable|date',
            'tanggal_tutup' => 'nullable|date|after_or_equal:tanggal_buka',
            'tahun_ajaran'  => 'required|string|max:20',
            'pesan_tutup'   => 'nullable|string|max:500',
        ]);

        $setting = PendaftaranSetting::first();
        if ($setting) {
            $setting->update($validated);
        } else {
            $setting = PendaftaranSetting::create($validated);
        }

        return response()->json($this->formatSetting($setting));
    }
}

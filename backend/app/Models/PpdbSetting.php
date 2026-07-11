<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class PpdbSetting extends Model
{
    protected $fillable = [
        'force_closed',   // true = tutup paksa oleh admin, abaikan tanggal
        'tanggal_buka',
        'tanggal_tutup',
        'tahun_ajaran',
        'pesan_tutup',
    ];

    protected $casts = [
        'force_closed'  => 'boolean',
        'tanggal_buka'  => 'date',
        'tanggal_tutup' => 'date',
    ];

    /**
     * PPDB aktif jika:
     *  - Tidak dalam mode force_closed
     *  - Tanggal hari ini >= tanggal_buka  (jika diset)
     *  - Tanggal hari ini <= tanggal_tutup (jika diset)
     *  - Minimal salah satu tanggal harus diset agar tidak auto-buka
     */
    public function isActive(): bool
    {
        // Admin bisa tutup paksa kapanpun
        if ($this->force_closed) {
            return false;
        }

        // Jika tidak ada tanggal sama sekali → tetap tutup (belum dikonfigurasi)
        $rawBuka  = $this->getRawOriginal('tanggal_buka');
        $rawTutup = $this->getRawOriginal('tanggal_tutup');

        if (!$rawBuka && !$rawTutup) {
            return false;
        }

        $today = Carbon::now('Asia/Jakarta')->startOfDay();

        // Belum sampai tanggal buka
        if ($rawBuka) {
            $buka = Carbon::createFromFormat('Y-m-d', substr($rawBuka, 0, 10), 'Asia/Jakarta')->startOfDay();
            if ($today->lt($buka)) {
                return false;
            }
        }

        // Sudah lewat tanggal tutup
        if ($rawTutup) {
            $tutup = Carbon::createFromFormat('Y-m-d', substr($rawTutup, 0, 10), 'Asia/Jakarta')->endOfDay();
            if ($today->gt($tutup)) {
                return false;
            }
        }

        return true;
    }
}

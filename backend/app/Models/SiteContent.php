<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    protected $fillable = [
        'logo_name', 'announcement', 'hero_title', 'hero_subtitle',
        'hero_background', 'sambutan', 'sejarah', 'visi',
        'misi', 'kurikulum', 'biaya', 'drive_legalitas', 'galeri',
        'alamat', 'telepon', 'email', 'whatsapp', 'instagram',
    ];

    protected $casts = [
        'misi' => 'array',
        'kurikulum' => 'array',
        'biaya' => 'array',
        'galeri' => 'array',
    ];
}

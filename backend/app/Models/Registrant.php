<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registrant extends Model
{
    protected $fillable = [
        'nama', 'tempat_lahir', 'tanggal_lahir',
        'alamat', 'nama_ortu', 'whatsapp', 'status',
    ];
}

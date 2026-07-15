<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = ['title', 'description', 'image_path', 'urutan', 'category'];

    /**
     * URL publik gambar, atau null jika belum ada gambar.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }
        return url('storage/' . $this->image_path);
    }

    protected $appends = ['image_url'];
}

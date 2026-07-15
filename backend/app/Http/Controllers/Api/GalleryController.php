<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    // GET /api/gallery — public
    public function index(Request $request)
    {
        $query = Gallery::orderBy('urutan')->orderBy('created_at', 'desc');

        if ($request->filled('category') && $request->category !== 'Semua') {
            $query->where('category', $request->category);
        }

        return response()->json($query->get());
    }

    // POST /api/admin/gallery — protected, multipart/form-data
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'image'       => 'nullable|image|max:5120',
            'urutan'      => 'nullable|integer',
            'category'    => 'nullable|string|max:100',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $file      = $request->file('image');
            $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $imagePath = $file->storeAs('gallery', $filename, 'public');
        }

        $gallery = Gallery::create([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'image_path'  => $imagePath,
            'urutan'      => $validated['urutan'] ?? 0,
            'category'    => $validated['category'] ?? 'Umum',
        ]);

        return response()->json($gallery, 201);
    }

    // POST /api/admin/gallery/{gallery} — update (pakai POST biar bisa kirim file)
    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'image'       => 'nullable|image|max:5120',
            'urutan'      => 'nullable|integer',
            'category'    => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('image')) {
            // Hapus gambar lama
            if ($gallery->image_path) {
                Storage::disk('public')->delete($gallery->image_path);
            }
            $file      = $request->file('image');
            $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $validated['image_path'] = $file->storeAs('gallery', $filename, 'public');
        }

        unset($validated['image']);
        $gallery->update($validated);

        return response()->json($gallery->fresh());
    }

    // DELETE /api/admin/gallery/{gallery} — protected
    public function destroy(Gallery $gallery)
    {
        if ($gallery->image_path) {
            Storage::disk('public')->delete($gallery->image_path);
        }
        $gallery->delete();
        return response()->json(['message' => 'Foto galeri berhasil dihapus.']);
    }
}


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
    public function index()
    {
        return response()->json(Gallery::orderBy('urutan')->orderBy('created_at', 'desc')->get());
    }

    // POST /api/admin/gallery — protected, multipart/form-data
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'image'       => 'nullable|image|max:2048', // max 2MB
            'urutan'      => 'nullable|integer',
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
        ]);

        return response()->json($gallery, 201);
    }

    // POST /api/admin/gallery/{gallery} — update (pakai POST biar bisa kirim file)
    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'image'       => 'nullable|image|max:2048',
            'urutan'      => 'nullable|integer',
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

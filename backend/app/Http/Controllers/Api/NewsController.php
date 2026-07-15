<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    // GET /api/news — public (hanya yang dipublish)
    public function index(Request $request)
    {
        $query = News::where('is_published', true)->orderBy('created_at', 'desc');
        return response()->json($query->get());
    }

    // GET /api/news/{slug} — public detail
    public function show($slug)
    {
        $news = News::where('slug', $slug)->where('is_published', true)->firstOrFail();
        return response()->json($news);
    }

    // GET /api/admin/news — admin (semua berita)
    public function adminIndex(Request $request)
    {
        $query = News::orderBy('created_at', 'desc');
        return response()->json($query->get());
    }

    // POST /api/admin/news
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'excerpt'      => 'nullable|string',
            'content'      => 'required|string',
            'is_published' => 'nullable|boolean',
            'image'        => 'nullable|image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file      = $request->file('image');
            $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $imagePath = $file->storeAs('news', $filename, 'public');
        }

        $news = News::create([
            'title'        => $validated['title'],
            'slug'         => News::generateSlug($validated['title']),
            'excerpt'      => $validated['excerpt'] ?? null,
            'content'      => $validated['content'],
            'is_published' => $validated['is_published'] ?? true,
            'image_path'   => $imagePath,
        ]);

        return response()->json($news, 201);
    }

    // POST /api/admin/news/{news} — pakai POST karena kirim file
    public function update(Request $request, News $news)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'excerpt'      => 'nullable|string',
            'content'      => 'required|string',
            'is_published' => 'nullable|boolean',
            'image'        => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($news->image_path) {
                Storage::disk('public')->delete($news->image_path);
            }
            $file      = $request->file('image');
            $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $validated['image_path'] = $file->storeAs('news', $filename, 'public');
        }

        if (isset($validated['title']) && $validated['title'] !== $news->title) {
            $validated['slug'] = News::generateSlug($validated['title']);
        }

        unset($validated['image']);
        $news->update($validated);

        return response()->json($news->fresh());
    }

    // DELETE /api/admin/news/{news}
    public function destroy(News $news)
    {
        if ($news->image_path) {
            Storage::disk('public')->delete($news->image_path);
        }
        $news->delete();
        return response()->json(['message' => 'Berita berhasil dihapus.']);
    }
}

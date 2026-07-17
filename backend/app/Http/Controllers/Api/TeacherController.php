<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TeacherController extends Controller
{
    public function index()
    {
        return response()->json(Teacher::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nuptk'   => 'required|string|unique:teachers,nuptk|max:30',
            'nama'    => 'required|string|max:255',
            'mapel'   => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'quotes'  => 'nullable|string',
            'image'   => 'nullable|image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $imagePath = $file->storeAs('teachers', $filename, 'public');
        }

        $teacher = Teacher::create([
            'nuptk'      => $validated['nuptk'],
            'nama'       => $validated['nama'],
            'mapel'      => $validated['mapel'],
            'jabatan'    => $validated['jabatan'],
            'quotes'     => $validated['quotes'] ?? null,
            'image_path' => $imagePath,
        ]);

        return response()->json($teacher, 201);
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'nuptk'   => 'required|string|max:30|unique:teachers,nuptk,' . $teacher->id,
            'nama'    => 'required|string|max:255',
            'mapel'   => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'quotes'  => 'nullable|string',
            'image'   => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($teacher->image_path) {
                Storage::disk('public')->delete($teacher->image_path);
            }
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $validated['image_path'] = $file->storeAs('teachers', $filename, 'public');
        }

        unset($validated['image']);
        $teacher->update($validated);

        return response()->json($teacher->fresh());
    }

    public function destroy(Teacher $teacher)
    {
        if ($teacher->image_path) {
            Storage::disk('public')->delete($teacher->image_path);
        }
        $teacher->delete();
        return response()->json(['message' => 'Pendidik berhasil dihapus.']);
    }
}

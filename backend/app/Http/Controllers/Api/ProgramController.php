<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProgramController extends Controller
{
    // GET /api/programs — public
    public function index()
    {
        return response()->json(Program::orderBy('urutan')->get());
    }

    // POST /api/admin/programs
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:50',
            'urutan'      => 'nullable|integer',
            'image'       => 'nullable|image|max:5120',
            'focus_points'=> 'nullable',
        ]);

        $focusPoints = $validated['focus_points'] ?? null;
        if (is_string($focusPoints)) {
            $focusPoints = json_decode($focusPoints, true);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $imagePath = $file->storeAs('programs', $filename, 'public');
        }

        $program = Program::create([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'icon'        => $validated['icon'] ?? 'BookOpen',
            'urutan'      => $validated['urutan'] ?? 0,
            'image_path'  => $imagePath,
            'focus_points'=> $focusPoints,
        ]);

        return response()->json($program, 201);
    }

    // PUT/POST /api/admin/programs/{program}
    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:50',
            'urutan'      => 'nullable|integer',
            'image'       => 'nullable|image|max:5120',
            'focus_points'=> 'nullable',
        ]);

        $focusPoints = $validated['focus_points'] ?? null;
        if (is_string($focusPoints)) {
            $focusPoints = json_decode($focusPoints, true);
        }
        $validated['focus_points'] = $focusPoints;

        if ($request->hasFile('image')) {
            if ($program->image_path) {
                Storage::disk('public')->delete($program->image_path);
            }
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $validated['image_path'] = $file->storeAs('programs', $filename, 'public');
        }

        unset($validated['image']);
        $program->update($validated);
        
        return response()->json($program->fresh());
    }

    // DELETE /api/admin/programs/{program}
    public function destroy(Program $program)
    {
        if ($program->image_path) {
            Storage::disk('public')->delete($program->image_path);
        }
        $program->delete();
        return response()->json(['message' => 'Program berhasil dihapus.']);
    }
}

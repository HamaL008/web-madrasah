<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;

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
        ]);

        $teacher = Teacher::create($validated);
        return response()->json($teacher, 201);
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->delete();
        return response()->json(['message' => 'Pendidik berhasil dihapus.']);
    }
}

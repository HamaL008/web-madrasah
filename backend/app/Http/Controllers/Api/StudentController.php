<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nisn'   => 'required|string|unique:students,nisn|max:20',
            'nama'   => 'required|string|max:255',
            'kelas'  => 'required|string|max:20',
            'alamat' => 'required|string',
        ]);

        $student = Student::create($validated);
        return response()->json($student, 201);
    }
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'nisn'   => 'required|string|max:20|unique:students,nisn,' . $student->id,
            'nama'   => 'required|string|max:255',
            'kelas'  => 'required|string|max:20',
            'alamat' => 'required|string',
        ]);

        $student->update($validated);
        return response()->json($student);
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(['message' => 'Santri berhasil dihapus.']);
    }
}

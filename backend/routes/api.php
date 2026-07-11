<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SiteContentController;
use App\Http\Controllers\Api\RegistrantController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\PpdbSettingController;
use App\Http\Controllers\Api\GalleryController;
use Illuminate\Support\Facades\Route;

// ─── Public Routes ────────────────────────────────────────────
Route::get('/content', [SiteContentController::class, 'show']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/ppdb/status', [PpdbSettingController::class, 'status']);
Route::post('/ppdb', [RegistrantController::class, 'store']);
Route::post('/auth/login', [AuthController::class, 'login']);

// ─── Protected Admin Routes ───────────────────────────────────
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Site content
    Route::put('/content', [SiteContentController::class, 'update']);

    // PPDB Setting
    Route::get('/ppdb-setting', [PpdbSettingController::class, 'show']);
    Route::put('/ppdb-setting', [PpdbSettingController::class, 'update']);

    // Gallery
    Route::post('/gallery',            [GalleryController::class, 'store']);
    Route::post('/gallery/{gallery}',  [GalleryController::class, 'update']); // POST bukan PUT agar bisa upload file
    Route::delete('/gallery/{gallery}',[GalleryController::class, 'destroy']);

    // PPDB Registrants
    Route::get('/registrants', [RegistrantController::class, 'index']);
    Route::patch('/registrants/{registrant}/status', [RegistrantController::class, 'updateStatus']);
    Route::delete('/registrants/{registrant}', [RegistrantController::class, 'destroy']);

    // Students
    Route::get('/students', [StudentController::class, 'index']);
    Route::post('/students', [StudentController::class, 'store']);
    Route::delete('/students/{student}', [StudentController::class, 'destroy']);

    // Teachers
    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::post('/teachers', [TeacherController::class, 'store']);
    Route::delete('/teachers/{teacher}', [TeacherController::class, 'destroy']);
});

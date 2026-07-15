<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SiteContentController;
use App\Http\Controllers\Api\RegistrantController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\PpdbSettingController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\ProgramController;
use Illuminate\Support\Facades\Route;

// ─── Public Routes ────────────────────────────────────────────
Route::get('/content', [SiteContentController::class, 'show']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/teachers', [TeacherController::class, 'index']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{slug}', [NewsController::class, 'show']);
Route::get('/programs', [ProgramController::class, 'index']);
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
    Route::post('/gallery/{gallery}',  [GalleryController::class, 'update']);
    Route::delete('/gallery/{gallery}',[GalleryController::class, 'destroy']);

    // News
    Route::get('/news',               [NewsController::class, 'adminIndex']);
    Route::post('/news',              [NewsController::class, 'store']);
    Route::post('/news/{news}',       [NewsController::class, 'update']);
    Route::delete('/news/{news}',     [NewsController::class, 'destroy']);

    // Programs
    Route::get('/programs',                  [ProgramController::class, 'index']);
    Route::post('/programs',                 [ProgramController::class, 'store']);
    Route::put('/programs/{program}',        [ProgramController::class, 'update']);
    Route::delete('/programs/{program}',     [ProgramController::class, 'destroy']);

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
    Route::post('/teachers/{teacher}', [TeacherController::class, 'update']);
    Route::delete('/teachers/{teacher}', [TeacherController::class, 'destroy']);
});

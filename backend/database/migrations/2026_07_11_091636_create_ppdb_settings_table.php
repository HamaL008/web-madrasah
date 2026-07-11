<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppdb_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('force_closed')->default(false); // tutup paksa oleh admin
            $table->date('tanggal_buka')->nullable();
            $table->date('tanggal_tutup')->nullable();
            $table->string('tahun_ajaran')->default('2026/2027');
            $table->text('pesan_tutup')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppdb_settings');
    }
};

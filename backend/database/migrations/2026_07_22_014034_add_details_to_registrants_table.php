<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('registrants', function (Blueprint $table) {
            $table->enum('jenis_kelamin', ['L', 'P'])->after('nama');
            $table->string('asal_sekolah')->after('alamat');
            $table->string('jenjang')->after('asal_sekolah')->default('Kelas 1 MDA');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registrants', function (Blueprint $table) {
            $table->dropColumn(['jenis_kelamin', 'asal_sekolah', 'jenjang']);
        });
    }
};

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
        Schema::rename('ppdb_settings', 'pendaftaran_settings');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('pendaftaran_settings', 'ppdb_settings');
    }
};

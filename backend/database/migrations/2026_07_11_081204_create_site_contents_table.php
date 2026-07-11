<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('logo_name');
            $table->text('announcement')->nullable();
            $table->string('hero_title');
            $table->text('hero_subtitle');
            $table->longText('hero_background')->nullable(); // base64 or URL
            $table->text('sambutan');
            $table->text('sejarah');
            $table->string('visi');
            $table->json('misi');
            $table->json('kurikulum');
            $table->json('biaya');
            $table->string('drive_legalitas')->nullable();
            $table->json('galeri')->nullable();
            // Kontak
            $table->text('alamat');
            $table->string('telepon');
            $table->string('email');
            $table->string('whatsapp');
            $table->string('instagram');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_contents');
    }
};

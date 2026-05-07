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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('usuariocorreo')->unique();
            $table->string('password');
            $table->string('nombres');
            $table->string('apellido_p');
            $table->string('apellido_m')->nullable();
            $table->string('telefono');
            $table->string('correo');
            $table->string('nombre_bancario')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};

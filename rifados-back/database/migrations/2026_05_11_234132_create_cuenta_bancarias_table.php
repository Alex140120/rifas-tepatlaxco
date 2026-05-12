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
        Schema::create('cuentas_bancarias', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('clabe', 50);
            $table->string('no_tarjeta', 50);
            $table->unsignedBigInteger('id_titular')->index();
            $table->unsignedBigInteger('banco')->index();
            $table->string('nombreTarjeta', 250);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuenta_bancarias');
    }
};

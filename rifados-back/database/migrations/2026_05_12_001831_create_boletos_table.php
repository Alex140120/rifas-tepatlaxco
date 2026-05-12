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
        Schema::create('boletos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('boletos', 700);
            $table->string('nombre_comprador', 250);
            $table->string('numero_telefono', 10);
            $table->string('estado', 50);
            $table->string('localidad', 250);
            $table->string('calle_numero', 500);
            $table->string('codigo_postal', 10);
            $table->string('identificacion', 500)->nullable();
            $table->unsignedBigInteger('idProducto')->index();
            $table->decimal('pagoTotal', 5, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boletos');
    }
};

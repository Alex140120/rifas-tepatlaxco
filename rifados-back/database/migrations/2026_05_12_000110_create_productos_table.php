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
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('nombre', 250);
            $table->string('descripcion', 1000);
            $table->unsignedBigInteger('id_usuario')->index();
            $table->string('en_rifa', 3);
            $table->unsignedInteger('rangoInicial');
            $table->unsignedInteger('rangoFinal');
            $table->decimal('precioBoleto', 5, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};

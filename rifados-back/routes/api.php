<?php

use App\Http\Controllers\AdminstradoresController;
use App\Http\Controllers\AreasGeograficasController;
use App\Http\Controllers\CuentasBancariasController;
use App\Http\Controllers\ProcesosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::controller(CuentasBancariasController::class)->group(function () {
    Route::get('/cuentasBancarias', 'cuentas_bancarias');
    Route::get('/cuentasbancoseleccionado', 'cuentas_banco_seleccionado');
});

Route::controller(AreasGeograficasController::class)->group(function () {
    Route::get('/obtenerEstadosMexicanos', 'estadosMexicanos');
    Route::get('/localidadesEstado', 'localidades_estado');
});

Route::post("/login", [AdminstradoresController::class, 'logueoAdministradores']);

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(AdminstradoresController::class)->group(function () {
        Route::get('/informacion', 'informacionLogueo');
        Route::post('/guardarNuevaRifa', 'guardarNuevaRifa');
    });
});

Route::controller(ProcesosController::class)->group(function () {
    Route::post('/subirArchivo', 'subir_archivo');
});

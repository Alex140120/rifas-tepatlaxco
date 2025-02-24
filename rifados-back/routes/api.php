<?php

use App\Http\Controllers\Administradores\AdministradoresController;
use App\Http\Controllers\Clientes\ProcesosController;
use App\Http\Controllers\Globales\AreasGeograficasController;
use App\Http\Controllers\Globales\CuentasBancariasController;
use App\Http\Controllers\Productos\ProductosRifadosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post("/login", [AdministradoresController::class, 'logueoAdministradores']);

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(AdministradoresController::class)->group(function () {
        Route::get('/informacion', 'informacionLogueo');
    });
});

Route::controller(CuentasBancariasController::class)->group(function () {
    Route::get('/cuentasBancarias', 'cuentas_bancarias');
    Route::get('/cuentasbancoseleccionado', 'cuentas_banco_seleccionado');
});

Route::controller(AreasGeograficasController::class)->group(function () {
    Route::get('/obtenerEstadosMexicanos', 'estadosMexicanos');
    Route::get('/localidadesEstado', 'localidades_estado');
});

Route::controller(ProcesosController::class)->group(function () {
    Route::post('/subirArchivo', 'subir_archivo');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(ProductosRifadosController::class)->group(function () {
        Route::post('/guardarNuevaRifa', 'guardarNuevaRifa');
        Route::get('/productosRegistrados', 'productosRegistrados');
        Route::post('/actualizarEstadoProducto', 'actualizarEstadoProducto');
        Route::post('/eliminarProducto', 'eliminarProducto');
        Route::post('/modificarProducto', 'modificarProducto');
    });
});

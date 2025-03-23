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

Route::controller(AdministradoresController::class)->group(function () {
    Route::post('/login', 'logueoAdministradores');
    Route::get('/bancosRegistradosCliente', 'bancosRegistrados');
    Route::get('/usuariosBancoSeleccionado', 'usuariosBancoSeleccionado');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(AdministradoresController::class)->group(function () {
        Route::get('/informacion', 'informacionLogueo');
        Route::get('/bancosRegistrados', 'bancosRegistrados');
        Route::post('/guardarNuevoBanco', 'guardarNuevoBanco');
        Route::post('/actualizarBanco', 'actualizarBanco');
        Route::post('/eliminarBanco', 'eliminarBanco');
        Route::get('/extraerCuentasBancarias', 'extraerCuentasBancarias');
        Route::get('/usuariosBancosRegistrados', 'usuariosBancosRegistrados');
        Route::post('/guardarNuevaCuentaBancaria', 'guardarNuevaCuentaBancaria');
        Route::post('/modificarCuentaBancaria', 'modificarCuentaBancaria');
        Route::post('/eliminarCuentaBancaria', 'eliminarCuentaBancaria');
        Route::get('/usuariosRegistrados', 'usuariosRegistrados');
        Route::post('/agregarNuevoUsuario', 'agregarNuevoUsuario');
        Route::post('/modificarUsuario', 'modificarUsuario');
        Route::post('/eliminarUsuario', 'eliminarUsuario');
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
    Route::get('/extraerProductoRifado', 'extraerProductoRifado');
    Route::get('/extraerBoletosRifaActiva', 'extraerBoletosRifaActiva');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(ProductosRifadosController::class)->group(function () {
        Route::post('/guardarNuevaRifa', 'guardarNuevaRifa');
        Route::get('/productosRegistrados', 'productosRegistrados');
        Route::post('/actualizarEstadoProducto', 'actualizarEstadoProducto');
        Route::post('/eliminarProducto', 'eliminarProducto');
        Route::get('/extraerArchivosProducto', 'extraerArchivosProducto');
        Route::post('/modificarProducto', 'modificarProducto');
        Route::post('/eliminarImagenProducto', 'eliminarImagenProducto');
    });
});

Route::controller(ProcesosController::class)->group(function () {
    Route::post("/guardarDatosRifa", "guardarDatosRifa");
});

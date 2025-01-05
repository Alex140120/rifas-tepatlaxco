<?php

use App\Http\Controllers\AreasGeograficasController;
use App\Http\Controllers\CuentasBancariasController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/cuentasBancarias', [CuentasBancariasController::class, 'cuentas_bancarias']);
Route::get('/cuentasbancoseleccionado', [CuentasBancariasController::class, 'cuentas_banco_seleccionado']);

Route::get('/obtenerEstadosMexicanos', [AreasGeograficasController::class, 'estadosMexicanos']);
Route::get('/localidadesEstado', [AreasGeograficasController::class, 'localidades_estado']);

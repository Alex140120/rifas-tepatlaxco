<?php

use App\Http\Controllers\CuentasBancariasController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/cuentasBancarias', [CuentasBancariasController::class, 'cuentas_bancarias']);

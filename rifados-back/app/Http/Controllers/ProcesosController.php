<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProcesosController extends Controller
{
    public function subir_archivo (Request $request)
    {
        $response = app('App\Http\Controllers\SubirArchivoController')->SubirArchivo($request, 'archivos', true);

        return response()->json([
            'response' => $response
        ]);
    }
}

<?php

namespace App\Http\Controllers\Clientes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProcesosController extends Controller
{
    public function subir_archivo(Request $request)
    {
        $response = app('App\Http\Controllers\Globales\SubirArchivoController')->SubirArchivo($request, 'archivos', true);
        $output = $response[0] === 1 ? true : false;

        return response()->json([
            'response' => $output
        ]);
    }
}

<?php

namespace App\Http\Controllers\Clientes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function extraerProductoRifado()
    {
        // Extraer el producto en rifa
        try {

            $producto = DB::table('productos')
                ->where('en_rifa', 1)
                ->select(
                    'id',
                    'nombre',
                    'descripcion',
                    'rangoInicial',
                    'rangoFinal'
                )
                ->first();

            if (!$producto) {
                return response()->json(['message' => "Aún no hay producto en rifa."], 204);
            }

            $idProducto = $producto->id;

            $imagenesProducto = DB::table('imagenesproductos')
                ->where('id_producto', $idProducto)
                ->select(
                    'ruta',
                    'nombrearchivo'
                )
                ->get();

            // Agregar las imágenes al producto
            $producto->imagenes = $imagenesProducto;

            return response()->json(['producto' => $producto], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function extraerBoletosRifaActiva()
    {
        // Extraer el producto en rifa
        try {

            $producto = DB::table('productos')
                ->where('en_rifa', 1)
                ->select(
                    'id',
                    'rangoInicial',
                    'rangoFinal'
                )
                ->first();

            if (!$producto) {
                return response()->json(['message' => "Aún no hay producto en rifa."], 204);
            }

            return response()->json(['producto' => $producto], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}

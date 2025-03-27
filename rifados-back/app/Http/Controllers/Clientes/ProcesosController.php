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

        $rutaCompleta = $response[1];

        return response()->json([
            'response' => $output,
            'ruta' => $rutaCompleta
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
                    'precioBoleto',
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

    public function guardarDatosRifa(Request $request)
    {
        $params = $request->validate([
            'idProducto'        => 'required|int',
            'nombre'            => 'required|string',
            'numTelefono'       => 'required|string',
            'estado'            => 'required|int',
            'localidad'         => 'required|string',
            'domicilio'         => 'required|string',
            'codigoPostal'      => 'required|string',
            'boletosUsuario'    => 'required',
            'pagoTotal'         => 'required|int',
            'rutaArchivo'       => 'required|string'
        ]);

        $boletosUsuario = $params['boletosUsuario'];
        $boletos = implode(",", $boletosUsuario);
        $nombre = $params['nombre'];
        $numTelefono = $params['numTelefono'];
        $estado = $params['estado'];
        $localidad = $params['localidad'];
        $domicilio = $params['domicilio'];
        $codigoPostal = $params['codigoPostal'];
        $nombreArchivo = $params['rutaArchivo'];

        $idProducto = $params['idProducto'];
        $pagoTotal = $params['pagoTotal'];

        try {

            $nuevoBoleto = DB::table('boletos')->insert([
                'boletos'           => $boletos,
                'nombre_comprador'  => $nombre,
                'numero_telefono'   => $numTelefono,
                'estado'            => $estado,
                'localidad'         => $localidad,
                'calle_numero'      => $domicilio,
                'codigo_postal'     => $codigoPostal,
                'identificacion'    => $nombreArchivo,
                'idProducto'        => $idProducto,
                'pagoTotal'         => $pagoTotal,
            ]);

            return response()->json(['output' => $nuevoBoleto], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}

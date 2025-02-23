<?php

namespace App\Http\Controllers\Productos;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Globales\AuthUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductosRifadosController extends Controller
{
    private $userAuth;

    public function __construct()
    {
        $this->userAuth = app(AuthUserController::class)->AuthUser();
    }

    public function guardarNuevaRifa(Request $request)
    {
        $params = $request->validate([
            'nombreProducto'        => 'required|string',
            'descripcionProducto'   => 'required|string',
            'cantidadBoletos'       => 'required|int',
            'archivos'              => 'required'
        ]);

        $nombreProducto = $params['nombreProducto'];
        $descripcionProducto = $params['descripcionProducto'];
        $cantidadBoletos = $params['cantidadBoletos'];

        $id_usuario = $this->userAuth->id;
        $status_enRifa = 0;
        $tamano_Permitido = 5242880;
        $extensiones_permitidas = ["jpg", "png", "jpeg"];
        $output = false;

        try {
            $id_nuevoProducto = DB::table('productos')->insertGetId(
                [
                    'nombre'        => $nombreProducto,
                    'descripcion'   => $descripcionProducto,
                    'id_usuario'    => $id_usuario,
                    'en_rifa'       => $status_enRifa,
                    'boletos'       => $cantidadBoletos
                ]
            );

            // Guadar los archivos del nuevo producto
            if ($id_nuevoProducto) {
                if ($request->hasFile('archivos')) {

                    # Recorre archivo por archivo
                    foreach ($request->file('archivos') as $archivo) {

                        $pref1 = substr(md5(uniqid(rand())), 0, 6);
                        $separa = "_";

                        $nombreArchivo = $archivo->getClientOriginalName(); # nombre del archivo;
                        $nombreArchivoRuta = $pref1 . $separa . $nombreArchivo;

                        $tamano_archivo = $archivo->getSize(); # tamaño del archivo

                        $extension_archivo = strtolower($archivo->getClientOriginalExtension()); # extensión de archivo

                        # Buscar la extension del archivo en el arreglo de las permitidas
                        if (in_array($extension_archivo, $extensiones_permitidas)) {
                            # verificar el tamaño
                            if ($tamano_Permitido >= $tamano_archivo) {

                                $carpeta = public_path("productos");
                                # Produccion
                                // $carpeta = base_path("../public_html/$nomFolder");

                                # Si no existe la carpeta, crearla
                                if (!file_exists($carpeta)) {
                                    mkdir($carpeta, 0777, true);
                                }

                                # ==================== mover a la carpeta destino ==================
                                # PARA LOCAL
                                $archivo->move($carpeta, $nombreArchivoRuta);
                                # PARA PRODUCCION
                                //$archivo->move(base_path('../public_html/avisos'), $nombreArchivoRuta);

                                $ruta = "../productos/$nombreArchivoRuta";

                                DB::table('imagenesproductos')->insert(
                                    [
                                        'ruta'          => $ruta,
                                        'nombrearchivo' => $nombreArchivoRuta,
                                        'id_producto'   => $id_nuevoProducto
                                    ]
                                );
                                $output = true;
                                $alerta = true;
                                $msj = true;
                            }
                            # Fallo del tamaño
                            else {
                                $output = false;
                                $alerta = 'error';
                                $msj = 'El tamaño del archivo excede el límite permitido.';
                            }
                        }
                        # Fallo de extensión
                        else {
                            $output = false;
                            $alerta = 'error';
                            $msj = 'El archivo seleccionado tiene una extensión inválida.';
                        }
                    }
                }
            }

            return response()->json([
                'output' => $output,
                'alerta' => $alerta,
                'msj'   => $msj
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function productosRegistrados()
    {
        try {

            $prodcutos = DB::table('productos as ta')
                ->leftJoin('usuarios as tb', 'tb.id', '=', 'ta.id_usuario')
                ->select(
                    'ta.id',
                    'ta.nombre',
                    'ta.descripcion',
                    'ta.boletos',
                    'ta.en_rifa AS status',
                    DB::raw("IF(ta.en_rifa = 1, 'En Rifa', 'Finalizado') AS statusRifa"),
                    DB::raw("CONCAT(tb.nombres, ' ', tb.apellido_p, ' ', tb.apellido_m) as nombreUser")
                )
                ->orderBy('id', 'DESC')
                ->get();

            return response()->json(['productos' => $prodcutos], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function actualizarEstadoProducto(Request $request)
    {
        $params = $request->validate([
            'idProducto' => 'required|int',
            'statusProducto' => 'required|int',
        ]);

        extract($params);

        try {

            $statusUpdate = $statusProducto === 0 ? 1 : 0;

            $transaction = DB::table('productos')
                ->where('id', $idProducto)
                ->update([
                    'en_rifa' => $statusUpdate
                ]);

            return response()->json(['output' => $transaction], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function eliminarProducto(Request $request)
    {
        $param = $request->validate([
            'idProducto' => 'required|int'
        ]);

        $idProducto = $param['idProducto'];

        try {

            DB::table('productos')
                ->where('id', $idProducto)
                ->delete();

            return response()->json(['output' => true], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}

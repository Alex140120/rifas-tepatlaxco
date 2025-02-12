<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\usuarios;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminstradoresController extends Controller
{
    private $usuario;

    public function __construct()
    {
        $this->usuario = auth()->user();
    }

    public function logueoAdministradores(Request $request)
    {
        // Validar datos
        $params = $request->validate([
            'usuario' => 'required|string',
            'password' => 'required|string',
        ]);

        // Buscar al usuario en la base de datos
        $usuario = usuarios::where('usuariocorreo', $params['usuario'])->first();

        // Validar si el usuario existe
        if (!$usuario) {
            return response()->json([
                'output' => false,
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        // Validar la contraseña
        if ($params['password'] !== $usuario->password) {
            // Contraseña incorrecta
            return response()->json([
                'output' => false,
                'message' => 'Contraseña incorrecta',
            ], 401);
        }

        // Generar un token de acceso personal con Sanctum
        $token = $usuario->createToken('auth-token')->plainTextToken;

        // Usuario autenticado correctamente
        return response()->json([
            'output' => true,
            'message' => 'access correct',
            'token' => $token,
        ], 200);
    }

    public function informacionLogueo()
    {
        // Obtener la información del usuario autenticado
        $nombres = "{$this->usuario->nombres} {$this->usuario->apellido_p}";

        // Retornar la información del usuario
        return response()->json([
            'output' => true,
            'message' => 'Información del usuario',
            'usuario' => $nombres,
        ], 200);
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

        $id_usuario = $this->usuario->id;
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
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function guardar_archivos_aviso(Request $request)
    {
        $tamano_Permitido = 5242880;

        $extensiones_permitidas = [
            "jpg",
            "png",
            "jpeg"
        ];
        # Existen los archivos
        if ($request->hasFile('archivos')) {

            # Recorre archivo por archivo
            foreach ($request->file('archivos') as $archivo) {

                $nombreArchivo = $archivo->getClientOriginalName(); # nombre del archivo;
                $nombreArchivoRuta = $nombreArchivo;

                $tamano_archivo = $archivo->getSize(); # tamaño del archivo

                $extension_archivo = strtolower($archivo->getClientOriginalExtension()); # extensión de archivo

                # Buscar la extension del archivo en el arreglo de las permitidas
                if (in_array($extension_archivo, $extensiones_permitidas)) {
                    # verificar el tamaño
                    if ($tamano_Permitido >= $tamano_archivo) {

                        # ==================== mover a la carpeta destino ==================
                        # PARA LOCAL
                        //$archivo->move(public_path('avisos'), $nombreArchivoRuta);
                        # PARA PRODUCCION
                        $archivo->move(base_path('../public_html/avisos'), $nombreArchivoRuta);

                        $insert = DB::select("INSERT INTO avisosarchivos (id, idaviso, imagen1, nomarchivo) VALUES (NULL, '$idAviso', '../avisos/$nombreArchivoRuta', '$nombreArchivo')");

                        $alerta = $insert;
                        $msj = $insert;
                    }
                    # Fallo del tamaño
                    else {
                        $alerta = 'error';
                        $msj = 'El tamaño del archivo excede el límite permitido.';
                    }
                }
                # Fallo de extensión
                else {
                    $alerta = 'error';
                    $msj = 'El archivo seleccionado tiene una extensión inválida.';
                }
            }
        }
        // En caso de que no existan los archivos
        else {
            $alerta = 'error';
            $msj = 'Los archivos no existen.';
        }

        return response()->json(['alerta' => $alerta, 'msj' => $msj]);
    }
}

<?php

namespace App\Http\Controllers\Administradores;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Globales\AreasGeograficasController;
use App\Http\Controllers\Globales\AuthUserController;
use App\Http\Controllers\Globales\SubirArchivoController;
use App\Models\usuarios;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdministradoresController extends Controller
{
    private $userAuth;
    private $subirArchivo;
    private $areasGeograficas;

    public function __construct()
    {
        $this->userAuth = app(AuthUserController::class)->AuthUser();
        $this->subirArchivo = new SubirArchivoController();
        $this->areasGeograficas = new AreasGeograficasController();
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
        $nombres = "{$this->userAuth->nombres} {$this->userAuth->apellido_p}";

        // Retornar la información del usuario
        return response()->json([
            'output' => true,
            'message' => 'Información del usuario',
            'usuario' => $nombres,
        ], 200);
    }

    public function bancosRegistrados()
    {
        try {

            $bancos = DB::table('bancos AS ta')
                ->select(
                    'ta.id',
                    'ta.nombre_banco',
                    'ta.logo_banco',
                    DB::raw("(SELECT COUNT(*) FROM cuentas_bancarias cb  WHERE cb.banco = ta.id ) AS cuentas")
                )
                ->orderBy('ta.nombre_banco', 'ASC')
                ->get();

            return response()->json(['bancos' => $bancos], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function guardarNuevoBanco(Request $request)
    {
        $nombreBanco = $request->nombreBanco;

        try {

            $carpeta = "bancos";
            $archivo = $this->subirArchivo->SubirArchivo($request, $carpeta, true);

            if ($archivo[0] == 1) {
                $nombreArchivo = $archivo[1];

                $ruta = "../$carpeta/$nombreArchivo";

                DB::table('bancos')->insert([
                    'nombre_banco' => $nombreBanco,
                    'logo_banco' => $ruta
                ]);
            }

            return response()->json(['output' => $archivo], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function actualizarBanco(Request $request)
    {
        $nombreBanco = $request->nombreBanco;
        $idBanco = $request->idBanco;
        $logo = $request->logo;

        // nombre de la carpeta de los bancos
        $carpeta = "bancos";
        // obtener el nombre del archivo del logo
        $nombreLogo = Str::afterLast($logo, '/');

        try {

            $archivo = $this->subirArchivo->SubirArchivo($request, $carpeta, true);

            if ($archivo[0] == 1) {

                // Aplicar las modificaciones
                $nombreArchivo = $archivo[1];

                $ruta = "../$carpeta/$nombreArchivo";

                DB::table('bancos')
                    ->where('id', $idBanco)
                    ->update([
                        'nombre_banco' => $nombreBanco,
                        'logo_banco' => $ruta
                    ]);

                // Si subio correctamente la imagen, se elimina la imagen anterior
                $this->subirArchivo->EliminarArchivo($carpeta, $nombreLogo);
            }

            return response()->json(['output' => $archivo], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function eliminarBanco(Request $request)
    {
        $params = $request->validate([
            'idBanco' => 'required|int',
            'logo' => 'required|string'
        ]);

        try {

            DB::transaction(function () use ($params) {
                extract($params);

                // nombre de la carpeta de los bancos
                $carpeta = "bancos";
                // obtener el nombre del archivo del logo
                $nombreLogo = Str::afterLast($logo, '/');

                // Eliminar bancos de la base de datos
                DB::table('bancos')->where('id', $idBanco)->delete();

                // Eliminar el logo del banco
                $this->subirArchivo->EliminarArchivo($carpeta, $nombreLogo);
            });

            return response()->json(['output' => true], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function usuariosBancoSeleccionado(Request $request)
    {
        $param = $request->validate([
            'id' => 'required|int'
        ]);

        $idBanco = $param['id'];

        try {

            $cuentas = DB::table('cuentas_bancarias AS ta')
                ->leftJoin('usuarios AS tb', 'ta.id_titular', '=', 'tb.id')
                ->select(
                    DB::raw("CONCAT(tb.nombres, ' ', tb.apellido_p, ' ', tb.apellido_m) AS titularCuenta"),
                    'ta.clabe',
                    'ta.no_tarjeta',
                    'tb.telefono'
                )
                ->where('ta.banco', $idBanco)
                ->get();

            return response()->json(['cuentas' => $cuentas], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function extraerCuentasBancarias(Request $request)
    {
        try {

            $cuentas = DB::table('cuentas_bancarias as ta')
                ->join('bancos as tb', 'tb.id', '=', 'ta.banco')
                ->join('usuarios as tc', 'tc.id', '=', 'ta.id_titular')
                ->select(
                    'ta.id AS idcuenta',
                    'ta.clabe',
                    'ta.no_tarjeta',
                    'tb.id AS idbanco',
                    'tb.logo_banco',
                    'tb.nombre_banco',
                    'tc.id AS idtitular',
                    DB::raw("CONCAT(tc.nombres, ' ', tc.apellido_p, ' ', tc.apellido_m) as titular")
                )
                ->orderBy('titular', 'ASC')
                ->get();

            return response()->json(['cuentas' => $cuentas], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function usuariosBancosRegistrados()
    {
        try {

            $bancos = DB::table('bancos')
                ->select(
                    'id',
                    'nombre_banco AS opcion',
                    DB::raw("FALSE AS disabled")
                )
                ->orderBy('opcion', 'ASC')
                ->get();

            $usuarios = DB::table('usuarios')
                ->select(
                    'id',
                    DB::raw("CONCAT (nombres, ' ', apellido_p, ' ', apellido_m) AS opcion"),
                    DB::raw("FALSE AS disabled")
                )
                ->orderBy('opcion', 'ASC')
                ->get();

            return response()->json(['bancos' => $bancos, 'usuarios' => $usuarios], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function guardarNuevaCuentaBancaria(Request $request)
    {
        try {

            $params = $request->validate([
                'banco'     => 'required|int',
                'titular'   => 'required|int',
            ]);

            $clabe = $request->clabe;
            $tarjeta = $request->tarjeta;
            $banco = $params['banco'];
            $titular = $params['titular'];

            $registro = DB::table('cuentas_bancarias')->insert([
                'clabe' => $clabe,
                'no_tarjeta' => $tarjeta,
                'id_titular' => $titular,
                'banco' => $banco
            ]);

            return response()->json(['output' => $registro], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function modificarCuentaBancaria(Request $request)
    {
        try {

            $params = $request->validate([
                'idcuenta'  => 'required|int',
                'banco'     => 'required|int',
                'titular'   => 'required|int',
            ]);

            $idcuenta = $params['idcuenta'];
            $clabe = $request->clabe;
            $tarjeta = $request->tarjeta;
            $banco = $params['banco'];
            $titular = $params['titular'];


            $update = DB::table('cuentas_bancarias')
                ->where('id', $idcuenta)
                ->update([
                    'clabe'         => $clabe,
                    'no_tarjeta'    => $tarjeta,
                    'id_titular'    => $titular,
                    'banco'         => $banco
                ]);

            return response()->json(['output' => $update], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function eliminarCuentaBancaria(Request $request)
    {
        $param = $request->validate([
            'idcuenta' => 'required|int'
        ]);

        $idcuenta = $param['idcuenta'];

        try {

            DB::table('cuentas_bancarias')->where('id', $idcuenta)->delete();

            return response()->json(['output' => true], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function usuariosRegistrados()
    {
        try {

            $usuarios = DB::table('usuarios')
                ->orderBy('nombres', 'ASC')
                ->get();

            return response()->json(['usuarios' => $usuarios], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function agregarNuevoUsuario(Request $request)
    {
        try {
            $params = $request->validate([
                'usuariocorreo'         => 'required|string',
                'password'              => 'required|string',
                'nombres'               => 'required|string',
                'apellido_p'            => 'required|string',
                'apellido_m'            => 'required|string',
                'telefono'              => 'required|string',
                'correo'                => 'required|string',
                'nombre_bancario'       => 'required|string',
            ]);

            extract($params);

            $existeUsuario = DB::table('usuarios')->where('usuariocorreo', $usuariocorreo)->exists();

            if (!$existeUsuario) {
                $idNuevo = DB::table('usuarios')->insertGetId([
                    'usuariocorreo'     => $usuariocorreo,
                    'password'          => $password,
                    'nombres'           => $nombres,
                    'apellido_p'        => $apellido_p,
                    'apellido_m'        => $apellido_m,
                    'telefono'          => $telefono,
                    'correo'            => $correo,
                    'nombre_bancario'   => $nombre_bancario,
                ]);

                return response()->json(['user' => $idNuevo], 200);
            } else {
                return response()->json(['output' => false], 409);
            }
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function modificarUsuario(Request $request)
    {
        try {
            $params = $request->validate([
                'idUsuario'             => 'required|int',
                'usuariocorreo'         => 'required|string',
                'password'              => 'required|string',
                'nombres'               => 'required|string',
                'apellido_p'            => 'required|string',
                'apellido_m'            => 'required|string',
                'telefono'              => 'required|string',
                'correo'                => 'required|string',
                'nombre_bancario'       => 'required|string',
            ]);

            extract($params);

            $existeUsuario = DB::table('usuarios')->where('usuariocorreo', $usuariocorreo)->exists();

            if (!$existeUsuario) {
                $update = DB::table('usuarios')
                    ->where('id', $idUsuario)
                    ->update([
                        'usuariocorreo'     => $usuariocorreo,
                        'password'          => $password,
                        'nombres'           => $nombres,
                        'apellido_p'        => $apellido_p,
                        'apellido_m'        => $apellido_m,
                        'telefono'          => $telefono,
                        'correo'            => $correo,
                        'nombre_bancario'   => $nombre_bancario,
                    ]);

                return response()->json(['output' => $update], 200);
            } else {
                return response()->json(['output' => false], 409);
            }
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function eliminarUsuario(Request $request)
    {
        $param = $request->validate([
            'idusuario' => 'required|int'
        ]);

        try {

            $idusuario = $param['idusuario'];

            DB::transaction(function () use ($idusuario) {
                // Elimina el usuario
                DB::table('usuarios')->where('id', $idusuario)->delete();
                // elimina las cuentas bancarias del usuario
                DB::table('cuentas_bancarias')->where('id_titular', $idusuario)->delete();
            });

            return response()->json(['output' => true], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function extraerBoletos(Request $request)
    {
        try {

            $boletos = DB::table('boletos as ta')
                ->join('productos as tb', 'ta.idProducto', '=', 'tb.id')
                ->select('ta.*', 'tb.nombre AS nombreProducto')
                ->orderBy('ta.id', 'DESC')
                ->get();

            $boletos = $boletos->map(function ($item) {
                $idEstado = $item->estado;

                $nombreEstado = $this->areasGeograficas->obtenerEstadoUnico($idEstado);
                $item->estado = $nombreEstado;

                return $item;
            });

            return response()->json(['boletos' => $boletos]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function asignarBoletoPagado(Request $request)
    {
        $param = $request->validate([
            'id' => 'required|int'
        ]);

        $id = $param['id'];

        try {

            $update = DB::table('boletos')
                ->where('id', $id)
                ->update([
                    'status' => 1
                ]);

            return response()->json(['output' => $update], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function liberarBoleto(Request $request)
    {
        $param = $request->validate([
            'id' => 'required|int'
        ]);

        $id = $param['id'];

        try {

            DB::table('boletos')->where('id', $id)->delete();

            return response()->json(['output' => true], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}

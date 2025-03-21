<?php

namespace App\Http\Controllers\Administradores;

use App\Http\Controllers\Controller;
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

    public function __construct()
    {
        $this->userAuth = app(AuthUserController::class)->AuthUser();
        $this->subirArchivo = new SubirArchivoController();
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
                    'ta.id',
                    'ta.clabe',
                    'ta.no_tarjeta',
                    'tb.logo_banco',
                    'tb.nombre_banco',
                    DB::raw("CONCAT(tc.nombres, ' ', tc.apellido_p, ' ', tc.apellido_m) as titular")
                )
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
                'clabe'     => 'required|string',
                'tarjeta'   => 'required|string',
                'banco'     => 'required|int',
                'titular'   => 'required|int',
            ]);

            $clabe = $params['clabe'];
            $tarjeta = $params['tarjeta'];
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
}

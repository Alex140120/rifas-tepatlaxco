<?php

namespace App\Http\Controllers\Administradores;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Globales\AuthUserController;
use App\Http\Controllers\Globales\SubirArchivoController;
use App\Models\usuarios;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
}

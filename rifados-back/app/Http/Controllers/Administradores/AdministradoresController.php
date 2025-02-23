<?php

namespace App\Http\Controllers\Administradores;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Globales\AuthUserController;
use App\Models\usuarios;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdministradoresController extends Controller
{
    private $userAuth;

    public function __construct()
    {
        $this->userAuth = app(AuthUserController::class)->AuthUser();
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
}

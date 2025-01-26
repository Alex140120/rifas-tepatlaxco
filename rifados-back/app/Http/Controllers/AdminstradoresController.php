<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\usuarios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminstradoresController extends Controller
{
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

    public function informacion()
    {
        // Obtener la información del usuario autenticado
        $usuario = auth()->user();

        // Retornar la información del usuario
        return response()->json([
            'output' => true,
            'message' => 'Información del usuario',
            'usuario' => $usuario,
        ], 200);
    }
}

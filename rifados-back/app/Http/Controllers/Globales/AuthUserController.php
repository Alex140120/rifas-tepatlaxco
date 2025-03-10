<?php

namespace App\Http\Controllers\Globales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthUserController extends Controller
{
    public function AuthUser ()
    {
        $usuario = auth()->user();

        return $usuario;
    }
}

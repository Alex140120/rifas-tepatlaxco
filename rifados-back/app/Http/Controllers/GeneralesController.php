<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GeneralesController extends Controller
{
    public function loginUser()
    {
        $usuario = auth()->user();

        return $usuario;
    }
}

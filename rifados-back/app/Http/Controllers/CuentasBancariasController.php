<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CuentasBancariasController extends Controller
{
    public function cuentas_bancarias()
    {
        $cuentas_bancarias = DB::table('cuentas_bancarias AS cb')
            ->join('usuarios AS usr', 'cb.id_titular', '=', 'usr.id')
            ->select(
                DB::raw("CONCAT(usr.nombres, ' ', usr.apellido_p, ' ', usr.apellido_m) AS titularCuenta"),
                'cb.clabe',
                'cb.no_tarjeta',
                'cb.banco',
                'cb.imagenbanco'
            )
            ->get();

        return response()->json([
            'cuentas' => $cuentas_bancarias
        ]);
    }
}

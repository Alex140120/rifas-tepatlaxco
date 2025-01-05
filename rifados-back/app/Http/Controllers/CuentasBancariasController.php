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
            ->join('bancos AS bn', 'cb.banco', '=', 'bn.id')
            ->select(
                DB::raw("CONCAT(usr.nombres, ' ', usr.apellido_p, ' ', usr.apellido_m) AS titularCuenta"),
                'cb.clabe',
                'cb.no_tarjeta',
                'bn.nombre_banco',
                'bn.logo_banco',
                'usr.telefono'
            )
            ->orderBy('bn.nombre_banco', )
            ->get();

        return response()->json([
            'cuentas' => $cuentas_bancarias
        ]);
    }

    public function cuentas_banco_seleccionado(Request $request)
    {
        $params = $request->validate([
            'tipoBanco' => 'required|int'
        ]);

        extract($params);

        $cuentas = DB::table('cuentas_bancarias AS cb')
            ->join('usuarios AS usr', 'cb.id_titular', '=', 'usr.id')
            ->select(
                'cb.clabe',
                'cb.no_tarjeta',
                "usr.nombre_bancario AS titularCuenta",
                'usr.telefono'
            )
            ->where('cb.banco', $tipoBanco)
            ->get();

        return response()->json([
            'cuentas' => $cuentas,
        ]);
    }
}

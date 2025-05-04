<?php

namespace App\Http\Controllers\Globales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AreasGeograficasController extends Controller
{
    private $estados;

    public function __construct()
    {
        $this->estados = [
            ["id" => 1, "nombre" => "Aguascalientes"],
            ["id" => 2, "nombre" => "Baja California"],
            ["id" => 3, "nombre" => "Baja California Sur"],
            ["id" => 4, "nombre" => "Campeche"],
            ["id" => 5, "nombre" => "Chiapas"],
            ["id" => 6, "nombre" => "Chihuahua"],
            ["id" => 7, "nombre" => "Ciudad de México"],
            ["id" => 8, "nombre" => "Coahuila"],
            ["id" => 9, "nombre" => "Colima"],
            ["id" => 10, "nombre" => "Durango"],
            ["id" => 11, "nombre" => "Estado de México"],
            ["id" => 12, "nombre" => "Guanajuato"],
            ["id" => 13, "nombre" => "Guerrero"],
            ["id" => 14, "nombre" => "Hidalgo"],
            ["id" => 15, "nombre" => "Jalisco"],
            ["id" => 16, "nombre" => "Michoacán"],
            ["id" => 17, "nombre" => "Morelos"],
            ["id" => 18, "nombre" => "Nayarit"],
            ["id" => 19, "nombre" => "Nuevo León"],
            ["id" => 20, "nombre" => "Oaxaca"],
            ["id" => 21, "nombre" => "Puebla"],
            ["id" => 22, "nombre" => "Querétaro"],
            ["id" => 23, "nombre" => "Quintana Roo"],
            ["id" => 24, "nombre" => "San Luis Potosí"],
            ["id" => 25, "nombre" => "Sinaloa"],
            ["id" => 26, "nombre" => "Sonora"],
            ["id" => 27, "nombre" => "Tabasco"],
            ["id" => 28, "nombre" => "Tamaulipas"],
            ["id" => 29, "nombre" => "Tlaxcala"],
            ["id" => 30, "nombre" => "Veracruz"],
            ["id" => 31, "nombre" => "Yucatán"],
            ["id" => 32, "nombre" => "Zacatecas"]
        ];
    }

    public function estadosMexicanos()
    {
        $estados = $this->estados;

        return response()->json([
            'estados' => $estados
        ]);
    }

    public function localidades_estado(Request $request)
    {
        $params = $request->validate([
            'estado' => 'required|int'
        ]);

        $estado = (int) $params['estado'];

        $archivo = match ($estado) {
            1 => 'aguascalientes',
            2 => 'baja_california',
            3 => 'baja_california_sur',
            4 => 'campeche',
            5 => 'chiapas',
            6 => 'chihuahua',
            7 => 'distrito_federal',
            8 => 'coahuila',
            9 => 'colima',
            10 => 'durango',
            11 => 'mexico',
            12 => 'guanajuato',
            13 => 'guerrero',
            14 => 'hidalgo',
            15 => 'jalisco',
            16 => 'michoacan',
            17 => 'morelos',
            18 => 'nayarit',
            19 => 'nuevo_leon',
            20 => 'oaxaca',
            21 => 'puebla',
            22 => 'queretaro',
            23 => 'quintana_roo',
            24 => 'san_luis_potosi',
            25 => 'sinaloa',
            26 => 'sonora',
            27 => 'tabasco',
            28 => 'tamaulipas',
            29 => 'tlaxcala',
            30 => 'veracruz',
            31 => 'yucatan',
            32 => 'zacatecas',
            default => null,
        };

        if ($archivo === null) {
            return response()->json(['localidades' => []]);
        }

        $carpeta = public_path("estados/{$archivo}.csv");

        if (!file_exists($carpeta)) {
            return response()->json(['localidades' => []]);
        }

        $localidades = collect();

        if (($handle = fopen($carpeta, "r")) !== false) {
            while (($row = fgetcsv($handle, 1000, ",")) !== false) {

                if ($row[2] === "Pueblo") {
                    $localidades->push([
                        "cp" => $row[0],
                        "localidad" => $row[1],
                        "tipo" => $row[2],
                    ]);
                }
            }
            fclose($handle);
        }

        $localidades = $localidades->sortBy('localidad')->values();

        return response()->json([
            'lodalidades' => $localidades
        ]);
    }

    public function obtenerEstadoUnico($idEstado)
    {
        $estados = collect($this->estados);

        $estado = $estados->firstWhere('id', $idEstado);

        return $estado ? $estado['nombre'] : null;
    }
}

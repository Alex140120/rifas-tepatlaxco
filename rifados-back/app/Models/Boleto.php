<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Boleto extends Model
{
    protected $table = 'boletos';

    protected $fillable = [
        'boletos',
        'nombre_comprador',
        'numero_telefono',
        'estado',
        'localidad',
        'calle_numero',
        'codigo_postal',
        'identificacion',
        'idProducto',
        'pagoTotal'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CuentaBancaria extends Model
{
    protected $table = 'cuentas_bancarias';

    protected $fillable = [
        'clabe',
        'no_tarjeta',
        'id_titular',
        'banco',
        'nombreTarjeta'
    ];
}

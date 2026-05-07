<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;
    // Definir la tabla asociada al modelo
    protected $table = 'usuarios';

    protected $fillable = [
        'usuariocorreo',
        'password',
        'nombres',
        'apellido_p',
        'apellido_m',
        'telefono',
        'correo',
        'nombre_bancario'
    ];

    protected $hidden = [
        'password',
    ];
}

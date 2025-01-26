<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class usuarios extends Model
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'usuarios'; // Nombre de la tabla en la base de datos

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
        'password', // Ocultar el password en respuestas JSON
    ];


}

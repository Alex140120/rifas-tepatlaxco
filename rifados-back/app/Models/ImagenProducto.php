<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagenProducto extends Model
{
    protected $table = 'imagenesproductos';

    protected $fillable = [
        'id_producto',
        'ruta',
        'nombrearchivo'
    ];
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubirArchivoController extends Controller
{
    /*
    $request para enviar el archivo seleccionado
    $nomFolder es el nombre de la carpeta en donde se almacenara el archivo
    $agregarPrefijo condiciona si se agrega o no el prefijo
    */

    public function SubirArchivo($request, $nomFolder, $agregarPrefijo)
    {
        $extensiones_permitidas = [
            "jpg",
            "png",
            "jpeg",
            "pdf",
            "xls",
            "doc",
            "ppt",
            "txt",
            "zip",
            "xlsx",
            "docx",
            "pptx",
            "xps",
            "odt",
            "dotx",
            "pptm"
        ];

        $tamano_Permitido = 5242880;

        $codigo_transaccion = "";

        # Verificar si existe el archivo
        if ($request->hasFile('archivo')) {

            $archivo = $request->file('archivo');

            $nombreArchivo = $archivo->getClientOriginalName(); # nombre del archivo;

            $tamano_archivo = $archivo->getSize(); # tamaño del archivo

            $extension_archivo = strtolower($archivo->getClientOriginalExtension()); # extensión de archivo

            # Buscar la extension del archivo en el arreglo de las permitidas
            if (in_array($extension_archivo, $extensiones_permitidas)) {
                # verificar el tamaño
                if ($tamano_Permitido >= $tamano_archivo) {
                    # Local
                    $carpeta = public_path("$nomFolder");
                    # Produccion
                    // $carpeta = base_path("../public_html/$nomFolder");
                    //$carpeta = base_path("../public_html/$nomFolder");

                    # Si no existe la carpeta, crearla
                    if (!file_exists($carpeta)) {
                        mkdir($carpeta, 0777, true);
                    }

                    $pref1 = substr(md5(uniqid(rand())), 0, 6);
                    $separa = "_";

                    # Agregar o no el prefijo
                    $nuevo_nombreArchivo = $agregarPrefijo ? $pref1 . $separa . $nombreArchivo : $nombreArchivo;

                    # Ruta para despues almacenar el examen en la carpeta tmp
                    $path = "$carpeta/$nuevo_nombreArchivo";
                    $path2 = "$nuevo_nombreArchivo";

                    # Paso 1: Obtener el nombre temporal del archivo subido
                    $temp_archivo = $request->file('archivo')->path();

                    if (!file_exists($path)) {
                        $codigo_transaccion = move_uploaded_file($temp_archivo, $path) ? $nuevo_nombreArchivo : 0;
                    }
                    # Archivo Existente
                    else {
                        $codigo_transaccion = 5;
                    }
                }
                # Fallo del tamaño
                else {
                    $codigo_transaccion = 4;
                }
            }
            # Fallo de extensión
            else {
                $codigo_transaccion = 3;
            }
        }
        # No existe tal archivo o directorio.
        else {
            $codigo_transaccion = 2;
        }

        return ([$codigo_transaccion, $path2 ] );
    }

    public function EliminarArchivo($nomFolder, $nombreArchivo)
    {
        # Local
        $carpeta = public_path("$nomFolder");
        # Produccion
        // $carpeta = base_path("../public_html/$nomFolder");

        $path = "$carpeta/$nombreArchivo";

        # Si existe el archivo => borrar
        if (file_exists($path)) {
          
            return unlink($path);

        }

        return false;
    }

    public function existeArchivo($nomFolder, $nombreArchivo)
    {
        # Local
        $carpeta = public_path("$nomFolder");
        # Produccion
        //$carpeta = base_path("../public_html/$nomFolder");

        $path = "$carpeta/$nombreArchivo";

        return file_exists($path);
    }
}

<?php

namespace App\Http\Controllers\Clientes;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Globales\AreasGeograficasController;
use App\Http\Controllers\Globales\SMTPCorreosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcesosController extends Controller
{
    private $Mailing;
    private $areasGeograficas;

    public function __construct()
    {
        $this->Mailing = new SMTPCorreosController();
        $this->areasGeograficas = new AreasGeograficasController();
    }

    public function subir_archivo(Request $request)
    {
        $response = app('App\Http\Controllers\Globales\SubirArchivoController')->SubirArchivo($request, 'archivos', true);
        $output = $response[0] === 1 ? true : false;

        $rutaCompleta = $response[1];

        return response()->json([
            'response' => $output,
            'ruta' => $rutaCompleta
        ]);
    }

    public function extraerProductoRifado()
    {
        // Extraer el producto en rifa
        try {

            $producto = DB::table('productos')
                ->where('en_rifa', 1)
                ->select(
                    'id',
                    'nombre',
                    'descripcion',
                    'rangoInicial',
                    'rangoFinal'
                )
                ->first();

            if (!$producto) {
                return response()->json(['message' => "Aún no hay producto en rifa."], 204);
            }

            $idProducto = $producto->id;

            $imagenesProducto = DB::table('imagenesproductos')
                ->where('id_producto', $idProducto)
                ->select(
                    'ruta',
                    'nombrearchivo'
                )
                ->get();

            // Agregar las imágenes al producto
            $producto->imagenes = $imagenesProducto;

            return response()->json(['producto' => $producto], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function extraerBoletosRifaActiva()
    {
        // Extraer el producto en rifa
        try {

            $producto = DB::table('productos')
                ->where('en_rifa', 1)
                ->select(
                    'id',
                    'precioBoleto',
                    'rangoInicial',
                    'rangoFinal'
                )
                ->first();

            if (!$producto) {
                return response()->json(['message' => "Aún no hay producto en rifa."], 204);
            }

            // Extraer los boletos registrados del producto en rifa
            $boletos = DB::table('boletos')
                ->where('idProducto', $producto->id)
                ->pluck('boletos')
                ->flatMap(function ($boletos) {
                    return explode(',', $boletos);  // Convierte los valores separados por comas en un arreglo
                })
                ->map(function ($boleto) {
                    return (int) $boleto;  // Convierte cada valor a número entero
                })
                ->toArray();  // Convierte el resultado final en un array simple


            return response()->json(['producto' => $producto, 'boletosApartados' => $boletos], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function guardarDatosRifa(Request $request)
    {
        $params = $request->validate([
            'idProducto'        => 'required|int',
            'nombre'            => 'required|string',
            'numTelefono'       => 'required|string',
            'estado'            => 'required|int',
            'localidad'         => 'required|string',
            'domicilio'         => 'required|string',
            'codigoPostal'      => 'required|string',
            'boletosUsuario'    => 'required',
            'pagoTotal'         => 'required|int',
            'rutaArchivo'       => 'required|string'
        ]);

        $boletosUsuario = collect($params['boletosUsuario']);
        $boletos = $boletosUsuario->implode(',');
        $nombre = $params['nombre'];
        $numTelefono = $params['numTelefono'];
        $estado = $params['estado'];
        $localidad = $params['localidad'];
        $domicilio = $params['domicilio'];
        $codigoPostal = $params['codigoPostal'];
        $nombreArchivo = $params['rutaArchivo'];

        $idProducto = $params['idProducto'];
        $pagoTotal = $params['pagoTotal'];

        try {

            $nuevoBoleto = DB::table('boletos')->insertGetId([
                'boletos'           => $boletos,
                'nombre_comprador'  => $nombre,
                'numero_telefono'   => $numTelefono,
                'estado'            => $estado,
                'localidad'         => $localidad,
                'calle_numero'      => $domicilio,
                'codigo_postal'     => $codigoPostal,
                'identificacion'    => $nombreArchivo,
                'idProducto'        => $idProducto,
                'pagoTotal'         => $pagoTotal,
            ]);

            # Mensaje para enviar por whatsApp
            $this->enviarCorreoAdministradores($params, $nuevoBoleto);

            return response()->json(['output' => true], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    private function enviarCorreoAdministradores($params, $idCompraReciente)
    {
        extract($params);

        $nombreProducto = DB::table('productos')->where('id', $idProducto)->value('nombre');

        $boletosCollect = collect($boletosUsuario);
        $boletos = $boletosCollect->implode((','));

        $nombreEstado = $this->areasGeograficas->obtenerEstadoUnico($estado);

        $correos = DB::table('usuarios')->pluck('correo');

        $asunto = "Nueva compra de {$nombre} para el producto {$nombreProducto} con el ID: $idCompraReciente";
        $mensaje = "
            ¡Hola! Has apartado los boletos para {$nombreProducto} <br/><br/>
            Total de boletos: {$boletosCollect->count()} <br/>
            Boletos apartados: {$boletos} <br/>
            Pago total: $$pagoTotal pesos <br/><br/>
            Tu nombre es: {$nombre} <br/>
            Tu número de teléfono: {$numTelefono} <br/>
            Tu dirección: {$domicilio}, {$localidad}, {$nombreEstado}, {$codigoPostal}. <br/>

            <strong>Importante:</strong> Tienes un lapso de 24 horas para realizar tu transferencia a las cuentas que se muestran en la siguiente liga: <a href='http://localhost:3000/metodosPago'>localhost:3000/metodosPago</a>
            <br/>
            Deberá enviar una fotografía del comprobante de pago a este mismo chat. <br/>
            El comprobante de pago debe contener la siguiente información: <br/>
            - Número de cuenta a la que se hizo transferencia. <br/>
            - Monto pago. <br/>
            - Fecha de pago. <br/>
            - Folio. <br/>

            Revise su información descrita en este mensaje, si es correcta proceda a realizar su pago en las cuentas correspondientes, recuerde proporcionar la información de manera correcta a la sucursal mas cercana a su ubicación para evitar errores en las transferencias.
            <br/><br/>
            ¡Mucha Suerte!
        ";

        $mail = $this->Mailing->enviarCorreo($asunto, $mensaje, $correos);
        //Log::info($mail);
        return $mail;
    }
}

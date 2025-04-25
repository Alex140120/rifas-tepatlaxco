<?php

namespace App\Http\Controllers\Globales;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use PHPMailer\PHPMailer\PHPMailer;

class SMTPCorreosController extends Controller
{
    public function enviarCorreo($asunto, $mensaje, $destinatarios)
    {
        $destinatarios = collect($destinatarios);

        $mail = new PHPMailer(true);

        try {
            // Configuración del servidor SMTP
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com'; // Cambia esto
            $mail->SMTPAuth   = true;
            $mail->Username   = 'rifastepatlaxco@gmail.com'; // Cambia esto
            $mail->Password   = 'xwtl skey ngsu nwjb'; // Cambia esto
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            // Configurar el remitente
            $mail->setFrom('rifastepatlaxco@gmail.com', 'Rifas Tepatlaxco');
            // destinatarios
            $destinatarios->each(function ($correo) use ($mail) {
                $mail->addAddress($correo, '');
            });

            // Contenido del correo
            $mail->isHTML(true);
            $mail->Subject = $asunto;
            $mail->Body    = $mensaje;

            $mail->send();

            return response()->json(true, 200);
        } catch (Exception $e) {
            return response()->json($mail->ErrorInfo, 500);
        }
    }
}

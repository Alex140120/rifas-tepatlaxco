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
            $mail->Host       = 'smtp.tu-servidor.com'; // Cambia esto
            $mail->SMTPAuth   = true;
            $mail->Username   = 'tu-correo@dominio.com'; // Cambia esto
            $mail->Password   = 'tu-contraseña'; // Cambia esto
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

            return response()->json(['mensaje' => 'Correo enviado correctamente'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => "Error al enviar el correo: {$mail->ErrorInfo}"], 500);
        }
    }
}

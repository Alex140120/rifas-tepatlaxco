import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { notifyError, notifyWarning } from "../../components/Alertas/Alertas";
import instance from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("key");
  
      if (token) {
        navigate("/panel");
      }
    }, []);

  const handleAccederSistema = () => {
    if (usuario && password && password2) {
      if (password === password2) {
        //notifySuccess("Bienvenido al sistema", "top-center");
        confirmarCredenciales(usuario, password);
      } else {
        notifyError("Las contraseñas no coinciden", "top-center");
      }
    } else {
      notifyWarning("Debes llenar todos los campos", "top-center");
    }
  };

  const confirmarCredenciales = async (usuario: string, password: string) => {
    const datos = { usuario, password };

    try {
      const response = await instance.post("/login", datos);

      const { data } = response;

      if (data.output) {
        // obtener el token
        const token = data.token;
        localStorage.setItem("key", token);

        let timerInterval: any;
        Swal.fire({
          icon: "success",
          title: `<p style="font-size:16px;margin:0px">¡Hola ${usuario}!</p>`,
          html: '<p style="font-size:14px;margin:0px">Iniciando sesión en <b></b> milisegundos.</p>',
          timer: 2500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup()?.querySelector("b");
            if (timer) {
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            }
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            navigate("/panel");
          } else {
            navigate("/panel");
          }
        });
      }
    } catch (error: any) {
      if (error.response) {
        // obtener el status y los datos de la respuesta
        const { status, data } = error.response;

        if (status === 404) {
          notifyError("Usuario no encontrado", "top-center");
        } else if (status === 401) {
          notifyError("Contraseña incorrecta", "top-center");
        } else {
          notifyError("Ocurrió un error inesperado", "top-center");
        }
        console.log("Detalles del error:", data);
      } else {
        // Si no hay `response` (error de red u otro problema)
        console.log("Error de red o configuración:", error.message);
        notifyError(
          "Ocurrió un problema al comunicarse con el servidor",
          "top-center"
        );
      }
    }
  };

  return (
    <div
      className="w-100 p-0 m-0 d-flex justify-content-center align-items-center bg-dark"
      style={{ height: "100vh" }}
    >
      <div className="bg-light card py-3 px-5 card-login">
        <h4 className="text-center mb-1">Acceso Administrador</h4>
        <hr />
        <div className="flex-column w-100 mb-2">
          <label htmlFor="correo-usuario" className="t2">
            Usuario o correo:
          </label>
          <input
            type="text"
            name="correo-usuario"
            id="correo-usuario"
            className="border bg-light rounded-2 py-1 px-2 w-100 t3"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div className="flex-column w-100 mb-2">
          <label htmlFor="password" className="t2">
            Contraseña:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border bg-light rounded-2 py-1 px-2 w-100 t3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex-column w-100 mb-3">
          <label htmlFor="password" className="t2">
            Confirma tu contraseña:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border bg-light rounded-2 py-1 px-2 w-100 t3"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center text-dark">
          <button className="button" onClick={() => handleAccederSistema()}>
            Entrar
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

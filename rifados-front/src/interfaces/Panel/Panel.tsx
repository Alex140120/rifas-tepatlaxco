import { useEffect } from "react";
import { notifySuccess } from "../../components/Alertas/Alertas";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Panel() {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("key");

    if (!token) {
      navigate("/inautorizado");
    } else {
      notifySuccess("¡Bienvenido al panel de administración!", "top-center");
    }
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem("key");
    navigate("/adms");
  }

  return (
    <div>
      <h1>Panel de administración</h1>
      <ToastContainer />
      <button className="btn btn-secondary" onClick={() => handleCerrarSesion()}>Cerrar Sesión</button>
    </div>
  );
}

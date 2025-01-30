import { useEffect, useState } from "react";
import { notifySuccess } from "../../components/Alertas/Alertas";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faList,
  faPowerOff,
  faUniversity,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function Panel() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("key");

    if (!token) {
      navigate("/inautorizado");
    } else {
      notifySuccess("¡Bienvenido al panel de administración!", "top-center");
      obtenerInformacionUsuario();
    }
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem("key");
    navigate("/adms");
  };

  const obtenerInformacionUsuario = async () => {
    const token: string | null = localStorage.getItem("key");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await instance.get("/informacion", {
      headers,
    });

    console.log("Informacion: ", response.data);
    setUsuario(response.data.usuario);
  };

  return (
    <div className="bg-info w-100 p-0 m-0">
      <div className="w-100 bg-dark p-2 text-light d-flex align-items-center row m-0">
        <div className="col-lg-11 col-md-11 col-xs-12">
          <h3 className="m-0 mb-1">{usuario}</h3>
          <p className="m-0 text-danger">Administrador</p>
        </div>
        <div className="col-lg-1 col-md-1 col-xs-12">
          <button
            className="btn btn-light rounded-1 border text-dark d-flex align-items-center justify-content-center btn-close-sesion"
            onClick={handleCerrarSesion}
          >
            <FontAwesomeIcon icon={faPowerOff} className="m-0" />
          </button>
        </div>
      </div>
      <div className="d-flex p-0 m-0">
        <aside className="aside">
          <button className="btn-aside w-100 p-2 outline-none rounded-0">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Usuarios
          </button>
          <button className="btn-aside w-100 p-2 outline-none rounded-0">
            <FontAwesomeIcon icon={faAdd} className="me-2" />
            Nueva Rifa
          </button>
          <button className="btn-aside w-100 p-2 outline-none rounded-0">
            <FontAwesomeIcon icon={faList} className="me-2" />
            Productos Rifados
          </button>
          <button className="btn-aside w-100 p-2 outline-none rounded-0">
            <FontAwesomeIcon icon={faUniversity} className="me-2" />
            Bancos Registrados
          </button>
        </aside>
        <div className="principal bg-light p-3">
          <h2>2</h2>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

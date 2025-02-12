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

import { ActualizarMain } from "../../Global/CambiarModulo";
import Principal from "../Principal";

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
    <div className="w-100 p-0 m-0">
      <div className="w-100 bg-dark py-2 px-0 text-light d-flex align-items-center row m-0">
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
        <aside className="aside h-100">
          <button
            className="btn-aside w-100 p-2 outline-none rounded-0"
            onClick={() => ActualizarMain("usuarios")}
          >
            <FontAwesomeIcon icon={faUser} />
            <span className="text-button ms-2">Usuarios</span>
          </button>
          <button
            className="btn-aside w-100 p-2 outline-none rounded-0"
            onClick={() => ActualizarMain("nuevaRifa")}
          >
            <FontAwesomeIcon icon={faAdd} />
            <span className="text-button ms-2">Nueva Rifa</span>
          </button>
          <button
            className="btn-aside w-100 p-2 outline-none rounded-0"
            onClick={() => ActualizarMain("productosRifados")}
          >
            <FontAwesomeIcon icon={faList} />
            <span className="text-button ms-2">Productos Rifados</span>
          </button>
          <button
            className="btn-aside w-100 p-2 outline-none rounded-0"
            onClick={() => ActualizarMain("bancosRegistrados")}
          >
            <FontAwesomeIcon icon={faUniversity} />
            <span className="text-button ms-2">Bancos Registrados</span>
          </button>
        </aside>
        <div className="principal p-3">
          <Principal/>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

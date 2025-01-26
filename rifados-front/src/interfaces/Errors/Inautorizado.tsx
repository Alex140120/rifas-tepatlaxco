import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Inautorizado() {
  return (
    <div
      className="w-100 p-0 m-0 d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card shadow-grey p-4 text-center">
        <FontAwesomeIcon
          icon={faExclamation}
          style={{ color: "#e00000", fontSize: "4rem" }}
        />
        <h1 className="fw-bold mt-3">ACCESO DENEGADO</h1>
        <p>Usted no tiene permisos para acceder a esta página.</p>
      </div>
    </div>
  );
}

import {
  faAdd,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tabla from "../../components/Tables/Tabla";
import { useEffect, useState } from "react";
import { OverlayTrigger, ToastContainer, Tooltip } from "react-bootstrap";
import Spinner from "../../components/Tags/Spinner";
import { getData, postData } from "../../api/apiRequest";
import { notifyError, notifySuccess } from "../../components/Alertas/Alertas";
import ModalAddUpdateUsuario from "./Complementos/ModalAddUpdateUsuario";
import Swal from "sweetalert2";

interface ColumnasI {
  field: string | number | boolean;
  header: string | number | boolean;
}

interface FilasI {
  id: number;
  usuariocorreo: string;
  password: string;
  nombres: string;
  apellido_p: string;
  apellido_m: string;
  telefono: string;
  correo: string;
  nombre_bancario: string;
  [key: string]: any; // Firma de índice añadida
}

interface ResponseI {
  usuarios: FilasI[];
}

export default function Usuarios() {
  const [carga, setCarga] = useState<boolean>(false);

  const columnas: ColumnasI[] = [
    { field: "nombre", header: "Nombre" },
    { field: "correo", header: "Correo" },
    { field: "usuariocorreo", header: "Nombre de Usuario" },
    { field: "password", header: "Contraseña" },
    { field: "telefono", header: "Teléfono" },
    { field: "nombre_bancario", header: "Nombre Bancario" },
    { field: "acciones", header: "" },
  ];

  const [filas, setFilas] = useState<FilasI[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [tituloModal, setTituloModal] = useState<string>("");

  const renderColumnContent = (field: string, rowData: FilasI) => {
    if (field === "nombre") {
      return (
        <span>
          {rowData.nombres} {rowData.apellido_p} {rowData.apellido_m}
        </span>
      );
    } else if (field === "acciones") {
      return (
        <>
          <div className="d-flex justify-content-center">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Modificar</Tooltip>}
            >
              <button
                className="btn-edit border rounded-1 t4 me-1"
                onClick={() => {}}
              >
                <FontAwesomeIcon icon={faPencil} />
              </button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Eliminar</Tooltip>}
            >
              <button
                className={`btn-delete border rounded-1 t4`}
                onClick={() => {
                  handleEliminarUsuario(rowData.id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </OverlayTrigger>
          </div>
        </>
      );
    } else {
      return rowData[field];
    }
  };

  // Carga Inicial
  useEffect(() => {
    extraerUsuariosRegistrados();
  }, []);

  const extraerUsuariosRegistrados = async () => {
    try {
      const response = await getData<ResponseI>("usuariosRegistrados", null);
      const { status, data } = response;
      if (status === 200) {
        setFilas(data.usuarios);
      }
    } catch (error: any) {
      if (error.response) {
        notifyError(
          "No se pudo extraer la información, intente más tarde.",
          "top-center"
        );
        // obtener el status y los datos de la respuesta
        const { status, data } = error.response;
        console.log(
          `status: ${status} | error: ${data.error} | message: ${data.message}`
        );
      } else {
        // Si no hay `response` (error de red u otro problema)
        console.log("Error de red o configuración:", error.message);
      }
    } finally {
      setCarga(true);
    }
  };

  const handleActualizarRegistros = () => {
    extraerUsuariosRegistrados();
  };

  const handleEliminarUsuario = (idusuario: number) => {
    Swal.fire({
      title: "",
      text: "¿Está seguro de eliminar el usuario seleccionado?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#05C7A7",
      confirmButtonText: "Sí, eliminar.",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarUsuario(idusuario);
      }
    });
  };

  const eliminarUsuario = async (idusuario: number) => {
    try {
      const response = await postData("eliminarUsuario", { idusuario });
      const { status } = response;
      if (status === 200) {
        notifySuccess("¡Usuario eliminado!", "top-center");
        const nuevosUsuarios = filas.filter((item) => item.id !== idusuario);
        setFilas(nuevosUsuarios);
      }
    } catch (error: any) {
      if (error.response) {
        notifyError("No se pudo eliminar, inténtelo más tarde.", "top-center");
        // obtener el status y los datos de la respuesta
        const { status, data } = error.response;
        console.log(
          `status: ${status} | error: ${data.error} | message: ${data.message}`
        );
      } else {
        // Si no hay `response` (error de red u otro problema)
        console.log("Error de red o configuración:", error.message);
      }
    }
  };

  return (
    <div className="container-modulo px-3 py-2 rounded-3">
      <h2>Usuarios</h2>
      <hr />

      <button
        className="mb-3 rounded-2 border btn-primary-rifas text-light t3 px-2 py-1"
        onClick={() => {
          setTituloModal("Agregar");
          handleShowModal();
        }}
      >
        <FontAwesomeIcon icon={faAdd} className="me-2" />
        Nuevo Usuario
      </button>

      {carga ? (
        <div className="w-100 expand-animation">
          <Tabla
            columnas={columnas}
            filas={filas}
            renderColumnContent={renderColumnContent}
          />
        </div>
      ) : (
        <div className="w-100 text-center">
          <Spinner />
        </div>
      )}

      <ToastContainer />

      <ModalAddUpdateUsuario
        show={showModal}
        handleClose={handleCloseModal}
        tituloModal={tituloModal}
        actualizarRegistros={handleActualizarRegistros}
      />
    </div>
  );
}

import { ToastContainer } from "react-toastify";
import Spinner from "../../components/Tags/Spinner";
import Tabla from "../../components/Tables/Tabla";
import { useEffect, useState } from "react";
import { getData, postData } from "../../api/apiRequest";
import { notifyError, notifySuccess } from "../../components/Alertas/Alertas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faPencil,
  faTimes,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ModalAgregarBanco from "./Complementos/ModalAgregarBanco";
import Swal from "sweetalert2";
import ModalUsuariosBanco from "../../components/Modales/ModalUsuariosBanco";

interface ColumnasI {
  field: string | number | boolean;
  header: string | number | boolean;
}

interface FilasI {
  id: number;
  nombre_banco: string;
  logo_banco: string;
  cuentas: number;
  [key: string]: any; // Firma de índice añadida
}

interface ResponseI {
  bancos: FilasI[];
}

interface BancoI {
  id: number;
  nombre_banco: string;
  logo_banco: string;
}

export default function BancosRegistrados() {
  const [carga, setCarga] = useState<boolean>(false);

  const [showUsersBank, setShowUsersBank] = useState<boolean>(false);
  const handleShowUsersBank = () => setShowUsersBank(true);
  const handleCloseUsersBank = () => {
    setShowUsersBank(false);
    setDatosBanco(null);
  };

  const [showAddBanco, setShowAddBanco] = useState<boolean>(false);
  const handleShowNewBank = () => setShowAddBanco(true);
  const handleCloseNewBank = () => {
    setShowAddBanco(false);
    setDatosBanco(null);
  };

  const [tipoTransaccion, setTipoTransaccion] = useState<string>("");
  const [datosBanco, setDatosBanco] = useState<BancoI | null>(null);

  const columnas: ColumnasI[] = [
    { field: "nombre_banco", header: "Banco" },
    { field: "logo_banco", header: "Logotipo" },
    { field: "acciones", header: "" },
  ];

  const [filas, setFilas] = useState<FilasI[]>([]);

  const renderColumnContent = (field: string, rowData: FilasI) => {
    if (field === "logo_banco") {
      return (
        <>
          <img
            src={rowData.logo_banco}
            alt={rowData.nombre_banco}
            width={45}
            className="rounded-2"
          />
        </>
      );
    } else if (field === "acciones") {
      return (
        <>
          {rowData.cuentas > 0 ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Usuarios registrados</Tooltip>}
            >
              <button
                className={`t3 rounded-1 btn-primary-rifas text-light t4 px-1`}
                onClick={() => {
                  handleShowUsersBank();
                  setDatosBanco({
                    id: rowData.id,
                    nombre_banco: rowData.nombre_banco,
                    logo_banco: rowData.logo_banco,
                  });
                }}
              >
                <FontAwesomeIcon icon={faUsers} />
              </button>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Eliminar</Tooltip>}
            >
              <button
                className={`t3 rounded-1 btn-danger-rifas text-light t4`}
                onClick={() => {
                  eliminarBanco(rowData.id, rowData.logo_banco);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </OverlayTrigger>
          )}

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Modificar</Tooltip>}
          >
            <button
              className="btn-warning-rifas text-light rounded-1 t4 px-1 ms-2 outline-none"
              onClick={() => {
                handleShowNewBank();
                setTipoTransaccion("update");
                setDatosBanco({
                  id: rowData.id,
                  nombre_banco: rowData.nombre_banco,
                  logo_banco: rowData.logo_banco,
                });
              }}
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
          </OverlayTrigger>
        </>
      );
    } else {
      return rowData[field];
    }
  };

  // Carga inicial
  useEffect(() => {
    extraerBancosRegistrados();
  }, []);

  const extraerBancosRegistrados = async () => {
    try {
      const response = await getData<ResponseI>("bancosRegistrados", null);
      const { status, data } = response;
      //console.log(data);
      if (status === 200) {
        setFilas(data.bancos);
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

  const actualizarBancos = (valor: boolean) => {
    if (valor) {
      extraerBancosRegistrados();
    }
  };

  const eliminarBanco = async (idBanco: number, logo: string) => {
    Swal.fire({
      title: "",
      text: "¿Está seguro de eliminar el banco seleccionado?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#05C7A7",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        ejecutarEliminacionBanco(idBanco, logo);
      }
    });
  };

  const ejecutarEliminacionBanco = async (idBanco: number, logo: string) => {
    const datos = { idBanco, logo };

    try {
      const response = await postData("eliminarBanco", datos);
      const { status, data } = response;

      if (status === 200) {
        const nuevosBancos = filas.filter((item) => item.id !== idBanco);
        setFilas(nuevosBancos);

        notifySuccess("Banco eliminado exitosamente.", "top-center");
      }
    } catch (error: any) {
      if (error.response) {
        notifyError("No se pudo eliminar, intente más tarde.", "top-center");
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
      <h2>Bancos Registrados</h2>
      <hr />

      <button
        className="mb-3 rounded-2 border btn-primary-rifas text-light t3 px-2 py-1"
        onClick={() => {
          handleShowNewBank();
          setTipoTransaccion("new");
          setDatosBanco(null);
        }}
      >
        <FontAwesomeIcon icon={faAdd} className="me-2" />
        Agregar Banco
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

      <ModalAgregarBanco
        show={showAddBanco}
        handleClose={handleCloseNewBank}
        actualizarBancos={(valor) => actualizarBancos(valor)}
        tipoTransaccion={tipoTransaccion}
        datosProps={datosBanco}
      />

      <ModalUsuariosBanco
        show={showUsersBank}
        handleClose={handleCloseUsersBank}
        datos={datosBanco}
      />
    </div>
  );
}

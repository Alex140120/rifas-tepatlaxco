import { ToastContainer } from "react-toastify";
import Spinner from "../../components/Tags/Spinner";
import Tabla from "../../components/Tables/Tabla";
import { useEffect, useState } from "react";
import { getData } from "../../api/apiRequest";
import { notifyError } from "../../components/Alertas/Alertas";
import Boton from "../../components/Botones/Boton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faTimes,
  faUniversity,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ModalAgregarBanco from "./Complementos/ModalAgregarBanco";

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

export default function BancosRegistrados() {
  const [carga, setCarga] = useState<boolean>(false);

  const [showAddBanco, setShowAddBanco] = useState<boolean>(false);
  const handleShowNewBank = () => setShowAddBanco(true);
  const handleCloseNewBank = () => setShowAddBanco(false);

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
          <img src={rowData.logo_banco} alt={rowData.nombre_banco} width={45} />
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
                onClick={() => {}}
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
                onClick={() => {}}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </OverlayTrigger>
          )}
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

  return (
    <div className="container-modulo px-3 py-2 rounded-3">
      <h2>Bancos Registrados</h2>
      <hr />

      <button
        className="mb-3 rounded-2 border btn-primary-rifas text-light t3 px-2 py-1"
        onClick={handleShowNewBank}
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
      />
    </div>
  );
}

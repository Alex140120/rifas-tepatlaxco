import { faAdd, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Tabla from "../../components/Tables/Tabla";
import Spinner from "../../components/Tags/Spinner";
import { OverlayTrigger, ToastContainer, Tooltip } from "react-bootstrap";
import { notifyError } from "../../components/Alertas/Alertas";
import { getData } from "../../api/apiRequest";

interface ColumnasI {
  field: string | number | boolean;
  header: string | number | boolean;
}

interface FilasI {
  id: number;
  titular: string;
  clabe: string;
  no_tarjeta: string;
  nombre_banco: string;
  logo_banco: string;
  [key: string]: any; // Firma de índice añadida
}

interface ResponseI {
  cuentas: FilasI[];
}

export default function CuentasBancarias() {
  const [carga, setCarga] = useState<boolean>(false);

  const columnas: ColumnasI[] = [
    { field: "titular", header: "Titular" },
    { field: "clabe", header: "Clabe" },
    { field: "no_tarjeta", header: "Número de tarjeta" },
    { field: "nombre_banco", header: "Banco" },
    { field: "acciones", header: "" },
  ];

  const [filas, setFilas] = useState<FilasI[]>([]);

  const [showUsersBank, setShowUsersBank] = useState<boolean>(false);
  const handleShowUsersBank = () => setShowUsersBank(true);
  const handleCloseUsersBank = () => {
    setShowUsersBank(false);
  };

  // Carga Inicial
  useEffect(() => {
    const extraerCuentasBancarias = async () => {
      try {
        const response = await getData<ResponseI>(
          "extraerCuentasBancarias",
          null
        );
        const { status, data } = response;
        if (status === 200) {
          setFilas(data.cuentas);
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
    extraerCuentasBancarias();
  }, []);

  const renderColumnContent = (field: string, rowData: FilasI) => {
    if (field === "nombre_banco") {
      return (
        <>
          <div className="w-100 d-flex justify-content-center flex-column">
            <div className="w-100">
              <img src={rowData.logo_banco} width={50} className="rounded-2" />
            </div>
            <div className="w-100">
              <span>{rowData.nombre_banco}</span>
            </div>
          </div>
        </>
      );
    } else if (field === "acciones") {
      return (
        <>
          <div className="w-100 d-flex">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Modificar</Tooltip>}
            >
              <button
                className="btn-warning-rifas text-light rounded-1 t4 px-1 ms-2 outline-none"
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
                className={`t3 rounded-1 btn-danger-rifas text-light t4 ms-2`}
                onClick={() => {}}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </OverlayTrigger>
          </div>
        </>
      );
    } else {
      return rowData[field];
    }
  };

  return (
    <div className="container-modulo px-3 py-2 rounded-3">
      <h2>Cuentas Bancarias</h2>
      <hr />

      <button
        className="mb-3 rounded-2 border btn-primary-rifas text-light t3 px-2 py-1"
        onClick={() => {
          // handleShowNewBank();
          // setTipoTransaccion("new");
          // setDatosBanco(null);
        }}
      >
        <FontAwesomeIcon icon={faAdd} className="me-2" />
        Agregar Cuenta
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
    </div>
  );
}

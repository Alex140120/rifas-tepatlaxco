import { useEffect, useState } from "react";
import Tabla from "../../components/Tables/Tabla";
import { ToastContainer } from "react-bootstrap";
import Spinner from "../../components/Tags/Spinner";
import { getData, postData } from "../../api/apiRequest";
import { notifyError, notifySuccess } from "../../components/Alertas/Alertas";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

interface ColumnasI {
  field: string | number | boolean;
  header: string | number | boolean;
}

interface FilasI {
  id: number;
  boletos: string;
  nombre_comprador: string;
  numero_telefono: string;
  estado: string;
  localidad: string;
  calle_numero: string;
  codigo_postal: string;
  identificacion: string;
  idProducto: string;
  nombreProducto: string;
  pagoTotal: number;
  status: number;
  [key: string]: any; // Firma de índice añadida
}

interface ResponseI {
  boletos: FilasI[];
}

interface PropiedadesI {
  [key: string]: boolean;
}

export default function Boletos() {
  const [carga, setCarga] = useState<boolean>(false);

  const columnas: ColumnasI[] = [
    { field: "nombre_comprador", header: "Comprador" },
    { field: "boletos", header: "Boletos" },
    { field: "pagoTotal", header: "Pago Total" },
    { field: "numero_telefono", header: "Número de Teléfono" },
    { field: "nombreProducto", header: "Producto" },
    { field: "estado", header: "Estado" },
    { field: "localidad", header: "Localidad" },
    { field: "calle_numero", header: "Domicilio" },
    { field: "codigo_postal", header: "Código Postal" },
    { field: "identificacion", header: "Identificación" },
    { field: "acciones", header: "" },
  ];

  const [filas, setFilas] = useState<FilasI[]>([]);

  const [propiedades, setPropiedades] = useState<PropiedadesI>({});

  // Carga inical
  useEffect(() => {
    extraerBoletos();
  }, []);

  const extraerBoletos = async () => {
    try {
      const response = await getData<ResponseI>("extraerBoletos", null);
      const { status, data } = response;
      if (status === 200) {
        //console.log(data);
        setFilas(data.boletos);
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

  useEffect(() => {
    if (filas.length) {
      filas.forEach((rowData) => {
        setPropiedades((prevProp) => ({
          ...prevProp,
          [`status${rowData.id}`]: rowData.status === 0 ? false : true,
          [`btnPagado${rowData.id}`]: false,
          [`btnLiberar${rowData.id}`]: false,
        }));
      });
    }
  }, [filas]);

  const handleAsignraPagado = async (id: number) => {
    // Bloquear boton
    setPropiedades((prevProp) => ({
      ...prevProp,
      [`btnPagado${id}`]: true,
    }));
    // Enviar peticion
    try {
      const response = await postData("asignarBoletoPagado", { id });
      const { status } = response;
      if (status === 200) {
        setPropiedades((prevProp) => ({
          ...prevProp,
          [`status${id}`]: true,
          [`btnPagado${id}`]: false,
        }));
      }
    } catch (error: any) {
      if (error.response) {
        notifyError(
          "No se pudo asignar como pagado, intente nuevamente.",
          "top-center",
          2500
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
    }
  };

  const handleLiberarBoletos = async (id: number) => {
    Swal.fire({
      title: "",
      text: "El registro será eliminado permanentemente ¿Está seguro de liberar los boletos?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#05C7A7",
      confirmButtonText: "Sí, liberar.",
    }).then((result) => {
      if (result.isConfirmed) {
        ejecutarLiberacionBoletos(id);
      }
    });
  };

  const ejecutarLiberacionBoletos = async (id: number) => {
    // Bloquear boton
    setPropiedades((prevProp) => ({
      ...prevProp,
      [`btnLiberar${id}`]: true,
    }));
    // Enviar peticion
    try {
      const response = await postData("liberarBoleto", { id });
      const { status } = response;
      if (status === 200) {
        extraerBoletos();
        notifySuccess("¡Boletos liberados!", "top-center", 1500);
      }
    } catch (error: any) {
      if (error.response) {
        notifyError(
          "No se pudo liberar, intente nuevamente.",
          "top-center",
          2500
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
    }
  };

  const renderColumnContent = (field: string, rowData: FilasI) => {
    if (field === "identificacion") {
      return (
        <>
          <a
            className="text-primary"
            style={{
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {}}
          >
            Ver
          </a>
        </>
      );
    } else if (field === "acciones") {
      return (
        <div className="w-100 d-flex justify-content-center align-items-center flex-column">
          <button
            disabled={propiedades[`btnPagado${rowData.id}`]}
            className={`${
              propiedades[`status${rowData.id}`] ? "btn-info-rifas" : "btn-edit"
            } border rounded-1 t4 mb-1`}
            onClick={() => {
              if (!propiedades[`status${rowData.id}`]) {
                handleAsignraPagado(rowData.id);
              }
            }}
          >
            <FontAwesomeIcon icon={faCheck} className="me-1" />
            Pagado
          </button>
          {!propiedades[`status${rowData.id}`] ? (
            <button
              disabled={propiedades[`btnLiberar${rowData.id}`]}
              className={`btn-delete border rounded-1 t4`}
              onClick={() => {
                handleLiberarBoletos(rowData.id);
              }}
            >
              <FontAwesomeIcon icon={faTimes} className="me-1" />
              Liberar Boletos
            </button>
          ) : null}
        </div>
      );
    } else {
      return rowData[field];
    }
  };

  return (
    <div className="container-modulo px-3 py-2 rounded-3">
      <h2>Boletos</h2>
      <hr />

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

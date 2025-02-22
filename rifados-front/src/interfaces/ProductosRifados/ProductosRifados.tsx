import { ToastContainer } from "react-toastify";
import Tabla from "../../components/Tables/Tabla";
import { useEffect, useState } from "react";
import { getData, postData } from "../../api/apiRequest";
import { notifyError } from "../../components/Alertas/Alertas";
import Spinner from "../../components/Tags/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

interface ColumnasI {
  field: string | number | boolean;
  header: string | number | boolean;
}

interface FilasI {
  id: number;
  nombre: string;
  descripcion: string;
  status: number;
  statusRifa: string;
  boletos: number;
  nombreUser: string;
  [key: string]: any; // Firma de índice añadida
}

interface ResponseI {
  productos: FilasI[];
}

export default function ProductosRifados() {
  const [carga, setCarga] = useState(false);

  const columnas: ColumnasI[] = [
    { field: "nombre", header: "Producto" },
    { field: "descripcion", header: "Descripción" },
    { field: "statusRifa", header: "En Rifa" },
    { field: "boletos", header: "Total Boletos" },
    { field: "nombreUser", header: "Subido por" },
    { field: "acciones", header: "" },
  ];

  const [filas, setFilas] = useState<FilasI[]>([]);

  const [dom, setDom] = useState<object>({});

  const renderColumnContent = (field: string, rowData: FilasI) => {
    if (field === "statusRifa") {
      return (
        <div className="w-100 d-flex justify-content-center">
          <button
            id={`btnRifa0-${rowData.id}`}
            className="btn-warning-rifas p-1 rounded-1 text-light t4 d-block px-3 py-0"
          >
            {rowData.statusRifa}
          </button>
          <button
            id={`btnRifa1-${rowData.id}`}
            className="btn-success-rifas p-1 rounded-1 text-light t4 d-block px-3 py-0"
          >
            {rowData.statusRifa}
          </button>
        </div>
      );
    } else if (field === "acciones") {
      return (
        <>
          <button className="btn-edit border rounded-1 t4 me-1"
          onClick={() => {

          }}
          >
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button className="btn-delete border rounded-1 t4"
          onClick={() => {
            handleEliminarProducto(rowData.id);
          }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </>
      );
    } else {
      return rowData[field];
    }
  };

  // Extraer productos
  useEffect(() => {
    productosRegistrados();
  }, []);

  const productosRegistrados = async () => {
    try {
      const response = await getData<ResponseI>("productosRegistrados", null);
      const { status, data } = response;

      if (status === 200) {
        setFilas(data.productos);
      }
    } catch (error: any) {
      if (error.response) {
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

  const handleEliminarProducto = (id: number) => {
    const nuevosProductos = filas.filter((item) => item.id !== id);
    setFilas(nuevosProductos);
  };

  // Manipulación de DOM
  useEffect(() => {
    if (filas.length) {
      filas.forEach((rowData) => {
        // Obtener boton status finalizado
        const rifa0 = document.getElementById(`btnRifa0-${rowData.id}`);
        // Obtener boton status en Rifa
        const rifa1 = document.getElementById(`btnRifa1-${rowData.id}`);

        if (rowData.status == 0) {
          rifa1?.classList.remove("d-block");
          rifa1?.classList.add("d-none");
        }
        if (rowData.status == 1) {
          rifa0?.classList.remove("d-block");
          rifa0?.classList.add("d-none");
        }
      });
    }
  }, [filas]);

  return (
    <div className="container-modulo px-3 py-2 rounded-3">
      <h2>Productos Rifados</h2>
      <hr />
      {carga ? (
        <div className="w-100">
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

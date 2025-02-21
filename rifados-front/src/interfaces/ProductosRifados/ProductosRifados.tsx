import { ToastContainer } from "react-toastify";
import Tabla from "../../components/Tables/Tabla";
import { useEffect, useState } from "react";
import { getData, postData } from "../../api/apiRequest";
import { notifyError } from "../../components/Alertas/Alertas";

interface ColumnasI {
  field: string | number | boolean;
  header: string | number | boolean;
}

interface FilasI {
  id: number;
  nombre: string;
  descripcion: string;
  statusRifa: number;
  boletos: number;
  nombreUser: string;
  [key: string]: any;  // Firma de índice añadida
}


interface ResponseI {
  productos: FilasI[];
}

export default function ProductosRifados() {
  const columnas: ColumnasI[] = [
    { field: "nombre", header: "Producto" },
    { field: "descripcion", header: "Descripción" },
    { field: "statusRifa", header: "En Rifa" },
    { field: "boletos", header: "Total Boletos" },
    { field: "nombreUser", header: "Subido por" },
  ];

  const [filas, setFilas] = useState<FilasI[]>([]);

  const renderColumnContent = (field: string, rowData: FilasI) => {
    if (field === "statusRifa") {
      return (
        <>
          <span className="bg-danger p-1">{rowData.statusRifa}</span>
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
    }
  };

  return (
    <div className="container-modulo px-3 py-2 rounded-3">
      <h2>Productos Rifados</h2>
      <hr />
      <div className="w-100 px-3">
        <Tabla
          columnas={columnas}
          filas={filas}
          renderColumnContent={renderColumnContent}
        />
      </div>
      <ToastContainer />
    </div>
  );
}

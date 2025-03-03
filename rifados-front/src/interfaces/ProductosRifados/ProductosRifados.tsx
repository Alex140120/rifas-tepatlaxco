import { ToastContainer } from "react-toastify";
import Tabla from "../../components/Tables/Tabla";
import { useEffect, useState } from "react";
import { getData, postData } from "../../api/apiRequest";
import { notifyError, notifySuccess } from "../../components/Alertas/Alertas";
import Spinner from "../../components/Tags/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ModalEditarProducto from "./Complementos/ModalEditarProducto";

interface ColumnasI {
  field: string | number | boolean;
  header: string | number | boolean;
}

interface FilasI {
  id: number;
  nombre: string;
  descripcion: string;
  status: number;
  rangoInicial: number;
  rangoFinal: number;
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
    { field: "statusRifa", header: "En Rifa" },
    { field: "rangoInicial", header: "Rango Inicial Boletos" },
    { field: "rangoFinal", header: "Rango Final Boletos" },
    { field: "nombreUser", header: "Subido por" },
    { field: "acciones", header: "" },
  ];

  const [filas, setFilas] = useState<FilasI[]>([]);

  const [dom, setDom] = useState<Record<string, string>>({});

  const [show, setShow] = useState<boolean>(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [productoSeleccionado, setProductoSeleccionado] =
    useState<FilasI | null>(null);

  const renderColumnContent = (field: string, rowData: FilasI) => {
    if (field === "statusRifa") {
      return (
        <div className="w-100 d-flex justify-content-center">
          <button
            className={`btn-warning-rifas p-1 rounded-1 text-light t4 d-block px-3 py-0 ${
              dom[`rifa0-${rowData.id}`] ?? "d-none"
            }`}
            onClick={() => {
              handlePonerEnRifa(rowData.id, rowData.status);
            }}
          >
            Finalizado
          </button>
          <button
            className={`btn-success-rifas p-1 rounded-1 text-light t4 d-block px-3 py-0 ${
              dom[`rifa1-${rowData.id}`] ?? "d-none"
            }`}
            onClick={() => {
              handleFinalizarRifa(rowData.id, rowData.status);
            }}
          >
            Rifado
          </button>
        </div>
      );
    } else if (field === "acciones") {
      return (
        <>
          {rowData.status === 0 ? (
            <div className="d-flex justify-content-center">
              <button
                className="btn-edit border rounded-1 t4 me-1"
                onClick={() => {
                  setProductoSeleccionado(rowData);
                  handleShow();
                }}
              >
                <FontAwesomeIcon icon={faPencil} />
              </button>
              <button
                className={`btn-delete border rounded-1 t4`}
                onClick={() => {
                  handleEliminarProducto(rowData.id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ) : null}
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

  // Manipulación de DOM
  useEffect(() => {
    if (filas.length) {
      filas.forEach((rowData) => {
        // si esta finalizado
        if (rowData.status == 0) {
          setDom((prevDom) => ({
            ...prevDom,
            [`rifa1-${rowData.id}`]: "d-none",
            [`rifa0-${rowData.id}`]: "d-block",
          }));
        }
        // si esta En Rifa
        if (rowData.status == 1) {
          setDom((prevDom) => ({
            ...prevDom,
            [`rifa0-${rowData.id}`]: "d-none",
            [`rifa1-${rowData.id}`]: "d-block",
          }));
        }
      });
    }
  }, [filas]);

  const productosRegistrados = async () => {
    try {
      const response = await getData<ResponseI>("productosRegistrados", null);
      const { status, data } = response;
      //console.log(data);
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

  const handlePonerEnRifa = async (
    idProducto: number,
    statusProducto: number
  ) => {
    const filasNuevas = filas.filter((item) => item.id !== idProducto);
    // Buscar si un producto esta en rifa
    const objRifa = filasNuevas.find((item) => item.status === 1);
    // Si existe, mandar alerta
    if (objRifa) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Actualmente existe un producto en rifa, primero Finalice y vuelva a intentar.",
        confirmButtonColor: "#05C7A7",
        confirmButtonText: "Cerrar",
      });
      return null;
    }

    // Ocultar Boton Finalizado
    setDom((prevDom) => ({
      ...prevDom,
      [`rifa0-${idProducto}`]: "d-none",
    }));

    try {
      const datos = { idProducto, statusProducto };
      //console.log(datos);

      const response = await postData("actualizarEstadoProducto", datos);
      const { status } = response;
      if (status === 200) {
        // cambiar el status del producto en Filas
        setFilas((prevFilas) => {
          const producto = prevFilas.find(
            (producto) => producto.id === idProducto
          );
          if (producto) {
            producto.status = 1; // Cambiar el status
          }
          return [...prevFilas]; // Retornar el nuevo array
        });

        //console.log(data);
        setDom((prevDom) => ({
          ...prevDom,
          [`rifa1-${idProducto}`]: "d-block",
        }));
      }
    } catch (error: any) {
      if (error.response) {
        // Si hay un error mostrar el boton de Finalizar
        // Mostrar Boton Finalizado
        setDom((prevDom) => ({
          ...prevDom,
          [`rifa0-${idProducto}`]: "d-block",
        }));
        notifyError("Algo salió mal, inténtalo nuevamente.", "top-center");
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

  const handleFinalizarRifa = (idProducto: number, statusProducto: number) => {
    if (statusProducto === 1) {
      Swal.fire({
        title: "¡Producto Rifado!",
        text: "¿Estás seguro de querer finalizar la rifa?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "Cerrar",
        confirmButtonColor: "#05C7A7",
        confirmButtonText: "Finalizar",
      }).then((result) => {
        if (result.isConfirmed) {
          ejecutarFinalizarRifa(idProducto, statusProducto);
        }
      });
    }
  };

  const ejecutarFinalizarRifa = async (
    idProducto: number,
    statusProducto: number
  ) => {
    const datos = { idProducto, statusProducto };

    // Ocultar Boton Rifado
    setDom((prevDom) => ({
      ...prevDom,
      [`rifa1-${idProducto}`]: "d-none",
    }));

    try {
      const response = await postData("actualizarEstadoProducto", datos);
      const { status } = response;
      if (status === 200) {
        // cambiar el status del producto en Filas
        setFilas((prevFilas) => {
          const producto = prevFilas.find(
            (producto) => producto.id === idProducto
          );
          if (producto) {
            producto.status = 0; // Cambiar el status
          }
          return [...prevFilas]; // Retornar el nuevo array
        });

        //console.log(data);
        setDom((prevDom) => ({
          ...prevDom,
          [`rifa0-${idProducto}`]: "d-block",
        }));
      }
    } catch (error: any) {
      if (error.response) {
        // Si hay un error mostrar el boton de Finalizar
        // Mostrar Boton Rifado
        setDom((prevDom) => ({
          ...prevDom,
          [`rifa1-${idProducto}`]: "d-block",
        }));
        notifyError("Algo salió mal, inténtalo nuevamente.", "top-center");
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

  const handleEliminarProducto = (idProducto: number) => {
    Swal.fire({
      title: "",
      text: "¿Estás seguro de eliminar permanentemente el producto?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cerrar",
      confirmButtonColor: "#05C7A7",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        ejecutarEliminacionRifa(idProducto);
      }
    });
  };

  const ejecutarEliminacionRifa = async (idProducto: number) => {
    try {
      const response = await postData("eliminarProducto", { idProducto });
      const { status } = response;
      if (status === 200) {
        const nuevosProductos = filas.filter((item) => item.id !== idProducto);
        setFilas(nuevosProductos);
        notifySuccess("Producto eliminado exitosamente.", "top-center");
      }
    } catch (error: any) {
      if (error.response) {
        notifyError("No se pudo eliminar, inténtalo nuevamente.", "top-center");
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

  const actualizarTablaDatos = (retorno: boolean) => {
    if (retorno) {
      productosRegistrados();
    }
  };

  return (
    <div className="container-modulo px-3 py-2 rounded-3">
      <h2>Productos Rifados</h2>
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
      <ModalEditarProducto
        show={show}
        handleClose={handleClose}
        productoSeleccionado={productoSeleccionado}
        actualizar={(valor) => actualizarTablaDatos(valor)}
      />
    </div>
  );
}

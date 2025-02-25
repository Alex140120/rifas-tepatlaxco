import { Modal } from "react-bootstrap";
import InputText from "../../../components/Tags/InputText";
import TextArea from "../../../components/Tags/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {
  notifyError,
  notifySuccess,
} from "../../../components/Alertas/Alertas";
import { postData } from "../../../api/apiRequest";

interface ImagenesI {
  idimage: number;
  ruta: string;
  nombrearchivo: string;
}

interface FilasI {
  id: number;
  nombre: string;
  descripcion: string;
  status: number;
  boletos: number;
  nombreUser: string;
  [key: string]: any; // Firma de índice añadida
  imagenes: ImagenesI[];
}

interface Props {
  show: boolean;
  handleClose: () => void;
  productoSeleccionado: FilasI | null;
  actualizar: (retorno: boolean) => void;
}

export default function ModalEditarProducto({
  show,
  handleClose,
  productoSeleccionado,
  actualizar,
}: Props) {
  const [nombreProducto, setNombreProducto] = useState<string>("");

  const [descripcionProducto, setDescripcionProducto] = useState<string>("");
  const [archivos, setArchivos] = useState<ImagenesI[]>([]);
  const [cantidadBoletos, setCantidadBoletos] = useState<string>("");

  const [rutaImagen, setRutaImagen] = useState<string>("");

  useEffect(() => {
    if (show) {
      console.log(productoSeleccionado);
      if (productoSeleccionado) {
        setNombreProducto(productoSeleccionado.nombre);
        setDescripcionProducto(productoSeleccionado.descripcion);
        setArchivos(productoSeleccionado.imagenes);
        setCantidadBoletos(productoSeleccionado.boletos.toString());
      }
    } else {
      setNombreProducto("");
      setDescripcionProducto("");
      setCantidadBoletos("");
      setRutaImagen("");
    }
  }, [show]);

  const handleGuardarCambios = async () => {
    const datos = {
      idProducto: productoSeleccionado?.id,
      nombreProducto,
      descripcionProducto,
      cantidadBoletos,
    };
    console.log(datos);
    try {
      const response = await postData("modificarProducto", datos);
      const { status } = response;
      if (status === 200) {
        actualizar(true);
        notifySuccess("Producto modificado.", "top-center");
        setTimeout(() => {
          handleClose();
        }, 350);
      }
    } catch (error: any) {
      if (error.response) {
        notifyError(
          "No se pudo modificar, inténtalo nuevamente.",
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
    }
  };

  const eliminarArchivo = async (idimage: number) => {
    const nuevosArchivos = archivos.filter((item) => item.idimage !== idimage);
    setArchivos(nuevosArchivos);

    console.log(idimage);
  };

  const RecortarTexto = (texto: string, limite: number) => {
    // Recortar el texto a la longitud deseada y agregar '...' si es más largo
    const textoRecortado =
      texto.length > limite ? texto.substring(0, limite) + "..." : texto;

    return textoRecortado;
  };

  const vistaPreviaImagen = (ruta: string) => {
    console.log(ruta);
    setRutaImagen(ruta);
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span className="text-grey">Editar Producto</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100">
            {rutaImagen === "" ? (
              <div>
                <div className="w-100">
                  <InputText
                    disabled={false}
                    placeHolder="Nombre del Producto"
                    valor={nombreProducto}
                    tipoValor="texto"
                    onChange={(e) => setNombreProducto(e)}
                  />
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                  <TextArea
                    disabled={false}
                    placeHolder="Descripción del producto"
                    valor={descripcionProducto}
                    onChange={(e) => setDescripcionProducto(e.target.value)}
                  />
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12">
                  {archivos.length > 0 ? (
                    <div className="mt-0">
                      <table className="t3 files-table">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Nombre</th>
                            <th></th>
                            <th className="text-center">Eliminar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {archivos.map((file, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <span className="t3 p-0">
                                  {RecortarTexto(file.nombrearchivo, 20)}
                                </span>
                              </td>
                              <td>
                                <a
                                  className="text-primary"
                                  style={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() => vistaPreviaImagen(file.ruta)}
                                >
                                  Vista previa
                                </a>
                              </td>
                              <td>
                                <div className="w-100 d-flex">
                                  <button
                                    className="btn-danger-rifas m-auto rounded-1 t5 text-light"
                                    onClick={() => {
                                      eliminarArchivo(file.idimage);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="w-100 mt-2">
                      <span className="t3">No hay archivos almacenados</span>
                    </div>
                  )}
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                  <InputText
                    disabled={false}
                    placeHolder="Cantidad de Boletos"
                    valor={cantidadBoletos}
                    tipoValor="numero"
                    onChange={(valor) => setCantidadBoletos(valor)}
                  />
                </div>

                <div className="w-100 d-flex justify-content-center align-items-center mt-3">
                  <button
                    className="t3 btn-primary-rifas border rounded-2 p-2 text-light"
                    disabled={false}
                    onClick={() => {
                      handleGuardarCambios();
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    Guardar Cambios
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <img src={rutaImagen} className="w-100" />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-center align-items-center mt-3">
            {rutaImagen !== "" ? (
              <button
                className="bg-light rounded-1 text-dark border t3 p-2 me-3"
                onClick={() => setRutaImagen("")}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft} className="me-1" />
                Atrás
              </button>
            ) : null}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

import { Modal } from "react-bootstrap";
import InputText from "../../../components/Tags/InputText";
import TextArea from "../../../components/Tags/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faFolderOpen,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {
  notifyError,
  notifySuccess,
} from "../../../components/Alertas/Alertas";
import { getData, postData } from "../../../api/apiRequest";
import Spinner from "../../../components/Tags/Spinner";
import Swal from "sweetalert2";

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
}

interface ArchivosResponseI {
  files: ImagenesI[];
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
  const [carga, setCarga] = useState<boolean>(false);

  const [nombreProducto, setNombreProducto] = useState<string>("");

  const [descripcionProducto, setDescripcionProducto] = useState<string>("");
  const [archivos, setArchivos] = useState<ImagenesI[]>([]);
  const [cantidadBoletos, setCantidadBoletos] = useState<string>("");

  const [rutaImagen, setRutaImagen] = useState<string>("");

  const [arrayNombreArchivos, setArrayNombreArchivos] = useState<string[]>([]);
  const [arrayArchivos, setArrayArchivos] = useState<File[]>([]);

  useEffect(() => {
    if (show) {
      //console.log(productoSeleccionado);
      if (productoSeleccionado) {
        extraerArchivos(productoSeleccionado.id);
        setNombreProducto(productoSeleccionado.nombre);
        setDescripcionProducto(productoSeleccionado.descripcion);
        setCantidadBoletos(productoSeleccionado.boletos.toString());
      }
    } else {
      setCarga(false);
      setNombreProducto("");
      setDescripcionProducto("");
      setCantidadBoletos("");
      setRutaImagen("");
      setArchivos([]);
      setArrayArchivos([]);
      setArrayNombreArchivos([]);
    }
  }, [show]);

  const extraerArchivos = async (idProducto: number) => {
    try {
      const response = await getData<ArchivosResponseI>(
        "extraerArchivosProducto",
        { idProducto }
      );
      const { status, data } = response;
      if (status === 200) {
        setArchivos(data.files);
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

  const eliminarImagenDB = async (idimage: number, nombreArchivo: string) => {
    try {
      const response = await postData("eliminarImagenProducto", {
        idimage,
        nombreArchivo,
      });
      const { status, data } = response;
      if (status === 200) {
        const nuevosArchivos = archivos.filter(
          (item) => item.idimage !== idimage
        );
        setArchivos(nuevosArchivos);
      }
    } catch (error: any) {
      if (error.response) {
        notifyError(
          "No se pudo eliminar la imágen, inténtalo nuevamente.",
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

  const RecortarTexto = (texto: string, limite: number) => {
    // Recortar el texto a la longitud deseada y agregar '...' si es más largo
    const textoRecortado =
      texto.length > limite ? texto.substring(0, limite) + "..." : texto;

    return textoRecortado;
  };

  const vistaPreviaImagen = (ruta: string) => {
    setRutaImagen(ruta);
  };

  // Selección de archivos (agregar nombre, agregar archivos)
  const handleSelecionarArchivos = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Convertir el FileList a un array y extraer los nombres de los archivos
    const archivosSeleccionados: FileList | null = e.target.files;
    if (!archivosSeleccionados) return;

    for (let i = 0; i < archivosSeleccionados.length; i++) {
      // Archivo por archivo
      const archivo = archivosSeleccionados[i];
      // Verifica la extenxión del archivo
      const extensionValida = validarExtension(archivo.name);
      // Verifica el tamañan
      const tamanoValido = validarTamano(archivo);

      // Verifica si contiene extensión válida
      if (extensionValida) {
        // Verifica el tamaño del archivo seleccionado
        if (tamanoValido) {
          // Agregar unicamente los nombres de los archivos
          const nombresArchivos = Array.from(archivosSeleccionados).map(
            (file) => file.name
          );
          // Agrega el archivo en general
          const archivos = Array.from(archivosSeleccionados).map(
            (file) => file
          );

          // Si hay más de 1 agrega uno por uno
          if (nombresArchivos.length > 1) {
            // Ingresa los nombre de los archivos al arreglo correspondiente
            setArrayNombreArchivos([
              ...arrayNombreArchivos,
              ...nombresArchivos,
            ]);

            // Agregra los archivo al arreglo correspondiente
            setArrayArchivos([...arrayArchivos, ...archivos]);
          } else {
            // Agrega el nombre del único archivo
            setArrayNombreArchivos([
              ...arrayNombreArchivos,
              nombresArchivos[0],
            ]);

            // Agrega el único archivo
            setArrayArchivos([...arrayArchivos, archivos[0]]);
          }
        }
        // Fallo de tamaño excedido
        else {
          Swal.fire({
            title: "¡Error!",
            html: `Lo sentimos, el archivo ${archivo.name} es demasiado grande. <br/><br/>Tamaño máximo admitido: 5 MB `,
            icon: "error",
            showConfirmButton: true,
          });
        }
      }
      // incompatibilidade de extensión
      else {
        Swal.fire({
          title: "¡Error!",
          html: `El archivo seleccionado tiene una extensión inválida [${archivo.name}]. <br/><br/> Las extensiones válidas son: <br/> <strong> .jpg, .png, .jpeg, .pdf, .xls, .doc, .ppt, .txt, .zip, .xlsx, .docx, .pptx, .xps, .odt, .dotx, .pptm </strong>`,
          icon: "error",
          showConfirmButton: true,
        });
      }
    }
  };

  // Función para validar la extensión de los archivos
  const validarExtension = (nombreArchivo: string) => {
    // Define las extensiones permitidas en un array
    const extensionesPermitidas = [
      ".jpg",
      ".png",
      ".jpeg",
      ".pdf",
      ".xls",
      ".doc",
      ".ppt",
      ".txt",
      ".zip",
      ".xlsx",
      ".docx",
      ".pptx",
      ".xps",
      ".odt",
      ".dotx",
      ".pptm",
    ];
    // Obtiene la extensión del archivo (lo que está después del último punto)
    const extension = nombreArchivo.substring(nombreArchivo.lastIndexOf("."));

    // Verifica si la extensión está en el array de extensiones permitidas
    return extensionesPermitidas.includes(extension.toLowerCase());
  };

  // Función para validar el tamaño de los archivos (en bytes)
  const validarTamano = (file: any) => {
    const tamañoLimite = 5242880; // 5 MB en bytes
    return file.size <= tamañoLimite;
  };

  // Eliminar archivos del arreglo
  const eliminarArchivo = (index: number) => {
    // Crea una copia del arreglo actual
    const arrayActualizado = [...arrayNombreArchivos];
    const arrayArchivosActualizado = [...arrayArchivos];

    // Elimina el registro en el índice proporcionado
    arrayActualizado.splice(index, 1);
    arrayArchivosActualizado.splice(index, 1);

    // Actualiza el estado con el nuevo arreglo
    setArrayNombreArchivos(arrayActualizado);
    setArrayArchivos(arrayArchivosActualizado);
  };

  const handleGuardarCambios = async () => {
    const formData = new FormData();

    const idProducto = productoSeleccionado?.id;

    if (idProducto !== undefined) {
      formData.append("idProducto", idProducto.toString());
      formData.append("nombreProducto", nombreProducto);
      formData.append("descripcionProducto", descripcionProducto);
      formData.append("cantidadBoletos", cantidadBoletos);
      for (let i = 0; i < arrayArchivos.length; i++) {
        formData.append("archivos[]", arrayArchivos[i]);
      }

      try {
        const response = await postData("modificarProducto", formData);
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
    }
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
          {carga ? (
            <div className="w-100 expand-animation">
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

                  <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                    <div>
                      <label
                        className="text-grey w-100 text-center button-add-files rounded-top-2 mt-2"
                        htmlFor="src-file1"
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon
                          icon={faFolderOpen}
                          className="me-2 t3"
                        />
                        <span className="t3">Agregar Imágenes</span>
                      </label>
                      <input
                        type="file"
                        name="src-file1"
                        id="src-file1"
                        multiple
                        disabled={false}
                        className="d-none"
                        aria-label="Archivo"
                        accept={".jpg, .png, .jpeg"}
                        onChange={handleSelecionarArchivos}
                      />
                    </div>

                    {archivos.length > 0 ? (
                      <div className="mt-0">
                        <table className="t3 files-table">
                          <thead>
                            <tr>
                              <th style={{ width: "10%" }}>No.</th>
                              <th style={{ width: "50%" }}>Nombre</th>
                              <th style={{ width: "25%" }}></th>
                              <th
                                style={{ width: "15%" }}
                                className="text-center"
                              >
                                Eliminar
                              </th>
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
                                    onClick={() => {
                                      vistaPreviaImagen(file.ruta);
                                    }}
                                  >
                                    Vista previa
                                  </a>
                                </td>
                                <td>
                                  <div className="w-100 d-flex">
                                    <button
                                      className="btn-danger-rifas m-auto rounded-1 t5 text-light"
                                      onClick={() => {
                                        eliminarImagenDB(
                                          file.idimage,
                                          file.nombrearchivo
                                        );
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
                    ) : null}
                    {arrayNombreArchivos.length > 0 ? (
                      <>
                        <div className="w-100 mt-3 mb-2 text-center border-top p-1">
                          <span>Nuevo Archivos</span>
                        </div>
                        <div className="mt-0">
                          <table className="t3 files-table">
                            <tbody>
                              {arrayNombreArchivos.map((file, index) => (
                                <tr key={index}>
                                  <td style={{ width: "10%" }}>
                                    {index + (archivos.length + 1)}
                                  </td>
                                  <td style={{ width: "50%" }}>{file}</td>
                                  <td style={{ width: "25%" }}></td>
                                  <td style={{ width: "15%" }}>
                                    <div className="w-100 d-flex">
                                      <button
                                        className="btn-danger-rifas m-auto rounded-1 t5"
                                        onClick={() => {
                                          eliminarArchivo(index);
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
                      </>
                    ) : null}
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
                <div className="expand-animation w-100">
                  <img src={rutaImagen} className="w-100 rounded-2" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-100 text-center">
              <Spinner />
            </div>
          )}
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

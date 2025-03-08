import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import InputText from "../../../components/Tags/InputText";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { postData } from "../../../api/apiRequest";
import {
  notifyError,
  notifySuccess,
} from "../../../components/Alertas/Alertas";

interface Props {
  show: boolean;
  handleClose: () => void;
  actualizarBancos: (valor: boolean) => void;
}

export default function ModalAgregarBanco({ show, handleClose, actualizarBancos }: Props) {
  const [nombreBanco, setNombreBanco] = useState<string>("");

  const [disBtnAddFiles, setDisBtnAddFiles] = useState<boolean>(true);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState<string>("");

  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);

  // Selección de archivos (agregar nombre, agregar archivos)
  const handleSelecionarArchivos = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Obtener el archivo seleccionado (únicamente uno)
    const archivoSeleccionado = e.target.files ? e.target.files[0] : null;

    if (!archivoSeleccionado) return;

    // Verifica la extensión del archivo
    const extensionValida = validarExtension(archivoSeleccionado.name);

    // Verifica el tamaño del archivo
    const tamanoValido = validarTamano(archivoSeleccionado);

    // Si la extensión es válida
    if (extensionValida) {
      // Verifica si el tamaño es válido
      if (tamanoValido) {
        // Agregar el nombre del archivo seleccionado
        setNombreArchivo(archivoSeleccionado.name);

        // Agregar el archivo seleccionado
        setArchivo(archivoSeleccionado);
      } else {
        // Si el archivo es demasiado grande
        Swal.fire({
          title: "¡Error!",
          html: `Lo sentimos, el archivo ${archivoSeleccionado.name} es demasiado grande. <br/><br/>Tamaño máximo admitido: 5 MB `,
          icon: "error",
          showConfirmButton: true,
        });
      }
    } else {
      // Si la extensión no es válida
      Swal.fire({
        title: "¡Error!",
        html: `El archivo seleccionado tiene una extensión inválida [${archivoSeleccionado.name}]. <br/><br/> Las extensiones válidas son: <br/> <strong> .jpg, .png, .jpeg, .pdf, .xls, .doc, .ppt, .txt, .zip, .xlsx, .docx, .pptx, .xps, .odt, .dotx, .pptm </strong>`,
        icon: "error",
        showConfirmButton: true,
      });
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
  const eliminarArchivo = () => {
    setNombreArchivo("");
    setArchivo(null);
  };

  // Inicial
  useEffect(() => {
    if (!show) {
      setNombreBanco("");
    }
  }, [show]);

  // onChange Nombre Banco
  useEffect(() => {
    if (nombreBanco) {
      setDisBtnAddFiles(false);
    } else {
      setDisBtnAddFiles(true);
      setNombreArchivo("");
      setArchivo(null);
    }
  }, [nombreBanco]);

  // onChange Files
  useEffect(() => {
    if (nombreArchivo && archivo !== null) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  }, [nombreArchivo, archivo]);

  const guardarBanco = async () => {
    if (archivo !== null) {
      const formData = new FormData();

      formData.append("nombreBanco", nombreBanco);
      formData.append("archivo", archivo);

      try {
        const response = await postData("guardarNuevoBanco", formData);

        const { status } = response;

        //console.log(response.data);

        if (status === 200) {
          notifySuccess(
            "El producto se ha guardado exitosamente.",
            "top-center"
          );
          setNombreBanco("");
          setArchivo(null);
          setNombreArchivo("");
          actualizarBancos(true);

          setTimeout(() => {
            handleClose();
          }, 500);
        }
      } catch (error: any) {
        if (error.response) {
          // obtener el status y los datos de la respuesta
          const { status, data } = error.response;
          console.log(`status: ${status} | error: `, data.error);

          notifyError("Hubo un error al guardar el producto.", "top-center");
        } else {
          // Si no hay `response` (error de red u otro problema)
          console.log("Error de red o configuración:", error.message);
          notifyError(
            "Ocurrió un problema al comunicarse con el servidor",
            "top-center"
          );
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
            <span className="text-grey">Agregar Banco</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div className="w-100">
              <InputText
                disabled={false}
                placeHolder="Nombre Banco"
                tipoValor="string"
                valor={nombreBanco}
                onChange={(valor) => setNombreBanco(valor)}
              />
            </div>

            <div className="w-100">
              <div>
                <label
                  className="text-grey w-100 text-center button-add-files rounded-top-2 mt-2"
                  htmlFor="src-file1"
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faFolderOpen} className="me-2 t3" />
                  <span className="t3">Seleccionar Archivos</span>
                </label>
                <input
                  type="file"
                  name="src-file1"
                  id="src-file1"
                  multiple={false}
                  disabled={disBtnAddFiles}
                  className="d-none"
                  aria-label="Archivo"
                  accept={".jpg, .png, .jpeg"}
                  onChange={handleSelecionarArchivos}
                />
              </div>
              {nombreArchivo && archivo !== null ? (
                <div className="mt-0">
                  <table className="t3 files-table">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Nombre</th>
                        <th className="text-center">Eliminar</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>{nombreArchivo}</td>
                        <td>
                          <div className="w-100 d-flex">
                            <button
                              className="btn-danger-rifas m-auto rounded-1 t5 text-light"
                              onClick={() => {
                                eliminarArchivo();
                              }}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn-primary-rifas  text-light rounded-2 mt-2 py-1 px-2 outline-none m-auto"
            disabled={disabledBtn}
            onClick={() => guardarBanco()}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

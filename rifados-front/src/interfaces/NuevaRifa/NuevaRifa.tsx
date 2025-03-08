import { useEffect, useState } from "react";
import InputText from "../../components/Tags/InputText";
import TextArea from "../../components/Tags/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { postData } from "../../api/apiRequest";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "../../components/Alertas/Alertas";
import Alerta from "../../components/Alertas/Alerta";

interface ResponseI {
  output: boolean;
}

export default function NuevaRifa() {
  const [nombreProducto, setNombreProducto] = useState<string>("");

  const [descripcionProducto, setDescripcionProducto] = useState<string>("");
  const [disDescripcionProducto, setDisDescripcionProducto] =
    useState<boolean>(true);

  const [disBtnAddFiles, setDisBtnAddFiles] = useState<boolean>(true);
  const [arrayNombreArchivos, setArrayNombreArchivos] = useState<string[]>([]);
  const [arrayArchivos, setArrayArchivos] = useState<File[]>([]);

  const [disabled, setDisabled] = useState<boolean>(true);

  const [rangoInicialBoletos, setRangoInicialBoletos] = useState<number>(1);
  const [disRangoInicial, setDisRangoInicial] = useState<boolean>(true);

  const [rangoFinalBoletos, setRangoFinalBoletos] = useState<number>(2);
  const [disRangoFinal, setDisRangoFinal] = useState<boolean>(true);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showAlert2, setShowAlert2] = useState<boolean>(false);

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

  // onChange Nombre Producto
  useEffect(() => {
    if (nombreProducto) {
      setDisDescripcionProducto(false);
    } else {
      setDisDescripcionProducto(true);
      setDescripcionProducto("");
    }
  }, [nombreProducto]);

  // onChange Nombre Producto
  useEffect(() => {
    if (descripcionProducto) {
      setDisRangoInicial(false);
      setDisRangoFinal(false);
    } else {
      setDisRangoInicial(true);
      setDisRangoFinal(true);

      setRangoInicialBoletos(0);
      setRangoFinalBoletos(0);
    }
  }, [descripcionProducto]);

  // onChange Rango Inicial y Final
  useEffect(() => {
    if (
      rangoInicialBoletos !== 0 &&
      rangoInicialBoletos !== null &&
      rangoFinalBoletos !== 0 &&
      rangoFinalBoletos !== null
    ) {
      if (showAlert || showAlert2) {
        setDisBtnAddFiles(true);
      } else {
        setDisBtnAddFiles(false);
      }
    } else {
      setDisBtnAddFiles(true);
      setArrayArchivos([]);
      setArrayNombreArchivos([]);
    }
  }, [rangoInicialBoletos, rangoFinalBoletos, showAlert, showAlert2]);

  // onChange Files
  useEffect(() => {
    if (arrayNombreArchivos.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [arrayNombreArchivos]);

  const handleGuardarNuevaRifa = async () => {
    const formData = new FormData();

    formData.append("nombreProducto", nombreProducto);
    formData.append("descripcionProducto", descripcionProducto);
    formData.append("rangoInicial", rangoInicialBoletos.toString());
    formData.append("rangoFinal", rangoFinalBoletos.toString());
    for (let i = 0; i < arrayArchivos.length; i++) {
      formData.append("archivos[]", arrayArchivos[i]);
    }

    try {
      const response = await postData<ResponseI>("guardarNuevaRifa", formData);

      const { status } = response;

      console.log(response);

      if (status === 200) {
        notifySuccess("El producto se ha guardado exitosamente.", "top-center");
        setNombreProducto("");
        setDescripcionProducto("");
        setArrayArchivos([]);
        setRangoInicialBoletos(1);
        setRangoFinalBoletos(2);
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
  };

  return (
    <div className="container-modulo px-3 py-2 rounded-3">
      <h2>Nueva Rifa</h2>
      <hr />
      <div className="w-100">
        {showAlert ? (
          <div className="w-100 mb-3">
            <Alerta
              header="¡Atención!"
              body="Es obligatorio llenar todos los campos."
              clases="alerta-danger expand-animation"
            />
          </div>
        ) : null}

        {showAlert2 ? (
          <div className="w-100 mb-3">
            <Alerta
              header="¡Atención!"
              body="El rango final debe ser mayor al rango inicial."
              clases="alerta-danger expand-animation"
            />
          </div>
        ) : null}

        <div className="row pb-3">
          <div className="col-lg-6 col-md-6 col-sm-12">
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
              disabled={disDescripcionProducto}
              placeHolder="Descripción del producto"
              valor={descripcionProducto}
              onChange={(e) => setDescripcionProducto(e.target.value)}
            />
          </div>

          <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-xs-12">
                <div className="t4 mb-2">Rango incial boletos: </div>
                <InputText
                  disabled={disRangoInicial}
                  placeHolder="Rango inicial"
                  valor={rangoInicialBoletos}
                  tipoValor="numero"
                  onChange={(valor) => {
                    setRangoInicialBoletos(valor);
                    setShowAlert(!valor ? true : false);
                    setShowAlert2(
                      parseInt(valor) > rangoFinalBoletos ? true : false
                    );
                  }}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-xs-12">
                <div className="t4 mb-2">Rango final boletos: </div>
                <InputText
                  disabled={disRangoFinal}
                  placeHolder="Rango final"
                  valor={rangoFinalBoletos}
                  tipoValor="numero"
                  onChange={(valor) => {
                    setRangoFinalBoletos(valor);
                    setShowAlert(!valor ? true : false);
                    setShowAlert2(
                      parseInt(valor) < rangoInicialBoletos ? true : false
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-12 col-md-12 col-sm-12">
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
                multiple
                disabled={disBtnAddFiles}
                className="d-none"
                aria-label="Archivo"
                accept={".jpg, .png, .jpeg"}
                onChange={handleSelecionarArchivos}
              />
            </div>
            {arrayNombreArchivos.length > 0 ? (
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
                    {arrayNombreArchivos.map((file, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{file}</td>
                        <td>
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
            ) : null}
          </div>

          <div className="w-100 d-flex justify-content-center align-items-center mt-3">
            <button
              className="t1 btn-aside border rounded-2 p-2"
              disabled={disabled}
              onClick={() => {
                handleGuardarNuevaRifa();
              }}
            >
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Guardar Rifa
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

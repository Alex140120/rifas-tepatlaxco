import { useEffect, useState } from "react";
import InputText from "../../components/Tags/InputText";
import TextArea from "../../components/Tags/TextArea";
//import instance from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function NuevaRifa() {
  const [nombreProducto, setNombreProducto] = useState<string>("");

  const [descripcionProducto, setDescripcionProducto] = useState<string>("");
  const [disDescripcionProducto, setDisDescripcionProducto] =
    useState<boolean>(true);

  const [disBtnAddFiles, setDisBtnAddFiles] = useState<boolean>(true);
  const [arrayNombreArchivos, setArrayNombreArchivos] = useState<string[]>([]);
  const [arrayArchivos, setArrayArchivos] = useState<File[]>([]);

  const [disabled, setDisabled] = useState<boolean>(true);

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
    }
    else {
      setDisDescripcionProducto(true);
      setDescripcionProducto("");
    }
  }, [nombreProducto]);

  // onChange Nombre Producto
  useEffect(() => {
    if (descripcionProducto) {
      setDisBtnAddFiles(false);
    }
    else {
      setDisBtnAddFiles(true);
      setArrayArchivos([]);
      setArrayNombreArchivos([]);
    }
  }, [descripcionProducto]);

  // onChange Files
  useEffect(() => {
    if (arrayNombreArchivos.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [arrayNombreArchivos]);

  return (
    <div>
      <h2>Nueva Rifa</h2>
      <hr />
      <div className="w-100">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <InputText
              disabled={false}
              placeHolder="Nombre del Producto"
              valor={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
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
                <table className="t2 files-table">
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
                        <td className="d-flex justify-content-center">
                          <button
                            className="button-delete-file"
                            onClick={() => {
                              eliminarArchivo(index);
                            }}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
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
              className="t1 btn-aside border rounded-2 p-3"
              disabled={disabled}
              onClick={() => {
                //handleGuardarRifa()
              }}
            >
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Guardar Rifa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

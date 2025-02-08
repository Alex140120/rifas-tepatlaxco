import { faFolderOpen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Swal from "sweetalert2";

interface Props {
  onFormDataReady: (formData: FormData) => void;
  extensiones: string;
}

export default function InputFilesMultiple({
  extensiones
}: Props) {
  const [arrayNombreArchivos, setArrayNombreArchivos] = useState<string[]>([]);
  const [arrayArchivos, setArrayArchivos] = useState<File[]>([]);
  const [inputTextArchivo, setInputTextArchivo] = useState<string | string[]>(
    []
  );

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

            setInputTextArchivo(nombresArchivos); // Ingresa los nombres al input

            // Agregra los archivo al arreglo correspondiente
            setArrayArchivos([...arrayArchivos, ...archivos]);
          } else {
            // Agrega el nombre del único archivo
            setArrayNombreArchivos([
              ...arrayNombreArchivos,
              nombresArchivos[0],
            ]);
            setInputTextArchivo(nombresArchivos[0]); // Asigna el nombre del archivo

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

  return (
    <div>
      <div className="mt-3 border-container-tipo-usuario w-100 rounded-2">
        <div className="rounded-top-2 bg-tipo-usuario w-100 p-3">Archivo</div>
        <div className="p-3">
          <input
            type="text"
            className="input-text-left rounded-start-2 bg-grey-claro input-file-text pl-3"
            value={inputTextArchivo}
            disabled
          />
          <label className="file-select pt-1 pb-1" htmlFor="src-file1">
            <FontAwesomeIcon icon={faFolderOpen} className="mr-2" />
            Seleccionar Archivo
            <input
              type="file"
              name="src-file1"
              id="src-file1"
              multiple
              aria-label="Archivo"
              accept={extensiones}
              onChange={handleSelecionarArchivos}
            />
          </label>
        </div>

        {arrayNombreArchivos.length > 0 ? (
          <div className="mt-3 mb-3 d-flex justify-content-center">
            <table className="tabla-archivos-seleccionados">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nombre</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {arrayNombreArchivos.map((file, index) => (
                  <tr key={index}>
                    <td className="td-numero">{index + 1}</td>
                    <td>{file}</td>
                    <td>
                      <button
                        className="btn bg-danger text-light p-0"
                        onClick={() => {
                          //eliminarArchivo(index);
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
    </div>
  );
}

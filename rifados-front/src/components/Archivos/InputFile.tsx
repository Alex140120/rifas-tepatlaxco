import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import Swal from "sweetalert2";

interface Props {
  onFormDataReady: (formData: FormData) => void;
  extensiones: string;
  multiple: boolean;
}

export default function InputFile({ onFormDataReady, extensiones, multiple }: Props) {
  const [nombreArchivo, setNombreArchivo] = useState<string>("");

  const handleSelecionarArchivos = async (e: any) => {
    const archivosSeleccionados = e.target.files;

    if (archivosSeleccionados.length > 0) {
      const formData = new FormData();

      const file = archivosSeleccionados[0];

      const extensionValida = validarExtension(file.name); // Nombre de archivo
      const tamanoValido = validarTamano(file); // Tamaño de archivo

      if (extensionValida) {
        if (tamanoValido) {
          setNombreArchivo(archivosSeleccionados[0].name);

          formData.append("archivo", file);
          // Llama a la función de callback con el FormData
          //console.log("file -> ", file);
          onFormDataReady(formData);
        } else {
          // Fallo de tamaño excedido
          Swal.fire({
            title: "¡Error!",
            html: `Lo sentimos, el archivo ${file.name} es demasiado grande. <br/><br/>Tamaño máximo admitido: 5 MB `,
            icon: "error",
            showConfirmButton: true,
          });
        }
      } else {
        // incompatibilidade de extension
        Swal.fire({
          title: "¡Error!",
          html: `El archivo seleccionado tiene una extensión inválida.`,
          icon: "error",
          showConfirmButton: true,
        });
      }
    }
  };

  // Función para validar la extensión de los archivos
  const validarExtension = (nombreArchivo: string) => {
    // Define las extensiones permitidas en un array
    const extensionesPermitidas = [".pdf", ".jpeg", ".jpg", ".png"];
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
    <div className="w-100 mt-1">
      <div className="p-0 d-flex justify-content-between">
        <input
          value={nombreArchivo}
          type="text"
          disabled
          className="border w-100 rounded-start-1 px-2 t2 bg-light text-grey"
          onChange={() => {}}
        />
        <label
          className="btn text-light h-100 t-3 p-1 m-0 rounded-0 rounded-end-1 flex-shrink-0 px-2 d-flex align-items-center fw-normal t2 btn-secondary"
          htmlFor="fileInput"
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faFolderOpen} className="mr-1" />
          Seleccionar Archivo
        </label>
        <input
          multiple={multiple}
          type="file"
          id="fileInput"
          className="d-none"
          onChange={handleSelecionarArchivos}
          accept={extensiones}
        />
      </div>
    </div>
  );
}

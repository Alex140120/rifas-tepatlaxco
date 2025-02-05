import { useEffect, useState } from "react";
import InputText from "../../components/Tags/InputText";
import TextArea from "../../components/Tags/TextArea";
import InputFile from "../../components/Archivos/InputFile";
import instance from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

export default function NuevaRifa() {
  const [nombreProducto, setNombreProducto] = useState<string>("");
  const [descripcionProducto, setDescripcionProducto] = useState<string>("");

  const [archivoSubido, setArchivoSubido] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(true);

  const handleSubirArchivo = async (formData: FormData) => {
    try {
      const response = await instance.post("/subirArchivo", formData);

      console.log(response.data);
      setArchivoSubido(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  // onChange Nombre Producto
  useEffect(() => {
    if (!nombreProducto) {
      setDisabled(true);
    }
  }, [nombreProducto]);

  // onChange Descripcion Producto
  useEffect(() => {
    if (!descripcionProducto) {
      setDisabled(true);
    }
  }, [descripcionProducto]);

  // onChange Archivo
  useEffect(() => {
    if (!archivoSubido) {
      setDisabled(true);
    }
  }, [archivoSubido]);

  const handleGuardarRifa = async () => {
    console.log("Guardar Rifa");
  };

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
              disabled={false}
              placeHolder="Descripción del producto"
              valor={descripcionProducto}
              onChange={(e) => setDescripcionProducto(e.target.value)}
            />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12">
            <InputFile
              extensiones=".jpg, .jpeg, .png"
              multiple={true}
              onFormDataReady={handleSubirArchivo}
            />
          </div>
          <div className="w-100 d-flex justify-content-center align-items-center mt-3">
            <button
              className="t1 btn-aside border rounded-2 p-3"
              disabled={disabled}
              onClick={() => handleGuardarRifa()}
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

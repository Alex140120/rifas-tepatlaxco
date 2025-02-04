import { useState } from "react";
import InputText from "../../components/Tags/InputText";
import TextArea from "../../components/Tags/TextArea";

export default function NuevaRifa() {
  const [nombreProducto, setNombreProducto] = useState<string>("");
  const [descripcionProducto, setDescripcionProducto] = useState<string>("");

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
        </div>
      </div>
    </div>
  );
}

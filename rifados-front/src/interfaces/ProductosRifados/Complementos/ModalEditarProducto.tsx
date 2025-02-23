import { Modal } from "react-bootstrap";
import InputText from "../../../components/Tags/InputText";
import TextArea from "../../../components/Tags/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface FilasI {
  id: number;
  nombre: string;
  descripcion: string;
  status: number;
  statusRifa: string;
  boletos: number;
  nombreUser: string;
  [key: string]: any; // Firma de índice añadida
}

interface Props {
  show: boolean;
  handleClose: () => void;
  productoSeleccionado: FilasI | null;
}

export default function ModalEditarProducto({
  show,
  handleClose,
  productoSeleccionado,
}: Props) {
  const [nombreProducto, setNombreProducto] = useState<string>("");

  const [descripcionProducto, setDescripcionProducto] = useState<string>("");

  const [cantidadBoletos, setCantidadBoletos] = useState<string>("");

  useEffect(() => {
    if (show) {
      console.log(productoSeleccionado);
      if (productoSeleccionado) {
        setNombreProducto(productoSeleccionado.nombre);
        setDescripcionProducto(productoSeleccionado.descripcion);
        setCantidadBoletos(productoSeleccionado.boletos.toString());
      }
    } else {
      setNombreProducto("");
      setDescripcionProducto("");
      setCantidadBoletos("");
    }
  }, [show]);

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <span className="text-grey">Editar Producto</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100">
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
                aqui van las imagenes
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                <InputText
                  disabled={true}
                  placeHolder="Cantidad de Boletos"
                  valor={cantidadBoletos}
                  tipoValor="numero"
                  onChange={(valor) => setCantidadBoletos(valor)}
                />
              </div>

              <div className="w-100 d-flex justify-content-center align-items-center mt-3">
                <button
                  className="t1 btn-aside border rounded-2 p-2"
                  disabled={false}
                  onClick={() => {
                    //handleGuardarNuevaRifa();
                  }}
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Guardar Rifa
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="border rounded-2 t2 text-grey px-2 py-1 m-auto"
            onClick={handleClose}
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
